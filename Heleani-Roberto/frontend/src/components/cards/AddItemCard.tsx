import { useState } from "react";

interface AddItemCardProps {
  title: string;
  placeholder?: string;
}

export default function AddItemCard({
  title,
  placeholder = "Agregar...",
}: AddItemCardProps) {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAdd = () => {
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
    }, 2500);
  };

  return (
    <div className="bg-[#F5F0E6] w-full">
      {/* Header */}
      <div>
        <h2 className="text-center text-gray-700 text-3xl font-semibold">
          {title}
        </h2>
      </div>

      {/* Contenido */}
      <div className="flex items-center gap-4 pt-3">
        <input
          type="text"
          placeholder={placeholder}
          className="
            input
            input-bordered
            w-full
            border-green-400
            bg-[#F5F0E6]
          "
        />

        <button
          type="button"
          onClick={handleAdd}
          className="
            btn
            btn-circle
            bg-green-600
            hover:bg-green-700
            border-none
            text-white
            text-3xl
          "
        >
          +
        </button>
      </div>

      {/* Mensaje */}
      <div className="flex justify-center pb-2 pt-3">
        {showSuccess && (
          <div
            className="
              badge
              badge-success
              text-white
              px-4
              py-3
              rounded-none
            "
          >
            ¡Agregado exitosamente!
          </div>
        )}
      </div>
    </div>
  );
}