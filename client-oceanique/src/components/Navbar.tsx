import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const navItems = [
  { label: 'Home', path: '/home' },
  { label: 'Beaches', path: '/beaches' },
  { label: 'Events', path: '/events' },
  { label: 'Wishlist', path: '/wishlist' },
  { label: 'Transaction History', path: '/transaction-history' },
];

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center" onClick={() => navigate('/home')}>
          <img src="/logo.png" alt="Oceanique Logo" className="h-10 w-10 mr-2" />
          <span className="text-teal-500 font-semibold text-xl font-sharemono">Oceanique</span>
        </div>

        {/* Navigation Menu */}
        <nav className="hidden md:flex space-x-8">
          {navItems.map(({ label, path }) => {
            const isActive = location.pathname === path;
            return (
              <a
                key={path}
                href={path}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(path);
                }}
                className={`hover:text-teal-500 text-shadow-xs transition-colors duration-200 ${isActive ? 'text-teal-500 text-shadow-xs' : 'text-gray-400'
                  }`}
              >
                {label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2"
              >
                <img
                  src={user.avatar || 'profile-placeholder.png'}
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
                <span>{user.username || 'name placeholder'}</span>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={() => navigate('/signup')}
                className={`px-4 py-2 rounded ${location.pathname === '/signup'
                  ? 'bg-teal-500 text-white'
                  : 'bg-teal-100 text-teal-500 hover:bg-teal-200 transition-colors duration-200'
                  }`}
              >
                Sign up
              </button>
              <button
                onClick={() => navigate('/signin')}
                className={`px-4 py-2 rounded ${location.pathname === '/signin'
                  ? 'bg-teal-500 text-white'
                  : 'bg-teal-100 text-teal-500 hover:bg-teal-200 transition-colors duration-200'
                  }`}
              >
                Sign in
              </button>
            </div>
          )}
        </div>
      </div>
    </header >
  );
};


export default Navbar;
