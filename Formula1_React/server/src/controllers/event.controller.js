import { pool } from '../config/database.js';

// Get all events
export const getAllEvents = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { saison, type } = req.query;

    let query = `
      SELECT e.id_planning, e.nom, e.date_heure,
             te.libelle as type_name, s.nom as saison_name, s.annee,
             c.nom as circuit_name, l.ville, l.pays
      FROM evenements e
      LEFT JOIN type_evenements te ON e.id_type_evenement = te.id_type_evenement
      LEFT JOIN saisons s ON e.id_saison = s.id_saison
      LEFT JOIN circuits c ON e.id_circuits = c.id_circuits
      LEFT JOIN localisations l ON c.id_localisation = l.id_localisation
      WHERE 1=1
    `;

    const params = [];

    if (saison) {
      query += ' AND s.annee = ?';
      params.push(saison);
    }

    if (type) {
      query += ' AND te.libelle = ?';
      params.push(type);
    }

    query += ' ORDER BY e.date_heure DESC';

    const [events] = await connection.query(query, params);

    res.json({
      events,
      count: events.length
    });

  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      error: 'Failed to fetch events',
      details: error.message
    });
  } finally {
    connection.release();
  }
};

// Get event by ID
export const getEventById = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { id } = req.params;

    const [events] = await connection.query(
      `SELECT e.id_planning, e.nom, e.date_heure,
              te.libelle as type_name, s.nom as saison_name, s.annee,
              c.nom as circuit_name, c.longueur,
              l.ville, l.pays
       FROM evenements e
       LEFT JOIN type_evenements te ON e.id_type_evenement = te.id_type_evenement
       LEFT JOIN saisons s ON e.id_saison = s.id_saison
       LEFT JOIN circuits c ON e.id_circuits = c.id_circuits
       LEFT JOIN localisations l ON c.id_localisation = l.id_localisation
       WHERE e.id_planning = ?`,
      [id]
    );

    if (events.length === 0) {
      return res.status(404).json({
        error: 'Event not found'
      });
    }

    // Get results for this event
    const [results] = await connection.query(
      `SELECT r.id_result, r.id_driver, r.id_bareme,
              u.firstname, u.lastname,
              b.place, b.point
       FROM results r
       LEFT JOIN drivers d ON r.id_driver = d.id_driver
       LEFT JOIN users u ON d.id_user = u.id_user
       LEFT JOIN bareme b ON r.id_bareme = b.id_bareme
       WHERE r.id_planning = ?
       ORDER BY b.place`,
      [id]
    );

    res.json({
      event: events[0],
      results
    });

  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({
      error: 'Failed to fetch event',
      details: error.message
    });
  } finally {
    connection.release();
  }
};

// Create event (admin only)
export const createEvent = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const {
      nom, date_heure,
      id_circuits, id_saison, id_type_evenement
    } = req.body;

    if (!nom || !date_heure || !id_circuits || !id_saison || !id_type_evenement) {
      return res.status(400).json({
        error: 'Event name, date, circuit, season and type are required'
      });
    }

    const [result] = await connection.query(
      `INSERT INTO evenements (nom, date_heure, id_circuits, id_saison, id_type_evenement)
       VALUES (?, ?, ?, ?, ?)`,
      [nom, date_heure, id_circuits, id_saison, id_type_evenement]
    );

    const [events] = await connection.query(
      `SELECT e.id_planning, e.nom, e.date_heure,
              te.libelle as type_name, s.nom as saison_name, s.annee,
              c.nom as circuit_name
       FROM evenements e
       LEFT JOIN type_evenements te ON e.id_type_evenement = te.id_type_evenement
       LEFT JOIN saisons s ON e.id_saison = s.id_saison
       LEFT JOIN circuits c ON e.id_circuits = c.id_circuits
       WHERE e.id_planning = ?`,
      [result.insertId]
    );

    res.status(201).json({
      message: 'Event created successfully',
      event: events[0]
    });

  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      error: 'Failed to create event',
      details: error.message
    });
  } finally {
    connection.release();
  }
};

// Update event (admin only)
export const updateEvent = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { id } = req.params;
    const {
      nom, date_heure,
      id_circuits, id_saison, id_type_evenement
    } = req.body;

    const [existing] = await connection.query('SELECT id_planning FROM evenements WHERE id_planning = ?', [id]);

    if (existing.length === 0) {
      return res.status(404).json({
        error: 'Event not found'
      });
    }

    await connection.query(
      `UPDATE evenements
       SET nom = COALESCE(?, nom),
           date_heure = COALESCE(?, date_heure),
           id_circuits = COALESCE(?, id_circuits),
           id_saison = COALESCE(?, id_saison),
           id_type_evenement = COALESCE(?, id_type_evenement)
       WHERE id_planning = ?`,
      [nom, date_heure, id_circuits, id_saison, id_type_evenement, id]
    );

    const [events] = await connection.query(
      `SELECT e.id_planning, e.nom, e.date_heure,
              te.libelle as type_name, s.nom as saison_name, s.annee,
              c.nom as circuit_name
       FROM evenements e
       LEFT JOIN type_evenements te ON e.id_type_evenement = te.id_type_evenement
       LEFT JOIN saisons s ON e.id_saison = s.id_saison
       LEFT JOIN circuits c ON e.id_circuits = c.id_circuits
       WHERE e.id_planning = ?`,
      [id]
    );

    res.json({
      message: 'Event updated successfully',
      event: events[0]
    });

  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({
      error: 'Failed to update event',
      details: error.message
    });
  } finally {
    connection.release();
  }
};

// Delete event (admin only)
export const deleteEvent = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { id } = req.params;

    const [existing] = await connection.query('SELECT nom FROM evenements WHERE id_planning = ?', [id]);

    if (existing.length === 0) {
      return res.status(404).json({
        error: 'Event not found'
      });
    }

    await connection.query('DELETE FROM evenements WHERE id_planning = ?', [id]);

    res.json({
      message: 'Event deleted successfully',
      eventName: existing[0].nom
    });

  } catch (error) {
    console.error('Delete event error:', error);

    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).json({
        error: 'Cannot delete event - it has associated results'
      });
    }

    res.status(500).json({
      error: 'Failed to delete event',
      details: error.message
    });
  } finally {
    connection.release();
  }
};

// Get event types
export const getEventTypes = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const [types] = await connection.query('SELECT id_type_evenement, libelle FROM type_evenements ORDER BY id_type_evenement');

    res.json({
      eventTypes: types
    });

  } catch (error) {
    console.error('Get event types error:', error);
    res.status(500).json({
      error: 'Failed to fetch event types',
      details: error.message
    });
  } finally {
    connection.release();
  }
};

// Get seasons
export const getSeasons = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const [seasons] = await connection.query('SELECT id_saison, nom, annee, date_debut, date_fin FROM saisons ORDER BY annee DESC');

    res.json({
      seasons
    });

  } catch (error) {
    console.error('Get seasons error:', error);
    res.status(500).json({
      error: 'Failed to fetch seasons',
      details: error.message
    });
  } finally {
    connection.release();
  }
};
