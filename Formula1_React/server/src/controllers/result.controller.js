import { pool } from '../config/database.js';

// Get all results
export const getAllResults = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { event_id, driver_id, saison } = req.query;

    let query = `
      SELECT r.*, d.first_name, d.last_name, d.driver_number,
             t.team_name, e.event_name, s.year,
             c.circuit_name
      FROM results r
      LEFT JOIN drivers d ON r.driver_id = d.id
      LEFT JOIN teams t ON d.team_id = t.id
      LEFT JOIN evenements e ON r.evenement_id = e.id
      LEFT JOIN saisons s ON e.saisons_id = s.id
      LEFT JOIN circuits c ON e.circuit_id = c.id
      WHERE 1=1
    `;

    const params = [];

    if (event_id) {
      query += ' AND r.evenement_id = ?';
      params.push(event_id);
    }

    if (driver_id) {
      query += ' AND r.driver_id = ?';
      params.push(driver_id);
    }

    if (saison) {
      query += ' AND s.year = ?';
      params.push(saison);
    }

    query += ' ORDER BY e.date_evenement DESC, r.position';

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
      `SELECT r.*, d.first_name, d.last_name, d.driver_number,
              t.team_name, e.event_name, e.date_evenement,
              c.circuit_name, s.year
       FROM results r
       LEFT JOIN drivers d ON r.driver_id = d.id
       LEFT JOIN teams t ON d.team_id = t.id
       LEFT JOIN evenements e ON r.evenement_id = e.id
       LEFT JOIN circuits c ON e.circuit_id = c.id
       LEFT JOIN saisons s ON e.saisons_id = s.id
       WHERE r.id = ?`,
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
      evenement_id, driver_id, position, points,
      laps_completed, time, status
    } = req.body;

    if (!evenement_id || !driver_id || position === undefined) {
      return res.status(400).json({
        error: 'Event ID, driver ID and position are required'
      });
    }

    // Get points from bareme if not provided
    let finalPoints = points;
    if (finalPoints === undefined && position > 0 && position <= 10) {
      const [bareme] = await connection.query(
        'SELECT points FROM bareme WHERE position = ?',
        [position]
      );
      if (bareme.length > 0) {
        finalPoints = bareme[0].points;
      }
    }

    const [result] = await connection.query(
      `INSERT INTO results (evenement_id, driver_id, position, points, laps_completed, time, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [evenement_id, driver_id, position, finalPoints || 0, laps_completed || null, time || null, status || 'Finished']
    );

    const [results] = await connection.query(
      `SELECT r.*, d.first_name, d.last_name, t.team_name, e.event_name
       FROM results r
       LEFT JOIN drivers d ON r.driver_id = d.id
       LEFT JOIN teams t ON d.team_id = t.id
       LEFT JOIN evenements e ON r.evenement_id = e.id
       WHERE r.id = ?`,
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
      evenement_id, driver_id, position, points,
      laps_completed, time, status
    } = req.body;

    const [existing] = await connection.query('SELECT id FROM results WHERE id = ?', [id]);

    if (existing.length === 0) {
      return res.status(404).json({
        error: 'Result not found'
      });
    }

    await connection.query(
      `UPDATE results
       SET evenement_id = COALESCE(?, evenement_id),
           driver_id = COALESCE(?, driver_id),
           position = COALESCE(?, position),
           points = COALESCE(?, points),
           laps_completed = COALESCE(?, laps_completed),
           time = COALESCE(?, time),
           status = COALESCE(?, status)
       WHERE id = ?`,
      [evenement_id, driver_id, position, points, laps_completed, time, status, id]
    );

    const [results] = await connection.query(
      `SELECT r.*, d.first_name, d.last_name, t.team_name, e.event_name
       FROM results r
       LEFT JOIN drivers d ON r.driver_id = d.id
       LEFT JOIN teams t ON d.team_id = t.id
       LEFT JOIN evenements e ON r.evenement_id = e.id
       WHERE r.id = ?`,
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

    const [existing] = await connection.query('SELECT id FROM results WHERE id = ?', [id]);

    if (existing.length === 0) {
      return res.status(404).json({
        error: 'Result not found'
      });
    }

    await connection.query('DELETE FROM results WHERE id = ?', [id]);

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
