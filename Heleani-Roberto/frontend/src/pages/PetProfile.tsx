import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import AuthenticatedLayout from "../components/layout/AuthLayout";
import PetHeaderCard from "../components/cards/PetHeaderCard";
import OwnerCard from "../components/cards/OwnerCard";
import { getPetById, getPetTypes, updatePet, deletePet } from "../services/petService";

interface Pet {
  id: string;
  name: string;
  breed: string;
  age: string;
  pet_type_name: string;
  image_url: string;
  created_at?: string;
  owner_name: string;
  owner_email: string;
  owner_image_url: string;
}

interface PetType {
  id: string;
  name: string;
}

export default function PetProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pet, setPet] = useState<Pet | null>(null);
  const [error, setError] = useState("");

  // Controla el modal de confirmación de borrado
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // Controla el modo edición de la información básica
  const [petTypes, setPetTypes] = useState<PetType[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBreed, setEditBreed] = useState("");
  const [editAge, setEditAge] = useState("");
  const [editPetTypeId, setEditPetTypeId] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    if (!id) return;

    getPetById(id)
      .then((data) => setPet(data))
      .catch((err) => setError(err.message));

    // Cargamos las especies disponibles para el selector del modo edición
    getPetTypes()
      .then((data) => setPetTypes(data))
      .catch(() => setPetTypes([]));
  }, [id]);

  const handleEditClick = () => {
    if (!pet) return;

    // Precargamos los campos editables con los datos actuales de la mascota
    setEditName(pet.name);
    setEditBreed(pet.breed);
    setEditAge(pet.age);

    const matchingType = petTypes.find((t) => t.name === pet.pet_type_name);
    setEditPetTypeId(matchingType?.id ?? "");

    setSaveError("");
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSaveError("");
  };

  const handleSave = async () => {
    if (!id) return;

    setSaving(true);
    setSaveError("");

    try {
      await updatePet(id, {
        name: editName,
        breed: editBreed,
        age: editAge,
        pet_type_id: editPetTypeId,
      });

      // Volvemos a pedir los datos completos (incluye nombre del dueño, etc.)
      const updated = await getPetById(id);
      setPet(updated);
      setIsEditing(false);
    } catch (err: any) {
      setSaveError(err.message || "No se pudo guardar los cambios");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    setDeleting(true);
    setDeleteError("");

    try {
      await deletePet(id);
      // Mascota eliminada, volvemos al perfil donde está la galería
      navigate("/profile");
    } catch (err: any) {
      setDeleteError(err.message || "No se pudo eliminar la mascota");
      setDeleting(false);
    }
  };

  if (error) {
    return (
      <AuthenticatedLayout>
        <main className="p-8 pb-24">
          <p className="text-red-600 text-center">{error}</p>
        </main>
      </AuthenticatedLayout>
    );
  }

  if (!pet) {
    return (
      <AuthenticatedLayout>
        <main className="p-8 pb-24">
          <p className="text-center text-gray-500">Cargando...</p>
        </main>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <main className="p-8 pb-24">
        <PetHeaderCard
          name={pet.name}
          imageUrl={pet.image_url}
          createdAt={pet.created_at}
          isEditing={isEditing}
          editedName={editName}
          onEditedNameChange={setEditName}
          onEditClick={handleEditClick}
        />

        <div className="mt-8 border border-green-400 rounded-3xl p-4 flex flex-col gap-6 bg-white">
          {/* Encabezado */}
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-gray-700">Información básica</h2>
          </div>

          {/* Datos básicos */}
          {isEditing ? (
            <div className="grid grid-cols-2 gap-2">
              <div className="col-span-2">
                <p className="text-sm text-gray-500 mb-1">Especie</p>
                <select
                  value={editPetTypeId}
                  onChange={(e) => setEditPetTypeId(e.target.value)}
                  className="
                    select
                    w-full
                    bg-white
                    border-[#79C798]
                    focus:outline-none
                    focus:border-green-600
                  "
                >
                  <option value="">Especie...</option>
                  {petTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-2">
                <p className="text-sm text-gray-500 mb-1">Raza</p>
                <input
                  type="text"
                  value={editBreed}
                  onChange={(e) => setEditBreed(e.target.value)}
                  placeholder="Raza..."
                  className="
                    input
                    w-full
                    bg-transparent
                    border-[#79C798]
                    focus:outline-none
                    focus:border-green-600
                  "
                />
              </div>

              <div className="col-span-2">
                <p className="text-sm text-gray-500 mb-1">Edad</p>
                <input
                  type="text"
                  value={editAge}
                  onChange={(e) => setEditAge(e.target.value)}
                  placeholder="Edad..."
                  className="
                    input
                    w-full
                    bg-transparent
                    border-[#79C798]
                    focus:outline-none
                    focus:border-green-600
                  "
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <div className="border border-green-400 rounded-xl p-2 text-center">
                <p className="text-sm text-gray-500">Especie</p>

                <p className="font-semibold">{pet.pet_type_name}</p>
              </div>

              <div className="border border-green-400 rounded-xl p-2 text-center">
                <p className="text-sm text-gray-500">Raza</p>

                <p className="font-semibold">{pet.breed}</p>
              </div>

              <div className="border border-green-400 rounded-xl p-2 text-center col-span-2">
                <p className="text-sm text-gray-500">Edad</p>

                <p className="font-semibold">{pet.age}</p>
              </div>
            </div>
          )}

          {/* Guardar / cancelar edición */}
          {isEditing && (
            <div className="flex flex-col gap-2">
              {saveError && (
                <p className="text-red-600 text-center">{saveError}</p>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  disabled={saving}
                  onClick={handleCancelEdit}
                  className="btn flex-1 rounded-xl border-gray-300"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  disabled={saving}
                  onClick={handleSave}
                  className="
                    btn
                    flex-1
                    bg-green-800
                    hover:bg-green-900
                    border-none
                    text-white
                    rounded-xl
                  "
                >
                  {saving ? "Guardando..." : "Guardar cambios"}
                </button>
              </div>
            </div>
          )}

          {/* Dueño */}
          <section>
            <h3 className="text-2xl font-bold text-gray-700 mb-3">Dueño(a)</h3>

            <Link to="/profile">
              <OwnerCard
                name={pet.owner_name}
                email={pet.owner_email}
                imageUrl={pet.owner_image_url}
              />
            </Link>
          </section>

          {/* Eliminar mascota */}
          <section>
            <button
              type="button"
              onClick={() => setShowConfirm(true)}
              className="
                btn
                w-full
                bg-green-900
                hover:bg-green-950
                border-none
                text-white
                rounded-xl
              "
            >
              Eliminar mascota
            </button>

            {deleteError && (
              <p className="text-red-600 text-center mt-2">{deleteError}</p>
            )}
          </section>
        </div>

        {/* Modal de confirmación de borrado */}
        {showConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full flex flex-col gap-4">
              <h3 className="text-xl font-bold text-gray-800">
                ¿Eliminar a {pet.name}?
              </h3>

              <p className="text-gray-600">
                Esta acción eliminará el perfil de {pet.name} y todo su
                historial (incluidas sus citas) de forma permanente. No se
                puede deshacer.
              </p>

              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  disabled={deleting}
                  onClick={() => setShowConfirm(false)}
                  className="btn flex-1 rounded-xl border-gray-300"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  disabled={deleting}
                  onClick={handleDelete}
                  className="btn flex-1 rounded-xl bg-green-900 hover:bg-green-950 border-none text-white"
                >
                  {deleting ? "Eliminando..." : "Sí, eliminar"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </AuthenticatedLayout>
  );
}