package com.formula1.model;

public class Evenement {
    private int id;
    private String nom;
    private String dateHeure;
    private int idTypeEvenement;
    private int idSaison;
    private int idCircuit;

    public Evenement() {}

    public Evenement(int id, String nom, String dateHeure, int idTypeEvenement, int idSaison, int idCircuit) {
        this.id = id;
        this.nom = nom;
        this.dateHeure = dateHeure;
        this.idTypeEvenement = idTypeEvenement;
        this.idSaison = idSaison;
        this.idCircuit = idCircuit;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    public String getDateHeure() { return dateHeure; }
    public void setDateHeure(String dateHeure) { this.dateHeure = dateHeure; }
    public int getIdTypeEvenement() { return idTypeEvenement; }
    public void setIdTypeEvenement(int idTypeEvenement) { this.idTypeEvenement = idTypeEvenement; }
    public int getIdSaison() { return idSaison; }
    public void setIdSaison(int idSaison) { this.idSaison = idSaison; }
    public int getIdCircuit() { return idCircuit; }
    public void setIdCircuit(int idCircuit) { this.idCircuit = idCircuit; }

    @Override
    public String toString() {
        return String.format("ID=%d, %s (%s)", id, nom, dateHeure);
    }
}
