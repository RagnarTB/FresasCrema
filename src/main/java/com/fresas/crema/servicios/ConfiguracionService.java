package com.fresas.crema.servicios;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fresas.crema.modelos.Configuracion;
import com.fresas.crema.repositorios.ConfiguracionRepositorio;

@Service
public class ConfiguracionService {
    @Autowired
    private ConfiguracionRepositorio configuracionRepositorio;

    public String getNumeroWhatsApp() {
        // Busca la clave, si no existe, devuelve un número por defecto
        return configuracionRepositorio.findById("WHATSAPP_NUMERO")
                .map(Configuracion::getValor)
                .orElse("+51000000000"); // Número por defecto
    }

    public void saveNumeroWhatsApp(String numero) {
        // Validar que el número no esté vacío
        if (numero == null || numero.trim().isEmpty()) {
            throw new IllegalArgumentException("El número de WhatsApp no puede estar vacío");
        }

        // Limpiar espacios en blanco
        numero = numero.trim();

        // Validar formato básico (debe empezar con + y tener solo números después)
        if (!numero.matches("^\\+\\d{10,15}$")) {
            throw new IllegalArgumentException(
                    "El número debe tener el formato correcto: +[código de país][número] (ej: +51987654321)");
        }

        Configuracion config = configuracionRepositorio.findById("WHATSAPP_NUMERO")
                .orElse(new Configuracion());
        config.setClave("WHATSAPP_NUMERO");
        config.setValor(numero);
        configuracionRepositorio.save(config);
    }
}
