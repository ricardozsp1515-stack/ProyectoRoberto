import Header from "../components/landing/Header";
import LoginForm from "../components/forms/LoginForm";
import MobileFrame from "../components/layout/MobileFrame";

export default function Login() {
    return (
        <div
            data-theme="light"
            className="min-h-screen max-w-sm mx-auto bg-[#F5F0E6]"
        >
            <Header />
            <LoginForm />
            <MobileFrame />
        </div>
    );
}