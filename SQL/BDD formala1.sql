Use formula1;

CREATE VIEW classement_drivers AS
SELECT u.firstname, u.lastname, SUM(b.point) AS total_points
FROM users u
JOIN drivers d ON u.id_user = d.id_user
JOIN results r ON d.id_driver = r.id_driver
JOIN bareme b ON r.id_bareme = b.id_bareme
GROUP BY u.firstname, u.lastname
ORDER BY total_points DESC;

-- CREATE VIEW classement_drivers AS
-- SELECT u.firstname, u.lastname, SUM(b.point) AS total_points
-- FROM users u
-- JOIN drivers d ON u.id_user = d.id_user
-- JOIN results r ON d.id_driver = r.id_driver
-- JOIN bareme b ON r.id_bareme = b.id_bareme
-- GROUP BY u.firstname, u.lastname
-- HAVING SUM(b.point) > 50
-- ORDER BY total_points DESC;

-- Explain classement_drivers;

SELECT DISTINCT u.firstname, u.lastname, u.email
FROM users u
WHERE u.firstname LIKE 'M%' 
AND u.id_user IN (1, 2, 3, 4);


UPDATE teams
SET points = CASE
	WHEN points > 300 THEN points + 10
    WHEN points BETWEEN 100 AND 300 THEN points + 5
    ELSE points
END;

Explain teams;

DELETE FROM results
WHERE id_driver = 1;

SELECT libelle AS nom, 'Equipe' AS type FROM teams
UNION
SELECT firstname AS nom, 'Pilote' AS type FROM users
ORDER BY nom
LIMIT 10;

ALTER TABLE drivers
ADD COLUMN statut VARCHAR(20);

-- Explain drivers;

DROP TABLE IF EXISTS temp_stats;

SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE bareme;
SET FOREIGN_KEY_CHECKS=1;

EXPLAIN SELECT * FROM circuits WHERE longueur > 5000;

CREATE OR REPLACE VIEW top_teams AS
SELECT t.libelle, SUM(b.point) AS total_points
FROM teams t
JOIN teams_users tu ON t.id_team = tu.id_team
JOIN users u ON tu.id_user = u.id_user
JOIN drivers d ON u.id_user = d.id_user
JOIN results r ON d.id_driver = r.id_driver
JOIN bareme b ON r.id_bareme = b.id_bareme
GROUP BY t.libelle
ORDER BY total_points DESC;

-- Explain top_teams;

DROP VIEW IF EXISTS classement_drivers;

-- Explain classement_drivers;

SELECT l.pays, COUNT(u.id_user) AS nb_users
FROM users u
JOIN drivers d ON u.id_user = d.id_user
JOIN circuits c ON c.id_localisation = l.id_localisation
JOIN localisations l ON l.id_localisation = c.id_localisation
GROUP BY l.pays
HAVING COUNT(u.id_user) > 1;





