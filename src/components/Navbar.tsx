import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Award, 
  Calendar, 
  Home, 
  DollarSign, 
  Users, 
  Menu, 
  X,
  Settings 
} from "lucide-react";
import Boot from "./icons/Boot";

const Navbar = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: "/", label: "Início", icon: <Home className="w-4 h-4" /> },
    { to: "/matches", label: "Partidas", icon: <Calendar className="w-4 h-4" /> },
    { to: "/guesses", label: "Kichutes", icon: <Boot className="w-4 h-4" /> },
    { to: "/standings", label: "Classificação", icon: <Award className="w-4 h-4" /> },
    { to: "/prizes", label: "Premiações", icon: <Users className="w-4 h-4" /> },
    { to: "/payments", label: "Financeiro", icon: <DollarSign className="w-4 h-4" /> },
  ];

  const adminLinks = [
    { to: "/admin/matches", label: "Partidas", icon: <Calendar className="w-4 h-4" /> },
    { to: "/admin/teams", label: "Times", icon: <Users className="w-4 h-4" /> },
    { to: "/admin/scoring", label: "Pontuação", icon: <Settings className="w-4 h-4" /> },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm dark:bg-gray-950/90"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center space-x-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Boot className="h-8 w-8 text-goal" />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-goal to-field">
                Kichute 2025
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  location.pathname === link.to
                    ? "bg-primary/10 text-primary"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
            
            <div className="relative group">
              <button className="flex items-center space-x-1 px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800">
                <Settings className="w-4 h-4" />
                <span>Admin</span>
              </button>
              <div className="absolute hidden group-hover:block z-10 bg-white dark:bg-gray-950 shadow-lg rounded-md py-2 mt-1 min-w-[150px]">
                {adminLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center space-x-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 ${
                      location.pathname === link.to 
                        ? "bg-primary/10 text-primary" 
                        : "text-gray-700 dark:text-gray-200"
                    }`}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </nav>

          <div className="flex md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
              onClick={toggleMobileMenu}
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Abrir menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`md:hidden transition-all duration-300 ease-in-out transform ${
          isMobileMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-10 pointer-events-none"
        } absolute top-16 inset-x-0 bg-white dark:bg-gray-950 shadow-lg`}
      >
        <div className="space-y-1 px-2 pb-3 pt-2">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center space-x-3 px-3 py-4 text-base font-medium rounded-md transition-colors ${
                location.pathname === link.to
                  ? "bg-primary/10 text-primary"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
          
          <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
            <span className="block px-3 py-2 text-xs text-gray-500 dark:text-gray-400">Admin</span>
            {adminLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center space-x-3 px-3 py-4 text-base font-medium rounded-md transition-colors ${
                  location.pathname === link.to
                    ? "bg-primary/10 text-primary"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
