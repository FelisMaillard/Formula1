package com.formula1.model;

public class Team {
    private int id;
    private String libelle;
    private String dateCreation;
    private int points;

    public Team() {}

    public Team(int id, String libelle, String dateCreation, int points) {
        this.id = id;
        this.libelle = libelle;
        this.dateCreation = dateCreation;
        this.points = points;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getLibelle() { return libelle; }
    public void setLibelle(String libelle) { this.libelle = libelle; }
    public String getDateCreation() { return dateCreation; }
    public void setDateCreation(String dateCreation) { this.dateCreation = dateCreation; }
    public int getPoints() { return points; }
    public void setPoints(int points) { this.points = points; }

    @Override
    public String toString() {
        return String.format("ID=%d, %s (cree: %s, points: %d)", id, libelle, dateCreation, points);
    }
}