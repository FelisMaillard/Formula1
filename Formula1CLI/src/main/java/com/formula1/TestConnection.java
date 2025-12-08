package com.formula1;

public class TestConnection {
    public static void main(String[] args) {
        try {
            DatabaseConnection.getConnection();
            System.out.println("🎉 CONNEXION MYSQL RÉUSSIE!");
        } catch (Exception e) {
            System.err.println("💥 ERREUR CONNEXION: " + e.getMessage());
            e.printStackTrace();
        } finally {
            DatabaseConnection.closeConnection();
        }
    }
}
