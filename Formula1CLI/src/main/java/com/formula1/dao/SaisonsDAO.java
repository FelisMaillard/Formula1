package com.formula1.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import com.formula1.DatabaseConnection;
import com.formula1.model.Saison;

public class SaisonsDAO {

    public int create(Saison saison) {
        String sql = "INSERT INTO saisons (nom, annee, date_debut, date_fin) VALUES (?, ?, ?, ?)";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            ps.setString(1, saison.getNom());
            ps.setInt(2, saison.getAnnee());
            ps.setString(3, saison.getDateDebut());
            ps.setString(4, saison.getDateFin());

            int rows = ps.executeUpdate();
            if (rows == 1) {
                try (ResultSet rs = ps.getGeneratedKeys()) {
                    if (rs.next()) {
                        saison.setId(rs.getInt(1));
                    }
                }
            }
            return rows;
        } catch (SQLException e) {
            System.err.println("[ERREUR] CREATE saison : " + e.getMessage());
            return 0;
        }
    }

    public List<Saison> findAll() {
        List<Saison> saisons = new ArrayList<>();
        String sql = "SELECT id_saison, nom, annee, date_debut, date_fin FROM saisons ORDER BY annee DESC";

        try (Connection conn = DatabaseConnection.getConnection();
             Statement st = conn.createStatement();
             ResultSet rs = st.executeQuery(sql)) {

            while (rs.next()) {
                saisons.add(new Saison(
                        rs.getInt("id_saison"),
                        rs.getString("nom"),
                        rs.getInt("annee"),
                        rs.getString("date_debut"),
                        rs.getString("date_fin")
                ));
            }
        } catch (SQLException e) {
            System.err.println("[ERREUR] SELECT saisons : " + e.getMessage());
        }
        return saisons;
    }

    public Saison findById(int id) {
        String sql = "SELECT id_saison, nom, annee, date_debut, date_fin FROM saisons WHERE id_saison = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return new Saison(
                            rs.getInt("id_saison"),
                            rs.getString("nom"),
                            rs.getInt("annee"),
                            rs.getString("date_debut"),
                            rs.getString("date_fin")
                    );
                }
            }
        } catch (SQLException e) {
            System.err.println("[ERREUR] FIND saison : " + e.getMessage());
        }
        return null;
    }

    public Saison findByYear(int annee) {
        String sql = "SELECT id_saison, nom, annee, date_debut, date_fin FROM saisons WHERE annee = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, annee);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return new Saison(
                            rs.getInt("id_saison"),
                            rs.getString("nom"),
                            rs.getInt("annee"),
                            rs.getString("date_debut"),
                            rs.getString("date_fin")
                    );
                }
            }
        } catch (SQLException e) {
            System.err.println("[ERREUR] FIND saison by year : " + e.getMessage());
        }
        return null;
    }

    public int update(Saison saison) {
        String sql = "UPDATE saisons SET nom = ?, annee = ?, date_debut = ?, date_fin = ? WHERE id_saison = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, saison.getNom());
            ps.setInt(2, saison.getAnnee());
            ps.setString(3, saison.getDateDebut());
            ps.setString(4, saison.getDateFin());
            ps.setInt(5, saison.getId());

            return ps.executeUpdate();
        } catch (SQLException e) {
            System.err.println("[ERREUR] UPDATE saison : " + e.getMessage());
            return 0;
        }
    }

    public int delete(int id) {
        String sql = "DELETE FROM saisons WHERE id_saison = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, id);
            return ps.executeUpdate();
        } catch (SQLException e) {
            System.err.println("[ERREUR] DELETE saison : " + e.getMessage());
            return 0;
        }
    }

    /**
     * Récupère les statistiques d'une saison
     */
    public void getSeasonStats(int saisonId) {
        String sql = "SELECT " +
                     "COUNT(DISTINCT e.id_planning) as nb_courses, " +
                     "COUNT(DISTINCT c.id_circuits) as nb_circuits, " +
                     "COUNT(DISTINCT l.pays) as nb_pays " +
                     "FROM evenements e " +
                     "JOIN circuits c ON e.id_circuits = c.id_circuits " +
                     "JOIN localisations l ON c.id_localisation = l.id_localisation " +
                     "WHERE e.id_saison = ? AND e.id_type_evenement = 5";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, saisonId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    System.out.println("\n=== STATISTIQUES SAISON ===");
                    System.out.println("Nombre de courses   : " + rs.getInt("nb_courses"));
                    System.out.println("Nombre de circuits  : " + rs.getInt("nb_circuits"));
                    System.out.println("Nombre de pays      : " + rs.getInt("nb_pays"));
                }
            }
        } catch (SQLException e) {
            System.err.println("[ERREUR] Season stats : " + e.getMessage());
        }
    }
}