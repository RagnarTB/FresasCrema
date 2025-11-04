package com.fresas.crema.controladores;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class adminControlador {

    @GetMapping("/login")
    public String loginPage() {
        return "login";
    }

    @GetMapping("/admin/dashboard")
    public String dashboard(Model model) {
        // Esta línea es correcta y busca 'admin/dashboard :: content'
        model.addAttribute("contenido", "admin/dashboard :: content");
        return "admin/layout";
    }
}