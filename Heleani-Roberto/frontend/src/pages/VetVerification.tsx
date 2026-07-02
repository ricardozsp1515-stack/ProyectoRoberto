import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthLayout from "../components/layout/AuthLayout";
import RegisterInput from "../components/forms/RegisterInput";
import VerificationUpload from "../components/forms/VerificationUpload";
import { createVetRequest } from "../services/vetService";
import { getAllCenters } from "../services/centerService";

interface Center {
    id: string;
    name: string;
}

export default function VetVerification() {
    const navigate = useNavigate();

    const [license, setLicense] = useState("");
    const [specialty, setSpecialty] = useState("");
    const [centerId, setCenterId] = useState("");

    const [centers, setCenters] = useState<Center[]>([]);
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // Cargamos las clinicas existentes para el selector opcional. Si no hay
    // ninguna (o el usuario prefiere no asociarse a una todavia), el campo
    // simplemente se deja vacio y la solicitud se envia sin veterinary_center_id
    useEffect(() => {
        getAllCenters()
            .then((data) => setCenters(data))
            .catch(() => setCenters([]));
    }, []);

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        if (!license || !specialty) {
            setError("Completa el número de colegiado y la especialidad.");
            return;
        }

        setError("");
        setSubmitting(true);

        try {

            await createVetRequest({
                license,
                specialty,
                veterinary_center_id: centerId || undefined,
            });

            navigate("/profile");

        } catch (error: any) {

            // El backend responde 409 si ya existe una solicitud pendiente
            setError(error.message);

        } finally {

            setSubmitting(false);

        }
    };

    return (
        <AuthLayout>

            <main className="p-8 pb-24 flex flex-col gap-6">

                <h1 className="text-center text-3xl font-bold text-gray-700">
                    Solicitar afiliación veterinaria
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-3xl p-5 flex flex-col gap-5"
                >

                    <RegisterInput
                        placeholder="Número de colegiado..."
                        value={license}
                        onChange={(e) => setLicense(e.target.value)}
                    />

                    <RegisterInput
                        placeholder="Especialidad..."
                        value={specialty}
                        onChange={(e) => setSpecialty(e.target.value)}
                    />

                    <select
                        value={centerId}
                        onChange={(e) => setCenterId(e.target.value)}
                        className="
                            select
                            w-full
                            bg-white
                            border-[#79C798]
                            focus:outline-none
                            focus:border-green-600
                        "
                    >
                        <option value="">Clínica asociada (opcional)...</option>
                        {centers.map((center) => (
                            <option key={center.id} value={center.id}>
                                {center.name}
                            </option>
                        ))}
                    </select>

                    <VerificationUpload
                        title="Título universitario"
                    />

                    <VerificationUpload
                        title="Carnet profesional"
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
                        disabled={submitting}
                        className="
                            btn
                            bg-green-800
                            hover:bg-green-900
                            border-none
                            text-white!
                            rounded-xl
                            disabled:opacity-60
                        "
                    >
                        {submitting ? "Enviando..." : "Enviar solicitud"}
                    </button>

                </form>

            </main>

        </AuthLayout>
    );
}