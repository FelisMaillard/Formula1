package com.formula1.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import com.formula1.DatabaseConnection;
import com.formula1.model.Circuit;

public class CircuitsDAO {

    public int create(Circuit circuit) {
        String sql = "INSERT INTO circuits (nom, longueur, id_localisation) VALUES (?, ?, ?)";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            ps.setString(1, circuit.getNom());
            ps.setDouble(2, circuit.getLongueur());
            ps.setInt(3, circuit.getIdLocalisation());

            int rows = ps.executeUpdate();
            if (rows == 1) {
                try (ResultSet rs = ps.getGeneratedKeys()) {
                    if (rs.next()) {
                        circuit.setId(rs.getInt(1));
                    }
                }
            }
            return rows;
        } catch (SQLException e) {
            System.err.println("[ERREUR] CREATE circuit : " + e.getMessage());
            return 0;
        }
    }

    public List<Circuit> findAll() {
        List<Circuit> circuits = new ArrayList<>();
        String sql = "SELECT c.id_circuits, c.nom, c.longueur, c.id_localisation, " +
                     "l.ville, l.pays " +
                     "FROM circuits c " +
                     "INNER JOIN localisations l ON c.id_localisation = l.id_localisation " +
                     "ORDER BY c.nom";

        try (Connection conn = DatabaseConnection.getConnection();
             Statement st = conn.createStatement();
             ResultSet rs = st.executeQuery(sql)) {

            while (rs.next()) {
                Circuit circuit = new Circuit(
                        rs.getInt("id_circuits"),
                        rs.getString("nom"),
                        rs.getDouble("longueur"),
                        rs.getInt("id_localisation")
                );
                circuit.setVille(rs.getString("ville"));
                circuit.setPays(rs.getString("pays"));
                circuits.add(circuit);
            }
        } catch (SQLException e) {
            System.err.println("[ERREUR] SELECT circuits : " + e.getMessage());
        }
        return circuits;
    }

    public Circuit findById(int id) {
        String sql = "SELECT c.id_circuits, c.nom, c.longueur, c.id_localisation, " +
                     "l.ville, l.pays " +
                     "FROM circuits c " +
                     "INNER JOIN localisations l ON c.id_localisation = l.id_localisation " +
                     "WHERE c.id_circuits = ?";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    Circuit circuit = new Circuit(
                            rs.getInt("id_circuits"),
                            rs.getString("nom"),
                            rs.getDouble("longueur"),
                            rs.getInt("id_localisation")
                    );
                    circuit.setVille(rs.getString("ville"));
                    circuit.setPays(rs.getString("pays"));
                    return circuit;
                }
            }
        } catch (SQLException e) {
            System.err.println("[ERREUR] FIND circuit : " + e.getMessage());
        }
        return null;
    }

    public int update(Circuit circuit) {
        String sql = "UPDATE circuits SET nom = ?, longueur = ?, id_localisation = ? WHERE id_circuits = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, circuit.getNom());
            ps.setDouble(2, circuit.getLongueur());
            ps.setInt(3, circuit.getIdLocalisation());
            ps.setInt(4, circuit.getId());

            return ps.executeUpdate();
        } catch (SQLException e) {
            System.err.println("[ERREUR] UPDATE circuit : " + e.getMessage());
            return 0;
        }
    }

    public int delete(int id) {
        String sql = "DELETE FROM circuits WHERE id_circuits = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, id);
            return ps.executeUpdate();
        } catch (SQLException e) {
            System.err.println("[ERREUR] DELETE circuit : " + e.getMessage());
            return 0;
        }
    }

    /**
     * Récupère les circuits par pays
     */
    public List<Circuit> findByCountry(String pays) {
        List<Circuit> circuits = new ArrayList<>();
        String sql = "SELECT c.id_circuits, c.nom, c.longueur, c.id_localisation, " +
                     "l.ville, l.pays " +
                     "FROM circuits c " +
                     "INNER JOIN localisations l ON c.id_localisation = l.id_localisation " +
                     "WHERE l.pays LIKE ? " +
                     "ORDER BY c.nom";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, "%" + pays + "%");
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Circuit circuit = new Circuit(
                            rs.getInt("id_circuits"),
                            rs.getString("nom"),
                            rs.getDouble("longueur"),
                            rs.getInt("id_localisation")
                    );
                    circuit.setVille(rs.getString("ville"));
                    circuit.setPays(rs.getString("pays"));
                    circuits.add(circuit);
                }
            }
        } catch (SQLException e) {
            System.err.println("[ERREUR] Find circuits by country : " + e.getMessage());
        }
        return circuits;
    }
}