const loginForm = document.querySelector('.auth-form');
const loginEmail = document.getElementById('email');
const loginPassword = document.getElementById('password');

const authenticateUser = (email, password) => {
  const stored = localStorage.getItem('techwear_usuarios');
  if (!stored) return null;
  const users = JSON.parse(stored);
  return users.find((user) => user.email === email);
};

const handleLoginSubmit = (event) => {
  event.preventDefault();
  const email = loginEmail.value.trim();
  const password = loginPassword.value;
  const user = authenticateUser(email, password);

  if (!user) {
    Swal.fire({ icon: 'error', title: 'Usuario no encontrado', text: 'Verifica tu correo o regístrate primero.' });
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
