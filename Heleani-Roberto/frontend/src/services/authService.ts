import { apiFetch } from "./api";


export async function register(data:any){

  const response = await apiFetch(
    "/auth/register",
    {
      method:"POST",

      body:JSON.stringify(data)
    }
  );

  // Guardamos el token apenas el backend lo devuelve, asi
  // apiFetch puede mandarlo en las siguientes peticiones autenticadas
  if (response.token) {
    localStorage.setItem("token", response.token);
  }

  return response;

}



export async function login(
  email:string,
  password:string
){

  const response = await apiFetch(
    "/auth/login",
    {
      method:"POST",

      body:JSON.stringify({
        email,
        password
      })
    }
  );

  if (response.token) {
    localStorage.setItem("token", response.token);
  }

  // El login tambien devuelve los datos basicos del usuario,
  // los guardamos para no tener que pedirlos de nuevo al cargar el perfil
  if (response.user) {
    localStorage.setItem("user", JSON.stringify(response.user));
  }

  return response;

}



export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}



export function getCurrentUser() {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
}