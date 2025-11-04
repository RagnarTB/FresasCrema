package com.fresas.crema.repositorios;

import org.springframework.data.jpa.repository.JpaRepository;
import com.fresas.crema.modelos.Topping;
import java.util.List;

public interface ToppingRepositorio extends JpaRepository<Topping, Long> {
    List<Topping> findByDisponibleTrue();
}
