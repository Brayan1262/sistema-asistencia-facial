# Sistema de Asistencia Facial

Sistema web de asistencia con reconocimiento facial desarrollado para instituciones educativas.  
Permite registrar estudiantes y docentes, asociarles una imagen facial, reconocerlos mediante inteligencia artificial, marcar su asistencia automáticamente, generar reportes y administrar el sistema desde un panel dinámico desarrollado con Angular.

---

## Descripción del proyecto

Este proyecto tiene como objetivo automatizar el control de asistencia en una institución educativa mediante reconocimiento facial.

El sistema permite gestionar estudiantes y docentes usando una entidad principal llamada **Persona**. Cada persona puede tener un rostro registrado y posteriormente ser reconocida mediante una imagen o cámara en vivo para marcar su asistencia.

La versión actual del proyecto cuenta con un **frontend principal desarrollado en Angular**, una API principal en **Java Spring Boot**, un microservicio en **Python Flask con OpenCV** y una base de datos **MySQL**.

El proyecto está desarrollado con una arquitectura separada:

``text
Frontend Angular
↓
Backend Java Spring Boot
↓
Base de datos MySQL

Objetivo del sistema

El objetivo principal del sistema es reemplazar el registro manual de asistencia por un proceso más rápido, moderno y automatizado usando reconocimiento facial.

En una institución educativa, la asistencia manual puede generar pérdida de tiempo, errores, registros duplicados o dificultad para consultar reportes. Este sistema busca solucionar ese problema permitiendo que estudiantes y docentes sean reconocidos mediante una imagen o cámara en vivo para registrar su asistencia automáticamente.

Además, el sistema busca ofrecer una interfaz moderna, clara y fácil de usar para que el administrador pueda gestionar personas, registrar rostros, controlar asistencias, generar reportes y personalizar el panel desde una aplicación web desarrollada con Angular.

Problema que resuelve

El sistema ayuda a resolver problemas como:

Registro manual lento de asistencia.
Errores al tomar asistencia.
Falta de reportes rápidos.
Dificultad para consultar asistencias por fecha.
Falta de control visual de estudiantes y docentes registrados.
Necesidad de automatizar procesos administrativos en instituciones educativas.
Falta de una interfaz moderna para gestionar asistencia educativa.
Dificultad para controlar faltas, tardanzas y justificaciones.
Necesidad de reconocer estudiantes y docentes desde una plataforma web.
Funcionalidades principales
Login administrativo.
Panel de administrador desarrollado con Angular.
Diseño moderno, dinámico y responsive.
Modo claro y modo oscuro.
Botón para cambiar apariencia desde el login y el panel.
Edición de perfil del administrador.
Foto y datos del administrador visibles en la barra superior.
Dashboard con indicadores visuales.
Registro de estudiantes y docentes.
Edición de datos de estudiantes y docentes.
Activación y desactivación de personas.
Campos dinámicos según el tipo de persona.
Registro de rostro asociado a una persona.
Reconocimiento facial mediante imagen.
Reconocimiento facial mediante cámara en vivo.
Captura de foto desde el navegador.
Marcado automático de asistencia.
Prevención de asistencia duplicada por día.
Historial de asistencias.
Estados de asistencia: PRESENTE, TARDANZA, FALTA y JUSTIFICADO.
Registro manual de faltas.
Cambio manual de estados de asistencia desde reportes.
Reportes con filtros por rango de fechas.
Reportes con filtros por tipo de persona.
Reportes con filtros por estado de asistencia.
Exportación de asistencias a Excel.
Impresión o guardado de reportes en PDF.
Manejo de errores desde el backend.
Interfaz web moderna con Bootstrap y Bootstrap Icons.
Animaciones visuales en el login.
Fondo dinámico estilo educativo.
Burbujas, personajes y frases motivadoras en la pantalla de acceso.
Tecnologías utilizadas
Frontend principal
Angular
TypeScript
HTML5
CSS3
Bootstrap 5
Bootstrap Icons
LocalStorage
SessionStorage
Cámara web desde el navegador
Frontend anterior
HTML5
CSS3
JavaScript
Bootstrap 5
Bootstrap Icons
Backend
Java 21
Spring Boot
Spring Web
Spring Data JPA
Maven
Microservicio de reconocimiento facial
Python 3.12
Flask
Flask-CORS
OpenCV
NumPy
Base de datos
MySQL
XAMPP
Control de versiones
Git
GitHub
Arquitectura del sistema
sistema-asistencia-facial/
│
├── backend-java/
│   └── API REST desarrollada con Spring Boot
│
├── facial-service-python/
│   └── Microservicio Flask para reconocimiento facial
│
├── frontend-angular/
│   └── Frontend principal desarrollado con Angular
│
├── frontend/
│   └── Primera versión web con HTML, CSS y JavaScript
│
├── database/
│   └── Archivos relacionados con la base de datos
│
├── docs/
│   └── Documentación del proyecto
│
├── README.md
└── .gitignore
Frontend Angular

La versión principal del sistema se encuentra en:

frontend-angular/

Esta carpeta contiene la interfaz web moderna del sistema, desarrollada con Angular.

Módulos implementados:

Login
Dashboard
Personas
Reconocimiento
Asistencia
Reportes
Perfil
Modo claro / oscuro

Estructura principal del frontend Angular:

frontend-angular/src/app/
│
├── core/
│   ├── models/
│   │   ├── persona.model.ts
│   │   └── asistencia.model.ts
│   │
│   └── services/
│       ├── auth.service.ts
│       ├── persona.service.ts
│       ├── asistencia.service.ts
│       └── facial.service.ts
│
├── layouts/
│   └── admin-layout/
│
├── pages/
│   ├── login/
│   ├── dashboard/
│   ├── personas/
│   ├── reconocimiento/
│   ├── asistencia/
│   ├── reportes/
│   └── perfil/
│
├── app.routes.ts
├── app.config.ts
└── app.ts
Módulos del sistema
Login administrativo

El sistema cuenta con una pantalla de acceso para el administrador.

Credenciales de demostración:

Usuario: admin
Contraseña: admin123

La sesión se mantiene usando sessionStorage.
Si no existe una sesión activa, el panel principal permanece protegido.

El login incluye:

Validación de usuario y contraseña.
Botón para mostrar u ocultar contraseña.
Diseño moderno.
Fondo animado con estilo educativo.
Docente y estudiante decorativos creados con HTML y CSS.
Burbujas flotantes.
Frases motivadoras.
Cambio entre modo claro y modo oscuro.
Animaciones suaves en el panel de acceso.
Administrador dinámico

El administrador puede modificar desde el módulo Perfil:

Nombres
Apellidos
Correo electrónico
Institución
Cargo
Teléfono
Descripción
Foto de perfil

Los datos se guardan usando localStorage, por lo que se mantienen aunque el navegador se recargue.

Además, la información del administrador se muestra en la barra superior del panel junto al botón de modo claro/oscuro y el botón de cerrar sesión.

Dashboard principal

El dashboard muestra un resumen general del sistema:

Total de personas registradas.
Total de estudiantes.
Total de docentes.
Total de personas activas.
Total de rostros registrados.
Total de asistencias del día.
Conexión con el backend Spring Boot.

El dashboard obtiene los datos reales desde la API del backend Java.

Registro facial

Cada persona puede tener un rostro registrado.

Flujo:

Seleccionar persona registrada
↓
Subir imagen del rostro
↓
Enviar imagen al microservicio Python
↓
Guardar imagen en la carpeta faces/
↓
Actualizar en MySQL que la persona tiene rostro registrado

Ejemplo de archivo facial:

persona_1_estudiante.jpg
persona_2_docente.jpg
Reconocimiento facial con imagen

El sistema permite subir una imagen para reconocer a una persona.

Flujo:

Subir imagen
↓
Python recibe la imagen
↓
OpenCV compara con los rostros registrados
↓
Si encuentra coincidencia, devuelve el ID de la persona
↓
Angular consulta los datos de la persona en Spring Boot
↓
Se muestran los datos de la persona reconocida
↓
Se registra la asistencia automáticamente
Reconocimiento facial con cámara en vivo

El sistema permite usar la cámara del navegador desde el módulo de asistencia.

Flujo:

Activar cámara
↓
Permitir acceso a la cámara
↓
Capturar foto
↓
Enviar captura temporal a Python
↓
Comparar con rostro registrado
↓
Reconocer persona
↓
Registrar asistencia

La captura tomada desde la cámara no se guarda permanentemente.
Solo se usa de forma temporal para comparar el rostro y registrar asistencia.

Autor

Desarrollado por:

Brayan Jair Chavez Oscor

Proyecto académico de Ingeniería de Sistemas.
