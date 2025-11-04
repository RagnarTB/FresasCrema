package com.fresas.crema.modelos;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

@Entity
public class Jalea {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotEmpty(message = "El nombre de la jalea no puede estar vacío")
    @Size(min = 2, max = 50)
    private String nombre; // Ej: "Fudge de Chocolate", "Manjar", "Leche Condensada", "Sirope de Fresa"

    private boolean disponible = true; // Para activarlo/desactivarlo desde el admin

    // Constructores
    public Jalea() {
    }

    public Jalea(String nombre, boolean disponible) {
        this.nombre = nombre;
        this.disponible = disponible;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public boolean isDisponible() {
        return disponible;
    }

    public void setDisponible(boolean disponible) {
        this.disponible = disponible;
    }
}
