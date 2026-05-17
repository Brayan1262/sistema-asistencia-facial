from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FACES_FOLDER = os.path.join(BASE_DIR, "faces")
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}

os.makedirs(FACES_FOLDER, exist_ok=True)


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "service": "facial-service-python",
        "faces_folder": FACES_FOLDER
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


if __name__ == "__main__":
    app.run(port=5001, debug=True)