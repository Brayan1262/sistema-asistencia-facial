<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { listarPersonas, type Persona } from "../services/personaService";
import { registrarRostro } from "../services/facialService";
import { useAuthStore } from "../stores/authStore";

const router = useRouter();
const authStore = useAuthStore();

const personas = ref<Persona[]>([]);
const personaSeleccionadaId = ref<number | "">("");
const fotoRostro = ref<File | null>(null);
const previewUrl = ref("");
const cargando = ref(true);
const guardando = ref(false);
const error = ref("");
const mensaje = ref("");

const personasActivas = computed(() => {
  return personas.value.filter((persona) => persona.estado);
});

const personaSeleccionada = computed(() => {
  if (!personaSeleccionadaId.value) return null;

  return personas.value.find(
    (persona) => Number(persona.id) === Number(personaSeleccionadaId.value)
  );
});

async function cargarPersonas() {
  try {
    cargando.value = true;
    error.value = "";

    personas.value = await listarPersonas();
  } catch (e) {
    error.value =
      "No se pudo cargar la lista de personas. Verifica que Spring Boot esté encendido.";
    console.error(e);
  } finally {
    cargando.value = false;
  }
}

function seleccionarImagen(event: Event) {
  limpiarMensajes();

  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (!file) {
    fotoRostro.value = null;
    previewUrl.value = "";
    return;
  }

  if (!file.type.startsWith("image/")) {
    error.value = "Selecciona un archivo de imagen válido.";
    fotoRostro.value = null;
    previewUrl.value = "";
    return;
  }

  fotoRostro.value = file;
  previewUrl.value = URL.createObjectURL(file);
}

async function guardarRostro() {
  limpiarMensajes();

  if (!personaSeleccionada.value?.id) {
    error.value = "Selecciona una persona.";
    return;
  }

  if (!fotoRostro.value) {
    error.value = "Selecciona una foto del rostro.";
    return;
  }

  if (!personaSeleccionada.value.estado) {
    error.value = "No puedes registrar rostro a una persona inactiva.";
    return;
  }

  try {
    guardando.value = true;

    const resultado = await registrarRostro(
      personaSeleccionada.value.id,
      personaSeleccionada.value.tipoPersona,
      fotoRostro.value
    );

    mensaje.value = `Rostro registrado correctamente. Archivo: ${resultado.filename}`;

    fotoRostro.value = null;
    previewUrl.value = "";

    const input = document.getElementById("fotoRostroVue") as HTMLInputElement | null;
    if (input) input.value = "";

    await cargarPersonas();
  } catch (e: any) {
    error.value =
      e?.response?.data?.message ||
      "No se pudo registrar el rostro. Verifica que Python Flask esté encendido en http://localhost:5001.";
    console.error(e);
  } finally {
    guardando.value = false;
  }
}

function limpiarMensajes() {
  error.value = "";
  mensaje.value = "";
}

function cerrarSesion() {
  authStore.logout();
  router.push("/login");
}

function obtenerDetallePersona(persona: Persona) {
  if (persona.tipoPersona === "ESTUDIANTE") {
    return `${persona.grado || "Sin grado"} - Sección ${persona.seccion || "-"}`;
  }

  if (persona.tipoPersona === "DOCENTE") {
    return `${persona.especialidad || "Sin especialidad"} / ${
      persona.cargo || "Sin cargo"
    }`;
  }

  return "Sin detalle";
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

        <RouterLink class="menu-link" to="/personas">
          <i class="bi bi-people-fill"></i>
          Personas
        </RouterLink>

        <RouterLink class="menu-link active" to="/reconocimiento">
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
          <span class="eyebrow">Reconocimiento facial</span>
          <h1>Registro facial</h1>
          <p>Asocia una imagen facial a estudiantes o docentes registrados.</p>
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

      <section class="row g-4">
        <div class="col-lg-5">
          <div class="glass-card">
            <div class="card-title-row">
              <div>
                <h4>Registrar rostro</h4>
                <p>Selecciona una persona activa y sube una fotografía frontal.</p>
              </div>
            </div>

            <div v-if="cargando" class="alert alert-info">
              Cargando personas...
            </div>

            <template v-else>
              <div class="mb-3">
                <label class="form-label">Persona</label>
                <select v-model="personaSeleccionadaId" class="form-select">
                  <option value="">Selecciona una persona</option>

                  <option
                    v-for="persona in personasActivas"
                    :key="persona.id"
                    :value="persona.id"
                  >
                    {{ persona.nombres }} {{ persona.apellidos }} -
                    {{ persona.tipoPersona }}
                  </option>
                </select>
              </div>

              <div v-if="personaSeleccionada" class="selected-person-box mb-3">
                <div>
                  <strong>
                    {{ personaSeleccionada.nombres }}
                    {{ personaSeleccionada.apellidos }}
                  </strong>
                  <p>{{ obtenerDetallePersona(personaSeleccionada) }}</p>
                </div>

                <span
                  class="badge"
                  :class="
                    personaSeleccionada.rostroRegistrado
                      ? 'text-bg-success'
                      : 'text-bg-secondary'
                  "
                >
                  {{
                    personaSeleccionada.rostroRegistrado
                      ? "Rostro registrado"
                      : "Sin rostro"
                  }}
                </span>
              </div>

              <div class="upload-zone">
                <input
                  id="fotoRostroVue"
                  type="file"
                  accept="image/*"
                  class="form-control mb-3"
                  @change="seleccionarImagen"
                />

                <i class="bi bi-cloud-arrow-up-fill"></i>
                <h5>Subir fotografía del rostro</h5>
                <p>Formato recomendado: JPG o PNG</p>
              </div>

              <button
                class="btn btn-primary-custom w-100 mt-3"
                :disabled="guardando"
                @click="guardarRostro"
              >
                <i class="bi bi-person-check-fill me-1"></i>
                {{ guardando ? "Registrando rostro..." : "Registrar rostro" }}
              </button>
            </template>
          </div>
        </div>

        <div class="col-lg-7">
          <div class="glass-card">
            <div class="card-title-row">
              <div>
                <h4>Vista previa</h4>
                <p>Esta imagen será enviada al microservicio Python.</p>
              </div>
            </div>

            <div class="photo-preview">
              <img v-if="previewUrl" :src="previewUrl" alt="Vista previa de rostro" />

              <div v-else>
                <i class="bi bi-image"></i>
                <p>Sin imagen seleccionada</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="glass-card mt-4">
        <div class="card-title-row">
          <div>
            <h4>Personas con rostro registrado</h4>
            <p>Control visual de estudiantes y docentes con imagen facial asociada.</p>
          </div>
        </div>

        <div v-if="personas.length === 0" class="text-muted">
          No hay personas registradas.
        </div>

        <div v-else class="table-responsive">
          <table class="table custom-table align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Persona</th>
                <th>Tipo</th>
                <th>Detalle</th>
                <th>Estado</th>
                <th>Rostro</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="persona in personas" :key="persona.id">
                <td>{{ persona.id }}</td>

                <td>
                  <div class="person-name">
                    {{ persona.nombres }} {{ persona.apellidos }}
                  </div>
                  <div class="person-sub">
                    DNI: {{ persona.dni || "-" }}
                  </div>
                </td>

                <td>
                  <span
                    class="badge-custom"
                    :class="
                      persona.tipoPersona === 'ESTUDIANTE'
                        ? 'badge-student'
                        : 'badge-teacher'
                    "
                  >
                    {{ persona.tipoPersona }}
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
                  <span
                    class="badge"
                    :class="
                      persona.rostroRegistrado ? 'text-bg-success' : 'text-bg-secondary'
                    "
                  >
                    {{ persona.rostroRegistrado ? "Registrado" : "Pendiente" }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  </div>
</template>