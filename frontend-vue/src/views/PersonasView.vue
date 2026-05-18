<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import {
  actualizarPersona,
  listarPersonas,
  registrarPersona,
  type Persona,
  type TipoPersona,
} from "../services/personaService";
import { useAuthStore } from "../stores/authStore";

const router = useRouter();
const authStore = useAuthStore();

const personas = ref<Persona[]>([]);
const cargando = ref(true);
const guardando = ref(false);
const error = ref("");
const mensaje = ref("");

const filtroActual = ref<"TODOS" | TipoPersona>("TODOS");

const personaEditandoId = ref<number | null>(null);
const estadoPersonaEditando = ref(true);

const formulario = ref<Persona>({
  nombres: "",
  apellidos: "",
  dni: "",
  correo: "",
  telefono: "",
  tipoPersona: "ESTUDIANTE",
  grado: "",
  seccion: "",
  especialidad: "",
  cargo: "",
  estado: true,
});

const personasFiltradas = computed(() => {
  if (filtroActual.value === "TODOS") {
    return personas.value;
  }

  return personas.value.filter((persona) => persona.tipoPersona === filtroActual.value);
});

const totalPersonas = computed(() => personas.value.length);
const totalEstudiantes = computed(
  () => personas.value.filter((persona) => persona.tipoPersona === "ESTUDIANTE").length
);
const totalDocentes = computed(
  () => personas.value.filter((persona) => persona.tipoPersona === "DOCENTE").length
);
const totalActivos = computed(
  () => personas.value.filter((persona) => persona.estado).length
);

async function cargarPersonas() {
  try {
    cargando.value = true;
    error.value = "";
    personas.value = await listarPersonas();
  } catch (e) {
    error.value = "No se pudo cargar la lista de personas. Verifica que Spring Boot esté encendido.";
    console.error(e);
  } finally {
    cargando.value = false;
  }
}

async function guardarPersona() {
  limpiarMensajes();

  if (!validarFormulario()) {
    error.value = "Completa los campos obligatorios según el tipo de persona.";
    return;
  }

  try {
    guardando.value = true;

    const personaPayload: Persona = {
      nombres: formulario.value.nombres.trim(),
      apellidos: formulario.value.apellidos.trim(),
      dni: formulario.value.dni.trim(),
      correo: formulario.value.correo?.trim() || "",
      telefono: formulario.value.telefono?.trim() || "",
      tipoPersona: formulario.value.tipoPersona,
      grado: formulario.value.tipoPersona === "ESTUDIANTE" ? formulario.value.grado?.trim() || "" : "",
      seccion: formulario.value.tipoPersona === "ESTUDIANTE" ? formulario.value.seccion?.trim() || "" : "",
      especialidad:
        formulario.value.tipoPersona === "DOCENTE" ? formulario.value.especialidad?.trim() || "" : "",
      cargo: formulario.value.tipoPersona === "DOCENTE" ? formulario.value.cargo?.trim() || "" : "",
      estado: personaEditandoId.value ? estadoPersonaEditando.value : true,
    };

    if (personaEditandoId.value) {
      await actualizarPersona(personaEditandoId.value, personaPayload);
      mensaje.value = "Persona actualizada correctamente.";
    } else {
      await registrarPersona(personaPayload);
      mensaje.value = "Persona registrada correctamente.";
    }

    resetearFormulario();
    await cargarPersonas();
  } catch (e: any) {
    error.value =
      e?.response?.data?.message ||
      "No se pudo guardar la persona. Verifica que el DNI no esté repetido.";
    console.error(e);
  } finally {
    guardando.value = false;
  }
}

function editarPersona(persona: Persona) {
  if (!persona.id) return;

  personaEditandoId.value = persona.id;
  estadoPersonaEditando.value = persona.estado;

  formulario.value = {
    nombres: persona.nombres || "",
    apellidos: persona.apellidos || "",
    dni: persona.dni || "",
    correo: persona.correo || "",
    telefono: persona.telefono || "",
    tipoPersona: persona.tipoPersona || "ESTUDIANTE",
    grado: persona.grado || "",
    seccion: persona.seccion || "",
    especialidad: persona.especialidad || "",
    cargo: persona.cargo || "",
    estado: persona.estado,
  };

  mensaje.value = `Editando a ${persona.nombres} ${persona.apellidos}.`;
  error.value = "";

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

async function cambiarEstadoPersona(persona: Persona) {
  if (!persona.id) return;

  const nuevoEstado = !persona.estado;
  const accion = nuevoEstado ? "activar" : "desactivar";

  const confirmar = confirm(
    `¿Seguro que deseas ${accion} a ${persona.nombres} ${persona.apellidos}?`
  );

  if (!confirmar) return;

  try {
    limpiarMensajes();

    const personaActualizada: Persona = {
      nombres: persona.nombres,
      apellidos: persona.apellidos,
      dni: persona.dni,
      correo: persona.correo || "",
      telefono: persona.telefono || "",
      tipoPersona: persona.tipoPersona,
      grado: persona.grado || "",
      seccion: persona.seccion || "",
      especialidad: persona.especialidad || "",
      cargo: persona.cargo || "",
      estado: nuevoEstado,
    };

    await actualizarPersona(persona.id, personaActualizada);

    mensaje.value = nuevoEstado
      ? "Persona activada correctamente."
      : "Persona desactivada correctamente.";

    await cargarPersonas();
  } catch (e: any) {
    error.value =
      e?.response?.data?.message ||
      "No se pudo cambiar el estado de la persona.";
    console.error(e);
  }
}

function cancelarEdicion() {
  resetearFormulario();
  mensaje.value = "Edición cancelada.";
  error.value = "";
}

function resetearFormulario() {
  personaEditandoId.value = null;
  estadoPersonaEditando.value = true;

  formulario.value = {
    nombres: "",
    apellidos: "",
    dni: "",
    correo: "",
    telefono: "",
    tipoPersona: "ESTUDIANTE",
    grado: "",
    seccion: "",
    especialidad: "",
    cargo: "",
    estado: true,
  };
}

function validarFormulario() {
  if (!formulario.value.nombres.trim()) return false;
  if (!formulario.value.apellidos.trim()) return false;
  if (!formulario.value.dni.trim()) return false;

  if (formulario.value.tipoPersona === "ESTUDIANTE") {
    return Boolean(formulario.value.grado?.trim() && formulario.value.seccion?.trim());
  }

  if (formulario.value.tipoPersona === "DOCENTE") {
    return Boolean(formulario.value.especialidad?.trim() && formulario.value.cargo?.trim());
  }

  return true;
}

function obtenerDetallePersona(persona: Persona) {
  if (persona.tipoPersona === "ESTUDIANTE") {
    return `${persona.grado || "Sin grado"} - Sección ${persona.seccion || "-"}`;
  }

  if (persona.tipoPersona === "DOCENTE") {
    return `${persona.especialidad || "Sin especialidad"} / ${persona.cargo || "Sin cargo"}`;
  }

  return "Sin detalle";
}

function limpiarMensajes() {
  error.value = "";
  mensaje.value = "";
}

function cerrarSesion() {
  authStore.logout();
  router.push("/login");
}

onMounted(() => {
  cargarPersonas();
});
</script>

<template>
  <div class="app-layout">
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-logo">
          <i class="bi bi-person-bounding-box"></i>
        </div>

        <div>
          <h4>Sistema Facial</h4>
          <span>Vue 3 Web</span>
        </div>
      </div>

      <nav class="menu">
        <RouterLink class="menu-link" to="/">
          <i class="bi bi-grid-1x2-fill"></i>
          Dashboard
        </RouterLink>

        <RouterLink class="menu-link active" to="/personas">
          <i class="bi bi-people-fill"></i>
          Personas
        </RouterLink>

        <RouterLink class="menu-link" to="/reconocimiento">
          <i class="bi bi-camera-fill"></i>
          Reconocimiento
        </RouterLink>

        <RouterLink class="menu-link" to="/asistencia">
          <i class="bi bi-calendar-check-fill"></i>
          Asistencia
        </RouterLink>

        <RouterLink class="menu-link" to="/reportes">
          <i class="bi bi-pie-chart-fill"></i>
          Reportes
        </RouterLink>

        <RouterLink class="menu-link" to="/perfil">
          <i class="bi bi-person-circle"></i>
          Perfil
        </RouterLink>
      </nav>
    </aside>

    <main class="main-content">
      <header class="topbar">
        <div>
          <span class="eyebrow">Gestión</span>
          <h1>Personas</h1>
          <p>Registro y administración de estudiantes y docentes.</p>
        </div>

        <div class="topbar-actions">
          <button class="btn btn-light-custom" @click="cargarPersonas">
            <i class="bi bi-arrow-clockwise me-1"></i>
            Actualizar
          </button>

          <button class="btn btn-outline-danger fw-bold" @click="cerrarSesion">
            <i class="bi bi-box-arrow-right me-1"></i>
            Cerrar sesión
          </button>
        </div>
      </header>

      <div v-if="error" class="alert alert-danger">
        {{ error }}
      </div>

      <div v-if="mensaje" class="alert alert-success">
        {{ mensaje }}
      </div>

      <section class="row g-4 mb-4">
        <div class="col-md-3">
          <div class="mini-card">
            <i class="bi bi-people-fill text-primary"></i>
            <div>
              <strong>{{ totalPersonas }}</strong>
              <span>Total personas</span>
            </div>
          </div>
        </div>

        <div class="col-md-3">
          <div class="mini-card">
            <i class="bi bi-mortarboard-fill text-success"></i>
            <div>
              <strong>{{ totalEstudiantes }}</strong>
              <span>Estudiantes</span>
            </div>
          </div>
        </div>

        <div class="col-md-3">
          <div class="mini-card">
            <i class="bi bi-person-workspace text-primary"></i>
            <div>
              <strong>{{ totalDocentes }}</strong>
              <span>Docentes</span>
            </div>
          </div>
        </div>

        <div class="col-md-3">
          <div class="mini-card">
            <i class="bi bi-person-check-fill text-warning"></i>
            <div>
              <strong>{{ totalActivos }}</strong>
              <span>Activos</span>
            </div>
          </div>
        </div>
      </section>

      <section class="row g-4">
        <div class="col-lg-5">
          <div class="glass-card">
            <div class="card-title-row">
              <div>
                <h4>
                  {{ personaEditandoId ? "Editar persona" : "Registrar persona" }}
                </h4>
                <p>
                  {{
                    personaEditandoId
                      ? "Modifica los datos de la persona seleccionada."
                      : "Registra estudiantes o docentes desde un solo formulario."
                  }}
                </p>
              </div>
            </div>

            <form @submit.prevent="guardarPersona">
              <div class="mb-3">
                <label class="form-label">Tipo de persona</label>
                <select v-model="formulario.tipoPersona" class="form-select">
                  <option value="ESTUDIANTE">Estudiante</option>
                  <option value="DOCENTE">Docente</option>
                </select>
              </div>

              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label">Nombres</label>
                  <input
                    v-model="formulario.nombres"
                    type="text"
                    class="form-control"
                    placeholder="Ej. María Fernanda"
                  />
                </div>

                <div class="col-md-6">
                  <label class="form-label">Apellidos</label>
                  <input
                    v-model="formulario.apellidos"
                    type="text"
                    class="form-control"
                    placeholder="Ej. López Ruiz"
                  />
                </div>

                <div class="col-md-6">
                  <label class="form-label">DNI</label>
                  <input
                    v-model="formulario.dni"
                    type="text"
                    class="form-control"
                    placeholder="Ej. 87654321"
                  />
                </div>

                <div class="col-md-6">
                  <label class="form-label">Correo</label>
                  <input
                    v-model="formulario.correo"
                    type="email"
                    class="form-control"
                    placeholder="correo@colegio.edu.pe"
                  />
                </div>

                <div class="col-md-12">
                  <label class="form-label">Teléfono</label>
                  <input
                    v-model="formulario.telefono"
                    type="text"
                    class="form-control"
                    placeholder="Ej. 987654321"
                  />
                </div>
              </div>

              <div v-if="formulario.tipoPersona === 'ESTUDIANTE'" class="dynamic-box mt-4">
                <h6>
                  <i class="bi bi-mortarboard-fill"></i>
                  Datos académicos del estudiante
                </h6>

                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label">Grado</label>
                    <input
                      v-model="formulario.grado"
                      type="text"
                      class="form-control"
                      placeholder="Ej. 4to"
                    />
                  </div>

                  <div class="col-md-6">
                    <label class="form-label">Sección</label>
                    <input
                      v-model="formulario.seccion"
                      type="text"
                      class="form-control"
                      placeholder="Ej. B"
                    />
                  </div>
                </div>
              </div>

              <div v-if="formulario.tipoPersona === 'DOCENTE'" class="dynamic-box mt-4">
                <h6>
                  <i class="bi bi-person-workspace"></i>
                  Datos laborales del docente
                </h6>

                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label">Especialidad</label>
                    <input
                      v-model="formulario.especialidad"
                      type="text"
                      class="form-control"
                      placeholder="Ej. Matemática"
                    />
                  </div>

                  <div class="col-md-6">
                    <label class="form-label">Cargo</label>
                    <input
                      v-model="formulario.cargo"
                      type="text"
                      class="form-control"
                      placeholder="Ej. Docente tutor"
                    />
                  </div>
                </div>
              </div>

              <button class="btn btn-primary-custom w-100 mt-4" :disabled="guardando">
                <i class="bi bi-save-fill me-1"></i>
                {{
                  guardando
                    ? "Guardando..."
                    : personaEditandoId
                      ? "Guardar cambios"
                      : "Registrar persona"
                }}
              </button>

              <button
                v-if="personaEditandoId"
                type="button"
                class="btn btn-light-custom w-100 mt-2"
                @click="cancelarEdicion"
              >
                <i class="bi bi-x-circle me-1"></i>
                Cancelar edición
              </button>
            </form>
          </div>
        </div>

        <div class="col-lg-7">
          <div class="glass-card">
            <div class="card-title-row">
              <div>
                <h4>Personas registradas</h4>
                <p>Lista general de estudiantes y docentes.</p>
              </div>
            </div>

            <div class="filter-row">
              <button
                class="filter-btn"
                :class="{ active: filtroActual === 'TODOS' }"
                @click="filtroActual = 'TODOS'"
              >
                Todos
              </button>

              <button
                class="filter-btn"
                :class="{ active: filtroActual === 'ESTUDIANTE' }"
                @click="filtroActual = 'ESTUDIANTE'"
              >
                Estudiantes
              </button>

              <button
                class="filter-btn"
                :class="{ active: filtroActual === 'DOCENTE' }"
                @click="filtroActual = 'DOCENTE'"
              >
                Docentes
              </button>
            </div>

            <div v-if="cargando" class="alert alert-info">
              Cargando personas...
            </div>

            <div v-else-if="personasFiltradas.length === 0" class="text-muted py-4">
              No hay personas registradas para este filtro.
            </div>

            <div v-else class="table-responsive">
              <table class="table custom-table align-middle">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Persona</th>
                    <th>DNI</th>
                    <th>Tipo</th>
                    <th>Detalle</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="persona in personasFiltradas" :key="persona.id">
                    <td>{{ persona.id }}</td>

                    <td>
                      <div class="person-name">
                        {{ persona.nombres }} {{ persona.apellidos }}
                      </div>
                      <div class="person-sub">
                        {{ persona.correo || "Sin correo" }}
                        |
                        {{ persona.rostroRegistrado ? "Rostro registrado" : "Sin rostro" }}
                      </div>
                    </td>

                    <td>{{ persona.dni }}</td>

                    <td>
                      <span
                        class="badge-custom"
                        :class="persona.tipoPersona === 'ESTUDIANTE' ? 'badge-student' : 'badge-teacher'"
                      >
                        {{ persona.tipoPersona === "ESTUDIANTE" ? "Estudiante" : "Docente" }}
                      </span>
                    </td>

                    <td>{{ obtenerDetallePersona(persona) }}</td>

                    <td>
                      <span
                        class="badge"
                        :class="persona.estado ? 'text-bg-success' : 'text-bg-secondary'"
                      >
                        {{ persona.estado ? "Activo" : "Inactivo" }}
                      </span>
                    </td>

                    <td>
                      <div class="table-actions">
                        <button class="btn btn-sm btn-light-custom" @click="editarPersona(persona)">
                          <i class="bi bi-pencil-square"></i>
                          Editar
                        </button>

                        <button
                          class="btn btn-sm"
                          :class="persona.estado ? 'btn-outline-danger' : 'btn-outline-success'"
                          @click="cambiarEstadoPersona(persona)"
                        >
                          <i
                            class="bi"
                            :class="persona.estado ? 'bi-person-x-fill' : 'bi-person-check-fill'"
                          ></i>
                          {{ persona.estado ? "Desactivar" : "Activar" }}
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>