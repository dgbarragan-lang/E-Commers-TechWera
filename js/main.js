const DATA_VERSION = 3;

const STORAGE_KEYS = {
  productos: 'techwear_productos',
  categorias: 'techwear_categorias',
  usuarios: 'techwear_usuarios',
  paises: 'techwear_paises',
  cart: 'techwear_carrito',
  dataVersion: 'techwear_data_version'
};

const selectors = {
  productTableBody: document.getElementById('productTableBody'),
  searchInput: document.getElementById('searchInput'),
  categoryFilter: document.getElementById('categoryFilter'),
  stockFilter: document.getElementById('stockFilter'),
  sortSelect: document.getElementById('sortSelect'),
  resultCount: document.getElementById('resultCount'),
  productStats: document.getElementById('product-stats'),
  btnToggleForm: document.getElementById('btn-toggle-form'),
  btnResetData: document.getElementById('btn-reset-data'),
  productFormSection: document.getElementById('product-form-section'),
  productForm: document.getElementById('productForm'),
  productFormTitle: document.getElementById('product-form-title'),
  btnCancelProduct: document.getElementById('btnCancelProduct'),
  productId: document.getElementById('productId'),
  productName: document.getElementById('productName'),
  productCategory: document.getElementById('productCategory'),
  productPrice: document.getElementById('productPrice'),
  productStock: document.getElementById('productStock'),
  productState: document.getElementById('productState'),
  productDate: document.getElementById('productDate'),
  productDescription: document.getElementById('productDescription'),
  productImage: document.getElementById('productImage')
  ,
  loginLink: document.getElementById('loginLink'),
  logoutLink: document.getElementById('logoutLink')
};

let productos = [];
let categorias = [];
let usuarios = [];
let chart = null;
let chartInstance = null;

const loadJsonFile = async (path) => {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`No se pudo cargar ${path}`);
  return response.json();
};

const syncProductStates = () => {
  productos.forEach((producto) => {
    producto.estado = getProductState(producto);
  });
};

const saveStorage = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const readStorage = (key) => {
  const json = localStorage.getItem(key);
  return json ? JSON.parse(json) : null;
};

const getStoredDataVersion = () => Number(localStorage.getItem(STORAGE_KEYS.dataVersion) || 0);
const setStoredDataVersion = (version) => localStorage.setItem(STORAGE_KEYS.dataVersion, String(version));

const readCart = () => readStorage(STORAGE_KEYS.cart) || [];
const saveCart = (cart) => saveStorage(STORAGE_KEYS.cart, cart);
const getProductById = (productId) => productos.find((item) => item.id === Number(productId));
const getProductState = (producto) => (producto.stock === 0 ? 'agotado' : 'disponible');

const updateCartCount = () => {
  const badge = document.getElementById('cartCount');
  if (!badge) return;
  const cart = readCart();
  const quantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  badge.textContent = quantity;
};

/* ------- Autenticación (UI) ------- */
const getLoggedUser = () => {
  const json = localStorage.getItem('techwear_logged_user');
  return json ? JSON.parse(json) : null;
};

const updateAuthUI = () => {
  const user = getLoggedUser();
  if (user) {
    if (selectors.loginLink) selectors.loginLink.classList.add('d-none');
    if (selectors.logoutLink) {
      selectors.logoutLink.classList.remove('d-none');
      const shortName = (user.nombres || user.email).split(' ')[0];
      selectors.logoutLink.textContent = `Cerrar sesión (${shortName})`;
    }
  } else {
    if (selectors.loginLink) selectors.loginLink.classList.remove('d-none');
    if (selectors.logoutLink) selectors.logoutLink.classList.add('d-none');
  }
};

const logout = () => {
  localStorage.removeItem('techwear_logged_user');
  Toastify({ text: 'Sesión cerrada', duration: 2000, gravity: 'top', position: 'right', backgroundColor: '#2563eb' }).showToast();
  updateAuthUI();
  // Redirigir al login para permitir cambiar de usuario
  window.location.href = 'pages/login.html';
};

const addToCart = (productId, quantity = 1) => {
  const producto = getProductById(productId);
  if (!producto) return;

  // Verifica disponibilidad directa del stock actual
  if (producto.stock < quantity) {
    Swal.fire({
      icon: 'warning',
      title: 'Cantidad no disponible',
      text: `Solo hay ${producto.stock} unidad(es) disponibles de ${producto.nombre}.`
    });
    return;
  }

  const cart = readCart();
  const existingItem = cart.find((item) => item.productId === producto.id);

  // Reducir el stock inmediato del producto y persistir
  producto.stock = producto.stock - quantity;
  producto.estado = getProductState(producto);
  saveStorage(STORAGE_KEYS.productos, productos);

  if (existingItem) {
    existingItem.quantity = existingItem.quantity + quantity;
  } else {
    cart.push({ productId: producto.id, quantity });
  }

  saveCart(cart);
  updateCartCount();
  applyFilters(); // refresca la tabla, estadísticas y gráfico

  Toastify({
    text: `Añadido al carrito: ${producto.nombre}`,
    duration: 3000,
    gravity: 'top',
    position: 'right',
    className: 'floating-toast',
    backgroundColor: '#16a34a'
  }).showToast();
};

const initializeStorage = async () => {
  try {
    const storedProductos = readStorage(STORAGE_KEYS.productos);
    const storedCategorias = readStorage(STORAGE_KEYS.categorias);
    const storedUsuarios = readStorage(STORAGE_KEYS.usuarios);
    const storedVersion = getStoredDataVersion();
    if (storedCategorias && storedProductos && storedVersion === DATA_VERSION) {
      categorias = storedCategorias;
      productos = storedProductos;
      syncProductStates();
      usuarios = storedUsuarios || [];
      if (!storedUsuarios) {
        const defaultUsuarios = await loadJsonFile('json/usuarios.json');
        usuarios = defaultUsuarios.map((user) => ({ ...user, password: '123456' }));
        saveStorage(STORAGE_KEYS.usuarios, usuarios);
      }
      return;
    }

    categorias = await loadJsonFile('json/categorias.json');
    productos = await loadJsonFile('json/productos.json');
    usuarios = await loadJsonFile('json/usuarios.json');
    syncProductStates();
    usuarios = usuarios.map((user) => ({ ...user, password: user.password || '123456' }));
    saveStorage(STORAGE_KEYS.categorias, categorias);
    saveStorage(STORAGE_KEYS.productos, productos);
    saveStorage(STORAGE_KEYS.usuarios, usuarios);
    setStoredDataVersion(DATA_VERSION);
  } catch (error) {
    console.error(error);
    Toastify({
      text: `Error al cargar datos: ${error.message}`,
      duration: 6000,
      gravity: 'top',
      position: 'right',
      backgroundColor: '#dc2626'
    }).showToast();
  }
};

const mapCategoryName = (categoriaId) => {
  const categoria = categorias.find((cat) => cat.id === Number(categoriaId));
  return categoria ? categoria.nombre : 'Sin categoría';
};

const getBadgeClass = (categoriaName) => {
  const name = categoriaName.toLowerCase();
  if (name.includes('portátiles')) return 'badge-cat--laptop';
  if (name.includes('monitores')) return 'badge-cat--monitor';
  if (name.includes('accesorios')) return 'badge-cat--acc';
  if (name.includes('audio')) return 'badge-cat--audio';
  return 'badge-cat--other';
};

const renderProducts = (items) => {
  selectors.productTableBody.innerHTML = '';
  if (!items.length) {
    selectors.productTableBody.innerHTML = '<tr><td colspan="7">No se encontraron productos con ese criterio.</td></tr>';
    selectors.resultCount.textContent = '0 productos';
    return;
  }

  selectors.resultCount.textContent = `${items.length} productos`;
  items.forEach((producto) => {
    const categoryName = mapCategoryName(producto.categoriaId);
    const badgeClass = getBadgeClass(categoryName);
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><img src="${producto.imagen}" alt="${producto.nombre}" /></td>
      <td>${producto.nombre}</td>
      <td><span class="badge-cat ${badgeClass}">${categoryName}</span></td>
      <td class="fw-bold text-price">$${producto.precio.toFixed(2)}</td>
      <td>${producto.stock}</td>
      <td>${getProductState(producto)}</td>
      <td class="actions-cell">
        <button class="btn-sm-table btn-primary btn-add-cart" data-id="${producto.id}">Comprar</button>
        <button class="btn-sm-table btn-primary btn-edit" data-id="${producto.id}">Editar</button>
        <button class="btn-sm-table btn-secondary btn-delete" data-id="${producto.id}">Eliminar</button>
      </td>
    `;
    selectors.productTableBody.appendChild(row);
  });
};

const setCategoryOptions = () => {
  selectors.categoryFilter.innerHTML = '<option value="all">Todas las categorías</option>';
  selectors.productCategory.innerHTML = '<option value="">Seleccione categoría</option>';

  categorias.forEach((categoria) => {
    const option = `<option value="${categoria.id}">${categoria.nombre}</option>`;
    selectors.categoryFilter.insertAdjacentHTML('beforeend', option);
    selectors.productCategory.insertAdjacentHTML('beforeend', option);
  });
};

const applyFilters = () => {
  const searchTerm = selectors.searchInput.value.trim().toLowerCase();
  const categoryValue = selectors.categoryFilter.value;
  const stockValue = selectors.stockFilter.value;
  const sortValue = selectors.sortSelect.value;

  let filtered = [...productos];

  if (categoryValue !== 'all') {
    filtered = filtered.filter((item) => String(item.categoriaId) === categoryValue);
  }

  if (stockValue !== 'all') {
    filtered = filtered.filter((item) => getProductState(item) === stockValue);
  }

  if (searchTerm) {
    filtered = filtered.filter((item) => {
      const categoryName = mapCategoryName(item.categoriaId).toLowerCase();
      return (
        item.nombre.toLowerCase().includes(searchTerm) ||
        item.descripcion.toLowerCase().includes(searchTerm) ||
        categoryName.includes(searchTerm)
      );
    });
  }

  if (sortValue === 'priceAsc') filtered.sort((a, b) => a.precio - b.precio);
  if (sortValue === 'priceDesc') filtered.sort((a, b) => b.precio - a.precio);
  if (sortValue === 'nameAsc') filtered.sort((a, b) => a.nombre.localeCompare(b.nombre));
  if (sortValue === 'nameDesc') filtered.sort((a, b) => b.nombre.localeCompare(a.nombre));
  if (sortValue === 'latest') filtered.sort((a, b) => new Date(b.fechaRegistro) - new Date(a.fechaRegistro));

  renderProducts(filtered);
  renderStats(filtered);
  updateChart(filtered);
};

const renderStats = (items) => {
  const total = items.length;
  const disponibles = items.filter((item) => getProductState(item) === 'disponible').length;
  const agotados = items.filter((item) => getProductState(item) === 'agotado').length;
  const precioPromedio = total ? items.reduce((sum, item) => sum + item.precio, 0) / total : 0;
  const mayorPrecio = total ? Math.max(...items.map((item) => item.precio)) : 0;
  const menorPrecio = total ? Math.min(...items.map((item) => item.precio)) : 0;

  selectors.productStats.innerHTML = `
    <div class="stat-card">
      <span>Total de productos</span>
      <strong>${total}</strong>
    </div>
    <div class="stat-card">
      <span>Disponibles</span>
      <strong>${disponibles}</strong>
    </div>
    <div class="stat-card">
      <span>Agotados</span>
      <strong>${agotados}</strong>
    </div>
    <div class="stat-card">
      <span>Precio promedio</span>
      <strong>$${precioPromedio.toFixed(2)}</strong>
    </div>
    <div class="stat-card">
      <span>Mayor precio</span>
      <strong>$${mayorPrecio.toFixed(2)}</strong>
    </div>
    <div class="stat-card">
      <span>Menor precio</span>
      <strong>$${menorPrecio.toFixed(2)}</strong>
    </div>
  `;
};

const buildCategoryChart = (items) => {
  const counts = categorias.map((categoria) => ({
    label: categoria.nombre,
    value: items.filter((item) => item.categoriaId === categoria.id).length
  }));

  const labels = counts.map((item) => item.label);
  const data = counts.map((item) => item.value);

  if (chartInstance) chartInstance.destroy();

  const ctx = document.getElementById('categoryChart').getContext('2d');
  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Productos por categoría',
        data,
        backgroundColor: 'rgba(59, 130, 246, 0.65)'
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true, ticks: { stepSize: 1 } }
      }
    }
  });
};

const updateChart = (items) => {
  if (!chartInstance) return buildCategoryChart(productos);
  const counts = categorias.map((categoria) => items.filter((item) => item.categoriaId === categoria.id).length);
  chartInstance.data.datasets[0].data = counts;
  chartInstance.update();
};

const resetForm = () => {
  selectors.productForm.reset();
  selectors.productId.value = '';
  selectors.productDate.valueAsDate = new Date();
  selectors.productFormTitle.textContent = 'Agregar nuevo producto';
};

const openForm = () => {
  selectors.productFormSection.classList.remove('d-none');
  selectors.productFormTitle.textContent = 'Agregar nuevo producto';
  resetForm();
};

const closeForm = () => {
  selectors.productFormSection.classList.add('d-none');
  resetForm();
};

const fillForm = (producto) => {
  selectors.productId.value = producto.id;
  selectors.productName.value = producto.nombre;
  selectors.productCategory.value = producto.categoriaId;
  selectors.productPrice.value = producto.precio;
  selectors.productStock.value = producto.stock;
  selectors.productState.value = producto.estado;
  selectors.productDate.value = producto.fechaRegistro;
  selectors.productDescription.value = producto.descripcion;
  selectors.productImage.value = producto.imagen;
  selectors.productFormTitle.textContent = 'Editar producto';
  selectors.productFormSection.classList.remove('d-none');
};

const deleteProduct = async (productId) => {
  const producto = productos.find((item) => item.id === Number(productId));
  if (!producto) return;

  const result = await Swal.fire({
    title: '¿Eliminar producto?',
    text: `¿Deseas eliminar ${producto.nombre}? Esta acción no se puede deshacer.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  });

  if (!result.isConfirmed) return;

  productos = productos.filter((item) => item.id !== Number(productId));
  saveStorage(STORAGE_KEYS.productos, productos);
  applyFilters();
  Toastify({
    text: 'Producto eliminado correctamente',
    duration: 3000,
    gravity: 'top',
    position: 'right',
    backgroundColor: '#16a34a'
  }).showToast();
};

const handleTableClick = (event) => {
  const addCartButton = event.target.closest('.btn-add-cart');
  const editButton = event.target.closest('.btn-edit');
  const deleteButton = event.target.closest('.btn-delete');

  if (addCartButton) {
    addToCart(addCartButton.dataset.id);
    return;
  }

  if (editButton) {
    const id = editButton.dataset.id;
    const producto = productos.find((item) => item.id === Number(id));
    if (producto) fillForm(producto);
    return;
  }

  if (deleteButton) {
    const id = deleteButton.dataset.id;
    deleteProduct(id);
  }
};

const getNextProductId = () => {
  const maxId = productos.reduce((max, item) => Math.max(max, item.id), 0);
  return maxId + 1;
};

const submitProductForm = (event) => {
  event.preventDefault();
  const id = selectors.productId.value;
  const stockValue = Number(selectors.productStock.value);
  const newProduct = {
    id: id ? Number(id) : getNextProductId(),
    nombre: selectors.productName.value.trim(),
    categoriaId: Number(selectors.productCategory.value),
    precio: Number(selectors.productPrice.value),
    stock: stockValue,
    estado: getProductState({ stock: stockValue }),
    fechaRegistro: selectors.productDate.value,
    descripcion: selectors.productDescription.value.trim(),
    imagen: selectors.productImage.value.trim() || 'img/Carrito/mac.jpg'
  };

  if (!newProduct.nombre || !newProduct.descripcion || !newProduct.imagen) {
    Swal.fire({
      icon: 'error',
      title: 'Datos incompletos',
      text: 'Por favor completa todos los campos obligatorios.'
    });
    return;
  }

  newProduct.estado = getProductState(newProduct);

  if (id) {
    productos = productos.map((item) => (item.id === Number(id) ? newProduct : item));
    Toastify({ text: 'Producto actualizado', duration: 3000, gravity: 'top', position: 'right', backgroundColor: '#16a34a' }).showToast();
  } else {
    productos.push(newProduct);
    Toastify({ text: 'Producto agregado', duration: 3000, gravity: 'top', position: 'right', backgroundColor: '#16a34a' }).showToast();
  }

  saveStorage(STORAGE_KEYS.productos, productos);
  applyFilters();
  closeForm();
};

const restoreData = async () => {
  const result = await Swal.fire({
    title: 'Restaurar datos iniciales',
    text: 'Esto reemplazará los datos actuales almacenados en localStorage.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Restaurar',
    cancelButtonText: 'Cancelar'
  });

  if (!result.isConfirmed) return;

  const originalProductos = await loadJsonFile('json/productos.json');
  productos = originalProductos;
  saveStorage(STORAGE_KEYS.productos, productos);
  setStoredDataVersion(DATA_VERSION);
  applyFilters();
  Toastify({ text: 'Datos restaurados desde JSON', duration: 3000, gravity: 'top', position: 'right', backgroundColor: '#16a34a' }).showToast();
};

const initWeatherButtons = () => {
  const buttons = document.querySelectorAll('.weather-btn');
  buttons.forEach((button) => {
    button.addEventListener('click', async () => {
      buttons.forEach((btn) => btn.classList.remove('active')); 
      button.classList.add('active');
      const lat = button.dataset.lat;
      const lng = button.dataset.lng;
      await fetchWeather(lat, lng, button.textContent.trim());
    });
  });
};

const fetchWeather = async (latitude, longitude, cityName) => {
  const weatherCard = document.getElementById('weatherCard');
  weatherCard.innerHTML = '<p>Cargando clima...</p>';

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Error al consultar el clima');

    const data = await response.json();
    const current = data.current_weather;
    weatherCard.innerHTML = `
      <div class="weather-card-grid">
        <div><strong>Ciudad</strong><p>${cityName}</p></div>
        <div><strong>Fecha / Hora</strong><p>${current.time}</p></div>
        <div><strong>Temperatura</strong><p>${current.temperature}°C</p></div>
        <div><strong>Velocidad del viento</strong><p>${current.windspeed} km/h</p></div>
        <div><strong>Dirección del viento</strong><p>${current.winddirection}°</p></div>
        <div><strong>Código de clima</strong><p>${current.weathercode}</p></div>
      </div>
    `;
  } catch (error) {
    weatherCard.innerHTML = `<p>Error al cargar el clima: ${error.message}</p>`;
  }
};

const initProductEvents = () => {
  selectors.searchInput.addEventListener('input', applyFilters);
  selectors.categoryFilter.addEventListener('change', applyFilters);
  selectors.stockFilter.addEventListener('change', applyFilters);
  selectors.sortSelect.addEventListener('change', applyFilters);
  selectors.btnToggleForm.addEventListener('click', openForm);
  selectors.btnCancelProduct.addEventListener('click', closeForm);
  selectors.btnResetData.addEventListener('click', restoreData);
  selectors.productTableBody.addEventListener('click', handleTableClick);
  selectors.productForm.addEventListener('submit', submitProductForm);
  if (selectors.logoutLink) selectors.logoutLink.addEventListener('click', (e) => { e.preventDefault(); logout(); });
};

const loadApp = async () => {
  await initializeStorage();
  setCategoryOptions();
  applyFilters();
  buildCategoryChart(productos);
  initProductEvents();
  initWeatherButtons();
  updateCartCount();
  updateAuthUI();
};

if (document.getElementById('productTableBody')) {
  document.addEventListener('DOMContentLoaded', loadApp);
}
