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

        // Limpiar espacios en blanco y eliminar el + si existe
        numero = numero.trim().replace("+", "").replace(" ", "").replace("-", "");

        // Si el número no empieza con 51, agregarlo automáticamente (código de Perú)
        if (!numero.startsWith("51")) {
            numero = "51" + numero;
        }

        // Validar formato básico (debe tener 11 dígitos para Perú: 51 + 9 dígitos)
        if (!numero.matches("^51\\d{9}$")) {
            throw new IllegalArgumentException(
                    "El número debe tener 9 dígitos (ej: 987654321). El código +51 se agregará automáticamente.");
        }

        // Agregar el + al inicio para el formato internacional
        numero = "+" + numero;

        Configuracion config = configuracionRepositorio.findById("WHATSAPP_NUMERO")
                .orElse(new Configuracion());
        config.setClave("WHATSAPP_NUMERO");
        config.setValor(numero);
        configuracionRepositorio.save(config);
    }
}
