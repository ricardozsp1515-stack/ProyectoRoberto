import logoWhite from "../../assets/healani-logo-white.svg";

export default function Header() {
  return (
    <header className="bg-green-800 h-20 px-4 flex items-center">
      <div className="flex items-center gap-2">
        <img src={logoWhite} alt="Healani" className="h-10" />

        <div className="text-white">
          <h1 className="font-semibold text-lg">Healani</h1>

          <p className="text-[10px]">Animal Health</p>
        </div>
      </div>
    </header>
  );
}
