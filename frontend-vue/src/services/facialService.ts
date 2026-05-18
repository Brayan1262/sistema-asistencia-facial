import { apiFace, apiJava } from "./api";

export type FaceRegisterResponse = {
  message: string;
  path: string;
  filename: string;
};

export async function registrarRostro(
  personaId: number,
  tipoPersona: string,
  image: File
) {
  const formData = new FormData();

  formData.append("personaId", String(personaId));
  formData.append("tipoPersona", tipoPersona);
  formData.append("image", image);

  const responsePython = await apiFace.post<FaceRegisterResponse>(
    "/faces/register",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  const rutaRostro = responsePython.data.path;

  await apiJava.patch(
    `/personas/${personaId}/rostro?rutaRostro=${encodeURIComponent(rutaRostro)}`
  );

  return responsePython.data;
}