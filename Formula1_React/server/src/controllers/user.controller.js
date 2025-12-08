import { pool } from '../config/database.js';
import bcrypt from 'bcryptjs';

// Get all users with driver information
export const getAllUsers = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const [users] = await connection.query(
      `SELECT 
        u.id_user, 
        u.firstname, 
        u.lastname, 
        u.email, 
        u.is_admin,
        d.id_driver, 
        d.points as driver_points,
        CASE WHEN d.id_driver IS NOT NULL THEN 1 ELSE 0 END as is_driver,
        GROUP_CONCAT(DISTINCT t.libelle) as team_name,
        GROUP_CONCAT(DISTINCT t.id_team) as id_team
       FROM users u
       LEFT JOIN drivers d ON u.id_user = d.id_user
       LEFT JOIN teams_users tu ON u.id_user = tu.id_user
       LEFT JOIN teams t ON tu.id_team = t.id_team
       GROUP BY u.id_user, u.firstname, u.lastname, u.email, u.is_admin, d.id_driver, d.points
       ORDER BY u.id_user DESC`
    );

    res.json({
      users,
      count: users.length
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      error: 'Failed to fetch users',
      details: error.message
    });
  } finally {
    connection.release();
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { id } = req.params;

    const [users] = await connection.query(
      `SELECT 
        u.id_user, u.firstname, u.lastname, u.email, u.is_admin,
        d.id_driver, d.points as driver_points,
        CASE WHEN d.id_driver IS NOT NULL THEN 1 ELSE 0 END as is_driver
       FROM users u
       LEFT JOIN drivers d ON u.id_user = d.id_user
       WHERE u.id_user = ?`,
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    res.json({
      user: users[0]
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      error: 'Failed to fetch user',
      details: error.message
    });
  } finally {
    connection.release();
  }
};

// Create user (with optional driver status)
export const createUser = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const { firstname, lastname, email, password, is_admin, is_driver, driver_points, id_team } = req.body;

    // Validation
    if (!firstname || !lastname || !email || !password) {
      await connection.rollback();
      return res.status(400).json({
        error: 'Firstname, lastname, email and password are required'
      });
    }

    // Check if user already exists
    const [existingUsers] = await connection.query(
      'SELECT id_user FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      await connection.rollback();
      return res.status(409).json({
        error: 'User with this email already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const [userResult] = await connection.query(
      `INSERT INTO users (firstname, lastname, email, password, is_admin)
       VALUES (?, ?, ?, ?, ?)`,
      [firstname, lastname, email, hashedPassword, is_admin ? 1 : 0]
    );

    const userId = userResult.insertId;

    // If user is a driver, create driver entry
    let driverId = null;
    if (is_driver) {
      const [driverResult] = await connection.query(
        `INSERT INTO drivers (id_user, points)
         VALUES (?, ?)`,
        [userId, driver_points || 0]
      );
      driverId = driverResult.insertId;

      // If team is provided, create teams_users relationship
      if (id_team) {
        await connection.query(
          'INSERT INTO teams_users (id_user, id_team) VALUES (?, ?)',
          [userId, id_team]
        );
      }
    }

    // Assign default role (Fan - id_type_user: 5)
    await connection.query(
      'INSERT INTO users_type_users (id_user, id_type_user) VALUES (?, ?)',
      [userId, 5]
    );

    await connection.commit();

    const [newUser] = await connection.query(
      `SELECT 
        u.id_user, u.firstname, u.lastname, u.email, u.is_admin,
        d.id_driver, d.points as driver_points,
        CASE WHEN d.id_driver IS NOT NULL THEN 1 ELSE 0 END as is_driver
       FROM users u
       LEFT JOIN drivers d ON u.id_user = d.id_user
       WHERE u.id_user = ?`,
      [userId]
    );

    res.status(201).json({
      message: 'User created successfully',
      user: newUser[0]
    });

  } catch (error) {
    await connection.rollback();
    console.error('Create user error:', error);
    res.status(500).json({
      error: 'Failed to create user',
      details: error.message
    });
  } finally {
    connection.release();
  }
};

// Update user
export const updateUser = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const { id } = req.params;
    const { firstname, lastname, password, is_admin, is_driver, driver_points, id_team } = req.body;

    // Check if user exists
    const [existing] = await connection.query(
      `SELECT u.*, d.id_driver 
       FROM users u 
       LEFT JOIN drivers d ON u.id_user = d.id_user
       WHERE u.id_user = ?`,
      [id]
    );

    if (existing.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        error: 'User not found'
      });
    }

    const currentUser = existing[0];

    // Update user data
    const updates = [];
    const values = [];

    if (firstname !== undefined) {
      updates.push('firstname = ?');
      values.push(firstname);
    }
    if (lastname !== undefined) {
      updates.push('lastname = ?');
      values.push(lastname);
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updates.push('password = ?');
      values.push(hashedPassword);
    }
    if (is_admin !== undefined) {
      updates.push('is_admin = ?');
      values.push(is_admin ? 1 : 0);
    }

    if (updates.length > 0) {
      values.push(id);
      await connection.query(
        `UPDATE users SET ${updates.join(', ')} WHERE id_user = ?`,
        values
      );
    }

    // Handle driver status
    const wasDriver = currentUser.id_driver !== null;
    
    // Only process driver status changes if is_driver is explicitly provided
    if (is_driver !== undefined) {
      const shouldBeDriver = is_driver === true || is_driver === 1;

      if (shouldBeDriver && !wasDriver) {
        // Create driver entry
        const [driverResult] = await connection.query(
          `INSERT INTO drivers (id_user, points) VALUES (?, ?)`,
          [id, driver_points || 0]
        );
        const driverId = driverResult.insertId;

        // Add to team if specified
        if (id_team) {
          await connection.query(
            'INSERT INTO teams_users (id_user, id_team) VALUES (?, ?)',
            [id, id_team]
          );
        }
      } else if (shouldBeDriver && wasDriver) {
        // Update driver points
        if (driver_points !== undefined) {
          await connection.query(
            'UPDATE drivers SET points = ? WHERE id_driver = ?',
            [driver_points, currentUser.id_driver]
          );
        }

        // Update team relationship
        if (id_team !== undefined) {
          // Remove old team relationship
          await connection.query(
            'DELETE FROM teams_users WHERE id_user = ?',
            [id]
          );
          
          // Add new team if specified
          if (id_team) {
            await connection.query(
              'INSERT INTO teams_users (id_user, id_team) VALUES (?, ?)',
              [id, id_team]
            );
          }
        }
      } else if (!shouldBeDriver && wasDriver) {
        // Remove driver status
        await connection.query('DELETE FROM teams_users WHERE id_user = ?', [id]);
        await connection.query('DELETE FROM drivers WHERE id_driver = ?', [currentUser.id_driver]);
      }
    }

    await connection.commit();

    const [updatedUser] = await connection.query(
      `SELECT 
        u.id_user, u.firstname, u.lastname, u.email, u.is_admin,
        d.id_driver, d.points as driver_points,
        CASE WHEN d.id_driver IS NOT NULL THEN 1 ELSE 0 END as is_driver
       FROM users u
       LEFT JOIN drivers d ON u.id_user = d.id_user
       WHERE u.id_user = ?`,
      [id]
    );

    res.json({
      message: 'User updated successfully',
      user: updatedUser[0]
    });

  } catch (error) {
    await connection.rollback();
    console.error('Update user error:', error);
    res.status(500).json({
      error: 'Failed to update user',
      details: error.message
    });
  } finally {
    connection.release();
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const { id } = req.params;

    const [existing] = await connection.query(
      `SELECT u.firstname, u.lastname, d.id_driver
       FROM users u
       LEFT JOIN drivers d ON u.id_user = d.id_user
       WHERE u.id_user = ?`,
      [id]
    );

    if (existing.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        error: 'User not found'
      });
    }

    const user = existing[0];

    // If user is a driver, delete driver-related data first
    if (user.id_driver) {
      await connection.query('DELETE FROM teams_users WHERE id_user = ?', [id]);
      await connection.query('DELETE FROM drivers WHERE id_driver = ?', [user.id_driver]);
    }

    // Delete user type associations
    await connection.query('DELETE FROM users_type_users WHERE id_user = ?', [id]);

    // Delete user
    await connection.query('DELETE FROM users WHERE id_user = ?', [id]);

    await connection.commit();

    res.json({
      message: 'User deleted successfully',
      userName: `${user.firstname} ${user.lastname}`
    });

  } catch (error) {
    await connection.rollback();
    console.error('Delete user error:', error);

    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).json({
        error: 'Cannot delete user - they have associated data'
      });
    }

    res.status(500).json({
      error: 'Failed to delete user',
      details: error.message
    });
  } finally {
    connection.release();
  }
};
