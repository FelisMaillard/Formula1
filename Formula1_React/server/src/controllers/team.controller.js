import { pool } from '../config/database.js';

// Get all teams
export const getAllTeams = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const [teams] = await connection.query(
      `SELECT t.*
       FROM teams t
       ORDER BY t.libelle`
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
      `SELECT t.*, n.country_name as nationality
       FROM teams t
       LEFT JOIN nationalites n ON t.nationalite_id = n.id
       WHERE t.id = ?`,
      [id]
    );

    if (teams.length === 0) {
      return res.status(404).json({
        error: 'Team not found'
      });
    }

    // Get team drivers
    const [drivers] = await connection.query(
      `SELECT d.id, d.driver_number, d.first_name, d.last_name,
              d.birth_date, n.country_name as nationality
       FROM drivers d
       LEFT JOIN nationalites n ON d.nationalite_id = n.id
       WHERE d.team_id = ?`,
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
    const { team_name, base_location, team_principal, chassis, power_unit, nationalite_id } = req.body;

    if (!team_name) {
      return res.status(400).json({
        error: 'Team name is required'
      });
    }

    const [result] = await connection.query(
      `INSERT INTO teams (team_name, base_location, team_principal, chassis, power_unit, nationalite_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [team_name, base_location || null, team_principal || null, chassis || null, power_unit || null, nationalite_id || null]
    );

    const [teams] = await connection.query(
      `SELECT t.*, n.country_name as nationality
       FROM teams t
       LEFT JOIN nationalites n ON t.nationalite_id = n.id
       WHERE t.id = ?`,
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
    const { team_name, base_location, team_principal, chassis, power_unit, nationalite_id } = req.body;

    // Check if team exists
    const [existing] = await connection.query('SELECT id FROM teams WHERE id = ?', [id]);

    if (existing.length === 0) {
      return res.status(404).json({
        error: 'Team not found'
      });
    }

    await connection.query(
      `UPDATE teams
       SET team_name = COALESCE(?, team_name),
           base_location = COALESCE(?, base_location),
           team_principal = COALESCE(?, team_principal),
           chassis = COALESCE(?, chassis),
           power_unit = COALESCE(?, power_unit),
           nationalite_id = COALESCE(?, nationalite_id)
       WHERE id = ?`,
      [team_name, base_location, team_principal, chassis, power_unit, nationalite_id, id]
    );

    const [teams] = await connection.query(
      `SELECT t.*, n.country_name as nationality
       FROM teams t
       LEFT JOIN nationalites n ON t.nationalite_id = n.id
       WHERE t.id = ?`,
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
    const [existing] = await connection.query('SELECT team_name FROM teams WHERE id = ?', [id]);

    if (existing.length === 0) {
      return res.status(404).json({
        error: 'Team not found'
      });
    }

    await connection.query('DELETE FROM teams WHERE id = ?', [id]);

    res.json({
      message: 'Team deleted successfully',
      teamName: existing[0].team_name
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
