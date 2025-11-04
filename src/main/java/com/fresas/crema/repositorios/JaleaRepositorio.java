package com.fresas.crema.repositorios;

import org.springframework.data.jpa.repository.JpaRepository;
import com.fresas.crema.modelos.Jalea;
import java.util.List;

public interface JaleaRepositorio extends JpaRepository<Jalea, Long> {
    List<Jalea> findByDisponibleTrue();
}
