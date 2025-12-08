import { pool } from '../config/database.js';

// Get all drivers
export const getAllDrivers = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const [drivers] = await connection.query(
      `SELECT d.id_driver, d.points, u.firstname, u.lastname, u.email
       FROM drivers d
       INNER JOIN users u ON d.id_user = u.id_user
       ORDER BY d.points DESC`
    );

    res.json({
      drivers,
      count: drivers.length
    });

  } catch (error) {
    console.error('Get drivers error:', error);
    res.status(500).json({
      error: 'Failed to fetch drivers',
      details: error.message
    });
  } finally {
    connection.release();
  }
};

// Get driver by ID
export const getDriverById = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { id } = req.params;

    const [drivers] = await connection.query(
      `SELECT d.id_driver, d.points, u.firstname, u.lastname, u.email
       FROM drivers d
       INNER JOIN users u ON d.id_user = u.id_user
       WHERE d.id_driver = ?`,
      [id]
    );

    if (drivers.length === 0) {
      return res.status(404).json({
        error: 'Driver not found'
      });
    }

    // Get driver teams
    const [teams] = await connection.query(
      `SELECT t.id_team, t.libelle, t.date_creation, t.points
       FROM teams t
       INNER JOIN teams_users tu ON t.id_team = tu.id_team
       INNER JOIN drivers d ON tu.id_user = d.id_user
       WHERE d.id_driver = ?`,
      [id]
    );

    // Get driver statistics from results
    const [stats] = await connection.query(
      `SELECT
         COUNT(*) as total_races,
         SUM(CASE WHEN b.place = 1 THEN 1 ELSE 0 END) as wins,
         SUM(CASE WHEN b.place <= 3 THEN 1 ELSE 0 END) as podiums,
         SUM(b.point) as total_points
       FROM results r
       LEFT JOIN bareme b ON r.id_bareme = b.id_bareme
       WHERE r.id_driver = ?`,
      [id]
    );

    res.json({
      driver: drivers[0],
      teams: teams,
      statistics: stats[0]
    });

  } catch (error) {
    console.error('Get driver error:', error);
    res.status(500).json({
      error: 'Failed to fetch driver',
      details: error.message
    });
  } finally {
    connection.release();
  }
};

// Create driver (admin only)
export const createDriver = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { id_user, points, id_team } = req.body;

    if (!id_user) {
      return res.status(400).json({
        error: 'User ID is required'
      });
    }

    // Check if user exists
    const [users] = await connection.query('SELECT id_user FROM users WHERE id_user = ?', [id_user]);
    if (users.length === 0) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    // Insert driver
    const [result] = await connection.query(
      `INSERT INTO drivers (id_user, points)
       VALUES (?, ?)`,
      [id_user, points || 0]
    );

    const driverId = result.insertId;

    // If team is provided, create teams_users relationship
    if (id_team) {
      await connection.query(
        'INSERT INTO teams_users (id_user, id_team) VALUES (?, ?)',
        [id_user, id_team]
      );
    }

    const [drivers] = await connection.query(
      `SELECT d.id_driver, d.points, u.firstname, u.lastname, u.email
       FROM drivers d
       INNER JOIN users u ON d.id_user = u.id_user
       WHERE d.id_driver = ?`,
      [driverId]
    );

    res.status(201).json({
      message: 'Driver created successfully',
      driver: drivers[0]
    });

  } catch (error) {
    console.error('Create driver error:', error);
    res.status(500).json({
      error: 'Failed to create driver',
      details: error.message
    });
  } finally {
    connection.release();
  }
};

// Update driver (admin only)
export const updateDriver = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { id } = req.params;
    const { points } = req.body;

    const [existing] = await connection.query('SELECT id_driver FROM drivers WHERE id_driver = ?', [id]);

    if (existing.length === 0) {
      return res.status(404).json({
        error: 'Driver not found'
      });
    }

    await connection.query(
      `UPDATE drivers
       SET points = COALESCE(?, points)
       WHERE id_driver = ?`,
      [points, id]
    );

    const [drivers] = await connection.query(
      `SELECT d.id_driver, d.points, u.firstname, u.lastname, u.email
       FROM drivers d
       INNER JOIN users u ON d.id_user = u.id_user
       WHERE d.id_driver = ?`,
      [id]
    );

    res.json({
      message: 'Driver updated successfully',
      driver: drivers[0]
    });

  } catch (error) {
    console.error('Update driver error:', error);
    res.status(500).json({
      error: 'Failed to update driver',
      details: error.message
    });
  } finally {
    connection.release();
  }
};

// Delete driver (admin only)
export const deleteDriver = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { id } = req.params;

    const [existing] = await connection.query(
      `SELECT u.firstname, u.lastname
       FROM drivers d
       INNER JOIN users u ON d.id_user = u.id_user
       WHERE d.id_driver = ?`,
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        error: 'Driver not found'
      });
    }

    await connection.query('DELETE FROM drivers WHERE id_driver = ?', [id]);

    res.json({
      message: 'Driver deleted successfully',
      driverName: `${existing[0].firstname} ${existing[0].lastname}`
    });

  } catch (error) {
    console.error('Delete driver error:', error);

    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).json({
        error: 'Cannot delete driver - they have associated race results'
      });
    }

    res.status(500).json({
      error: 'Failed to delete driver',
      details: error.message
    });
  } finally {
    connection.release();
  }
};
