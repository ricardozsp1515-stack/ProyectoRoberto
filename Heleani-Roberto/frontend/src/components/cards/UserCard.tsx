import { useEffect, useState } from "react";
import { getProfile } from "../../services/userServices";

// Misma imagen que el backend asigna por defecto a todo usuario nuevo
// (tabla "images", registro "User"). Se usa como respaldo mientras carga
// el perfil o si por algun motivo el usuario no tiene imagen asignada.
const DEFAULT_PROFILE_IMAGE =
  "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_150.png";

interface Profile {
  name: string;
  image_url: string;
}

export default function UserCard() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getProfile()
      .then((data) => setProfile(data))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="bg-white rounded-3xl p-4 shadow-sm">
      <img
        src={profile?.image_url || DEFAULT_PROFILE_IMAGE}
        alt="Perfil"
        className="w-full h-44 object-cover rounded-2xl"
      />

      <div className="mt-4">
        <h2 className="text-3xl font-semibold text-gray-700">
          {profile?.name ?? "Cargando..."}
        </h2>

        {error && (
          <p className="text-red-600 mt-2">{error}</p>
        )}
      </div>
    </div>
  );
}