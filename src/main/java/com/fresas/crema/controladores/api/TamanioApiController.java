package com.fresas.crema.controladores.api;

import com.fresas.crema.modelos.Tamanio;
import com.fresas.crema.repositorios.TamanioRepositorio;
import com.fresas.crema.repositorios.ProductoRepositorio;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/tamanios")
public class TamanioApiController {

    @Autowired
    private TamanioRepositorio tamanioRepositorio;

    @Autowired
    private ProductoRepositorio productoRepositorio;

    @GetMapping
    public ResponseEntity<List<Tamanio>> listarTamanios() {
        return ResponseEntity.ok(tamanioRepositorio.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tamanio> obtenerTamanio(@PathVariable Long id) {
        return tamanioRepositorio.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/producto/{productoId}")
    public ResponseEntity<List<Tamanio>> obtenerTamaniosPorProducto(@PathVariable Long productoId) {
        return ResponseEntity.ok(tamanioRepositorio.findByProductoId(productoId));
    }

    @PostMapping
    public ResponseEntity<Tamanio> crearTamanio(@Valid @RequestBody Tamanio tamanio) {
        // Verificar que el producto exista
        if (tamanio.getProducto() != null && tamanio.getProducto().getId() != null) {
            return productoRepositorio.findById(tamanio.getProducto().getId())
                    .map(producto -> {
                        tamanio.setProducto(producto);
                        Tamanio nuevoTamanio = tamanioRepositorio.save(tamanio);
                        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoTamanio);
                    })
                    .orElse(ResponseEntity.badRequest().build());
        }
        Tamanio nuevoTamanio = tamanioRepositorio.save(tamanio);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoTamanio);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tamanio> actualizarTamanio(@PathVariable Long id,
            @Valid @RequestBody Tamanio tamanioActualizado) {
        return tamanioRepositorio.findById(id)
                .map(tamanio -> {
                    tamanio.setNombre(tamanioActualizado.getNombre());
                    tamanio.setPrecioBase(tamanioActualizado.getPrecioBase());
                    tamanio.setToppingsIncluidos(tamanioActualizado.getToppingsIncluidos());
                    tamanio.setJaleasIncluidas(tamanioActualizado.getJaleasIncluidas());
                    return ResponseEntity.ok(tamanioRepositorio.save(tamanio));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarTamanio(@PathVariable Long id) {
        if (tamanioRepositorio.existsById(id)) {
            tamanioRepositorio.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
