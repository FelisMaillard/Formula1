import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/database.js';

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
      isAdmin: user.isAdmin
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Register new user
export const register = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { email, password, firstName, lastName } = req.body;

    // Validation
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        error: 'Email, password, firstname and lastname are required'
      });
    }

    // Check if user already exists
    const [existingUsers] = await connection.query(
      'SELECT id_user FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        error: 'User with this email already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const [result] = await connection.query(
      `INSERT INTO users (firstname, lastname, email, password, is_admin)
       VALUES (?, ?, ?, ?, ?)`,
      [firstName, lastName, email, hashedPassword, 0]
    );

    const userId = result.insertId;

    // Assign default role (Fan - id_type_user: 5)
    await connection.query(
      'INSERT INTO users_type_users (id_user, id_type_user) VALUES (?, ?)',
      [userId, 5] // 5 = Fan role
    );

    // Get created user with role
    const [users] = await connection.query(
      `SELECT u.id_user, u.firstname, u.lastname, u.email, u.is_admin,
              GROUP_CONCAT(tu.libelle) as roles
       FROM users u
       LEFT JOIN users_type_users utu ON u.id_user = utu.id_user
       LEFT JOIN type_users tu ON utu.id_type_user = tu.id_type_user
       WHERE u.id_user = ?
       GROUP BY u.id_user`,
      [userId]
    );

    const user = users[0];
    const isAdmin = user.is_admin === 1;

    const token = generateToken({
      id: user.id_user,
      email: user.email,
      username: user.email, // Using email as username
      isAdmin
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id_user,
        username: user.email,
        email: user.email,
        firstName: user.firstname,
        lastName: user.lastname,
        roles: user.roles,
        isAdmin
      },
      token
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      error: 'Registration failed',
      details: error.message
    });
  } finally {
    connection.release();
  }
};

// Login user
export const login = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required'
      });
    }

    // Get user with roles
    const [users] = await connection.query(
      `SELECT u.id_user, u.firstname, u.lastname, u.email, u.password, u.is_admin,
              GROUP_CONCAT(tu.libelle) as roles
       FROM users u
       LEFT JOIN users_type_users utu ON u.id_user = utu.id_user
       LEFT JOIN type_users tu ON utu.id_type_user = tu.id_type_user
       WHERE u.email = ?
       GROUP BY u.id_user`,
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    const user = users[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    const isAdmin = user.is_admin === 1;

    const token = generateToken({
      id: user.id_user,
      email: user.email,
      username: user.email, // Using email as username
      isAdmin
    });

    res.json({
      message: 'Login successful',
      user: {
        id: user.id_user,
        username: user.email,
        email: user.email,
        firstName: user.firstname,
        lastName: user.lastname,
        roles: user.roles,
        isAdmin
      },
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed',
      details: error.message
    });
  } finally {
    connection.release();
  }
};

// Get current user profile
export const getProfile = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const [users] = await connection.query(
      `SELECT u.id_user, u.firstname, u.lastname, u.email, u.is_admin,
              GROUP_CONCAT(tu.libelle) as roles
       FROM users u
       LEFT JOIN users_type_users utu ON u.id_user = utu.id_user
       LEFT JOIN type_users tu ON utu.id_type_user = tu.id_type_user
       WHERE u.id_user = ?
       GROUP BY u.id_user`,
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    const user = users[0];

    res.json({
      user: {
        id: user.id_user,
        username: user.email,
        email: user.email,
        firstName: user.firstname,
        lastName: user.lastname,
        roles: user.roles,
        isAdmin: user.is_admin === 1
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      error: 'Failed to get profile',
      details: error.message
    });
  } finally {
    connection.release();
  }
};
