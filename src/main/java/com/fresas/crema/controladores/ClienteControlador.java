package com.fresas.crema.controladores;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.fresas.crema.repositorios.ProductoRepositorio;
import com.fresas.crema.servicios.ConfiguracionService;

@Controller
public class ClienteControlador {
    @Autowired
    private ProductoRepositorio productoRepositorio;

    @Autowired
    private ConfiguracionService configuracionService;

    // Página de Inicio
    @GetMapping("/")
    public String index() {
        return "cliente/index"; // -> templates/cliente/index.html
    }

    // Página del Catálogo
    @GetMapping("/catalogo")
    public String catalogo(Model model) {
        model.addAttribute("productos", productoRepositorio.findAll());
        model.addAttribute("numeroWhatsApp", configuracionService.getNumeroWhatsApp());
        return "cliente/catalogo"; // -> templates/cliente/catalogo.html
    }
}
