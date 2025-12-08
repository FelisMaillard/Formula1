-- ============================================
-- Script de données complètes - Saison F1 2025
-- Site Formule 1
-- ============================================

-- ============================================
-- ÉQUIPES F1 2025
-- ============================================
INSERT INTO teams (libelle, date_creation, points) VALUES 
('McLaren', '1963-09-02', 666),
('Red Bull Racing', '2005-01-01', 589),
('Ferrari', '1950-01-01', 652),
('Mercedes', '1954-01-01', 468),
('Aston Martin', '2021-01-01', 86),
('Alpine', '2021-01-01', 65),
('Haas F1 Team', '2016-01-01', 58),
('Racing Bulls', '2006-01-01', 46),
('Williams', '1977-01-01', 17),
('Kick Sauber', '1993-01-01', 4);

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
-- RÉSULTATS SÉLECTIONNÉS DE LA SAISON 2025
-- ============================================

-- Grand Prix d'Australie (Victoire : Lando Norris)
INSERT INTO results (id_driver, id_bareme, id_planning) VALUES 
(2, 1, 1),  -- Lando Norris - 1er (25 pts)
(3, 2, 1),  -- Max Verstappen - 2e (18 pts)
(7, 3, 1);  -- George Russell - 3e (15 pts)

-- Grand Prix de Chine (Victoire : Oscar Piastri)
INSERT INTO results (id_driver, id_bareme, id_planning) VALUES 
(1, 1, 2),  -- Oscar Piastri - 1er (25 pts)
(2, 2, 2),  -- Lando Norris - 2e (18 pts)
(7, 3, 2);  -- George Russell - 3e (15 pts)

-- Grand Prix du Japon (Victoire : Max Verstappen)
INSERT INTO results (id_driver, id_bareme, id_planning) VALUES 
(3, 1, 3),  -- Max Verstappen - 1er (25 pts)
(2, 2, 3),  -- Lando Norris - 2e (18 pts)
(1, 3, 3);  -- Oscar Piastri - 3e (15 pts)

-- Grand Prix de Bahreïn (Victoire : Oscar Piastri)
INSERT INTO results (id_driver, id_bareme, id_planning) VALUES 
(1, 1, 4),  -- Oscar Piastri - 1er (25 pts)
(2, 2, 4),  -- Lando Norris - 2e (18 pts)
(5, 3, 4);  -- Charles Leclerc - 3e (15 pts)

-- Grand Prix d'Arabie Saoudite (Victoire : Oscar Piastri)
INSERT INTO results (id_driver, id_bareme, id_planning) VALUES 
(1, 1, 5),  -- Oscar Piastri - 1er (25 pts)
(5, 2, 5),  -- Charles Leclerc - 2e (18 pts)
(7, 3, 5);  -- George Russell - 3e (15 pts)

-- Grand Prix de Miami (Victoire : Oscar Piastri)
INSERT INTO results (id_driver, id_bareme, id_planning) VALUES 
(1, 1, 6),  -- Oscar Piastri - 1er (25 pts)
(3, 2, 6),  -- Max Verstappen - 2e (18 pts)
(5, 3, 6);  -- Charles Leclerc - 3e (15 pts)

-- Grand Prix d'Italie (Victoire : Max Verstappen)
INSERT INTO results (id_driver, id_bareme, id_planning) VALUES 
(3, 1, 16),  -- Max Verstappen - 1er (25 pts)
(1, 2, 16),  -- Oscar Piastri - 2e (18 pts)
(5, 3, 16);  -- Charles Leclerc - 3e (15 pts)

-- Grand Prix d'Azerbaïdjan (Victoire : Max Verstappen)
INSERT INTO results (id_driver, id_bareme, id_planning) VALUES 
(3, 1, 17),  -- Max Verstappen - 1er (25 pts)
(1, 2, 17),  -- Oscar Piastri - 2e (18 pts)
(5, 3, 17);  -- Charles Leclerc - 3e (15 pts)

-- Grand Prix d'Abu Dhabi - FINALE (Victoire : Max Verstappen)
-- Lando Norris devient Champion du Monde avec sa 3e place
INSERT INTO results (id_driver, id_bareme, id_planning) VALUES 
(3, 1, 24),  -- Max Verstappen - 1er (25 pts)
(1, 2, 24),  -- Oscar Piastri - 2e (18 pts)
(2, 3, 24),  -- Lando Norris - 3e (15 pts) - CHAMPION DU MONDE 2025
(5, 4, 24),  -- Charles Leclerc - 4e (12 pts)
(7, 5, 24),  -- George Russell - 5e (10 pts)
(9, 6, 24),  -- Fernando Alonso - 6e (8 pts)
(13, 7, 24), -- Esteban Ocon - 7e (6 pts)
(6, 8, 24),  -- Lewis Hamilton - 8e (4 pts)
(19, 9, 24), -- Nico Hulkenberg - 9e (2 pts)
(10, 10, 24); -- Lance Stroll - 10e (1 pt)

-- ============================================
-- FIN DU SCRIPT
-- ============================================