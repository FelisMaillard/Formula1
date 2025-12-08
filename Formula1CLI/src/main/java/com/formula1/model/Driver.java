package com.formula1.model;

public class Driver {
    private int id;
    private int points;
    private int idUser;
    private String firstname; // Jointure avec users
    private String lastname;  // Jointure avec users

    public Driver() {}

    public Driver(int id, int points, int idUser) {
        this.id = id;
        this.points = points;
        this.idUser = idUser;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public int getPoints() { return points; }
    public void setPoints(int points) { this.points = points; }
    public int getIdUser() { return idUser; }
    public void setIdUser(int idUser) { this.idUser = idUser; }
    public String getFirstname() { return firstname; }
    public void setFirstname(String firstname) { this.firstname = firstname; }
    public String getLastname() { return lastname; }
    public void setLastname(String lastname) { this.lastname = lastname; }

    @Override
    public String toString() {
        String name = (firstname != null && lastname != null) 
            ? firstname + " " + lastname 
            : "User ID: " + idUser;
        return String.format("Driver ID=%d, %s (points: %d)", id, name, points);
    }
}