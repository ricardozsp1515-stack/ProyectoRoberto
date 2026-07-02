import logoWhite from "../../assets/healani-logo-white.svg";

export default function AuthHeader() {
  return (
    <header className="bg-green-800 px-4 py-3 flex flex-col gap-3">

      {/* Fila superior */}
      <div className="flex items-center justify-between">

        <div className="flex items-center gap-2">

          <img
            src={logoWhite}
            alt="Healani"
            className="h-10"
          />

          <div className="text-white">

            <h1 className="font-semibold text-lg">
              Healani
            </h1>

            <p className="text-[10px]">
              Animal Health
            </p>

          </div>

        </div>

        <label
          htmlFor="side-menu"
          className="cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-10 h-10 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </label>

      </div>

      {/* Barra de búsqueda */}
      <div className="relative">

        <input
          type="text"
          placeholder="Buscar veterinarios o clínicas..."
          className="
            input
            input-bordered
            w-full
            rounded-xl
            bg-white
            text-black
            pl-10
            border-none
          "
        />

        <span
          className="
            absolute
            left-3
            top-1/2
            -translate-y-1/2
            text-gray-500
          "
        >
          🔍
        </span>

      </div>

    </header>
  );
}