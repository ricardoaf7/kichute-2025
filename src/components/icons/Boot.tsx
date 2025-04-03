
import React from "react";
import { LucideProps } from "lucide-react";

export const Boot = (props: LucideProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-2H3v2z" />
      <path d="M16 4l-4 8H3l3.5-8h9.5z" />
      <path d="M15 16v4h4v-4" />
      <path d="M5 16v4h4v-4" />
    </svg>
  );
};

export default Boot;
