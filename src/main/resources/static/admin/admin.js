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
function renderProductos() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="page-header">
            <h1>Productos</h1>
            <p>Gestión de productos del catálogo</p>
        </div>

        <div class="card">
            <div class="card-header">
                <h3 class="card-title">Lista de Productos</h3>
                <button class="btn btn-primary" onclick="alert('Función en desarrollo')">
                    <i class="fas fa-plus"></i> Nuevo Producto
                </button>
            </div>
            <div class="loading">
                <i class="fas fa-spinner fa-spin"></i>
                Cargando productos...
            </div>
        </div>

        <div class="alert alert-info">
            <i class="fas fa-info-circle"></i>
            <span>La gestión completa de productos se implementará en el siguiente paso.</span>
        </div>
    `;
}

/**
 * Renderiza la página de Tamaños
 */
function renderTamanios() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="page-header">
            <h1>Tamaños</h1>
            <p>Gestión de tamaños y precios</p>
        </div>

        <div class="card">
            <div class="alert alert-info">
                <i class="fas fa-info-circle"></i>
                <span>Sección en desarrollo. Aquí podrás gestionar los tamaños de los productos.</span>
            </div>
        </div>
    `;
}

/**
 * Renderiza la página de Toppings
 */
function renderToppings() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="page-header">
            <h1>Toppings</h1>
            <p>Gestión de toppings disponibles</p>
        </div>

        <div class="card">
            <div class="alert alert-info">
                <i class="fas fa-info-circle"></i>
                <span>Sección en desarrollo. Aquí podrás gestionar los toppings.</span>
            </div>
        </div>
    `;
}

/**
 * Renderiza la página de Jaleas
 */
function renderJaleas() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="page-header">
            <h1>Jaleas</h1>
            <p>Gestión de jaleas del menú</p>
        </div>

        <div class="card">
            <div class="alert alert-info">
                <i class="fas fa-info-circle"></i>
                <span>Sección en desarrollo. Aquí podrás gestionar las jaleas.</span>
            </div>
        </div>
    `;
}

/**
 * Renderiza la página de Adicionales
 */
function renderAdicionales() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="page-header">
            <h1>Adicionales</h1>
            <p>Gestión de extras y sus precios</p>
        </div>

        <div class="card">
            <div class="alert alert-info">
                <i class="fas fa-info-circle"></i>
                <span>Sección en desarrollo. Aquí podrás gestionar los adicionales.</span>
            </div>
        </div>
    `;
}

/**
 * Renderiza la página de Configuración
 */
function renderConfiguracion() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="page-header">
            <h1>Configuración</h1>
            <p>Ajustes generales del sistema</p>
        </div>

        <div class="card">
            <div class="alert alert-info">
                <i class="fas fa-info-circle"></i>
                <span>Sección en desarrollo. Aquí podrás configurar el número de WhatsApp y otros ajustes.</span>
            </div>
        </div>
    `;
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
