/**
 * Admin Panel - DeliBoon
 * Sistema de gestión del panel de administrador
 */

// ============================================
// ESTADO GLOBAL
// ============================================
let currentPage = 'dashboard';

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', async () => {
    // Verificar autenticación
    await checkAuth();

    // Configurar event listeners
    setupEventListeners();

    // Cargar ruta inicial
    router();
});

// ============================================
// AUTENTICACIÓN
// ============================================

/**
 * Verifica si el usuario está autenticado
 */
async function checkAuth() {
    try {
        const response = await fetch('/api/admin/configuraciones/whatsapp');

        if (!response.ok) {
            // No autenticado, redirigir al login
            window.location.href = '/admin/login.html';
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error al verificar autenticación:', error);
        window.location.href = '/admin/login.html';
        return false;
    }
}

/**
 * Cierra la sesión del usuario
 */
async function logout() {
    try {
        await fetch('/api/logout', {
            method: 'POST'
        });
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
    } finally {
        // Redirigir al login independientemente del resultado
        window.location.href = '/admin/login.html';
    }
}

// ============================================
// CONFIGURACIÓN DE EVENTOS
// ============================================
function setupEventListeners() {
    // Botón de logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }

    // Toggle sidebar en mobile
    const toggleSidebarBtn = document.getElementById('toggle-sidebar-btn');
    const sidebar = document.getElementById('sidebar');
    if (toggleSidebarBtn && sidebar) {
        toggleSidebarBtn.addEventListener('click', () => {
            sidebar.classList.toggle('show');
        });
    }

    // Links del sidebar
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // Remover clase active de todos
            sidebarLinks.forEach(l => l.classList.remove('active'));

            // Añadir clase active al clickeado
            link.classList.add('active');

            // Ocultar sidebar en mobile
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('show');
            }
        });
    });

    // Listeners del modal
    setupModalListeners();

    // Listener de cambio de hash
    window.addEventListener('hashchange', router);
}

// ============================================
// ROUTING (Navegación SPA)
// ============================================
function router() {
    const hash = window.location.hash.slice(1) || 'dashboard';
    currentPage = hash;

    console.log('Navegando a:', hash);

    // Mapear rutas a funciones de renderizado
    const routes = {
        'dashboard': renderDashboard,
        'productos': renderProductos,
        'tamanios': renderTamanios,
        'toppings': renderToppings,
        'jaleas': renderJaleas,
        'adicionales': renderAdicionales,
        'configuracion': renderConfiguracion
    };

    const renderFunction = routes[hash] || renderDashboard;
    renderFunction();
}

// ============================================
// RENDERIZADO DE PÁGINAS
// ============================================

/**
 * Renderiza el Dashboard
 */
function renderDashboard() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="page-header">
            <h1>Dashboard</h1>
            <p>Bienvenido al panel de administración de DeliBoon 🍓</p>
        </div>

        <div class="dashboard-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
            <div class="card">
                <h3 style="color: var(--color-primary); margin-bottom: 12px;">
                    <i class="fas fa-box"></i> Productos
                </h3>
                <p>Gestiona los productos del catálogo</p>
                <a href="#productos" class="btn btn-primary" style="margin-top: 12px;">
                    Ver Productos
                </a>
            </div>

            <div class="card">
                <h3 style="color: var(--color-info); margin-bottom: 12px;">
                    <i class="fas fa-ruler"></i> Tamaños
                </h3>
                <p>Configura tamaños y precios</p>
                <a href="#tamanios" class="btn btn-primary" style="margin-top: 12px;">
                    Ver Tamaños
                </a>
            </div>

            <div class="card">
                <h3 style="color: var(--color-warning); margin-bottom: 12px;">
                    <i class="fas fa-cookie"></i> Toppings
                </h3>
                <p>Administra los toppings disponibles</p>
                <a href="#toppings" class="btn btn-primary" style="margin-top: 12px;">
                    Ver Toppings
                </a>
            </div>

            <div class="card">
                <h3 style="color: var(--color-success); margin-bottom: 12px;">
                    <i class="fas fa-droplet"></i> Jaleas
                </h3>
                <p>Gestiona las jaleas del menú</p>
                <a href="#jaleas" class="btn btn-primary" style="margin-top: 12px;">
                    Ver Jaleas
                </a>
            </div>

            <div class="card">
                <h3 style="color: var(--color-danger); margin-bottom: 12px;">
                    <i class="fas fa-plus-circle"></i> Adicionales
                </h3>
                <p>Configura extras y sus precios</p>
                <a href="#adicionales" class="btn btn-primary" style="margin-top: 12px;">
                    Ver Adicionales
                </a>
            </div>

            <div class="card">
                <h3 style="color: var(--color-text); margin-bottom: 12px;">
                    <i class="fas fa-cog"></i> Configuración
                </h3>
                <p>Ajustes del sistema</p>
                <a href="#configuracion" class="btn btn-primary" style="margin-top: 12px;">
                    Ver Configuración
                </a>
            </div>
        </div>

        <div class="card" style="margin-top: 24px;">
            <h3 style="margin-bottom: 16px;">
                <i class="fas fa-info-circle"></i> Información del Sistema
            </h3>
            <div class="alert alert-info">
                <i class="fas fa-lightbulb"></i>
                <div>
                    <strong>Panel de Administración DeliBoon</strong><br>
                    Usa el menú lateral para navegar entre las diferentes secciones.
                    Recuerda guardar los cambios antes de salir.
                </div>
            </div>
        </div>
    `;
}

/**
 * Renderiza la página de Productos
 */
async function renderProductos() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="page-header">
            <h1>Productos</h1>
            <p>Gestión de productos del catálogo</p>
        </div>

        <div class="card">
            <div class="card-header">
                <h3 class="card-title">Lista de Productos</h3>
                <button class="btn btn-primary" onclick="nuevoProducto()">
                    <i class="fas fa-plus"></i> Nuevo Producto
                </button>
            </div>
            <div id="productos-container" class="loading">
                <i class="fas fa-spinner fa-spin"></i>
                Cargando productos...
            </div>
        </div>
    `;

    // Cargar productos desde la API
    await cargarProductos();
}

/**
 * Carga los productos desde la API
 */
async function cargarProductos() {
    try {
        const response = await fetch('/api/admin/productos');

        if (!response.ok) {
            throw new Error('Error al cargar productos');
        }

        const productos = await response.json();
        mostrarProductos(productos);
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('productos-container').innerHTML = `
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-circle"></i>
                <span>Error al cargar los productos. Por favor, intenta nuevamente.</span>
            </div>
        `;
    }
}

/**
 * Muestra los productos en una tabla
 */
function mostrarProductos(productos) {
    const container = document.getElementById('productos-container');

    if (productos.length === 0) {
        container.innerHTML = `
            <div class="alert alert-info">
                <i class="fas fa-info-circle"></i>
                <span>No hay productos registrados. Crea uno nuevo para comenzar.</span>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Tipo de Crema</th>
                        <th>Imagen</th>
                        <th>Disponible</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${productos.map(producto => `
                        <tr>
                            <td>${producto.id}</td>
                            <td><strong>${producto.nombre}</strong></td>
                            <td>${producto.descripcion || '-'}</td>
                            <td>
                                <span style="background: ${producto.tipoCrema === 'NORMAL' ? '#E8F5E9' : '#FFF3E0'};
                                             color: ${producto.tipoCrema === 'NORMAL' ? '#2E7D32' : '#E65100'};
                                             padding: 4px 8px;
                                             border-radius: 4px;
                                             font-weight: 600;">
                                    ${producto.tipoCrema}
                                </span>
                            </td>
                            <td>
                                ${producto.imagenUrl ?
                                    `<img src="${producto.imagenUrl}" alt="${producto.nombre}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;">` :
                                    '<span style="color: #999;">Sin imagen</span>'
                                }
                            </td>
                            <td>
                                <span style="color: ${producto.disponible ? 'var(--color-success)' : 'var(--color-danger)'}">
                                    <i class="fas fa-${producto.disponible ? 'check-circle' : 'times-circle'}"></i>
                                    ${producto.disponible ? 'Sí' : 'No'}
                                </span>
                            </td>
                            <td>
                                <button class="btn btn-sm btn-primary" onclick="verTamanios(${producto.id})" title="Ver Tamaños">
                                    <i class="fas fa-ruler"></i>
                                </button>
                                <button class="btn btn-sm btn-secondary" onclick="editarProducto(${producto.id})" title="Editar">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-sm btn-danger" onclick="eliminarProducto(${producto.id}, '${producto.nombre}')" title="Eliminar">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

/**
 * Abre el modal para crear un nuevo producto
 */
function nuevoProducto() {
    const modal = document.getElementById('form-modal');
    const modalTitle = document.getElementById('modal-title');
    const form = document.getElementById('entity-form');

    modalTitle.textContent = 'Nuevo Producto';
    form.innerHTML = `
        <div class="form-group">
            <label for="producto-nombre">Nombre *</label>
            <input type="text" id="producto-nombre" name="nombre" required>
        </div>

        <div class="form-group">
            <label for="producto-descripcion">Descripción</label>
            <textarea id="producto-descripcion" name="descripcion" rows="3"></textarea>
        </div>

        <div class="form-group">
            <label for="producto-tipo-crema">Tipo de Crema *</label>
            <select id="producto-tipo-crema" name="tipoCrema" required>
                <option value="NORMAL">NORMAL (Crema Natural)</option>
                <option value="CAFE">CAFE (Crema de Café)</option>
            </select>
        </div>

        <div class="form-group">
            <label for="producto-imagen">URL de la Imagen</label>
            <input type="url" id="producto-imagen" name="imagenUrl" placeholder="https://ejemplo.com/imagen.jpg">
        </div>

        <div class="form-group">
            <div class="form-check">
                <input type="checkbox" id="producto-disponible" name="disponible" checked>
                <label for="producto-disponible">Producto disponible</label>
            </div>
        </div>
    `;

    // Configurar el evento de submit
    form.onsubmit = async (e) => {
        e.preventDefault();
        await guardarProducto();
    };

    modal.classList.add('show');
}

/**
 * Edita un producto existente
 */
async function editarProducto(id) {
    try {
        const response = await fetch(`/api/admin/productos/${id}`);

        if (!response.ok) {
            throw new Error('Error al cargar el producto');
        }

        const producto = await response.json();

        const modal = document.getElementById('form-modal');
        const modalTitle = document.getElementById('modal-title');
        const form = document.getElementById('entity-form');

        modalTitle.textContent = 'Editar Producto';
        form.innerHTML = `
            <input type="hidden" id="producto-id" value="${producto.id}">

            <div class="form-group">
                <label for="producto-nombre">Nombre *</label>
                <input type="text" id="producto-nombre" name="nombre" value="${producto.nombre}" required>
            </div>

            <div class="form-group">
                <label for="producto-descripcion">Descripción</label>
                <textarea id="producto-descripcion" name="descripcion" rows="3">${producto.descripcion || ''}</textarea>
            </div>

            <div class="form-group">
                <label for="producto-tipo-crema">Tipo de Crema *</label>
                <select id="producto-tipo-crema" name="tipoCrema" required>
                    <option value="NORMAL" ${producto.tipoCrema === 'NORMAL' ? 'selected' : ''}>NORMAL (Crema Natural)</option>
                    <option value="CAFE" ${producto.tipoCrema === 'CAFE' ? 'selected' : ''}>CAFE (Crema de Café)</option>
                </select>
            </div>

            <div class="form-group">
                <label for="producto-imagen">URL de la Imagen</label>
                <input type="url" id="producto-imagen" name="imagenUrl" value="${producto.imagenUrl || ''}" placeholder="https://ejemplo.com/imagen.jpg">
            </div>

            <div class="form-group">
                <div class="form-check">
                    <input type="checkbox" id="producto-disponible" name="disponible" ${producto.disponible ? 'checked' : ''}>
                    <label for="producto-disponible">Producto disponible</label>
                </div>
            </div>
        `;

        // Configurar el evento de submit
        form.onsubmit = async (e) => {
            e.preventDefault();
            await guardarProducto(producto.id);
        };

        modal.classList.add('show');
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error al cargar el producto', 'danger');
    }
}

/**
 * Guarda un producto (crear o actualizar)
 */
async function guardarProducto(id = null) {
    const nombre = document.getElementById('producto-nombre').value;
    const descripcion = document.getElementById('producto-descripcion').value;
    const tipoCrema = document.getElementById('producto-tipo-crema').value;
    const imagenUrl = document.getElementById('producto-imagen').value;
    const disponible = document.getElementById('producto-disponible').checked;

    const producto = {
        nombre,
        descripcion,
        tipoCrema,
        imagenUrl,
        disponible
    };

    try {
        const url = id ? `/api/admin/productos/${id}` : '/api/admin/productos';
        const method = id ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(producto)
        });

        if (!response.ok) {
            throw new Error('Error al guardar el producto');
        }

        closeModal();
        showAlert(`Producto ${id ? 'actualizado' : 'creado'} exitosamente`, 'success');
        await cargarProductos();
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error al guardar el producto', 'danger');
    }
}

/**
 * Elimina un producto
 */
async function eliminarProducto(id, nombre) {
    if (!confirm(`¿Estás seguro de eliminar el producto "${nombre}"?\n\nEsta acción eliminará también todos sus tamaños asociados.`)) {
        return;
    }

    try {
        const response = await fetch(`/api/admin/productos/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Error al eliminar el producto');
        }

        showAlert('Producto eliminado exitosamente', 'success');
        await cargarProductos();
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error al eliminar el producto', 'danger');
    }
}

/**
 * Ver y gestionar tamaños de un producto
 */
async function verTamanios(productoId) {
    try {
        const [productoResponse, tamaniosResponse] = await Promise.all([
            fetch(`/api/admin/productos/${productoId}`),
            fetch(`/api/admin/tamanios/producto/${productoId}`)
        ]);

        if (!productoResponse.ok || !tamaniosResponse.ok) {
            throw new Error('Error al cargar datos');
        }

        const producto = await productoResponse.json();
        const tamanios = await tamaniosResponse.json();

        const modal = document.getElementById('form-modal');
        const modalTitle = document.getElementById('modal-title');
        const form = document.getElementById('entity-form');

        modalTitle.textContent = `Tamaños de: ${producto.nombre}`;
        form.innerHTML = `
            <div class="alert alert-info">
                <i class="fas fa-info-circle"></i>
                <div>
                    <strong>Producto:</strong> ${producto.nombre}<br>
                    <strong>Tipo de Crema:</strong> ${producto.tipoCrema}
                </div>
            </div>

            <div style="margin-bottom: 20px;">
                <button type="button" class="btn btn-primary" onclick="nuevoTamanioParaProducto(${productoId})">
                    <i class="fas fa-plus"></i> Agregar Tamaño
                </button>
            </div>

            <div id="tamanios-list">
                ${tamanios.length === 0 ? `
                    <div class="alert alert-warning">
                        <i class="fas fa-exclamation-triangle"></i>
                        <span>Este producto no tiene tamaños configurados.</span>
                    </div>
                ` : `
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Precio Base</th>
                                    <th>Toppings Incl.</th>
                                    <th>Jaleas Incl.</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${tamanios.map(tam => `
                                    <tr>
                                        <td><strong>${tam.nombre}</strong></td>
                                        <td>S/ ${tam.precioBase.toFixed(2)}</td>
                                        <td>${tam.toppingsIncluidos}</td>
                                        <td>${tam.jaleasIncluidas}</td>
                                        <td>
                                            <button type="button" class="btn btn-sm btn-secondary" onclick="editarTamanio(${tam.id})">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                            <button type="button" class="btn btn-sm btn-danger" onclick="eliminarTamanio(${tam.id}, '${tam.nombre}')">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                `}
            </div>
        `;

        // Deshabilitar el submit del formulario principal
        form.onsubmit = (e) => {
            e.preventDefault();
            closeModal();
        };

        modal.classList.add('show');
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error al cargar los tamaños', 'danger');
    }
}

/**
 * Renderiza la página de Tamaños
 */
async function renderTamanios() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="page-header">
            <h1>Tamaños</h1>
            <p>Gestión de tamaños y precios</p>
        </div>

        <div class="card">
            <div class="alert alert-info">
                <i class="fas fa-info-circle"></i>
                <div>
                    <strong>Tip:</strong> Los tamaños se gestionan individualmente desde cada producto.
                    Ve a <a href="#productos" style="color: var(--color-primary); font-weight: 700;">Productos</a>
                    y haz clic en el botón de tamaños <i class="fas fa-ruler"></i> para configurarlos.
                </div>
            </div>
        </div>
    `;
}

/**
 * Crea un nuevo tamaño para un producto específico
 */
function nuevoTamanioParaProducto(productoId) {
    const modal = document.getElementById('form-modal');
    const modalTitle = document.getElementById('modal-title');
    const formContainer = document.getElementById('entity-form');

    // Crear un nuevo modal más pequeño
    modalTitle.textContent = 'Nuevo Tamaño';

    const newForm = document.createElement('form');
    newForm.id = 'tamanio-form';
    newForm.innerHTML = `
        <input type="hidden" id="tamanio-producto-id" value="${productoId}">

        <div class="form-group">
            <label for="tamanio-nombre">Nombre del Tamaño *</label>
            <input type="text" id="tamanio-nombre" name="nombre" required placeholder="Ej: Personal, Mediano, Grande">
        </div>

        <div class="form-group">
            <label for="tamanio-precio">Precio Base (S/) *</label>
            <input type="number" id="tamanio-precio" name="precioBase" step="0.01" min="0" required>
        </div>

        <div class="form-group">
            <label for="tamanio-toppings">Toppings Incluidos *</label>
            <input type="number" id="tamanio-toppings" name="toppingsIncluidos" min="0" required>
        </div>

        <div class="form-group">
            <label for="tamanio-jaleas">Jaleas Incluidas *</label>
            <input type="number" id="tamanio-jaleas" name="jaleasIncluidas" min="0" required>
        </div>
    `;

    newForm.onsubmit = async (e) => {
        e.preventDefault();
        await guardarTamanio(productoId);
    };

    formContainer.innerHTML = '';
    formContainer.appendChild(newForm);

    // Cerrar el modal anterior y abrir el nuevo
    closeModal();
    setTimeout(() => {
        modal.classList.add('show');
    }, 100);
}

/**
 * Edita un tamaño existente
 */
async function editarTamanio(tamanioId) {
    try {
        const response = await fetch(`/api/admin/tamanios/${tamanioId}`);

        if (!response.ok) {
            throw new Error('Error al cargar el tamaño');
        }

        const tamanio = await response.json();

        const modal = document.getElementById('form-modal');
        const modalTitle = document.getElementById('modal-title');
        const formContainer = document.getElementById('entity-form');

        modalTitle.textContent = 'Editar Tamaño';

        const newForm = document.createElement('form');
        newForm.id = 'tamanio-form';
        newForm.innerHTML = `
            <input type="hidden" id="tamanio-id" value="${tamanio.id}">
            <input type="hidden" id="tamanio-producto-id" value="${tamanio.producto.id}">

            <div class="form-group">
                <label for="tamanio-nombre">Nombre del Tamaño *</label>
                <input type="text" id="tamanio-nombre" name="nombre" value="${tamanio.nombre}" required>
            </div>

            <div class="form-group">
                <label for="tamanio-precio">Precio Base (S/) *</label>
                <input type="number" id="tamanio-precio" name="precioBase" value="${tamanio.precioBase}" step="0.01" min="0" required>
            </div>

            <div class="form-group">
                <label for="tamanio-toppings">Toppings Incluidos *</label>
                <input type="number" id="tamanio-toppings" name="toppingsIncluidos" value="${tamanio.toppingsIncluidos}" min="0" required>
            </div>

            <div class="form-group">
                <label for="tamanio-jaleas">Jaleas Incluidas *</label>
                <input type="number" id="tamanio-jaleas" name="jaleasIncluidas" value="${tamanio.jaleasIncluidas}" min="0" required>
            </div>
        `;

        newForm.onsubmit = async (e) => {
            e.preventDefault();
            await guardarTamanio(tamanio.producto.id, tamanio.id);
        };

        formContainer.innerHTML = '';
        formContainer.appendChild(newForm);

        closeModal();
        setTimeout(() => {
            modal.classList.add('show');
        }, 100);
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error al cargar el tamaño', 'danger');
    }
}

/**
 * Guarda un tamaño (crear o actualizar)
 */
async function guardarTamanio(productoId, tamanioId = null) {
    const nombre = document.getElementById('tamanio-nombre').value;
    const precioBase = parseFloat(document.getElementById('tamanio-precio').value);
    const toppingsIncluidos = parseInt(document.getElementById('tamanio-toppings').value);
    const jaleasIncluidas = parseInt(document.getElementById('tamanio-jaleas').value);

    const tamanio = {
        nombre,
        precioBase,
        toppingsIncluidos,
        jaleasIncluidas,
        producto: { id: productoId }
    };

    try {
        const url = tamanioId ? `/api/admin/tamanios/${tamanioId}` : '/api/admin/tamanios';
        const method = tamanioId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tamanio)
        });

        if (!response.ok) {
            throw new Error('Error al guardar el tamaño');
        }

        closeModal();
        showAlert(`Tamaño ${tamanioId ? 'actualizado' : 'creado'} exitosamente`, 'success');

        // Recargar la vista de tamaños del producto
        await verTamanios(productoId);
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error al guardar el tamaño', 'danger');
    }
}

/**
 * Elimina un tamaño
 */
async function eliminarTamanio(tamanioId, nombre) {
    if (!confirm(`¿Estás seguro de eliminar el tamaño "${nombre}"?`)) {
        return;
    }

    try {
        // Primero obtener el productoId antes de eliminar
        const tamanioResponse = await fetch(`/api/admin/tamanios/${tamanioId}`);
        const tamanio = await tamanioResponse.json();
        const productoId = tamanio.producto.id;

        const response = await fetch(`/api/admin/tamanios/${tamanioId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Error al eliminar el tamaño');
        }

        showAlert('Tamaño eliminado exitosamente', 'success');

        // Recargar la vista de tamaños del producto
        await verTamanios(productoId);
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error al eliminar el tamaño', 'danger');
    }
}

/**
 * Renderiza la página de Toppings
 */
async function renderToppings() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="page-header">
            <h1>Toppings</h1>
            <p>Gestión de toppings disponibles</p>
        </div>

        <div class="card">
            <div class="card-header">
                <h3 class="card-title">Lista de Toppings</h3>
                <button class="btn btn-primary" onclick="nuevoTopping()">
                    <i class="fas fa-plus"></i> Nuevo Topping
                </button>
            </div>
            <div id="toppings-container" class="loading">
                <i class="fas fa-spinner fa-spin"></i>
                Cargando toppings...
            </div>
        </div>
    `;

    await cargarToppings();
}

async function cargarToppings() {
    try {
        const response = await fetch('/api/admin/toppings');

        if (!response.ok) {
            throw new Error('Error al cargar toppings');
        }

        const toppings = await response.json();
        const container = document.getElementById('toppings-container');

        if (toppings.length === 0) {
            container.innerHTML = `
                <div class="alert alert-info">
                    <i class="fas fa-info-circle"></i>
                    <span>No hay toppings registrados. Crea uno nuevo para comenzar.</span>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Disponible</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${toppings.map(topping => `
                            <tr>
                                <td>${topping.id}</td>
                                <td><strong>${topping.nombre}</strong></td>
                                <td>
                                    <span style="color: ${topping.disponible ? 'var(--color-success)' : 'var(--color-danger)'}">
                                        <i class="fas fa-${topping.disponible ? 'check-circle' : 'times-circle'}"></i>
                                        ${topping.disponible ? 'Sí' : 'No'}
                                    </span>
                                </td>
                                <td>
                                    <button class="btn btn-sm btn-secondary" onclick="editarTopping(${topping.id})" title="Editar">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn btn-sm btn-danger" onclick="eliminarTopping(${topping.id}, '${topping.nombre}')" title="Eliminar">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('toppings-container').innerHTML = `
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-circle"></i>
                <span>Error al cargar los toppings. Por favor, intenta nuevamente.</span>
            </div>
        `;
    }
}

function nuevoTopping() {
    const modal = document.getElementById('form-modal');
    const modalTitle = document.getElementById('modal-title');
    const form = document.getElementById('entity-form');

    modalTitle.textContent = 'Nuevo Topping';
    form.innerHTML = `
        <div class="form-group">
            <label for="topping-nombre">Nombre *</label>
            <input type="text" id="topping-nombre" name="nombre" required>
        </div>

        <div class="form-group">
            <div class="form-check">
                <input type="checkbox" id="topping-disponible" name="disponible" checked>
                <label for="topping-disponible">Topping disponible</label>
            </div>
        </div>
    `;

    form.onsubmit = async (e) => {
        e.preventDefault();
        await guardarTopping();
    };

    modal.classList.add('show');
}

async function editarTopping(id) {
    try {
        const response = await fetch(`/api/admin/toppings/${id}`);

        if (!response.ok) {
            throw new Error('Error al cargar el topping');
        }

        const topping = await response.json();

        const modal = document.getElementById('form-modal');
        const modalTitle = document.getElementById('modal-title');
        const form = document.getElementById('entity-form');

        modalTitle.textContent = 'Editar Topping';
        form.innerHTML = `
            <input type="hidden" id="topping-id" value="${topping.id}">

            <div class="form-group">
                <label for="topping-nombre">Nombre *</label>
                <input type="text" id="topping-nombre" name="nombre" value="${topping.nombre}" required>
            </div>

            <div class="form-group">
                <div class="form-check">
                    <input type="checkbox" id="topping-disponible" name="disponible" ${topping.disponible ? 'checked' : ''}>
                    <label for="topping-disponible">Topping disponible</label>
                </div>
            </div>
        `;

        form.onsubmit = async (e) => {
            e.preventDefault();
            await guardarTopping(topping.id);
        };

        modal.classList.add('show');
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error al cargar el topping', 'danger');
    }
}

async function guardarTopping(id = null) {
    const nombre = document.getElementById('topping-nombre').value;
    const disponible = document.getElementById('topping-disponible').checked;

    const topping = { nombre, disponible };

    try {
        const url = id ? `/api/admin/toppings/${id}` : '/api/admin/toppings';
        const method = id ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(topping)
        });

        if (!response.ok) {
            throw new Error('Error al guardar el topping');
        }

        closeModal();
        showAlert(`Topping ${id ? 'actualizado' : 'creado'} exitosamente`, 'success');
        await cargarToppings();
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error al guardar el topping', 'danger');
    }
}

async function eliminarTopping(id, nombre) {
    if (!confirm(`¿Estás seguro de eliminar el topping "${nombre}"?`)) {
        return;
    }

    try {
        const response = await fetch(`/api/admin/toppings/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Error al eliminar el topping');
        }

        showAlert('Topping eliminado exitosamente', 'success');
        await cargarToppings();
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error al eliminar el topping', 'danger');
    }
}

/**
 * Renderiza la página de Jaleas
 */
async function renderJaleas() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="page-header">
            <h1>Jaleas</h1>
            <p>Gestión de jaleas del menú</p>
        </div>

        <div class="card">
            <div class="card-header">
                <h3 class="card-title">Lista de Jaleas</h3>
                <button class="btn btn-primary" onclick="nuevaJalea()">
                    <i class="fas fa-plus"></i> Nueva Jalea
                </button>
            </div>
            <div id="jaleas-container" class="loading">
                <i class="fas fa-spinner fa-spin"></i>
                Cargando jaleas...
            </div>
        </div>
    `;

    await cargarJaleas();
}

async function cargarJaleas() {
    try {
        const response = await fetch('/api/admin/jaleas');

        if (!response.ok) {
            throw new Error('Error al cargar jaleas');
        }

        const jaleas = await response.json();
        const container = document.getElementById('jaleas-container');

        if (jaleas.length === 0) {
            container.innerHTML = `
                <div class="alert alert-info">
                    <i class="fas fa-info-circle"></i>
                    <span>No hay jaleas registradas. Crea una nueva para comenzar.</span>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Disponible</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${jaleas.map(jalea => `
                            <tr>
                                <td>${jalea.id}</td>
                                <td><strong>${jalea.nombre}</strong></td>
                                <td>
                                    <span style="color: ${jalea.disponible ? 'var(--color-success)' : 'var(--color-danger)'}">
                                        <i class="fas fa-${jalea.disponible ? 'check-circle' : 'times-circle'}"></i>
                                        ${jalea.disponible ? 'Sí' : 'No'}
                                    </span>
                                </td>
                                <td>
                                    <button class="btn btn-sm btn-secondary" onclick="editarJalea(${jalea.id})" title="Editar">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn btn-sm btn-danger" onclick="eliminarJalea(${jalea.id}, '${jalea.nombre}')" title="Eliminar">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('jaleas-container').innerHTML = `
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-circle"></i>
                <span>Error al cargar las jaleas. Por favor, intenta nuevamente.</span>
            </div>
        `;
    }
}

function nuevaJalea() {
    const modal = document.getElementById('form-modal');
    const modalTitle = document.getElementById('modal-title');
    const form = document.getElementById('entity-form');

    modalTitle.textContent = 'Nueva Jalea';
    form.innerHTML = `
        <div class="form-group">
            <label for="jalea-nombre">Nombre *</label>
            <input type="text" id="jalea-nombre" name="nombre" required>
        </div>

        <div class="form-group">
            <div class="form-check">
                <input type="checkbox" id="jalea-disponible" name="disponible" checked>
                <label for="jalea-disponible">Jalea disponible</label>
            </div>
        </div>
    `;

    form.onsubmit = async (e) => {
        e.preventDefault();
        await guardarJalea();
    };

    modal.classList.add('show');
}

async function editarJalea(id) {
    try {
        const response = await fetch(`/api/admin/jaleas/${id}`);

        if (!response.ok) {
            throw new Error('Error al cargar la jalea');
        }

        const jalea = await response.json();

        const modal = document.getElementById('form-modal');
        const modalTitle = document.getElementById('modal-title');
        const form = document.getElementById('entity-form');

        modalTitle.textContent = 'Editar Jalea';
        form.innerHTML = `
            <input type="hidden" id="jalea-id" value="${jalea.id}">

            <div class="form-group">
                <label for="jalea-nombre">Nombre *</label>
                <input type="text" id="jalea-nombre" name="nombre" value="${jalea.nombre}" required>
            </div>

            <div class="form-group">
                <div class="form-check">
                    <input type="checkbox" id="jalea-disponible" name="disponible" ${jalea.disponible ? 'checked' : ''}>
                    <label for="jalea-disponible">Jalea disponible</label>
                </div>
            </div>
        `;

        form.onsubmit = async (e) => {
            e.preventDefault();
            await guardarJalea(jalea.id);
        };

        modal.classList.add('show');
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error al cargar la jalea', 'danger');
    }
}

async function guardarJalea(id = null) {
    const nombre = document.getElementById('jalea-nombre').value;
    const disponible = document.getElementById('jalea-disponible').checked;

    const jalea = { nombre, disponible };

    try {
        const url = id ? `/api/admin/jaleas/${id}` : '/api/admin/jaleas';
        const method = id ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(jalea)
        });

        if (!response.ok) {
            throw new Error('Error al guardar la jalea');
        }

        closeModal();
        showAlert(`Jalea ${id ? 'actualizada' : 'creada'} exitosamente`, 'success');
        await cargarJaleas();
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error al guardar la jalea', 'danger');
    }
}

async function eliminarJalea(id, nombre) {
    if (!confirm(`¿Estás seguro de eliminar la jalea "${nombre}"?`)) {
        return;
    }

    try {
        const response = await fetch(`/api/admin/jaleas/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Error al eliminar la jalea');
        }

        showAlert('Jalea eliminada exitosamente', 'success');
        await cargarJaleas();
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error al eliminar la jalea', 'danger');
    }
}

/**
 * Renderiza la página de Adicionales
 */
async function renderAdicionales() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="page-header">
            <h1>Adicionales</h1>
            <p>Gestión de extras y sus precios</p>
        </div>

        <div class="card">
            <div class="card-header">
                <h3 class="card-title">Lista de Adicionales</h3>
                <button class="btn btn-primary" onclick="nuevoAdicional()">
                    <i class="fas fa-plus"></i> Nuevo Adicional
                </button>
            </div>
            <div id="adicionales-container" class="loading">
                <i class="fas fa-spinner fa-spin"></i>
                Cargando adicionales...
            </div>
        </div>
    `;

    await cargarAdicionales();
}

async function cargarAdicionales() {
    try {
        const response = await fetch('/api/admin/adicionales');

        if (!response.ok) {
            throw new Error('Error al cargar adicionales');
        }

        const adicionales = await response.json();
        const container = document.getElementById('adicionales-container');

        if (adicionales.length === 0) {
            container.innerHTML = `
                <div class="alert alert-info">
                    <i class="fas fa-info-circle"></i>
                    <span>No hay adicionales registrados. Crea uno nuevo para comenzar.</span>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Precio</th>
                            <th>Disponible</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${adicionales.map(adicional => `
                            <tr>
                                <td>${adicional.id}</td>
                                <td><strong>${adicional.nombre}</strong></td>
                                <td>S/ ${adicional.precio.toFixed(2)}</td>
                                <td>
                                    <span style="color: ${adicional.disponible ? 'var(--color-success)' : 'var(--color-danger)'}">
                                        <i class="fas fa-${adicional.disponible ? 'check-circle' : 'times-circle'}"></i>
                                        ${adicional.disponible ? 'Sí' : 'No'}
                                    </span>
                                </td>
                                <td>
                                    <button class="btn btn-sm btn-secondary" onclick="editarAdicional(${adicional.id})" title="Editar">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn btn-sm btn-danger" onclick="eliminarAdicional(${adicional.id}, '${adicional.nombre}')" title="Eliminar">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('adicionales-container').innerHTML = `
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-circle"></i>
                <span>Error al cargar los adicionales. Por favor, intenta nuevamente.</span>
            </div>
        `;
    }
}

function nuevoAdicional() {
    const modal = document.getElementById('form-modal');
    const modalTitle = document.getElementById('modal-title');
    const form = document.getElementById('entity-form');

    modalTitle.textContent = 'Nuevo Adicional';
    form.innerHTML = `
        <div class="form-group">
            <label for="adicional-nombre">Nombre *</label>
            <input type="text" id="adicional-nombre" name="nombre" required>
        </div>

        <div class="form-group">
            <label for="adicional-precio">Precio (S/) *</label>
            <input type="number" id="adicional-precio" name="precio" step="0.01" min="0" required>
        </div>

        <div class="form-group">
            <div class="form-check">
                <input type="checkbox" id="adicional-disponible" name="disponible" checked>
                <label for="adicional-disponible">Adicional disponible</label>
            </div>
        </div>
    `;

    form.onsubmit = async (e) => {
        e.preventDefault();
        await guardarAdicional();
    };

    modal.classList.add('show');
}

async function editarAdicional(id) {
    try {
        const response = await fetch(`/api/admin/adicionales/${id}`);

        if (!response.ok) {
            throw new Error('Error al cargar el adicional');
        }

        const adicional = await response.json();

        const modal = document.getElementById('form-modal');
        const modalTitle = document.getElementById('modal-title');
        const form = document.getElementById('entity-form');

        modalTitle.textContent = 'Editar Adicional';
        form.innerHTML = `
            <input type="hidden" id="adicional-id" value="${adicional.id}">

            <div class="form-group">
                <label for="adicional-nombre">Nombre *</label>
                <input type="text" id="adicional-nombre" name="nombre" value="${adicional.nombre}" required>
            </div>

            <div class="form-group">
                <label for="adicional-precio">Precio (S/) *</label>
                <input type="number" id="adicional-precio" name="precio" value="${adicional.precio}" step="0.01" min="0" required>
            </div>

            <div class="form-group">
                <div class="form-check">
                    <input type="checkbox" id="adicional-disponible" name="disponible" ${adicional.disponible ? 'checked' : ''}>
                    <label for="adicional-disponible">Adicional disponible</label>
                </div>
            </div>
        `;

        form.onsubmit = async (e) => {
            e.preventDefault();
            await guardarAdicional(adicional.id);
        };

        modal.classList.add('show');
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error al cargar el adicional', 'danger');
    }
}

async function guardarAdicional(id = null) {
    const nombre = document.getElementById('adicional-nombre').value;
    const precio = parseFloat(document.getElementById('adicional-precio').value);
    const disponible = document.getElementById('adicional-disponible').checked;

    const adicional = { nombre, precio, disponible };

    try {
        const url = id ? `/api/admin/adicionales/${id}` : '/api/admin/adicionales';
        const method = id ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(adicional)
        });

        if (!response.ok) {
            throw new Error('Error al guardar el adicional');
        }

        closeModal();
        showAlert(`Adicional ${id ? 'actualizado' : 'creado'} exitosamente`, 'success');
        await cargarAdicionales();
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error al guardar el adicional', 'danger');
    }
}

async function eliminarAdicional(id, nombre) {
    if (!confirm(`¿Estás seguro de eliminar el adicional "${nombre}"?`)) {
        return;
    }

    try {
        const response = await fetch(`/api/admin/adicionales/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Error al eliminar el adicional');
        }

        showAlert('Adicional eliminado exitosamente', 'success');
        await cargarAdicionales();
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error al eliminar el adicional', 'danger');
    }
}

/**
 * Renderiza la página de Configuración
 */
async function renderConfiguracion() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="page-header">
            <h1>Configuración</h1>
            <p>Ajustes generales del sistema</p>
        </div>

        <div class="card">
            <div class="card-header">
                <h3 class="card-title">
                    <i class="fas fa-whatsapp" style="color: #25D366;"></i>
                    Configuración de WhatsApp
                </h3>
            </div>
            <div id="config-container" class="loading">
                <i class="fas fa-spinner fa-spin"></i>
                Cargando configuración...
            </div>
        </div>

        <div class="card">
            <h3 style="margin-bottom: 16px;">
                <i class="fas fa-info-circle"></i> Información
            </h3>
            <div class="alert alert-info">
                <i class="fas fa-lightbulb"></i>
                <div>
                    <strong>Formato del número de WhatsApp:</strong><br>
                    Debe incluir el código del país sin el símbolo +.<br>
                    Ejemplo: 51999888777 (para Perú)
                </div>
            </div>
        </div>
    `;

    await cargarConfiguracion();
}

async function cargarConfiguracion() {
    try {
        const response = await fetch('/api/admin/configuraciones/whatsapp');

        if (!response.ok) {
            throw new Error('Error al cargar configuración');
        }

        const data = await response.json();
        const container = document.getElementById('config-container');

        container.innerHTML = `
            <form id="config-form" style="max-width: 600px;">
                <div class="form-group">
                    <label for="whatsapp-numero">
                        <i class="fas fa-phone"></i> Número de WhatsApp *
                    </label>
                    <input
                        type="text"
                        id="whatsapp-numero"
                        name="numero"
                        value="${data.numero || ''}"
                        required
                        placeholder="51999888777"
                        pattern="[0-9]+"
                        title="Solo números, sin espacios ni símbolos"
                    >
                    <small style="color: var(--color-text-light); display: block; margin-top: 8px;">
                        Este número se usará para recibir pedidos de los clientes
                    </small>
                </div>

                <div style="display: flex; gap: 12px; margin-top: 24px;">
                    <button type="submit" class="btn btn-success">
                        <i class="fas fa-save"></i> Guardar Cambios
                    </button>
                    <button type="button" class="btn btn-secondary" onclick="cargarConfiguracion()">
                        <i class="fas fa-undo"></i> Cancelar
                    </button>
                </div>
            </form>

            ${data.numero ? `
                <div class="alert alert-success" style="margin-top: 24px;">
                    <i class="fas fa-check-circle"></i>
                    <div>
                        <strong>Número configurado:</strong> +${data.numero}<br>
                        <a href="https://wa.me/${data.numero}" target="_blank" style="color: var(--color-success); text-decoration: underline;">
                            <i class="fas fa-external-link-alt"></i> Probar enlace de WhatsApp
                        </a>
                    </div>
                </div>
            ` : ''}
        `;

        // Configurar el evento de submit
        const form = document.getElementById('config-form');
        form.onsubmit = async (e) => {
            e.preventDefault();
            await guardarConfiguracion();
        };
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('config-container').innerHTML = `
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-circle"></i>
                <span>Error al cargar la configuración. Por favor, intenta nuevamente.</span>
            </div>
        `;
    }
}

async function guardarConfiguracion() {
    const numero = document.getElementById('whatsapp-numero').value.trim();

    // Validar que solo contenga números
    if (!/^[0-9]+$/.test(numero)) {
        showAlert('El número debe contener solo dígitos', 'danger');
        return;
    }

    // Validar longitud mínima
    if (numero.length < 10) {
        showAlert('El número debe tener al menos 10 dígitos', 'danger');
        return;
    }

    try {
        const response = await fetch('/api/admin/configuraciones/whatsapp', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ numero })
        });

        if (!response.ok) {
            throw new Error('Error al guardar configuración');
        }

        showAlert('Configuración actualizada exitosamente', 'success');
        await cargarConfiguracion();
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error al guardar la configuración', 'danger');
    }
}

// ============================================
// GESTIÓN DEL MODAL
// ============================================
function setupModalListeners() {
    const modal = document.getElementById('form-modal');
    const closeBtn = document.getElementById('modal-close-btn');
    const cancelBtn = document.getElementById('modal-cancel-btn');

    if (closeBtn) {
        closeBtn.addEventListener('click', () => closeModal());
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => closeModal());
    }

    // Cerrar modal al hacer click fuera
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
}

function showModal(title) {
    const modal = document.getElementById('form-modal');
    const modalTitle = document.getElementById('modal-title');

    modalTitle.textContent = title;
    modal.classList.add('show');
}

function closeModal() {
    const modal = document.getElementById('form-modal');
    modal.classList.remove('show');

    // Limpiar formulario
    const form = document.getElementById('entity-form');
    if (form) {
        form.innerHTML = '';
    }
}

// ============================================
// UTILIDADES
// ============================================

/**
 * Muestra un mensaje de alerta temporal
 */
function showAlert(message, type = 'info') {
    const content = document.getElementById('content');
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'danger' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;

    content.insertBefore(alert, content.firstChild);

    // Remover después de 5 segundos
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

// Exportar funciones globales (para uso en HTML inline)
window.logout = logout;
window.showModal = showModal;
window.closeModal = closeModal;
window.showAlert = showAlert;

// Productos
window.nuevoProducto = nuevoProducto;
window.editarProducto = editarProducto;
window.eliminarProducto = eliminarProducto;
window.verTamanios = verTamanios;

// Tamaños
window.nuevoTamanioParaProducto = nuevoTamanioParaProducto;
window.editarTamanio = editarTamanio;
window.eliminarTamanio = eliminarTamanio;

// Toppings
window.nuevoTopping = nuevoTopping;
window.editarTopping = editarTopping;
window.eliminarTopping = eliminarTopping;

// Jaleas
window.nuevaJalea = nuevaJalea;
window.editarJalea = editarJalea;
window.eliminarJalea = eliminarJalea;

// Adicionales
window.nuevoAdicional = nuevoAdicional;
window.editarAdicional = editarAdicional;
window.eliminarAdicional = eliminarAdicional;
