import { pool } from '../config/database.js';

// Get all circuits
export const getAllCircuits = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const [circuits] = await connection.query(
      `SELECT c.id_circuits, c.nom, c.longueur, l.ville, l.pays
       FROM circuits c
       LEFT JOIN localisations l ON c.id_localisation = l.id_localisation
       ORDER BY c.nom`
    );

    res.json({
      circuits,
      count: circuits.length
    });

  } catch (error) {
    console.error('Get circuits error:', error);
    res.status(500).json({
      error: 'Failed to fetch circuits',
      details: error.message
    });
  } finally {
    connection.release();
  }
};

// Get circuit by ID
export const getCircuitById = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { id } = req.params;

    const [circuits] = await connection.query(
      `SELECT c.*, l.city, l.country, l.postal_code
       FROM circuits c
       LEFT JOIN localisations l ON c.localisation_id = l.id
       WHERE c.id = ?`,
      [id]
    );

    if (circuits.length === 0) {
      return res.status(404).json({
        error: 'Circuit not found'
      });
    }

    // Get events at this circuit
    const [events] = await connection.query(
      `SELECT e.*, te.type_name, s.year
       FROM evenements e
       LEFT JOIN type_evenements te ON e.type_evenements_id = te.id
       LEFT JOIN saisons s ON e.saisons_id = s.id
       WHERE e.circuit_id = ?
       ORDER BY e.date_evenement DESC
       LIMIT 10`,
      [id]
    );

    res.json({
      circuit: circuits[0],
      recentEvents: events
    });

  } catch (error) {
    console.error('Get circuit error:', error);
    res.status(500).json({
      error: 'Failed to fetch circuit',
      details: error.message
    });
  } finally {
    connection.release();
  }
};

// Create circuit (admin only)
export const createCircuit = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const { circuit_name, circuit_length, number_of_laps, lap_record, city, country, postal_code } = req.body;

    if (!circuit_name) {
      await connection.rollback();
      return res.status(400).json({
        error: 'Circuit name is required'
      });
    }

    // Create location if provided
    let localisation_id = null;
    if (city || country) {
      const [locResult] = await connection.query(
        'INSERT INTO localisations (city, country, postal_code) VALUES (?, ?, ?)',
        [city || null, country || null, postal_code || null]
      );
      localisation_id = locResult.insertId;
    }

    // Create circuit
    const [result] = await connection.query(
      `INSERT INTO circuits (circuit_name, circuit_length, number_of_laps, lap_record, localisation_id)
       VALUES (?, ?, ?, ?, ?)`,
      [circuit_name, circuit_length || null, number_of_laps || null, lap_record || null, localisation_id]
    );

    const [circuits] = await connection.query(
      `SELECT c.*, l.city, l.country, l.postal_code
       FROM circuits c
       LEFT JOIN localisations l ON c.localisation_id = l.id
       WHERE c.id = ?`,
      [result.insertId]
    );

    await connection.commit();

    res.status(201).json({
      message: 'Circuit created successfully',
      circuit: circuits[0]
    });

  } catch (error) {
    await connection.rollback();
    console.error('Create circuit error:', error);
    res.status(500).json({
      error: 'Failed to create circuit',
      details: error.message
    });
  } finally {
    connection.release();
  }
};

// Update circuit (admin only)
export const updateCircuit = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { id } = req.params;
    const { circuit_name, circuit_length, number_of_laps, lap_record, city, country, postal_code } = req.body;

    const [existing] = await connection.query('SELECT * FROM circuits WHERE id = ?', [id]);

    if (existing.length === 0) {
      return res.status(404).json({
        error: 'Circuit not found'
      });
    }

    await connection.beginTransaction();

    // Update location if needed
    if (city || country || postal_code) {
      if (existing[0].localisation_id) {
        await connection.query(
          `UPDATE localisations
           SET city = COALESCE(?, city),
               country = COALESCE(?, country),
               postal_code = COALESCE(?, postal_code)
           WHERE id = ?`,
          [city, country, postal_code, existing[0].localisation_id]
        );
      } else {
        const [locResult] = await connection.query(
          'INSERT INTO localisations (city, country, postal_code) VALUES (?, ?, ?)',
          [city || null, country || null, postal_code || null]
        );
        await connection.query(
          'UPDATE circuits SET localisation_id = ? WHERE id = ?',
          [locResult.insertId, id]
        );
      }
    }

    // Update circuit
    await connection.query(
      `UPDATE circuits
       SET circuit_name = COALESCE(?, circuit_name),
           circuit_length = COALESCE(?, circuit_length),
           number_of_laps = COALESCE(?, number_of_laps),
           lap_record = COALESCE(?, lap_record)
       WHERE id = ?`,
      [circuit_name, circuit_length, number_of_laps, lap_record, id]
    );

    const [circuits] = await connection.query(
      `SELECT c.*, l.city, l.country, l.postal_code
       FROM circuits c
       LEFT JOIN localisations l ON c.localisation_id = l.id
       WHERE c.id = ?`,
      [id]
    );

    await connection.commit();

    res.json({
      message: 'Circuit updated successfully',
      circuit: circuits[0]
    });

  } catch (error) {
    await connection.rollback();
    console.error('Update circuit error:', error);
    res.status(500).json({
      error: 'Failed to update circuit',
      details: error.message
    });
  } finally {
    connection.release();
  }
};

// Delete circuit (admin only)
export const deleteCircuit = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { id } = req.params;

    const [existing] = await connection.query('SELECT circuit_name FROM circuits WHERE id = ?', [id]);

    if (existing.length === 0) {
      return res.status(404).json({
        error: 'Circuit not found'
      });
    }

    await connection.query('DELETE FROM circuits WHERE id = ?', [id]);

    res.json({
      message: 'Circuit deleted successfully',
      circuitName: existing[0].circuit_name
    });

  } catch (error) {
    console.error('Delete circuit error:', error);

    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).json({
        error: 'Cannot delete circuit - it has associated events'
      });
    }

    res.status(500).json({
      error: 'Failed to delete circuit',
      details: error.message
    });
  } finally {
    connection.release();
  }
};
