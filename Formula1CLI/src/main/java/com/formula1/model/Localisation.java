package com.formula1.model;

public class Localisation {
    private int id;
    private String ville;
    private String pays;

    public Localisation() {}

    public Localisation(int id, String ville, String pays) {
        this.id = id;
        this.ville = ville;
        this.pays = pays;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getVille() { return ville; }
    public void setVille(String ville) { this.ville = ville; }
    public String getPays() { return pays; }
    public void setPays(String pays) { this.pays = pays; }

    @Override
    public String toString() {
        return String.format("ID=%d, %s, %s", id, ville, pays);
    }
}