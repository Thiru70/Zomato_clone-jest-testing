import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaBell } from 'react-icons/fa';
import { useCart } from '../contexts/CartContext';

export const NavBar = ({foodSuggestion}) => {
  const { cartItems } = useCart();
  const [username, setUsername] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('username');
    setUsername(null);
  };

  const toggleSuggestions = () => {
    setShowSuggestions((prev) => !prev);
  };

  return (
    <nav className="relative flex items-center justify-between p-4 bg-white shadow">
      <div className="flex items-center space-x-2">
        <Link to="/">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Zomato_logo.png/600px-Zomato_logo.png"
            alt="Zomato Logo"
            className="w-auto h-8"
          />
        </Link>
      </div>

      <div className="flex items-center space-x-4 text-gray-700">
        {/* Notification Icon */}
        <div className="relative">
          <button onClick={toggleSuggestions}>
            <FaBell className="text-2xl hover:text-red-500" />
          </button>
          {showSuggestions && (
            <div className="absolute right-0 z-10 w-64 p-4 mt-2 text-sm bg-white border border-gray-200 rounded-md shadow-lg">
              <h4 className="mb-2 font-semibold text-gray-800">Suggestions</h4>
              {foodSuggestion ? (
              <ul className="space-y-1 text-gray-600">
                <li>🍽️ {foodSuggestion}</li>
              </ul>
            ) : (
              <p className="italic text-gray-500">No suggestions available.</p>
            )}

            </div>
          )}
        </div>

        {/* Cart Icon */}
        <Link to="/cart" className="relative">
          <FaShoppingCart className="text-2xl" />
          {cartItems.length > 0 && (
            <span className="absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full -top-2 -right-2">
              {cartItems.length}
            </span>
          )}
        </Link>

        {/* Auth Buttons */}
        {username ? (
          <div className="flex items-center space-x-2">
            <span className="font-semibold">Hi, {username}</span>
            <button
              onClick={handleLogout}
              className="px-2 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <Link to="/signin">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
};
