package com.fresas.crema.repositorios;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fresas.crema.modelos.Producto;

public interface ProductoRepositorio extends JpaRepository<Producto, Long> {

}
