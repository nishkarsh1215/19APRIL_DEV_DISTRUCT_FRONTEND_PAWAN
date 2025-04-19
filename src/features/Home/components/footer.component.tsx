import { Copyright } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="flex items-center gap-2 text-sm mb-3 mt-12 font-medium border-t border-gray-600 pt-2 w-full justify-center">
      <Copyright /> {new Date().getFullYear()}{" "}
      <Link to="/" className="ml-1">
        Dev Distruct
      </Link>
    </footer>
  );
};
