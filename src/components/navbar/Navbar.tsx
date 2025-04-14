
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import AppLogo from "../AppLogo";
import AuthStatus from "../AuthStatus";
import { NavItems } from "./NavItems";
import { AdminMenu } from "./AdminMenu";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAdmin } = useAuth();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // If not logged in, show minimal navbar
  if (!user) {
    return (
      <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <AppLogo />
        </div>
      </nav>
    );
  }

  const isInAdminRoute = location.pathname.includes("/admin");

  return (
    <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <AppLogo />
        <div className="flex md:order-2 md:space-x-3 rtl:space-x-reverse items-center">
          <AuthStatus />
          <button
            onClick={toggleMenu}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-sticky"
            aria-expanded={isMenuOpen}
          >
            <span className="sr-only">Abrir menu principal</span>
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
        <div
          className={cn(
            "items-center justify-between w-full md:flex md:w-auto md:order-1",
            isMenuOpen ? "block" : "hidden"
          )}
          id="navbar-sticky"
        >
          <NavItems currentPath={location.pathname} closeMenu={closeMenu} />
          {isAdmin && (
            <AdminMenu isInAdminRoute={isInAdminRoute} closeMenu={closeMenu} />
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
