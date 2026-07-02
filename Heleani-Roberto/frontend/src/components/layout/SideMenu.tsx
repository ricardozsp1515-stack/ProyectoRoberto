import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProfile } from "../../services/userServices";
import { getMyVetProfile } from "../../services/vetService";
import { getMyCenter } from "../../services/centerService";

export default function SideMenu() {
    const navigate = useNavigate();
    const location = useLocation();

    const [isAdmin, setIsAdmin] = useState(false);
    const [isVet, setIsVet] = useState(false);
    const [myVetId, setMyVetId] = useState<string | null>(null);
    const [myCenterId, setMyCenterId] = useState<string | null>(null);

    // Verificamos el rol para el panel de admin y el switch de veterinario.
    // Esto es solo UX: el backend igual protege todo lo relevante sin
    // importar lo que muestre el menu.
    useEffect(() => {
        getProfile()
            .then((profile) => {
                setIsAdmin(profile.role_name === "admin");
                setIsVet(profile.role_name === "Veterinarian");
            })
            .catch(() => {
                setIsAdmin(false);
                setIsVet(false);
            });
    }, []);

    // Si el usuario es veterinario, buscamos su propio veterinarian.id una
    // sola vez, para no tener que pedirlo cada vez que se hace click
    useEffect(() => {
        if (!isVet) return;

        getMyVetProfile().then((myVet) => {
            setMyVetId(myVet?.id ?? null);
        });
    }, [isVet]);

    // Cualquier usuario (no solo veterinarios) puede llegar a ser dueño de
    // una clinica una vez el admin aprueba su solicitud, asi que esto se
    // busca sin importar el rol
    useEffect(() => {
        getMyCenter().then((center) => {
            setMyCenterId(center?.id ?? null);
        });
    }, []);

    // "Modo veterinario" no es un estado global, se define por la ruta en la
    // que estas: si ya estas viendo tu propio perfil de veterinario, el boton
    // cambia a "Volver a modo usuario"
    const inVetMode = myVetId !== null && location.pathname === `/vet-profile/${myVetId}`;

    const handleToggleVetMode = () => {
        if (inVetMode) {
            navigate("/profile");
        } else if (myVetId) {
            navigate(`/vet-profile/${myVetId}`);
        }
    };

  return (
    <div className="drawer-side z-50">
      <label htmlFor="side-menu" className="drawer-overlay"></label>

      <ul className="menu p-6 w-64 min-h-full bg-green-700 text-white">
        {/* General */}
        <h2 className="text-4xl mb-4">General</h2>

        <li>
          <Link to="/configure-profile" className="text-white! text-2xl">
            Configurar perfil
          </Link>
        </li>

        <li>
          <Link to="/" className="text-white! text-2xl">
            Página principal
          </Link>
        </li>

        <li>
          <Link to="/terms" className="text-white! text-2xl">
            Términos y condiciones
          </Link>
        </li>

        <div className="divider divider-neutral"></div>

        {/* Modo veterinario - solo visible si el usuario ya es veterinario */}
        {isVet && myVetId && (
          <>
            <li>
              <button
                type="button"
                onClick={handleToggleVetMode}
                className="text-white! text-2xl w-full text-left"
              >
                {inVetMode ? "Volver a modo usuario" : "Cambiar a modo veterinario"}
              </button>
            </li>

            <div className="divider divider-neutral"></div>
          </>
        )}

        {/* Mi clínica - visible solo si el usuario ya tiene una clinica aprobada */}
        {myCenterId && (
          <>
            <li>
              <Link to={`/clinic-profile/${myCenterId}`} className="text-white! text-2xl">
                Administrar mi clínica
              </Link>
            </li>

            <div className="divider divider-neutral"></div>
          </>
        )}

        {/* Afiliaciones */}
        <h2 className="text-4xl mb-4">Afiliaciones</h2>

        <li>
          <Link to="/vet-verification" className="text-white! text-2xl">
            Afiliación veterinaria
          </Link>
        </li>

        <li>
          <Link to="/clinic-verification" className="text-white! text-2xl">
            Afiliación clínica
          </Link>
        </li>

        <div className="divider divider-neutral"></div>

        {/* Administración - solo visible para admins */}
        {isAdmin && (
          <>
            <h2 className="text-4xl mb-4">Administración</h2>

            <li>
              <Link to="/admin" className="text-white! text-2xl">
                Panel de administrador
              </Link>
            </li>

            <div className="divider divider-neutral"></div>
          </>
        )}

        {/* Preferencias */}
        <h2 className="text-4xl mb-4">Preferencias</h2>

        <li>
          <div className="flex justify-between items-center w-full">
            <span className="text-white text-2xl">Notificaciones</span>

            <input
              type="checkbox"
              defaultChecked
              className="toggle toggle-success toggle-sm"
            />
          </div>
        </li>

        <li>
          <Link to="/information" className="text-white! text-2xl">
            Información
          </Link>
        </li>

        <li>
          <Link to="/" className="text-white! text-2xl">
            Cerrar sesión
          </Link>
        </li>
      </ul>
    </div>
  );
}