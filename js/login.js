const loginForm = document.querySelector('.auth-form');
const loginEmail = document.getElementById('email');
const loginPassword = document.getElementById('password');

const hydrateUsers = async () => {
  const stored = localStorage.getItem('techwear_usuarios');
  if (stored) {
    const users = JSON.parse(stored);
    const normalized = users.map((user) => ({ ...user, password: user.password || '123456' }));
    localStorage.setItem('techwear_usuarios', JSON.stringify(normalized));
    return normalized;
  }

  const response = await fetch('../json/usuarios.json');
  if (!response.ok) throw new Error('No se pudo cargar usuarios de JSON');
  const users = await response.json();
  const normalized = users.map((user) => ({ ...user, password: '123456' }));
  localStorage.setItem('techwear_usuarios', JSON.stringify(normalized));
  return normalized;
};

const authenticateUser = (email, password) => {
  const stored = localStorage.getItem('techwear_usuarios');
  if (!stored) return null;
  const users = JSON.parse(stored);
  return users.find((user) => user.email === email && user.password === password);
};

const handleLoginSubmit = async (event) => {
  event.preventDefault();
  try {
    await hydrateUsers();
  } catch (error) {
    Swal.fire({ icon: 'error', title: 'Error de carga', text: error.message });
    return;
  }

  const email = loginEmail.value.trim();
  const password = loginPassword.value;
  const user = authenticateUser(email, password);

  if (!user) {
    Swal.fire({ icon: 'error', title: 'Credenciales incorrectas', text: 'Verifica tu correo y contraseña.' });
    return;
  }

  localStorage.setItem('techwear_logged_user', JSON.stringify({ email: user.email, nombres: user.nombres, apellidos: user.apellidos }));
  Swal.fire({ icon: 'success', title: 'Ingreso exitoso', text: `Bienvenido ${user.nombres}` }).then(() => {
    window.location.href = '../index.html';
  });
};

if (loginForm) {
  document.addEventListener('DOMContentLoaded', () => {
    loginForm.addEventListener('submit', handleLoginSubmit);
  });
}
