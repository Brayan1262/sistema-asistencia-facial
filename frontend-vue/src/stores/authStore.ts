import { defineStore } from "pinia";

type AdminData = {
  nombre: string;
  correo: string;
  rol: string;
};

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isLoggedIn: sessionStorage.getItem("sesionActiva") === "true",
    admin: {
      nombre: localStorage.getItem("adminNombre") || "Brayan Chavez",
      correo: localStorage.getItem("adminCorreo") || "admin@colegio.edu.pe",
      rol: "Administrador",
    } as AdminData,
  }),

  actions: {
    login(usuario: string, password: string) {
      if (usuario === "admin" && password === "admin123") {
        this.isLoggedIn = true;
        sessionStorage.setItem("sesionActiva", "true");
        return true;
      }

      return false;
    },

    logout() {
      this.isLoggedIn = false;
      sessionStorage.removeItem("sesionActiva");
    },
  },
});