import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

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

  return (
    <header className="sticky top-0 bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
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
                href="#"
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

        {/* Auth Buttons */}
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
      </div>
    </header>
  );
};


export default Navbar;
