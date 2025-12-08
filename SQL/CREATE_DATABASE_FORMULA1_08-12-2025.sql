-- ============================================
-- Script de création de la base de données pour le projet Formula 1
-- Date : 08-12-2025
-- ============================================

-- Suppression des tables si elles existent
DROP TABLE IF EXISTS results;
DROP TABLE IF EXISTS evenements;
DROP TABLE IF EXISTS circuits;
DROP TABLE IF EXISTS localisations;
DROP TABLE IF EXISTS drivers;
DROP TABLE IF EXISTS bareme;
DROP TABLE IF EXISTS teams_users;
DROP TABLE IF EXISTS users_type_users;
DROP TABLE IF EXISTS nationalites_user;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS teams;
DROP TABLE IF EXISTS type_users;
DROP TABLE IF EXISTS nationalites;
DROP TABLE IF EXISTS saisons;
DROP TABLE IF EXISTS type_evenements;

-- ============================================
-- Tables de référence
-- ============================================

-- Table type_users
CREATE TABLE type_users (
    id_type_user INT AUTO_INCREMENT,
    libelle VARCHAR(50) NOT NULL,
    PRIMARY KEY (id_type_user)
);

-- Table nationalites
CREATE TABLE nationalites (
    id_nationalite INT AUTO_INCREMENT,
    libelle VARCHAR(50) NOT NULL,
    PRIMARY KEY (id_nationalite)
);

-- Table saisons
CREATE TABLE saisons (
    id_saison INT AUTO_INCREMENT,
    nom VARCHAR(50) NOT NULL,
    annee INT NOT NULL,
    date_debut DATE,
    date_fin DATE,
    PRIMARY KEY (id_saison)
);

-- Table type_evenements
CREATE TABLE type_evenements (
    id_type_evenement INT AUTO_INCREMENT,
    libelle VARCHAR(50) NOT NULL,
    PRIMARY KEY (id_type_evenement)
);

-- Table bareme (points par position)
CREATE TABLE bareme (
    id_bareme INT AUTO_INCREMENT,
    place INT NOT NULL,
    point INT NOT NULL,
    PRIMARY KEY (id_bareme),
    UNIQUE KEY unique_place (place)
);

-- ============================================
-- Tables principales
-- ============================================

-- Table users
CREATE TABLE users (
    id_user INT AUTO_INCREMENT,
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    PRIMARY KEY (id_user)
);

-- Table teams
CREATE TABLE teams (
    id_team INT AUTO_INCREMENT,
    libelle VARCHAR(50) NOT NULL,
    date_creation DATE,
    points INT DEFAULT 0,
    PRIMARY KEY (id_team)
);

-- Table drivers
CREATE TABLE drivers (
    id_driver INT AUTO_INCREMENT,
    points INT DEFAULT 0,
    id_user INT NOT NULL,
    PRIMARY KEY (id_driver),
    FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE
);

-- Table localisations
CREATE TABLE localisations (
    id_localisation INT AUTO_INCREMENT,
    ville VARCHAR(50) NOT NULL,
    pays VARCHAR(50) NOT NULL,
    PRIMARY KEY (id_localisation)
);

-- Table circuits
CREATE TABLE circuits (
    id_circuits INT AUTO_INCREMENT,
    nom VARCHAR(50) NOT NULL,
    longueur DECIMAL(15,2),
    id_localisation INT,
    PRIMARY KEY (id_circuits),
    FOREIGN KEY (id_localisation) REFERENCES localisations(id_localisation) ON DELETE SET NULL
);

-- Table evenements
CREATE TABLE evenements (
    id_planning INT AUTO_INCREMENT,
    nom VARCHAR(50) NOT NULL,
    date_heure DATETIME NOT NULL,
    id_type_evenement INT,
    id_saison INT,
    id_circuits INT,
    PRIMARY KEY (id_planning),
    FOREIGN KEY (id_type_evenement) REFERENCES type_evenements(id_type_evenement) ON DELETE SET NULL,
    FOREIGN KEY (id_saison) REFERENCES saisons(id_saison) ON DELETE CASCADE,
    FOREIGN KEY (id_circuits) REFERENCES circuits(id_circuits) ON DELETE SET NULL
);

-- Table results
CREATE TABLE results (
    id_result INT AUTO_INCREMENT,
    id_driver INT NOT NULL,
    id_bareme INT,
    id_planning INT NOT NULL,
    PRIMARY KEY (id_result),
    FOREIGN KEY (id_driver) REFERENCES drivers(id_driver) ON DELETE CASCADE,
    FOREIGN KEY (id_bareme) REFERENCES bareme(id_bareme) ON DELETE SET NULL,
    FOREIGN KEY (id_planning) REFERENCES evenements(id_planning) ON DELETE CASCADE,
    UNIQUE KEY unique_driver_event (id_driver, id_planning)
);

-- ============================================
-- Tables de liaison (many-to-many)
-- ============================================

-- Table nationalites_user
CREATE TABLE nationalites_user (
    id_user INT,
    id_nationalite INT,
    PRIMARY KEY (id_user, id_nationalite),
    FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE,
    FOREIGN KEY (id_nationalite) REFERENCES nationalites(id_nationalite) ON DELETE CASCADE
);

-- Table users_type_users
CREATE TABLE users_type_users (
    id_user INT,
    id_type_user INT,
    PRIMARY KEY (id_user, id_type_user),
    FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE,
    FOREIGN KEY (id_type_user) REFERENCES type_users(id_type_user) ON DELETE CASCADE
);

-- Table teams_users
CREATE TABLE teams_users (
    id_user INT,
    id_team INT,
    PRIMARY KEY (id_user, id_team),
    FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE,
    FOREIGN KEY (id_team) REFERENCES teams(id_team) ON DELETE CASCADE
);

-- ============================================
-- FIN DU SCRIPT
-- ============================================