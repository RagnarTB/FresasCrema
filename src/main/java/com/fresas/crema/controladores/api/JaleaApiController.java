package com.fresas.crema.controladores.api;

import com.fresas.crema.modelos.Jalea;
import com.fresas.crema.repositorios.JaleaRepositorio;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/jaleas")
public class JaleaApiController {

    @Autowired
    private JaleaRepositorio jaleaRepositorio;

    @GetMapping
    public ResponseEntity<List<Jalea>> listarJaleas() {
        return ResponseEntity.ok(jaleaRepositorio.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Jalea> obtenerJalea(@PathVariable Long id) {
        return jaleaRepositorio.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Jalea> crearJalea(@Valid @RequestBody Jalea jalea) {
        Jalea nuevaJalea = jaleaRepositorio.save(jalea);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaJalea);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Jalea> actualizarJalea(@PathVariable Long id,
            @Valid @RequestBody Jalea jaleaActualizada) {
        return jaleaRepositorio.findById(id)
                .map(jalea -> {
                    jalea.setNombre(jaleaActualizada.getNombre());
                    jalea.setDisponible(jaleaActualizada.isDisponible());
                    return ResponseEntity.ok(jaleaRepositorio.save(jalea));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarJalea(@PathVariable Long id) {
        if (jaleaRepositorio.existsById(id)) {
            jaleaRepositorio.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
