// src/components/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuthToken, logoutUser, getDisplayName } from '../api/healthApi';

const Header = () => {
  const isAuthenticated = !!getAuthToken();
  const displayName = getDisplayName(); // NEW: Get the display name
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md mb-6 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center max-w-7xl">
        <Link to="/" className="text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition">
          MyHealthApp 🍏
        </Link>
        <nav>
          {isAuthenticated ? (
            <div className="space-x-4 flex items-center">
              {displayName && ( // Display user's name if available
                <span className="text-gray-700 text-sm font-medium pr-2 border-r border-gray-300">
                  Welcome, {displayName}!
                </span>
              )}
              <Link to="/activities" className="text-gray-600 hover:text-indigo-600 transition">Dashboard</Link>
              <button 
                onClick={handleLogout}
                className="py-1 px-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-150 text-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="space-x-4">
              <Link to="/login" className="text-gray-600 hover:text-indigo-600 transition">Login</Link>
              <Link to="/register" className="py-1 px-3 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 transition duration-150 text-sm">Register</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;