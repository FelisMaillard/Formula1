package com.formula1;

import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

import com.formula1.dao.CircuitsDAO;
import com.formula1.dao.DriversDAO;
import com.formula1.dao.TeamsDAO;
import com.formula1.dao.UsersDAO;
import com.formula1.model.Circuit;
import com.formula1.model.Driver;
import com.formula1.model.Team;
import com.formula1.model.User;

public class Main {
    private static final Scanner in = new Scanner(System.in);
    private static final UsersDAO usersDAO = new UsersDAO();
    private static final TeamsDAO teamsDAO = new TeamsDAO();
    private static final DriversDAO driversDAO = new DriversDAO();
    private static final CircuitsDAO circuitsDAO = new CircuitsDAO();

    public static void main(String[] args) {
        int choice;
        do {
            System.out.println("\n==========================================");
            System.out.println("      GESTION BASE DE DONNEES F1 2025     ");
            System.out.println("==========================================");
            System.out.println("1.  Gestion Users (Pilotes)");
            System.out.println("2.  Gestion Teams (Equipes)");
            System.out.println("3.  Gestion Circuits");
            System.out.println("-------------------------------------------");
            System.out.println("10. Classement Pilotes 2025");
            System.out.println("11. Classement Equipes 2025");
            System.out.println("12. Liste des Circuits");
            System.out.println("-------------------------------------------");
            System.out.println("0.  Quitter");
            System.out.println("==========================================");
            System.out.print("Choix : ");
            
            choice = readIntSafely();
            System.out.println();

            switch (choice) {
                case 1 -> menuUsers();
                case 2 -> menuTeams();
                case 3 -> menuCircuits();
                case 10 -> driversDAO.getDriverStandings();
                case 11 -> teamsDAO.getTeamStandings();
                case 12 -> listCircuits();
                case 0 -> System.out.println("[INFO] Fermeture de l'application...");
                default -> System.out.println("[ERREUR] Choix invalide.");
            }
        } while (choice != 0);

        DatabaseConnection.closeConnection();
        in.close();
    }

    // ==========================================
    // MENU USERS
    // ==========================================
    private static void menuUsers() {
        int choice;
        do {
            System.out.println("\n=== MENU USERS (PILOTES) ===");
            System.out.println("1. Creer user");
            System.out.println("2. Lister users");
            System.out.println("3. Modifier user");
            System.out.println("4. Supprimer user");
            System.out.println("0. Retour");
            System.out.print("Choix : ");
            choice = readIntSafely();

            switch (choice) {
                case 1 -> createUser();
                case 2 -> listUsers();
                case 3 -> updateUser();
                case 4 -> deleteUser();
            }
        } while (choice != 0);
    }

    // ==========================================
    // MENU TEAMS
    // ==========================================
    private static void menuTeams() {
        int choice;
        do {
            System.out.println("\n=== MENU TEAMS (EQUIPES) ===");
            System.out.println("1. Creer team");
            System.out.println("2. Lister teams");
            System.out.println("3. Modifier team");
            System.out.println("4. Supprimer team");
            System.out.println("5. Voir pilotes d'une equipe");
            System.out.println("0. Retour");
            System.out.print("Choix : ");
            choice = readIntSafely();

            switch (choice) {
                case 1 -> createTeam();
                case 2 -> listTeams();
                case 3 -> updateTeam();
                case 4 -> deleteTeam();
                case 5 -> showTeamDrivers();
            }
        } while (choice != 0);
    }

    // ==========================================
    // MENU CIRCUITS
    // ==========================================
    private static void menuCircuits() {
        int choice;
        do {
            System.out.println("\n=== MENU CIRCUITS ===");
            System.out.println("1. Creer circuit");
            System.out.println("2. Lister circuits");
            System.out.println("3. Modifier circuit");
            System.out.println("4. Supprimer circuit");
            System.out.println("5. Chercher par pays");
            System.out.println("0. Retour");
            System.out.print("Choix : ");
            choice = readIntSafely();

            switch (choice) {
                case 1 -> createCircuit();
                case 2 -> listCircuits();
                case 3 -> updateCircuit();
                case 4 -> deleteCircuit();
                case 5 -> searchCircuitsByCountry();
            }
        } while (choice != 0);
    }

    // ==========================================
    // GESTION USERS
    // ==========================================
    private static void createUser() {
        System.out.println("--- Creation d'un utilisateur ---");
        
        String firstname;
        do {
            firstname = readNonEmptyString("Prenom : ");
            if (!isValidName(firstname)) {
                System.out.println("[ERREUR] Le prenom ne doit contenir que des lettres, espaces, apostrophes et tirets.");
                firstname = "";
            }
        } while (firstname.isEmpty());

        String lastname;
        do {
            lastname = readNonEmptyString("Nom : ");
            if (!isValidName(lastname)) {
                System.out.println("[ERREUR] Le nom ne doit contenir que des lettres, espaces, apostrophes et tirets.");
                lastname = "";
            }
        } while (lastname.isEmpty());

        String email = readValidEmail("Email : ");

        System.out.println("\n--- Recapitulatif ---");
        System.out.println("Prenom : " + firstname);
        System.out.println("Nom    : " + lastname);
        System.out.println("Email  : " + email);
        System.out.print("Confirmer la creation ? (o/n) : ");
        
        String confirm = in.nextLine().trim().toLowerCase();
        if (!confirm.equals("o") && !confirm.equals("oui")) {
            System.out.println("[INFO] Creation annulee.");
            return;
        }

        User u = new User(0, firstname, lastname, email);
        int rows = usersDAO.create(u);
        
        if (rows == 1) {
            System.out.println("[SUCCES] Utilisateur cree avec succes : " + u);
        } else {
            System.out.println("[ERREUR] Echec de la creation de l'utilisateur.");
        }
    }

    private static void listUsers() {
        System.out.println("--- Liste des utilisateurs ---");
        List<User> users = usersDAO.findAll();
        
        if (users.isEmpty()) {
            System.out.println("[INFO] Aucun utilisateur dans la base de donnees.");
        } else {
            System.out.println("[INFO] " + users.size() + " utilisateur(s) trouve(s) :\n");
            users.forEach(user -> System.out.println("  > " + user));
        }
    }

    private static void updateUser() {
        System.out.println("--- Modification d'un utilisateur ---");
        System.out.print("ID de l'utilisateur a modifier : ");
        
        int id = readIntSafely();
        if (id <= 0) {
            System.out.println("[ERREUR] ID invalide.");
            return;
        }

        User u = usersDAO.findById(id);
        if (u == null) {
            System.out.println("[ERREUR] Aucun utilisateur trouve avec l'ID " + id + ".");
            return;
        }

        System.out.println("\n[INFO] Utilisateur actuel : " + u);
        System.out.println("[INFO] Appuyez sur Entree pour conserver la valeur actuelle.\n");

        System.out.print("Nouveau prenom [" + u.getFirstname() + "] : ");
        String firstname = in.nextLine().trim();
        if (!firstname.isEmpty() && isValidName(firstname)) {
            u.setFirstname(firstname);
        }

        System.out.print("Nouveau nom [" + u.getLastname() + "] : ");
        String lastname = in.nextLine().trim();
        if (!lastname.isEmpty() && isValidName(lastname)) {
            u.setLastname(lastname);
        }

        System.out.print("Nouvel email [" + u.getEmail() + "] : ");
        String email = in.nextLine().trim();
        if (!email.isEmpty() && isValidEmail(email)) {
            u.setEmail(email);
        }

        System.out.print("Confirmer la modification ? (o/n) : ");
        String confirm = in.nextLine().trim().toLowerCase();
        if (!confirm.equals("o") && !confirm.equals("oui")) {
            System.out.println("[INFO] Modification annulee.");
            return;
        }

        int rows = usersDAO.update(u);
        System.out.println(rows == 1 ? "[SUCCES] Utilisateur mis a jour." : "[ERREUR] Echec mise a jour.");
    }

    private static void deleteUser() {
        System.out.print("ID de l'utilisateur a supprimer : ");
        int id = readIntSafely();
        if (id <= 0) {
            System.out.println("[ERREUR] ID invalide.");
            return;
        }

        User u = usersDAO.findById(id);
        if (u == null) {
            System.out.println("[ERREUR] Utilisateur introuvable.");
            return;
        }

        System.out.println("\n[ATTENTION] Suppression de : " + u);
        System.out.print("Confirmer ? (o/n) : ");
        String confirm = in.nextLine().trim().toLowerCase();
        
        if (confirm.equals("o") || confirm.equals("oui")) {
            int rows = usersDAO.delete(id);
            System.out.println(rows == 1 ? "[SUCCES] Supprime." : "[ERREUR] Echec.");
        }
    }

    // ==========================================
    // GESTION TEAMS
    // ==========================================
    private static void createTeam() {
        System.out.println("--- Creation d'une equipe ---");
        String libelle = readNonEmptyString("Nom de l'equipe : ");
        String dateCreation = readNonEmptyString("Date de creation (YYYY-MM-DD) : ");
        System.out.print("Points : ");
        int points = readIntSafely();

        // Création de l'équipe
        Team team = new Team(0, libelle, dateCreation, points);
        int rows = teamsDAO.create(team);
        if (rows != 1) {
            System.out.println("[ERREUR] Echec creation equipe.");
            return;
        }

        // Affichage des utilisateurs disponibles
        System.out.println("\n--- Associer des pilotes a l'equipe ---");
        List<Driver> drivers = driversDAO.findAll();
        if (drivers.isEmpty()) {
            System.out.println("[INFO] Aucun pilote disponible. Creation sans pilote.");
            return;
        }

        System.out.println("[INFO] Pilotes disponibles :");
        for (int i = 0; i < drivers.size(); i++) {
            System.out.printf("  %d. %s %s (ID: %d)%n", i+1, drivers.get(i).getFirstname(), drivers.get(i).getLastname(), drivers.get(i).getId());
        }

        // Association des pilotes (max 2 pour F1)
        List<Integer> pilotIds = new ArrayList<>();
        int maxPilotes = Math.min(2, drivers.size());
        
        for (int i = 0; i < maxPilotes; i++) {
            System.out.printf("Pilote %d (ID, 0 pour ignorer) : ", i+1);
            int userId = readIntSafely();
            if (userId > 0) {
                User selectedUser = usersDAO.findById(userId);
                if (selectedUser != null) {
                    pilotIds.add(userId);
                    System.out.println("[INFO] Ajoute: " + selectedUser.getFirstname() + " " + selectedUser.getLastname());
                } else {
                    System.out.println("[ATTENTION] Pilote non trouve, ignore.");
                }
            }
        }

        // Association via teams_users
        if (!pilotIds.isEmpty()) {
            for (int userId : pilotIds) {
                teamsDAO.associateTeamUser(team.getId(), userId);
            }
            System.out.println("[SUCCES] Equipe creee et pilotes associes : " + team);
        } else {
            System.out.println("[SUCCES] Equipe creee sans pilote : " + team);
        }
    }

    private static void listTeams() {
        System.out.println("--- Liste des equipes ---");
        List<Team> teams = teamsDAO.findAll();
        
        if (teams.isEmpty()) {
            System.out.println("[INFO] Aucune equipe.");
        } else {
            System.out.println("[INFO] " + teams.size() + " equipe(s) :\n");
            teams.forEach(team -> System.out.println("  > " + team));
        }
    }

    private static void updateTeam() {
        System.out.print("ID de l'equipe a modifier : ");
        int id = readIntSafely();
        Team team = teamsDAO.findById(id);
        
        if (team == null) {
            System.out.println("[ERREUR] Equipe introuvable.");
            return;
        }

        System.out.println("[INFO] Equipe actuelle : " + team);
        System.out.println("[INFO] Appuyez sur Entree pour conserver la valeur actuelle.\n");

        System.out.print("Nouveau nom [" + team.getLibelle() + "] : ");
        String libelle = in.nextLine().trim();
        if (!libelle.isEmpty()) team.setLibelle(libelle);

        System.out.print("Nouvelle date creation [" + team.getDateCreation() + "] : ");
        String dateCreation = in.nextLine().trim();
        if (!dateCreation.isEmpty()) team.setDateCreation(dateCreation);

        System.out.print("Nouveaux points [" + team.getPoints() + "] : ");
        String pointsStr = in.nextLine().trim();
        if (!pointsStr.isEmpty()) {
            try {
                team.setPoints(Integer.parseInt(pointsStr));
            } catch (NumberFormatException e) {
                System.out.println("[ATTENTION] Points invalides, conservation de la valeur.");
            }
        }

        // === GESTION DES PILOTES ===
        System.out.println("\n--- Gestion des pilotes ---");
        List<Driver> drivers = driversDAO.findAll();
        if (!drivers.isEmpty()) {
            System.out.println("[INFO] Pilotes disponibles :");
            for (int i = 0; i < drivers.size(); i++) {
                System.out.printf("  %d. %s %s (ID: %d)%n", i+1, drivers.get(i).getFirstname(), drivers.get(i).getLastname(), drivers.get(i).getId());
            }

            // Pilotes actuels de l'équipe
            List<Driver> currentDrivers = driversDAO.findByTeam(id);
            System.out.println("\n[INFO] Pilotes actuels de l'équipe :");
            if (currentDrivers.isEmpty()) {
                System.out.println("  Aucun pilote");
            } else {
                currentDrivers.forEach(d -> System.out.println("  > " + d));
            }

            // Nouveaux pilotes (max 2)
            List<Integer> newPilotIds = new ArrayList<>();
            int maxPilotes = Math.min(2, drivers.size());
            
            for (int i = 0; i < maxPilotes; i++) {
                System.out.printf("Pilote %d (ID, 0 pour ignorer) : ", i+1);
                int userId = readIntSafely();
                if (userId > 0) {
                    User selectedUser = usersDAO.findById(userId);
                    if (selectedUser != null) {
                        newPilotIds.add(userId);
                        System.out.println("[INFO] Selectionne: " + selectedUser.getFirstname() + " " + selectedUser.getLastname());
                    } else {
                        System.out.println("[ATTENTION] Pilote non trouve, ignore.");
                    }
                }
            }

            // Supprimer anciens liens et ajouter nouveaux
            if (!newPilotIds.isEmpty()) {
                teamsDAO.removeAllTeamUsers(id); // Supprime tous les anciens liens
                for (int userId : newPilotIds) {
                    teamsDAO.associateTeamUser(id, userId);
                }
            }
        }

        System.out.print("\nConfirmer la modification ? (o/n) : ");
        String confirm = in.nextLine().trim().toLowerCase();
        if (!confirm.equals("o") && !confirm.equals("oui")) {
            System.out.println("[INFO] Modification annulee.");
            return;
        }

        int rows = teamsDAO.update(team);
        System.out.println(rows == 1 ? "[SUCCES] Equipe mise a jour." : "[ERREUR] Echec mise a jour.");
    }


    private static void deleteTeam() {
        System.out.print("ID de l'equipe a supprimer : ");
        int id = readIntSafely();
        
        System.out.print("Confirmer la suppression ? (o/n) : ");
        String confirm = in.nextLine().trim().toLowerCase();
        
        if (confirm.equals("o") || confirm.equals("oui")) {
            int rows = teamsDAO.delete(id);
            System.out.println(rows == 1 ? "[SUCCES] Supprime." : "[ERREUR] Echec.");
        }
    }

    private static void showTeamDrivers() {
        System.out.print("ID de l'equipe : ");
        int teamId = readIntSafely();
        
        List<Driver> drivers = driversDAO.findByTeam(teamId);
        if (drivers.isEmpty()) {
            System.out.println("[INFO] Aucun pilote pour cette equipe.");
        } else {
            System.out.println("[INFO] Pilotes de l'equipe :");
            drivers.forEach(d -> System.out.println("  > " + d));
        }
    }

    // ==========================================
    // GESTION CIRCUITS
    // ==========================================
    private static void createCircuit() {
        System.out.println("--- Creation d'un circuit ---");
        String nom = readNonEmptyString("Nom du circuit : ");
        System.out.print("Longueur (km) : ");
        double longueur = readDoubleSafely();
        System.out.print("ID localisation : ");
        int idLoc = readIntSafely();

        Circuit circuit = new Circuit(0, nom, longueur, idLoc);
        int rows = circuitsDAO.create(circuit);
        System.out.println(rows == 1 ? "[SUCCES] Circuit cree." : "[ERREUR] Echec.");
    }

    private static void listCircuits() {
        System.out.println("\n=== CIRCUITS F1 2025 ===");
        List<Circuit> circuits = circuitsDAO.findAll();
        
        if (circuits.isEmpty()) {
            System.out.println("[INFO] Aucun circuit.");
        } else {
            circuits.forEach(c -> System.out.println("  > " + c));
        }
    }

    private static void updateCircuit() {
        System.out.print("ID du circuit a modifier : ");
        int id = readIntSafely();
        Circuit c = circuitsDAO.findById(id);
        
        if (c == null) {
            System.out.println("[ERREUR] Circuit introuvable.");
            return;
        }

        System.out.println("[INFO] Circuit actuel : " + c);
        System.out.print("Nouveau nom [" + c.getNom() + "] : ");
        String nom = in.nextLine().trim();
        if (!nom.isEmpty()) c.setNom(nom);

        System.out.print("Nouvelle longueur [" + c.getLongueur() + "] : ");
        String longueurStr = in.nextLine().trim();
        if (!longueurStr.isEmpty()) {
            try {
                c.setLongueur(Double.parseDouble(longueurStr));
            } catch (NumberFormatException e) {
                System.out.println("[ATTENTION] Longueur invalide, conservation de la valeur.");
            }
        }

        System.out.print("Nouvel ID localisation [" + c.getIdLocalisation() + "] : ");
        String idLocStr = in.nextLine().trim();
        if (!idLocStr.isEmpty()) {
            try {
                int newIdLoc = Integer.parseInt(idLocStr);
                if (newIdLoc > 0) {
                    c.setIdLocalisation(newIdLoc);
                } else {
                    System.out.println("[ATTENTION] ID localisation invalide, conservation de la valeur.");
                }
            } catch (NumberFormatException e) {
                System.out.println("[ATTENTION] ID localisation invalide, conservation de la valeur.");
            }
        }

        System.out.print("Confirmer la modification ? (o/n) : ");
        String confirm = in.nextLine().trim().toLowerCase();
        if (!confirm.equals("o") && !confirm.equals("oui")) {
            System.out.println("[INFO] Modification annulee.");
            return;
        }

        int rows = circuitsDAO.update(c);
        System.out.println(rows == 1 ? "[SUCCES] Circuit mis a jour." : "[ERREUR] Echec.");
    }


    private static void deleteCircuit() {
        System.out.print("ID du circuit a supprimer : ");
        int id = readIntSafely();
        
        System.out.print("Confirmer ? (o/n) : ");
        String confirm = in.nextLine().trim().toLowerCase();
        
        if (confirm.equals("o") || confirm.equals("oui")) {
            int rows = circuitsDAO.delete(id);
            System.out.println(rows == 1 ? "[SUCCES] Supprime." : "[ERREUR] Echec.");
        }
    }

    private static void searchCircuitsByCountry() {
        String pays = readNonEmptyString("Pays a rechercher : ");
        List<Circuit> circuits = circuitsDAO.findByCountry(pays);
        
        if (circuits.isEmpty()) {
            System.out.println("[INFO] Aucun circuit trouve pour : " + pays);
        } else {
            System.out.println("[INFO] Circuits trouves :");
            circuits.forEach(c -> System.out.println("  > " + c));
        }
    }

    // ==========================================
    // METHODES UTILITAIRES
    // ==========================================
    private static int readIntSafely() {
        try {
            return Integer.parseInt(in.nextLine().trim());
        } catch (NumberFormatException e) {
            return -1;
        }
    }

    private static double readDoubleSafely() {
        try {
            return Double.parseDouble(in.nextLine().trim());
        } catch (NumberFormatException e) {
            return 0.0;
        }
    }

    private static String readNonEmptyString(String prompt) {
        String input;
        do {
            System.out.print(prompt);
            input = in.nextLine().trim();
            if (input.isEmpty()) {
                System.out.println("[ERREUR] Ce champ ne peut pas etre vide.");
            }
        } while (input.isEmpty());
        return input;
    }

    private static String readValidEmail(String prompt) {
        String email;
        do {
            System.out.print(prompt);
            email = in.nextLine().trim();
            
            if (email.isEmpty()) {
                System.out.println("[ERREUR] L'email ne peut pas etre vide.");
            } else if (!isValidEmail(email)) {
                System.out.println("[ERREUR] Format d'email invalide.");
            } else {
                return email;
            }
        } while (true);
    }

    private static boolean isValidEmail(String email) {
        return email.matches("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$");
    }

    private static boolean isValidName(String name) {
        return name.matches("^[a-zA-ZÀ-ÿ\\s'-]+$");
    }
}