interface PetHeaderCardProps {
  name: string;
  imageUrl: string;
  createdAt?: string;

  // Modo edición: cuando está activo, el nombre se muestra como input
  // en vez de texto, y el lápiz se oculta (el guardar/cancelar vive
  // en la página, junto al resto del formulario de edición)
  isEditing?: boolean;
  editedName?: string;
  onEditedNameChange?: (value: string) => void;
  onEditClick?: () => void;
}

export default function PetHeaderCard({
  name,
  imageUrl,
  createdAt,
  isEditing = false,
  editedName = "",
  onEditedNameChange,
  onEditClick,
}: PetHeaderCardProps) {

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="card border border-green-400 bg-white">
      <div className="card-body p-3">

        <img
          src={imageUrl}
          alt={name}
          className="rounded-xl h-56 object-cover"
        />

        <div className="flex justify-between items-center mt-3">
          <div className="flex-1 mr-3">
            {isEditing ? (
              <input
                type="text"
                value={editedName}
                onChange={(e) => onEditedNameChange?.(e.target.value)}
                placeholder="Nombre..."
                className="
                  input
                  w-full
                  font-bold
                  text-2xl
                  text-gray-700
                  bg-transparent
                  border-[#79C798]
                  focus:outline-none
                  focus:border-green-600
                "
              />
            ) : (
              <h2 className="font-bold text-4xl text-gray-700">
                {name}
              </h2>
            )}

            {formattedDate && !isEditing && (
              <p className="text-gray-500">
                Se creó el {formattedDate}
              </p>
            )}
          </div>

          {!isEditing && (
            <button
              type="button"
              onClick={onEditClick}
              aria-label="Editar mascota"
              className="btn btn-ghost text-green-800 text-2xl"
            >
              ✎
            </button>
          )}
        </div>

      </div>
    </div>
  );
}