const API_PERSONAS = "http://localhost:8080/api/personas";
const API_ASISTENCIAS = "http://localhost:8080/api/asistencias";
const API_FACE_REGISTER = "http://localhost:5001/api/faces/register";
const API_FACE_RECOGNIZE = "http://localhost:5001/api/faces/recognize";

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
const btnGuardarPersona = document.getElementById("btnGuardarPersona");
const btnCancelarEdicionPersona = document.getElementById("btnCancelarEdicionPersona");
const tituloFormularioPersona = document.getElementById("tituloFormularioPersona");
const descripcionFormularioPersona = document.getElementById("descripcionFormularioPersona");
const filterBtns = document.querySelectorAll(".filter-btn");

const totalPersonas = document.getElementById("totalPersonas");
const totalEstudiantes = document.getElementById("totalEstudiantes");
const totalDocentes = document.getElementById("totalDocentes");

const reportePersonas = document.getElementById("reportePersonas");
const reporteTotalAsistencias = document.getElementById("reporteTotalAsistencias");
const reporteAsistenciasHoy = document.getElementById("reporteAsistenciasHoy");
const reportePresentesHoy = document.getElementById("reportePresentesHoy");
const donutReportes = document.getElementById("donutReportes");
const donutTotalReportes = document.getElementById("donutTotalReportes");
const leyendaReportes = document.getElementById("leyendaReportes");
const tablaUltimasAsistencias = document.getElementById("tablaUltimasAsistencias");
const btnActualizarReportes = document.getElementById("btnActualizarReportes");
const selectPersonaFalta = document.getElementById("selectPersonaFalta");
const btnRegistrarFaltaManual = document.getElementById("btnRegistrarFaltaManual");

const donutTipoPersona = document.getElementById("donutTipoPersona");
const donutTotalPersonas = document.getElementById("donutTotalPersonas");
const leyendaTipos = document.getElementById("leyendaTipos");

const selectPersonaRostro = document.getElementById("selectPersonaRostro");
const fotoRostro = document.getElementById("fotoRostro");
const photoPreview = document.getElementById("photoPreview");
const btnRegistrarRostro = document.getElementById("btnRegistrarRostro");
const mensajeRostro = document.getElementById("mensajeRostro");

const fotoAsistencia = document.getElementById("fotoAsistencia");
const btnReconocerPersona = document.getElementById("btnReconocerPersona");
const mensajeAsistencia = document.getElementById("mensajeAsistencia");
const previewAsistencia = document.getElementById("previewAsistencia");
const resultadoReconocimiento = document.getElementById("resultadoReconocimiento");
const btnActualizarAsistencias = document.getElementById("btnActualizarAsistencias");
const tablaAsistencias = document.getElementById("tablaAsistencias");

// Cámara en vivo - Asistencia
const useCameraAsistencia = document.getElementById("useCameraAsistencia");
const cameraSectionAsistencia = document.getElementById("cameraSectionAsistencia");
const videoStreamAsistencia = document.getElementById("videoStreamAsistencia");
const btnToggleCameraAsistencia = document.getElementById("btnToggleCameraAsistencia");
const btnCaptureFotoAsistencia = document.getElementById("btnCaptureFotoAsistencia");
const btnStopCameraAsistencia = document.getElementById("btnStopCameraAsistencia");

let videoStreamActive = null;
let isCameraRunningAsistencia = false;
let capturedFileAsistencia = null;

// Variables usadas también por auth-admin.js
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
let asistenciasReporteGlobal = [];
let personaEditandoId = null;
let estadoPersonaEditando = true;

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
    if (sessionStorage.getItem("sesionActiva") === "true") {
        cargarPersonas();
        cargarAsistencias();
        cargarReportes();
    }
});

/* =========================
   NAVEGACIÓN
========================= */

menuLinks.forEach(link => {
    link.addEventListener("click", () => {
        const section = link.dataset.section;

        menuLinks.forEach(item => item.classList.remove("active"));
        link.classList.add("active");

        sections.forEach(sec => sec.classList.remove("active-section"));

        const sectionElement = document.getElementById(`section-${section}`);
        if (sectionElement) {
            sectionElement.classList.add("active-section");
        }

        if (pageInfo[section]) {
            pageTitle.textContent = pageInfo[section][0];
            pageDescription.textContent = pageInfo[section][1];
        }

        if (section === "asistencia") {
            cargarAsistencias();
        }

        if (section === "reportes") {
            cargarReportes();
        }
    });
});

if (btnPerfilRapido) {
    btnPerfilRapido.addEventListener("click", () => {
        const perfilBtn = document.querySelector('[data-section="perfil"]');

        if (perfilBtn) {
            perfilBtn.click();
        }
    });
}

/* =========================
   FORMULARIO DINÁMICO
========================= */

if (tipoPersonaRegistro) {
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
}

/* =========================
   REGISTRO / EDICIÓN DE PERSONAS
========================= */

if (formPersona) {
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
            estado: personaEditandoId ? estadoPersonaEditando : true
        };

        if (!validarPersona(persona)) {
            mostrarAlerta("Completa los campos obligatorios según el tipo de persona.", "danger");
            return;
        }

        try {
            const url = personaEditandoId
                ? `${API_PERSONAS}/${personaEditandoId}`
                : API_PERSONAS;

            const metodo = personaEditandoId ? "PUT" : "POST";

            const response = await fetch(url, {
                method: metodo,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(persona)
            });

            if (!response.ok) {
                const errorText = await response.text();
                let message = personaEditandoId
                    ? "No se pudo actualizar la persona."
                    : "No se pudo registrar. Verifica que el DNI no esté repetido.";

                try {
                    const errorJson = JSON.parse(errorText);
                    message = errorJson.message || message;
                } catch (e) {}

                throw new Error(message);
            }

            mostrarAlerta(
                personaEditandoId
                    ? "Persona actualizada correctamente."
                    : "Persona registrada correctamente en MySQL.",
                "success"
            );

            formPersona.reset();
            tipoPersonaRegistro.value = "ESTUDIANTE";
            tipoPersonaRegistro.dispatchEvent(new Event("change"));
            cancelarEdicionPersona(false);

            await cargarPersonas();
            await cargarReportes();

        } catch (error) {
            mostrarAlerta(error.message, "danger");
            console.error(error);
        }
    });
}

if (btnCancelarEdicionPersona) {
    btnCancelarEdicionPersona.addEventListener("click", () => {
        cancelarEdicionPersona(true);
    });
}

if (btnActualizarPersonas) {
    btnActualizarPersonas.addEventListener("click", cargarPersonas);
}

if (btnActualizarAsistencias) {
    btnActualizarAsistencias.addEventListener("click", cargarAsistencias);
}

if (btnActualizarReportes) {
    btnActualizarReportes.addEventListener("click", cargarReportes);
}

filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        filterBtns.forEach(item => item.classList.remove("active"));
        btn.classList.add("active");

        filtroActual = btn.dataset.filter;
        renderTablaPersonas();
    });
});

/* =========================
   CARGAR PERSONAS
========================= */

async function cargarPersonas() {
    if (!tablaPersonas) {
        return;
    }

    try {
        const response = await fetch(API_PERSONAS);

        if (!response.ok) {
            throw new Error("No se pudo cargar la lista de personas.");
        }

        personas = await response.json();

        renderTablaPersonas();
        actualizarDashboard();
        cargarSelectRostro();
        cargarSelectPersonaFalta();

    } catch (error) {
        personas = [];

        tablaPersonas.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-danger py-4">
                    Error al cargar personas. Verifica que Spring Boot esté encendido.
                </td>
            </tr>
        `;

        actualizarDashboard();
        cargarSelectRostro();
        cargarSelectPersonaFalta();

        console.error(error);
    }
}

function renderTablaPersonas() {
    if (!tablaPersonas) {
        return;
    }

    const lista = filtroActual === "TODOS"
        ? personas
        : personas.filter(p => p.tipoPersona === filtroActual);

    tablaPersonas.innerHTML = "";

    if (lista.length === 0) {
        tablaPersonas.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-muted py-4">
                    No hay personas registradas para este filtro.
                </td>
            </tr>
        `;
        return;
    }

    lista.forEach(persona => {
        const detalle = obtenerDetallePersona(persona);
        const badgeClass = persona.tipoPersona === "ESTUDIANTE" ? "badge-student" : "badge-teacher";
        const tipoTexto = persona.tipoPersona === "ESTUDIANTE" ? "Estudiante" : "Docente";
        const rostroTexto = persona.rostroRegistrado ? "Rostro registrado" : "Sin rostro";

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${persona.id}</td>
            <td>
                <div class="person-name">${persona.nombres} ${persona.apellidos}</div>
                <div class="person-sub">${persona.correo || "Sin correo"} | ${rostroTexto}</div>
            </td>
            <td>${persona.dni}</td>
            <td><span class="badge-custom ${badgeClass}">${tipoTexto}</span></td>
            <td>${detalle}</td>
            <td>
                <span class="badge ${persona.estado ? "text-bg-success" : "text-bg-secondary"}">
                    ${persona.estado ? "Activo" : "Inactivo"}
                </span>
            </td>
            <td>
                <div class="d-flex gap-2 flex-wrap">
                    <button class="btn btn-sm btn-light-custom" onclick="editarPersona(${persona.id})">
                        <i class="bi bi-pencil-square"></i> Editar
                    </button>

                    <button class="btn btn-sm ${persona.estado ? "btn-outline-danger" : "btn-outline-success"}" onclick="cambiarEstadoPersona(${persona.id})">
                        <i class="bi ${persona.estado ? "bi-person-x-fill" : "bi-person-check-fill"}"></i>
                        ${persona.estado ? "Desactivar" : "Activar"}
                    </button>
                </div>
            </td>
        `;

        tablaPersonas.appendChild(row);
    });
}

function editarPersona(personaId) {
    const persona = personas.find(p => Number(p.id) === Number(personaId));

    if (!persona) {
        mostrarAlerta("No se encontró la persona seleccionada.", "danger");
        return;
    }

    personaEditandoId = persona.id;
    estadoPersonaEditando = persona.estado;

    document.getElementById("nombres").value = persona.nombres || "";
    document.getElementById("apellidos").value = persona.apellidos || "";
    document.getElementById("dni").value = persona.dni || "";
    document.getElementById("correo").value = persona.correo || "";
    document.getElementById("telefono").value = persona.telefono || "";

    tipoPersonaRegistro.value = persona.tipoPersona || "ESTUDIANTE";
    tipoPersonaRegistro.dispatchEvent(new Event("change"));

    if (persona.tipoPersona === "ESTUDIANTE") {
        document.getElementById("grado").value = persona.grado || "";
        document.getElementById("seccion").value = persona.seccion || "";
    }

    if (persona.tipoPersona === "DOCENTE") {
        document.getElementById("especialidad").value = persona.especialidad || "";
        document.getElementById("cargo").value = persona.cargo || "";
    }

    if (btnGuardarPersona) {
        btnGuardarPersona.innerHTML = `<i class="bi bi-save-fill"></i> Guardar cambios`;
    }

    if (btnCancelarEdicionPersona) {
        btnCancelarEdicionPersona.classList.remove("d-none");
    }

    if (tituloFormularioPersona) {
        tituloFormularioPersona.textContent = "Editar persona";
    }

    if (descripcionFormularioPersona) {
        descripcionFormularioPersona.textContent = "Modifica los datos de la persona seleccionada.";
    }

    mostrarAlerta(`Editando a ${persona.nombres} ${persona.apellidos}. Modifica los datos y guarda.`, "primary");

    const seccionPersonas = document.getElementById("section-personas");

    if (seccionPersonas) {
        seccionPersonas.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}

function cancelarEdicionPersona(mostrarMensaje = true) {
    personaEditandoId = null;
    estadoPersonaEditando = true;

    if (btnGuardarPersona) {
        btnGuardarPersona.innerHTML = `<i class="bi bi-save-fill"></i> Registrar persona`;
    }

    if (btnCancelarEdicionPersona) {
        btnCancelarEdicionPersona.classList.add("d-none");
    }

    if (tituloFormularioPersona) {
        tituloFormularioPersona.textContent = "Registrar persona";
    }

    if (descripcionFormularioPersona) {
        descripcionFormularioPersona.textContent = "Registra estudiantes o docentes desde un solo formulario.";
    }

    if (mostrarMensaje) {
        formPersona.reset();
        tipoPersonaRegistro.value = "ESTUDIANTE";
        tipoPersonaRegistro.dispatchEvent(new Event("change"));
        mostrarAlerta("Edición cancelada.", "info");
    }
}

async function cambiarEstadoPersona(personaId) {
    const persona = personas.find(p => Number(p.id) === Number(personaId));

    if (!persona) {
        mostrarAlerta("No se encontró la persona seleccionada.", "danger");
        return;
    }

    const nuevoEstado = !persona.estado;
    const accion = nuevoEstado ? "activar" : "desactivar";

    if (!confirm(`¿Seguro que deseas ${accion} a ${persona.nombres} ${persona.apellidos}?`)) {
        return;
    }

    const personaActualizada = {
        nombres: persona.nombres,
        apellidos: persona.apellidos,
        dni: persona.dni,
        correo: persona.correo,
        telefono: persona.telefono,
        tipoPersona: persona.tipoPersona,
        grado: persona.grado,
        seccion: persona.seccion,
        especialidad: persona.especialidad,
        cargo: persona.cargo,
        estado: nuevoEstado
    };

    try {
        const response = await fetch(`${API_PERSONAS}/${persona.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(personaActualizada)
        });

        if (!response.ok) {
            const errorText = await response.text();
            let message = "No se pudo actualizar el estado de la persona.";

            try {
                const errorJson = JSON.parse(errorText);
                message = errorJson.message || message;
            } catch (e) {}

            throw new Error(message);
        }

        mostrarAlerta(
            nuevoEstado
                ? "Persona activada correctamente."
                : "Persona desactivada correctamente.",
            "success"
        );

        await cargarPersonas();
        await cargarReportes();

    } catch (error) {
        mostrarAlerta(error.message, "danger");
        console.error(error);
    }
}

/* =========================
   DASHBOARD
========================= */

function actualizarDashboard() {
    const estudiantes = personas.filter(p => p.tipoPersona === "ESTUDIANTE").length;
    const docentes = personas.filter(p => p.tipoPersona === "DOCENTE").length;

    if (totalPersonas) totalPersonas.textContent = personas.length;
    if (totalEstudiantes) totalEstudiantes.textContent = estudiantes;
    if (totalDocentes) totalDocentes.textContent = docentes;
    if (reportePersonas) reportePersonas.textContent = personas.length;
    if (donutTotalPersonas) donutTotalPersonas.textContent = personas.length;

    if (!donutTipoPersona || !leyendaTipos) {
        return;
    }

    if (personas.length === 0) {
        donutTipoPersona.style.background = "#e2e8f0";
        leyendaTipos.innerHTML = `<p class="text-muted">Sin datos registrados.</p>`;
        return;
    }

    const gradosEstudiantes = (estudiantes / personas.length) * 360;

    donutTipoPersona.style.background = `
        conic-gradient(
            #2563eb 0deg ${gradosEstudiantes}deg,
            #7c3aed ${gradosEstudiantes}deg 360deg
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

/* =========================
   REGISTRO DE ROSTRO
========================= */

function cargarSelectRostro() {
    if (!selectPersonaRostro) {
        return;
    }

    selectPersonaRostro.innerHTML = `<option value="">Selecciona una persona</option>`;

    personas.forEach(persona => {
        const option = document.createElement("option");
        option.value = persona.id;
        option.textContent = `${persona.nombres} ${persona.apellidos} - ${persona.tipoPersona}`;
        selectPersonaRostro.appendChild(option);
    });
}

if (fotoRostro) {
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

        photoPreview.innerHTML = `
            <img src="${imageUrl}" alt="Vista previa de rostro">
        `;
    });
}

if (btnRegistrarRostro) {
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

        if (!persona.estado) {
            mostrarMensajeRostro("No puedes registrar rostro a una persona inactiva.", "danger");
            return;
        }

        const formData = new FormData();
        formData.append("personaId", persona.id);
        formData.append("tipoPersona", persona.tipoPersona);
        formData.append("image", file);

        try {
            const responsePython = await fetch(API_FACE_REGISTER, {
                method: "POST",
                body: formData
            });

            const data = await responsePython.json();

            if (!responsePython.ok) {
                throw new Error(data.message || "No se pudo registrar el rostro.");
            }

            const responseJava = await fetch(
                `${API_PERSONAS}/${persona.id}/rostro?rutaRostro=${encodeURIComponent(data.path)}`,
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

        } catch (error) {
            mostrarMensajeRostro("Error al guardar rostro: " + error.message, "danger");
            console.error(error);
        }
    });
}

/* =========================
   ASISTENCIA Y RECONOCIMIENTO
========================= */

if (fotoAsistencia) {
    fotoAsistencia.addEventListener("change", () => {
        const file = fotoAsistencia.files[0];

        capturedFileAsistencia = null;

        if (!file) {
            previewAsistencia.innerHTML = `
                <div>
                    <i class="bi bi-image"></i>
                    <p>Sin imagen seleccionada</p>
                </div>
            `;
            return;
        }

        const imageUrl = URL.createObjectURL(file);

        previewAsistencia.innerHTML = `
            <img src="${imageUrl}" alt="Imagen para reconocimiento">
        `;
    });
}

async function iniciarCamaraAsistencia() {
    try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error("El navegador no soporta acceso a cámara.");
        }

        videoStreamActive = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: "user",
                width: { ideal: 640 },
                height: { ideal: 480 }
            },
            audio: false
        });

        videoStreamAsistencia.srcObject = videoStreamActive;
        isCameraRunningAsistencia = true;

        btnToggleCameraAsistencia.classList.add("d-none");
        btnCaptureFotoAsistencia.classList.remove("d-none");
        btnStopCameraAsistencia.classList.remove("d-none");

        mostrarMensajeAsistencia("Cámara iniciada correctamente.", "primary");
    } catch (error) {
        mostrarMensajeAsistencia("Permiso de cámara denegado o no disponible: " + error.message, "danger");
        console.error("Error al acceder a cámara:", error);
    }
}

function detenerCamaraAsistencia() {
    if (videoStreamActive) {
        videoStreamActive.getTracks().forEach(track => track.stop());
        videoStreamActive = null;
    }

    if (videoStreamAsistencia) {
        videoStreamAsistencia.srcObject = null;
    }

    isCameraRunningAsistencia = false;

    if (btnToggleCameraAsistencia) btnToggleCameraAsistencia.classList.remove("d-none");
    if (btnCaptureFotoAsistencia) btnCaptureFotoAsistencia.classList.add("d-none");
    if (btnStopCameraAsistencia) btnStopCameraAsistencia.classList.add("d-none");

    capturedFileAsistencia = null;

    if (previewAsistencia) {
        previewAsistencia.innerHTML = `
            <div>
                <i class="bi bi-image"></i>
                <p>Sin imagen seleccionada</p>
            </div>
        `;
    }

    mostrarMensajeAsistencia("Cámara detenida.", "info");
}

function capturarFotoAsistencia() {
    if (!isCameraRunningAsistencia || !videoStreamAsistencia) {
        mostrarMensajeAsistencia("La cámara no está activa.", "danger");
        return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = videoStreamAsistencia.videoWidth;
    canvas.height = videoStreamAsistencia.videoHeight;

    if (canvas.width === 0 || canvas.height === 0) {
        mostrarMensajeAsistencia("La cámara aún no está lista. Intenta nuevamente.", "warning");
        return;
    }

    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoStreamAsistencia, 0, 0);

    canvas.toBlob(blob => {
        if (!blob) {
            mostrarMensajeAsistencia("Error al capturar la foto. Intenta nuevamente.", "danger");
            return;
        }

        const file = new File(
            [blob],
            "captura-asistencia-" + Date.now() + ".jpg",
            { type: "image/jpeg" }
        );

        capturedFileAsistencia = file;

        const imageUrl = URL.createObjectURL(blob);

        previewAsistencia.innerHTML = `
            <img src="${imageUrl}" alt="Captura de cámara">
        `;

        mostrarMensajeAsistencia("Foto capturada correctamente. Presiona 'Reconocer persona'.", "success");
    }, "image/jpeg", 0.95);
}

if (useCameraAsistencia) {
    useCameraAsistencia.addEventListener("change", (e) => {
        cameraSectionAsistencia.classList.toggle("d-none", !e.target.checked);

        if (!e.target.checked) {
            if (isCameraRunningAsistencia) {
                detenerCamaraAsistencia();
            }

            capturedFileAsistencia = null;
        }
    });
}

if (btnToggleCameraAsistencia) {
    btnToggleCameraAsistencia.addEventListener("click", iniciarCamaraAsistencia);
}

if (btnCaptureFotoAsistencia) {
    btnCaptureFotoAsistencia.addEventListener("click", capturarFotoAsistencia);
}

if (btnStopCameraAsistencia) {
    btnStopCameraAsistencia.addEventListener("click", detenerCamaraAsistencia);
}

if (btnReconocerPersona) {
    btnReconocerPersona.addEventListener("click", async () => {
        const file = capturedFileAsistencia || fotoAsistencia.files[0];

        if (!file) {
            mostrarMensajeAsistencia("Selecciona una imagen o captura una foto con la cámara.", "danger");
            return;
        }

        const formData = new FormData();
        formData.append("image", file);

        try {
            mostrarMensajeAsistencia("Analizando rostro, espera un momento...", "primary");

            const responsePython = await fetch(API_FACE_RECOGNIZE, {
                method: "POST",
                body: formData
            });

            const data = await responsePython.json();

            if (!responsePython.ok) {
                throw new Error(data.message || "No se pudo reconocer la imagen.");
            }

            if (!data.recognized) {
                resultadoReconocimiento.innerHTML = `
                    <div class="recognition-result result-error">
                        <div class="empty-result">
                            <i class="bi bi-x-circle-fill text-danger"></i>
                            <h5>No se reconoció a la persona</h5>
                            <p>${data.message || "La imagen no coincide con los rostros registrados."}</p>
                        </div>
                    </div>
                `;

                mostrarMensajeAsistencia("No se encontró coincidencia.", "danger");
                return;
            }

            const responsePersona = await fetch(`${API_PERSONAS}/${data.personaId}`);

            if (!responsePersona.ok) {
                throw new Error("Python reconoció la persona, pero Java no encontró sus datos.");
            }

            const persona = await responsePersona.json();

            let asistenciaMensaje = "";

            if (!persona.estado) {
                asistenciaMensaje = "La persona fue reconocida, pero está inactiva. No se registró asistencia.";
            } else {
                try {
                    const responseAsistencia = await fetch(`${API_ASISTENCIAS}/marcar/${persona.id}`, {
                        method: "POST"
                    });

                    const textoRespuesta = await responseAsistencia.text();

                    if (!responseAsistencia.ok) {
                        let mensajeError = "No se pudo registrar la asistencia.";

                        try {
                            const errorJson = JSON.parse(textoRespuesta);
                            mensajeError = errorJson.message || mensajeError;
                        } catch (e) {
                            mensajeError = textoRespuesta;
                        }

                        asistenciaMensaje = mensajeError;
                    } else {
                        const asistencia = JSON.parse(textoRespuesta);
                        asistenciaMensaje = `Asistencia registrada correctamente. Estado: ${asistencia.estado}. Hora: ${asistencia.hora}`;
                    }

                } catch (errorAsistencia) {
                    asistenciaMensaje = "La persona fue reconocida, pero ocurrió un error al registrar asistencia.";
                    console.error(errorAsistencia);
                }
            }

            resultadoReconocimiento.innerHTML = `
                <div class="recognition-result result-success">
                    <div class="result-person">
                        <div class="result-icon">
                            <i class="bi bi-person-check-fill"></i>
                        </div>

                        <div class="result-data">
                            <h4>${persona.nombres} ${persona.apellidos}</h4>
                            <p><strong>Tipo:</strong> ${persona.tipoPersona}</p>
                            <p><strong>DNI:</strong> ${persona.dni}</p>
                            <p><strong>Detalle:</strong> ${obtenerDetallePersona(persona)}</p>
                            <p><strong>Estado:</strong> ${persona.estado ? "Activo" : "Inactivo"}</p>
                            <p><strong>Rostro registrado:</strong> ${persona.rostroRegistrado ? "Sí" : "No"}</p>
                        </div>
                    </div>

                    <div class="confidence-box">
                        Coincidencia encontrada | Confianza: ${Number(data.confidence).toFixed(2)}
                    </div>

                    <div class="confidence-box mt-3">
                        ${asistenciaMensaje}
                    </div>
                </div>
            `;

            await cargarAsistencias();
            await cargarReportes();

            mostrarMensajeAsistencia("Persona reconocida correctamente.", "success");

        } catch (error) {
            resultadoReconocimiento.innerHTML = `
                <div class="recognition-result result-error">
                    <div class="empty-result">
                        <i class="bi bi-exclamation-triangle-fill text-danger"></i>
                        <h5>Error en reconocimiento</h5>
                        <p>${error.message}</p>
                    </div>
                </div>
            `;

            mostrarMensajeAsistencia(error.message, "danger");
            console.error(error);
        }
    });
}

/* =========================
   HISTORIAL DE ASISTENCIAS
========================= */

async function cargarAsistencias() {
    if (!tablaAsistencias) {
        return;
    }

    try {
        const response = await fetch(API_ASISTENCIAS);

        if (!response.ok) {
            throw new Error("No se pudo cargar el historial de asistencias.");
        }

        const asistencias = await response.json();

        renderTablaAsistencias(asistencias);

    } catch (error) {
        tablaAsistencias.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-danger py-4">
                    Error al cargar asistencias. Verifica que Spring Boot esté encendido.
                </td>
            </tr>
        `;

        console.error(error);
    }
}

function renderTablaAsistencias(asistencias) {
    if (!tablaAsistencias) {
        return;
    }

    tablaAsistencias.innerHTML = "";

    if (asistencias.length === 0) {
        tablaAsistencias.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-muted py-4">
                    Todavía no hay asistencias registradas.
                </td>
            </tr>
        `;
        return;
    }

    asistencias
        .slice()
        .reverse()
        .forEach(asistencia => {
            const persona = asistencia.persona || {};
            const estado = asistencia.estado || "PRESENTE";

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${asistencia.id}</td>
                <td>
                    <div class="attendance-person">
                        ${persona.nombres || ""} ${persona.apellidos || ""}
                    </div>
                    <div class="attendance-sub">
                        DNI: ${persona.dni || "-"}
                    </div>
                </td>
                <td>
                    <span class="badge-custom ${persona.tipoPersona === "ESTUDIANTE" ? "badge-student" : "badge-teacher"}">
                        ${persona.tipoPersona || "SIN TIPO"}
                    </span>
                </td>
                <td>${asistencia.fecha}</td>
                <td>${asistencia.hora}</td>
                <td>
                    <span class="${obtenerClaseEstado(estado)}">
                        ${estado}
                    </span>
                </td>
                <td>
                    <span class="badge-method">
                        ${asistencia.metodoRegistro}
                    </span>
                </td>
            `;

            tablaAsistencias.appendChild(row);
        });
}

/* =========================
   REGISTRO MANUAL DE FALTA
========================= */

function cargarSelectPersonaFalta() {
    if (!selectPersonaFalta) {
        return;
    }

    selectPersonaFalta.innerHTML = `<option value="">Selecciona una persona</option>`;

    personas
        .filter(persona => persona.estado)
        .forEach(persona => {
            const option = document.createElement("option");
            option.value = persona.id;
            option.textContent = `${persona.nombres} ${persona.apellidos} - ${persona.tipoPersona}`;
            selectPersonaFalta.appendChild(option);
        });
}

if (btnRegistrarFaltaManual) {
    btnRegistrarFaltaManual.addEventListener("click", async () => {
        const personaId = selectPersonaFalta.value;

        if (!personaId) {
            mostrarMensajeAccionAsistencia("Selecciona una persona activa para registrar falta.", "danger");
            return;
        }

        try {
            const response = await fetch(`${API_ASISTENCIAS}/falta/${personaId}`, {
                method: "POST"
            });

            const textoRespuesta = await response.text();

            if (!response.ok) {
                let mensajeError = "No se pudo registrar la falta.";

                try {
                    const errorJson = JSON.parse(textoRespuesta);
                    mensajeError = errorJson.message || mensajeError;
                } catch (e) {
                    mensajeError = textoRespuesta;
                }

                throw new Error(mensajeError);
            }

            mostrarMensajeAccionAsistencia("Falta registrada correctamente.", "success");

            await cargarAsistencias();
            await cargarReportes();

        } catch (error) {
            mostrarMensajeAccionAsistencia(error.message, "danger");
            console.error(error);
        }
    });
}

/* =========================
   REPORTES
========================= */

async function cargarReportes() {
    const tablaReportes = document.getElementById("tablaUltimasAsistencias");

    if (!tablaReportes && !reporteTotalAsistencias) {
        return;
    }

    try {
        const response = await fetch(API_ASISTENCIAS);

        if (!response.ok) {
            throw new Error("No se pudo cargar la información de reportes.");
        }

        asistenciasReporteGlobal = await response.json();

        prepararFiltrosReportes();
        aplicarFiltrosReportes();

    } catch (error) {
        console.error(error);

        if (tablaUltimasAsistencias) {
            tablaUltimasAsistencias.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center text-danger py-4">
                        Error al cargar reportes. Verifica que Spring Boot esté encendido.
                    </td>
                </tr>
            `;
        }
    }
}

function prepararFiltrosReportes() {
    const filtroFechaInicio = document.getElementById("filtroFechaInicioReporte");
    const filtroFechaFin = document.getElementById("filtroFechaFinReporte");
    const filtroTipo = document.getElementById("filtroTipoReporte");
    const filtroEstado = document.getElementById("filtroEstadoReporte");
    const btnFiltrar = document.getElementById("btnFiltrarReportes");
    const btnLimpiar = document.getElementById("btnLimpiarReportes");
    const btnExcel = document.getElementById("btnExportarExcel");
    const btnPDF = document.getElementById("btnImprimirPDF");

    if (filtroFechaInicio && !filtroFechaInicio.value) {
        filtroFechaInicio.value = obtenerFechaActual();
    }

    if (filtroFechaFin && !filtroFechaFin.value) {
        filtroFechaFin.value = obtenerFechaActual();
    }

    if (filtroTipo && !filtroTipo.value) {
        filtroTipo.value = "TODOS";
    }

    if (filtroEstado && !filtroEstado.value) {
        filtroEstado.value = "TODOS";
    }

    if (btnFiltrar && !btnFiltrar.dataset.listener) {
        btnFiltrar.addEventListener("click", aplicarFiltrosReportes);
        btnFiltrar.dataset.listener = "true";
    }

    if (btnLimpiar && !btnLimpiar.dataset.listener) {
        btnLimpiar.addEventListener("click", () => {
            if (filtroFechaInicio) filtroFechaInicio.value = "";
            if (filtroFechaFin) filtroFechaFin.value = "";
            if (filtroTipo) filtroTipo.value = "TODOS";
            if (filtroEstado) filtroEstado.value = "TODOS";

            aplicarFiltrosReportes();
        });

        btnLimpiar.dataset.listener = "true";
    }

    if (btnExcel && !btnExcel.dataset.listener) {
        btnExcel.addEventListener("click", exportarReporteExcel);
        btnExcel.dataset.listener = "true";
    }

    if (btnPDF && !btnPDF.dataset.listener) {
        btnPDF.addEventListener("click", imprimirReportePDF);
        btnPDF.dataset.listener = "true";
    }
}

function obtenerAsistenciasFiltradas() {
    const filtroFechaInicio = document.getElementById("filtroFechaInicioReporte");
    const filtroFechaFin = document.getElementById("filtroFechaFinReporte");
    const filtroTipo = document.getElementById("filtroTipoReporte");
    const filtroEstado = document.getElementById("filtroEstadoReporte");

    const fechaInicio = filtroFechaInicio ? filtroFechaInicio.value : "";
    const fechaFin = filtroFechaFin ? filtroFechaFin.value : "";
    const tipoSeleccionado = filtroTipo ? filtroTipo.value : "TODOS";
    const estadoSeleccionado = filtroEstado ? filtroEstado.value : "TODOS";

    return asistenciasReporteGlobal.filter(asistencia => {
        const fechaAsistencia = asistencia.fecha;

        const coincideFechaInicio = !fechaInicio || fechaAsistencia >= fechaInicio;
        const coincideFechaFin = !fechaFin || fechaAsistencia <= fechaFin;
        const coincideTipo = tipoSeleccionado === "TODOS" || asistencia.persona?.tipoPersona === tipoSeleccionado;
        const coincideEstado = estadoSeleccionado === "TODOS" || asistencia.estado === estadoSeleccionado;

        return coincideFechaInicio && coincideFechaFin && coincideTipo && coincideEstado;
    });
}

function aplicarFiltrosReportes() {
    const filtroFechaInicio = document.getElementById("filtroFechaInicioReporte");
    const filtroFechaFin = document.getElementById("filtroFechaFinReporte");

    const fechaInicio = filtroFechaInicio ? filtroFechaInicio.value : "";
    const fechaFin = filtroFechaFin ? filtroFechaFin.value : "";

    if (fechaInicio && fechaFin && fechaInicio > fechaFin) {
        mostrarMensajeReporte("La fecha inicio no puede ser mayor que la fecha fin.");
        return;
    }

    const asistenciasFiltradas = obtenerAsistenciasFiltradas();

    actualizarReportes(asistenciasFiltradas);
    renderUltimasAsistencias(asistenciasFiltradas);
    mostrarMensajeReporte(`Se encontraron ${asistenciasFiltradas.length} asistencia(s).`);
}

function actualizarReportes(asistencias) {
    if (!reporteTotalAsistencias) {
        return;
    }

    const estudiantes = asistencias.filter(a => a.persona?.tipoPersona === "ESTUDIANTE").length;
    const docentes = asistencias.filter(a => a.persona?.tipoPersona === "DOCENTE").length;

    if (reportePersonas) reportePersonas.textContent = personas.length;
    if (reporteTotalAsistencias) reporteTotalAsistencias.textContent = asistencias.length;
    if (reporteAsistenciasHoy) reporteAsistenciasHoy.textContent = estudiantes;
    if (reportePresentesHoy) reportePresentesHoy.textContent = docentes;
    if (donutTotalReportes) donutTotalReportes.textContent = asistencias.length;

    if (!donutReportes || !leyendaReportes) {
        return;
    }

    if (asistencias.length === 0) {
        donutReportes.style.background = "#e2e8f0";
        leyendaReportes.innerHTML = `<p class="text-muted">No hay asistencias con los filtros seleccionados.</p>`;
        return;
    }

    const gradosEstudiantes = (estudiantes / asistencias.length) * 360;

    donutReportes.style.background = `
        conic-gradient(
            #2563eb 0deg ${gradosEstudiantes}deg,
            #7c3aed ${gradosEstudiantes}deg 360deg
        )
    `;

    leyendaReportes.innerHTML = `
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

function renderUltimasAsistencias(asistencias) {
    if (!tablaUltimasAsistencias) {
        return;
    }

    tablaUltimasAsistencias.innerHTML = "";

    if (asistencias.length === 0) {
        tablaUltimasAsistencias.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-muted py-4">
                    No hay asistencias para mostrar.
                </td>
            </tr>
        `;
        return;
    }

    asistencias
        .slice()
        .reverse()
        .forEach(asistencia => {
            const persona = asistencia.persona || {};
            const estado = asistencia.estado || "PRESENTE";

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>
                    <div class="report-mini-name">
                        ${persona.nombres || ""} ${persona.apellidos || ""}
                    </div>
                    <div class="report-mini-sub">
                        ID asistencia: ${asistencia.id}
                    </div>
                </td>

                <td>
                    <span class="badge-custom ${persona.tipoPersona === "ESTUDIANTE" ? "badge-student" : "badge-teacher"}">
                        ${persona.tipoPersona || "SIN TIPO"}
                    </span>
                </td>

                <td>${persona.dni || "-"}</td>

                <td>
                    <span class="badge-report-date">
                        ${asistencia.fecha}
                    </span>
                </td>

                <td>${asistencia.hora}</td>

                <td>
                    <span class="${obtenerClaseEstado(estado)}">
                        ${estado}
                    </span>
                </td>

                <td>
                    <div class="estado-actions">
                        <select class="form-select form-select-sm" id="estado-${asistencia.id}">
                            <option value="PRESENTE" ${estado === "PRESENTE" ? "selected" : ""}>Presente</option>
                            <option value="TARDANZA" ${estado === "TARDANZA" ? "selected" : ""}>Tardanza</option>
                            <option value="FALTA" ${estado === "FALTA" ? "selected" : ""}>Falta</option>
                            <option value="JUSTIFICADO" ${estado === "JUSTIFICADO" ? "selected" : ""}>Justificado</option>
                        </select>

                        <button class="btn btn-light-custom btn-sm" onclick="actualizarEstadoAsistencia(${asistencia.id})">
                            Guardar
                        </button>
                    </div>
                </td>
            `;

            tablaUltimasAsistencias.appendChild(row);
        });
}

async function actualizarEstadoAsistencia(asistenciaId) {
    const selectEstado = document.getElementById(`estado-${asistenciaId}`);

    if (!selectEstado) {
        mostrarMensajeAccionAsistencia("No se encontró el selector de estado.", "danger");
        return;
    }

    const nuevoEstado = selectEstado.value;

    try {
        const response = await fetch(`${API_ASISTENCIAS}/${asistenciaId}/estado?estado=${nuevoEstado}`, {
            method: "PATCH"
        });

        const textoRespuesta = await response.text();

        if (!response.ok) {
            let mensajeError = "No se pudo actualizar el estado.";

            try {
                const errorJson = JSON.parse(textoRespuesta);
                mensajeError = errorJson.message || mensajeError;
            } catch (e) {
                mensajeError = textoRespuesta;
            }

            throw new Error(mensajeError);
        }

        mostrarMensajeAccionAsistencia(`Estado actualizado a ${nuevoEstado}.`, "success");

        await cargarAsistencias();
        await cargarReportes();

    } catch (error) {
        mostrarMensajeAccionAsistencia(error.message, "danger");
        console.error(error);
    }
}

function exportarReporteExcel() {
    const asistenciasFiltradas = obtenerAsistenciasFiltradas();

    if (asistenciasFiltradas.length === 0) {
        mostrarMensajeReporte("No hay datos para exportar.");
        return;
    }

    let contenido = "\uFEFF";
    contenido += "ID,Persona,Tipo,DNI,Fecha,Hora,Estado,Metodo\n";

    asistenciasFiltradas.forEach(asistencia => {
        const persona = asistencia.persona || {};
        const nombreCompleto = `${persona.nombres || ""} ${persona.apellidos || ""}`.trim();

        contenido += [
            asistencia.id,
            limpiarCSV(nombreCompleto),
            persona.tipoPersona || "",
            persona.dni || "",
            asistencia.fecha || "",
            asistencia.hora || "",
            asistencia.estado || "",
            asistencia.metodoRegistro || ""
        ].join(",") + "\n";
    });

    const blob = new Blob([contenido], {
        type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);
    const enlace = document.createElement("a");

    enlace.href = url;
    enlace.download = `reporte_asistencias_${obtenerFechaActual()}.csv`;
    enlace.click();

    URL.revokeObjectURL(url);

    mostrarMensajeReporte("Reporte exportado correctamente. Puedes abrirlo con Excel.");
}

function imprimirReportePDF() {
    const asistenciasFiltradas = obtenerAsistenciasFiltradas();

    if (asistenciasFiltradas.length === 0) {
        mostrarMensajeReporte("No hay datos para imprimir.");
        return;
    }

    const fechaInicio = document.getElementById("filtroFechaInicioReporte")?.value || "Todas";
    const fechaFin = document.getElementById("filtroFechaFinReporte")?.value || "Todas";
    const filtroTipo = document.getElementById("filtroTipoReporte")?.value || "TODOS";
    const filtroEstado = document.getElementById("filtroEstadoReporte")?.value || "TODOS";

    let filas = "";

    asistenciasFiltradas.forEach(asistencia => {
        const persona = asistencia.persona || {};
        const nombreCompleto = `${persona.nombres || ""} ${persona.apellidos || ""}`.trim();

        filas += `
            <tr>
                <td>${asistencia.id}</td>
                <td>${nombreCompleto}</td>
                <td>${persona.tipoPersona || ""}</td>
                <td>${persona.dni || ""}</td>
                <td>${asistencia.fecha || ""}</td>
                <td>${asistencia.hora || ""}</td>
                <td>${asistencia.estado || ""}</td>
                <td>${asistencia.metodoRegistro || ""}</td>
            </tr>
        `;
    });

    const ventana = window.open("", "_blank");

    ventana.document.write(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <title>Reporte de Asistencias</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    padding: 30px;
                    color: #0f172a;
                }

                h1 {
                    text-align: center;
                    margin-bottom: 5px;
                }

                .subtitle {
                    text-align: center;
                    color: #64748b;
                    margin-bottom: 25px;
                }

                .info {
                    margin-bottom: 20px;
                    padding: 12px;
                    background: #eff6ff;
                    border-radius: 8px;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 12px;
                }

                th {
                    background: #2563eb;
                    color: white;
                    padding: 9px;
                    border: 1px solid #ddd;
                }

                td {
                    padding: 8px;
                    border: 1px solid #ddd;
                }

                tr:nth-child(even) {
                    background: #f8fafc;
                }

                .footer {
                    margin-top: 25px;
                    font-size: 12px;
                    color: #64748b;
                    text-align: center;
                }
            </style>
        </head>
        <body>
            <h1>Reporte de Asistencias</h1>
            <p class="subtitle">Sistema de Asistencia Facial</p>

            <div class="info">
                <strong>Fecha inicio:</strong> ${fechaInicio}<br>
                <strong>Fecha fin:</strong> ${fechaFin}<br>
                <strong>Tipo filtrado:</strong> ${filtroTipo}<br>
                <strong>Estado filtrado:</strong> ${filtroEstado}<br>
                <strong>Total registros:</strong> ${asistenciasFiltradas.length}
            </div>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Persona</th>
                        <th>Tipo</th>
                        <th>DNI</th>
                        <th>Fecha</th>
                        <th>Hora</th>
                        <th>Estado</th>
                        <th>Método</th>
                    </tr>
                </thead>
                <tbody>
                    ${filas}
                </tbody>
            </table>

            <div class="footer">
                Reporte generado automáticamente por el Sistema de Asistencia Facial.
            </div>

            <script>
                window.onload = function() {
                    window.print();
                };
            </script>
        </body>
        </html>
    `);

    ventana.document.close();

    mostrarMensajeReporte("Ventana de impresión abierta. Puedes guardar como PDF.");
}

function limpiarCSV(valor) {
    const texto = String(valor).replace(/"/g, '""');
    return `"${texto}"`;
}

/* =========================
   UTILIDADES
========================= */

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

function obtenerDetallePersona(persona) {
    if (persona.tipoPersona === "ESTUDIANTE") {
        return `${persona.grado || "Sin grado"} - Sección ${persona.seccion || "-"}`;
    }

    if (persona.tipoPersona === "DOCENTE") {
        return `${persona.especialidad || "Sin especialidad"} / ${persona.cargo || "Sin cargo"}`;
    }

    return "Sin detalle";
}

function obtenerFechaActual() {
    const fecha = new Date();
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, "0");
    const day = String(fecha.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function obtenerClaseEstado(estado) {
    if (estado === "PRESENTE") {
        return "badge-present";
    }

    if (estado === "TARDANZA") {
        return "badge-tardanza";
    }

    if (estado === "FALTA") {
        return "badge-falta";
    }

    if (estado === "JUSTIFICADO") {
        return "badge-justificado";
    }

    return "badge-method";
}

function mostrarAlerta(texto, tipo) {
    if (!globalAlert) {
        return;
    }

    globalAlert.className = `alert alert-${tipo}`;
    globalAlert.textContent = texto;
    globalAlert.classList.remove("d-none");

    setTimeout(() => {
        globalAlert.classList.add("d-none");
    }, 4500);
}

function mostrarMensajeRostro(texto, tipo) {
    if (!mensajeRostro) {
        return;
    }

    mensajeRostro.className = `mt-3 fw-bold text-${tipo}`;
    mensajeRostro.textContent = texto;

    setTimeout(() => {
        mensajeRostro.textContent = "";
    }, 5000);
}

function mostrarMensajeAsistencia(texto, tipo) {
    if (!mensajeAsistencia) {
        return;
    }

    mensajeAsistencia.className = `mt-3 fw-bold text-${tipo}`;
    mensajeAsistencia.textContent = texto;

    setTimeout(() => {
        mensajeAsistencia.textContent = "";
    }, 5000);
}

function mostrarMensajeReporte(mensaje) {
    const mensajeReporte = document.getElementById("mensajeReporte");

    if (!mensajeReporte) {
        return;
    }

    mensajeReporte.className = "mt-3 fw-bold text-primary";
    mensajeReporte.textContent = mensaje;

    setTimeout(() => {
        mensajeReporte.textContent = "";
    }, 4000);
}

function mostrarMensajeAccionAsistencia(mensaje, tipo) {
    const mensajeAccion = document.getElementById("mensajeAccionAsistencia") || document.getElementById("mensajeReporte");

    if (!mensajeAccion) {
        return;
    }

    mensajeAccion.className = `mt-3 fw-bold text-${tipo}`;
    mensajeAccion.textContent = mensaje;

    setTimeout(() => {
        mensajeAccion.textContent = "";
    }, 4000);
}

function obtenerIniciales(nombre) {
    return nombre
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map(p => p[0].toUpperCase())
        .join("");
}