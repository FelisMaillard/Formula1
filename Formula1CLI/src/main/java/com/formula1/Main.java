package com.formula1;

import java.util.List;
import java.util.Scanner;

import com.formula1.dao.CircuitsDAO;
import com.formula1.dao.DriversDAO;
import com.formula1.dao.EvenementsDAO;
import com.formula1.dao.ResultatsDAO;
import com.formula1.dao.SaisonsDAO;
import com.formula1.dao.StatistiquesDAO;
import com.formula1.dao.TeamsDAO;
import com.formula1.dao.UsersDAO;
import com.formula1.model.Circuit;
import com.formula1.model.Driver;
import com.formula1.model.Evenement;
import com.formula1.model.Saison;
import com.formula1.model.Team;
import com.formula1.model.User;

public class Main {
    private static final Scanner in = new Scanner(System.in);
    private static final UsersDAO usersDAO = new UsersDAO();
    private static final TeamsDAO teamsDAO = new TeamsDAO();
    private static final DriversDAO driversDAO = new DriversDAO();
    private static final CircuitsDAO circuitsDAO = new CircuitsDAO();
    private static final SaisonsDAO saisonsDAO = new SaisonsDAO();
    private static final EvenementsDAO evenementsDAO = new EvenementsDAO();
    private static final ResultatsDAO resultatsDAO = new ResultatsDAO();
    private static final StatistiquesDAO statistiquesDAO = new StatistiquesDAO();

    public static void main(String[] args) {
        int choice;
        do {
            System.out.println("\n==========================================");
            System.out.println("      GESTION BASE DE DONNEES F1 2025     ");
            System.out.println("==========================================");
            System.out.println("GESTION DES DONNEES");
            System.out.println("1.  Users (Pilotes)");
            System.out.println("2.  Teams (Equipes)");
            System.out.println("3.  Circuits");
            System.out.println("4.  Saisons");
            System.out.println("5.  Evenements (Courses)");
            System.out.println("6.  Resultats");
            System.out.println("-------------------------------------------");
            System.out.println("CLASSEMENTS & CALENDRIERS");
            System.out.println("7. Classement Pilotes");
            System.out.println("8. Classement Equipes");
            System.out.println("9. Calendrier Saison");
            System.out.println("10. Prochain Grand Prix");
            System.out.println("-------------------------------------------");
            System.out.println("STATISTIQUES");
            System.out.println("11. Top Vainqueurs");
            System.out.println("12. Top Podiums");
            System.out.println("13. Stats Pilote");
            System.out.println("14. Comparer 2 Pilotes");
            System.out.println("15. Performance Equipes");
            System.out.println("16. Derniers Vainqueurs");
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
                case 4 -> menuSaisons();
                case 5 -> menuEvenements();
                case 6 -> menuResultats();
                case 7 -> driversDAO.getDriverStandings();
                case 8 -> teamsDAO.getTeamStandings();
                case 9 -> showSeasonCalendar();
                case 10 -> evenementsDAO.getNextEvent();
                case 11 -> statistiquesDAO.getTopWinners();
                case 12 -> statistiquesDAO.getTopPodiums();
                case 13 -> showDriverStats();
                case 14 -> compareTwoDrivers();
                case 15 -> statistiquesDAO.getBestTeamPerformance();
                case 16 -> showLastWinners();
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

        Team team = new Team(0, libelle, dateCreation, points);
        int rows = teamsDAO.create(team);
        System.out.println(rows == 1 ? "[SUCCES] Equipe creee : " + team : "[ERREUR] Echec creation.");
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
        System.out.print("Nouveau nom [" + team.getLibelle() + "] : ");
        String libelle = in.nextLine().trim();
        if (!libelle.isEmpty()) team.setLibelle(libelle);

        System.out.print("Nouveaux points [" + team.getPoints() + "] : ");
        String pointsStr = in.nextLine().trim();
        if (!pointsStr.isEmpty()) {
            try {
                team.setPoints(Integer.parseInt(pointsStr));
            } catch (NumberFormatException e) {
                System.out.println("[ATTENTION] Points invalides, conservation de la valeur.");
            }
        }

        int rows = teamsDAO.update(team);
        System.out.println(rows == 1 ? "[SUCCES] Equipe mise a jour." : "[ERREUR] Echec.");
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

    // ==========================================
    // MENU SAISONS
    // ==========================================
    private static void menuSaisons() {
        int choice;
        do {
            System.out.println("\n=== MENU SAISONS ===");
            System.out.println("1. Creer saison");
            System.out.println("2. Lister saisons");
            System.out.println("3. Modifier saison");
            System.out.println("4. Supprimer saison");
            System.out.println("5. Stats d'une saison");
            System.out.println("0. Retour");
            System.out.print("Choix : ");
            choice = readIntSafely();

            switch (choice) {
                case 1 -> createSaison();
                case 2 -> listSaisons();
                case 3 -> updateSaison();
                case 4 -> deleteSaison();
                case 5 -> showSeasonStats();
            }
        } while (choice != 0);
    }

    private static void createSaison() {
        System.out.println("--- Creation d'une saison ---");
        String nom = readNonEmptyString("Nom (ex: Saison F1 2026) : ");
        System.out.print("Annee : ");
        int annee = readIntSafely();
        String dateDebut = readNonEmptyString("Date debut (YYYY-MM-DD) : ");
        String dateFin = readNonEmptyString("Date fin (YYYY-MM-DD) : ");

        Saison saison = new Saison(0, nom, annee, dateDebut, dateFin);
        int rows = saisonsDAO.create(saison);
        System.out.println(rows == 1 ? "[SUCCES] Saison creee." : "[ERREUR] Echec.");
    }

    private static void listSaisons() {
        System.out.println("--- Liste des saisons ---");
        List<Saison> saisons = saisonsDAO.findAll();
        if (saisons.isEmpty()) {
            System.out.println("[INFO] Aucune saison.");
        } else {
            saisons.forEach(s -> System.out.println("  > " + s));
        }
    }

    private static void updateSaison() {
        System.out.print("ID de la saison a modifier : ");
        int id = readIntSafely();
        Saison s = saisonsDAO.findById(id);
        
        if (s == null) {
            System.out.println("[ERREUR] Saison introuvable.");
            return;
        }

        System.out.println("[INFO] Saison actuelle : " + s);
        System.out.print("Nouveau nom [" + s.getNom() + "] : ");
        String nom = in.nextLine().trim();
        if (!nom.isEmpty()) s.setNom(nom);

        int rows = saisonsDAO.update(s);
        System.out.println(rows == 1 ? "[SUCCES] Saison mise a jour." : "[ERREUR] Echec.");
    }

    private static void deleteSaison() {
        System.out.print("ID de la saison a supprimer : ");
        int id = readIntSafely();
        System.out.print("Confirmer ? (o/n) : ");
        String confirm = in.nextLine().trim().toLowerCase();
        
        if (confirm.equals("o") || confirm.equals("oui")) {
            int rows = saisonsDAO.delete(id);
            System.out.println(rows == 1 ? "[SUCCES] Supprime." : "[ERREUR] Echec.");
        }
    }

    private static void showSeasonStats() {
        System.out.print("ID de la saison : ");
        int id = readIntSafely();
        saisonsDAO.getSeasonStats(id);
    }

    // ==========================================
    // MENU EVENEMENTS
    // ==========================================
    private static void menuEvenements() {
        int choice;
        do {
            System.out.println("\n=== MENU EVENEMENTS (COURSES) ===");
            System.out.println("1. Creer evenement");
            System.out.println("2. Lister tous evenements");
            System.out.println("3. Evenements d'une saison");
            System.out.println("4. Supprimer evenement");
            System.out.println("0. Retour");
            System.out.print("Choix : ");
            choice = readIntSafely();

            switch (choice) {
                case 1 -> createEvenement();
                case 2 -> listAllEvents();
                case 3 -> listEventsBySeason();
                case 4 -> deleteEvenement();
            }
        } while (choice != 0);
    }

    private static void createEvenement() {
        System.out.println("--- Creation d'un evenement ---");
        String nom = readNonEmptyString("Nom (ex: Grand Prix de Monaco) : ");
        String dateHeure = readNonEmptyString("Date et heure (YYYY-MM-DD HH:MM:SS) : ");
        System.out.print("ID type evenement (5=Course principale) : ");
        int idType = readIntSafely();
        System.out.print("ID saison : ");
        int idSaison = readIntSafely();
        System.out.print("ID circuit : ");
        int idCircuit = readIntSafely();

        Evenement evt = new Evenement(0, nom, dateHeure, idType, idSaison, idCircuit);
        int rows = evenementsDAO.create(evt);
        System.out.println(rows == 1 ? "[SUCCES] Evenement cree." : "[ERREUR] Echec.");
    }

    private static void listEventsBySeason() {
        System.out.print("ID de la saison : ");
        int saisonId = readIntSafely();
        List<Evenement> events = evenementsDAO.findBySeason(saisonId);
        
        if (events.isEmpty()) {
            System.out.println("[INFO] Aucun evenement pour cette saison.");
        } else {
            System.out.println("[INFO] Evenements trouves :");
            events.forEach(e -> System.out.println("  > " + e));
        }
    }

    private static void listAllEvents() {
        System.out.println("--- Tous les evenements ---");
        List<Evenement> events = evenementsDAO.findAll();
        
        if (events.isEmpty()) {
            System.out.println("[INFO] Aucun evenement.");
        } else {
            System.out.println("[INFO] " + events.size() + " evenement(s) :\n");
            events.forEach(e -> System.out.println("  > " + e));
        }
    }


    private static void deleteEvenement() {
        System.out.print("ID de l'evenement a supprimer : ");
        int id = readIntSafely();
        System.out.print("Confirmer ? (o/n) : ");
        String confirm = in.nextLine().trim().toLowerCase();
        
        if (confirm.equals("o") || confirm.equals("oui")) {
            int rows = evenementsDAO.delete(id);
            System.out.println(rows == 1 ? "[SUCCES] Supprime." : "[ERREUR] Echec.");
        }
    }

    private static void showSeasonCalendar() {
        System.out.print("ID de la saison (2 pour 2025) : ");
        int saisonId = readIntSafely();
        evenementsDAO.displaySeasonCalendar(saisonId);
    }

    // ==========================================
    // MENU RESULTATS
    // ==========================================
    private static void menuResultats() {
        int choice;
        do {
            System.out.println("\n=== MENU RESULTATS ===");
            System.out.println("1. Ajouter resultat");
            System.out.println("2. Voir resultats d'une course");
            System.out.println("3. Voir podium d'une course");
            System.out.println("4. Resultats saison d'un pilote");
            System.out.println("5. Victoires d'un pilote");
            System.out.println("0. Retour");
            System.out.print("Choix : ");
            choice = readIntSafely();

            switch (choice) {
                case 1 -> addResult();
                case 2 -> showEventResults();
                case 3 -> showPodium();
                case 4 -> showDriverSeasonResults();
                case 5 -> showDriverWins();
            }
        } while (choice != 0);
    }

    private static void addResult() {
        System.out.println("--- Ajouter un resultat ---");
        System.out.print("ID driver : ");
        int driverId = readIntSafely();
        System.out.print("ID bareme (1=1er place, 2=2e, etc.) : ");
        int baremeId = readIntSafely();
        System.out.print("ID evenement : ");
        int eventId = readIntSafely();

        int rows = resultatsDAO.create(driverId, baremeId, eventId);
        System.out.println(rows == 1 ? "[SUCCES] Resultat ajoute." : "[ERREUR] Echec.");
    }

    private static void showEventResults() {
        System.out.print("ID de l'evenement : ");
        int eventId = readIntSafely();
        resultatsDAO.getEventResults(eventId);
    }

    private static void showPodium() {
        System.out.print("ID de l'evenement : ");
        int eventId = readIntSafely();
        resultatsDAO.getPodium(eventId);
    }

    private static void showDriverSeasonResults() {
        System.out.print("ID du pilote : ");
        int driverId = readIntSafely();
        System.out.print("ID de la saison : ");
        int saisonId = readIntSafely();
        resultatsDAO.getDriverSeasonResults(driverId, saisonId);
    }

    private static void showDriverWins() {
        System.out.print("ID du pilote : ");
        int driverId = readIntSafely();
        resultatsDAO.getDriverWins(driverId);
    }

    // ==========================================
    // STATISTIQUES
    // ==========================================
    private static void showDriverStats() {
        System.out.print("ID du pilote : ");
        int driverId = readIntSafely();
        statistiquesDAO.getDriverStats(driverId);
    }

    private static void compareTwoDrivers() {
        System.out.print("ID du pilote 1 : ");
        int driver1 = readIntSafely();
        System.out.print("ID du pilote 2 : ");
        int driver2 = readIntSafely();
        statistiquesDAO.compareDrivers(driver1, driver2);
    }

    private static void showLastWinners() {
        System.out.print("Nombre de derniers vainqueurs a afficher : ");
        int limit = readIntSafely();
        if (limit <= 0) limit = 5;
        statistiquesDAO.getLastWinners(limit);
    }
}