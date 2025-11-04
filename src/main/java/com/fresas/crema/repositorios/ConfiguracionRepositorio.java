package com.fresas.crema.repositorios;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fresas.crema.modelos.Configuracion;

public interface ConfiguracionRepositorio extends JpaRepository<Configuracion, String> {

}
