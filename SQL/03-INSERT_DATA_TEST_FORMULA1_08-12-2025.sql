-- ============================================
-- Script de données complètes - Saison F1 2025
-- Site Formule 1
-- ============================================

-- ============================================
-- ÉQUIPES F1 2025
-- ============================================
INSERT INTO teams (libelle, date_creation, points) VALUES 
('McLaren', '1963-09-02', 0),
('Red Bull Racing', '2005-01-01', 0),
('Ferrari', '1950-01-01', 0),
('Mercedes', '1954-01-01', 0),
('Aston Martin', '2021-01-01', 0),
('Alpine', '2021-01-01', 0),
('Haas F1 Team', '2016-01-01', 0),
('Racing Bulls', '2006-01-01', 0),
('Williams', '1977-01-01', 0),
('Kick Sauber', '1993-01-01', 0);

-- ============================================
-- LOCALISATIONS DES CIRCUITS
-- ============================================
INSERT INTO localisations (ville, pays) VALUES 
-- Océanie
('Melbourne', 'Australie'),
-- Asie
('Shanghai', 'Chine'),
('Suzuka', 'Japon'),
('Sakhir', 'Bahreïn'),
('Jeddah', 'Arabie Saoudite'),
('Singapour', 'Singapour'),
('Lusail', 'Qatar'),
-- Amérique du Nord
('Miami', 'États-Unis'),
('Montréal', 'Canada'),
('Austin', 'États-Unis'),
('Mexico', 'Mexique'),
('Las Vegas', 'États-Unis'),
-- Amérique du Sud
('São Paulo', 'Brésil'),
-- Europe
('Imola', 'Italie'),
('Monte-Carlo', 'Monaco'),
('Barcelone', 'Espagne'),
('Spielberg', 'Autriche'),
('Silverstone', 'Royaume-Uni'),
('Budapest', 'Hongrie'),
('Spa-Francorchamps', 'Belgique'),
('Zandvoort', 'Pays-Bas'),
('Monza', 'Italie'),
('Bakou', 'Azerbaïdjan'),
('Abu Dhabi', 'Émirats Arabes Unis');

-- ============================================
-- CIRCUITS F1 2025
-- ============================================
INSERT INTO circuits (nom, longueur, id_localisation) VALUES 
('Albert Park Circuit', 5.278, 1),
('Shanghai International Circuit', 5.451, 2),
('Suzuka International Racing Course', 5.807, 3),
('Bahrain International Circuit', 5.412, 4),
('Jeddah Corniche Circuit', 6.174, 5),
('Marina Bay Street Circuit', 4.940, 6),
('Lusail International Circuit', 5.380, 7),
('Miami International Autodrome', 5.410, 8),
('Circuit Gilles Villeneuve', 4.361, 9),
('Circuit of the Americas', 5.513, 10),
('Autódromo Hermanos Rodríguez', 4.304, 11),
('Las Vegas Street Circuit', 6.120, 12),
('Autódromo José Carlos Pace', 4.309, 13),
('Autodromo Enzo e Dino Ferrari', 4.909, 14),
('Circuit de Monaco', 3.337, 15),
('Circuit de Barcelona-Catalunya', 4.675, 16),
('Red Bull Ring', 4.318, 17),
('Silverstone Circuit', 5.891, 18),
('Hungaroring', 4.381, 19),
('Circuit de Spa-Francorchamps', 7.004, 20),
('Circuit Park Zandvoort', 4.259, 21),
('Autodromo Nazionale di Monza', 5.793, 22),
('Baku City Circuit', 6.003, 23),
('Yas Marina Circuit', 5.281, 24);

-- ============================================
-- UTILISATEURS - PILOTES F1 2025
-- ============================================
INSERT INTO users (firstname, lastname, email) VALUES 
-- McLaren
('Oscar', 'Piastri', 'oscar.piastri@mclaren.com'),
('Lando', 'Norris', 'lando.norris@mclaren.com'),
-- Red Bull Racing
('Max', 'Verstappen', 'max.verstappen@redbull.com'),
('Yuki', 'Tsunoda', 'yuki.tsunoda@redbull.com'),
-- Ferrari
('Charles', 'Leclerc', 'charles.leclerc@ferrari.com'),
('Lewis', 'Hamilton', 'lewis.hamilton@ferrari.com'),
-- Mercedes
('George', 'Russell', 'george.russell@mercedes.com'),
('Andrea Kimi', 'Antonelli', 'kimi.antonelli@mercedes.com'),
-- Aston Martin
('Fernando', 'Alonso', 'fernando.alonso@astonmartin.com'),
('Lance', 'Stroll', 'lance.stroll@astonmartin.com'),
-- Alpine
('Pierre', 'Gasly', 'pierre.gasly@alpine.com'),
('Franco', 'Colapinto', 'franco.colapinto@alpine.com'),
-- Haas
('Esteban', 'Ocon', 'esteban.ocon@haas.com'),
('Oliver', 'Bearman', 'oliver.bearman@haas.com'),
-- Racing Bulls
('Liam', 'Lawson', 'liam.lawson@racingbulls.com'),
('Isack', 'Hadjar', 'isack.hadjar@racingbulls.com'),
-- Williams
('Alexander', 'Albon', 'alex.albon@williams.com'),
('Carlos', 'Sainz', 'carlos.sainz@williams.com'),
-- Kick Sauber
('Nico', 'Hulkenberg', 'nico.hulkenberg@sauber.com'),
('Gabriel', 'Bortoleto', 'gabriel.bortoleto@sauber.com');

-- ============================================
-- DRIVERS (Pilotes actifs en 2025)
-- ============================================
INSERT INTO drivers (points, id_user) VALUES 
-- McLaren
(408, 1),  -- Oscar Piastri
(423, 2),  -- Lando Norris - Champion 2025
-- Red Bull Racing
(421, 3),  -- Max Verstappen
(152, 4),  -- Yuki Tsunoda
-- Ferrari
(356, 5),  -- Charles Leclerc
(189, 6),  -- Lewis Hamilton
-- Mercedes
(245, 7),  -- George Russell
(142, 8),  -- Kimi Antonelli
-- Aston Martin
(70, 9),   -- Fernando Alonso
(16, 10),  -- Lance Stroll
-- Alpine
(36, 11),  -- Pierre Gasly
(29, 12),  -- Franco Colapinto
-- Haas
(48, 13),  -- Esteban Ocon
(10, 14),  -- Oliver Bearman
-- Racing Bulls
(28, 15),  -- Liam Lawson
(18, 16),  -- Isack Hadjar
-- Williams
(12, 17),  -- Alexander Albon
(5, 18),   -- Carlos Sainz
-- Kick Sauber
(3, 19),   -- Nico Hulkenberg
(1, 20);   -- Gabriel Bortoleto

-- ============================================
-- NATIONALITÉS DES PILOTES
-- ============================================
-- Oscar Piastri - Australie
INSERT INTO nationalites_user (id_user, id_nationalite) VALUES (1, 3);
-- Lando Norris - Royaume-Uni
INSERT INTO nationalites_user (id_user, id_nationalite) VALUES (2, 2);
-- Max Verstappen - Pays-Bas
INSERT INTO nationalites_user (id_user, id_nationalite) VALUES (3, 1);
-- Yuki Tsunoda - Japon
INSERT INTO nationalites_user (id_user, id_nationalite) VALUES (4, 8);
-- Charles Leclerc - Monaco
INSERT INTO nationalites_user (id_user, id_nationalite) VALUES (5, 4);
-- Lewis Hamilton - Royaume-Uni
INSERT INTO nationalites_user (id_user, id_nationalite) VALUES (6, 2);
-- George Russell - Royaume-Uni
INSERT INTO nationalites_user (id_user, id_nationalite) VALUES (7, 2);
-- Kimi Antonelli - Italie
INSERT INTO nationalites_user (id_user, id_nationalite) VALUES (8, 7);
-- Fernando Alonso - Espagne
INSERT INTO nationalites_user (id_user, id_nationalite) VALUES (9, 5);
-- Lance Stroll - Canada
INSERT INTO nationalites_user (id_user, id_nationalite) VALUES (10, 10);
-- Pierre Gasly - France
INSERT INTO nationalites_user (id_user, id_nationalite) VALUES (11, 6);
-- Franco Colapinto - Argentine
INSERT INTO nationalites_user (id_user, id_nationalite) VALUES (12, 14);
-- Esteban Ocon - France
INSERT INTO nationalites_user (id_user, id_nationalite) VALUES (13, 6);
-- Oliver Bearman - Royaume-Uni
INSERT INTO nationalites_user (id_user, id_nationalite) VALUES (14, 2);
-- Liam Lawson - Nouvelle-Zélande
INSERT INTO nationalites_user (id_user, id_nationalite) VALUES (15, 11);
-- Isack Hadjar - France
INSERT INTO nationalites_user (id_user, id_nationalite) VALUES (16, 6);
-- Alexander Albon - Thaïlande
INSERT INTO nationalites_user (id_user, id_nationalite) VALUES (17, 9);
-- Carlos Sainz - Espagne
INSERT INTO nationalites_user (id_user, id_nationalite) VALUES (18, 5);
-- Nico Hulkenberg - Allemagne
INSERT INTO nationalites_user (id_user, id_nationalite) VALUES (19, 12);
-- Gabriel Bortoleto - Brésil
INSERT INTO nationalites_user (id_user, id_nationalite) VALUES (20, 13);

-- ============================================
-- TYPE UTILISATEUR - Tous sont pilotes
-- ============================================
INSERT INTO users_type_users (id_user, id_type_user) VALUES 
(1, 2), (2, 2), (3, 2), (4, 2), (5, 2),
(6, 2), (7, 2), (8, 2), (9, 2), (10, 2),
(11, 2), (12, 2), (13, 2), (14, 2), (15, 2),
(16, 2), (17, 2), (18, 2), (19, 2), (20, 2);

-- ============================================
-- ATTRIBUTION DES PILOTES AUX ÉQUIPES
-- ============================================
-- McLaren
INSERT INTO teams_users (id_user, id_team) VALUES 
(1, 1),  -- Oscar Piastri
(2, 1);  -- Lando Norris

-- Red Bull Racing
INSERT INTO teams_users (id_user, id_team) VALUES 
(3, 2),  -- Max Verstappen
(4, 2);  -- Yuki Tsunoda

-- Ferrari
INSERT INTO teams_users (id_user, id_team) VALUES 
(5, 3),  -- Charles Leclerc
(6, 3);  -- Lewis Hamilton

-- Mercedes
INSERT INTO teams_users (id_user, id_team) VALUES 
(7, 4),  -- George Russell
(8, 4);  -- Kimi Antonelli

-- Aston Martin
INSERT INTO teams_users (id_user, id_team) VALUES 
(9, 5),  -- Fernando Alonso
(10, 5); -- Lance Stroll

-- Alpine
INSERT INTO teams_users (id_user, id_team) VALUES 
(11, 6),  -- Pierre Gasly
(12, 6);  -- Franco Colapinto

-- Haas
INSERT INTO teams_users (id_user, id_team) VALUES 
(13, 7),  -- Esteban Ocon
(14, 7);  -- Oliver Bearman

-- Racing Bulls
INSERT INTO teams_users (id_user, id_team) VALUES 
(15, 8),  -- Liam Lawson
(16, 8);  -- Isack Hadjar

-- Williams
INSERT INTO teams_users (id_user, id_team) VALUES 
(17, 9),  -- Alexander Albon
(18, 9);  -- Carlos Sainz

-- Kick Sauber
INSERT INTO teams_users (id_user, id_team) VALUES 
(19, 10), -- Nico Hulkenberg
(20, 10); -- Gabriel Bortoleto

-- ============================================
-- ÉVÉNEMENTS DE LA SAISON 2025 (Courses principales)
-- ============================================
INSERT INTO evenements (nom, date_heure, id_type_evenement, id_saison, id_circuits) VALUES 
('Grand Prix d\'Australie', '2025-03-16 15:00:00', 5, 2, 1),
('Grand Prix de Chine', '2025-03-23 15:00:00', 5, 2, 2),
('Grand Prix du Japon', '2025-04-06 14:00:00', 5, 2, 3),
('Grand Prix de Bahreïn', '2025-04-13 18:00:00', 5, 2, 4),
('Grand Prix d\'Arabie Saoudite', '2025-04-20 20:00:00', 5, 2, 5),
('Grand Prix de Miami', '2025-05-04 15:30:00', 5, 2, 8),
('Grand Prix d\'Émilie-Romagne', '2025-05-18 15:00:00', 5, 2, 14),
('Grand Prix de Monaco', '2025-05-25 15:00:00', 5, 2, 15),
('Grand Prix d\'Espagne', '2025-06-01 15:00:00', 5, 2, 16),
('Grand Prix du Canada', '2025-06-15 14:00:00', 5, 2, 9),
('Grand Prix d\'Autriche', '2025-06-29 15:00:00', 5, 2, 17),
('Grand Prix de Grande-Bretagne', '2025-07-06 15:00:00', 5, 2, 18),
('Grand Prix de Hongrie', '2025-07-27 15:00:00', 5, 2, 19),
('Grand Prix de Belgique', '2025-08-31 15:00:00', 5, 2, 20),
('Grand Prix des Pays-Bas', '2025-09-07 15:00:00', 5, 2, 21),
('Grand Prix d\'Italie', '2025-09-14 15:00:00', 5, 2, 22),
('Grand Prix d\'Azerbaïdjan', '2025-09-21 15:00:00', 5, 2, 23),
('Grand Prix de Singapour', '2025-10-05 20:00:00', 5, 2, 6),
('Grand Prix des États-Unis', '2025-10-19 14:00:00', 5, 2, 10),
('Grand Prix du Mexique', '2025-10-26 14:00:00', 5, 2, 11),
('Grand Prix du Brésil', '2025-11-09 14:00:00', 5, 2, 13),
('Grand Prix de Las Vegas', '2025-11-22 22:00:00', 5, 2, 12),
('Grand Prix du Qatar', '2025-11-30 17:00:00', 5, 2, 7),
('Grand Prix d\'Abu Dhabi', '2025-12-07 17:00:00', 5, 2, 24);

-- ============================================
-- RÉSULTATS COMPLETS DE LA SAISON 2025
-- Ferrari et Leclerc dominent - Verstappen et Red Bull en difficulté
-- ============================================

-- Grand Prix d'Australie
INSERT INTO results (id_driver, id_bareme, id_planning) VALUES 
(5, 1, 1), (6, 2, 1), (18, 3, 1), (7, 4, 1), (2, 5, 1), (1, 6, 1), (9, 7, 1), (4, 8, 1), (11, 9, 1), (3, 10, 1);

-- Grand Prix de Chine
INSERT INTO results (id_driver, id_bareme, id_planning) VALUES 
(6, 1, 2), (5, 2, 2), (7, 3, 2), (18, 4, 2), (2, 5, 2), (1, 6, 2), (9, 7, 2), (11, 8, 2), (4, 9, 2), (3, 10, 2);

-- Grand Prix du Japon
INSERT INTO results (id_driver, id_bareme, id_planning) VALUES 
(5, 1, 3), (18, 2, 3), (6, 3, 3), (2, 4, 3), (7, 5, 3), (1, 6, 3), (9, 7, 3), (11, 8, 3), (4, 9, 3), (3, 10, 3);

-- Grand Prix de Bahreïn
INSERT INTO results (id_driver, id_bareme, id_planning) VALUES 
(5, 1, 4), (6, 2, 4), (7, 3, 4), (18, 4, 4), (2, 5, 4), (1, 6, 4), (9, 7, 4), (11, 8, 4), (4, 9, 4), (3, 10, 4);

-- Grand Prix d'Arabie Saoudite
INSERT INTO results (id_driver, id_bareme, id_planning) VALUES 
(6, 1, 5), (5, 2, 5), (18, 3, 5), (7, 4, 5), (2, 5, 5), (1, 6, 5), (9, 7, 5), (11, 8, 5), (4, 9, 5), (3, 10, 5);

-- Grand Prix de Miami
INSERT INTO results (id_driver, id_bareme, id_planning) VALUES 
(5, 1, 6), (6, 2, 6), (2, 3, 6), (18, 4, 6), (7, 5, 6), (1, 6, 6), (9, 7, 6), (11, 8, 6), (4, 9, 6), (3, 10, 6);

-- Grand Prix d'Émilie-Romagne
INSERT INTO results (id_driver, id_bareme, id_planning) VALUES 
(5, 1, 7), (18, 2, 7), (6, 3, 7), (7, 4, 7), (2, 5, 7), (1, 6, 7), (9, 7, 7), (11, 8, 7), (4, 9, 7), (3, 10, 7);

-- Grand Prix de Monaco
INSERT INTO results (id_driver, id_bareme, id_planning) VALUES 
(5, 1, 8), (6, 2, 8), (18, 3, 8), (7, 4, 8), (2, 5, 8), (1, 6, 8), (9, 7, 8), (11, 8, 8), (4, 9, 8), (3, 10, 8);

-- Grand Prix d'Espagne
INSERT INTO results (id_driver, id_bareme, id_planning) VALUES 
(6, 1, 9), (5, 2, 9), (7, 3, 9), (18, 4, 9), (2, 5, 9), (1, 6, 9), (9, 7, 9), (11, 8, 9), (4, 9, 9), (3, 10, 9);

-- Grand Prix du Canada
INSERT INTO results (id_driver, id_bareme, id_planning) VALUES 
(5, 1, 10), (6, 2, 10), (7, 3, 10), (2, 4, 10), (18, 5, 10), (1, 6, 10), (9, 7, 10), (11, 8, 10), (4, 9, 10), (3, 10, 10);

-- Grand Prix d'Autriche
INSERT INTO results (id_driver, id_bareme, id_planning) VALUES 
(5, 1, 11), (6, 2, 11), (18, 3, 11), (7, 4, 11), (2, 5, 11), (1, 6, 11), (9, 7, 11), (11, 8, 11), (4, 9, 11), (3, 10, 11);

-- Grand Prix de Grande-Bretagne
INSERT INTO results (id_driver, id_bareme, id_planning) VALUES 
(6, 1, 12), (7, 2, 12), (5, 3, 12), (18, 4, 12), (2, 5, 12), (1, 6, 12), (9, 7, 12), (11, 8, 12), (4, 9, 12), (3, 10, 12);

-- Grand Prix de Hongrie
INSERT INTO results (id_driver, id_bareme, id_planning) VALUES 
(5, 1, 13), (6, 2, 13), (2, 3, 13), (18, 4, 13), (7, 5, 13), (1, 6, 13), (9, 7, 13), (11, 8, 13), (4, 9, 13), (3, 10, 13);

-- Grand Prix de Belgique
INSERT INTO results (id_driver, id_bareme, id_planning) VALUES 
(6, 1, 14), (5, 2, 14), (7, 3, 14), (18, 4, 14), (2, 5, 14), (1, 6, 14), (9, 7, 14), (11, 8, 14), (4, 9, 14), (3, 10, 14);

-- Grand Prix des Pays-Bas
INSERT INTO results (id_driver, id_bareme, id_planning) VALUES 
(5, 1, 15), (6, 2, 15), (18, 3, 15), (7, 4, 15), (2, 5, 15), (1, 6, 15), (9, 7, 15), (11, 8, 15), (4, 9, 15), (3, 10, 15);

-- Grand Prix d'Italie
INSERT INTO results (id_driver, id_bareme, id_planning) VALUES 
(5, 1, 16), (18, 2, 16), (6, 3, 16), (7, 4, 16), (2, 5, 16), (1, 6, 16), (9, 7, 16), (11, 8, 16), (4, 9, 16), (3, 10, 16);

-- Grand Prix d'Azerbaïdjan
INSERT INTO results (id_driver, id_bareme, id_planning) VALUES 
(6, 1, 17), (5, 2, 17), (7, 3, 17), (18, 4, 17), (2, 5, 17), (1, 6, 17), (9, 7, 17), (11, 8, 17), (4, 9, 17), (3, 10, 17);

-- Grand Prix de Singapour
INSERT INTO results (id_driver, id_bareme, id_planning) VALUES 
(5, 1, 18), (6, 2, 18), (2, 3, 18), (7, 4, 18), (18, 5, 18), (1, 6, 18), (9, 7, 18), (11, 8, 18), (4, 9, 18), (3, 10, 18);

-- Grand Prix des États-Unis
INSERT INTO results (id_driver, id_bareme, id_planning) VALUES 
(5, 1, 19), (6, 2, 19), (18, 3, 19), (7, 4, 19), (2, 5, 19), (1, 6, 19), (9, 7, 19), (11, 8, 19), (4, 9, 19), (3, 10, 19);

-- Grand Prix du Mexique
INSERT INTO results (id_driver, id_bareme, id_planning) VALUES 
(6, 1, 20), (5, 2, 20), (18, 3, 20), (7, 4, 20), (2, 5, 20), (1, 6, 20), (9, 7, 20), (11, 8, 20), (4, 9, 20), (3, 10, 20);

-- Grand Prix du Brésil
INSERT INTO results (id_driver, id_bareme, id_planning) VALUES 
(5, 1, 21), (6, 2, 21), (7, 3, 21), (18, 4, 21), (2, 5, 21), (1, 6, 21), (9, 7, 21), (11, 8, 21), (4, 9, 21), (3, 10, 21);

-- Grand Prix de Las Vegas
INSERT INTO results (id_driver, id_bareme, id_planning) VALUES 
(6, 1, 22), (5, 2, 22), (7, 3, 22), (18, 4, 22), (2, 5, 22), (1, 6, 22), (9, 7, 22), (11, 8, 22), (4, 9, 22), (3, 10, 22);

-- Grand Prix du Qatar
INSERT INTO results (id_driver, id_bareme, id_planning) VALUES 
(5, 1, 23), (6, 2, 23), (7, 3, 23), (18, 4, 23), (2, 5, 23), (1, 6, 23), (9, 7, 23), (11, 8, 23), (4, 9, 23), (3, 10, 23);

-- Grand Prix d'Abu Dhabi - FINALE
-- Charles Leclerc devient Champion du Monde 2025!
INSERT INTO results (id_driver, id_bareme, id_planning) VALUES 
(5, 1, 24), (6, 2, 24), (18, 3, 24), (7, 4, 24), (2, 5, 24), (1, 6, 24), (9, 7, 24), (11, 8, 24), (4, 9, 24), (3, 10, 24);

-- ============================================
-- MISE À JOUR DES POINTS
-- ============================================

-- Mise à jour automatique des points pilotes
UPDATE drivers d SET points = (
    SELECT COALESCE(SUM(b.point), 0)
    FROM results r
    INNER JOIN bareme b ON r.id_bareme = b.id_bareme
    WHERE r.id_driver = d.id_driver
);

-- Mise à jour automatique des points équipes
UPDATE teams t SET points = (
    SELECT COALESCE(SUM(b.point), 0)
    FROM results r
    INNER JOIN bareme b ON r.id_bareme = b.id_bareme
    INNER JOIN drivers d ON r.id_driver = d.id_driver
    INNER JOIN teams_users tu ON d.id_user = tu.id_user
    WHERE tu.id_team = t.id_team
);

-- ============================================
-- FIN DU SCRIPT
-- ============================================