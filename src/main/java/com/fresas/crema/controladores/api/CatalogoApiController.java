package com.fresas.crema.controladores.api;

import com.fresas.crema.dto.CatalogoDTO;
import com.fresas.crema.repositorios.*;
import com.fresas.crema.servicios.ConfiguracionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public")
public class CatalogoApiController {

    @Autowired
    private ProductoRepositorio productoRepositorio;

    @Autowired
    private ToppingRepositorio toppingRepositorio;

    @Autowired
    private JaleaRepositorio jaleaRepositorio;

    @Autowired
    private AdicionalRepositorio adicionalRepositorio;

    @Autowired
    private ConfiguracionService configuracionService;

    /**
     * Endpoint público que devuelve todo el catálogo con productos, toppings,
     * jaleas, adicionales y número de WhatsApp
     */
    @GetMapping("/catalogo")
    public ResponseEntity<CatalogoDTO> obtenerCatalogo() {
        CatalogoDTO catalogo = new CatalogoDTO();

        // Obtener todos los productos con sus tamaños
        catalogo.setProductos(productoRepositorio.findAll());

        // Obtener solo los toppings disponibles
        catalogo.setToppings(toppingRepositorio.findByDisponibleTrue());

        // Obtener solo las jaleas disponibles
        catalogo.setJaleas(jaleaRepositorio.findByDisponibleTrue());

        // Obtener solo los adicionales disponibles
        catalogo.setAdicionales(adicionalRepositorio.findByDisponibleTrue());

        // Obtener el número de WhatsApp configurado
        catalogo.setNumeroWhatsApp(configuracionService.getNumeroWhatsApp());

        return ResponseEntity.ok(catalogo);
    }
}
