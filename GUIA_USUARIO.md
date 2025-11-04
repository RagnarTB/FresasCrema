# 🍓 Guía del Usuario - FresasCrema DeliBoon

**Guía paso a paso para personas sin experiencia técnica**

Esta guía te ayudará a instalar y usar la aplicación FresasCrema de forma sencilla, sin necesidad de conocimientos técnicos previos.

---

## 📑 Índice

1. [¿Qué es FresasCrema?](#qué-es-fresascrema)
2. [¿Qué necesito instalar?](#qué-necesito-instalar)
3. [Instalación Paso a Paso](#instalación-paso-a-paso)
4. [Cómo Usar la Aplicación](#cómo-usar-la-aplicación)
5. [Preguntas Frecuentes](#preguntas-frecuentes)
6. [Solución de Problemas](#solución-de-problemas)

---

## 🤔 ¿Qué es FresasCrema?

FresasCrema es un sistema completo para tu negocio de fresas con crema que incluye:

- **🛍️ Una tienda online** donde tus clientes pueden ver tu menú, personalizar sus pedidos y enviarlos directamente a WhatsApp
- **👨‍💼 Un panel de administración** donde tú puedes gestionar tus productos, precios, toppings, jaleas y más

**¿Cómo funciona?**

1. Tú configuras tus productos, precios y opciones desde el panel de admin
2. Tus clientes visitan tu página web
3. Eligen lo que quieren y personalizan su pedido
4. El pedido se envía automáticamente a tu WhatsApp
5. ¡Listo! Tú preparas el pedido y lo entregas

---

## 💻 ¿Qué necesito instalar?

Para usar FresasCrema necesitas instalar **Docker Desktop**. Es un programa gratuito que hace que la aplicación funcione de forma automática en tu computadora.

### Para Windows:

1. **Descargar Docker Desktop**
   - Ve a: https://www.docker.com/products/docker-desktop/
   - Haz clic en "Download for Windows"
   - Descarga el archivo (es grande, puede tardar)

2. **Instalar Docker Desktop**
   - Haz doble clic en el archivo descargado
   - Sigue las instrucciones (solo dar clic en "Siguiente" → "Siguiente" → "Instalar")
   - Cuando termine, reinicia tu computadora

3. **Abrir Docker Desktop**
   - Busca "Docker Desktop" en el menú inicio de Windows
   - Ábrelo (puede tardar un poco la primera vez)
   - Deja que se actualice si te lo pide
   - Cuando veas una ballena azul en la parte inferior derecha, ¡está listo!

### Para Mac:

1. **Descargar Docker Desktop**
   - Ve a: https://www.docker.com/products/docker-desktop/
   - Descarga según tu Mac:
     - Si es nuevo (2021+): "Download for Mac - Apple Chip"
     - Si es antiguo: "Download for Mac - Intel Chip"

2. **Instalar Docker Desktop**
   - Abre el archivo `.dmg` descargado
   - Arrastra el ícono de Docker a la carpeta Aplicaciones
   - Abre Docker desde Aplicaciones
   - Dale permiso cuando te lo pida
   - Cuando veas una ballena azul arriba, ¡está listo!

---

## 🚀 Instalación Paso a Paso

### Paso 1: Descargar la Aplicación

Tienes dos opciones:

**Opción A - Descargar ZIP (Más fácil):**
1. Ve a la página del proyecto en GitHub
2. Busca el botón verde que dice "Code"
3. Haz clic en "Download ZIP"
4. Guarda el archivo en tu computadora (por ejemplo, en Documentos)
5. Descomprime el archivo (clic derecho → "Extraer todo")

**Opción B - Usar Git (Si ya lo tienes instalado):**
```bash
git clone https://github.com/tu-usuario/FresasCrema.git
```

### Paso 2: Abrir la Carpeta del Proyecto

**En Windows:**
1. Abre el "Explorador de archivos"
2. Ve a donde descargaste/descomprimiste la carpeta "FresasCrema"
3. Haz clic en la barra de direcciones (donde dice la ruta)
4. Escribe `cmd` y presiona Enter
   - Se abrirá una ventana negra (se llama "Command Prompt")

**En Mac:**
1. Abre "Terminal" (búscalo en Spotlight presionando Cmd + Espacio)
2. Escribe: `cd ` (cd y un espacio)
3. Arrastra la carpeta FresasCrema a la ventana de Terminal
4. Presiona Enter

### Paso 3: Iniciar la Aplicación

En la ventana negra (Windows) o Terminal (Mac) que abriste, escribe esto **exactamente**:

```bash
docker-compose up --build
```

Luego presiona Enter.

**¿Qué va a pasar?**
- Verás muchas letras y números apareciendo
- Va a descargar cosas de internet (puede tardar 5-10 minutos la primera vez)
- NO CIERRES LA VENTANA, déjala abierta
- Cuando veas algo como "Started CremaApplication" significa que ¡está listo!

### Paso 4: Abrir la Aplicación

Abre tu navegador favorito (Chrome, Firefox, Safari, Edge) y escribe en la barra de direcciones:

**Para la tienda del cliente:**
```
http://localhost:8080/
```

**Para el panel de administración:**
```
http://localhost:8080/admin/
```

---

## 🎯 Cómo Usar la Aplicación

### 🛍️ La Tienda (Para tus Clientes)

Tus clientes entrarán a `http://localhost:8080/` y verán:

1. **Tu Menú de Productos**
   - Fotos de tus productos
   - Descripciones
   - Botón para personalizar

2. **Cómo Hacen un Pedido:**
   - Hacen clic en un producto
   - Eligen el tamaño
   - Seleccionan toppings
   - Seleccionan jaleas
   - Agregan extras si quieren
   - Hacen clic en "Añadir al Carrito"
   - Pueden seguir agregando más productos
   - Cuando terminan, clic en el carrito 🛒
   - Clic en "Confirmar Pedido"
   - ¡Se abre WhatsApp con el pedido ya escrito!

### 👨‍💼 Panel de Administración

Entra a `http://localhost:8080/admin/` y usa:
- **Usuario:** `admin`
- **Contraseña:** `admin123`

⚠️ **IMPORTANTE:** Cambia esta contraseña después (ver sección de Configuración)

#### Dashboard (Inicio)

Verás 6 tarjetas que te llevan a diferentes secciones:
- 📦 Productos
- 📏 Tamaños
- 🍪 Toppings
- 🍯 Jaleas
- ➕ Adicionales
- ⚙️ Configuración

#### 📦 Gestionar Productos

**Ver todos los productos:**
- Haz clic en "Productos" en el menú lateral
- Verás una tabla con todos tus productos

**Crear un producto nuevo:**
1. Clic en "Nuevo Producto" (botón rosa arriba)
2. Llena el formulario:
   - **Nombre:** Ejemplo: "DeliClásica"
   - **Descripción:** Describe tu producto
   - **Tipo de Crema:** Elige "NORMAL" o "CAFE"
   - **URL de Imagen:** Pega el link de una imagen de internet
   - **Disponible:** Deja marcado si quieres que se vea
3. Clic en "Guardar"

💡 **Tip para Imágenes:**
- Ve a Google Imágenes
- Busca una imagen similar a tu producto
- Clic derecho → "Copiar dirección de imagen"
- Pega ese link en "URL de Imagen"

**Editar un producto:**
1. Busca el producto en la lista
2. Clic en el icono de lápiz ✏️
3. Cambia lo que necesites
4. Clic en "Guardar"

**Eliminar un producto:**
1. Busca el producto
2. Clic en el icono de basura 🗑️
3. Confirma que sí quieres eliminarlo

**Gestionar Tamaños de un Producto:**
1. Busca el producto en la lista
2. Clic en el icono de regla 📏
3. Se abre una ventana con los tamaños de ese producto
4. Puedes agregar, editar o eliminar tamaños

**Crear un Tamaño:**
1. En la ventana de tamaños, clic en "Agregar Tamaño"
2. Llena:
   - **Nombre:** "Personal", "Mediano", "Grande", etc.
   - **Precio Base:** Ejemplo: 10.00 (solo números)
   - **Toppings Incluidos:** Ejemplo: 1 (cuántos toppings incluye)
   - **Jaleas Incluidas:** Ejemplo: 1 (cuántas jaleas incluye)
3. Clic en "Guardar"

#### 🍪 Gestionar Toppings

1. Clic en "Toppings" en el menú
2. Verás todos los toppings disponibles
3. Para agregar uno nuevo:
   - Clic en "Nuevo Topping"
   - Escribe el nombre: "Oreo", "Gomitas", etc.
   - Marca "Disponible" si lo tienes
   - Clic en "Guardar"

#### 🍯 Gestionar Jaleas

Igual que los toppings:
1. Clic en "Jaleas"
2. "Nueva Jalea"
3. Nombre: "Fudge", "Manjar Blanco", etc.
4. "Guardar"

#### ➕ Gestionar Adicionales

Los adicionales son extras que cuestan más:

1. Clic en "Adicionales"
2. "Nuevo Adicional"
3. Llena:
   - **Nombre:** "Nutella", "Extra Topping", etc.
   - **Precio:** 2.50 (lo que cobras por ese extra)
   - **Disponible:** Marca si lo tienes
4. "Guardar"

#### ⚙️ Configuración del WhatsApp

**MUY IMPORTANTE** - Aquí configuras el número donde llegarán los pedidos:

1. Clic en "Configuración"
2. Verás un campo "Número de WhatsApp"
3. Escribe tu número así: `51987654321`
   - **SIN** el signo +
   - **SIN** espacios
   - **CON** el código de país (51 para Perú)
   - Ejemplo para Perú: `51987654321`
   - Ejemplo para México: `52123456789`
   - Ejemplo para España: `34612345678`
4. Clic en "Guardar Cambios"
5. Prueba el enlace que aparece para asegurarte que funciona

---

## ❓ Preguntas Frecuentes

### ¿Cómo apago la aplicación?

1. Ve a la ventana negra/Terminal donde la iniciaste
2. Presiona `Ctrl + C` (Windows) o `Cmd + C` (Mac)
3. Espera unos segundos
4. Ya puedes cerrar la ventana

### ¿Cómo la vuelvo a prender?

1. Abre Command Prompt/Terminal en la carpeta del proyecto (como en el Paso 2)
2. Escribe: `docker-compose up`
3. Presiona Enter
4. Espera a que diga "Started"
5. Abre el navegador en `http://localhost:8080/`

### ¿Se pierden mis productos cuando apago la aplicación?

**NO**, tus productos están guardados en una base de datos que persiste. Todo lo que configuraste se mantiene.

### ¿Cómo cambio la contraseña del admin?

Necesitas editar un archivo de configuración:

1. Abre la carpeta del proyecto
2. Ve a `docker-compose.yml`
3. Ábrelo con el Bloc de notas (Windows) o TextEdit (Mac)
4. Busca estas líneas:
   ```yaml
   ADMIN_USERNAME: admin
   ADMIN_PASSWORD: admin123
   ```
5. Cámbialas por tu usuario y contraseña deseados:
   ```yaml
   ADMIN_USERNAME: mi_usuario
   ADMIN_PASSWORD: mi_contraseña_super_secreta
   ```
6. Guarda el archivo
7. Apaga y vuelve a prender la aplicación

### ¿Puedo acceder desde mi celular?

**Sí**, si tu celular y tu computadora están en la misma red WiFi:

1. En tu computadora, abre Command Prompt/Terminal
2. Escribe: `ipconfig` (Windows) o `ifconfig` (Mac)
3. Busca tu "Dirección IPv4", algo como: `192.168.1.100`
4. En tu celular, abre el navegador
5. Escribe: `http://192.168.1.100:8080/` (usa TU dirección IP)

### ¿Cómo puedo poner esto en internet para que cualquiera lo vea?

Eso requiere "hosting" o un servidor. Tienes varias opciones:

**Opción Fácil - Railway (Recomendado):**
1. Crea una cuenta en https://railway.app/
2. Conecta tu proyecto
3. Railway lo pone en internet automáticamente
4. Te da un link como: `https://tu-app.railway.app`

**Otras opciones:** Heroku, DigitalOcean, AWS. Pero requieren más configuración.

### ¿Cuánto cuesta mantener esto funcionando?

- **En tu computadora:** GRATIS, pero necesitas tenerla prendida
- **En Railway:** $5-10 USD/mes (paga solo lo que uses)
- **En Heroku:** $7 USD/mes (plan básico)
- **En un VPS:** $5-20 USD/mes dependiendo del proveedor

---

## 🔧 Solución de Problemas

### "docker: command not found" o "No se reconoce docker"

**Problema:** Docker no está instalado o no se reinició la computadora.

**Solución:**
1. Asegúrate de haber instalado Docker Desktop
2. Reinicia tu computadora
3. Abre Docker Desktop antes de usar los comandos

### "port 8080 is already in use"

**Problema:** Ya hay algo usando el puerto 8080.

**Solución Opción 1 - Cerrar lo que está usando el puerto:**

Windows:
```bash
netstat -ano | findstr :8080
taskkill /PID [número_que_sale] /F
```

Mac:
```bash
lsof -i :8080
kill -9 [número_que_sale]
```

**Solución Opción 2 - Usar otro puerto:**
1. Abre `docker-compose.yml`
2. Busca: `- "8080:8080"`
3. Cámbialo a: `- "8081:8080"`
4. Guarda
5. Ahora usa `http://localhost:8081/`

### "Cannot connect to the Docker daemon"

**Problema:** Docker Desktop no está corriendo.

**Solución:**
1. Abre Docker Desktop
2. Espera a que el ícono de la ballena aparezca
3. Intenta de nuevo

### La página dice "This site can't be reached"

**Problema:** La aplicación no está corriendo o escribiste mal la URL.

**Solución:**
1. Verifica que la ventana negra/Terminal siga abierta
2. Revisa que diga "Started CremaApplication"
3. Verifica que escribiste: `http://localhost:8080/`
4. Prueba con: `http://127.0.0.1:8080/`

### "Username or password is incorrect"

**Problema:** Contraseña incorrecta.

**Solución:**
- Usuario por defecto: `admin`
- Contraseña por defecto: `admin123`
- Si las cambiaste, usa las nuevas credenciales
- Si olvidaste la contraseña, edita `docker-compose.yml` (ver arriba)

### Las imágenes de los productos no se ven

**Problema:** El link de la imagen está mal o ya no existe.

**Solución:**
1. Ve al admin
2. Edita el producto
3. Busca una nueva imagen en Google Imágenes
4. Copia el link de la imagen
5. Pégalo en "URL de Imagen"
6. Guarda

### El pedido no llega a WhatsApp

**Problema:** El número está mal configurado o WhatsApp Web está cerrado.

**Solución:**
1. Verifica el número en Configuración
2. Asegúrate de que no tenga espacios ni el símbolo +
3. Debe tener el código de país: `51987654321`
4. Prueba el enlace de WhatsApp que aparece en Configuración

---

## 📞 ¿Necesitas Más Ayuda?

Si tienes problemas que no están aquí:

1. **Lee el README.md** - Tiene información más técnica
2. **Busca en YouTube** - "Docker tutorial" o "Spring Boot tutorial"
3. **Pregunta a un amigo** que sepa de programación
4. **Contrata a un desarrollador** si necesitas cambios importantes

---

## 🎓 ¿Quieres Aprender Más?

Si esto te gustó y quieres aprender a programar:

- **Docker:** https://docs.docker.com/get-started/
- **Spring Boot:** https://spring.io/guides/gs/spring-boot/
- **HTML/CSS:** https://www.freecodecamp.org/
- **JavaScript:** https://javascript.info/

---

## ✅ Checklist de Inicio Rápido

Para referencia rápida, aquí está todo lo que necesitas:

- [ ] Instalar Docker Desktop
- [ ] Reiniciar computadora
- [ ] Abrir Docker Desktop
- [ ] Descargar FresasCrema
- [ ] Abrir Command Prompt/Terminal en la carpeta
- [ ] Ejecutar: `docker-compose up --build`
- [ ] Esperar a que diga "Started"
- [ ] Abrir `http://localhost:8080/admin/`
- [ ] Login: `admin` / `admin123`
- [ ] Configurar número de WhatsApp
- [ ] Agregar tus productos
- [ ] Configurar tamaños y precios
- [ ] Agregar toppings y jaleas
- [ ] ¡Compartir el link con tus clientes!

---

**¡Listo!** Ya tienes tu sistema de fresas con crema funcionando. 🍓

Si esta guía te ayudó, considera compartirla con otros pequeños negocios que podrían necesitarla.

**Desarrollado con ❤️ para pequeños emprendedores**
