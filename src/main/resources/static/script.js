// ============================================
// VARIABLES GLOBALES
// ============================================

let catalogoData = {};
let cart = [];

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🍓 DeliBoon iniciado...');

    // Cargar catálogo desde la API
    await cargarCatalogo();

    // Configurar event listeners
    setupEventListeners();
});

// ============================================
// CARGA DE DATOS
// ============================================

/**
 * Carga el catálogo completo desde la API
 */
async function cargarCatalogo() {
    const loadingState = document.getElementById('loading-state');
    const emptyState = document.getElementById('empty-state');
    const menuContainer = document.getElementById('menu-container');

    try {
        loadingState.style.display = 'block';
        emptyState.style.display = 'none';

        const response = await fetch('/api/public/catalogo');

        if (!response.ok) {
            throw new Error('Error al cargar el catálogo');
        }

        catalogoData = await response.json();
        console.log('📦 Catálogo cargado:', catalogoData);

        // Actualizar enlace de WhatsApp en footer
        if (catalogoData.numeroWhatsApp) {
            const whatsappLink = document.getElementById('whatsapp-link');
            if (whatsappLink) {
                whatsappLink.href = `https://wa.me/${catalogoData.numeroWhatsApp}`;
            }
        }

        // Renderizar el menú
        renderMenu();

    } catch (error) {
        console.error('❌ Error al cargar catálogo:', error);
        loadingState.style.display = 'none';
        emptyState.style.display = 'block';
        emptyState.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <p>Error al cargar el menú. Por favor, intenta recargar la página.</p>
        `;
    } finally {
        loadingState.style.display = 'none';
    }
}

// ============================================
// RENDERIZADO DEL MENÚ
// ============================================

/**
 * Renderiza dinámicamente todas las tarjetas de productos
 */
function renderMenu() {
    const menuContainer = document.getElementById('menu-container');
    const emptyState = document.getElementById('empty-state');

    // Filtrar solo productos disponibles
    const productosDisponibles = catalogoData.productos?.filter(p => p.disponible) || [];

    if (productosDisponibles.length === 0) {
        emptyState.style.display = 'block';
        emptyState.innerHTML = `
            <i class="fas fa-ice-cream"></i>
            <p>No hay productos disponibles en este momento. ¡Vuelve pronto!</p>
        `;
        return;
    }

    emptyState.style.display = 'none';

    // Limpiar contenedor
    menuContainer.innerHTML = '';

    // Renderizar cada producto
    productosDisponibles.forEach(producto => {
        const productCard = crearProductCard(producto);
        menuContainer.appendChild(productCard);
    });

    // Añadir event listeners a los formularios
    attachFormListeners();
}

/**
 * Crea una tarjeta de producto con su formulario
 */
function crearProductCard(producto) {
    const card = document.createElement('div');
    card.className = 'product-card';

    // Obtener tamaños del producto
    const tamanios = producto.tamanios || [];

    // Crear el HTML de la tarjeta
    card.innerHTML = `
        <div class="product-image">
            ${producto.imagenUrl ?
                `<img src="${producto.imagenUrl}" alt="${producto.nombre}">` :
                '🍓'
            }
        </div>
        <div class="product-info">
            <div class="product-header">
                <h3 class="product-title">${producto.nombre}</h3>
                <span class="product-badge ${producto.tipoCrema === 'CAFE' ? 'cafe' : producto.tipoCrema === 'MIXTA' ? 'mixta' : ''}">${producto.tipoCrema}</span>
            </div>
            ${producto.descripcion ? `<p class="product-description">${producto.descripcion}</p>` : ''}

            <form class="product-form" data-producto-id="${producto.id}" data-producto-nombre="${producto.nombre}">
                ${crearSeccionTamanios(tamanios)}
                ${crearSeccionToppings()}
                ${crearSeccionJaleas()}
                ${crearSeccionAdicionales()}

                <button type="submit" class="submit-button">
                    <i class="fas fa-shopping-cart"></i>
                    Añadir al Carrito
                </button>
            </form>
        </div>
    `;

    return card;
}

/**
 * Crea la sección de selección de tamaños
 */
function crearSeccionTamanios(tamanios) {
    if (!tamanios || tamanios.length === 0) {
        return `
            <div class="form-section">
                <div class="form-label">
                    <i class="fas fa-exclamation-triangle"></i>
                    No hay tamaños disponibles
                </div>
            </div>
        `;
    }

    return `
        <div class="form-section">
            <div class="form-label">
                <i class="fas fa-ruler"></i>
                Tamaño <span class="required">*</span>
            </div>
            <div class="form-options">
                ${tamanios.map((tamanio, index) => `
                    <div class="form-option">
                        <input
                            type="radio"
                            id="tamanio-${tamanio.id}"
                            name="tamanio"
                            value="${tamanio.id}"
                            data-precio="${tamanio.precioBase}"
                            data-toppings-incluidos="${tamanio.toppingsIncluidos}"
                            data-jaleas-incluidas="${tamanio.jaleasIncluidas}"
                            data-nombre="${tamanio.nombre}"
                            ${index === 0 ? 'required' : ''}
                        >
                        <label for="tamanio-${tamanio.id}">
                            <span>${tamanio.nombre}</span>
                            <span class="option-price">S/ ${tamanio.precioBase.toFixed(2)}</span>
                        </label>
                    </div>
                    <div class="option-info">
                        Incluye: ${tamanio.toppingsIncluidos} topping(s) y ${tamanio.jaleasIncluidas} jalea(s)
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

/**
 * Crea la sección de selección de toppings
 */
function crearSeccionToppings() {
    const toppings = catalogoData.toppings?.filter(t => t.disponible) || [];

    if (toppings.length === 0) return '';

    return `
        <div class="form-section">
            <div class="form-label">
                <i class="fas fa-cookie-bite"></i>
                Toppings
            </div>
            <div class="form-options">
                ${toppings.map(topping => `
                    <div class="form-option">
                        <input
                            type="checkbox"
                            id="topping-${topping.id}"
                            name="toppings"
                            value="${topping.id}"
                            data-nombre="${topping.nombre}"
                        >
                        <label for="topping-${topping.id}">
                            <span>${topping.nombre}</span>
                        </label>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

/**
 * Crea la sección de selección de jaleas
 */
function crearSeccionJaleas() {
    const jaleas = catalogoData.jaleas?.filter(j => j.disponible) || [];

    if (jaleas.length === 0) return '';

    return `
        <div class="form-section">
            <div class="form-label">
                <i class="fas fa-jar"></i>
                Jaleas
            </div>
            <div class="form-options">
                ${jaleas.map(jalea => `
                    <div class="form-option">
                        <input
                            type="checkbox"
                            id="jalea-${jalea.id}"
                            name="jaleas"
                            value="${jalea.id}"
                            data-nombre="${jalea.nombre}"
                        >
                        <label for="jalea-${jalea.id}">
                            <span>${jalea.nombre}</span>
                        </label>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

/**
 * Crea la sección de adicionales especiales
 */
function crearSeccionAdicionales() {
    const adicionales = catalogoData.adicionales?.filter(a => a.disponible) || [];

    if (adicionales.length === 0) return '';

    return `
        <div class="form-section">
            <div class="form-label">
                <i class="fas fa-plus-circle"></i>
                Extras Especiales
            </div>
            <div class="form-options">
                ${adicionales.map(adicional => `
                    <div class="form-option">
                        <input
                            type="checkbox"
                            id="adicional-${adicional.id}"
                            name="adicionales"
                            value="${adicional.id}"
                            data-nombre="${adicional.nombre}"
                            data-precio="${adicional.precio}"
                        >
                        <label for="adicional-${adicional.id}">
                            <span>${adicional.nombre}</span>
                            <span class="option-price">+ S/ ${adicional.precio.toFixed(2)}</span>
                        </label>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// ============================================
// MANEJO DEL CARRITO
// ============================================

/**
 * Añade event listeners a todos los formularios de productos
 */
function attachFormListeners() {
    const forms = document.querySelectorAll('.product-form');
    forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmit);

        // Agregar listeners para restricciones de tamaño
        setupSizeRestrictions(form);
    });
}

/**
 * Configura las restricciones de selección basadas en el tamaño
 */
function setupSizeRestrictions(form) {
    const tamanioInputs = form.querySelectorAll('input[name="tamanio"]');
    const toppingsInputs = form.querySelectorAll('input[name="toppings"]');
    const jaleasInputs = form.querySelectorAll('input[name="jaleas"]');

    // Event listener cuando se cambia el tamaño
    tamanioInputs.forEach(tamanioInput => {
        tamanioInput.addEventListener('change', () => {
            const maxToppings = parseInt(tamanioInput.dataset.toppingsIncluidos);
            const maxJaleas = parseInt(tamanioInput.dataset.jaleasIncluidas);

            // Actualizar restricciones de toppings
            updateSelectionRestrictions(form, toppingsInputs, maxToppings, 'toppings');

            // Actualizar restricciones de jaleas
            updateSelectionRestrictions(form, jaleasInputs, maxJaleas, 'jaleas');

            // Mostrar mensaje informativo
            showSizeInfo(form, maxToppings, maxJaleas);
        });

        // Si es el tamaño por defecto seleccionado, activar restricciones
        if (tamanioInput.checked) {
            tamanioInput.dispatchEvent(new Event('change'));
        }
    });

    // Event listeners en checkboxes para validar en tiempo real
    toppingsInputs.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const tamanioSelected = form.querySelector('input[name="tamanio"]:checked');
            if (tamanioSelected) {
                const maxToppings = parseInt(tamanioSelected.dataset.toppingsIncluidos);
                validateCheckboxLimit(form, toppingsInputs, maxToppings, checkbox, 'toppings');
            }
        });
    });

    jaleasInputs.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const tamanioSelected = form.querySelector('input[name="tamanio"]:checked');
            if (tamanioSelected) {
                const maxJaleas = parseInt(tamanioSelected.dataset.jaleasIncluidas);
                validateCheckboxLimit(form, jaleasInputs, maxJaleas, checkbox, 'jaleas');
            }
        });
    });
}

/**
 * Actualiza las restricciones de selección
 */
function updateSelectionRestrictions(form, checkboxes, maxAllowed, type) {
    // Resetear todos los checkboxes
    checkboxes.forEach(cb => {
        cb.disabled = false;
        cb.parentElement.style.opacity = '1';
    });

    // Si ya hay selecciones, verificar límite
    const selectedCount = form.querySelectorAll(`input[name="${type}"]:checked`).length;
    if (selectedCount >= maxAllowed) {
        // Deshabilitar los no seleccionados
        checkboxes.forEach(cb => {
            if (!cb.checked) {
                cb.disabled = true;
                cb.parentElement.style.opacity = '0.5';
            }
        });
    }
}

/**
 * Valida el límite de checkboxes al hacer cambios
 */
function validateCheckboxLimit(form, checkboxes, maxAllowed, currentCheckbox, type) {
    const selectedCount = form.querySelectorAll(`input[name="${type}"]:checked`).length;

    if (selectedCount > maxAllowed) {
        // Desmarcar el último checkbox marcado
        currentCheckbox.checked = false;

        // Mostrar mensaje
        const typeName = type === 'toppings' ? 'toppings' : 'jaleas';
        showToast(`Solo puedes seleccionar hasta ${maxAllowed} ${typeName} con este tamaño`, 'warning');
        return false;
    }

    // Actualizar restricciones
    updateSelectionRestrictions(form, checkboxes, maxAllowed, type);
    return true;
}

/**
 * Muestra información del tamaño seleccionado
 */
function showSizeInfo(form, maxToppings, maxJaleas) {
    // Buscar si ya existe un mensaje de info
    let infoDiv = form.querySelector('.size-restrictions-info');

    if (!infoDiv) {
        // Crear div de información
        infoDiv = document.createElement('div');
        infoDiv.className = 'size-restrictions-info';
        infoDiv.style.cssText = `
            background: #E3F2FD;
            border: 1px solid #2196F3;
            border-radius: 8px;
            padding: 12px;
            margin: 12px 0;
            font-size: 14px;
            color: #1976D2;
        `;

        // Insertar después de la sección de tamaños
        const tamanioSection = form.querySelector('.form-section');
        if (tamanioSection && tamanioSection.nextSibling) {
            tamanioSection.parentNode.insertBefore(infoDiv, tamanioSection.nextSibling);
        }
    }

    infoDiv.innerHTML = `
        <i class="fas fa-info-circle"></i>
        <strong>Con este tamaño puedes elegir:</strong><br>
        • Hasta ${maxToppings} topping${maxToppings !== 1 ? 's' : ''}<br>
        • Hasta ${maxJaleas} jalea${maxJaleas !== 1 ? 's' : ''}
    `;
}

/**
 * Muestra un mensaje toast temporal
 */
function showToast(message, type = 'info') {
    // Remover toast anterior si existe
    const existingToast = document.querySelector('.toast-message');
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'warning' ? '#FF9800' : '#4CAF50'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        font-size: 14px;
        max-width: 300px;
        animation: slideIn 0.3s ease-out;
    `;
    toast.textContent = message;

    document.body.appendChild(toast);

    // Remover después de 3 segundos
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/**
 * Maneja el submit del formulario de producto
 */
function handleFormSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const productoNombre = form.dataset.productoNombre;

    // Obtener tamaño seleccionado
    const tamanioInput = form.querySelector('input[name="tamanio"]:checked');
    if (!tamanioInput) {
        alert('Por favor, selecciona un tamaño');
        return;
    }

    const tamanio = {
        nombre: tamanioInput.dataset.nombre,
        precio: parseFloat(tamanioInput.dataset.precio),
        toppingsIncluidos: parseInt(tamanioInput.dataset.toppingsIncluidos),
        jaleasIncluidas: parseInt(tamanioInput.dataset.jaleasIncluidas)
    };

    // Obtener toppings seleccionados
    const toppingsInputs = form.querySelectorAll('input[name="toppings"]:checked');
    const toppings = Array.from(toppingsInputs).map(input => input.dataset.nombre);

    // Validar cantidad de toppings
    if (toppings.length > tamanio.toppingsIncluidos) {
        showToast(`Solo puedes seleccionar hasta ${tamanio.toppingsIncluidos} toppings con el tamaño ${tamanio.nombre}`, 'warning');
        return;
    }

    // Obtener jaleas seleccionadas
    const jaleasInputs = form.querySelectorAll('input[name="jaleas"]:checked');
    const jaleas = Array.from(jaleasInputs).map(input => input.dataset.nombre);

    // Validar cantidad de jaleas
    if (jaleas.length > tamanio.jaleasIncluidas) {
        showToast(`Solo puedes seleccionar hasta ${tamanio.jaleasIncluidas} jaleas con el tamaño ${tamanio.nombre}`, 'warning');
        return;
    }

    // Obtener adicionales seleccionados
    const adicionalesInputs = form.querySelectorAll('input[name="adicionales"]:checked');
    const adicionales = Array.from(adicionalesInputs).map(input => ({
        nombre: input.dataset.nombre,
        precio: parseFloat(input.dataset.precio)
    }));

    // Calcular precio total
    const precioTotal = calcularPrecioTotal(tamanio, toppings.length, jaleas.length, adicionales);

    // Crear item del carrito
    const cartItem = {
        id: Date.now(), // ID único basado en timestamp
        productoNombre,
        tamanio: tamanio.nombre,
        toppings,
        jaleas,
        adicionales,
        precioTotal
    };

    // Añadir al carrito
    cart.push(cartItem);
    console.log('🛒 Item añadido al carrito:', cartItem);

    // Actualizar UI
    updateCartUI();

    // Limpiar formulario
    form.reset();

    // Mostrar feedback
    showToast('¡Producto añadido al carrito!');
}

/**
 * Calcula el precio total considerando toppings/jaleas incluidos
 */
function calcularPrecioTotal(tamanio, numToppings, numJaleas, adicionales) {
    let total = tamanio.precio;

    // Calcular exceso de toppings
    const excesoToppings = Math.max(0, numToppings - tamanio.toppingsIncluidos);
    if (excesoToppings > 0) {
        const adicionalTopping = catalogoData.adicionales?.find(a => a.nombre.toLowerCase().includes('topping'));
        if (adicionalTopping) {
            total += excesoToppings * adicionalTopping.precio;
        }
    }

    // Calcular exceso de jaleas
    const excesoJaleas = Math.max(0, numJaleas - tamanio.jaleasIncluidas);
    if (excesoJaleas > 0) {
        const adicionalJalea = catalogoData.adicionales?.find(a => a.nombre.toLowerCase().includes('jalea'));
        if (adicionalJalea) {
            total += excesoJaleas * adicionalJalea.precio;
        }
    }

    // Sumar adicionales especiales
    adicionales.forEach(adicional => {
        total += adicional.precio;
    });

    return total;
}

/**
 * Actualiza la UI del carrito (contador, modal)
 */
function updateCartUI() {
    // Actualizar contador
    const cartCount = document.getElementById('cart-count');
    cartCount.textContent = cart.length;

    // Actualizar contenido del modal
    updateCartModal();

    // Habilitar/deshabilitar botón de confirmar
    const confirmButton = document.getElementById('confirm-order-btn');
    confirmButton.disabled = cart.length === 0;
}

/**
 * Actualiza el contenido del modal del carrito
 */
function updateCartModal() {
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotal = document.getElementById('cart-total');

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-basket"></i>
                <p>Tu carrito está vacío</p>
            </div>
        `;
        cartTotal.textContent = 'S/ 0.00';
        return;
    }

    // Renderizar items del carrito
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <div class="cart-item-title">${item.productoNombre} - ${item.tamanio}</div>
                <div class="cart-item-details">
                    ${item.toppings.length > 0 ? `🍪 ${item.toppings.join(', ')}<br>` : ''}
                    ${item.jaleas.length > 0 ? `🍯 ${item.jaleas.join(', ')}<br>` : ''}
                    ${item.adicionales.length > 0 ? `➕ ${item.adicionales.map(a => a.nombre).join(', ')}` : ''}
                </div>
            </div>
            <div class="cart-item-price">S/ ${item.precioTotal.toFixed(2)}</div>
            <button class="cart-item-remove" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');

    // Calcular y mostrar total
    const total = cart.reduce((sum, item) => sum + item.precioTotal, 0);
    cartTotal.textContent = `S/ ${total.toFixed(2)}`;
}

/**
 * Elimina un item del carrito
 */
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    console.log('🗑️ Item eliminado del carrito');
    updateCartUI();
}

// ============================================
// MODAL DEL CARRITO
// ============================================

/**
 * Configura los event listeners principales
 */
function setupEventListeners() {
    // Botón del carrito
    const cartIcon = document.getElementById('cart-icon');
    cartIcon.addEventListener('click', openCartModal);

    // Cerrar modal
    const modalClose = document.getElementById('modal-close');
    const modalOverlay = document.getElementById('modal-overlay');
    const continueShopping = document.getElementById('continue-shopping');

    modalClose.addEventListener('click', closeCartModal);
    modalOverlay.addEventListener('click', closeCartModal);
    continueShopping.addEventListener('click', closeCartModal);

    // Confirmar pedido
    const confirmOrderBtn = document.getElementById('confirm-order-btn');
    confirmOrderBtn.addEventListener('click', sendOrderToWhatsApp);
}

/**
 * Abre el modal del carrito
 */
function openCartModal() {
    const modal = document.getElementById('cart-modal');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

/**
 * Cierra el modal del carrito
 */
function closeCartModal() {
    const modal = document.getElementById('cart-modal');
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

// ============================================
// WHATSAPP
// ============================================

/**
 * Genera y envía el pedido por WhatsApp
 */
function sendOrderToWhatsApp() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }

    if (!catalogoData.numeroWhatsApp) {
        alert('No se ha configurado el número de WhatsApp');
        return;
    }

    // Generar mensaje
    let mensaje = '🍓 *NUEVO PEDIDO - DELIBOON* 🍓\n\n';

    cart.forEach((item, index) => {
        mensaje += `*${index + 1}. ${item.productoNombre}*\n`;
        mensaje += `   Tamaño: ${item.tamanio}\n`;

        if (item.toppings.length > 0) {
            mensaje += `   🍪 Toppings: ${item.toppings.join(', ')}\n`;
        }

        if (item.jaleas.length > 0) {
            mensaje += `   🍯 Jaleas: ${item.jaleas.join(', ')}\n`;
        }

        if (item.adicionales.length > 0) {
            mensaje += `   ➕ Extras: ${item.adicionales.map(a => a.nombre).join(', ')}\n`;
        }

        mensaje += `   💰 Precio: S/ ${item.precioTotal.toFixed(2)}\n\n`;
    });

    const total = cart.reduce((sum, item) => sum + item.precioTotal, 0);
    mensaje += `━━━━━━━━━━━━━━━━━━━━\n`;
    mensaje += `*TOTAL: S/ ${total.toFixed(2)}*\n`;
    mensaje += `━━━━━━━━━━━━━━━━━━━━`;

    // Codificar mensaje para URL
    const mensajeCodificado = encodeURIComponent(mensaje);

    // Crear URL de WhatsApp
    const whatsappURL = `https://wa.me/${catalogoData.numeroWhatsApp}?text=${mensajeCodificado}`;

    // Abrir WhatsApp
    window.open(whatsappURL, '_blank');

    // Limpiar carrito después de enviar
    cart = [];
    updateCartUI();
    closeCartModal();

    console.log('📱 Pedido enviado por WhatsApp');
}

// ============================================
// UTILIDADES
// ============================================

/**
 * Muestra un toast de notificación
 */
function showToast(message) {
    // Crear elemento toast
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        font-weight: 600;
        animation: slideIn 0.3s ease;
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    toast.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(toast);

    // Eliminar después de 3 segundos
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Exportar funciones globales para usar en HTML inline
window.removeFromCart = removeFromCart;

// ============================================
// ESTILOS DE ANIMACIÓN PARA TOAST
// ============================================

// Agregar estilos de animación dinámicamente
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

console.log('✅ Script.js cargado completamente');
