package com.fresas.crema.modelos;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Configuracion {

    @Id
    private String clave; // Ej: "WHATSAPP_NUMERO"

    private String valor; // Ej: "+51999888777"

    public Configuracion(String clave, String valor) {
        this.clave = clave;
        this.valor = valor;
    }

    public Configuracion() {
    }

    public String getClave() {
        return clave;
    }

    public void setClave(String clave) {
        this.clave = clave;
    }

    public String getValor() {
        return valor;
    }

    public void setValor(String valor) {
        this.valor = valor;
    }

}
