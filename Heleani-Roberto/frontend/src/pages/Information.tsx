import AuthLayout from "../components/layout/AuthLayout";

export default function Information() {
  return (
    <AuthLayout>
      <main className="p-8 pb-24">

        <div className="bg-white rounded-2xl shadow-md p-6 max-h-[70vh] overflow-y-auto">

          <h1 className="text-4xl font-bold text-center text-gray-700 mb-8">
            Información de Healani
          </h1>

          {/* Introducción */}
          <section className="mb-8">

            <h2 className="text-2xl font-bold text-green-800 mb-3">
              ¿Qué es Healani?
            </h2>

            <p className="text-gray-700 leading-relaxed">
              Healani es una aplicación diseñada para centralizar y organizar
              el historial médico de las mascotas. Su propósito es facilitar el
              acceso a información importante para dueños, veterinarios y
              clínicas veterinarias, permitiendo mantener un registro claro y
              accesible de cada mascota.
            </p>

          </section>

          {/* Agregar mascota */}
          <section className="mb-8">

            <h2 className="text-2xl font-bold text-green-800 mb-3">
              ¿Cómo agregar una mascota?
            </h2>

            <ol className="list-decimal pl-6 text-gray-700 space-y-2">

              <li>Inicie sesión en la aplicación.</li>

              <li>
                Desde la pantalla principal, seleccione
                <strong> Agregar mascota</strong>.
              </li>

              <li>
                Complete la información básica de la mascota.
              </li>

              <li>
                Agregue condiciones especiales, si existen.
              </li>

              <li>
                Adjunte exámenes médicos y documentos relevantes.
              </li>

              <li>
                Presione <strong>Agregar mascota</strong> para finalizar.
              </li>

            </ol>

          </section>

          {/* Afiliación veterinario */}
          <section className="mb-8">

            <h2 className="text-2xl font-bold text-green-800 mb-3">
              Solicitar afiliación veterinaria
            </h2>

            <ol className="list-decimal pl-6 text-gray-700 space-y-2">

              <li>
                Abra el menú lateral.
              </li>

              <li>
                Seleccione <strong>Afiliación veterinaria</strong>.
              </li>

              <li>
                Complete la información profesional solicitada.
              </li>

              <li>
                Adjunte los documentos de respaldo.
              </li>

              <li>
                Envíe la solicitud para revisión.
              </li>

            </ol>

          </section>

          {/* Afiliación clínica */}
          <section className="mb-8">

            <h2 className="text-2xl font-bold text-green-800 mb-3">
              Solicitar afiliación de clínica
            </h2>

            <ol className="list-decimal pl-6 text-gray-700 space-y-2">

              <li>
                Abra el menú lateral.
              </li>

              <li>
                Seleccione <strong>Afiliación clínica</strong>.
              </li>

              <li>
                Complete la información de la clínica.
              </li>

              <li>
                Adjunte los documentos requeridos.
              </li>

              <li>
                Envíe la solicitud para revisión.
              </li>

            </ol>

          </section>

          {/* Beneficios */}
          <section className="mb-8">

            <h2 className="text-2xl font-bold text-green-800 mb-3">
              Beneficios de Healani
            </h2>

            <ul className="list-disc pl-6 text-gray-700 space-y-2">

              <li>
                Historial médico centralizado.
              </li>

              <li>
                Acceso rápido a exámenes y documentos.
              </li>

              <li>
                Conexión con veterinarios y clínicas afiliadas.
              </li>

              <li>
                Información organizada y fácil de consultar.
              </li>

              <li>
                Mayor seguimiento del bienestar de las mascotas.
              </li>

            </ul>

          </section>

          {/* Agradecimiento */}
          <section>

            <h2 className="text-2xl font-bold text-green-800 mb-3">
              Gracias por utilizar Healani
            </h2>

            <p className="text-gray-700 leading-relaxed">
              Agradecemos su confianza en nuestra aplicación. Nuestro objetivo
              es ayudar a los dueños de mascotas y a los profesionales de la
              salud animal a mantener la información médica organizada, segura y
              accesible. Gracias por formar parte de la comunidad Healani.
            </p>

          </section>

        </div>

      </main>
    </AuthLayout>
  );
}