package com.fresas.crema.repositorios;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fresas.crema.modelos.Usuario;

public interface UsuarioRepositorio extends JpaRepository<Usuario, Long> {
    Usuario findByUsername(String username);
}
