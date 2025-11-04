# 🍓 FresasCrema - DeliBoon

Sistema completo de gestión y venta de fresas con crema personalizable, con panel de administración y tienda online.

![Java](https://img.shields.io/badge/Java-21-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.1-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)
![Docker](https://img.shields.io/badge/Docker-ready-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 📋 Descripción

**FresasCrema** es una aplicación web completa para la gestión y venta de fresas con crema, desarrollada con arquitectura REST API moderna. El sistema permite a los clientes personalizar sus productos con diferentes tamaños, toppings, jaleas y extras, mientras los administradores gestionan el catálogo completo desde un panel intuitivo.

### 🎯 Características Principales

**Para Clientes:**
- 🛍️ Catálogo dinámico de productos
- 🎨 Personalización completa (tamaños, toppings, jaleas, extras)
- 🧮 Cálculo inteligente de precios con elementos incluidos
- 📱 Integración directa con WhatsApp para pedidos
- 💅 Diseño colorido y amigable ("DeliBoon")
- 📱 Totalmente responsive

**Para Administradores:**
- 👥 Panel de administración completo
- 📦 CRUD de productos con tipos de crema (Normal/Café)
- 📏 Gestión de tamaños con precios y elementos incluidos
- 🍪 Administración de toppings disponibles
- 🍯 Control de jaleas del menú
- ➕ Configuración de adicionales y precios
- ⚙️ Configuración del número de WhatsApp
- 🔒 Sistema de autenticación seguro

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (Static JS)                    │
├──────────────────────┬──────────────────────────────────────┤
│  Cliente DeliBoon    │        Panel Admin                    │
│  - index.html        │        - admin/index.html             │
│  - style.css         │        - admin/admin.css              │
│  - script.js         │        - admin/admin.js               │
└──────────────────────┴──────────────────────────────────────┘
                              ▼
                    ┌─────────────────────┐
                    │   REST API          │
                    │   Spring Boot       │
                    │   - Controllers     │
                    │   - Services        │
                    │   - Security        │
                    └─────────────────────┘
                              ▼
                    ┌─────────────────────┐
                    │   JPA/Hibernate     │
                    └─────────────────────┘
                              ▼
                    ┌─────────────────────┐
                    │   PostgreSQL        │
                    │   (H2 en dev)       │
                    └─────────────────────┘
```

### 🗂️ Estructura del Proyecto

```
FresasCrema/
├── src/
│   └── main/
│       ├── java/com/fresas/crema/
│       │   ├── modelos/              # Entidades JPA
│       │   │   ├── Producto.java
│       │   │   ├── Tamanio.java
│       │   │   ├── Topping.java
│       │   │   ├── Jalea.java
│       │   │   ├── Adicional.java
│       │   │   └── Configuracion.java
│       │   ├── repositorios/         # Repositories JPA
│       │   ├── controladores/
│       │   │   └── api/              # REST Controllers
│       │   │       ├── ProductoApiController.java
│       │   │       ├── TamanioApiController.java
│       │   │       ├── CatalogoApiController.java
│       │   │       └── ...
│       │   ├── dto/                  # Data Transfer Objects
│       │   ├── config/               # Configuración
│       │   │   └── ConfiguracionSeguridad.java
│       │   └── DataInitializer.java  # Datos iniciales
│       └── resources/
│           ├── static/               # Frontend estático
│           │   ├── index.html        # Cliente DeliBoon
│           │   ├── style.css
│           │   ├── script.js
│           │   └── admin/            # Panel Admin
│           │       ├── index.html
│           │       ├── admin.css
│           │       ├── admin.js
│           │       └── login.html
│           └── application.properties
├── Dockerfile
├── docker-compose.yml
└── README.md
```

## 🚀 Inicio Rápido

### Opción 1: Docker (Recomendado)

**Requisitos:**
- Docker 20.10+
- Docker Compose 2.0+

**Pasos:**

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd FresasCrema
   ```

2. **Levantar los servicios**
   ```bash
   docker-compose up --build
   ```

3. **Acceder a la aplicación**
   - **Cliente**: http://localhost:8080/
   - **Admin**: http://localhost:8080/admin/
   - **Login Admin**: `admin` / `admin123`

4. **Detener los servicios**
   ```bash
   docker-compose down
   ```

### Opción 2: Desarrollo Local

**Requisitos:**
- Java 21+
- Maven 3.8+

**Pasos:**

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd FresasCrema
   ```

2. **Ejecutar la aplicación**
   ```bash
   ./mvnw spring-boot:run
   ```

   En Windows:
   ```bash
   mvnw.cmd spring-boot:run
   ```

3. **Acceder a la aplicación**
   - **Cliente**: http://localhost:8080/
   - **Admin**: http://localhost:8080/admin/
   - **H2 Console**: http://localhost:8080/h2-console
     - JDBC URL: `jdbc:h2:mem:fresasdb`
     - Usuario: `sa`
     - Password: (vacío)

## 📚 API REST Endpoints

### 🔓 Endpoints Públicos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/public/catalogo` | Obtiene catálogo completo (productos, toppings, jaleas, adicionales, WhatsApp) |

### 🔒 Endpoints Admin (Requieren Autenticación)

**Productos:**
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/admin/productos` | Lista todos los productos |
| `GET` | `/api/admin/productos/{id}` | Obtiene un producto |
| `POST` | `/api/admin/productos` | Crea un producto |
| `PUT` | `/api/admin/productos/{id}` | Actualiza un producto |
| `DELETE` | `/api/admin/productos/{id}` | Elimina un producto |

**Tamaños:**
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/admin/tamanios` | Lista todos los tamaños |
| `GET` | `/api/admin/tamanios/{id}` | Obtiene un tamaño |
| `GET` | `/api/admin/tamanios/producto/{id}` | Obtiene tamaños de un producto |
| `POST` | `/api/admin/tamanios` | Crea un tamaño |
| `PUT` | `/api/admin/tamanios/{id}` | Actualiza un tamaño |
| `DELETE` | `/api/admin/tamanios/{id}` | Elimina un tamaño |

**Toppings, Jaleas, Adicionales:**
- Misma estructura CRUD que productos
- Endpoints: `/api/admin/toppings`, `/api/admin/jaleas`, `/api/admin/adicionales`

**Configuración:**
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/admin/configuraciones/whatsapp` | Obtiene número de WhatsApp |
| `PUT` | `/api/admin/configuraciones/whatsapp` | Actualiza número de WhatsApp |

## 🗄️ Modelo de Datos

### Entidades Principales

**Producto**
```java
{
  "id": 1,
  "nombre": "DeliClásica",
  "descripcion": "Deliciosas fresas con crema natural",
  "tipoCrema": "NORMAL",  // NORMAL o CAFE
  "imagenUrl": "https://...",
  "disponible": true,
  "tamanios": [...]  // Relación OneToMany
}
```

**Tamaño**
```java
{
  "id": 1,
  "nombre": "Personal",
  "precioBase": 10.0,
  "toppingsIncluidos": 1,
  "jaleasIncluidas": 1,
  "producto": {...}  // Relación ManyToOne
}
```

**Topping / Jalea**
```java
{
  "id": 1,
  "nombre": "Oreo",
  "disponible": true
}
```

**Adicional**
```java
{
  "id": 1,
  "nombre": "Extra Topping",
  "precio": 2.0,
  "disponible": true
}
```

## 🔒 Seguridad

- **Autenticación**: Spring Security con formulario de login
- **Endpoints Protegidos**: Todo bajo `/api/admin/**` requiere autenticación
- **Endpoints Públicos**: `/`, `/api/public/**`, `/admin/**/*.{html,css,js}`
- **CSRF**: Deshabilitado para simplificar API REST
- **Credenciales por defecto**:
  - Usuario: `admin`
  - Contraseña: `admin123`

⚠️ **IMPORTANTE**: Cambiar credenciales en producción usando variables de entorno:
```bash
ADMIN_USERNAME=tu_usuario
ADMIN_PASSWORD=tu_contraseña_segura
```

## 🐳 Docker

### Variables de Entorno

El `docker-compose.yml` define las siguientes variables:

**Base de Datos:**
- `POSTGRES_USER`: Usuario de PostgreSQL (default: `fresascrema`)
- `POSTGRES_PASSWORD`: Contraseña de PostgreSQL (default: `fresascrema2025`)
- `POSTGRES_DB`: Nombre de la base de datos (default: `fresascrema_db`)

**Aplicación:**
- `SPRING_DATASOURCE_URL`: URL JDBC de conexión
- `SPRING_DATASOURCE_USERNAME`: Usuario de DB
- `SPRING_DATASOURCE_PASSWORD`: Contraseña de DB
- `SPRING_JPA_HIBERNATE_DDL_AUTO`: Estrategia DDL (default: `update`)
- `ADMIN_USERNAME`: Usuario admin (opcional)
- `ADMIN_PASSWORD`: Contraseña admin (opcional)

### Comandos Útiles

**Ver logs:**
```bash
docker-compose logs -f app
```

**Reiniciar solo la app:**
```bash
docker-compose restart app
```

**Reconstruir después de cambios:**
```bash
docker-compose up --build -d
```

**Eliminar volúmenes (⚠️ borra datos):**
```bash
docker-compose down -v
```

**Conectar a PostgreSQL:**
```bash
docker-compose exec db psql -U fresascrema -d fresascrema_db
```

## 🧪 Testing

**Ejecutar tests:**
```bash
./mvnw test
```

**Ejecutar tests con cobertura:**
```bash
./mvnw test jacoco:report
```

## 🛠️ Desarrollo

### Agregar Nuevas Entidades

1. Crear la entidad en `src/main/java/com/fresas/crema/modelos/`
2. Crear el repositorio en `repositorios/`
3. Crear el controlador REST en `controladores/api/`
4. (Opcional) Agregar datos iniciales en `DataInitializer.java`
5. Actualizar el frontend según sea necesario

### Hot Reload en Desarrollo

Para desarrollo local con recarga automática:
```xml
<!-- Agregar en pom.xml -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <optional>true</optional>
</dependency>
```

## 📝 Datos Iniciales

El sistema viene con datos de ejemplo pre-cargados:

**Productos:**
- DeliClásica (Crema Normal)
- ChocoBoon (Crema de Café)

**Tamaños por producto:**
- Personal, Mediano, Grande, Familiar

**Toppings:**
- Oreo, Chin Chin, Gomitas, Lentejas, Maní

**Jaleas:**
- Fudge de Chocolate, Manjar Blanco, Leche Condensada

**Adicionales:**
- Extra Topping (S/ 2.00)
- Extra Jalea (S/ 1.50)
- Nutella (S/ 3.00)

**Configuración:**
- Número de WhatsApp: +51999888777

## 🌐 Despliegue en Producción

### Consideraciones

1. **Cambiar credenciales**: Usar variables de entorno seguras
2. **HTTPS**: Configurar certificado SSL/TLS
3. **Base de datos**: Usar PostgreSQL con backups automáticos
4. **Logs**: Configurar agregación de logs (ELK, CloudWatch, etc.)
5. **Monitoreo**: Usar Actuator endpoints para health checks
6. **Escalabilidad**: Considerar múltiples instancias con load balancer

### Plataformas Recomendadas

- **Railway**: Deploy automático desde GitHub
- **Heroku**: Con Heroku Postgres
- **AWS**: EC2 + RDS PostgreSQL
- **DigitalOcean**: App Platform o Droplet
- **VPS**: Cualquier servidor con Docker

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: Amazing Feature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver archivo `LICENSE` para más detalles.

## 👤 Autor

Desarrollado con ❤️ para DeliBoon

---

## 🆘 Soporte

Para usuarios sin experiencia técnica, consultar [GUIA_USUARIO.md](GUIA_USUARIO.md)

**¿Problemas?**
- Revisa los logs: `docker-compose logs -f`
- Verifica que los puertos 8080 y 5432 no estén en uso
- Asegúrate de tener las últimas versiones de Docker

**Contacto:**
- Issues: GitHub Issues
- Documentación: Este README
