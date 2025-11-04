# 🔒 Guía de Seguridad para Producción - FresasCrema

## ⚠️ IMPORTANTE: Configuraciones Antes del Despliegue

### 1. Variables de Entorno Críticas

**CAMBIAR ESTAS CREDENCIALES EN PRODUCCIÓN:**

```bash
# Usuario administrador (NO usar las por defecto)
ADMIN_USERNAME=tu_usuario_seguro
ADMIN_PASSWORD=tu_password_muy_seguro_con_al_menos_16_caracteres

# Base de datos PostgreSQL
SPRING_DATASOURCE_URL=jdbc:postgresql://tu-servidor:5432/tu_base_datos
SPRING_DATASOURCE_USERNAME=tu_usuario_db
SPRING_DATASOURCE_PASSWORD=tu_password_db_muy_seguro
SPRING_DATASOURCE_DRIVER_CLASS_NAME=org.postgresql.Driver

# JPA/Hibernate
SPRING_JPA_DATABASE_PLATFORM=org.hibernate.dialect.PostgreSQLDialect
SPRING_JPA_HIBERNATE_DDL_AUTO=validate  # USAR 'validate' en producción, NO 'update'
SPRING_JPA_SHOW_SQL=false  # Desactivar en producción

# Directorio de uploads
UPLOAD_DIR=/var/app/uploads/productos
```

### 2. Configuración de Seguridad

#### ✅ Medidas Implementadas:

- **CSRF Protection**: Habilitado para rutas de admin
- **XSS Protection**: Headers configurados
- **Content Security Policy (CSP)**: Políticas estrictas
- **HSTS**: HTTP Strict Transport Security habilitado
- **Session Fixation Protection**: Prevención de ataques de sesión
- **Máximo 1 sesión por usuario**: Previene sesiones múltiples
- **Validación de subida de archivos**: Solo imágenes, máximo 5MB

#### 🔧 Configuraciones Adicionales Recomendadas:

1. **Usar HTTPS en Producción** (OBLIGATORIO):
   - Obtener un certificado SSL/TLS (Let's Encrypt es gratuito)
   - Configurar el servidor web (Nginx/Apache) como proxy inverso
   - Forzar HTTPS en todas las conexiones

2. **Firewall y Rate Limiting**:
   ```bash
   # Ejemplo con fail2ban para prevenir fuerza bruta
   apt-get install fail2ban
   ```

3. **Backup de Base de Datos**:
   - Configurar backups automáticos diarios
   - Almacenar backups en ubicación segura
   - Probar restauración regularmente

4. **Logging y Monitoreo**:
   ```properties
   # En application.properties para producción
   logging.level.root=WARN
   logging.level.com.fresas.crema=INFO
   logging.level.org.springframework.security=WARN
   ```

### 3. Despliegue con Docker

#### Archivo docker-compose.yml para Producción:

```yaml
version: '3.8'

services:
  db:
    image: postgres:15-alpine
    container_name: fresascrema-db-prod
    restart: always
    environment:
      POSTGRES_DB: ${POSTGRES_DB:-fresascrema_prod}
      POSTGRES_USER: ${POSTGRES_USER:-secure_user}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-change_this_password}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - fresascrema-network
    # NO exponer puerto 5432 al exterior

  app:
    build: .
    container_name: fresascrema-app-prod
    restart: always
    depends_on:
      - db
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://db:5432/${POSTGRES_DB:-fresascrema_prod}
      SPRING_DATASOURCE_USERNAME: ${POSTGRES_USER:-secure_user}
      SPRING_DATASOURCE_PASSWORD: ${POSTGRES_PASSWORD:-change_this_password}
      SPRING_DATASOURCE_DRIVER_CLASS_NAME: org.postgresql.Driver
      SPRING_JPA_DATABASE_PLATFORM: org.hibernate.dialect.PostgreSQLDialect
      SPRING_JPA_HIBERNATE_DDL_AUTO: validate
      SPRING_JPA_SHOW_SQL: "false"
      ADMIN_USERNAME: ${ADMIN_USERNAME:-admin}
      ADMIN_PASSWORD: ${ADMIN_PASSWORD:-change_this_password}
      UPLOAD_DIR: /app/uploads
    volumes:
      - uploads_data:/app/uploads
    # Solo exponer internamente o a través de proxy inverso
    expose:
      - "8080"
    networks:
      - fresascrema-network

  # Nginx como proxy inverso (OPCIONAL pero RECOMENDADO)
  nginx:
    image: nginx:alpine
    container_name: fresascrema-nginx
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - app
    networks:
      - fresascrema-network

volumes:
  postgres_data:
  uploads_data:

networks:
  fresascrema-network:
    driver: bridge
```

### 4. Configuración de Nginx (Recomendado)

```nginx
server {
    listen 80;
    server_name tudominio.com;

    # Redirigir HTTP a HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name tudominio.com;

    # Certificados SSL
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;

    # Seguridad SSL
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Headers de seguridad
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Proxy pass a la aplicación Spring Boot
    location / {
        proxy_pass http://app:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Rate limiting para proteger contra DDoS
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;

    location /api/login {
        limit_req zone=api_limit burst=5 nodelay;
        proxy_pass http://app:8080;
    }
}
```

### 5. Checklist Pre-Despliegue

- [ ] Cambiar usuario y contraseña del admin
- [ ] Cambiar credenciales de la base de datos
- [ ] Configurar HTTPS con certificado válido
- [ ] Establecer `spring.jpa.hibernate.ddl-auto=validate`
- [ ] Desactivar logs de SQL (`spring.jpa.show-sql=false`)
- [ ] Desactivar consola H2 en producción
- [ ] Configurar backups automáticos
- [ ] Configurar firewall del servidor
- [ ] Implementar rate limiting
- [ ] Configurar monitoreo y alertas
- [ ] Probar la recuperación de backups
- [ ] Revisar y actualizar dependencias

### 6. Mantenimiento Continuo

1. **Actualizar dependencias regularmente**:
   ```bash
   mvn versions:display-dependency-updates
   ```

2. **Monitorear logs de seguridad**:
   ```bash
   docker logs fresascrema-app-prod --tail 100
   ```

3. **Revisar intentos de acceso fallidos**:
   - Monitorear endpoint `/api/login` en los logs
   - Implementar bloqueo de IP tras múltiples intentos fallidos

4. **Mantener actualizado el sistema operativo y Docker**:
   ```bash
   apt-get update && apt-get upgrade
   docker system prune -a
   ```

### 7. Contacto de Seguridad

Si encuentras alguna vulnerabilidad, por favor repórtala de manera responsable.

---

## 📚 Referencias

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Spring Security Documentation](https://spring.io/projects/spring-security)
- [Docker Security Best Practices](https://docs.docker.com/develop/security-best-practices/)

---

**Última actualización**: Noviembre 2025
**Versión**: 1.0
