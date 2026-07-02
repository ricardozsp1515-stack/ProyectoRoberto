import { Link } from "react-router-dom";

export default function LoginButton() {
  return (
    <Link
      to="/login"
      className="
        btn
        bg-green-800
        hover:bg-green-900
        border-none
        text-white!
        no-underline
        w-full
        rounded-xl
      "
    >
      Iniciar sesión
    </Link>
  );
}