import { apiFetch } from "./api";


// Lista de todos los veterinarios registrados (para la página principal / búsqueda)
export function getAllVets() {

  return apiFetch("/veterinarians");

}


// Busca veterinarios por nombre
export function getVetsByName(name: string) {

  return apiFetch(`/veterinarians/vets_name/${name}`);

}


// Trae los datos de un veterinario específico para su perfil
export function getVetById(id: string) {

  return apiFetch(`/veterinarians/vets_id/${id}`);

}


// Trae el registro de veterinario del usuario logueado (si lo tiene). Se usa
// para el switch de modo "usuario normal" <-> "modo veterinario", porque
// /vet-profile/:id necesita veterinarian.id, no el id del usuario.
export async function getMyVetProfile() {

  try {

    return await apiFetch("/veterinarians/me");

  } catch (error) {

    // 404 si el usuario no es veterinario
    return null;

  }

}


// Trae todos los veterinarios asociados a una clínica (para el perfil de la clínica)
export function getVetsFromCenter(centerId: string) {

  return apiFetch(`/veterinarians/vets_from_center/${centerId}`);

}


// Envía la solicitud de afiliación veterinaria del usuario logueado.
// data: { license: string, specialty: string, veterinary_center_id?: string }
export function createVetRequest(data: {
  license: string;
  specialty: string;
  veterinary_center_id?: string;
}) {

  return apiFetch("/veterinarians/requests", {
    method: "POST",
    body: JSON.stringify(data),
  });

}


// Trae las solicitudes ya procesadas (aprobadas o rechazadas) del usuario logueado,
// para que pueda ver el resultado y el mensaje que dejó el admin
export async function getMyProcessedVetRequests() {

  try {

    return await apiFetch("/veterinarians/processed");

  } catch (error) {

    // El backend responde 404 si el usuario aun no tiene solicitudes procesadas
    return [];

  }

}


// ---- Funciones de administrador ----

// Trae todas las solicitudes de veterinario pendientes de revisión. Admin only!
export async function getPendingVetRequests() {

  try {

    return await apiFetch("/veterinarians/requests");

  } catch (error) {

    // El backend responde 404 si no hay solicitudes pendientes
    return [];

  }

}


// Aprueba una solicitud de veterinario. Admin only!
export function approveVetRequest(id: string, message: string) {

  return apiFetch(`/veterinarians/${id}/approve`, {
    method: "PUT",
    body: JSON.stringify({ message }),
  });

}


// Rechaza una solicitud de veterinario. Admin only!
export function rejectVetRequest(id: string, message: string) {

  return apiFetch(`/veterinarians/${id}/reject`, {
    method: "PUT",
    body: JSON.stringify({ message }),
  });

}