-- ============================================
-- Script de données référentielles
-- Site Formule 1
-- ============================================

-- ============================================
-- Types d'utilisateurs
-- ============================================
INSERT INTO type_users (libelle) VALUES 
('Pilote'),
('Directeur'),
('Mécanicien'),
('Ingénieur'),
('Fan');

-- ============================================
-- Types d'événements
-- ============================================
INSERT INTO type_evenements (libelle) VALUES 
('Essais libres 1'),
('Essais libres 2'),
('Essais libres 3'),
('Qualifications'),
('Qualifications Sprint'),
('Course principale'),
('Sprint');

-- ============================================
-- Barème de points F1 (Course principale)
-- ============================================
INSERT INTO bareme (place, point) VALUES 
(1, 25),
(2, 18),
(3, 15),
(4, 12),
(5, 10),
(6, 8),
(7, 6),
(8, 4),
(9, 2),
(10, 1);

-- ============================================
-- Nationalités
-- ============================================
INSERT INTO nationalites (libelle) VALUES 
('Pays-Bas'),
('Royaume-Uni'),
('Australie'),
('Monaco'),
('Espagne'),
('France'),
('Italie'),
('Japon'),
('Thaïlande'),
('Canada'),
('Nouvelle-Zélande'),
('Allemagne'),
('Brésil'),
('Argentine'),
('Mexique'),
('Finlande'),
('Danemark'),
('Belgique'),
('Chine'),
('États-Unis');

-- ============================================
-- Saisons
-- ============================================
INSERT INTO saisons (nom, annee, date_debut, date_fin) VALUES 
('Saison F1 2024', 2024, '2024-03-02', '2024-12-08'),
('Saison F1 2025', 2025, '2025-03-14', '2025-12-07'),
('Saison F1 2026', 2026, '2026-03-06', '2026-12-04');

-- ============================================
-- FIN DU SCRIPT
-- ============================================