<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { apiJava } from "../services/api";
import { useAuthStore } from "../stores/authStore";

type Persona = {
  id: number;
  nombres: string;
  apellidos: string;
  dni?: string;
  correo?: string;
  telefono?: string;
  tipoPersona: "ESTUDIANTE" | "DOCENTE";
  grado?: string;
  seccion?: string;
  especialidad?: string;
  cargo?: string;
  estado: boolean;
  rostroRegistrado?: boolean;
};

type Asistencia = {
  id: number;
  fecha: string;
  hora: string;
  estado: "PRESENTE" | "TARDANZA" | "FALTA" | "JUSTIFICADO";
  metodoRegistro: string;
  persona?: Persona;
};

const router = useRouter();
const authStore = useAuthStore();

const personas = ref<Persona[]>([]);
const asistencias = ref<Asistencia[]>([]);
const cargando = ref(true);
const error = ref("");

const totalPersonas = computed(() => personas.value.length);
const totalEstudiantes = computed(
  () => personas.value.filter((p) => p.tipoPersona === "ESTUDIANTE").length
);
const totalDocentes = computed(
  () => personas.value.filter((p) => p.tipoPersona === "DOCENTE").length
);
const totalActivos = computed(
  () => personas.value.filter((p) => p.estado).length
);
const totalInactivos = computed(
  () => personas.value.filter((p) => !p.estado).length
);
const rostrosRegistrados = computed(
  () => personas.value.filter((p) => p.rostroRegistrado).length
);

const asistenciasHoy = computed(() => {
  const hoy = obtenerFechaActual();
  return asistencias.value.filter((a) => a.fecha === hoy);
});

const totalPresentesHoy = computed(
  () => asistenciasHoy.value.filter((a) => a.estado === "PRESENTE").length
);

const totalTardanzasHoy = computed(
  () => asistenciasHoy.value.filter((a) => a.estado === "TARDANZA").length
);

const totalFaltasHoy = computed(
  () => asistenciasHoy.value.filter((a) => a.estado === "FALTA").length
);

const ultimasAsistencias = computed(() => {
  return [...asistencias.value].reverse().slice(0, 6);
});

const porcentajeEstudiantes = computed(() => {
  if (totalPersonas.value === 0) return 0;
  return Math.round((totalEstudiantes.value / totalPersonas.value) * 100);
});

const donutEstilo = computed(() => {
  const grados = totalPersonas.value === 0
    ? 0
    : (totalEstudiantes.value / totalPersonas.value) * 360;

  return {
    background: totalPersonas.value === 0
      ? "#e2e8f0"
      : `conic-gradient(#2563eb 0deg ${grados}deg, #7c3aed ${grados}deg 360deg)`,
  };
});

async function cargarDashboard() {
  try {
    cargando.value = true;
    error.value = "";

    const [personasResponse, asistenciasResponse] = await Promise.all([
      apiJava.get<Persona[]>("/personas"),
      apiJava.get<Asistencia[]>("/asistencias"),
    ]);

    personas.value = personasResponse.data;
    asistencias.value = asistenciasResponse.data;
  } catch (e) {
    error.value =
      "No se pudo cargar el dashboard. Verifica que Spring Boot esté encendido en http://localhost:8080.";
    console.error(e);
  } finally {
    cargando.value = false;
  }
}

function cerrarSesion() {
  authStore.logout();
  router.push("/login");
}

function irARuta(ruta: string) {
  router.push(ruta);
}

function obtenerFechaActual() {
  const fecha = new Date();
  const year = fecha.getFullYear();
  const month = String(fecha.getMonth() + 1).padStart(2, "0");
  const day = String(fecha.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function obtenerClaseEstado(estado: string) {
  if (estado === "PRESENTE") return "badge-present";
  if (estado === "TARDANZA") return "badge-tardanza";
  if (estado === "FALTA") return "badge-falta";
  if (estado === "JUSTIFICADO") return "badge-justificado";
  return "badge-method";
}

onMounted(() => {
  cargarDashboard();
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
        <RouterLink class="menu-link active" to="/">
          <i class="bi bi-grid-1x2-fill"></i>
          Dashboard
        </RouterLink>

        <RouterLink class="menu-link" to="/personas">
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
          <span class="eyebrow">Panel administrativo</span>
          <h1>Dashboard general</h1>
          <p>Resumen del sistema de asistencia facial usando Vue 3.</p>
        </div>

        <div class="topbar-actions">
          <button class="btn btn-light-custom" @click="cargarDashboard">
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

      <div v-if="cargando" class="alert alert-info">
        <i class="bi bi-hourglass-split me-2"></i>
        Cargando información desde Spring Boot...
      </div>

      <template v-else>
        <section class="row g-4 mb-4">
          <div class="col-md-4">
            <div class="stat-card stat-blue">
              <div>
                <p>Total personas</p>
                <h2>{{ totalPersonas }}</h2>
                <span>Registradas en MySQL</span>
              </div>
              <i class="bi bi-people-fill"></i>
            </div>
          </div>

          <div class="col-md-4">
            <div class="stat-card stat-green">
              <div>
                <p>Estudiantes</p>
                <h2>{{ totalEstudiantes }}</h2>
                <span>Alumnos registrados</span>
              </div>
              <i class="bi bi-mortarboard-fill"></i>
            </div>
          </div>

          <div class="col-md-4">
            <div class="stat-card stat-purple">
              <div>
                <p>Docentes</p>
                <h2>{{ totalDocentes }}</h2>
                <span>Personal docente</span>
              </div>
              <i class="bi bi-person-workspace"></i>
            </div>
          </div>
        </section>

        <section class="row g-4 mb-4">
          <div class="col-md-3">
            <div class="mini-card">
              <i class="bi bi-person-check-fill text-success"></i>
              <div>
                <strong>{{ totalActivos }}</strong>
                <span>Personas activas</span>
              </div>
            </div>
          </div>

          <div class="col-md-3">
            <div class="mini-card">
              <i class="bi bi-person-x-fill text-secondary"></i>
              <div>
                <strong>{{ totalInactivos }}</strong>
                <span>Personas inactivas</span>
              </div>
            </div>
          </div>

          <div class="col-md-3">
            <div class="mini-card">
              <i class="bi bi-person-bounding-box text-primary"></i>
              <div>
                <strong>{{ rostrosRegistrados }}</strong>
                <span>Rostros registrados</span>
              </div>
            </div>
          </div>

          <div class="col-md-3">
            <div class="mini-card">
              <i class="bi bi-calendar-check-fill text-warning"></i>
              <div>
                <strong>{{ asistenciasHoy.length }}</strong>
                <span>Asistencias hoy</span>
              </div>
            </div>
          </div>
        </section>

        <section class="row g-4 mb-4">
          <div class="col-lg-7">
            <div class="glass-card h-100">
              <div class="card-title-row">
                <div>
                  <h4>Distribución de personas</h4>
                  <p>Comparación entre estudiantes y docentes.</p>
                </div>
              </div>

              <div class="chart-area">
                <div class="donut-chart" :style="donutEstilo">
                  <div class="donut-center">
                    <strong>{{ totalPersonas }}</strong>
                    <span>Total</span>
                  </div>
                </div>

                <div class="legend-list">
                  <div class="legend-item">
                    <div class="legend-left">
                      <span class="legend-dot bg-blue"></span>
                      Estudiantes
                    </div>
                    <strong>{{ totalEstudiantes }} ({{ porcentajeEstudiantes }}%)</strong>
                  </div>

                  <div class="legend-item">
                    <div class="legend-left">
                      <span class="legend-dot bg-purple"></span>
                      Docentes
                    </div>
                    <strong>{{ totalDocentes }}</strong>
                  </div>

                  <div class="legend-item">
                    <div class="legend-left">
                      <span class="legend-dot bg-green"></span>
                      Activos
                    </div>
                    <strong>{{ totalActivos }}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-5">
            <div class="glass-card h-100">
              <h4>Asistencia de hoy</h4>
              <p class="text-muted">Resumen rápido por estado.</p>

              <div class="status-grid">
                <div class="status-box">
                  <span class="badge-present">PRESENTE</span>
                  <strong>{{ totalPresentesHoy }}</strong>
                </div>

                <div class="status-box">
                  <span class="badge-tardanza">TARDANZA</span>
                  <strong>{{ totalTardanzasHoy }}</strong>
                </div>

                <div class="status-box">
                  <span class="badge-falta">FALTA</span>
                  <strong>{{ totalFaltasHoy }}</strong>
                </div>
              </div>

              <div class="process-list mt-4">
                <div>
                  <span>1</span>
                  Registrar persona
                </div>

                <div>
                  <span>2</span>
                  Asociar rostro
                </div>

                <div>
                  <span>3</span>
                  Reconocer identidad
                </div>

                <div>
                  <span>4</span>
                  Marcar asistencia
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="row g-4">
          <div class="col-lg-7">
            <div class="glass-card h-100">
              <div class="card-title-row">
                <div>
                  <h4>Últimas asistencias</h4>
                  <p>Registros recientes guardados en MySQL.</p>
                </div>

                <button class="btn btn-light-custom" @click="irARuta('/reportes')">
                  Ver reportes
                </button>
              </div>

              <div v-if="ultimasAsistencias.length === 0" class="text-muted">
                Todavía no hay asistencias registradas.
              </div>

              <div v-else class="table-responsive">
                <table class="table custom-table align-middle">
                  <thead>
                    <tr>
                      <th>Persona</th>
                      <th>Fecha</th>
                      <th>Hora</th>
                      <th>Estado</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr v-for="asistencia in ultimasAsistencias" :key="asistencia.id">
                      <td>
                        <div class="person-name">
                          {{ asistencia.persona?.nombres || "" }}
                          {{ asistencia.persona?.apellidos || "" }}
                        </div>
                        <div class="person-sub">
                          {{ asistencia.persona?.tipoPersona || "SIN TIPO" }}
                        </div>
                      </td>

                      <td>{{ asistencia.fecha }}</td>
                      <td>{{ asistencia.hora }}</td>
                      <td>
                        <span :class="obtenerClaseEstado(asistencia.estado)">
                          {{ asistencia.estado }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div class="col-lg-5">
            <div class="glass-card h-100">
              <h4>Acciones rápidas</h4>
              <p class="text-muted">Accede a los módulos principales.</p>

              <div class="quick-actions">
                <button class="quick-action" @click="irARuta('/personas')">
                  <i class="bi bi-person-plus-fill"></i>
                  Gestionar personas
                </button>

                <button class="quick-action" @click="irARuta('/reconocimiento')">
                  <i class="bi bi-camera-fill"></i>
                  Registrar rostro
                </button>

                <button class="quick-action" @click="irARuta('/asistencia')">
                  <i class="bi bi-calendar-check-fill"></i>
                  Tomar asistencia
                </button>

                <button class="quick-action" @click="irARuta('/reportes')">
                  <i class="bi bi-file-earmark-bar-graph-fill"></i>
                  Ver reportes
                </button>
              </div>
            </div>
          </div>
        </section>
      </template>
    </main>
  </div>
</template>