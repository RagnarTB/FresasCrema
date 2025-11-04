package com.fresas.crema.controladores;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.fresas.crema.modelos.Producto;
import com.fresas.crema.repositorios.ProductoRepositorio;

import jakarta.validation.Valid;

@Controller
@RequestMapping("/admin/productos")
public class ProductosControlador {
    @Autowired
    private ProductoRepositorio productoRepositorio;

    // 1. Mostrar Lista de Productos
    @GetMapping
    public String listarProductos(Model model) {
        model.addAttribute("productos", productoRepositorio.findAll());
        model.addAttribute("contenido", "admin/productos :: lista-productos");
        return "admin/layout";
    }

    // 2. Mostrar Formulario para Nuevo Producto
    @GetMapping("/nuevo")
    public String mostrarFormNuevo(Model model) {
        model.addAttribute("producto", new Producto());
        model.addAttribute("contenido", "admin/productos :: form-producto");
        return "admin/layout";
    }

    // 3. Mostrar Formulario para Editar Producto
    @GetMapping("/editar/{id}")
    public String mostrarFormEditar(@PathVariable Long id, Model model) {
        Producto producto = productoRepositorio.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("ID de producto inválido: " + id));
        model.addAttribute("producto", producto);
        model.addAttribute("contenido", "admin/productos :: form-producto");
        return "admin/layout";
    }

    // 4. Guardar (Crear o Actualizar) Producto
    @PostMapping("/guardar")
    public String guardarProducto(@Valid @ModelAttribute("producto") Producto producto,
            BindingResult result, Model model, RedirectAttributes redirectAttrs) {

        if (result.hasErrors()) {
            model.addAttribute("contenido", "admin/productos :: form-producto");
            return "admin/layout";
        }

        productoRepositorio.save(producto);
        redirectAttrs.addFlashAttribute("msgExito", "¡Producto guardado correctamente!");
        return "redirect:/admin/productos";
    }

    // 5. Eliminar Producto
    @GetMapping("/eliminar/{id}")
    public String eliminarProducto(@PathVariable Long id, RedirectAttributes redirectAttrs) {
        productoRepositorio.deleteById(id);
        redirectAttrs.addFlashAttribute("msgExito", "¡Producto eliminado!");
        return "redirect:/admin/productos";
    }

}
