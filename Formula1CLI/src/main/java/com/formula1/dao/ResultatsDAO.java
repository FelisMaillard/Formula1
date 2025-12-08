package com.formula1.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import com.formula1.DatabaseConnection;

public class ResultatsDAO {

    public int create(int driverId, int baremeId, int eventId) {
        String sql = "INSERT INTO results (id_driver, id_bareme, id_planning) VALUES (?, ?, ?)";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, driverId);
            ps.setInt(2, baremeId);
            ps.setInt(3, eventId);

            return ps.executeUpdate();
        } catch (SQLException e) {
            System.err.println("[ERREUR] CREATE resultat : " + e.getMessage());
            return 0;
        }
    }

    /**
     * Affiche tous les résultats d'un événement avec place/nom/points
     */
    public void getEventResults(int eventId) {
        String sql = "SELECT r.id_bareme, b.point, d.id_driver, u.firstname, u.lastname, t.libelle as team " +
                    "FROM results r " +
                    "JOIN bareme b ON r.id_bareme = b.id_bareme " +
                    "JOIN drivers d ON r.id_driver = d.id_driver " +
                    "JOIN users u ON d.id_user = u.id_user " +
                    "LEFT JOIN teams_users tu ON d.id_user = tu.id_user " +
                    "LEFT JOIN teams t ON tu.id_team = t.id_team " +
                    "WHERE r.id_planning = ? ORDER BY r.id_bareme";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, eventId);
            try (ResultSet rs = ps.executeQuery()) {
                System.out.println("\n=== RESULTATS COURSE ===");
                int place = 1;
                while (rs.next()) {
                    System.out.printf("%2d. %s %s (%s) - %d pts%n",
                        place++,
                        rs.getString("firstname"),
                        rs.getString("lastname"),
                        rs.getString("team") != null ? rs.getString("team") : "Sans équipe",
                        rs.getInt("point")
                    );
                }
            }
        } catch (SQLException e) {
            System.err.println("[ERREUR] Event results : " + e.getMessage());
        }
    }

    /**
     * Affiche le podium (1er, 2e, 3e) d'une course
     */
    public void getPodium(int eventId) {
        String sql = "SELECT b.place, b.point, u.firstname, u.lastname, t.libelle as team " +
                    "FROM results r " +
                    "JOIN bareme b ON r.id_bareme = b.id_bareme " +
                    "JOIN drivers d ON r.id_driver = d.id_driver " +
                    "JOIN users u ON d.id_user = u.id_user " +
                    "LEFT JOIN teams_users tu ON d.id_user = tu.id_user " +
                    "LEFT JOIN teams t ON tu.id_team = t.id_team " +
                    "WHERE r.id_planning = ? AND b.place <= 3 ORDER BY b.place";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, eventId);
            try (ResultSet rs = ps.executeQuery()) {
                System.out.println("\n🥇🥈🥉 PODIUM 🥉🥈🥇");
                while (rs.next()) {
                    String medal = rs.getInt("place") == 1 ? "🥇" : 
                                  rs.getInt("place") == 2 ? "🥈" : "🥉";
                    System.out.printf("%s %s %s (%s) - %d pts%n",
                        medal,
                        rs.getString("firstname"),
                        rs.getString("lastname"),
                        rs.getString("team") != null ? rs.getString("team") : "Sans équipe",
                        rs.getInt("point")
                    );
                }
            }
        } catch (SQLException e) {
            System.err.println("[ERREUR] Podium : " + e.getMessage());
        }
    }

    /**
     * Résultats d'un pilote pour une saison complète
     */
    public void getDriverSeasonResults(int driverId, int saisonId) {
        String sql = "SELECT e.nom as course, b.place, b.point, e.date_heure " +
                    "FROM results r " +
                    "JOIN bareme b ON r.id_bareme = b.id_bareme " +
                    "JOIN evenements e ON r.id_planning = e.id_planning " +
                    "WHERE r.id_driver = ? AND e.id_saison = ? " +
                    "ORDER BY e.date_heure";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, driverId);
            ps.setInt(2, saisonId);
            try (ResultSet rs = ps.executeQuery()) {
                System.out.println("\n=== RESULTATS PILOTE - SAISON ===");
                int totalPoints = 0;
                while (rs.next()) {
                    System.out.printf("🏎️  %s - %d° place (%d pts) - %s%n",
                        rs.getString("course"),
                        rs.getInt("place"),
                        rs.getInt("point"),
                        rs.getString("date_heure")
                    );
                    totalPoints += rs.getInt("point");
                }
                System.out.printf("📊 TOTAL SAISON: %d points%n", totalPoints);
            }
        } catch (SQLException e) {
            System.err.println("[ERREUR] Driver season results : " + e.getMessage());
        }
    }

    /**
     * Liste toutes les victoires d'un pilote
     */
    public void getDriverWins(int driverId) {
        String sql = "SELECT e.nom, e.date_heure, c.nom as circuit " +
                    "FROM results r " +
                    "JOIN bareme b ON r.id_bareme = b.id_bareme " +
                    "JOIN evenements e ON r.id_planning = e.id_planning " +
                    "JOIN circuits c ON e.id_circuits = c.id_circuits " +
                    "WHERE r.id_driver = ? AND b.place = 1 ORDER BY e.date_heure DESC";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, driverId);
            try (ResultSet rs = ps.executeQuery()) {
                System.out.println("\n🏆 VICTOIRES PILOTE 🏆");
                int totalWins = 0;
                while (rs.next()) {
                    System.out.printf("🥇 %s - %s (%s)%n",
                        rs.getString("nom"),
                        rs.getString("circuit"),
                        rs.getString("date_heure")
                    );
                    totalWins++;
                }
                System.out.printf("📊 TOTAL VICTOIRES: %d%n", totalWins);
            }
        } catch (SQLException e) {
            System.err.println("[ERREUR] Driver wins : " + e.getMessage());
        }
    }
}
