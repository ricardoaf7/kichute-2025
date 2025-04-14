
import { Link } from "react-router-dom";
import { Settings, Users, Layers, Calendar } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AdminMenuProps {
  isInAdminRoute: boolean;
  closeMenu: () => void;
}

export const adminItems = [
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

export const AdminMenu = ({ isInAdminRoute, closeMenu }: AdminMenuProps) => {
  return (
    <>
      {/* Desktop Admin Dropdown */}
      <li className="hidden md:block">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={`flex items-center py-2 px-3 rounded-lg w-full text-left ${
                isInAdminRoute
                  ? "text-white bg-green-700"
                  : "text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
              }`}
            >
              <Settings className="h-5 w-5 mr-2" />
              Admin
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56 bg-white dark:bg-gray-800">
            {adminItems.map((item) => (
              <DropdownMenuItem key={item.path} asChild>
                <Link
                  to={item.path}
                  onClick={closeMenu}
                  className="flex w-full items-center p-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {item.icon}
                  {item.name}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </li>

      {/* Mobile Admin Menu */}
      <li className="md:hidden">
        <div className="space-y-1">
          <button
            className={`flex items-center py-2 px-3 rounded w-full text-left ${
              isInAdminRoute
                ? "text-white bg-green-700"
                : "text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
            }`}
          >
            <Settings className="h-5 w-5 mr-2" />
            Admin
          </button>
          <div className="ml-6 mt-1 space-y-1">
            {adminItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeMenu}
                className="flex items-center py-2 px-3 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </li>
    </>
  );
};
