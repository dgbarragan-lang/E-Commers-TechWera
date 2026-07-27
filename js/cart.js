const cartElements = {
  cartItems: document.getElementById('cart-items'),
  cartSubtotal: document.getElementById('cartSubtotal'),
  cartTax: document.getElementById('cartTax'),
  cartTotal: document.getElementById('cartTotal'),
  cartCheckout: document.getElementById('cartCheckout')
};

const getCart = () => {
  const stored = localStorage.getItem('techwear_carrito');
  return stored ? JSON.parse(stored) : [];
};

const getProducts = () => {
  const stored = localStorage.getItem('techwear_productos');
  return stored ? JSON.parse(stored) : [];
};

const getCategories = () => {
  const stored = localStorage.getItem('techwear_categorias');
  return stored ? JSON.parse(stored) : [];
};

const getLoggedUser = () => {
  const stored = localStorage.getItem('techwear_logged_user');
  return stored ? JSON.parse(stored) : null;
};

const mapCategoryName = (categoriaId) => {
  const categorias = getCategories();
  const categoria = categorias.find((cat) => cat.id === Number(categoriaId));
  return categoria ? categoria.nombre : 'Sin categoría';
};

const findProduct = (id) => getProducts().find((product) => product.id === Number(id));

const normalizeImagePath = (path) => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('/') || path.startsWith('./') || path.startsWith('../')) {
    return path;
  }
  return `../${path}`;
};

const calculateCartSummary = (cartItems) => {
  const subtotal = cartItems.reduce((sum, item) => {
    const product = findProduct(item.productId);
    return sum + (product ? product.precio * item.quantity : 0);
  }, 0);

  const tax = subtotal * 0.1;
  const total = subtotal + tax;
  return { subtotal, tax, total };
};

const renderCart = () => {
  const cart = getCart();
  const products = getProducts();

  if (!cart.length) {
    cartElements.cartItems.innerHTML = '<p class="empty-cart-message">No hay productos en el carrito. Agrega algo desde la tienda.</p>';
    cartElements.cartSubtotal.textContent = '$0.00';
    cartElements.cartTax.textContent = '$0.00';
    cartElements.cartTotal.textContent = '$0.00';
    return;
  }

  const cartHtml = cart.map((item) => {
    const product = products.find((p) => p.id === Number(item.productId));
    if (!product) return '';
    return `
      <article class="cart-product" data-id="${product.id}">
        <div>
          <img src="${normalizeImagePath(product.imagen)}" alt="${product.nombre}" />
        </div>
        <div>
          <h3>${product.nombre}</h3>
          <p>${mapCategoryName(product.categoriaId)}</p>
          <p>$${product.precio.toFixed(2)}</p>
          <button class="btn-link btn-remove" data-id="${product.id}">Eliminar</button>
        </div>
        <div aria-label="Cantidad" class="quantity-control">
          <button class="btn-quantity btn-decrease" data-id="${product.id}">-</button>
          <span>${item.quantity}</span>
          <button class="btn-quantity btn-increase" data-id="${product.id}">+</button>
        </div>
      </article>
    `;
  }).join('');

  cartElements.cartItems.innerHTML = cartHtml;

  const summary = calculateCartSummary(cart);
  cartElements.cartSubtotal.textContent = `$${summary.subtotal.toFixed(2)}`;
  cartElements.cartTax.textContent = `$${summary.tax.toFixed(2)}`;
  cartElements.cartTotal.textContent = `$${summary.total.toFixed(2)}`;
};

const saveCartItems = (cart) => {
  localStorage.setItem('techwear_carrito', JSON.stringify(cart));
};

const changeQuantity = (productId, delta) => {
  const cart = getCart();
  const item = cart.find((entry) => entry.productId === Number(productId));
  const product = findProduct(productId);
  if (!item || !product) return;

  const products = getProducts();
  const prodIndex = products.findIndex((p) => p.id === Number(productId));
  if (prodIndex === -1) return;

  // Increase quantity
  if (delta > 0) {
    if (products[prodIndex].stock < delta) {
      Swal.fire({ icon: 'warning', title: 'Cantidad no disponible', text: `Solo hay ${products[prodIndex].stock} unidad(es) disponibles de ${products[prodIndex].nombre}.` });
      return;
    }
    item.quantity = item.quantity + delta;
    products[prodIndex].stock = products[prodIndex].stock - delta;
  } else if (delta < 0) {
    // Decrease quantity
    const newQty = Math.max(0, item.quantity + delta);
    const returned = item.quantity - newQty; // unidades que vuelven al stock
    item.quantity = newQty;
    products[prodIndex].stock = products[prodIndex].stock + returned;
    // Si la cantidad llega a 0, eliminar el item del carrito
    if (item.quantity === 0) {
      const filtered = cart.filter((c) => c.productId !== Number(productId));
      saveCartItems(filtered);
      localStorage.setItem('techwear_productos', JSON.stringify(products));
      renderCart();
      return;
    }
  }

  // Persist cambios en productos y carrito
  localStorage.setItem('techwear_productos', JSON.stringify(products));
  saveCartItems(cart);
  renderCart();
};

const removeCartItem = (productId) => {
  const cart = getCart();
  const item = cart.find((c) => c.productId === Number(productId));
  if (!item) return;

  // Restablecer stock en productos
  const products = getProducts();
  const prodIndex = products.findIndex((p) => p.id === Number(productId));
  if (prodIndex !== -1) {
    products[prodIndex].stock = products[prodIndex].stock + item.quantity;
    localStorage.setItem('techwear_productos', JSON.stringify(products));
  }

  const filtered = cart.filter((i) => i.productId !== Number(productId));
  saveCartItems(filtered);
  renderCart();
};

const handleCartClick = (event) => {
  const decrease = event.target.closest('.btn-decrease');
  const increase = event.target.closest('.btn-increase');
  const removeButton = event.target.closest('.btn-remove');

  if (decrease) {
    changeQuantity(decrease.dataset.id, -1);
    return;
  }

  if (increase) {
    changeQuantity(increase.dataset.id, 1);
    return;
  }

  if (removeButton) {
    removeCartItem(removeButton.dataset.id);
    return;
  }
};

const initCartPage = () => {
  const itemsSection = document.getElementById('cart-items');
  if (!itemsSection) return;

  itemsSection.addEventListener('click', handleCartClick);
  cartElements.cartCheckout.addEventListener('click', async () => {
    const cart = getCart();
    if (!cart.length) {
      Swal.fire({ icon: 'info', title: 'Carrito vacío', text: 'Agrega productos antes de proceder al pago.' });
      return;
    }

    const user = getLoggedUser();
    if (!user) {
      const loginResult = await Swal.fire({
        title: 'Necesitas iniciar sesión',
        html: 'Para realizar la compra debes iniciar sesión. ¿Deseas ir a la página de ingreso?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ir a iniciar sesión',
        cancelButtonText: 'Cancelar'
      });

      if (loginResult.isConfirmed) {
        window.location.href = 'login.html';
      }
      return;
    }

    const summary = calculateCartSummary(cart);
    const result = await Swal.fire({
      title: 'Confirmar compra',
      html: `Total a pagar: <strong>$${summary.total.toFixed(2)}</strong><br/>¿Deseas confirmar tu compra?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, pagar',
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;

    saveCartItems([]);
    renderCart();
    Toastify({
      text: 'Compra realizada con éxito. Gracias por tu compra.',
      duration: 3500,
      gravity: 'top',
      position: 'right',
      backgroundColor: '#16a34a'
    }).showToast();
  });
};

if (document.querySelector('#cart-items')) {
  document.addEventListener('DOMContentLoaded', () => {
    initCartPage();
    renderCart();
  });
}
