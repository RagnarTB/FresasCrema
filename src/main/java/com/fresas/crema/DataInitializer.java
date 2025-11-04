package com.fresas.crema;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.fresas.crema.modelos.Configuracion;
import com.fresas.crema.modelos.Usuario;
import com.fresas.crema.repositorios.ConfiguracionRepositorio;
import com.fresas.crema.repositorios.UsuarioRepositorio;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UsuarioRepositorio usuarioRepository;

    @Autowired
    private ConfiguracionRepositorio configuracionRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {

        // 1. Crear usuario admin si no existe
        if (usuarioRepository.findByUsername("admin") == null) {
            Usuario admin = new Usuario();
            admin.setUsername("admin");
            // ¡Recuerda cambiar esta contraseña!
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole("ROLE_ADMIN");
            usuarioRepository.save(admin);
        }

        // 2. Crear configuración de WhatsApp si no existe
        if (configuracionRepository.findById("WHATSAPP_NUMERO").isEmpty()) {
            Configuracion config = new Configuracion();
            config.setClave("WHATSAPP_NUMERO");
            config.setValor("+51987654321"); // Pon tu número aquí
            configuracionRepository.save(config);
        }
    }
}
