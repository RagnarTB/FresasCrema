# Fresas con Crema - Sistema de Gestión y Catálogo

Sistema web completo para gestionar productos de fresas con crema, con panel de administración y catálogo público para clientes.

## Características

### Panel de Administración
- Autenticación segura con Spring Security
- Gestión completa de productos (CRUD)
- Configuración del número de WhatsApp para pedidos
- Interfaz moderna con AdminLTE

### Catálogo Público
- Vista de productos disponibles
- Sistema de carrito de compras en navegador
- Integración directa con WhatsApp para pedidos
- Diseño responsive con Bootstrap 5

## Tecnologías Utilizadas

- **Backend**: Spring Boot 3.4.1
- **Base de Datos**: H2 (memoria) / PostgreSQL (producción)
- **Seguridad**: Spring Security con autenticación basada en formularios
- **Template Engine**: Thymeleaf
- **Frontend Admin**: AdminLTE 3
- **Frontend Cliente**: Bootstrap 5
- **Java**: 21

## Requisitos Previos

- JDK 21 o superior
- Maven 3.6+

## Instalación y Ejecución

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd FresasCrema
```

### 2. Compilar el proyecto

```bash
mvn clean install
```

### 3. Ejecutar la aplicación

```bash
mvn spring-boot:run
```

La aplicación estará disponible en: `http://localhost:8080`

## Credenciales por Defecto

- **Usuario**: admin
- **Contraseña**: admin123

⚠️ **IMPORTANTE**: Cambia estas credenciales en producción modificando el archivo `DataInitializer.java`

## Estructura del Proyecto

```
src/main/java/com/fresas/crema/
├── config/
│   └── ConfiguracionSeguridad.java    # Configuración de seguridad
├── controladores/
│   ├── AdminControlador.java          # Controlador del panel admin
│   ├── ClienteControlador.java        # Controlador del frontend público
│   ├── ProductosControlador.java      # CRUD de productos
│   └── ConfiguracionesControlador.java # Configuración de WhatsApp
├── modelos/
│   ├── Producto.java                  # Entidad Producto
│   ├── Usuario.java                   # Entidad Usuario
│   └── Configuracion.java             # Entidad Configuración
├── repositorios/
│   ├── ProductoRepositorio.java
│   ├── UsuarioRepositorio.java
│   └── ConfiguracionRepositorio.java
├── servicios/
│   ├── ConfiguracionService.java      # Lógica de configuraciones
│   └── CustomUserDetailService.java   # Servicio de autenticación
├── DataInitializer.java               # Datos iniciales
└── CremaApplication.java              # Clase principal

src/main/resources/
├── templates/
│   ├── admin/                         # Vistas del panel admin
│   │   ├── layout.html
│   │   ├── fragments.html
│   │   ├── dashboard.html
│   │   ├── productos.html
│   │   └── configuraciones.html
│   ├── cliente/                       # Vistas públicas
│   │   ├── layout.html
│   │   ├── index.html
│   │   └── catalogo.html
│   └── login.html
├── static/                            # Recursos estáticos
└── application.properties             # Configuración de la app
```

## Uso

### Panel de Administración

1. Accede a `http://localhost:8080/login`
2. Ingresa con las credenciales por defecto
3. Gestiona productos desde `/admin/productos`
4. Configura el número de WhatsApp desde `/admin/configuraciones`

### Gestión de Productos

- **Crear**: Click en "Nuevo Producto", completa el formulario
- **Editar**: Click en el icono de edición (lápiz)
- **Eliminar**: Click en el icono de eliminar (papelera)

#### Campos del Producto:
- **Nombre**: 3-100 caracteres (obligatorio)
- **Descripción**: Hasta 500 caracteres (opcional)
- **Precio**: Número positivo (obligatorio)
- **URL de Imagen**: URL válida de una imagen (obligatorio)

💡 **Tip**: Usa servicios como Imgur o Postimages para alojar imágenes

### Configuración de WhatsApp

1. Ve a `/admin/configuraciones`
2. Ingresa el número con formato internacional: `+[código país][número]`
   - Ejemplo: `+51987654321`
3. Los clientes podrán enviar pedidos directamente a este número

### Catálogo Público

Los clientes pueden:
1. Ver el catálogo en `http://localhost:8080/catalogo`
2. Añadir productos al pedido
3. Ver el resumen del pedido
4. Enviar el pedido completo por WhatsApp con un click

## Configuración de Base de Datos

### Desarrollo (H2)
Por defecto, usa H2 en memoria. Los datos se pierden al reiniciar.

Acceso a consola H2: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:fresasdb`
- Usuario: `sa`
- Contraseña: (vacío)

### Producción (PostgreSQL)

Modifica `application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/fresasdb
spring.datasource.username=tu_usuario
spring.datasource.password=tu_contraseña
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
```

## Mejoras Implementadas

### Correcciones de Errores
- Corregido typo en `ConfiguracionSeguridad` (antes `ConfiguracionSerguridad`)
- Corregido HTML mal formado en dashboard.html
- Corregido typo en catalogo.html (`classs` → `class`)
- Actualizada versión de Spring Boot a 3.4.1
- Renombrado `adminControlador` a `AdminControlador` (convención)

### Mejoras de Seguridad
- Integrado `CustomUserDetailService` correctamente
- Configurado `DaoAuthenticationProvider`
- Mejorada configuración de logout
- Habilitado acceso a H2 Console para desarrollo

### Mejoras de Validación
- Validación de formato de número de WhatsApp
- Manejo de errores en CRUD de productos
- Mensajes de error amigables al usuario
- Validación de existencia antes de eliminar

### Mejoras de UX
- Mensajes flash de éxito y error
- Confirmación antes de eliminar productos
- Feedback visual al añadir productos al carrito
- Diseño responsive

## API Endpoints

### Públicos
- `GET /` - Página de inicio
- `GET /catalogo` - Catálogo de productos
- `GET /login` - Página de login

### Protegidos (requieren autenticación)
- `GET /admin/dashboard` - Panel de control
- `GET /admin/productos` - Lista de productos
- `GET /admin/productos/nuevo` - Formulario nuevo producto
- `GET /admin/productos/editar/{id}` - Formulario editar producto
- `POST /admin/productos/guardar` - Guardar producto
- `GET /admin/productos/eliminar/{id}` - Eliminar producto
- `GET /admin/configuraciones` - Configuraciones
- `POST /admin/configuraciones/guardar` - Guardar configuración

## Próximos Pasos

- [ ] Implementar subida de imágenes al servidor
- [ ] Agregar categorías de productos
- [ ] Sistema de estadísticas y reportes
- [ ] Gestión de múltiples usuarios administradores
- [ ] Implementar API REST para aplicaciones móviles
- [ ] Sistema de inventario y stock

## Soporte

Para reportar bugs o solicitar funcionalidades, crea un issue en el repositorio.

## Licencia

Este proyecto es de código abierto.

---

Desarrollado con ❤️ para negocios de fresas con crema
