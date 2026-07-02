import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RegisterInput from "./RegisterInput";
import { createPet, getPetTypes } from "../../services/petService";

interface PetType {
  id: string;
  name: string;
}

export default function AddPetForm() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [petTypeId, setPetTypeId] = useState("");

  const [petTypes, setPetTypes] = useState<PetType[]>([]);
  const [error, setError] = useState("");

  // Cargamos las especies disponibles para llenar el selector apenas se
  // monta el formulario
  useEffect(() => {
    getPetTypes()
      .then((data) => setPetTypes(data))
      .catch((err) => setError(err.message));
  }, []);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!petTypeId) {
      setError("Selecciona una especie.");
      return;
    }

    try {

      await createPet({
        name,
        breed,
        age,
        pet_type_id: petTypeId,
      });

      navigate("/profile");

    } catch (error: any) {

      setError(error.message);

    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="px-10 pt-16 pb-24 flex flex-col gap-6"
    >

      <h1 className="text-center text-3xl font-bold text-gray-700">
        Agregar mascota
      </h1>

      <RegisterInput
        placeholder="Nombre..."
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <select
        value={petTypeId}
        onChange={(e) => setPetTypeId(e.target.value)}
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

      <RegisterInput
        placeholder="Raza..."
        value={breed}
        onChange={(e) => setBreed(e.target.value)}
      />

      <RegisterInput
        placeholder="Edad..."
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />

      {
        error && (
          <p className="text-red-600">
            {error}
          </p>
        )
      }

      <button
        type="submit"
        className="
          btn
          bg-green-800
          hover:bg-green-900
          border-none
          text-white!
          rounded-xl
          mt-4
        "
      >
        Agregar mascota
      </button>

    </form>
  );
}