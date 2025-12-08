package com.formula1.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import com.formula1.DatabaseConnection;
import com.formula1.model.Evenement;

public class EvenementsDAO {

    public int create(Evenement evt) {
        String sql = "INSERT INTO evenements (nom, date_heure, id_type_evenement, id_saison, id_circuits) VALUES (?, ?, ?, ?, ?)";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            ps.setString(1, evt.getNom());
            ps.setString(2, evt.getDateHeure());
            ps.setInt(3, evt.getIdTypeEvenement());
            ps.setInt(4, evt.getIdSaison());
            ps.setInt(5, evt.getIdCircuit());

            int rows = ps.executeUpdate();
            if (rows == 1) {
                try (ResultSet rs = ps.getGeneratedKeys()) {
                    if (rs.next()) {
                        evt.setId(rs.getInt(1));
                    }
                }
            }
            return rows;
        } catch (SQLException e) {
            System.err.println("[ERREUR] CREATE evenement : " + e.getMessage());
            return 0;
        }
    }

    public List<Evenement> findAll() {
        List<Evenement> events = new ArrayList<>();
        String sql = "SELECT id_planning, nom, date_heure, id_type_evenement, id_saison, id_circuits " +
                    "FROM evenements ORDER BY date_heure";

        try (Connection conn = DatabaseConnection.getConnection();
             Statement st = conn.createStatement();
             ResultSet rs = st.executeQuery(sql)) {

            while (rs.next()) {
                events.add(new Evenement(
                    rs.getInt("id_planning"),
                    rs.getString("nom"),
                    rs.getString("date_heure"),
                    rs.getInt("id_type_evenement"),
                    rs.getInt("id_saison"),
                    rs.getInt("id_circuits")
                ));
            }
        } catch (SQLException e) {
            System.err.println("[ERREUR] SELECT evenements : " + e.getMessage());
        }
        return events;
    }

    public List<Evenement> findBySeason(int saisonId) {
        List<Evenement> events = new ArrayList<>();
        String sql = "SELECT id_planning, nom, date_heure, id_type_evenement, id_saison, id_circuits " +
                    "FROM evenements WHERE id_saison = ? ORDER BY date_heure";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, saisonId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    events.add(new Evenement(
                        rs.getInt("id_planning"),
                        rs.getString("nom"),
                        rs.getString("date_heure"),
                        rs.getInt("id_type_evenement"),
                        rs.getInt("id_saison"),
                        rs.getInt("id_circuits")
                    ));
                }
            }
        } catch (SQLException e) {
            System.err.println("[ERREUR] FIND evenements by saison : " + e.getMessage());
        }
        return events;
    }

    public int delete(int id) {
        String sql = "DELETE FROM evenements WHERE id_planning = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, id);
            return ps.executeUpdate();
        } catch (SQLException e) {
            System.err.println("[ERREUR] DELETE evenement : " + e.getMessage());
            return 0;
        }
    }

    /**
     * Affiche le calendrier complet d'une saison avec détails
     */
    public void displaySeasonCalendar(int saisonId) {
        String sql = "SELECT e.id_planning, e.nom, e.date_heure, c.nom as circuit, p.pays " +
                    "FROM evenements e " +
                    "JOIN circuits c ON e.id_circuits = c.id_circuits " +
                    "JOIN localisations p ON c.id_localisation = p.id_localisation " +
                    "WHERE e.id_saison = ? ORDER BY e.date_heure";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, saisonId);
            try (ResultSet rs = ps.executeQuery()) {
                System.out.println("\n=== CALENDRIER SAISON F1 ===");
                int round = 1;
                while (rs.next()) {
                    System.out.printf("%2d. %s - %s (%s) - %s%n",
                        round++,
                        rs.getString("nom"),
                        rs.getString("circuit"),
                        rs.getString("pays"),
                        rs.getString("date_heure")
                    );
                }
            }
        } catch (SQLException e) {
            System.err.println("[ERREUR] Season calendar : " + e.getMessage());
        }
    }

    /**
     * Récupère le prochain Grand Prix (course principale)
     */
    public void getNextEvent() {
        String sql = "SELECT e.id_planning, e.nom, e.date_heure, c.nom as circuit, p.pays " +
                    "FROM evenements e " +
                    "JOIN circuits c ON e.id_circuits = c.id_circuits " +
                    "JOIN localisations p ON c.id_localisation = p.id_localisation " +
                    "WHERE e.id_type_evenement = 5 " +  // 5 = Course principale
                    "AND e.date_heure > NOW() " +
                    "ORDER BY e.date_heure ASC LIMIT 1";

        try (Connection conn = DatabaseConnection.getConnection();
             Statement st = conn.createStatement();
             ResultSet rs = st.executeQuery(sql)) {

            if (rs.next()) {
                System.out.println("\n🏁 PROCHAIN GRAND PRIX 🏁");
                System.out.printf("📍 %s - %s%n", rs.getString("circuit"), rs.getString("pays"));
                System.out.printf("📅 %s%n", rs.getString("date_heure"));
                System.out.println("========================");
            } else {
                System.out.println("[INFO] Aucune course à venir.");
            }
        } catch (SQLException e) {
            System.err.println("[ERREUR] Next event : " + e.getMessage());
        }
    }
}
