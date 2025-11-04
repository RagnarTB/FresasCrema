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
import org.springframework.security.web.firewall.HttpFirewall;
import org.springframework.security.web.firewall.StrictHttpFirewall;

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

    /**
     * Configurar firewall para permitir jsessionid en URLs
     */
    @Bean
    public HttpFirewall allowUrlEncodedSlashHttpFirewall() {
        StrictHttpFirewall firewall = new StrictHttpFirewall();
        firewall.setAllowSemicolon(true); // Permite ; en URLs (para jsessionid)
        return firewall;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .authenticationProvider(authenticationProvider())
                .authorizeHttpRequests(authz -> authz
                        // Rutas públicas - Archivos estáticos del cliente
                        .requestMatchers("/", "/index.html", "/style.css", "/script.js").permitAll()
                        // API pública
                        .requestMatchers("/api/public/**").permitAll()
                        // Imágenes subidas (públicas para clientes)
                        .requestMatchers("/uploads/**").permitAll()
                        // Archivos estáticos del admin (HTML, CSS, JS) - sin autenticación
                        .requestMatchers("/admin/**").permitAll()
                        // Consola H2 solo para desarrollo
                        .requestMatchers("/h2-console/**").permitAll()
                        // Actuator health check (público para monitoreo)
                        .requestMatchers("/actuator/health/**").permitAll()
                        // Rutas protegidas de la API admin
                        .requestMatchers("/api/admin/**").authenticated()
                        // Cualquier otra petición requiere autenticación
                        .anyRequest().authenticated())
                .formLogin(form -> form
                        .loginPage("/admin/login.html") // Página de login personalizada
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
                // CSRF Protection (deshabilitado para API REST, pero habilitado para producción con SPA)
                .csrf(csrf -> csrf
                        // Desactivar CSRF solo para la API pública y login (sin estado)
                        .ignoringRequestMatchers("/api/public/**", "/api/login")
                )
                // Headers de seguridad mejorados
                .headers(headers -> headers
                        // Protección contra clickjacking
                        .frameOptions(frame -> frame.sameOrigin())
                        // XSS Protection
                        .xssProtection(xss -> xss.headerValue("1; mode=block"))
                        // Content Type Options
                        .contentTypeOptions(contentType -> {})
                        // Content Security Policy (CSP)
                        .contentSecurityPolicy(csp -> csp
                                .policyDirectives("default-src 'self'; " +
                                        "script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; " +
                                        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; " +
                                        "font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; " +
                                        "img-src 'self' data: https:; " +
                                        "connect-src 'self'"))
                        // HTTP Strict Transport Security (HSTS) - Forzar HTTPS en producción
                        .httpStrictTransportSecurity(hsts -> hsts
                                .includeSubDomains(true)
                                .maxAgeInSeconds(31536000)) // 1 año
                )
                // Protección contra Session Fixation
                .sessionManagement(session -> session
                        .sessionFixation().newSession()
                        .maximumSessions(1) // Máximo 1 sesión por usuario
                        .maxSessionsPreventsLogin(false) // Permitir login cerrando sesión anterior
                );

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
