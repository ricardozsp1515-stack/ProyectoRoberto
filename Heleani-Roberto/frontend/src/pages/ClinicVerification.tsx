import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthLayout from "../components/layout/AuthLayout";
import RegisterInput from "../components/forms/RegisterInput";
import VerificationUpload from "../components/forms/VerificationUpload";
import { createCenterRequest } from "../services/centerService";

export default function ClinicVerification() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [contact, setContact] = useState("");
    const [description, setDescription] = useState("");

    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        if (!name || !address || !contact || !description) {
            setError("Completa todos los campos.");
            return;
        }

        setError("");
        setSubmitting(true);

        try {

            await createCenterRequest({
                name,
                address,
                contact,
                description,
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
                    Solicitar afiliación de clínica
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-3xl p-5 flex flex-col gap-5"
                >

                    <RegisterInput
                        placeholder="Nombre de la clínica..."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <RegisterInput
                        placeholder="Dirección..."
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />

                    <RegisterInput
                        placeholder="Teléfono..."
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                    />

                    <textarea
                        placeholder="Descripción de la clínica..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className="
                            textarea
                            w-full
                            bg-transparent
                            border-[#79C798]
                            focus:outline-none
                            focus:border-green-600
                        "
                    />

                    <VerificationUpload
                        title="Permiso de funcionamiento"
                    />

                    <VerificationUpload
                        title="Documento de registro"
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