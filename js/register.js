const registerSelectors = {
  form: document.querySelector('.register-form'),
  first: document.getElementById('first'),
  last: document.getElementById('last'),
  email: document.getElementById('email'),
  phone: document.getElementById('phone'),
  password: document.getElementById('password'),
  confirm: document.getElementById('confirm'),
  dob: document.getElementById('dob'),
  city: document.getElementById('city'),
  state: document.getElementById('state'),
  zip: document.getElementById('zip'),
  countrySearch: document.getElementById('countrySearch'),
  country: document.getElementById('country'),
  countryPreview: document.getElementById('countryPreview')
};

const registerKey = 'techwear_usuarios';
let availableCountries = [];

const loadCountries = async () => {
  try {
    const stored = localStorage.getItem('techwear_paises');
    if (stored) {
      availableCountries = JSON.parse(stored);
      return;
    }

    const response = await fetch('https://countries.dev/countries');
    if (!response.ok) throw new Error('No se pudo obtener la lista de países');
    availableCountries = await response.json();
    localStorage.setItem('techwear_paises', JSON.stringify(availableCountries));
  } catch (error) {
    console.error(error);
    const option = document.createElement('option');
    option.value = '';
    option.textContent = 'Error cargando países';
    registerSelectors.country.appendChild(option);
  }
};

const buildCountryOptions = () => {
  registerSelectors.country.innerHTML = '<option value="">Selecciona un país</option>';
  availableCountries.slice(0, 150).forEach((country) => {
    const option = document.createElement('option');
    option.value = country.alpha2Code || country.alpha2code || country.alpha3Code || country.name;
    option.textContent = `${country.name}`;
    option.dataset.flag = country.flags?.png ? country.flags.png : '';
    registerSelectors.country.appendChild(option);
  });
};

const saveUser = (userData) => {
  const stored = localStorage.getItem(registerKey);
  const users = stored ? JSON.parse(stored) : [];
  users.push(userData);
  localStorage.setItem(registerKey, JSON.stringify(users));
};

const getSelectedCountry = () => {
  const selectedValue = registerSelectors.country.value;
  return availableCountries.find((country) => country.alpha2Code === selectedValue || country.alpha3Code === selectedValue || country.name === selectedValue);
};

const filterCountryOptions = () => {
  const searchValue = registerSelectors.countrySearch.value.trim().toLowerCase();
  const filtered = availableCountries.filter((country) => country.name.toLowerCase().includes(searchValue));
  registerSelectors.country.innerHTML = '<option value="">Selecciona un país</option>';
  filtered.slice(0, 120).forEach((country) => {
    const option = document.createElement('option');
    option.value = country.alpha2Code || country.alpha3Code || country.name;
    option.textContent = `${country.name}`;
    option.dataset.flag = country.flags?.png || '';
    registerSelectors.country.appendChild(option);
  });
};

const updateCountryPreview = () => {
  const countryData = getSelectedCountry();
  if (!countryData) {
    registerSelectors.countryPreview.textContent = '';
    return;
  }

  registerSelectors.countryPreview.innerHTML = `
    <div><strong>Nacionalidad</strong></div>
    <div>${countryData.flags?.png ? `<img src="${countryData.flags.png}" alt="Bandera de ${countryData.name}" class="country-flag" />` : ''} ${countryData.name}</div>
  `;
};

const handleRegisterSubmit = (event) => {
  event.preventDefault();

  if (registerSelectors.password.value !== registerSelectors.confirm.value) {
    Swal.fire({ icon: 'error', title: 'Contraseñas no coinciden', text: 'Verifica la contraseña y su confirmación.' });
    return;
  }

  if (!registerSelectors.country.value) {
    Swal.fire({ icon: 'error', title: 'Nacionalidad requerida', text: 'Selecciona tu país de nacionalidad.' });
    return;
  }

  const stored = localStorage.getItem(registerKey);
  const existingUsers = stored ? JSON.parse(stored) : [];
  const emailValue = registerSelectors.email.value.trim();
  if (existingUsers.some((user) => user.email === emailValue)) {
    Swal.fire({ icon: 'error', title: 'Correo ya registrado', text: 'Ya existe una cuenta con este correo.' });
    return;
  }

  const countryData = getSelectedCountry();
  const user = {
    id: Date.now(),
    nombres: registerSelectors.first.value.trim(),
    apellidos: registerSelectors.last.value.trim(),
    email: registerSelectors.email.value.trim(),
    telefono: registerSelectors.phone.value.trim(),
    password: registerSelectors.password.value,
    fechaNacimiento: registerSelectors.dob.value,
    fechaRegistro: new Date().toISOString().split('T')[0],
    nacionalidad: {
      codigo: countryData?.alpha2Code || registerSelectors.country.value,
      nombre: countryData?.name || registerSelectors.country.options[registerSelectors.country.selectedIndex].text,
      bandera: countryData?.flags?.png ? countryData.flags.png : ''
    },
    direccion: {
      ciudad: registerSelectors.city.value.trim(),
      estado: registerSelectors.state.value.trim(),
      codigoPostal: registerSelectors.zip.value.trim()
    }
  };

  saveUser(user);
  Swal.fire({ icon: 'success', title: 'Registro exitoso', text: 'Tu cuenta se ha creado correctamente.' }).then(() => {
    registerSelectors.form.reset();
    window.location.href = 'login.html';
  });
};

const initRegisterPage = async () => {
  await loadCountries();
  buildCountryOptions();
  registerSelectors.countrySearch.addEventListener('input', filterCountryOptions);
  registerSelectors.country.addEventListener('change', updateCountryPreview);
  registerSelectors.form.addEventListener('submit', handleRegisterSubmit);
};

if (registerSelectors.form) {
  document.addEventListener('DOMContentLoaded', initRegisterPage);
}
