package com.fresas.crema.modelos;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.ArrayList;
import java.util.List;

@Entity
public class Producto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotEmpty(message = "El nombre no puede estar vacío")
    @Size(min = 3, max = 100)
    private String nombre;

    @Size(max = 500)
    private String descripcion;

    // Guardaremos la URL de la imagen (más simple que guardar el archivo)
    // Permitir que sea opcional
    @Column(name = "foto_url")
    @JsonProperty("imagenUrl") // Mapear a imagenUrl para el frontend
    private String fotoUrl;

    // Tipo de crema: "NORMAL" o "CAFE"
    @NotEmpty(message = "El tipo de crema es obligatorio")
    private String tipoCrema = "NORMAL";

    // Campo para activar/desactivar el producto
    @Column(name = "disponible")
    private Boolean disponible = true;

    // Relación con tamaños (un producto puede tener varios tamaños con distintos precios)
    @OneToMany(mappedBy = "producto", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Tamanio> tamanios = new ArrayList<>();

    // Constructores
    public Producto() {
    }

    public Producto(String nombre, String descripcion, String fotoUrl, String tipoCrema) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.fotoUrl = fotoUrl;
        this.tipoCrema = tipoCrema;
        this.disponible = true;
    }

    // Métodos helper para manejar la relación bidireccional
    public void addTamanio(Tamanio tamanio) {
        tamanios.add(tamanio);
        tamanio.setProducto(this);
    }

    public void removeTamanio(Tamanio tamanio) {
        tamanios.remove(tamanio);
        tamanio.setProducto(null);
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

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getFotoUrl() {
        return fotoUrl;
    }

    public void setFotoUrl(String fotoUrl) {
        this.fotoUrl = fotoUrl;
    }

    // Alias para compatibilidad con el frontend
    @JsonProperty("imagenUrl")
    public String getImagenUrl() {
        return fotoUrl;
    }

    @JsonProperty("imagenUrl")
    public void setImagenUrl(String imagenUrl) {
        this.fotoUrl = imagenUrl;
    }

    public String getTipoCrema() {
        return tipoCrema;
    }

    public void setTipoCrema(String tipoCrema) {
        this.tipoCrema = tipoCrema;
    }

    public Boolean getDisponible() {
        return disponible;
    }

    public void setDisponible(Boolean disponible) {
        this.disponible = disponible;
    }

    public List<Tamanio> getTamanios() {
        return tamanios;
    }

    public void setTamanios(List<Tamanio> tamanios) {
        this.tamanios = tamanios;
    }
}
