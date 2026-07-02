import { Link } from "react-router-dom";

import AuthLayout from "../components/layout/AuthLayout";
import RegisterInput from "../components/forms/RegisterInput";
import UploadArea from "../components/layout/UploadArea";

export default function ConfigureProfile() {
    return (
        <AuthLayout>

            <main className="px-10 pt-28 pb-24 flex flex-col gap-6">

                <h1 className="text-center text-4xl font-bold text-gray-700">
                    Configurar perfil
                </h1>

                <RegisterInput
                    placeholder="Nombre..."
                />

                <UploadArea
                    text="Subir imagen."
                    successMessage="¡Subida exitosamente!"
                />

                <Link
                    to="/profile"
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
                    Aceptar
                </Link>

            </main>

        </AuthLayout>
    );
}