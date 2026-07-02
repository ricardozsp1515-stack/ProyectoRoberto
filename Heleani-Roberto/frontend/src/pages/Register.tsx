import Header from "../components/landing/Header";
import MobileFrame from "../components/layout/MobileFrame";
import RegisterForm from "../components/forms/RegisterForm";

export default function Register() {
  return (
    <div
      data-theme="light"
      className="min-h-screen max-w-sm mx-auto bg-[#F5F0E6]"
    >
      <Header />
      <RegisterForm />
      <MobileFrame />
    </div>
  );
}
