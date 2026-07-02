import LoginButton from "../buttons/LoginButton";
import { Link } from "react-router-dom";

export default function InfoSection() {
  return (
    <main className="px-8 py-10 flex flex-col items-center">
      <h2 className="text-center text-3xl font-semibold text-gray-700 leading-relaxed">
        Su mascota es nuestra
        <br />
        mayor prioridad
      </h2>

      <p className="mt-8 text-gray-600 text-lg leading-relaxed">
        Mantenga a su querida mascota feliz y saludable manteniendo toda su
        información médica, consejos de salud y el contacto de veterinarios
        confiables al alcance de su mano.
      </p>

      <div className="w-full mt-10">
        <LoginButton />
      </div>

      <p className="mt-6 text-gray-600 text-center">
        ¿Aún no tiene una cuenta?{" "}
        <Link to="/register" className="text-green-700! underline">
          Regístrese
        </Link>
      </p>
    </main>
  );
}
