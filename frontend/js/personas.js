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

// Camera elements - Asistencia
const useCameraAsistencia = document.getElementById("useCameraAsistencia");
const cameraSectionAsistencia = document.getElementById("cameraSectionAsistencia");
const videoStreamAsistencia = document.getElementById("videoStreamAsistencia");
const btnToggleCameraAsistencia = document.getElementById("btnToggleCameraAsistencia");
const btnCaptureFotoAsistencia = document.getElementById("btnCaptureFotoAsistencia");
const btnStopCameraAsistencia = document.getElementById("btnStopCameraAsistencia");

// Camera state - Asistencia
let videoStreamActive = null;
let isCameraRunningAsistencia = false;
let capturedFileAsistencia = null;

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
    cargarAsistencias();
    cargarReportes();
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

        pageTitle.textContent = pageInfo[section][0];
        pageDescription.textContent = pageInfo[section][1];

        if (section === "asistencia") {
            cargarAsistencias();
        }

        if (section === "reportes") {
            cargarReportes();
        }
    });
});

btnPerfilRapido.addEventListener("click", () => {
    document.querySelector('[data-section="perfil"]').click();
});

/* =========================
   FORMULARIO DINÁMICO
========================= */

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

/* =========================
   REGISTRO DE PERSONAS
========================= */

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
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(persona)
        });

        if (!response.ok) {
            const errorText = await response.text();
            let message = "No se pudo registrar. Verifica que el DNI no esté repetido.";

            try {
                const errorJson = JSON.parse(errorText);
                message = errorJson.message || message;
            } catch (e) {}

            throw new Error(message);
        }

        mostrarAlerta("Persona registrada correctamente en MySQL.", "success");

        formPersona.reset();
        tipoPersonaRegistro.value = "ESTUDIANTE";
        tipoPersonaRegistro.dispatchEvent(new Event("change"));

        await cargarPersonas();
        await cargarReportes();

    } catch (error) {
        mostrarAlerta(error.message, "danger");
        console.error(error);
    }
});

btnActualizarPersonas.addEventListener("click", cargarPersonas);

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
    try {
        const response = await fetch(API_PERSONAS);

        if (!response.ok) {
            throw new Error("No se pudo cargar la lista de personas.");
        }

        personas = await response.json();

        renderTablaPersonas();
        actualizarDashboard();
        cargarSelectRostro();

    } catch (error) {
        personas = [];

        tablaPersonas.innerHTML = `
            <tr>
                <td colspan="6" class="text-center text-danger py-4">
                    Error al cargar personas. Verifica que Spring Boot esté encendido.
                </td>
            </tr>
        `;

        actualizarDashboard();
        cargarSelectRostro();

        console.error(error);
    }
}

function renderTablaPersonas() {
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
                <span class="badge text-bg-success">
                    ${persona.estado ? "Activo" : "Inactivo"}
                </span>
            </td>
        `;

        tablaPersonas.appendChild(row);
    });
}

/* =========================
   DASHBOARD
========================= */

function actualizarDashboard() {
    const estudiantes = personas.filter(p => p.tipoPersona === "ESTUDIANTE").length;
    const docentes = personas.filter(p => p.tipoPersona === "DOCENTE").length;

    totalPersonas.textContent = personas.length;
    totalEstudiantes.textContent = estudiantes;
    totalDocentes.textContent = docentes;

    if (reportePersonas) {
        reportePersonas.textContent = personas.length;
    }

    donutTotalPersonas.textContent = personas.length;

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

    photoPreview.innerHTML = `
        <img src="${imageUrl}" alt="Vista previa de rostro">
    `;
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

/* =========================
   ASISTENCIA Y RECONOCIMIENTO
========================= */

if (fotoAsistencia) {
    fotoAsistencia.addEventListener("change", () => {
        const file = fotoAsistencia.files[0];

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

// Camera functions - Asistencia
async function iniciarCamaraAsistencia() {
    try {
        videoStreamActive = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
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
    
    videoStreamAsistencia.srcObject = null;
    isCameraRunningAsistencia = false;
    
    btnToggleCameraAsistencia.classList.remove("d-none");
    btnCaptureFotoAsistencia.classList.add("d-none");
    btnStopCameraAsistencia.classList.add("d-none");
    
    previewAsistencia.innerHTML = `
        <div>
            <i class="bi bi-image"></i>
            <p>Sin imagen seleccionada</p>
        </div>
    `;
    
    mostrarMensajeAsistencia("Cámara detenida.", "info");
}

function capturarFotoAsistencia() {
    if (!isCameraRunningAsistencia) {
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
        
        const file = new File([blob], "captura-asistencia-" + Date.now() + ".jpg", { type: "image/jpeg" });
        capturedFileAsistencia = file;
        
        const imageUrl = URL.createObjectURL(blob);
        previewAsistencia.innerHTML = `
            <img src="${imageUrl}" alt="Captura de cámara" style="width: 100%; border-radius: 8px;">
        `;
        
        mostrarMensajeAsistencia("Foto capturada correctamente. Presiona 'Reconocer persona'.", "success");
    }, "image/jpeg", 0.95);
}

// Event listeners - Camera toggle
useCameraAsistencia.addEventListener("change", (e) => {
    cameraSectionAsistencia.classList.toggle("d-none", !e.target.checked);
    
    if (!e.target.checked) {
        // Si se desactiva, detener la cámara
        if (isCameraRunningAsistencia) {
            detenerCamaraAsistencia();
        }
        capturedFileAsistencia = null;
    }
});

btnToggleCameraAsistencia.addEventListener("click", iniciarCamaraAsistencia);

btnCaptureFotoAsistencia.addEventListener("click", capturarFotoAsistencia);

btnStopCameraAsistencia.addEventListener("click", detenerCamaraAsistencia);

if (btnReconocerPersona) {
    btnReconocerPersona.addEventListener("click", async () => {
        // Prioridad: archivo capturado de cámara, luego archivo subido
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
                    asistenciaMensaje = `Asistencia registrada correctamente. Hora: ${asistencia.hora}`;
                }

            } catch (errorAsistencia) {
                asistenciaMensaje = "La persona fue reconocida, pero ocurrió un error al registrar asistencia.";
                console.error(errorAsistencia);
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
            const persona = asistencia.persona;

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${asistencia.id}</td>
                <td>
                    <div class="attendance-person">
                        ${persona.nombres} ${persona.apellidos}
                    </div>
                    <div class="attendance-sub">
                        DNI: ${persona.dni}
                    </div>
                </td>
                <td>
                    <span class="badge-custom ${persona.tipoPersona === "ESTUDIANTE" ? "badge-student" : "badge-teacher"}">
                        ${persona.tipoPersona}
                    </span>
                </td>
                <td>${asistencia.fecha}</td>
                <td>${asistencia.hora}</td>
                <td>
                    <span class="badge-present">
                        ${asistencia.estado}
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
   REPORTES
========================= */

async function cargarReportes() {
    try {
        const response = await fetch(API_ASISTENCIAS);

        if (!response.ok) {
            throw new Error("No se pudo cargar la información de reportes.");
        }

        const asistencias = await response.json();

        actualizarReportes(asistencias);
        renderUltimasAsistencias(asistencias);

    } catch (error) {
        console.error(error);

        if (tablaUltimasAsistencias) {
            tablaUltimasAsistencias.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center text-danger py-4">
                        Error al cargar reportes. Verifica que Spring Boot esté encendido.
                    </td>
                </tr>
            `;
        }
    }
}

function actualizarReportes(asistencias) {
    if (!reporteTotalAsistencias) return;

    const hoy = obtenerFechaActual();
    const asistenciasHoy = asistencias.filter(a => a.fecha === hoy);

    const estudiantesHoy = asistenciasHoy.filter(a => a.persona?.tipoPersona === "ESTUDIANTE").length;
    const docentesHoy = asistenciasHoy.filter(a => a.persona?.tipoPersona === "DOCENTE").length;

    reportePersonas.textContent = personas.length;
    reporteTotalAsistencias.textContent = asistencias.length;
    reporteAsistenciasHoy.textContent = asistenciasHoy.length;
    reportePresentesHoy.textContent = asistenciasHoy.length;

    donutTotalReportes.textContent = asistenciasHoy.length;

    if (asistenciasHoy.length === 0) {
        donutReportes.style.background = "#e2e8f0";
        leyendaReportes.innerHTML = `<p class="text-muted">No hay asistencias registradas hoy.</p>`;
        return;
    }

    const gradosEstudiantes = (estudiantesHoy / asistenciasHoy.length) * 360;

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
                Estudiantes presentes hoy
            </div>
            <strong>${estudiantesHoy}</strong>
        </div>

        <div class="legend-item">
            <div class="legend-left">
                <span class="legend-dot" style="background:#7c3aed"></span>
                Docentes presentes hoy
            </div>
            <strong>${docentesHoy}</strong>
        </div>
    `;
}

function renderUltimasAsistencias(asistencias) {
    if (!tablaUltimasAsistencias) return;

    tablaUltimasAsistencias.innerHTML = "";

    if (asistencias.length === 0) {
        tablaUltimasAsistencias.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-muted py-4">
                    Todavía no hay asistencias registradas.
                </td>
            </tr>
        `;
        return;
    }

    asistencias
        .slice()
        .reverse()
        .slice(0, 8)
        .forEach(asistencia => {
            const persona = asistencia.persona;

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>
                    <div class="report-mini-name">
                        ${persona.nombres} ${persona.apellidos}
                    </div>
                    <div class="report-mini-sub">
                        DNI: ${persona.dni}
                    </div>
                </td>

                <td>
                    <span class="badge-custom ${persona.tipoPersona === "ESTUDIANTE" ? "badge-student" : "badge-teacher"}">
                        ${persona.tipoPersona}
                    </span>
                </td>

                <td>
                    <span class="badge-report-date">
                        ${asistencia.fecha}
                    </span>
                </td>

                <td>${asistencia.hora}</td>

                <td>
                    <span class="badge-present">
                        ${asistencia.estado}
                    </span>
                </td>
            `;

            tablaUltimasAsistencias.appendChild(row);
        });
}

function obtenerFechaActual() {
    const fecha = new Date();
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, "0");
    const day = String(fecha.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

/* =========================
   PERFIL ADMIN
========================= */

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

function mostrarAlerta(texto, tipo) {
    globalAlert.className = `alert alert-${tipo}`;
    globalAlert.textContent = texto;
    globalAlert.classList.remove("d-none");

    setTimeout(() => {
        globalAlert.classList.add("d-none");
    }, 4500);
}

function mostrarMensajeRostro(texto, tipo) {
    mensajeRostro.className = `mt-3 fw-bold text-${tipo}`;
    mensajeRostro.textContent = texto;

    setTimeout(() => {
        mensajeRostro.textContent = "";
    }, 5000);
}

function mostrarMensajeAsistencia(texto, tipo) {
    mensajeAsistencia.className = `mt-3 fw-bold text-${tipo}`;
    mensajeAsistencia.textContent = texto;

    setTimeout(() => {
        mensajeAsistencia.textContent = "";
    }, 5000);
}

function mostrarMensajePerfil(texto, tipo) {
    const mensajePerfil = document.getElementById("mensajePerfil");
    mensajePerfil.className = `mt-3 fw-bold text-${tipo}`;
    mensajePerfil.textContent = texto;

    setTimeout(() => {
        mensajePerfil.textContent = "";
    }, 4500);
}

function obtenerIniciales(nombre) {
    return nombre
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map(p => p[0].toUpperCase())
        .join("");
}