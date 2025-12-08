import { pool } from '../config/database.js';

// Get all events
export const getAllEvents = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { saison, type } = req.query;

    let query = `
      SELECT e.*, te.type_name, s.year, c.circuit_name,
             l.city, l.country
      FROM evenements e
      LEFT JOIN type_evenements te ON e.type_evenements_id = te.id
      LEFT JOIN saisons s ON e.saisons_id = s.id
      LEFT JOIN circuits c ON e.circuit_id = c.id
      LEFT JOIN localisations l ON c.localisation_id = l.id
      WHERE 1=1
    `;

    const params = [];

    if (saison) {
      query += ' AND s.year = ?';
      params.push(saison);
    }

    if (type) {
      query += ' AND te.type_name = ?';
      params.push(type);
    }

    query += ' ORDER BY e.date_evenement DESC, e.time_evenement';

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
      `SELECT e.*, te.type_name, s.year, c.circuit_name, c.circuit_length,
              l.city, l.country
       FROM evenements e
       LEFT JOIN type_evenements te ON e.type_evenements_id = te.id
       LEFT JOIN saisons s ON e.saisons_id = s.id
       LEFT JOIN circuits c ON e.circuit_id = c.id
       LEFT JOIN localisations l ON c.localisation_id = l.id
       WHERE e.id = ?`,
      [id]
    );

    if (events.length === 0) {
      return res.status(404).json({
        error: 'Event not found'
      });
    }

    // Get results for this event
    const [results] = await connection.query(
      `SELECT r.*, d.first_name, d.last_name, d.driver_number,
              t.team_name
       FROM results r
       LEFT JOIN drivers d ON r.driver_id = d.id
       LEFT JOIN teams t ON d.team_id = t.id
       WHERE r.evenement_id = ?
       ORDER BY r.position`,
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
      event_name, date_evenement, time_evenement,
      circuit_id, saisons_id, type_evenements_id
    } = req.body;

    if (!event_name || !date_evenement || !circuit_id || !saisons_id || !type_evenements_id) {
      return res.status(400).json({
        error: 'Event name, date, circuit, season and type are required'
      });
    }

    const [result] = await connection.query(
      `INSERT INTO evenements (event_name, date_evenement, time_evenement, circuit_id, saisons_id, type_evenements_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [event_name, date_evenement, time_evenement || null, circuit_id, saisons_id, type_evenements_id]
    );

    const [events] = await connection.query(
      `SELECT e.*, te.type_name, s.year, c.circuit_name
       FROM evenements e
       LEFT JOIN type_evenements te ON e.type_evenements_id = te.id
       LEFT JOIN saisons s ON e.saisons_id = s.id
       LEFT JOIN circuits c ON e.circuit_id = c.id
       WHERE e.id = ?`,
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
      event_name, date_evenement, time_evenement,
      circuit_id, saisons_id, type_evenements_id
    } = req.body;

    const [existing] = await connection.query('SELECT id FROM evenements WHERE id = ?', [id]);

    if (existing.length === 0) {
      return res.status(404).json({
        error: 'Event not found'
      });
    }

    await connection.query(
      `UPDATE evenements
       SET event_name = COALESCE(?, event_name),
           date_evenement = COALESCE(?, date_evenement),
           time_evenement = COALESCE(?, time_evenement),
           circuit_id = COALESCE(?, circuit_id),
           saisons_id = COALESCE(?, saisons_id),
           type_evenements_id = COALESCE(?, type_evenements_id)
       WHERE id = ?`,
      [event_name, date_evenement, time_evenement, circuit_id, saisons_id, type_evenements_id, id]
    );

    const [events] = await connection.query(
      `SELECT e.*, te.type_name, s.year, c.circuit_name
       FROM evenements e
       LEFT JOIN type_evenements te ON e.type_evenements_id = te.id
       LEFT JOIN saisons s ON e.saisons_id = s.id
       LEFT JOIN circuits c ON e.circuit_id = c.id
       WHERE e.id = ?`,
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

    const [existing] = await connection.query('SELECT event_name FROM evenements WHERE id = ?', [id]);

    if (existing.length === 0) {
      return res.status(404).json({
        error: 'Event not found'
      });
    }

    await connection.query('DELETE FROM evenements WHERE id = ?', [id]);

    res.json({
      message: 'Event deleted successfully',
      eventName: existing[0].event_name
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
    const [types] = await connection.query('SELECT * FROM type_evenements ORDER BY id');

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
    const [seasons] = await connection.query('SELECT * FROM saisons ORDER BY year DESC');

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
