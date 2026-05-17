const API_PERSONAS = "http://localhost:8080/api/personas";

const menuLinks = document.querySelectorAll(".menu-link");
const sections = document.querySelectorAll(".page-section");
const pageTitle = document.getElementById("pageTitle");
const pageDescription = document.getElementById("pageDescription");
const globalAlert = document.getElementById("globalAlert");

const formPersona = document.getElementById("formPersona");
const tipoPersonaRegistro = document.getElementById("tipoPersonaRegistro");
const camposEstudiante = document.getElementById("camposEstudiante");
const camposDocente = document.getElementById("camposDocente");
const tablaPersonas = document.getElementById("tablaPersonas");
const btnActualizarPersonas = document.getElementById("btnActualizarPersonas");
const filterBtns = document.querySelectorAll(".filter-btn");

const totalPersonas = document.getElementById("totalPersonas");
const totalEstudiantes = document.getElementById("totalEstudiantes");
const totalDocentes = document.getElementById("totalDocentes");
const reportePersonas = document.getElementById("reportePersonas");
const reporteEstudiantes = document.getElementById("reporteEstudiantes");
const reporteDocentes = document.getElementById("reporteDocentes");

const donutTipoPersona = document.getElementById("donutTipoPersona");
const donutTotalPersonas = document.getElementById("donutTotalPersonas");
const leyendaTipos = document.getElementById("leyendaTipos");

const selectPersonaRostro = document.getElementById("selectPersonaRostro");
const fotoRostro = document.getElementById("fotoRostro");
const photoPreview = document.getElementById("photoPreview");
const btnRegistrarRostro = document.getElementById("btnRegistrarRostro");
const mensajeRostro = document.getElementById("mensajeRostro");

const btnPerfilRapido = document.getElementById("btnPerfilRapido");
const formPerfil = document.getElementById("formPerfil");
const adminNombre = document.getElementById("adminNombre");
const adminCorreo = document.getElementById("adminCorreo");
const adminFoto = document.getElementById("adminFoto");
const adminNombreTop = document.getElementById("adminNombreTop");
const adminNombreVista = document.getElementById("adminNombreVista");
const adminCorreoVista = document.getElementById("adminCorreoVista");
const adminAvatarTop = document.getElementById("adminAvatarTop");
const adminAvatarGrande = document.getElementById("adminAvatarGrande");

let personas = [];
let filtroActual = "TODOS";

const pageInfo = {
    dashboard: ["Dashboard general", "Resumen del sistema de asistencia facial."],
    personas: ["Gestión de personas", "Registro de estudiantes y docentes en una sola entidad."],
    reconocimiento: ["Reconocimiento facial", "Asociación de rostro para estudiantes y docentes."],
    asistencia: ["Toma de asistencia", "Registro de asistencia mediante reconocimiento facial."],
    reportes: ["Reportes del sistema", "Indicadores generales de personas y asistencia."],
    perfil: ["Perfil del administrador", "Información del usuario administrador."],
    configuracion: ["Configuración", "Información técnica del proyecto."]
};

document.addEventListener("DOMContentLoaded", () => {
    cargarPersonas();
});

menuLinks.forEach(link => {
    link.addEventListener("click", () => {
        const section = link.dataset.section;

        menuLinks.forEach(item => item.classList.remove("active"));
        link.classList.add("active");

        sections.forEach(sec => sec.classList.remove("active-section"));
        document.getElementById(`section-${section}`).classList.add("active-section");

        pageTitle.textContent = pageInfo[section][0];
        pageDescription.textContent = pageInfo[section][1];
    });
});

btnPerfilRapido.addEventListener("click", () => {
    document.querySelector('[data-section="perfil"]').click();
});

tipoPersonaRegistro.addEventListener("change", () => {
    const tipo = tipoPersonaRegistro.value;

    if (tipo === "ESTUDIANTE") {
        camposEstudiante.classList.remove("d-none");
        camposDocente.classList.add("d-none");
    } else {
        camposEstudiante.classList.add("d-none");
        camposDocente.classList.remove("d-none");
    }
});

formPersona.addEventListener("submit", async (event) => {
    event.preventDefault();

    const tipo = tipoPersonaRegistro.value;

    const persona = {
        nombres: document.getElementById("nombres").value.trim(),
        apellidos: document.getElementById("apellidos").value.trim(),
        dni: document.getElementById("dni").value.trim(),
        correo: document.getElementById("correo").value.trim(),
        telefono: document.getElementById("telefono").value.trim(),
        tipoPersona: tipo,
        grado: tipo === "ESTUDIANTE" ? document.getElementById("grado").value.trim() : "",
        seccion: tipo === "ESTUDIANTE" ? document.getElementById("seccion").value.trim() : "",
        especialidad: tipo === "DOCENTE" ? document.getElementById("especialidad").value.trim() : "",
        cargo: tipo === "DOCENTE" ? document.getElementById("cargo").value.trim() : "",
        estado: true
    };

    if (!validarPersona(persona)) {
        mostrarAlerta("Completa los campos obligatorios según el tipo de persona.", "danger");
        return;
    }

    try {
        const response = await fetch(API_PERSONAS, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(persona)
        });

        if (!response.ok) {
            throw new Error("API /api/personas aún no disponible. Se guardará temporalmente en el navegador.");
        }

        mostrarAlerta("Persona registrada correctamente en MySQL.", "success");
        formPersona.reset();
        tipoPersonaRegistro.dispatchEvent(new Event("change"));
        cargarPersonas();

    } catch (error) {
        persona.id = Date.now();
        guardarPersonaLocal(persona);
        mostrarAlerta("Persona guardada temporalmente. Luego la conectaremos con /api/personas.", "warning");
        formPersona.reset();
        tipoPersonaRegistro.dispatchEvent(new Event("change"));
        cargarPersonas();
    }
});

btnActualizarPersonas.addEventListener("click", cargarPersonas);

filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        filterBtns.forEach(item => item.classList.remove("active"));
        btn.classList.add("active");
        filtroActual = btn.dataset.filter;
        renderTabla();
    });
});

async function cargarPersonas() {
    try {
        const response = await fetch(API_PERSONAS);

        if (!response.ok) {
            throw new Error("API no disponible");
        }

        personas = await response.json();
    } catch (error) {
        personas = JSON.parse(localStorage.getItem("personasLocal")) || [];
    }

    renderTabla();
    actualizarDashboard();
    cargarSelectRostro();
}

function guardarPersonaLocal(persona) {
    const data = JSON.parse(localStorage.getItem("personasLocal")) || [];
    data.push(persona);
    localStorage.setItem("personasLocal", JSON.stringify(data));
}

function renderTabla() {
    const lista = filtroActual === "TODOS"
        ? personas
        : personas.filter(p => p.tipoPersona === filtroActual);

    tablaPersonas.innerHTML = "";

    if (lista.length === 0) {
        tablaPersonas.innerHTML = `
            <tr>
                <td colspan="6" class="text-center text-muted py-4">
                    No hay personas registradas para este filtro.
                </td>
            </tr>
        `;
        return;
    }

    lista.forEach(persona => {
        const detalle = persona.tipoPersona === "ESTUDIANTE"
            ? `${persona.grado || "Sin grado"} - Sección ${persona.seccion || "-"}`
            : `${persona.especialidad || "Sin especialidad"} / ${persona.cargo || "Sin cargo"}`;

        const badgeClass = persona.tipoPersona === "ESTUDIANTE" ? "badge-student" : "badge-teacher";
        const tipoTexto = persona.tipoPersona === "ESTUDIANTE" ? "Estudiante" : "Docente";

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${persona.id}</td>
            <td>
                <div class="person-name">${persona.nombres} ${persona.apellidos}</div>
                <div class="person-sub">${persona.correo || "Sin correo"}</div>
            </td>
            <td>${persona.dni}</td>
            <td><span class="badge-custom ${badgeClass}">${tipoTexto}</span></td>
            <td>${detalle}</td>
            <td>
                <span class="badge text-bg-success">
                    ${persona.estado ? "Activo" : "Inactivo"}
                </span>
            </td>
        `;

        tablaPersonas.appendChild(row);
    });
}

function actualizarDashboard() {
    const estudiantes = personas.filter(p => p.tipoPersona === "ESTUDIANTE").length;
    const docentes = personas.filter(p => p.tipoPersona === "DOCENTE").length;

    totalPersonas.textContent = personas.length;
    totalEstudiantes.textContent = estudiantes;
    totalDocentes.textContent = docentes;

    reportePersonas.textContent = personas.length;
    reporteEstudiantes.textContent = estudiantes;
    reporteDocentes.textContent = docentes;

    donutTotalPersonas.textContent = personas.length;

    if (personas.length === 0) {
        donutTipoPersona.style.background = "#e2e8f0";
        leyendaTipos.innerHTML = `<p class="text-muted">Sin datos registrados.</p>`;
        return;
    }

    const gradosEst = (estudiantes / personas.length) * 360;
    const gradosDoc = 360 - gradosEst;

    donutTipoPersona.style.background = `
        conic-gradient(
            #2563eb 0deg ${gradosEst}deg,
            #7c3aed ${gradosEst}deg 360deg
        )
    `;

    leyendaTipos.innerHTML = `
        <div class="legend-item">
            <div class="legend-left">
                <span class="legend-dot" style="background:#2563eb"></span>
                Estudiantes
            </div>
            <strong>${estudiantes}</strong>
        </div>

        <div class="legend-item">
            <div class="legend-left">
                <span class="legend-dot" style="background:#7c3aed"></span>
                Docentes
            </div>
            <strong>${docentes}</strong>
        </div>
    `;
}

function cargarSelectRostro() {
    selectPersonaRostro.innerHTML = `<option value="">Selecciona una persona</option>`;

    personas.forEach(persona => {
        const option = document.createElement("option");
        option.value = persona.id;
        option.textContent = `${persona.nombres} ${persona.apellidos} - ${persona.tipoPersona}`;
        selectPersonaRostro.appendChild(option);
    });
}

fotoRostro.addEventListener("change", () => {
    const file = fotoRostro.files[0];

    if (!file) {
        photoPreview.innerHTML = `
            <div>
                <i class="bi bi-image"></i>
                <p>Sin imagen seleccionada</p>
            </div>
        `;
        return;
    }

    const imageUrl = URL.createObjectURL(file);

    photoPreview.innerHTML = `<img src="${imageUrl}" alt="Vista previa de rostro">`;
});

btnRegistrarRostro.addEventListener("click", async () => {
    const personaId = selectPersonaRostro.value;
    const file = fotoRostro.files[0];

    if (!personaId) {
        mostrarMensajeRostro("Selecciona una persona.", "danger");
        return;
    }

    if (!file) {
        mostrarMensajeRostro("Selecciona una foto del rostro.", "danger");
        return;
    }

    const persona = personas.find(p => String(p.id) === String(personaId));

    if (!persona) {
        mostrarMensajeRostro("No se encontró la persona seleccionada.", "danger");
        return;
    }

    const formData = new FormData();
    formData.append("personaId", persona.id);
    formData.append("tipoPersona", persona.tipoPersona);
    formData.append("image", file);

    try {
        const responsePython = await fetch("http://localhost:5001/api/faces/register", {
            method: "POST",
            body: formData
        });

        const data = await responsePython.json();

        if (!responsePython.ok) {
            throw new Error(data.message || "No se pudo registrar el rostro.");
        }

        const responseJava = await fetch(
            `http://localhost:8080/api/personas/${persona.id}/rostro?rutaRostro=${encodeURIComponent(data.path)}`,
            {
                method: "PATCH"
            }
        );

        if (!responseJava.ok) {
            throw new Error("La imagen se guardó en Python, pero no se pudo actualizar la persona en MySQL.");
        }

        mostrarMensajeRostro(
            `Rostro guardado correctamente para ${persona.nombres} ${persona.apellidos}. Archivo: ${data.filename}`,
            "success"
        );

        await cargarPersonas();

        console.log("Respuesta de Python:", data);

    } catch (error) {
        mostrarMensajeRostro(
            "Error al guardar rostro: " + error.message,
            "danger"
        );

        console.error("Error al enviar rostro:", error);
    }
});

formPerfil.addEventListener("submit", (event) => {
    event.preventDefault();

    const nombre = adminNombre.value.trim();
    const correo = adminCorreo.value.trim();

    if (!nombre || !correo) {
        mostrarMensajePerfil("Completa nombre y correo.", "danger");
        return;
    }

    adminNombreTop.textContent = nombre;
    adminNombreVista.textContent = nombre;
    adminCorreoVista.textContent = correo;

    const iniciales = obtenerIniciales(nombre);

    if (!adminAvatarTop.querySelector("img")) {
        adminAvatarTop.textContent = iniciales;
    }

    if (!adminAvatarGrande.querySelector("img")) {
        adminAvatarGrande.textContent = iniciales;
    }

    mostrarMensajePerfil("Perfil actualizado correctamente.", "success");
});

adminFoto.addEventListener("change", () => {
    const file = adminFoto.files[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    adminAvatarTop.innerHTML = `<img src="${imageUrl}" alt="Foto administrador">`;
    adminAvatarGrande.innerHTML = `<img src="${imageUrl}" alt="Foto administrador">`;
});

function validarPersona(persona) {
    if (!persona.nombres || !persona.apellidos || !persona.dni) {
        return false;
    }

    if (persona.tipoPersona === "ESTUDIANTE") {
        return persona.grado && persona.seccion;
    }

    if (persona.tipoPersona === "DOCENTE") {
        return persona.especialidad && persona.cargo;
    }

    return true;
}

function mostrarAlerta(texto, tipo) {
    globalAlert.className = `alert alert-${tipo}`;
    globalAlert.textContent = texto;
    globalAlert.classList.remove("d-none");

    setTimeout(() => {
        globalAlert.classList.add("d-none");
    }, 4200);
}

function mostrarMensajeRostro(texto, tipo) {
    mensajeRostro.className = `mt-3 fw-bold text-${tipo}`;
    mensajeRostro.textContent = texto;

    setTimeout(() => {
        mensajeRostro.textContent = "";
    }, 4500);
}

function mostrarMensajePerfil(texto, tipo) {
    const mensajePerfil = document.getElementById("mensajePerfil");
    mensajePerfil.className = `mt-3 fw-bold text-${tipo}`;
    mensajePerfil.textContent = texto;

    setTimeout(() => {
        mensajePerfil.textContent = "";
    }, 4200);
}

function obtenerIniciales(nombre) {
    return nombre
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map(p => p[0].toUpperCase())
        .join("");
}