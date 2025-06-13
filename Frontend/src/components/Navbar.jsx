import React from 'react'
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from '../redux/AuthSlice.js';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser()); // Your logout action
    navigate("/login");
  };

  const getDashboardPath = () => {
    if (!user) return "/";
    console.log("ROLE : ", user.role)
    if (user.role === "manager") return "/manager";
    if (user.role === "chef") return "/chef";
    return "/dashboard";
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-3 flex items-center justify-between shadow-md">
      <Link to="/" className="text-xl font-bold">
        MyApp
      </Link>

      <div className="flex items-center gap-4">
        <Link to="/" className="hover:text-gray-300">
          Home
        </Link>

        {!isAuthenticated && (
          <>
            <Link to="/login" className="hover:text-gray-300">
              Login
            </Link>
            <Link to="/signup" className="hover:text-gray-300">
              Signup
            </Link>
          </>
        )}

        {isAuthenticated && (
          <>
            <Link to={getDashboardPath()} className="hover:text-gray-300">
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
