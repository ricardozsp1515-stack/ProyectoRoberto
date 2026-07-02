import { useNavigate } from "react-router-dom";

export default function AddPetButton() {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate("/add-pet")}
      className="
        btn
        w-full
        bg-green-800
        hover:bg-green-900
        border-none
        text-white
        rounded-xl
      "
    >
      Agregar mascota
    </button>
  );
}