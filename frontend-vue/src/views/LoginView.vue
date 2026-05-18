<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/authStore";

const router = useRouter();
const authStore = useAuthStore();

const usuario = ref("");
const password = ref("");
const mostrarPassword = ref(false);
const error = ref("");

function iniciarSesion() {
  error.value = "";

  if (!usuario.value.trim() || !password.value.trim()) {
    error.value = "Completa usuario y contraseña.";
    return;
  }

  const ok = authStore.login(usuario.value.trim(), password.value.trim());

  if (!ok) {
    error.value = "Usuario o contraseña incorrectos.";
    return;
  }

  router.push("/");
}
</script>

<template>
  <main class="login-page">
    <section class="login-card">
      <div class="login-logo">
        <i class="bi bi-person-bounding-box"></i>
      </div>

      <h1>Sistema de Asistencia Facial</h1>
      <p>Acceso administrativo</p>

      <form @submit.prevent="iniciarSesion" class="mt-4">
        <div class="mb-3 text-start">
          <label class="form-label">Usuario</label>
          <input
            v-model="usuario"
            type="text"
            class="form-control"
            placeholder="Ingresa tu usuario"
          />
        </div>

        <div class="mb-3 text-start">
          <label class="form-label">Contraseña</label>

          <div class="input-group">
            <input
              v-model="password"
              :type="mostrarPassword ? 'text' : 'password'"
              class="form-control"
              placeholder="Ingresa tu contraseña"
            />

            <button
              type="button"
              class="btn btn-outline-secondary"
              @click="mostrarPassword = !mostrarPassword"
            >
              <i :class="mostrarPassword ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'"></i>
            </button>
          </div>
        </div>

        <div v-if="error" class="alert alert-danger py-2">
          {{ error }}
        </div>

        <button class="btn btn-primary w-100 fw-bold">
          <i class="bi bi-lock-fill me-2"></i>
          Iniciar sesión
        </button>
      </form>

      <small class="text-muted d-block mt-3">
        Usuario: admin | Contraseña: admin123
      </small>
    </section>
  </main>
</template>