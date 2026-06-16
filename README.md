# Sistema de Asistencia Facial 📸

> Sistema web de asistencia con reconocimiento facial desarrollado para instituciones educativas. Permite registrar estudiantes y docentes, asociarles una imagen facial, reconocerlos mediante inteligencia artificial, marcar su asistencia automáticamente, generar reportes y administrar el sistema desde un panel dinámico.
>
> ![Java](https://img.shields.io/badge/JAVA-21-ED8B00?style=for-the-badge&logo=java&logoColor=white) ![Spring Boot](https://img.shields.io/badge/SPRING_BOOT-3-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white) ![Angular](https://img.shields.io/badge/ANGULAR-17-DD0031?style=for-the-badge&logo=angular&logoColor=white) ![Python](https://img.shields.io/badge/PYTHON-3.12-3776AB?style=for-the-badge&logo=python&logoColor=white) ![Flask](https://img.shields.io/badge/FLASK-API-000000?style=for-the-badge&logo=flask&logoColor=white) ![OpenCV](https://img.shields.io/badge/OPENCV-AI-5C3EE8?style=for-the-badge&logo=opencv&logoColor=white) ![MySQL](https://img.shields.io/badge/MYSQL-DB-4479A1?style=for-the-badge&logo=mysql&logoColor=white)

---

## 🚀 Características Principales

- **Gestión Institucional:** Registro y administración de `ESTUDIANTES` y `DOCENTES` (campos dinámicos según el tipo de persona) con funciones de activación y desactivación.
- **Reconocimiento Facial con IA:** Registro de rostros y reconocimiento en tiempo real mediante imágenes estáticas o **cámara en vivo** impulsado por OpenCV y Python.
- **Asistencia Automatizada:** Marcado automático (`PRESENTE`, `TARDANZA`, `FALTA`, `JUSTIFICADO`) validando y bloqueando la duplicidad de asistencia por día.
- **Dashboard Interactivo:** Panel administrativo con gráficos visuales y resumen estadístico de la población de la institución.
- **Reportes Avanzados:** Filtros dinámicos (fechas, tipo de persona, estado), exportación directa a **Excel** y generación de versión para imprimir en **PDF**.
- **Arquitectura Distribuida:** Comunicación fluida entre el frontend, la API principal en Java/Spring Boot y el motor independiente de IA en Python/Flask.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnologías |
| :--- | :--- |
| **Frontend Web** | HTML5, CSS3, JavaScript, Angular, Bootstrap 5, LocalStorage |
| **Backend API (Core)** | Java 21, Spring Boot, Spring Data JPA, Maven |
| **Microservicio IA** | Python 3.12, Flask, OpenCV, NumPy |
| **Base de Datos** | MySQL (XAMPP) |
| **Control de Versiones** | Git, GitHub |

---

## 🏗️ Arquitectura del Sistema

El proyecto opera mediante la comunicación en cadena de múltiples servicios independientes:
```text
Frontend Web  ➔  Backend Java Spring Boot  ➔  Microservicio Python (Flask + OpenCV)  ➔  MySQL DB
```

Estructura de directorios principales:
- `/backend-java`: API REST principal en Spring Boot.
- `/facial-service-python`: Motor de Inteligencia Artificial para el escaneo y reconocimiento facial.
- `/frontend`: Interfaz base clásica (HTML/CSS/JS puros).
- `/frontend-angular`: Interfaz escalable basada en componentes.
- `/frontend-vue`: Próxima migración planeada a Vue 3.

---

## ⚙️ Cómo ejecutar el proyecto (Modo Local)

Para ejecutar el sistema completo se deben iniciar los módulos de forma paralela.

### 1. Base de Datos (MySQL)
Configura e inicia MySQL (por ejemplo, usando XAMPP):
- **Host:** `localhost`
- **Puerto:** `3308`
- **Database:** `asistencia_db`

### 2. Levantar API Backend (Java)
Desde una terminal en la carpeta principal:
```bash
cd backend-java
.\mvnw spring-boot:run
```
> La API estará disponible en `http://localhost:8080`.

### 3. Levantar Microservicio IA (Python)
Desde una nueva terminal:
```bash
cd facial-service-python
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
python app.py
```
> El motor facial correrá en `http://localhost:5001`. (Verifica que funcione en `http://localhost:5001/health`).

### 4. Lanzar Frontend (Panel de Control)
Puedes usar **Live Server** (Extensión de VSCode) para abrir el archivo base:
`frontend/personas.html`

**Credenciales de administrador por defecto:**
- **Usuario:** `admin`
- **Contraseña:** `admin123`

---

## 🔐 Seguridad y Privacidad

- **Almacenamiento de Rostros:** Las imágenes de entrenamiento base se almacenan en `facial-service-python/faces/` y se excluyen en el `.gitignore` para proteger la privacidad.
- **Reconocimiento en Vivo:** Las capturas de la cámara en vivo para la asistencia se almacenan en memoria temporal durante milisegundos para su análisis y no persisten.

---

## 🚀 Próximas Mejoras (Roadmap)

- [ ] Consolidar la migración completa del Frontend base hacia **Vue 3 + Vite**.
- [ ] Implementar seguridad **JWT** y roles definidos mediante `Spring Security` en el backend.
- [ ] Agregar gestión avanzada de **Cursos, Aulas y Horarios**.
- [ ] Optimizar el algoritmo de OpenCV agregando detección de rostros en la interfaz antes de realizar la captura de fotos.
- [ ] Despliegue de la arquitectura completa en Docker (Docker Compose multi-servicios) y plataformas Cloud.

---

## 👨‍💻 Autor

**Brayan Jair Chavez Oscor**
*Proyecto Académico - Ingeniería de Sistemas*

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Brayan1262)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/brayan-chavez-218088334/)
[![Portfolio](https://img.shields.io/badge/Portfolio-000000?style=for-the-badge&logo=web&logoColor=white)](https://brayan1262.github.io/portafolio-brayan/)

> *Este proyecto demuestra la integración exitosa de Inteligencia Artificial (Visión Computacional) en aplicaciones web empresariales modernas.*