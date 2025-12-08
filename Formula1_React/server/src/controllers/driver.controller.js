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

    // Get driver statistics
    const [stats] = await connection.query(
      `SELECT
         COUNT(*) as total_races,
         SUM(CASE WHEN r.position = 1 THEN 1 ELSE 0 END) as wins,
         SUM(CASE WHEN r.position <= 3 THEN 1 ELSE 0 END) as podiums,
         SUM(r.points) as total_points
       FROM results r
       WHERE r.driver_id = ?`,
      [id]
    );

    res.json({
      driver: drivers[0],
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
    const {
      driver_number, first_name, last_name, birth_date,
      place_of_birth, team_id, nationalite_id
    } = req.body;

    if (!driver_number || !first_name || !last_name) {
      return res.status(400).json({
        error: 'Driver number, first name and last name are required'
      });
    }

    const [result] = await connection.query(
      `INSERT INTO drivers (driver_number, first_name, last_name, birth_date, place_of_birth, team_id, nationalite_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [driver_number, first_name, last_name, birth_date || null, place_of_birth || null, team_id || null, nationalite_id || null]
    );

    const [drivers] = await connection.query(
      `SELECT d.*, n.country_name as nationality, t.team_name
       FROM drivers d
       LEFT JOIN nationalites n ON d.nationalite_id = n.id
       LEFT JOIN teams t ON d.team_id = t.id
       WHERE d.id = ?`,
      [result.insertId]
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
    const {
      driver_number, first_name, last_name, birth_date,
      place_of_birth, team_id, nationalite_id
    } = req.body;

    const [existing] = await connection.query('SELECT id FROM drivers WHERE id = ?', [id]);

    if (existing.length === 0) {
      return res.status(404).json({
        error: 'Driver not found'
      });
    }

    await connection.query(
      `UPDATE drivers
       SET driver_number = COALESCE(?, driver_number),
           first_name = COALESCE(?, first_name),
           last_name = COALESCE(?, last_name),
           birth_date = COALESCE(?, birth_date),
           place_of_birth = COALESCE(?, place_of_birth),
           team_id = COALESCE(?, team_id),
           nationalite_id = COALESCE(?, nationalite_id)
       WHERE id = ?`,
      [driver_number, first_name, last_name, birth_date, place_of_birth, team_id, nationalite_id, id]
    );

    const [drivers] = await connection.query(
      `SELECT d.*, n.country_name as nationality, t.team_name
       FROM drivers d
       LEFT JOIN nationalites n ON d.nationalite_id = n.id
       LEFT JOIN teams t ON d.team_id = t.id
       WHERE d.id = ?`,
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
      'SELECT first_name, last_name FROM drivers WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        error: 'Driver not found'
      });
    }

    await connection.query('DELETE FROM drivers WHERE id = ?', [id]);

    res.json({
      message: 'Driver deleted successfully',
      driverName: `${existing[0].first_name} ${existing[0].last_name}`
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
