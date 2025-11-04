package com.fresas.crema.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${app.upload.dir:${user.home}/uploads/productos}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Servir archivos estáticos desde el directorio de uploads
        Path uploadPath = Paths.get(uploadDir);
        String uploadPathStr = uploadPath.toFile().getAbsolutePath();

        registry.addResourceHandler("/uploads/productos/**")
                .addResourceLocations("file:" + uploadPathStr + "/");
    }
}
