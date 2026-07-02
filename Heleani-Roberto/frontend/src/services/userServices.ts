import { apiFetch } from "./api";


// Trae los datos del usuario autenticado (nombre, correo, imagen de perfil, rol)
// usando el token guardado en localStorage. El backend identifica al usuario
// a partir del token, por eso no se necesita pasar ningun id.
export function getProfile() {

  return apiFetch("/users/get_user");

}