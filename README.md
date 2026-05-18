# Sistema de Asistencia Facial

Sistema web de asistencia con reconocimiento facial desarrollado para instituciones educativas.  
Permite registrar estudiantes y docentes, asociarles una imagen facial, reconocerlos mediante inteligencia artificial, marcar su asistencia automáticamente, generar reportes y administrar el sistema desde un panel dinámico.

---

## Descripción del proyecto

Este proyecto tiene como objetivo automatizar el control de asistencia en un colegio mediante reconocimiento facial.

El sistema permite gestionar personas del entorno educativo, como estudiantes y docentes, usando una sola entidad principal llamada **Persona**. Cada persona puede tener un rostro registrado y posteriormente ser reconocida mediante una imagen o cámara en vivo para marcar su asistencia.

El proyecto está desarrollado con una arquitectura separada:

text
Frontend
↓
Backend Java Spring Boot
↓
Microservicio Python Flask + OpenCV
↓
Base de datos MySQL

Objetivo del sistema

El objetivo principal del sistema es reemplazar el registro manual de asistencia por un proceso más rápido, moderno y automatizado usando reconocimiento facial.

En un colegio o institución educativa, normalmente la asistencia se registra de forma manual, lo cual puede generar pérdida de tiempo, errores, registros duplicados o dificultad para consultar reportes. Este sistema busca solucionar ese problema permitiendo que estudiantes y docentes sean reconocidos mediante una imagen o cámara en vivo para registrar su asistencia automáticamente.

Problema que resuelve

El sistema resuelve problemas como:

Registro manual lento de asistencia.
Posibles errores al tomar asistencia.
Falta de reportes rápidos.
Dificultad para consultar asistencias por fecha.
Falta de control visual de estudiantes y docentes registrados.
Necesidad de automatizar procesos administrativos en instituciones educativas.
Funcionalidades principales

El sistema cuenta con las siguientes funcionalidades:

Acceso administrativo
Pantalla de login para el administrador.
Validación de usuario y contraseña.
Ocultamiento del panel si no hay sesión activa.
Cierre de sesión.
Uso de sessionStorage para mantener la sesión mientras se usa el sistema.

Credenciales de demostración:

Usuario: admin
Contraseña: admin123
Administrador dinámico

El sistema permite editar los datos visibles del administrador desde el módulo Perfil.

Datos editables:

Nombre completo
Correo electrónico
Institución
Cargo
Teléfono
Descripción
Foto de perfil

Estos datos se guardan usando localStorage, por lo que se mantienen aunque el navegador se recargue.

El perfil del administrador se muestra en:

Barra superior del panel.
Tarjeta de perfil.
Avatar del administrador.
Información visible del sistema.
Dashboard principal

El dashboard muestra un resumen general del sistema:

Total de personas registradas.
Total de estudiantes.
Total de docentes.
Gráfico visual de distribución entre estudiantes y docentes.
Flujo general del sistema.

El objetivo del dashboard es dar una vista rápida del estado general del sistema.

Gestión de personas

El sistema permite registrar dos tipos de personas:

Estudiante
Docente

Ambos se gestionan desde una sola entidad llamada Persona.

Datos generales:

Nombres
Apellidos
DNI
Correo
Teléfono
Tipo de persona
Estado

Datos específicos para estudiantes:

Grado
Sección

Datos específicos para docentes:

Especialidad
Cargo

El formulario cambia dinámicamente según el tipo de persona seleccionado.

Registro facial

Cada persona puede tener un rostro registrado.

El proceso es:

Seleccionar persona registrada
↓
Subir imagen del rostro
↓
Enviar imagen al microservicio Python
↓
Guardar imagen en la carpeta faces/
↓
Actualizar en MySQL que la persona tiene rostro registrado

La imagen facial se guarda en el microservicio Python con un nombre relacionado al ID y tipo de persona.

Ejemplo:

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
Java consulta la persona en MySQL
↓
Se muestran los datos de la persona reconocida
↓
Se registra la asistencia automáticamente

Reconocimiento facial con cámara en vivo

Además de subir imágenes, el sistema permite usar la cámara del navegador.

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

La captura tomada desde la cámara no se guarda permanentemente. Solo se usa de forma temporal para comparar el rostro y marcar asistencia.

Registro automático de asistencia

Cuando una persona es reconocida correctamente, el sistema registra su asistencia con:

Fecha
Hora
Estado
Método de registro
Persona reconocida

El estado registrado es:

PRESENTE

El método de registro es:

RECONOCIMIENTO_FACIAL
Prevención de asistencia duplicada

El sistema evita que una misma persona registre asistencia más de una vez en el mismo día.

Si la persona ya registró asistencia, el sistema muestra un mensaje como:

La asistencia de esta persona ya fue registrada hoy.

Esto evita duplicados en la base de datos.

Historial de asistencias

El sistema muestra una tabla con el historial de asistencias registradas.

Campos mostrados:

ID
Persona
Tipo
Fecha
Hora
Estado
Método

Este historial permite revisar rápidamente quién registró asistencia y cuándo.

Reportes

El módulo de reportes permite consultar la información de asistencia de forma más ordenada.

Incluye:

Total de personas.
Total de asistencias filtradas.
Total de estudiantes presentes.
Total de docentes presentes.
Gráfico visual por tipo de persona.
Tabla de asistencias encontradas.
Filtros en reportes

Los reportes pueden filtrarse por:

Fecha
Tipo de persona

Tipos disponibles:

Todos
Estudiantes
Docentes

Esto permite consultar, por ejemplo:

Asistencias de una fecha específica
Solo estudiantes presentes
Solo docentes presentes
Todos los registros
Exportación a Excel

El sistema permite exportar las asistencias filtradas en un archivo compatible con Excel.

El archivo exportado contiene:

ID
Persona
Tipo
DNI
Fecha
Hora
Estado
Método

Esto permite que el administrador pueda guardar o compartir los reportes.

Impresión o guardado en PDF

El sistema permite generar una vista imprimible del reporte.

Desde el navegador se puede:

Imprimir el reporte
Guardar como PDF

El reporte incluye:

Título del sistema.
Fecha filtrada.
Tipo filtrado.
Total de registros.
Tabla de asistencias.
Tecnologías utilizadas
Frontend
HTML5
CSS3
JavaScript
Bootstrap 5
Bootstrap Icons
LocalStorage
SessionStorage

El frontend se encarga de mostrar la interfaz visual, manejar formularios, consumir las APIs y controlar la interacción del usuario.

Backend Java
Java 21
Spring Boot
Spring Web
Spring Data JPA
Maven

El backend Java se encarga de gestionar la lógica principal del sistema, las personas, las asistencias y la conexión con MySQL.

Microservicio Python
Python 3.12
Flask
Flask-CORS
OpenCV
NumPy

El microservicio Python se encarga del registro y reconocimiento facial.

Base de datos
MySQL
XAMPP

La base de datos almacena la información de personas y asistencias.

Control de versiones
Git
GitHub

Git y GitHub se usan para guardar el historial del proyecto y compartir el código.

Estructura del proyecto
sistema-asistencia-facial/
│
├── backend-java/
│   └── API REST desarrollada con Spring Boot
│
├── facial-service-python/
│   └── Microservicio Flask para reconocimiento facial
│
├── frontend/
│   ├── personas.html
│   ├── css/
│   │   └── personas.css
│   └── js/
│       ├── personas.js
│       └── auth-admin.js
│
├── database/
│   └── Archivos relacionados con la base de datos
│
├── docs/
│   └── Documentación del proyecto
│
├── README.md
└── .gitignore
Arquitectura de funcionamiento

El sistema trabaja con una arquitectura separada.

Usuario
↓
Frontend HTML, CSS y JavaScript
↓
Backend Java Spring Boot
↓
Base de datos MySQL

Para el reconocimiento facial se usa otro flujo:

Frontend
↓
Microservicio Python Flask
↓
OpenCV compara rostros
↓
Python devuelve el ID reconocido
↓
Java registra asistencia
↓
MySQL guarda el registro

Autor

Desarrollado por:

Brayan Jair Chavez Oscor

