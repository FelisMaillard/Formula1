package com.formula1.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import com.formula1.DatabaseConnection;
import com.formula1.model.User;

public class UsersDAO {

    public int create(User user) {
        String sql = "INSERT INTO users (firstname, lastname, email) VALUES (?, ?, ?)";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            ps.setString(1, user.getFirstname());
            ps.setString(2, user.getLastname());
            ps.setString(3, user.getEmail());

            int rows = ps.executeUpdate();
            if (rows == 1) {
                try (ResultSet rs = ps.getGeneratedKeys()) {
                    if (rs.next()) {
                        user.setId(rs.getInt(1));
                    }
                }
            }
            return rows;
        } catch (SQLException e) {
            System.err.println("Erreur CREATE user : " + e.getMessage());
            return 0;
        }
    }

    public List<User> findAll() {
        List<User> users = new ArrayList<>();
        String sql = "SELECT id_user, firstname, lastname, email FROM users ORDER BY id_user";

        try (Connection conn = DatabaseConnection.getConnection();
             Statement st = conn.createStatement();
             ResultSet rs = st.executeQuery(sql)) {

            while (rs.next()) {
                users.add(new User(
                        rs.getInt("id_user"),
                        rs.getString("firstname"),
                        rs.getString("lastname"),
                        rs.getString("email")
                ));
            }
        } catch (SQLException e) {
            System.err.println("Erreur SELECT users : " + e.getMessage());
        }
        return users;
    }

    public User findById(int id) {
        String sql = "SELECT id_user, firstname, lastname, email FROM users WHERE id_user = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return new User(
                            rs.getInt("id_user"),
                            rs.getString("firstname"),
                            rs.getString("lastname"),
                            rs.getString("email")
                    );
                }
            }
        } catch (SQLException e) {
            System.err.println("Erreur FIND user : " + e.getMessage());
        }
        return null;
    }

    public int update(User user) {
        String sql = "UPDATE users SET firstname = ?, lastname = ?, email = ? WHERE id_user = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, user.getFirstname());
            ps.setString(2, user.getLastname());
            ps.setString(3, user.getEmail());
            ps.setInt(4, user.getId());

            return ps.executeUpdate();
        } catch (SQLException e) {
            System.err.println("Erreur UPDATE user : " + e.getMessage());
            return 0;
        }
    }

    public int delete(int id) {
        String sql = "DELETE FROM users WHERE id_user = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, id);
            return ps.executeUpdate();
        } catch (SQLException e) {
            System.err.println("Erreur DELETE user : " + e.getMessage());
            return 0;
        }
    }
}
