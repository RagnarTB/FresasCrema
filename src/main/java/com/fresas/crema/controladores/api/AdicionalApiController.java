package com.fresas.crema.controladores.api;

import com.fresas.crema.modelos.Adicional;
import com.fresas.crema.repositorios.AdicionalRepositorio;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/adicionales")
public class AdicionalApiController {

    @Autowired
    private AdicionalRepositorio adicionalRepositorio;

    @GetMapping
    public ResponseEntity<List<Adicional>> listarAdicionales() {
        return ResponseEntity.ok(adicionalRepositorio.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Adicional> obtenerAdicional(@PathVariable Long id) {
        return adicionalRepositorio.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Adicional> crearAdicional(@Valid @RequestBody Adicional adicional) {
        Adicional nuevoAdicional = adicionalRepositorio.save(adicional);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoAdicional);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Adicional> actualizarAdicional(@PathVariable Long id,
            @Valid @RequestBody Adicional adicionalActualizado) {
        return adicionalRepositorio.findById(id)
                .map(adicional -> {
                    adicional.setNombre(adicionalActualizado.getNombre());
                    adicional.setPrecio(adicionalActualizado.getPrecio());
                    adicional.setDisponible(adicionalActualizado.isDisponible());
                    return ResponseEntity.ok(adicionalRepositorio.save(adicional));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarAdicional(@PathVariable Long id) {
        if (adicionalRepositorio.existsById(id)) {
            adicionalRepositorio.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
