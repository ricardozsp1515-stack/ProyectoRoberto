import type { ReactNode } from "react";
import AuthHeader from "./AuthHeader";
import SideMenu from "./SideMenu";
import MobileFrame from "./MobileFrame";

interface AuthenticatedLayoutProps {
  children: ReactNode;
}

export default function AuthenticatedLayout({
  children,
}: AuthenticatedLayoutProps) {
  return (
    <div
      data-theme="light"
      className="
        drawer
        drawer-end
        max-w-sm
        mx-auto
        min-h-screen
        bg-[#F5F0E6]
      "
    >
      <input
        id="side-menu"
        type="checkbox"
        className="drawer-toggle"
      />

      <div className="drawer-content min-h-screen bg-[#F5F0E6]">
        <AuthHeader />

        {children}

        <MobileFrame />
      </div>

      <SideMenu />
    </div>
  );
}