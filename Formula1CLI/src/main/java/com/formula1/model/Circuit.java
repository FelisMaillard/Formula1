package com.formula1.model;

public class Circuit {
    private int id;
    private String nom;
    private double longueur;
    private int idLocalisation;
    private String ville; // Jointure avec localisations
    private String pays;  // Jointure avec localisations

    public Circuit() {}

    public Circuit(int id, String nom, double longueur, int idLocalisation) {
        this.id = id;
        this.nom = nom;
        this.longueur = longueur;
        this.idLocalisation = idLocalisation;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    public double getLongueur() { return longueur; }
    public void setLongueur(double longueur) { this.longueur = longueur; }
    public int getIdLocalisation() { return idLocalisation; }
    public void setIdLocalisation(int idLocalisation) { this.idLocalisation = idLocalisation; }
    public String getVille() { return ville; }
    public void setVille(String ville) { this.ville = ville; }
    public String getPays() { return pays; }
    public void setPays(String pays) { this.pays = pays; }

    @Override
    public String toString() {
        String location = (ville != null && pays != null) 
            ? ville + ", " + pays 
            : "Localisation ID: " + idLocalisation;
        return String.format("ID=%d, %s (%.3f km) - %s", id, nom, longueur, location);
    }
}
