package com.fresas.crema.controladores;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.fresas.crema.servicios.ConfiguracionService;

@Controller
public class ConfiguracionesControlador {

    @Autowired
    private ConfiguracionService configuracionService;

    // 1. Mostrar página de configuraciones
    @GetMapping("/admin/configuraciones")
    public String mostrarConfiguraciones(Model model) {
        model.addAttribute("numeroActual", configuracionService.getNumeroWhatsApp());
        model.addAttribute("contenido", "admin/configuraciones :: config-content");
        return "admin/layout";
    }

    // 2. Guardar el número de WhatsApp
    @PostMapping("/admin/configuraciones/guardar")
    public String guardarConfiguraciones(@RequestParam String whatsappNumero, RedirectAttributes redirectAttrs) {
        configuracionService.saveNumeroWhatsApp(whatsappNumero);
        redirectAttrs.addFlashAttribute("msgExito", "¡Número de WhatsApp actualizado!");
        return "redirect:/admin/configuraciones";
    }

}
