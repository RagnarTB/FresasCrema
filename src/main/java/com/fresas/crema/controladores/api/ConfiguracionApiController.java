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
        response.put("numeroWhatsApp", configuracionService.getNumeroWhatsApp());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/whatsapp")
    public ResponseEntity<Map<String, String>> guardarNumeroWhatsApp(@RequestBody Map<String, String> request) {
        try {
            String numero = request.get("numeroWhatsApp");
            configuracionService.saveNumeroWhatsApp(numero);
            Map<String, String> response = new HashMap<>();
            response.put("mensaje", "Número de WhatsApp actualizado correctamente");
            response.put("numeroWhatsApp", numero);
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
