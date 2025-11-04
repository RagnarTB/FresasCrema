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
        Configuracion config = new Configuracion();
        config.setClave("WHATSAPP_NUMERO");
        config.setValor(numero);
        configuracionRepositorio.save(config);
    }
}
