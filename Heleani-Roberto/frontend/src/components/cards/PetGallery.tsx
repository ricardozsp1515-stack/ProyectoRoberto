import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPets } from "../../services/petService";

interface Pet {
    id: string;
    name: string;
    image_url: string;
}

export default function PetGallery() {
    const [pets, setPets] = useState<Pet[]>([]);

    useEffect(() => {
        getPets().then((data) => setPets(data));
    }, []);

    return (
        <div>
            <h2 className="text-center text-3xl font-semibold text-gray-700 mb-6">
                Mascotas registradas
            </h2>

            <div className="bg-white rounded-3xl p-4">
                {
                    // Si el usuario aun no tiene mascotas, este espacio
                    // simplemente queda en blanco (sin mensajes ni placeholders)
                    pets.length > 0 && (
                        <div className="grid grid-cols-3 gap-4">
                            {pets.map((pet) => (
                                <Link
                                    key={pet.id}
                                    to={`/pet-profile/${pet.id}`}
                                >
                                    <img
                                        src={pet.image_url}
                                        alt={pet.name}
                                        className="
                                            w-full
                                            aspect-square
                                            object-cover
                                            rounded-xl
                                            hover:scale-105
                                            transition-transform
                                            cursor-pointer
                                        "
                                    />
                                </Link>
                            ))}
                        </div>
                    )
                }
            </div>
        </div>
    );
}