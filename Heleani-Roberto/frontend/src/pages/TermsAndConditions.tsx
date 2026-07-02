import Header from "../components/landing/Header";
import MobileFrame from "../components/layout/MobileFrame";

export default function TermsAndConditions() {
    return (
        <div
            data-theme="light"
            className="min-h-screen max-w-sm mx-auto bg-[#F5F0E6]"
        >
            <Header />

            <main className="px-6 py-8">
                <h1 className="text-3xl font-bold text-center text-gray-700 mb-6">
                    Términos y Condiciones
                </h1>

                <div className="bg-white rounded-2xl shadow-md p-6 text-gray-700 space-y-5 max-h-[65vh] overflow-y-auto">

                    <section>
                        <h2 className="font-semibold text-lg mb-2">
                            1. Aceptación de los términos
                        </h2>

                        <p>
                            Al utilizar Healani, usted acepta cumplir
                            con los presentes términos y condiciones.
                            Si no está de acuerdo con alguno de ellos,
                            deberá abstenerse de utilizar la aplicación.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-semibold text-lg mb-2">
                            2. Propósito de la aplicación
                        </h2>

                        <p>
                            Healani es una plataforma destinada a la
                            gestión y almacenamiento de expedientes
                            médicos de mascotas. La información
                            registrada tiene fines informativos y de
                            seguimiento veterinario.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-semibold text-lg mb-2">
                            3. Responsabilidad de la información
                        </h2>

                        <p>
                            El usuario es responsable de proporcionar
                            información precisa y actualizada sobre sus
                            mascotas. Healani no garantiza la exactitud
                            de los datos ingresados por terceros.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-semibold text-lg mb-2">
                            4. Atención veterinaria
                        </h2>

                        <p>
                            Healani no sustituye el diagnóstico,
                            tratamiento o criterio profesional de un
                            médico veterinario. Toda decisión relacionada
                            con la salud de una mascota debe ser tomada
                            con la asesoría de un profesional autorizado.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-semibold text-lg mb-2">
                            5. Privacidad de los datos
                        </h2>

                        <p>
                            La información almacenada será utilizada
                            únicamente para la gestión de expedientes y
                            funcionalidades relacionadas con la
                            aplicación. Los datos serán tratados de
                            forma confidencial.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-semibold text-lg mb-2">
                            6. Modificaciones
                        </h2>

                        <p>
                            Healani se reserva el derecho de modificar
                            estos términos y condiciones cuando sea
                            necesario para mejorar el servicio o cumplir
                            con requisitos legales.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-semibold text-lg mb-2">
                            7. Contacto
                        </h2>

                        <p>
                            Para consultas relacionadas con estos
                            términos y condiciones, los usuarios podrán
                            comunicarse con el equipo administrador de
                            Healani mediante los canales oficiales de
                            soporte.
                        </p>
                    </section>

                </div>
            </main>
            <MobileFrame />
        </div>
    );
}