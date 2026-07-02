import logoWhite from "../../assets/healani-logo-white.svg";
import mascotas from "../../assets/mascotas-landing.svg";

export default function Hero() {
  return (
    <section className="relative h-70 overflow-hidden">
      <img
        src={mascotas}
        alt="Mascotas"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center text-white">
        <img src={logoWhite} alt="Logo" className="w-24" />

        <h2 className="text-5xl font-semibold mt-4">Healani</h2>

        <p className="text-lg">Animal Health</p>
      </div>
    </section>
  );
}
