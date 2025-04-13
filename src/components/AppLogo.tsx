
import React from "react";
import { Link } from "react-router-dom";
import Boot from "./icons/Boot";

const AppLogo = () => {
  return (
    <Link to="/" className="flex items-center space-x-2 rtl:space-x-reverse">
      <Boot className="h-8 w-8 text-green-600" />
      <div className="flex items-baseline">
        <span className="font-poppins text-2xl font-bold text-[#2BB673]">
          Kichute
        </span>
        <span className="font-poppins text-xl font-medium text-gray-700 ml-1">
          2025
        </span>
      </div>
    </Link>
  );
};

export default AppLogo;
