# Sistema de Asistencia Facial

Sistema web de asistencia con reconocimiento facial desarrollado para instituciones educativas.  
Permite registrar estudiantes y docentes, asociarles una imagen facial, reconocerlos mediante inteligencia artificial y marcar su asistencia automáticamente.

---

## Descripción del proyecto

Este proyecto tiene como objetivo automatizar el control de asistencia en un colegio mediante reconocimiento facial.

El sistema permite gestionar personas del entorno educativo, como estudiantes y docentes, usando una sola entidad principal llamada **Persona**. Cada persona puede tener un rostro registrado y, posteriormente, ser reconocida por el sistema para marcar su asistencia.

El proyecto está desarrollado con una arquitectura separada:

text
Frontend
↓
Backend Java Spring Boot
↓
Microservicio Python Flask + OpenCV
↓
Base de datos MySQL

Funcionalidades principales
Registro de personas.
Clasificación por tipo de persona: estudiante o docente.
Campos dinámicos según el tipo de persona.
Registro de rostro asociado a una persona.
Almacenamiento de imágenes faciales en el microservicio Python.
Reconocimiento facial usando OpenCV.
Consulta de datos de la persona reconocida desde MySQL.
Marcado automático de asistencia.
Prevención de asistencia duplicada por día.
Manejo limpio de errores desde el backend.
Interfaz web moderna con Bootstrap.
Dashboard con indicadores visuales.
Perfil del administrador.
Tecnologías utilizadas
Frontend
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
│   └── API REST con Spring Boot
│
├── facial-service-python/
│   └── Microservicio Flask para registro y reconocimiento facial
│
├── frontend/
│   └── Interfaz web con Bootstrap y JavaScript
│
├── database/
│   └── Archivos relacionados con base de datos
│
├── docs/
│   └── Documentación del proyecto
│
├── README.md
└── .gitignore

Módulos del sistema
Personas

Permite registrar estudiantes y docentes desde un solo formulario.

Los estudiantes tienen campos como:

grado
sección

Los docentes tienen campos como:

especialidad
cargo

Ambos comparten datos generales como:

nombres
apellidos
DNI
correo
teléfono
tipo de persona
estado
Reconocimiento facial

Permite seleccionar una persona registrada y asociarle una imagen facial.

Flujo:

Seleccionar persona
↓
Subir imagen del rostro
↓
Enviar imagen al microservicio Python
↓
Guardar imagen en la carpeta faces/
↓
Actualizar en MySQL que la persona tiene rostro registrado
Asistencia

Permite subir una imagen para reconocer a una persona.

Flujo:

Subir imagen
↓
Python analiza el rostro
↓
Python compara con los rostros registrados
↓
Devuelve el ID de la persona reconocida
↓
Java consulta los datos en MySQL
↓
Java registra la asistencia automáticamente
Base de datos

El sistema trabaja principalmente con estas entidades:

Persona

Representa a estudiantes y docentes.

Campos principales:

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
Asistencia

Representa el registro de asistencia de una persona.

Campos principales:

id
persona
fecha
hora
estado
metodoRegistro
fechaRegistro
Endpoints principales
Personas
GET    /api/personas
GET    /api/personas/{id}
GET    /api/personas/tipo/{tipoPersona}
POST   /api/personas
PUT    /api/personas/{id}
PATCH  /api/personas/{id}/rostro
DELETE /api/personas/{id}
Asistencias
GET  /api/asistencias
GET  /api/asistencias/fecha/{fecha}
GET  /api/asistencias/persona/{personaId}
POST /api/asistencias/marcar/{personaId}
Microservicio Python
GET  /health
POST /api/faces/register
POST /api/faces/recognize
Cómo ejecutar el proyecto
1. Clonar el repositorio
git clone https://github.com/Brayan1262/sistema-asistencia-facial.git
cd sistema-asistencia-facial
Configuración de MySQL

El proyecto usa MySQL mediante XAMPP.

Configuración usada:

Host: localhost
Puerto: 3308
Base de datos: asistencia_db

Asegúrate de tener MySQL encendido en XAMPP antes de ejecutar el backend.

Ejecutar backend Java

Entrar a la carpeta del backend:

cd backend-java

Ejecutar Spring Boot:

mvnw.cmd spring-boot:run

El backend se ejecutará en:

http://localhost:8080

Probar backend:

http://localhost:8080/api/health

Probar personas:

http://localhost:8080/api/personas
Ejecutar microservicio Python

Entrar a la carpeta del microservicio:

cd facial-service-python

Activar entorno virtual:

venv\Scripts\activate

Instalar dependencias:

pip install -r requirements.txt

Ejecutar Flask:

python app.py

El microservicio se ejecutará en:

http://localhost:5001

Probar microservicio:

http://127.0.0.1:5001/health

Debe mostrar algo similar a:

{
  "status": "ok",
  "service": "facial-service-python",
  "opencv_face_module": true
}
Ejecutar frontend

Abrir el archivo:

frontend/personas.html

Recomendado usando Live Server en VS Code:

http://127.0.0.1:5500/frontend/personas.html
Flujo de uso del sistema
1. Registrar persona

Entrar al módulo Personas y registrar un:

Estudiante

o un:

Docente
2. Registrar rostro

Entrar al módulo Reconocimiento.

Luego:

Seleccionar persona
Subir foto frontal
Presionar Registrar rostro

La imagen se guarda en:

facial-service-python/faces/
3. Reconocer persona

Entrar al módulo Asistencia.

Luego:

Subir imagen
Presionar Reconocer persona

El sistema mostrará:

Nombre de la persona
Tipo de persona
DNI
Detalle académico o laboral
Nivel de confianza
Estado de asistencia
4. Registrar asistencia

Cuando el rostro se reconoce correctamente, el sistema marca asistencia como:

PRESENTE

con método:

RECONOCIMIENTO_FACIAL

Si la persona ya registró asistencia el mismo día, el sistema evita duplicados y muestra:

La asistencia de esta persona ya fue registrada hoy.
Seguridad y privacidad

Las imágenes faciales registradas no se suben al repositorio.

La carpeta:

facial-service-python/faces/

está incluida en .gitignore para evitar subir fotos personales o datos sensibles a GitHub.

También se ignora:

facial-service-python/venv/
backend-java/target/
.env
Estado actual del proyecto

El sistema actualmente permite:

Registrar estudiantes y docentes.
Asociar una imagen facial a cada persona.
Reconocer una persona mediante imagen.
Consultar los datos reconocidos desde MySQL.
Marcar asistencia automáticamente.
Evitar duplicados de asistencia por día.
Próximas mejoras
Agregar historial visual de asistencias en el frontend.
Agregar reportes por fecha.
Agregar cámara en vivo.
Mejorar el algoritmo de reconocimiento facial.
Agregar login de administrador.
Migrar el frontend a React con Vite.
Agregar exportación de reportes en PDF o Excel.
Desplegar el sistema en la nube.

Autor

Desarrollado por:

Brayan Jair Chavez Oscor

Proyecto académico de Ingeniería de Sistemas.

Repositorio
https://github.com/Brayan1262/sistema-asistencia-facial

