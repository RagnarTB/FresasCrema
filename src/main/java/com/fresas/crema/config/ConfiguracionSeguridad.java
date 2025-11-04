package com.fresas.crema.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;

import java.util.HashMap;
import java.util.Map;

@Configuration
@EnableWebSecurity
public class ConfiguracionSeguridad {

    @Autowired
    private UserDetailsService userDetailsService;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .authenticationProvider(authenticationProvider())
                .authorizeHttpRequests(authz -> authz
                        // Rutas públicas
                        .requestMatchers(
                                "/",
                                "/index.html",
                                "/cliente.css",
                                "/cliente.js",
                                "/api/public/**",
                                "/admin/**/*.html",
                                "/admin/**/*.css",
                                "/admin/**/*.js",
                                "/h2-console/**")
                        .permitAll()
                        // Rutas protegidas del admin
                        .requestMatchers("/api/admin/**").authenticated()
                        // Cualquier otra petición requiere autenticación
                        .anyRequest().authenticated())
                .formLogin(form -> form
                        .loginProcessingUrl("/api/login") // URL que procesa el login
                        .successHandler(authenticationSuccessHandler())
                        .failureHandler(authenticationFailureHandler())
                        .permitAll())
                .logout(logout -> logout
                        .logoutUrl("/api/logout")
                        .logoutSuccessHandler(logoutSuccessHandler())
                        .invalidateHttpSession(true)
                        .deleteCookies("JSESSIONID")
                        .permitAll())
                // Deshabilitar CSRF para simplificar (en producción, considera habilitarlo con tokens)
                .csrf(csrf -> csrf.disable())
                // Permitir iframes para H2 console
                .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()));
        return http.build();
    }

    /**
     * Handler de éxito de autenticación - devuelve JSON
     */
    @Bean
    public AuthenticationSuccessHandler authenticationSuccessHandler() {
        return (request, response, authentication) -> {
            response.setStatus(200);
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");

            Map<String, Object> data = new HashMap<>();
            data.put("success", true);
            data.put("message", "Login exitoso");
            data.put("username", authentication.getName());

            ObjectMapper objectMapper = new ObjectMapper();
            response.getWriter().write(objectMapper.writeValueAsString(data));
        };
    }

    /**
     * Handler de fallo de autenticación - devuelve JSON
     */
    @Bean
    public AuthenticationFailureHandler authenticationFailureHandler() {
        return (request, response, exception) -> {
            response.setStatus(401);
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");

            Map<String, Object> data = new HashMap<>();
            data.put("success", false);
            data.put("error", "Credenciales inválidas");
            data.put("message", exception.getMessage());

            ObjectMapper objectMapper = new ObjectMapper();
            response.getWriter().write(objectMapper.writeValueAsString(data));
        };
    }

    /**
     * Handler de logout exitoso - devuelve JSON
     */
    @Bean
    public LogoutSuccessHandler logoutSuccessHandler() {
        return (request, response, authentication) -> {
            response.setStatus(200);
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");

            Map<String, Object> data = new HashMap<>();
            data.put("success", true);
            data.put("message", "Logout exitoso");

            ObjectMapper objectMapper = new ObjectMapper();
            response.getWriter().write(objectMapper.writeValueAsString(data));
        };
    }
}
