import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Menu, X, Calendar, Trophy, BarChart2, Settings, Users, Layers } from "lucide-react";
import Boot from "./icons/Boot";
import { useIsMobile } from "../hooks/use-mobile";
import AppLogo from "./AppLogo";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    {
      name: "Partidas",
      path: "/matches",
      icon: <Calendar className="h-5 w-5 mr-2" />,
    },
    {
      name: "Kichutes",
      path: "/kichutes",
      icon: <Boot className="h-5 w-5 mr-2" />,
    },
    {
      name: "Classificação",
      path: "/standings",
      icon: <Trophy className="h-5 w-5 mr-2" />,
    },
    {
      name: "Relatório",
      path: "/round-report",
      icon: <BarChart2 className="h-5 w-5 mr-2" />,
    },
  ];

  const adminItems = [
    {
      name: "Participantes",
      path: "/admin/users",
      icon: <Users className="h-5 w-5 mr-2" />,
    },
    {
      name: "Times",
      path: "/admin/teams",
      icon: <Layers className="h-5 w-5 mr-2" />,
    },
    {
      name: "Partidas",
      path: "/admin/matches",
      icon: <Calendar className="h-5 w-5 mr-2" />,
    },
    {
      name: "Pontuação",
      path: "/admin/scoring",
      icon: <Settings className="h-5 w-5 mr-2" />,
    },
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <AppLogo />
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <Link to="/payments">
            <Button variant="outline" className="flex md:me-3 items-center px-4">
              <span className="text-md font-bold text-primary">R$</span>
              <span className="ml-1">Financeiro</span>
            </Button>
          </Link>
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
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-2 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={closeMenu}
                  className={cn(
                    "flex items-center py-2 px-3 md:p-0 md:px-3 md:py-2 rounded md:rounded-lg",
                    isActive(item.path)
                      ? "text-white bg-green-700 md:bg-green-700 md:text-white"
                      : "text-gray-900 hover:bg-gray-100 md:hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                  )}
                  aria-current={isActive(item.path) ? "page" : undefined}
                >
                  {item.icon}
                  {item.name}
                </Link>
              </li>
            ))}
            
            <li className="relative group">
              <button
                className={cn(
                  "flex items-center py-2 px-3 md:p-0 md:px-3 md:py-2 rounded md:rounded-lg w-full text-left",
                  location.pathname.includes("/admin")
                    ? "text-white bg-green-700 md:bg-green-700 md:text-white"
                    : "text-gray-900 hover:bg-gray-100 md:hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                )}
              >
                <Settings className="h-5 w-5 mr-2" />
                Admin
              </button>
              <div className="md:hidden group-hover:block md:absolute md:left-0 md:mt-1 md:min-w-40 md:z-30 md:bg-white md:shadow-lg md:rounded-lg md:border md:border-gray-200 dark:md:bg-gray-800 dark:md:border-gray-700">
                {adminItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={closeMenu}
                    className={cn(
                      "flex items-center py-2 px-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-700",
                      isActive(item.path)
                        ? "bg-gray-100 dark:bg-gray-700 font-medium"
                        : ""
                    )}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                ))}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
