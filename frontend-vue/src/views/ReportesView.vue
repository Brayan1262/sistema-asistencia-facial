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
          <i class="bi bi-grid-1x2-fill"></i> Dashboard
        </RouterLink>

        <RouterLink class="menu-link" to="/personas">
          <i class="bi bi-people-fill"></i> Personas
        </RouterLink>

        <RouterLink class="menu-link" to="/reconocimiento">
          <i class="bi bi-camera-fill"></i> Reconocimiento
        </RouterLink>

        <RouterLink class="menu-link" to="/asistencia">
          <i class="bi bi-calendar-check-fill"></i> Asistencia
        </RouterLink>

        <RouterLink class="menu-link active" to="/reportes">
          <i class="bi bi-pie-chart-fill"></i> Reportes
        </RouterLink>
      </nav>
    </aside>

    <main class="main-content">
      <header class="topbar">
        <div>
          <span class="eyebrow">Reportes</span>
          <h1>Reportes del sistema</h1>
          <p>Filtros, Excel, PDF y control manual de estados.</p>
        </div>
      </header>

      <div class="glass-card">
        <h4>Módulo Reportes</h4>
        <p class="text-muted mb-0">
          Aquí migraremos filtros, exportación y cambio de estados.
        </p>
      </div>
    </main>
  </div>
</template>