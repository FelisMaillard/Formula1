package com.formula1.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import com.formula1.DatabaseConnection;

public class StatistiquesDAO {

    /**
     * Top 5 des pilotes avec le plus de victoires
     */
    public void getTopWinners() {
        String sql = "SELECT " +
                     "u.firstname, " +
                     "u.lastname, " +
                     "COUNT(*) as victories, " +
                     "t.libelle as team " +
                     "FROM results r " +
                     "JOIN bareme b ON r.id_bareme = b.id_bareme " +
                     "JOIN drivers d ON r.id_driver = d.id_driver " +
                     "JOIN users u ON d.id_user = u.id_user " +
                     "LEFT JOIN teams_users tu ON u.id_user = tu.id_user " +
                     "LEFT JOIN teams t ON tu.id_team = t.id_team " +
                     "WHERE b.place = 1 " +
                     "GROUP BY u.id_user, u.firstname, u.lastname, t.libelle " +
                     "ORDER BY victories DESC " +
                     "LIMIT 5";

        try (Connection conn = DatabaseConnection.getConnection();
             Statement st = conn.createStatement();
             ResultSet rs = st.executeQuery(sql)) {

            System.out.println("\n=== TOP 5 PILOTES - VICTOIRES ===");
            int rank = 1;
            while (rs.next()) {
                System.out.printf("%d. %-20s | %-20s | %2d victoire(s)%n",
                        rank++,
                        rs.getString("firstname") + " " + rs.getString("lastname"),
                        rs.getString("team"),
                        rs.getInt("victories")
                );
            }
        } catch (SQLException e) {
            System.err.println("[ERREUR] Top winners : " + e.getMessage());
        }
    }

    /**
     * Top 5 des pilotes avec le plus de podiums
     */
    public void getTopPodiums() {
        String sql = "SELECT " +
                     "u.firstname, " +
                     "u.lastname, " +
                     "COUNT(*) as podiums, " +
                     "t.libelle as team " +
                     "FROM results r " +
                     "JOIN bareme b ON r.id_bareme = b.id_bareme " +
                     "JOIN drivers d ON r.id_driver = d.id_driver " +
                     "JOIN users u ON d.id_user = u.id_user " +
                     "LEFT JOIN teams_users tu ON u.id_user = tu.id_user " +
                     "LEFT JOIN teams t ON tu.id_team = t.id_team " +
                     "WHERE b.place <= 3 " +
                     "GROUP BY u.id_user, u.firstname, u.lastname, t.libelle " +
                     "ORDER BY podiums DESC " +
                     "LIMIT 5";

        try (Connection conn = DatabaseConnection.getConnection();
             Statement st = conn.createStatement();
             ResultSet rs = st.executeQuery(sql)) {

            System.out.println("\n=== TOP 5 PILOTES - PODIUMS ===");
            int rank = 1;
            while (rs.next()) {
                System.out.printf("%d. %-20s | %-20s | %2d podium(s)%n",
                        rank++,
                        rs.getString("firstname") + " " + rs.getString("lastname"),
                        rs.getString("team"),
                        rs.getInt("podiums")
                );
            }
        } catch (SQLException e) {
            System.err.println("[ERREUR] Top podiums : " + e.getMessage());
        }
    }

    /**
     * Circuit avec le plus de courses
     */
    public void getMostRacedCircuit() {
        String sql = "SELECT " +
                     "c.nom as circuit, " +
                     "l.ville, " +
                     "l.pays, " +
                     "COUNT(*) as nb_courses " +
                     "FROM evenements e " +
                     "JOIN circuits c ON e.id_circuits = c.id_circuit " +
                     "JOIN localisations l ON c.id_localisation = l.id_localisation " +
                     "WHERE e.id_type_evenement = 5 " +
                     "GROUP BY c.id_circuit, c.nom, l.ville, l.pays " +
                     "ORDER BY nb_courses DESC " +
                     "LIMIT 1";

        try (Connection conn = DatabaseConnection.getConnection();
             Statement st = conn.createStatement();
             ResultSet rs = st.executeQuery(sql)) {

            if (rs.next()) {
                System.out.println("\n=== CIRCUIT LE PLUS UTILISE ===");
                System.out.println("Circuit : " + rs.getString("circuit"));
                System.out.println("Lieu    : " + rs.getString("ville") + ", " + rs.getString("pays"));
                System.out.println("Courses : " + rs.getInt("nb_courses"));
            }
        } catch (SQLException e) {
            System.err.println("[ERREUR] Most raced circuit : " + e.getMessage());
        }
    }

    /**
     * Statistiques d'un pilote spécifique
     */
    public void getDriverStats(int driverId) {
        String sql = "SELECT " +
                     "COUNT(CASE WHEN b.place = 1 THEN 1 END) as victories, " +
                     "COUNT(CASE WHEN b.place <= 3 THEN 1 END) as podiums, " +
                     "COUNT(CASE WHEN b.place <= 10 THEN 1 END) as points_finishes, " +
                     "COUNT(*) as total_races, " +
                     "SUM(b.point) as total_points, " +
                     "AVG(b.place) as avg_position " +
                     "FROM results r " +
                     "JOIN bareme b ON r.id_bareme = b.id_bareme " +
                     "WHERE r.id_driver = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, driverId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    System.out.println("\n=== STATISTIQUES PILOTE ===");
                    System.out.println("Courses disputees    : " + rs.getInt("total_races"));
                    System.out.println("Victoires            : " + rs.getInt("victories"));
                    System.out.println("Podiums              : " + rs.getInt("podiums"));
                    System.out.println("Arrivees dans points : " + rs.getInt("points_finishes"));
                    System.out.println("Total points         : " + rs.getInt("total_points"));
                    System.out.printf("Position moyenne     : %.2f%n", rs.getDouble("avg_position"));
                    
                    // Calcul des taux
                    int totalRaces = rs.getInt("total_races");
                    if (totalRaces > 0) {
                        double winRate = (rs.getInt("victories") * 100.0) / totalRaces;
                        double podiumRate = (rs.getInt("podiums") * 100.0) / totalRaces;
                        System.out.printf("Taux de victoire     : %.1f%%%n", winRate);
                        System.out.printf("Taux de podium       : %.1f%%%n", podiumRate);
                    }
                }
            }
        } catch (SQLException e) {
            System.err.println("[ERREUR] Driver stats : " + e.getMessage());
        }
    }

    /**
     * Comparaison entre deux pilotes
     */
    public void compareDrivers(int driver1Id, int driver2Id) {
        String sql = "SELECT " +
                     "d.id_driver, " +
                     "u.firstname, " +
                     "u.lastname, " +
                     "COUNT(CASE WHEN b.place = 1 THEN 1 END) as victories, " +
                     "COUNT(CASE WHEN b.place <= 3 THEN 1 END) as podiums, " +
                     "d.points as total_points " +
                     "FROM drivers d " +
                     "JOIN users u ON d.id_user = u.id_user " +
                     "LEFT JOIN results r ON d.id_driver = r.id_driver " +
                     "LEFT JOIN bareme b ON r.id_bareme = b.id_bareme " +
                     "WHERE d.id_driver IN (?, ?) " +
                     "GROUP BY d.id_driver, u.firstname, u.lastname, d.points " +
                     "ORDER BY d.id_driver";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, driver1Id);
            ps.setInt(2, driver2Id);
            
            try (ResultSet rs = ps.executeQuery()) {
                System.out.println("\n=== COMPARAISON PILOTES ===");
                System.out.println("Statistique      | Pilote 1         | Pilote 2");
                System.out.println("-----------------|------------------|------------------");
                
                String[] names = new String[2];
                int[] victories = new int[2];
                int[] podiums = new int[2];
                int[] points = new int[2];
                int index = 0;
                
                while (rs.next() && index < 2) {
                    names[index] = rs.getString("firstname") + " " + rs.getString("lastname");
                    victories[index] = rs.getInt("victories");
                    podiums[index] = rs.getInt("podiums");
                    points[index] = rs.getInt("total_points");
                    index++;
                }
                
                if (index == 2) {
                    System.out.printf("Nom              | %-16s | %-16s%n", names[0], names[1]);
                    System.out.printf("Victoires        | %-16d | %-16d%n", victories[0], victories[1]);
                    System.out.printf("Podiums          | %-16d | %-16d%n", podiums[0], podiums[1]);
                    System.out.printf("Points           | %-16d | %-16d%n", points[0], points[1]);
                }
            }
        } catch (SQLException e) {
            System.err.println("[ERREUR] Compare drivers : " + e.getMessage());
        }
    }

    /**
     * Équipe la plus performante (moyenne de points par pilote)
     */
    public void getBestTeamPerformance() {
        String sql = "SELECT " +
                     "t.libelle as team, " +
                     "t.points as team_points, " +
                     "COUNT(DISTINCT d.id_driver) as nb_drivers, " +
                     "AVG(d.points) as avg_driver_points " +
                     "FROM teams t " +
                     "JOIN teams_users tu ON t.id_team = tu.id_team " +
                     "JOIN drivers d ON tu.id_user = d.id_user " +
                     "GROUP BY t.id_team, t.libelle, t.points " +
                     "ORDER BY avg_driver_points DESC " +
                     "LIMIT 5";

        try (Connection conn = DatabaseConnection.getConnection();
             Statement st = conn.createStatement();
             ResultSet rs = st.executeQuery(sql)) {

            System.out.println("\n=== TOP 5 EQUIPES - PERFORMANCE MOYENNE ===");
            int rank = 1;
            while (rs.next()) {
                System.out.printf("%d. %-20s | Points totaux: %4d | Moyenne: %.1f pts/pilote%n",
                        rank++,
                        rs.getString("team"),
                        rs.getInt("team_points"),
                        rs.getDouble("avg_driver_points")
                );
            }
        } catch (SQLException e) {
            System.err.println("[ERREUR] Best team performance : " + e.getMessage());
        }
    }

    /**
     * Derniers vainqueurs
     */
    public void getLastWinners(int limit) {
        String sql = "SELECT " +
                     "e.nom as grand_prix, " +
                     "e.date_heure, " +
                     "u.firstname, " +
                     "u.lastname, " +
                     "t.libelle as team " +
                     "FROM results r " +
                     "JOIN bareme b ON r.id_bareme = b.id_bareme " +
                     "JOIN drivers d ON r.id_driver = d.id_driver " +
                     "JOIN users u ON d.id_user = u.id_user " +
                     "JOIN evenements e ON r.id_planning = e.id_planning " +
                     "LEFT JOIN teams_users tu ON u.id_user = tu.id_user " +
                     "LEFT JOIN teams t ON tu.id_team = t.id_team " +
                     "WHERE b.place = 1 " +
                     "ORDER BY e.date_heure DESC " +
                     "LIMIT ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, limit);
            try (ResultSet rs = ps.executeQuery()) {
                System.out.println("\n=== DERNIERS VAINQUEURS ===");
                
                while (rs.next()) {
                    System.out.printf("%-30s | %-20s | %s%n",
                            rs.getString("grand_prix"),
                            rs.getString("firstname") + " " + rs.getString("lastname"),
                            rs.getString("team")
                    );
                }
            }
        } catch (SQLException e) {
            System.err.println("[ERREUR] Last winners : " + e.getMessage());
        }
    }
}