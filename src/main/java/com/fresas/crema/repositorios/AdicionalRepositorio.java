package com.fresas.crema.repositorios;

import org.springframework.data.jpa.repository.JpaRepository;
import com.fresas.crema.modelos.Adicional;
import java.util.List;

public interface AdicionalRepositorio extends JpaRepository<Adicional, Long> {
    List<Adicional> findByDisponibleTrue();
}
