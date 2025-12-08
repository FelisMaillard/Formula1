package com.formula1.model;

public class Bareme {
    private int id;
    private int place;
    private int point;

    public Bareme() {}

    public Bareme(int id, int place, int point) {
        this.id = id;
        this.place = place;
        this.point = point;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public int getPlace() { return place; }
    public void setPlace(int place) { this.place = place; }
    public int getPoint() { return point; }
    public void setPoint(int point) { this.point = point; }

    @Override
    public String toString() {
        return String.format("Place %d = %d points", place, point);
    }
}
