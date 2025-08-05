import { NavLink } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";
import { BiListUl } from "react-icons/bi";
import { FiBarChart2 } from "react-icons/fi";
import { MdAdminPanelSettings } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";

export function NavBar({ isAdmin, onLogout }) {
  const linkClass = ({ isActive }) =>
    `flex flex-col items-center justify-center text-xs ${
      isActive
        ? "text-blue-600 dark:text-blue-400"
        : "text-gray-400 dark:text-gray-500"
    }`;

  // Bepaal home-route: admin → /admin, speler → /boetes
  const homeRoute = isAdmin ? "/admin" : "/boetes";

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-md z-50">
      <div className="max-w-3xl w-full mx-auto px-6 py-2 flex justify-between">
        <NavLink to="/home" className={linkClass}>
          <AiOutlineHome size={24} />
          Home
        </NavLink>
        <NavLink to="/boetes" className={linkClass}>
          <BiListUl size={24} />
          Boetes
        </NavLink>
        <NavLink to="/leaderboard" className={linkClass}>
          <FiBarChart2 size={24} />
          Klassement
        </NavLink>
        {isAdmin && (
          <NavLink to="/admin" className={linkClass}>
            <MdAdminPanelSettings size={24} />
            Admin
          </NavLink>
        )}
        <button
          onClick={onLogout}
          className="flex flex-col items-center justify-center text-xs text-gray-400 dark:text-gray-500 hover:text-red-500"
        >
          <FiLogOut size={24} />
          Log uit
        </button>
      </div>
    </nav>
  );
}

export default NavBar;
