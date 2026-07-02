import { apiFetch } from "./api";


// Lista de todas las clínicas registradas (para la página principal / búsqueda)
export function getAllCenters() {

  return apiFetch("/centers");

}


// Busca clínicas por nombre
export function getCentersByName(name: string) {

  return apiFetch(`/centers/center_name/${name}`);

}


// Trae los datos de una clínica específica para su perfil
export function getCenterById(id: string) {

  return apiFetch(`/centers/center_id/${id}`);

}


// Trae la clínica que le pertenece al usuario logueado, si tiene una
// aprobada. Se usa para que, tras la aprobación de su solicitud, pueda
// encontrar y administrar su propio perfil de clínica.
export async function getMyCenter() {

  try {

    return await apiFetch("/centers/me");

  } catch (error) {

    // 404 si el usuario no tiene una clínica registrada
    return null;

  }

}


// Envía la solicitud para registrar una clínica de la que el usuario logueado es dueño.
// data: { name, address, contact, description } - todos requeridos por el backend
export function createCenterRequest(data: {
  name: string;
  address: string;
  contact: string;
  description: string;
}) {

  return apiFetch("/centers/requests", {
    method: "POST",
    body: JSON.stringify(data),
  });

}


// Trae las solicitudes ya procesadas (aprobadas o rechazadas) del usuario logueado
export async function getMyProcessedCenterRequests() {

  try {

    return await apiFetch("/centers/processed");

  } catch (error) {

    // El backend responde 404 si el usuario aun no tiene solicitudes procesadas
    return [];

  }

}


// Actualiza los datos de una clínica ya aprobada (solo el dueño puede hacerlo,
// el backend valida esto comparando el token con el user_id de la clínica)
export function updateCenter(id: string, data: {
  name?: string;
  address?: string;
  contact?: string;
  description?: string;
}) {

  return apiFetch(`/centers/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

}


// Elimina una clínica (solo el dueño, o un admin)
export function deleteCenter(id: string) {

  return apiFetch(`/centers/${id}`, {
    method: "DELETE",
  });

}


// ---- Funciones de administrador ----

// Trae todas las solicitudes de clínica pendientes de revisión. Admin only!
export async function getPendingCenterRequests() {

  try {

    return await apiFetch("/centers/requests");

  } catch (error) {

    // El backend responde 404 si no hay solicitudes pendientes
    return [];

  }

}


// Aprueba una solicitud de clínica. Admin only!
export function approveCenterRequest(id: string, message: string) {

  return apiFetch(`/centers/${id}/approve`, {
    method: "PUT",
    body: JSON.stringify({ message }),
  });

}


// Rechaza una solicitud de clínica. Admin only!
export function rejectCenterRequest(id: string, message: string) {

  return apiFetch(`/centers/${id}/reject`, {
    method: "PUT",
    body: JSON.stringify({ message }),
  });

}