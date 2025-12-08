package com.formula1;

import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

public class DatabaseConnection {
    private static Connection connection = null;
    
    public static Connection getConnection() throws SQLException {
        if (connection != null && !connection.isClosed()) {
            return connection;
        }
        
        try (InputStream input = DatabaseConnection.class
                .getClassLoader().getResourceAsStream("config.properties")) {
            
            if (input == null) {
                throw new SQLException("config.properties introuvable");
            }
            
            Properties prop = new Properties();
            prop.load(input);
            
            String url = prop.getProperty("db.url");
            String user = prop.getProperty("db.user");
            String password = prop.getProperty("db.password");
            
            connection = DriverManager.getConnection(url, user, password);
            return connection;
            
        } catch (Exception e) {
            throw new SQLException("Connexion échouée: " + e.getMessage(), e);
        }
    }
    
    public static void closeConnection() {
        if (connection != null) {
            try {
                connection.close();
                System.out.println("Connexion fermée");
            } catch (SQLException e) {
                System.err.println("Erreur fermeture: " + e.getMessage());
            }
        }
    }
}
