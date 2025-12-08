import { pool } from '../config/database.js';

// Get driver standings (championship)
export const getDriverStandings = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { saison } = req.query;
    const year = saison || new Date().getFullYear();

    const [standings] = await connection.query(
      `SELECT
         d.id_driver,
         u.firstname,
         u.lastname,
         t.libelle,
         t.id_team,
         n.libelle as nationality,
         SUM(b.point) as total_points,
         COUNT(DISTINCT r.id_result) as races_entered,
         SUM(CASE WHEN b.place = 1 THEN 1 ELSE 0 END) as wins,
         SUM(CASE WHEN b.place <= 3 THEN 1 ELSE 0 END) as podiums
       FROM drivers d
       INNER JOIN users u ON d.id_user = u.id_user
       LEFT JOIN teams_users tu ON d.id_user = tu.id_user
       LEFT JOIN teams t ON tu.id_team = t.id_team
       LEFT JOIN nationalites_user nu ON d.id_user = nu.id_user
       LEFT JOIN nationalites n ON nu.id_nationalite = n.id_nationalite
       LEFT JOIN results r ON d.id_driver = r.id_driver
       LEFT JOIN bareme b ON r.id_bareme = b.id_bareme
       LEFT JOIN evenements e ON r.id_planning = e.id_planning
       LEFT JOIN saisons s ON e.id_saison = s.id_saison
       LEFT JOIN type_evenements te ON e.id_type_evenement = te.id_type_evenement
       WHERE s.annee = ?
       GROUP BY d.id_driver, u.firstname, u.lastname,
                t.libelle, t.id_team, n.libelle
       ORDER BY total_points DESC, wins DESC`,
      [year]
    );

    res.json({
      season: year,
      standings,
      count: standings.length
    });

  } catch (error) {
    console.error('Get driver standings error:', error);
    res.status(500).json({
      error: 'Failed to fetch driver standings',
      details: error.message
    });
  } finally {
    connection.release();
  }
};

// Get constructor (team) standings
export const getConstructorStandings = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { saison } = req.query;
    const year = saison || new Date().getFullYear();

    const [standings] = await connection.query(
      `SELECT
         t.id_team,
         t.libelle,
         SUM(b.point) as total_points,
         COUNT(DISTINCT e.id_planning) as races_entered,
         SUM(CASE WHEN b.place = 1 THEN 1 ELSE 0 END) as wins,
         SUM(CASE WHEN b.place <= 3 THEN 1 ELSE 0 END) as podiums
       FROM teams t
       LEFT JOIN teams_users tu ON t.id_team = tu.id_team
       LEFT JOIN users u ON tu.id_user = u.id_user
       LEFT JOIN drivers d ON u.id_user = d.id_user
       LEFT JOIN results r ON d.id_driver = r.id_driver
       LEFT JOIN bareme b ON r.id_bareme = b.id_bareme
       LEFT JOIN evenements e ON r.id_planning = e.id_planning
       LEFT JOIN saisons s ON e.id_saison = s.id_saison
       LEFT JOIN type_evenements te ON e.id_type_evenement = te.id_type_evenement
       WHERE s.annee = ?
       GROUP BY t.id_team, t.libelle
       HAVING total_points > 0
       ORDER BY total_points DESC, wins DESC`,
      [year]
    );

    res.json({
      season: year,
      standings,
      count: standings.length
    });

  } catch (error) {
    console.error('Get constructor standings error:', error);
    res.status(500).json({
      error: 'Failed to fetch constructor standings',
      details: error.message
    });
  } finally {
    connection.release();
  }
};

// Get race calendar
export const getRaceCalendar = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { saison } = req.query;
    const year = saison || new Date().getFullYear();

    const [calendar] = await connection.query(
      `SELECT
         e.id_planning,
         e.nom,
         e.date_heure,
         c.nom as circuit_nom,
         c.longueur,
         l.ville,
         l.pays,
         s.annee,
         te.libelle as type_libelle,
         (SELECT COUNT(*) FROM results r WHERE r.id_planning = e.id_planning) as has_results
       FROM evenements e
       INNER JOIN circuits c ON e.id_circuits = c.id_circuits
       INNER JOIN saisons s ON e.id_saison = s.id_saison
       INNER JOIN type_evenements te ON e.id_type_evenement = te.id_type_evenement
       LEFT JOIN localisations l ON c.id_localisation = l.id_localisation
       WHERE s.annee = ?
       ORDER BY e.date_heure`,
      [year]
    );

    res.json({
      season: year,
      calendar,
      count: calendar.length
    });

  } catch (error) {
    console.error('Get race calendar error:', error);
    res.status(500).json({
      error: 'Failed to fetch race calendar',
      details: error.message
    });
  } finally {
    connection.release();
  }
};

// Get overall statistics
export const getOverallStats = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const [stats] = await connection.query(`
      SELECT
        (SELECT COUNT(*) FROM drivers) as total_drivers,
        (SELECT COUNT(*) FROM teams) as total_teams,
        (SELECT COUNT(*) FROM circuits) as total_circuits,
        (SELECT COUNT(*) FROM evenements) as total_races,
        (SELECT COUNT(*) FROM results) as total_results,
        (SELECT COUNT(*) FROM saisons) as total_seasons
    `);

    // Get most successful driver
    const [topDriver] = await connection.query(`
      SELECT
        d.id_driver,
        u.firstname,
        u.lastname,
        d.points as total_points,
        (SELECT COUNT(*) FROM results r
         INNER JOIN bareme b ON r.id_bareme = b.id_bareme
         WHERE r.id_driver = d.id_driver AND b.place = 1) as wins
      FROM drivers d
      INNER JOIN users u ON d.id_user = u.id_user
      ORDER BY d.points DESC
      LIMIT 1
    `);

    // Get most successful team
    const [topTeam] = await connection.query(`
      SELECT
        t.id_team,
        t.libelle,
        t.points as total_points,
        (SELECT COUNT(*) FROM results r
         INNER JOIN bareme b ON r.id_bareme = b.id_bareme
         INNER JOIN drivers d ON r.id_driver = d.id_driver
         INNER JOIN teams_users tu ON d.id_user = tu.id_user
         WHERE tu.id_team = t.id_team AND b.place = 1) as wins
      FROM teams t
      ORDER BY t.points DESC
      LIMIT 1
    `);

    res.json({
      overall: stats[0],
      topDriver: topDriver[0] || null,
      topTeam: topTeam[0] || null
    });

  } catch (error) {
    console.error('Get overall stats error:', error);
    res.status(500).json({
      error: 'Failed to fetch overall statistics',
      details: error.message
    });
  } finally {
    connection.release();
  }
};

// Get recent race results
export const getRecentResults = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const limit = parseInt(req.query.limit) || 5;

    const [recentRaces] = await connection.query(
      `SELECT
         e.id_planning,
         e.nom,
         e.date_heure,
         c.nom as circuit_nom,
         l.ville,
         l.pays,
         s.annee
       FROM evenements e
       INNER JOIN circuits c ON e.id_circuits = c.id_circuits
       INNER JOIN saisons s ON e.id_saison = s.id_saison
       LEFT JOIN localisations l ON c.id_localisation = l.id_localisation
       WHERE e.date_heure <= CURDATE()
       ORDER BY e.date_heure DESC
       LIMIT ?`,
      [limit]
    );

    // Get top 3 results for each race
    const racesWithResults = await Promise.all(
      recentRaces.map(async (race) => {
        const [results] = await connection.query(
          `SELECT
             r.id_result,
             u.firstname,
             u.lastname,
             t.libelle,
             b.place,
             b.point
           FROM results r
           INNER JOIN drivers d ON r.id_driver = d.id_driver
           INNER JOIN users u ON d.id_user = u.id_user
           LEFT JOIN teams_users tu ON u.id_user = tu.id_user
           LEFT JOIN teams t ON tu.id_team = t.id_team
           LEFT JOIN bareme b ON r.id_bareme = b.id_bareme
           WHERE r.id_planning = ?
           ORDER BY b.place ASC
           LIMIT 3`,
          [race.id_planning]
        );

        return {
          ...race,
          topResults: results
        };
      })
    );

    res.json(racesWithResults);

  } catch (error) {
    console.error('Get recent results error:', error);
    res.status(500).json({
      error: 'Failed to fetch recent results',
      details: error.message
    });
  } finally {
    connection.release();
  }
};
