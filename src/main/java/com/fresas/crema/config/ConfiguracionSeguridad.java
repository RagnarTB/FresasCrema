package com.fresas.crema.config;

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
                        // Permite acceso público al catalogo, pagina principal y archivos estaticos
                        .requestMatchers("/", "/catalogo", "/login", "/css/**", "/js/**", "/img/**", "/admin-assets/**",
                                "/plugins/**", "/h2-console/**")
                        .permitAll()
                        // El resto de peticiones (ej. /admin/**) requieren autenticación
                        .anyRequest().authenticated())
                .formLogin(form -> form
                        // Página de login personalizada
                        .loginPage("/login")
                        .loginProcessingUrl("/login-check") // URL que procesa el login
                        .defaultSuccessUrl("/admin/dashboard", true) // Redirige al dashboard
                        .failureUrl("/login?error=true")
                        .permitAll() // Permite a todos ver la página de login
                )
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessUrl("/login?logout")
                        .invalidateHttpSession(true)
                        .deleteCookies("JSESSIONID")
                        .permitAll())
                // Deshabilitar CSRF para H2 console (solo para desarrollo)
                .csrf(csrf -> csrf.ignoringRequestMatchers("/h2-console/**"))
                .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()));
        return http.build();
    }

}
