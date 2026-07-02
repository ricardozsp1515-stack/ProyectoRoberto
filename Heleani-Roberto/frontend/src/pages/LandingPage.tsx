import Header from "../components/landing/Header";
import Hero from "../components/landing/HeroSection";
import InfoSection from "../components/landing/InfoSection";
import MobileFrame from "../components/layout/MobileFrame";

export default function LandingPage() {
  return (
    <div
      data-theme="light"
      className="min-h-screen max-w-sm mx-auto bg-[#F5F0E6]"
    >
      <Header />
      <Hero />
      <InfoSection />
      <MobileFrame />
    </div>
  );
}
