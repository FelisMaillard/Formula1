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
    const { username, email, password, firstName, lastName, nationalite_id } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        error: 'Username, email and password are required'
      });
    }

    // Check if user already exists
    const [existingUsers] = await connection.query(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email, username]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        error: 'User with this email or username already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const [result] = await connection.query(
      `INSERT INTO users (username, email, password, first_name, last_name, nationalite_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [username, email, hashedPassword, firstName || null, lastName || null, nationalite_id || null]
    );

    const userId = result.insertId;

    // Assign default role (Fan - type_users_id: 5)
    await connection.query(
      'INSERT INTO users_type_users (users_id, type_users_id) VALUES (?, ?)',
      [userId, 5] // 5 = Fan role
    );

    // Get created user with role
    const [users] = await connection.query(
      `SELECT u.id, u.username, u.email, u.first_name, u.last_name,
              GROUP_CONCAT(tu.type_name) as roles
       FROM users u
       LEFT JOIN users_type_users utu ON u.id = utu.users_id
       LEFT JOIN type_users tu ON utu.type_users_id = tu.id
       WHERE u.id = ?
       GROUP BY u.id`,
      [userId]
    );

    const user = users[0];
    const isAdmin = user.roles && user.roles.includes('Admin');

    const token = generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
      isAdmin
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
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
      `SELECT u.id, u.username, u.email, u.password, u.first_name, u.last_name,
              GROUP_CONCAT(tu.type_name) as roles
       FROM users u
       LEFT JOIN users_type_users utu ON u.id = utu.users_id
       LEFT JOIN type_users tu ON utu.type_users_id = tu.id
       WHERE u.email = ?
       GROUP BY u.id`,
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

    const isAdmin = user.roles && user.roles.includes('Admin');

    const token = generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
      isAdmin
    });

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
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
      `SELECT u.id, u.username, u.email, u.first_name, u.last_name,
              u.created_at, n.country_name,
              GROUP_CONCAT(tu.type_name) as roles
       FROM users u
       LEFT JOIN nationalites n ON u.nationalite_id = n.id
       LEFT JOIN users_type_users utu ON u.id = utu.users_id
       LEFT JOIN type_users tu ON utu.type_users_id = tu.id
       WHERE u.id = ?
       GROUP BY u.id`,
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
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        nationality: user.country_name,
        roles: user.roles,
        isAdmin: user.roles && user.roles.includes('Admin'),
        createdAt: user.created_at
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
