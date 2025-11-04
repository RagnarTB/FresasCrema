package com.fresas.crema.controladores.api;

import com.fresas.crema.modelos.Topping;
import com.fresas.crema.repositorios.ToppingRepositorio;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/toppings")
public class ToppingApiController {

    @Autowired
    private ToppingRepositorio toppingRepositorio;

    @GetMapping
    public ResponseEntity<List<Topping>> listarToppings() {
        return ResponseEntity.ok(toppingRepositorio.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Topping> obtenerTopping(@PathVariable Long id) {
        return toppingRepositorio.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Topping> crearTopping(@Valid @RequestBody Topping topping) {
        Topping nuevoTopping = toppingRepositorio.save(topping);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoTopping);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Topping> actualizarTopping(@PathVariable Long id,
            @Valid @RequestBody Topping toppingActualizado) {
        return toppingRepositorio.findById(id)
                .map(topping -> {
                    topping.setNombre(toppingActualizado.getNombre());
                    topping.setDisponible(toppingActualizado.isDisponible());
                    return ResponseEntity.ok(toppingRepositorio.save(topping));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarTopping(@PathVariable Long id) {
        if (toppingRepositorio.existsById(id)) {
            toppingRepositorio.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
