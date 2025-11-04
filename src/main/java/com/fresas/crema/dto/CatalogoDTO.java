package com.fresas.crema.dto;

import com.fresas.crema.modelos.Adicional;
import com.fresas.crema.modelos.Jalea;
import com.fresas.crema.modelos.Producto;
import com.fresas.crema.modelos.Topping;

import java.util.List;

/**
 * DTO que contiene toda la información pública del catálogo
 * para ser consumida por el frontend del cliente
 */
public class CatalogoDTO {
    private List<Producto> productos;
    private List<Topping> toppings;
    private List<Jalea> jaleas;
    private List<Adicional> adicionales;
    private String numeroWhatsApp;

    // Constructores
    public CatalogoDTO() {
    }

    public CatalogoDTO(List<Producto> productos, List<Topping> toppings, List<Jalea> jaleas,
            List<Adicional> adicionales, String numeroWhatsApp) {
        this.productos = productos;
        this.toppings = toppings;
        this.jaleas = jaleas;
        this.adicionales = adicionales;
        this.numeroWhatsApp = numeroWhatsApp;
    }

    // Getters y Setters
    public List<Producto> getProductos() {
        return productos;
    }

    public void setProductos(List<Producto> productos) {
        this.productos = productos;
    }

    public List<Topping> getToppings() {
        return toppings;
    }

    public void setToppings(List<Topping> toppings) {
        this.toppings = toppings;
    }

    public List<Jalea> getJaleas() {
        return jaleas;
    }

    public void setJaleas(List<Jalea> jaleas) {
        this.jaleas = jaleas;
    }

    public List<Adicional> getAdicionales() {
        return adicionales;
    }

    public void setAdicionales(List<Adicional> adicionales) {
        this.adicionales = adicionales;
    }

    public String getNumeroWhatsApp() {
        return numeroWhatsApp;
    }

    public void setNumeroWhatsApp(String numeroWhatsApp) {
        this.numeroWhatsApp = numeroWhatsApp;
    }
}
