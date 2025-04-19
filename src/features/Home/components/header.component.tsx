import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="flex items-center justify-end p-4">
      <Link
        to="/auth"
        className="bg-green-800 hover:bg-green-700 rounded-lg px-4 py-2 social-button"
      >
        Get Started
      </Link>
    </div>
  );
};

export default Header;
