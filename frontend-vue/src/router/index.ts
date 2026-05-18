import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/authStore";

import LoginView from "../views/LoginView.vue";
import DashboardView from "../views/DashboardView.vue";
import PersonasView from "../views/PersonasView.vue";
import ReconocimientoView from "../views/ReconocimientoView.vue";
import AsistenciaView from "../views/AsistenciaView.vue";
import ReportesView from "../views/ReportesView.vue";
import PerfilView from "../views/PerfilView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/",
      name: "dashboard",
      component: DashboardView,
      meta: { requiresAuth: true },
    },
    {
      path: "/personas",
      name: "personas",
      component: PersonasView,
      meta: { requiresAuth: true },
    },
    {
      path: "/reconocimiento",
      name: "reconocimiento",
      component: ReconocimientoView,
      meta: { requiresAuth: true },
    },
    {
      path: "/asistencia",
      name: "asistencia",
      component: AsistenciaView,
      meta: { requiresAuth: true },
    },
    {
      path: "/reportes",
      name: "reportes",
      component: ReportesView,
      meta: { requiresAuth: true },
    },
    {
      path: "/perfil",
      name: "perfil",
      component: PerfilView,
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach((to) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return "/login";
  }

  if (to.path === "/login" && authStore.isLoggedIn) {
    return "/";
  }
});

export default router;