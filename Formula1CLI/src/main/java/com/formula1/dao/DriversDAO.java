package com.formula1.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import com.formula1.DatabaseConnection;
import com.formula1.model.Driver;

public class DriversDAO {

    public int create(Driver driver) {
        String sql = "INSERT INTO drivers (points, id_user) VALUES (?, ?)";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            ps.setInt(1, driver.getPoints());
            ps.setInt(2, driver.getIdUser());

            int rows = ps.executeUpdate();
            if (rows == 1) {
                try (ResultSet rs = ps.getGeneratedKeys()) {
                    if (rs.next()) {
                        driver.setId(rs.getInt(1));
                    }
                }
            }
            return rows;
        } catch (SQLException e) {
            System.err.println("[ERREUR] CREATE driver : " + e.getMessage());
            return 0;
        }
    }

    public List<Driver> findAll() {
        List<Driver> drivers = new ArrayList<>();
        String sql = "SELECT d.id_driver, d.points, d.id_user, u.firstname, u.lastname " +
                    "FROM drivers d " +
                    "JOIN users u ON d.id_user = u.id_user " +
                    "ORDER BY d.points DESC";

        try (Connection conn = DatabaseConnection.getConnection();
             Statement st = conn.createStatement();
             ResultSet rs = st.executeQuery(sql)) {

            while (rs.next()) {
                Driver driver = new Driver(
                    rs.getInt("id_driver"),
                    rs.getInt("points"),
                    rs.getInt("id_user")
                );
                driver.setFirstname(rs.getString("firstname"));
                driver.setLastname(rs.getString("lastname"));
                drivers.add(driver);
            }
        } catch (SQLException e) {
            System.err.println("[ERREUR] SELECT drivers : " + e.getMessage());
        }
        return drivers;
    }

    public Driver findById(int id) {
        String sql = "SELECT d.id_driver, d.points, d.id_user, u.firstname, u.lastname " +
                    "FROM drivers d " +
                    "JOIN users u ON d.id_user = u.id_user " +
                    "WHERE d.id_driver = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    Driver driver = new Driver(
                        rs.getInt("id_driver"),
                        rs.getInt("points"),
                        rs.getInt("id_user")
                    );
                    driver.setFirstname(rs.getString("firstname"));
                    driver.setLastname(rs.getString("lastname"));
                    return driver;
                }
            }
        } catch (SQLException e) {
            System.err.println("[ERREUR] FIND driver : " + e.getMessage());
        }
        return null;
    }

    public int update(Driver driver) {
        String sql = "UPDATE drivers SET points = ?, id_user = ? WHERE id_driver = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, driver.getPoints());
            ps.setInt(2, driver.getIdUser());
            ps.setInt(3, driver.getId());

            return ps.executeUpdate();
        } catch (SQLException e) {
            System.err.println("[ERREUR] UPDATE driver : " + e.getMessage());
            return 0;
        }
    }

    public int delete(int id) {
        String sql = "DELETE FROM drivers WHERE id_driver = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, id);
            return ps.executeUpdate();
        } catch (SQLException e) {
            System.err.println("[ERREUR] DELETE driver : " + e.getMessage());
            return 0;
        }
    }

    /**
     * Récupère les pilotes d'une équipe spécifique
     */
    public List<Driver> findByTeam(int teamId) {
        List<Driver> drivers = new ArrayList<>();
        String sql = "SELECT d.id_driver, d.points, d.id_user, u.firstname, u.lastname " +
                    "FROM drivers d " +
                    "JOIN users u ON d.id_user = u.id_user " +
                    "JOIN teams_users tu ON d.id_user = tu.id_user " +
                    "WHERE tu.id_team = ? " +
                    "ORDER BY d.points DESC";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, teamId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Driver driver = new Driver(
                        rs.getInt("id_driver"),
                        rs.getInt("points"),
                        rs.getInt("id_user")
                    );
                    driver.setFirstname(rs.getString("firstname"));
                    driver.setLastname(rs.getString("lastname"));
                    drivers.add(driver);
                }
            }
        } catch (SQLException e) {
            System.err.println("[ERREUR] FIND drivers by team : " + e.getMessage());
        }
        return drivers;
    }

    /**
     * Récupère le classement des pilotes 2025
     */
    public void getDriverStandings() {
        String sql = "SELECT d.id_driver, d.points, u.firstname, u.lastname, t.libelle as team_name " +
                    "FROM drivers d " +
                    "JOIN users u ON d.id_user = u.id_user " +
                    "LEFT JOIN teams_users tu ON d.id_user = tu.id_user " +
                    "LEFT JOIN teams t ON tu.id_team = t.id_team " +
                    "ORDER BY d.points DESC";

        try (Connection conn = DatabaseConnection.getConnection();
             Statement st = conn.createStatement();
             ResultSet rs = st.executeQuery(sql)) {

            System.out.println("\n=== CLASSEMENT PILOTES F1 2025 ===");
            int position = 1;
            while (rs.next()) {
                String team = rs.getString("team_name") != null ? rs.getString("team_name") : "Sans équipe";
                System.out.printf("%2d. %s %s (%d pts) - %s%n", 
                    position++, 
                    rs.getString("firstname"), 
                    rs.getString("lastname"), 
                    rs.getInt("points"),
                    team
                );
            }
        } catch (SQLException e) {
            System.err.println("[ERREUR] Driver standings : " + e.getMessage());
        }
    }
}
