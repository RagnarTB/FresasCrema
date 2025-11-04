package com.fresas.crema.controladores.api;

import com.fresas.crema.servicios.ConfiguracionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/configuraciones")
public class ConfiguracionApiController {

    @Autowired
    private ConfiguracionService configuracionService;

    @GetMapping("/whatsapp")
    public ResponseEntity<Map<String, String>> obtenerNumeroWhatsApp() {
        Map<String, String> response = new HashMap<>();
        String numero = configuracionService.getNumeroWhatsApp();
        response.put("numeroWhatsApp", numero);
        response.put("numero", numero); // Alias para compatibilidad
        return ResponseEntity.ok(response);
    }

    @PostMapping("/whatsapp")
    public ResponseEntity<Map<String, String>> guardarNumeroWhatsAppPost(@RequestBody Map<String, String> request) {
        return guardarNumero(request);
    }

    @PutMapping("/whatsapp")
    public ResponseEntity<Map<String, String>> guardarNumeroWhatsAppPut(@RequestBody Map<String, String> request) {
        return guardarNumero(request);
    }

    private ResponseEntity<Map<String, String>> guardarNumero(Map<String, String> request) {
        try {
            // Aceptar tanto "numero" como "numeroWhatsApp"
            String numero = request.getOrDefault("numero", request.get("numeroWhatsApp"));
            if (numero == null || numero.trim().isEmpty()) {
                throw new IllegalArgumentException("El número de WhatsApp es requerido");
            }
            configuracionService.saveNumeroWhatsApp(numero);
            Map<String, String> response = new HashMap<>();
            response.put("mensaje", "Número de WhatsApp actualizado correctamente");
            response.put("numeroWhatsApp", numero);
            response.put("numero", numero);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Error al guardar la configuración: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
}
