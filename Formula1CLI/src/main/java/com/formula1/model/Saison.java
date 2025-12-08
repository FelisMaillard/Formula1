package com.formula1.model;

public class Saison {
    private int id;
    private String nom;
    private int annee;
    private String dateDebut;
    private String dateFin;

    public Saison() {}

    public Saison(int id, String nom, int annee, String dateDebut, String dateFin) {
        this.id = id;
        this.nom = nom;
        this.annee = annee;
        this.dateDebut = dateDebut;
        this.dateFin = dateFin;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    public int getAnnee() { return annee; }
    public void setAnnee(int annee) { this.annee = annee; }
    public String getDateDebut() { return dateDebut; }
    public void setDateDebut(String dateDebut) { this.dateDebut = dateDebut; }
    public String getDateFin() { return dateFin; }
    public void setDateFin(String dateFin) { this.dateFin = dateFin; }

    @Override
    public String toString() {
        return String.format("ID=%d, %s (%d) - Du %s au %s", id, nom, annee, dateDebut, dateFin);
    }
}
