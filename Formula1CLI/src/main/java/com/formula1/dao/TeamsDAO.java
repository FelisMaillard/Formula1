package com.formula1.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import com.formula1.DatabaseConnection;
import com.formula1.model.Team;

public class TeamsDAO {

    public int create(Team team) {
        String sql = "INSERT INTO teams (libelle, date_creation, points) VALUES (?, ?, ?)";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            ps.setString(1, team.getLibelle());
            ps.setString(2, team.getDateCreation());
            ps.setInt(3, team.getPoints());

            int rows = ps.executeUpdate();
            if (rows == 1) {
                try (ResultSet rs = ps.getGeneratedKeys()) {
                    if (rs.next()) {
                        team.setId(rs.getInt(1));
                    }
                }
            }
            return rows;
        } catch (SQLException e) {
            System.err.println("[ERREUR] CREATE team : " + e.getMessage());
            return 0;
        }
    }

    public List<Team> findAll() {
        List<Team> teams = new ArrayList<>();
        String sql = "SELECT id_team, libelle, date_creation, points FROM teams ORDER BY points DESC";

        try (Connection conn = DatabaseConnection.getConnection();
             Statement st = conn.createStatement();
             ResultSet rs = st.executeQuery(sql)) {

            while (rs.next()) {
                teams.add(new Team(
                        rs.getInt("id_team"),
                        rs.getString("libelle"),
                        rs.getString("date_creation"),
                        rs.getInt("points")
                ));
            }
        } catch (SQLException e) {
            System.err.println("[ERREUR] SELECT teams : " + e.getMessage());
        }
        return teams;
    }

    public Team findById(int id) {
        String sql = "SELECT id_team, libelle, date_creation, points FROM teams WHERE id_team = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return new Team(
                            rs.getInt("id_team"),
                            rs.getString("libelle"),
                            rs.getString("date_creation"),
                            rs.getInt("points")
                    );
                }
            }
        } catch (SQLException e) {
            System.err.println("[ERREUR] FIND team : " + e.getMessage());
        }
        return null;
    }

    public int update(Team team) {
        String sql = "UPDATE teams SET libelle = ?, date_creation = ?, points = ? WHERE id_team = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, team.getLibelle());
            ps.setString(2, team.getDateCreation());
            ps.setInt(3, team.getPoints());
            ps.setInt(4, team.getId());

            return ps.executeUpdate();
        } catch (SQLException e) {
            System.err.println("[ERREUR] UPDATE team : " + e.getMessage());
            return 0;
        }
    }

    public int delete(int id) {
        String sql = "DELETE FROM teams WHERE id_team = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, id);
            return ps.executeUpdate();
        } catch (SQLException e) {
            System.err.println("[ERREUR] DELETE team : " + e.getMessage());
            return 0;
        }
    }

    /**
     * Récupère le classement des équipes avec leurs pilotes
     */
    public List<Team> getTeamStandings() {
        List<Team> teams = new ArrayList<>();
        String sql = "SELECT t.id_team, t.libelle, t.points, " +
                     "GROUP_CONCAT(CONCAT(u.firstname, ' ', u.lastname) SEPARATOR ', ') as pilotes " +
                     "FROM teams t " +
                     "LEFT JOIN teams_users tu ON t.id_team = tu.id_team " +
                     "LEFT JOIN users u ON tu.id_user = u.id_user " +
                     "GROUP BY t.id_team, t.libelle, t.points " +
                     "ORDER BY t.points DESC";

        try (Connection conn = DatabaseConnection.getConnection();
             Statement st = conn.createStatement();
             ResultSet rs = st.executeQuery(sql)) {

            while (rs.next()) {
                Team team = new Team(
                        rs.getInt("id_team"),
                        rs.getString("libelle"),
                        null,
                        rs.getInt("points")
                );
                System.out.println("  > " + team + " - Pilotes: " + rs.getString("pilotes"));
            }
        } catch (SQLException e) {
            System.err.println("[ERREUR] Team standings : " + e.getMessage());
        }
        return teams;
    }

    /**
     * Associe un pilote à une équipe via teams_users
     */
    public void associateTeamUser(int teamId, int userId) {
        String sql = "INSERT IGNORE INTO teams_users (id_team, id_user) VALUES (?, ?)";
        try (Connection conn = DatabaseConnection.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setInt(1, teamId);
            ps.setInt(2, userId);
            ps.executeUpdate();
        } catch (SQLException e) {
            System.err.println("[ERREUR] Associate team-user : " + e.getMessage());
        }
    }

    /**
     * Supprime tous les liens teams_users pour une équipe
     */
    public void removeAllTeamUsers(int teamId) {
        String sql = "DELETE FROM teams_users WHERE id_team = ?";
        try (Connection conn = DatabaseConnection.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, teamId);
            ps.executeUpdate();
        } catch (SQLException e) {
            System.err.println("[ERREUR] Remove team users : " + e.getMessage());
        }
    }


}