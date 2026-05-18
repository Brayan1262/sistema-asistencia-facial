

# Sistema de Asistencia Facial

Sistema web de asistencia con reconocimiento facial desarrollado para instituciones educativas.  
Permite registrar estudiantes y docentes, asociarles una imagen facial, reconocerlos mediante inteligencia artificial, marcar su asistencia automáticamente, generar reportes y administrar el sistema desde un panel dinámico.

---

## Descripción del proyecto

Este proyecto tiene como objetivo automatizar el control de asistencia en una institución educativa mediante reconocimiento facial.

El sistema permite gestionar estudiantes y docentes usando una entidad principal llamada **Persona**. Cada persona puede tener un rostro registrado y posteriormente ser reconocida mediante una imagen o cámara en vivo para marcar su asistencia.

El proyecto está desarrollado con una arquitectura separada:

```text
Frontend Web
↓
Backend Java Spring Boot
↓
Microservicio Python Flask + OpenCV
↓
Base de datos MySQL
```

---

## Objetivo del sistema

El objetivo principal del sistema es reemplazar el registro manual de asistencia por un proceso más rápido, moderno y automatizado usando reconocimiento facial.

En una institución educativa, la asistencia manual puede generar pérdida de tiempo, errores, registros duplicados o dificultad para consultar reportes. Este sistema busca solucionar ese problema permitiendo que estudiantes y docentes sean reconocidos mediante una imagen o cámara en vivo para registrar su asistencia automáticamente.

---

## Problema que resuelve

El sistema ayuda a resolver problemas como:

- Registro manual lento de asistencia.
- Errores al tomar asistencia.
- Falta de reportes rápidos.
- Dificultad para consultar asistencias por fecha.
- Falta de control visual de estudiantes y docentes registrados.
- Necesidad de automatizar procesos administrativos en instituciones educativas.

---

## Funcionalidades principales

- Login administrativo.
- Panel de administrador dinámico.
- Edición de perfil del administrador.
- Registro de estudiantes y docentes.
- Edición de datos de estudiantes y docentes.
- Activación y desactivación de personas.
- Campos dinámicos según el tipo de persona.
- Registro de rostro asociado a una persona.
- Reconocimiento facial mediante imagen.
- Reconocimiento facial mediante cámara en vivo.
- Marcado automático de asistencia.
- Prevención de asistencia duplicada por día.
- Historial de asistencias.
- Estados de asistencia: `PRESENTE`, `TARDANZA`, `FALTA` y `JUSTIFICADO`.
- Registro manual de faltas.
- Cambio manual de estados de asistencia desde reportes.
- Reportes con filtros por rango de fechas.
- Reportes con filtros por tipo de persona.
- Reportes con filtros por estado de asistencia.
- Exportación de asistencias a Excel.
- Impresión o guardado de reportes en PDF.
- Dashboard con indicadores visuales.
- Manejo de errores desde el backend.
- Interfaz web moderna con Bootstrap.

---

## Tecnologías utilizadas

### Frontend

- HTML5
- CSS3
- JavaScript
- Bootstrap 5
- Bootstrap Icons
- LocalStorage
- SessionStorage

### Backend

- Java 21
- Spring Boot
- Spring Web
- Spring Data JPA
- Maven

### Microservicio de reconocimiento facial

- Python 3.12
- Flask
- Flask-CORS
- OpenCV
- NumPy

### Base de datos

- MySQL
- XAMPP

### Control de versiones

- Git
- GitHub

---

## Arquitectura del sistema

```text
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
```

---

## Módulos del sistema

### Login administrativo

El sistema cuenta con una pantalla de acceso para el administrador.

Credenciales de demostración:

```text
Usuario: admin
Contraseña: admin123
```

La sesión se mantiene usando `sessionStorage`.  
Si no existe una sesión activa, el panel principal permanece oculto.

---

### Administrador dinámico

El administrador puede modificar desde el módulo **Perfil**:

```text
Nombre completo
Correo electrónico
Institución
Cargo
Teléfono
Descripción
Foto de perfil
```

Los datos se guardan usando `localStorage`, por lo que se mantienen aunque el navegador se recargue.

---

### Dashboard principal

El dashboard muestra un resumen general del sistema:

- Total de personas registradas.
- Total de estudiantes.
- Total de docentes.
- Gráfico visual de distribución entre estudiantes y docentes.
- Flujo general del sistema.

---

### Gestión de personas

El sistema permite registrar dos tipos de personas:

```text
ESTUDIANTE
DOCENTE
```

Ambos se gestionan desde una sola entidad llamada **Persona**.

Datos generales:

```text
Nombres
Apellidos
DNI
Correo
Teléfono
Tipo de persona
Estado
```

Datos específicos para estudiantes:

```text
Grado
Sección
```

Datos específicos para docentes:

```text
Especialidad
Cargo
```

Además, el sistema permite:

- Editar datos de una persona.
- Activar personas.
- Desactivar personas.
- Evitar acciones principales sobre personas inactivas.

---

### Registro facial

Cada persona puede tener un rostro registrado.

Flujo:

```text
Seleccionar persona registrada
↓
Subir imagen del rostro
↓
Enviar imagen al microservicio Python
↓
Guardar imagen en la carpeta faces/
↓
Actualizar en MySQL que la persona tiene rostro registrado
```

Ejemplo de archivo facial:

```text
persona_1_estudiante.jpg
persona_2_docente.jpg
```

---

### Reconocimiento facial con imagen

El sistema permite subir una imagen para reconocer a una persona.

Flujo:

```text
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
```

---

### Reconocimiento facial con cámara en vivo

El sistema permite usar la cámara del navegador.

Flujo:

```text
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
```

La captura tomada desde la cámara no se guarda permanentemente.  
Solo se usa de forma temporal para comparar el rostro y registrar asistencia.

---

### Registro automático de asistencia

Cuando una persona es reconocida correctamente, el sistema registra:

```text
Fecha
Hora
Estado
Método de registro
Persona reconocida
```

Estados usados:

```text
PRESENTE
TARDANZA
FALTA
JUSTIFICADO
```

Método automático:

```text
RECONOCIMIENTO_FACIAL
```

---

### Prevención de asistencia duplicada

El sistema evita que una misma persona registre asistencia más de una vez en el mismo día.

Mensaje esperado:

```text
La asistencia de esta persona ya fue registrada hoy.
```

---

### Registro manual de faltas

El administrador puede registrar una falta manualmente desde el módulo de reportes.

Estado generado:

```text
FALTA
```

Método generado:

```text
REGISTRO_MANUAL
```

---

### Justificación de asistencias

El administrador puede cambiar el estado de una asistencia a:

```text
JUSTIFICADO
```

También puede cambiar manualmente entre:

```text
PRESENTE
TARDANZA
FALTA
JUSTIFICADO
```

---

### Historial de asistencias

El sistema muestra una tabla con el historial de asistencias registradas.

Campos mostrados:

```text
ID
Persona
Tipo
Fecha
Hora
Estado
Método
```

---

### Reportes

El módulo de reportes permite consultar la información de asistencia de forma ordenada.

Incluye:

- Total de personas.
- Total de asistencias filtradas.
- Total de estudiantes.
- Total de docentes.
- Gráfico visual por tipo de persona.
- Tabla de asistencias encontradas.
- Edición manual de estados.

---

### Filtros en reportes

Los reportes pueden filtrarse por:

```text
Fecha inicio
Fecha fin
Tipo de persona
Estado de asistencia
```

Tipos disponibles:

```text
Todos
Estudiantes
Docentes
```

Estados disponibles:

```text
Todos
Presente
Tardanza
Falta
Justificado
```

---

### Exportación a Excel

El sistema permite exportar las asistencias filtradas en un archivo compatible con Excel.

El archivo exportado contiene:

```text
ID
Persona
Tipo
DNI
Fecha
Hora
Estado
Método
```

---

### Impresión o guardado en PDF

El sistema permite generar una vista imprimible del reporte.

Desde el navegador se puede:

```text
Imprimir reporte
Guardar como PDF
```

---

## Entidades principales

### Persona

Representa a estudiantes y docentes.

Campos principales:

```text
id
nombres
apellidos
dni
correo
telefono
tipoPersona
grado
seccion
especialidad
cargo
estado
rostroRegistrado
rutaRostro
fechaRegistro
```

---

### Asistencia

Representa el registro de asistencia de una persona.

Campos principales:

```text
id
persona
fecha
hora
estado
metodoRegistro
fechaRegistro
```

---

## Endpoints principales

### Personas

```http
GET    /api/personas
GET    /api/personas/{id}
GET    /api/personas/tipo/{tipoPersona}
POST   /api/personas
PUT    /api/personas/{id}
PATCH  /api/personas/{id}/rostro
DELETE /api/personas/{id}
```

---

### Asistencias

```http
GET   /api/asistencias
GET   /api/asistencias/fecha/{fecha}
GET   /api/asistencias/persona/{personaId}
POST  /api/asistencias/marcar/{personaId}
POST  /api/asistencias/falta/{personaId}
PATCH /api/asistencias/{asistenciaId}/justificar
PATCH /api/asistencias/{asistenciaId}/estado?estado=FALTA
```

---

### Microservicio Python

```http
GET  /health
POST /api/faces/register
POST /api/faces/recognize
```

---

## Cómo ejecutar el proyecto

Para ejecutar el sistema completo se deben iniciar:

```text
1. MySQL en XAMPP
2. Backend Java Spring Boot
3. Microservicio Python Flask
4. Frontend con Live Server
```

---

## 1. Clonar el repositorio

```bash
git clone https://github.com/Brayan1262/sistema-asistencia-facial.git
cd sistema-asistencia-facial
```

---

## 2. Configurar MySQL

Configuración usada:

```text
Host: localhost
Puerto: 3308
Base de datos: asistencia_db
```

Antes de ejecutar el backend, se debe encender MySQL desde XAMPP.

---

## 3. Ejecutar backend Java

```bash
cd backend-java
mvnw.cmd spring-boot:run
```

Backend:

```text
http://localhost:8080
```

Probar personas:

```text
http://localhost:8080/api/personas
```

Probar asistencias:

```text
http://localhost:8080/api/asistencias
```

---

## 4. Ejecutar microservicio Python

```bash
cd facial-service-python
venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Microservicio:

```text
http://localhost:5001
```

Probar:

```text
http://127.0.0.1:5001/health
```

Respuesta esperada:

```json
{
  "status": "ok",
  "service": "facial-service-python",
  "opencv_face_module": true
}
```

---

## 5. Ejecutar frontend

Abrir:

```text
frontend/personas.html
```

Recomendado con Live Server:

```text
http://127.0.0.1:5500/frontend/personas.html
```

---

## Seguridad y privacidad

Las imágenes faciales registradas no se suben al repositorio.

La carpeta:

```text
facial-service-python/faces/
```

debe estar ignorada en `.gitignore`.

También se ignoran:

```text
facial-service-python/venv/
backend-java/target/
.env
```

El login actual está implementado en frontend para fines académicos y demostrativos.

Una mejora futura sería implementar autenticación real en backend con:

```text
Spring Security
JWT
Usuarios en MySQL
Roles y permisos
```

---

## Estado actual del proyecto

Actualmente el sistema permite:

- Iniciar sesión como administrador.
- Editar perfil dinámico del administrador.
- Registrar estudiantes.
- Registrar docentes.
- Editar información de estudiantes y docentes.
- Activar o desactivar personas registradas.
- Registrar rostros.
- Reconocer personas mediante imagen.
- Reconocer personas mediante cámara en vivo.
- Marcar asistencia automáticamente.
- Evitar asistencia duplicada por día.
- Registrar faltas manualmente.
- Cambiar estados de asistencia desde reportes.
- Consultar historial de asistencias.
- Filtrar reportes por rango de fechas.
- Filtrar reportes por tipo de persona.
- Filtrar reportes por estado.
- Exportar reportes a Excel.
- Imprimir o guardar reportes como PDF.
- Administrar el sistema desde una interfaz web moderna.

---

## Próximas mejoras

- Migrar el frontend actual a Vue 3.
- Mejorar la experiencia responsive para celulares y tablets.
- Permitir acceso desde red local o servidor.
- Implementar autenticación real con backend.
- Agregar roles de usuario.
- Agregar usuarios administradores en MySQL.
- Agregar gestión de cursos.
- Agregar gestión de aulas.
- Agregar horarios configurables.
- Mejorar el algoritmo de reconocimiento facial.
- Agregar detección automática de rostro antes de capturar.
- Desplegar el sistema en la nube.

---

## Siguiente fase recomendada

La siguiente fase recomendada es migrar el frontend actual de JavaScript puro a un framework moderno:

```text
Vue 3 + Vite
```

La arquitectura futura sería:

```text
Vue 3 Web
↓
Spring Boot API
↓
MySQL

Vue 3 Web
↓
Python Flask API
↓
OpenCV
```

No se elimina el frontend actual. Se conserva como versión estable y se crea una nueva carpeta:

```text
frontend-vue/
```

---

## Autor

Desarrollado por:

```text
Brayan Jair Chavez Oscor
```

Proyecto académico de Ingeniería de Sistemas.

---

## Repositorio

```text
https://github.com/Brayan1262/sistema-asistencia-facial
```