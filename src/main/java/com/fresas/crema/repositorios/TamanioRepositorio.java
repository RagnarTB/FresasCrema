package com.fresas.crema.repositorios;

import org.springframework.data.jpa.repository.JpaRepository;
import com.fresas.crema.modelos.Tamanio;
import java.util.List;

public interface TamanioRepositorio extends JpaRepository<Tamanio, Long> {
    List<Tamanio> findByProductoId(Long productoId);
}
