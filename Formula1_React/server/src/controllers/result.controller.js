import { pool } from '../config/database.js';

// Get all results
export const getAllResults = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { event_id, driver_id, saison } = req.query;

    let query = `
      SELECT r.id_result, r.id_driver, r.id_bareme, r.id_planning,
             u.firstname, u.lastname,
             b.place, b.point,
             e.nom as event_name, s.nom as saison_name, s.annee,
             c.nom as circuit_name
      FROM results r
      LEFT JOIN drivers d ON r.id_driver = d.id_driver
      LEFT JOIN users u ON d.id_user = u.id_user
      LEFT JOIN bareme b ON r.id_bareme = b.id_bareme
      LEFT JOIN evenements e ON r.id_planning = e.id_planning
      LEFT JOIN saisons s ON e.id_saison = s.id_saison
      LEFT JOIN circuits c ON e.id_circuits = c.id_circuits
      WHERE 1=1
    `;

    const params = [];

    if (event_id) {
      query += ' AND r.id_planning = ?';
      params.push(event_id);
    }

    if (driver_id) {
      query += ' AND r.id_driver = ?';
      params.push(driver_id);
    }

    if (saison) {
      query += ' AND s.annee = ?';
      params.push(saison);
    }

    query += ' ORDER BY e.date_heure DESC, b.place';

    const [results] = await connection.query(query, params);

    res.json({
      results,
      count: results.length
    });

  } catch (error) {
    console.error('Get results error:', error);
    res.status(500).json({
      error: 'Failed to fetch results',
      details: error.message
    });
  } finally {
    connection.release();
  }
};

// Get result by ID
export const getResultById = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { id } = req.params;

    const [results] = await connection.query(
      `SELECT r.id_result, r.id_driver, r.id_bareme, r.id_planning,
              u.firstname, u.lastname,
              b.place, b.point,
              e.nom as event_name, e.date_heure,
              c.nom as circuit_name, s.nom as saison_name, s.annee
       FROM results r
       LEFT JOIN drivers d ON r.id_driver = d.id_driver
       LEFT JOIN users u ON d.id_user = u.id_user
       LEFT JOIN bareme b ON r.id_bareme = b.id_bareme
       LEFT JOIN evenements e ON r.id_planning = e.id_planning
       LEFT JOIN circuits c ON e.id_circuits = c.id_circuits
       LEFT JOIN saisons s ON e.id_saison = s.id_saison
       WHERE r.id_result = ?`,
      [id]
    );

    if (results.length === 0) {
      return res.status(404).json({
        error: 'Result not found'
      });
    }

    res.json({
      result: results[0]
    });

  } catch (error) {
    console.error('Get result error:', error);
    res.status(500).json({
      error: 'Failed to fetch result',
      details: error.message
    });
  } finally {
    connection.release();
  }
};

// Create result (admin only)
export const createResult = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const {
      id_planning, id_driver, id_bareme
    } = req.body;

    if (!id_planning || !id_driver) {
      return res.status(400).json({
        error: 'Event ID (id_planning) and driver ID are required'
      });
    }

    const [result] = await connection.query(
      `INSERT INTO results (id_planning, id_driver, id_bareme)
       VALUES (?, ?, ?)`,
      [id_planning, id_driver, id_bareme || null]
    );

    const [results] = await connection.query(
      `SELECT r.id_result, r.id_driver, r.id_bareme, r.id_planning,
              u.firstname, u.lastname,
              b.place, b.point,
              e.nom as event_name
       FROM results r
       LEFT JOIN drivers d ON r.id_driver = d.id_driver
       LEFT JOIN users u ON d.id_user = u.id_user
       LEFT JOIN bareme b ON r.id_bareme = b.id_bareme
       LEFT JOIN evenements e ON r.id_planning = e.id_planning
       WHERE r.id_result = ?`,
      [result.insertId]
    );

    res.status(201).json({
      message: 'Result created successfully',
      result: results[0]
    });

  } catch (error) {
    console.error('Create result error:', error);
    res.status(500).json({
      error: 'Failed to create result',
      details: error.message
    });
  } finally {
    connection.release();
  }
};

// Update result (admin only)
export const updateResult = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { id } = req.params;
    const {
      id_planning, id_driver, id_bareme
    } = req.body;

    const [existing] = await connection.query('SELECT id_result FROM results WHERE id_result = ?', [id]);

    if (existing.length === 0) {
      return res.status(404).json({
        error: 'Result not found'
      });
    }

    await connection.query(
      `UPDATE results
       SET id_planning = COALESCE(?, id_planning),
           id_driver = COALESCE(?, id_driver),
           id_bareme = COALESCE(?, id_bareme)
       WHERE id_result = ?`,
      [id_planning, id_driver, id_bareme, id]
    );

    const [results] = await connection.query(
      `SELECT r.id_result, r.id_driver, r.id_bareme, r.id_planning,
              u.firstname, u.lastname,
              b.place, b.point,
              e.nom as event_name
       FROM results r
       LEFT JOIN drivers d ON r.id_driver = d.id_driver
       LEFT JOIN users u ON d.id_user = u.id_user
       LEFT JOIN bareme b ON r.id_bareme = b.id_bareme
       LEFT JOIN evenements e ON r.id_planning = e.id_planning
       WHERE r.id_result = ?`,
      [id]
    );

    res.json({
      message: 'Result updated successfully',
      result: results[0]
    });

  } catch (error) {
    console.error('Update result error:', error);
    res.status(500).json({
      error: 'Failed to update result',
      details: error.message
    });
  } finally {
    connection.release();
  }
};

// Delete result (admin only)
export const deleteResult = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { id } = req.params;

    const [existing] = await connection.query('SELECT id_result FROM results WHERE id_result = ?', [id]);

    if (existing.length === 0) {
      return res.status(404).json({
        error: 'Result not found'
      });
    }

    await connection.query('DELETE FROM results WHERE id_result = ?', [id]);

    res.json({
      message: 'Result deleted successfully'
    });

  } catch (error) {
    console.error('Delete result error:', error);
    res.status(500).json({
      error: 'Failed to delete result',
      details: error.message
    });
  } finally {
    connection.release();
  }
};
