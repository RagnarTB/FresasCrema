package com.fresas.crema.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class ConfiguracionSerguridad {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(authz -> authz
                        // Permite acceso público al catalogo, pagina principal y archivos estaticos
                        .requestMatchers("/", "/catalogo", "/login", "/css/**", "/js/**", "/img/**", "/admin-assets/**",
                                "/plugins/**")
                        .permitAll()
                        // El resto de peticiones (ej. /admin/**) requieren autenticación
                        .anyRequest().authenticated())
                .formLogin(form -> form
                        // Página de login personalizada
                        .loginPage("/login")
                        .loginProcessingUrl("/login-check") // URL que procesa el login
                        .defaultSuccessUrl("/admin/dashboard", true) // Redirige al dashboard
                        .permitAll() // Permite a todos ver la página de login
                )
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessUrl("/login?logout")
                        .permitAll());
        return http.build();
    }

}
