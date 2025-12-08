import { pool } from '../config/database.js';

// Get all teams
export const getAllTeams = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const [teams] = await connection.query(
      `SELECT id_team, libelle, date_creation, points
       FROM teams
       ORDER BY libelle`
    );

    res.json({
      teams,
      count: teams.length
    });

  } catch (error) {
    console.error('Get teams error:', error);
    res.status(500).json({
      error: 'Failed to fetch teams',
      details: error.message
    });
  } finally {
    connection.release();
  }
};

// Get team by ID
export const getTeamById = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { id } = req.params;

    const [teams] = await connection.query(
      `SELECT id_team, libelle, date_creation, points
       FROM teams
       WHERE id_team = ?`,
      [id]
    );

    if (teams.length === 0) {
      return res.status(404).json({
        error: 'Team not found'
      });
    }

    // Get team drivers
    const [drivers] = await connection.query(
      `SELECT d.id_driver, d.points, u.firstname, u.lastname, u.email
       FROM drivers d
       INNER JOIN users u ON d.id_user = u.id_user
       INNER JOIN teams_users tu ON u.id_user = tu.id_user
       WHERE tu.id_team = ?`,
      [id]
    );

    res.json({
      team: teams[0],
      drivers
    });

  } catch (error) {
    console.error('Get team error:', error);
    res.status(500).json({
      error: 'Failed to fetch team',
      details: error.message
    });
  } finally {
    connection.release();
  }
};

// Create team (admin only)
export const createTeam = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { libelle, date_creation, points } = req.body;

    if (!libelle) {
      return res.status(400).json({
        error: 'Team name (libelle) is required'
      });
    }

    const [result] = await connection.query(
      `INSERT INTO teams (libelle, date_creation, points)
       VALUES (?, ?, ?)`,
      [libelle, date_creation || null, points || 0]
    );

    const [teams] = await connection.query(
      `SELECT id_team, libelle, date_creation, points
       FROM teams
       WHERE id_team = ?`,
      [result.insertId]
    );

    res.status(201).json({
      message: 'Team created successfully',
      team: teams[0]
    });

  } catch (error) {
    console.error('Create team error:', error);
    res.status(500).json({
      error: 'Failed to create team',
      details: error.message
    });
  } finally {
    connection.release();
  }
};

// Update team (admin only)
export const updateTeam = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { id } = req.params;
    const { libelle, date_creation, points } = req.body;

    // Check if team exists
    const [existing] = await connection.query('SELECT id_team FROM teams WHERE id_team = ?', [id]);

    if (existing.length === 0) {
      return res.status(404).json({
        error: 'Team not found'
      });
    }

    await connection.query(
      `UPDATE teams
       SET libelle = COALESCE(?, libelle),
           date_creation = COALESCE(?, date_creation),
           points = COALESCE(?, points)
       WHERE id_team = ?`,
      [libelle, date_creation, points, id]
    );

    const [teams] = await connection.query(
      `SELECT id_team, libelle, date_creation, points
       FROM teams
       WHERE id_team = ?`,
      [id]
    );

    res.json({
      message: 'Team updated successfully',
      team: teams[0]
    });

  } catch (error) {
    console.error('Update team error:', error);
    res.status(500).json({
      error: 'Failed to update team',
      details: error.message
    });
  } finally {
    connection.release();
  }
};

// Delete team (admin only)
export const deleteTeam = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { id } = req.params;

    // Check if team exists
    const [existing] = await connection.query('SELECT libelle FROM teams WHERE id_team = ?', [id]);

    if (existing.length === 0) {
      return res.status(404).json({
        error: 'Team not found'
      });
    }

    await connection.query('DELETE FROM teams WHERE id_team = ?', [id]);

    res.json({
      message: 'Team deleted successfully',
      teamName: existing[0].libelle
    });

  } catch (error) {
    console.error('Delete team error:', error);

    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).json({
        error: 'Cannot delete team - it has associated drivers or other references'
      });
    }

    res.status(500).json({
      error: 'Failed to delete team',
      details: error.message
    });
  } finally {
    connection.release();
  }
};
