package com.fresas.crema.servicios;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.fresas.crema.repositorios.UsuarioRepositorio;

@Service
public class CustomUserDetailService implements UserDetailsService {

    @Autowired
    private UsuarioRepositorio usuarioRepositorio;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        com.fresas.crema.modelos.Usuario usuario = usuarioRepositorio.findByUsername(username);
        if (usuario == null) {
            throw new UsernameNotFoundException("usuario no encontrado");
        }

        return User.withUsername(usuario.getUsername())
                .password(usuario.getPassword())
                .roles(usuario.getRole().replace("ROLE_", ""))
                .build();

    }

}
