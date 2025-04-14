import { Link } from "react-router-dom";
import { Calendar, Trophy, BarChart2, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import Boot from "@/components/icons/Boot";

interface NavItemProps {
  path: string;
  name: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick?: () => void;
}

const NavItem = ({ path, name, icon, isActive, onClick }: NavItemProps) => (
  <li>
    <Link
      to={path}
      onClick={onClick}
      className={cn(
        "flex items-center py-2 px-3 md:p-0 md:px-3 md:py-2 rounded md:rounded-lg",
        isActive
          ? "text-white bg-green-700 md:bg-green-700 md:text-white"
          : "text-gray-900 hover:bg-gray-100 md:hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
      )}
      aria-current={isActive ? "page" : undefined}
    >
      {icon}
      {name}
    </Link>
  </li>
);

export const navItems = [
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
  {
    name: "Financeiro",
    path: "/payments",
    icon: <Wallet className="h-5 w-5 mr-2" />,
  },
];

interface NavItemsProps {
  currentPath: string;
  closeMenu: () => void;
}

export const NavItems = ({ currentPath, closeMenu }: NavItemsProps) => (
  <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-2 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
    {navItems.map((item) => (
      <NavItem
        key={item.path}
        {...item}
        isActive={currentPath === item.path}
        onClick={closeMenu}
      />
    ))}
  </ul>
);
