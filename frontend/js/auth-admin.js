/* ============================================================================
   SISTEMA DE AUTENTICACIÓN Y ADMINISTRADOR DINÁMICO
   ============================================================================ */

// Inyectar CSS de login y admin dinámico
function inyectarCSSLogin() {
    const styles = `
    .login-screen {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        background: linear-gradient(135deg, rgba(38, 99, 235, 0.15), rgba(124, 58, 237, 0.15)), var(--bg);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
    }
    .login-screen.d-none { display: none; }
    .login-container {
        width: 100%;
        max-width: 420px;
        padding: 20px;
    }
    .login-box {
        background: rgba(255, 255, 255, 0.92);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.8);
        border-radius: 24px;
        padding: 48px 36px;
        box-shadow: 0 20px 60px rgba(15, 23, 42, 0.2);
        animation: slideInUp 0.5s ease-out;
    }
    @keyframes slideInUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .login-header {
        text-align: center;
        margin-bottom: 32px;
    }
    .login-logo {
        width: 80px;
        height: 80px;
        margin: 0 auto 20px;
        border-radius: 20px;
        background: linear-gradient(135deg, var(--sky), var(--blue), var(--purple));
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 40px;
        color: white;
        box-shadow: 0 14px 28px rgba(37, 99, 235, 0.3);
    }
    .login-header h1 {
        margin: 16px 0 8px;
        font-size: 28px;
        font-weight: 900;
        color: var(--text);
    }
    .login-header p {
        margin: 0;
        font-size: 14px;
        color: var(--muted);
    }
    .login-form { margin-bottom: 20px; }
    .form-group { margin-bottom: 20px; }
    .form-group label {
        display: block;
        margin-bottom: 8px;
        font-size: 14px;
        font-weight: 600;
        color: var(--text);
    }
    .form-group .form-control {
        width: 100%;
        padding: 12px 14px;
        border: 1.5px solid var(--border);
        border-radius: 12px;
        font-size: 14px;
        transition: all 0.3s ease;
        background: #f8fafc;
    }
    .form-group .form-control:focus {
        background: white;
        border-color: var(--blue);
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        outline: none;
    }
    .password-input-group {
        position: relative;
        display: flex;
        align-items: center;
    }
    .password-input-group .form-control { padding-right: 44px; }
    .btn-toggle-password {
        position: absolute;
        right: 12px;
        background: none;
        border: none;
        color: var(--muted);
        cursor: pointer;
        font-size: 18px;
        transition: color 0.2s ease;
    }
    .btn-toggle-password:hover { color: var(--blue); }
    .btn-login {
        width: 100%;
        padding: 12px 16px;
        background: linear-gradient(135deg, var(--blue), var(--purple));
        border: none;
        border-radius: 12px;
        font-size: 15px;
        font-weight: 700;
        color: white;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 8px 16px rgba(37, 99, 235, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
    }
    .btn-login:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 24px rgba(37, 99, 235, 0.4);
    }
    .btn-login:active { transform: translateY(0); }
    .login-error {
        background: rgba(220, 38, 38, 0.1);
        border: 1px solid rgba(220, 38, 38, 0.3);
        border-radius: 10px;
        padding: 12px 14px;
        font-size: 13px;
        color: var(--red);
        margin-bottom: 16px;
        animation: shake 0.3s ease-in-out;
    }
    .login-error.d-none { display: none; }
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    .login-footer {
        text-align: center;
        font-size: 12px;
        color: var(--muted);
    }
    .app-panel.d-none { display: none; }
    .admin-menu-group {
        display: flex;
        align-items: center;
        gap: 16px;
    }
    .btn-logout {
        padding: 10px 16px;
        background: rgba(220, 38, 38, 0.1);
        border: 1px solid rgba(220, 38, 38, 0.2);
        border-radius: 10px;
        color: var(--red);
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 6px;
    }
    .btn-logout:hover {
        background: rgba(220, 38, 38, 0.2);
        border-color: rgba(220, 38, 38, 0.4);
        color: var(--red);
    }
    .profile-card {
        background: rgba(255, 255, 255, 0.92);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.8);
        border-radius: 20px;
        overflow: hidden;
        box-shadow: var(--shadow);
    }
    .profile-cover {
        height: 120px;
        background: linear-gradient(135deg, var(--sky), var(--blue), var(--purple));
    }
    .profile-body {
        padding: 0 24px 24px 24px;
        text-align: center;
    }
    .profile-photo {
        width: 120px;
        height: 120px;
        margin: -60px auto 16px;
        border-radius: 20px;
        background: linear-gradient(135deg, var(--sky), var(--blue), var(--purple));
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 48px;
        font-weight: 900;
        color: white;
        border: 4px solid white;
        box-shadow: 0 12px 24px rgba(37, 99, 235, 0.2);
    }
    .profile-body h3 {
        margin: 16px 0 4px;
        font-weight: 900;
        font-size: 22px;
    }
    .profile-body > p {
        margin: 0 0 20px;
        color: var(--muted);
        font-size: 14px;
    }
    .profile-data {
        background: #f8fafc;
        border-radius: 12px;
        padding: 16px;
        text-align: left;
    }
    .profile-data div {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        font-size: 13px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    }
    .profile-data div:last-child { border-bottom: none; }
    .profile-data strong {
        color: var(--text);
        font-weight: 700;
    }
    .profile-data span { color: var(--muted); }
    .profile-description { border-left: 4px solid var(--blue) !important; }
    .button-group-profile {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
    }
    .button-group-profile .btn {
        flex: 1;
        min-width: 140px;
    }
    @media (max-width: 480px) {
        .login-box { padding: 36px 20px; }
        .login-logo { width: 70px; height: 70px; font-size: 36px; }
        .login-header h1 { font-size: 24px; }
        .button-group-profile { flex-direction: column; }
        .button-group-profile .btn { width: 100%; }
    }
    `;
    
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
}

// Elementos del login
const loginScreen = document.getElementById('loginScreen');
const appPanel = document.getElementById('appPanel');
const formLogin = document.getElementById('formLogin');
const inputUsername = document.getElementById('inputUsername');
const inputPassword = document.getElementById('inputPassword');
const btnTogglePassword = document.getElementById('btnTogglePassword');
const loginError = document.getElementById('loginError');
const btnLogout = document.getElementById('btnLogout');

// Elementos del administrador
const adminInstitucion = document.getElementById('adminInstitucion');
const adminCargo = document.getElementById('adminCargo');
const adminTelefono = document.getElementById('adminTelefono');
const adminDescripcion = document.getElementById('adminDescripcion');
const adminInstitucionVista = document.getElementById('adminInstitucionVista');
const adminCargoVista = document.getElementById('adminCargoVista');
const adminTelefonoVista = document.getElementById('adminTelefonoVista');
const adminDescripcionVista = document.getElementById('adminDescripcionVista');
const btnRestaurarAdmin = document.getElementById('btnRestaurarAdmin');

// Datos por defecto del administrador
const adminPorDefecto = {
    nombre: 'Brayan Chavez',
    correo: 'admin@colegio.edu.pe',
    institucion: 'Colegio Digital',
    cargo: 'Administrador',
    telefono: '+51 987654321',
    descripcion: 'Bienvenido al panel administrativo del sistema de asistencia facial.',
    foto: null
};

// Credenciales válidas
const CREDENCIALES_VALIDAS = {
    usuario: 'admin',
    password: 'admin123'
};

// ============================================================================
// FUNCIONES DE AUTENTICACIÓN
// ============================================================================

function verificarSesion() {
    const tokenSesion = sessionStorage.getItem('sesionActiva');
    
    if (tokenSesion) {
        mostrarPanel();
        cargarAdmin();
        return true;
    } else {
        mostrarLogin();
        return false;
    }
}

function mostrarLogin() {
    loginScreen.classList.remove('d-none');
    appPanel.classList.add('d-none');
    inputUsername.focus();
}

function mostrarPanel() {
    loginScreen.classList.add('d-none');
    appPanel.classList.remove('d-none');
}

function iniciarSesion(usuario, password) {
    if (usuario === CREDENCIALES_VALIDAS.usuario && password === CREDENCIALES_VALIDAS.password) {
        sessionStorage.setItem('sesionActiva', 'true');
        sessionStorage.setItem('usuarioActivo', usuario);
        loginError.classList.add('d-none');
        mostrarPanel();
        
        // Cargar datos del administrador
        cargarAdmin();
        
        // Ejecutar carga de datos del panel
        if (typeof cargarPersonas === 'function') cargarPersonas();
        if (typeof cargarAsistencias === 'function') cargarAsistencias();
        if (typeof cargarReportes === 'function') cargarReportes();
        
        mostrarMensajeLogin('Bienvenido al panel administrativo', 'success');
        
        return true;
    } else {
        mostrarMensajeLogin('Usuario o contraseña incorrectos', 'danger');
        return false;
    }
}

function cerrarSesion() {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        sessionStorage.removeItem('sesionActiva');
        sessionStorage.removeItem('usuarioActivo');
        formLogin.reset();
        mostrarLogin();
        mostrarMensajeLogin('Sesión cerrada correctamente', 'success');
    }
}

function mostrarMensajeLogin(mensaje, tipo) {
    loginError.textContent = mensaje;
    loginError.className = 'login-error';
    
    if (tipo === 'success') {
        loginError.style.background = 'rgba(22, 163, 74, 0.1)';
        loginError.style.border = '1px solid rgba(22, 163, 74, 0.3)';
        loginError.style.color = '#16a34a';
    } else {
        loginError.style.background = 'rgba(220, 38, 38, 0.1)';
        loginError.style.border = '1px solid rgba(220, 38, 38, 0.3)';
        loginError.style.color = '#dc2626';
    }
    
    loginError.classList.remove('d-none');
    
    setTimeout(() => {
        loginError.classList.add('d-none');
    }, 4000);
}

// ============================================================================
// FUNCIONES DE ADMINISTRADOR DINÁMICO
// ============================================================================

function cargarAdmin() {
    const adminGuardado = localStorage.getItem('adminData');
    const admin = adminGuardado ? JSON.parse(adminGuardado) : adminPorDefecto;
    
    // Cargar datos en formulario
    if (adminNombre) adminNombre.value = admin.nombre;
    if (adminCorreo) adminCorreo.value = admin.correo;
    if (adminInstitucion) adminInstitucion.value = admin.institucion;
    if (adminCargo) adminCargo.value = admin.cargo;
    if (adminTelefono) adminTelefono.value = admin.telefono;
    if (adminDescripcion) adminDescripcion.value = admin.descripcion;
    
    actualizarVistaAdmin(admin);
}

function guardarAdmin() {
    const admin = {
        nombre: adminNombre.value || adminPorDefecto.nombre,
        correo: adminCorreo.value || adminPorDefecto.correo,
        institucion: adminInstitucion.value || adminPorDefecto.institucion,
        cargo: adminCargo.value || adminPorDefecto.cargo,
        telefono: adminTelefono.value || adminPorDefecto.telefono,
        descripcion: adminDescripcion.value || adminPorDefecto.descripcion,
        foto: localStorage.getItem('adminFoto')
    };
    
    localStorage.setItem('adminData', JSON.stringify(admin));
    actualizarVistaAdmin(admin);
    mostrarMensajePerfil('Perfil actualizado correctamente', 'success');
}

function actualizarVistaAdmin(admin) {
    // Actualizar vista en perfil
    if (adminNombreVista) adminNombreVista.textContent = admin.nombre;
    if (adminCorreoVista) adminCorreoVista.textContent = admin.correo;
    if (adminInstitucionVista) adminInstitucionVista.textContent = admin.institucion;
    if (adminCargoVista) adminCargoVista.textContent = admin.cargo;
    if (adminTelefonoVista) adminTelefonoVista.textContent = admin.telefono;
    if (adminDescripcionVista) adminDescripcionVista.textContent = admin.descripcion;
    
    // Actualizar nombre en top bar
    if (adminNombreTop) adminNombreTop.textContent = admin.nombre;
    
    // Actualizar avatares con nombre o foto
    actualizarAvatares(admin);
}

function actualizarAvatares(admin) {
    const fotoUrl = localStorage.getItem('adminFoto');
    const iniciales = generarIniciales(admin.nombre);
    
    // Avatar grande (perfil)
    if (adminAvatarGrande) {
        if (fotoUrl) {
            adminAvatarGrande.style.backgroundImage = `url('${fotoUrl}')`;
            adminAvatarGrande.style.backgroundSize = 'cover';
            adminAvatarGrande.style.backgroundPosition = 'center';
            adminAvatarGrande.textContent = '';
        } else {
            adminAvatarGrande.style.backgroundImage = 'none';
            adminAvatarGrande.textContent = iniciales;
        }
    }
    
    // Avatar pequeño (top bar)
    if (adminAvatarTop) {
        if (fotoUrl) {
            adminAvatarTop.style.backgroundImage = `url('${fotoUrl}')`;
            adminAvatarTop.style.backgroundSize = 'cover';
            adminAvatarTop.style.backgroundPosition = 'center';
            adminAvatarTop.textContent = '';
        } else {
            adminAvatarTop.style.backgroundImage = 'none';
            adminAvatarTop.textContent = iniciales;
        }
    }
}

function generarIniciales(nombre) {
    return nombre.split(' ').map(n => n.charAt(0).toUpperCase()).join('').substring(0, 2);
}

function restaurarAdmin() {
    if (confirm('¿Restaurar datos del administrador a los valores por defecto?')) {
        localStorage.removeItem('adminData');
        localStorage.removeItem('adminFoto');
        adminFoto.value = '';
        cargarAdmin();
        mostrarMensajePerfil('Datos restaurados a los valores por defecto', 'info');
    }
}

function mostrarMensajePerfil(mensaje, tipo) {
    const mensajePerfil = document.getElementById('mensajePerfil');
    if (!mensajePerfil) return;
    
    mensajePerfil.textContent = mensaje;
    mensajePerfil.className = 'mt-3 fw-bold';
    
    if (tipo === 'success') {
        mensajePerfil.style.color = '#16a34a';
    } else if (tipo === 'info') {
        mensajePerfil.style.color = '#2563eb';
    }
    
    setTimeout(() => {
        mensajePerfil.textContent = '';
    }, 3000);
}

// ============================================================================
// EVENT LISTENERS
// ============================================================================

// Mostrar/ocultar contraseña
if (btnTogglePassword) {
    btnTogglePassword.addEventListener('click', (e) => {
        e.preventDefault();
        const tipo = inputPassword.type === 'password' ? 'text' : 'password';
        inputPassword.type = tipo;
        btnTogglePassword.innerHTML = tipo === 'password' 
            ? '<i class="bi bi-eye-fill"></i>' 
            : '<i class="bi bi-eye-slash-fill"></i>';
    });
}

// Enviar login
if (formLogin) {
    formLogin.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const usuario = inputUsername.value.trim();
        const password = inputPassword.value.trim();
        
        if (!usuario || !password) {
            mostrarMensajeLogin('Completa todos los campos', 'danger');
            return;
        }
        
        iniciarSesion(usuario, password);
    });
}

// Botón logout
if (btnLogout) {
    btnLogout.addEventListener('click', cerrarSesion);
}

// Guardar cambios de perfil
if (formPerfil) {
    formPerfil.addEventListener('submit', (e) => {
        e.preventDefault();
        guardarAdmin();
    });
}

// Cargar foto de perfil
if (adminFoto) {
    adminFoto.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                localStorage.setItem('adminFoto', event.target.result);
                const admin = JSON.parse(localStorage.getItem('adminData')) || adminPorDefecto;
                actualizarAvatares(admin);
                mostrarMensajePerfil('Foto de perfil actualizada', 'success');
            };
            reader.readAsDataURL(file);
        }
    });
}

// Restaurar admin
if (btnRestaurarAdmin) {
    btnRestaurarAdmin.addEventListener('click', restaurarAdmin);
}

// Inicializar
inyectarCSSLogin();
