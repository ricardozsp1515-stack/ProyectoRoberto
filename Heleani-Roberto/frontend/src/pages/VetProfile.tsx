import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import AuthLayout from "../components/layout/AuthLayout";
import AssociatedClinicCard from "../components/cards/AssoClinicCard";
import { getVetById } from "../services/vetService";
import { getCenterById } from "../services/centerService";

interface Vet {
  id: string;
  name: string;
  license: string;
  specialty: string;
  veterinary_center_id: string | null;
  image_url: string;
  created_at: string;
}

interface Center {
  id: string;
  name: string;
  contact: string;
  image_url: string;
}

export default function VetProfile() {
  const { id } = useParams<{ id: string }>();

  const [vet, setVet] = useState<Vet | null>(null);
  const [center, setCenter] = useState<Center | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    getVetById(id)
      .then((data) => setVet(data))
      .catch((err) => setError(err.message));
  }, [id]);

  // Si el veterinario tiene una clinica asociada, traemos tambien sus datos
  // para mostrar la tarjeta de "Clinicas asociadas"
  useEffect(() => {
    if (!vet?.veterinary_center_id) return;

    getCenterById(vet.veterinary_center_id)
      .then((data) => setCenter(data))
      .catch(() => setCenter(null));
  }, [vet]);

  const formattedDate = vet?.created_at
    ? new Date(vet.created_at).toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  if (error) {
    return (
      <AuthLayout>
        <main className="p-8">
          <p className="text-center text-red-600">{error}</p>
        </main>
      </AuthLayout>
    );
  }

  if (!vet) {
    return (
      <AuthLayout>
        <main className="p-8">
          <p className="text-center text-gray-600">Cargando...</p>
        </main>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <main className="p-8 pb-24 flex flex-col gap-6">
        {/* Header */}
        <div className="bg-white rounded-3xl p-4">
          <img
            src={vet.image_url}
            alt={vet.name}
            className="w-full h-64 object-cover rounded-2xl"
          />

          <div className="flex justify-between items-center mt-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-700">{vet.name}</h1>

              {formattedDate && (
                <p className="text-gray-500">Se unió el {formattedDate}</p>
              )}
            </div>

            <span className="text-green-700 text-4xl">✔</span>
          </div>
        </div>

        {/* Información */}
        <div className="bg-white rounded-3xl p-4 flex flex-col gap-6">
          <section>
            <h2 className="text-3xl font-bold text-gray-700">
              Veterinario afiliado
            </h2>

            <p className="text-gray-600 mt-2">
              Especialidad: {vet.specialty}
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-700">
              Número registrado
            </h2>

            <p className="text-gray-600 mt-2">{vet.license}</p>
          </section>

          {center && (
            <section>
              <h2 className="text-3xl font-bold text-gray-700 mb-4">
                Clínicas asociadas
              </h2>

              <Link to={`/clinic-profile/${center.id}`}>
                <AssociatedClinicCard
                  name={center.name}
                  phone={center.contact}
                  imageUrl={center.image_url}
                />
              </Link>
            </section>
          )}

          {/* Recomendar */}
          <section>
            <h2 className="text-2xl font-bold text-gray-700 mb-4">
              ¿Recomienda este perfil?
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setMessage("Perfil recomendado")}
                className="
                  btn
                  bg-green-600
                  hover:bg-green-700
                  border-none
                  text-white
                "
              >
                SI
              </button>

              <button
                type="button"
                onClick={() => setMessage("Perfil no recomendado")}
                className="
                  btn
                  btn-outline
                  border-green-600
                  text-green-700
                "
              >
                NO
              </button>
            </div>

            {message && (
              <div className="mt-4 text-center">
                <span
                  className="
                    bg-green-700
                    text-white
                    px-4
                    py-2
                    rounded
                  "
                >
                  {message}
                </span>
              </div>
            )}
          </section>
        </div>
      </main>
    </AuthLayout>
  );
}