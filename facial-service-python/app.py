from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import re
import cv2
import numpy as np
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FACES_FOLDER = os.path.join(BASE_DIR, "faces")
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}

os.makedirs(FACES_FOLDER, exist_ok=True)


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def get_face_detector():
    cascade_path = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
    return cv2.CascadeClassifier(cascade_path)


def read_image_from_file_storage(file_storage):
    file_bytes = np.frombuffer(file_storage.read(), np.uint8)
    image = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
    return image


def read_image_from_path(path):
    return cv2.imread(path)


def extract_face(image):
    if image is None:
        return None

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    detector = get_face_detector()

    faces = detector.detectMultiScale(
        gray,
        scaleFactor=1.1,
        minNeighbors=5,
        minSize=(80, 80)
    )

    if len(faces) == 0:
        return None

    # Tomamos el rostro más grande
    faces = sorted(faces, key=lambda rect: rect[2] * rect[3], reverse=True)
    x, y, w, h = faces[0]

    face = gray[y:y + h, x:x + w]
    face = cv2.resize(face, (200, 200))
    face = cv2.equalizeHist(face)

    return face


def parse_persona_from_filename(filename):
    # Formato esperado: persona_1_estudiante.jpg
    match = re.match(r"persona_(\d+)_(estudiante|docente)\.(jpg|jpeg|png)$", filename.lower())

    if not match:
        return None

    return {
        "personaId": match.group(1),
        "tipoPersona": match.group(2).upper()
    }


@app.route("/health", methods=["GET"])
def health():
    has_face_module = hasattr(cv2, "face")

    return jsonify({
        "status": "ok",
        "service": "facial-service-python",
        "faces_folder": FACES_FOLDER,
        "opencv_face_module": has_face_module
    })


@app.route("/api/faces/register", methods=["POST"])
def register_face():
    print("Solicitud recibida en /api/faces/register")

    persona_id = request.form.get("personaId")
    tipo_persona = request.form.get("tipoPersona")
    image = request.files.get("image")

    print("personaId:", persona_id)
    print("tipoPersona:", tipo_persona)
    print("image:", image.filename if image else None)

    if not persona_id:
        return jsonify({
            "status": "error",
            "message": "Falta personaId"
        }), 400

    if not tipo_persona:
        return jsonify({
            "status": "error",
            "message": "Falta tipoPersona"
        }), 400

    if not image:
        return jsonify({
            "status": "error",
            "message": "No se envió ninguna imagen"
        }), 400

    if not allowed_file(image.filename):
        return jsonify({
            "status": "error",
            "message": "Formato no permitido. Usa JPG o PNG"
        }), 400

    extension = image.filename.rsplit(".", 1)[1].lower()
    safe_tipo = secure_filename(tipo_persona.lower())
    filename = f"persona_{persona_id}_{safe_tipo}.{extension}"

    filepath = os.path.join(FACES_FOLDER, filename)
    image.save(filepath)

    print("Imagen guardada en:", filepath)

    return jsonify({
        "status": "ok",
        "message": "Rostro registrado correctamente",
        "personaId": persona_id,
        "tipoPersona": tipo_persona,
        "filename": filename,
        "path": filepath
    })


@app.route("/api/faces/recognize", methods=["POST"])
def recognize_face():
    print("Solicitud recibida en /api/faces/recognize")

    image = request.files.get("image")

    if not image:
        return jsonify({
            "status": "error",
            "recognized": False,
            "message": "No se envió ninguna imagen"
        }), 400

    if not allowed_file(image.filename):
        return jsonify({
            "status": "error",
            "recognized": False,
            "message": "Formato no permitido. Usa JPG o PNG"
        }), 400

    if not hasattr(cv2, "face"):
        return jsonify({
            "status": "error",
            "recognized": False,
            "message": "OpenCV no tiene módulo face. Instala opencv-contrib-python."
        }), 500

    uploaded_image = read_image_from_file_storage(image)
    uploaded_face = extract_face(uploaded_image)

    if uploaded_face is None:
        return jsonify({
            "status": "error",
            "recognized": False,
            "message": "No se detectó un rostro claro en la imagen enviada"
        }), 400

    face_images = []
    labels = []
    label_to_person = {}

    current_label = 0

    for filename in os.listdir(FACES_FOLDER):
        if not allowed_file(filename):
            continue

        person_data = parse_persona_from_filename(filename)

        if person_data is None:
            continue

        image_path = os.path.join(FACES_FOLDER, filename)
        stored_image = read_image_from_path(image_path)
        stored_face = extract_face(stored_image)

        if stored_face is None:
            print("No se detectó rostro en archivo guardado:", filename)
            continue

        face_images.append(stored_face)
        labels.append(current_label)

        label_to_person[current_label] = {
            "personaId": person_data["personaId"],
            "tipoPersona": person_data["tipoPersona"],
            "filename": filename,
            "path": image_path
        }

        current_label += 1

    if len(face_images) == 0:
        return jsonify({
            "status": "error",
            "recognized": False,
            "message": "No hay rostros registrados para comparar"
        }), 400

    recognizer = cv2.face.LBPHFaceRecognizer_create()
    recognizer.train(face_images, np.array(labels))

    predicted_label, confidence = recognizer.predict(uploaded_face)

    person = label_to_person.get(predicted_label)

    print("Predicción:", person)
    print("Confianza:", confidence)

    # En LBPH, menor confidence significa mejor coincidencia.
    # Este umbral es inicial para pruebas. Luego lo ajustamos.
    THRESHOLD = 90

    if person is None or confidence > THRESHOLD:
        return jsonify({
            "status": "ok",
            "recognized": False,
            "message": "No se reconoció a la persona",
            "confidence": confidence
        })

    return jsonify({
        "status": "ok",
        "recognized": True,
        "message": "Persona reconocida correctamente",
        "personaId": person["personaId"],
        "tipoPersona": person["tipoPersona"],
        "filename": person["filename"],
        "path": person["path"],
        "confidence": confidence
    })


if __name__ == "__main__":
    app.run(port=5001, debug=True)