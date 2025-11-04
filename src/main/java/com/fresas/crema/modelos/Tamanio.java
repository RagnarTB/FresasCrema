package com.fresas.crema.modelos;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
public class Tamanio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotEmpty(message = "El nombre del tamaño no puede estar vacío")
    @Size(min = 2, max = 50)
    private String nombre; // Ej: "Pequeño", "Mediano", "Grande", "Premium"

    @NotNull(message = "El precio base es obligatorio")
    @PositiveOrZero
    private Double precioBase; // Ej: 5.0, 8.0, 10.0, 15.0

    @NotNull(message = "La cantidad de toppings incluidos es obligatoria")
    @PositiveOrZero
    private Integer toppingsIncluidos; // Ej: 1, 2, 3

    @NotNull(message = "La cantidad de jaleas incluidas es obligatoria")
    @PositiveOrZero
    private Integer jaleasIncluidas; // Ej: 1, 2

    @ManyToOne
    @JoinColumn(name = "producto_id")
    @JsonBackReference
    private Producto producto;

    // Constructores
    public Tamanio() {
    }

    public Tamanio(String nombre, Double precioBase, Integer toppingsIncluidos, Integer jaleasIncluidas,
            Producto producto) {
        this.nombre = nombre;
        this.precioBase = precioBase;
        this.toppingsIncluidos = toppingsIncluidos;
        this.jaleasIncluidas = jaleasIncluidas;
        this.producto = producto;
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

    public Double getPrecioBase() {
        return precioBase;
    }

    public void setPrecioBase(Double precioBase) {
        this.precioBase = precioBase;
    }

    public Integer getToppingsIncluidos() {
        return toppingsIncluidos;
    }

    public void setToppingsIncluidos(Integer toppingsIncluidos) {
        this.toppingsIncluidos = toppingsIncluidos;
    }

    public Integer getJaleasIncluidas() {
        return jaleasIncluidas;
    }

    public void setJaleasIncluidas(Integer jaleasIncluidas) {
        this.jaleasIncluidas = jaleasIncluidas;
    }

    public Producto getProducto() {
        return producto;
    }

    public void setProducto(Producto producto) {
        this.producto = producto;
    }
}
