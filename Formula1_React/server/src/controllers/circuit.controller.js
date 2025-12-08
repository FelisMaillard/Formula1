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
      `SELECT c.id_circuits, c.nom, c.longueur, l.ville, l.pays
       FROM circuits c
       LEFT JOIN localisations l ON c.id_localisation = l.id_localisation
       WHERE c.id_circuits = ?`,
      [id]
    );

    if (circuits.length === 0) {
      return res.status(404).json({
        error: 'Circuit not found'
      });
    }

    // Get events at this circuit
    const [events] = await connection.query(
      `SELECT e.id_planning, e.nom, e.date_heure, te.libelle as type_name, s.nom as saison_name, s.annee
       FROM evenements e
       LEFT JOIN type_evenements te ON e.id_type_evenement = te.id_type_evenement
       LEFT JOIN saisons s ON e.id_saison = s.id_saison
       WHERE e.id_circuits = ?
       ORDER BY e.date_heure DESC
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

    const { nom, longueur, ville, pays } = req.body;

    if (!nom) {
      await connection.rollback();
      return res.status(400).json({
        error: 'Circuit name (nom) is required'
      });
    }

    // Create location if provided
    let id_localisation = null;
    if (ville || pays) {
      const [locResult] = await connection.query(
        'INSERT INTO localisations (ville, pays) VALUES (?, ?)',
        [ville || null, pays || null]
      );
      id_localisation = locResult.insertId;
    }

    // Create circuit
    const [result] = await connection.query(
      `INSERT INTO circuits (nom, longueur, id_localisation)
       VALUES (?, ?, ?)`,
      [nom, longueur || null, id_localisation]
    );

    const [circuits] = await connection.query(
      `SELECT c.id_circuits, c.nom, c.longueur, l.ville, l.pays
       FROM circuits c
       LEFT JOIN localisations l ON c.id_localisation = l.id_localisation
       WHERE c.id_circuits = ?`,
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
    const { nom, longueur, ville, pays } = req.body;

    const [existing] = await connection.query('SELECT * FROM circuits WHERE id_circuits = ?', [id]);

    if (existing.length === 0) {
      return res.status(404).json({
        error: 'Circuit not found'
      });
    }

    await connection.beginTransaction();

    // Update location if needed
    if (ville || pays) {
      if (existing[0].id_localisation) {
        await connection.query(
          `UPDATE localisations
           SET ville = COALESCE(?, ville),
               pays = COALESCE(?, pays)
           WHERE id_localisation = ?`,
          [ville, pays, existing[0].id_localisation]
        );
      } else {
        const [locResult] = await connection.query(
          'INSERT INTO localisations (ville, pays) VALUES (?, ?)',
          [ville || null, pays || null]
        );
        await connection.query(
          'UPDATE circuits SET id_localisation = ? WHERE id_circuits = ?',
          [locResult.insertId, id]
        );
      }
    }

    // Update circuit
    await connection.query(
      `UPDATE circuits
       SET nom = COALESCE(?, nom),
           longueur = COALESCE(?, longueur)
       WHERE id_circuits = ?`,
      [nom, longueur, id]
    );

    const [circuits] = await connection.query(
      `SELECT c.id_circuits, c.nom, c.longueur, l.ville, l.pays
       FROM circuits c
       LEFT JOIN localisations l ON c.id_localisation = l.id_localisation
       WHERE c.id_circuits = ?`,
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

    const [existing] = await connection.query('SELECT nom FROM circuits WHERE id_circuits = ?', [id]);

    if (existing.length === 0) {
      return res.status(404).json({
        error: 'Circuit not found'
      });
    }

    await connection.query('DELETE FROM circuits WHERE id_circuits = ?', [id]);

    res.json({
      message: 'Circuit deleted successfully',
      circuitName: existing[0].nom
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
