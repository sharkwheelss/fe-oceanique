import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DialogMessage from '../components/helper/DialogMessage';
import { useDialog } from '../components/helper/useDialog';
import LanguageSwitcher from './helper/LanguageSwitcher';

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
  const { isAuthenticated, user, logout, isCust } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const [dialogState, { showWarning, closeDialog }] = useDialog();

  const handleLogout = () => {
    setShowDropdown(false);

    showWarning(
      'Log Out',
      'Are you sure want to logout?',
      {
        showCancel: true,
        confirmText: 'Logout',
        onConfirm: () => {
          logout();
          navigate('/signin');
          closeDialog();
        }
      }
    )
  };

  const handleMobileNavClick = (path: string) => {
    navigate(path);
    setShowMobileMenu(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="absolute top-4 left-4 z-99999999">
                <LanguageSwitcher />
            </div>
        {/* Logo */}
        {isCust && (
          <div className="flex items-center" onClick={() => navigate('/home')}>
            <img src="/logo.png" alt="Oceanique Logo" className="h-10 w-10 mr-2 hover: cursor-pointer" />
            <span className="text-teal-500 font-semibold text-xl font-sharemono hover: cursor-pointer">Oceanique</span>
          </div>
        )}

        {/* Desktop Navigation Menu */}
        <nav className="hidden md:flex space-x-8">
          {isCust &&
            navItems.map(({ label, path }: { label: string; path: string }) => {
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

        {/* Desktop User Section */}
        <div className="hidden md:flex items-center">
          {isAuthenticated ? (
            <>
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2"
                >
                  <img
                    src={user?.imgProfile}
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                  />
                  <span>{user?.username || 'name placeholder'}</span>
                </button>

                <div className={`absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 overflow-hidden transition-all duration-200 ease-in-out origin-top-right ${showDropdown
                  ? 'opacity-100 scale-100 max-h-32'
                  : 'opacity-0 scale-95 max-h-0 py-0'
                  }`}>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </>
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

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {showMobileMenu ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      <div className={`md:hidden bg-white border-t shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${showMobileMenu ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
        <div className="px-4 py-2 space-y-1">
          {/* Navigation Items */}
          {isCust &&
            navItems.map(
              ({ label, path }: { label: string; path: string }) => {
                const isActive = location.pathname === path;
                return (
                  <button
                    key={path}
                    onClick={() => handleMobileNavClick(path)}
                    className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${isActive
                      ? 'text-teal-500 bg-teal-50'
                      : 'text-gray-700 hover:text-teal-500 hover:bg-gray-50'
                      }`}
                  >
                    {label}
                  </button>
                );
              }
            )
          }

          {/* Divider */}
          <div className="border-t border-gray-200 my-2"></div>

          {/* User Section */}
          {isAuthenticated ? (
            <div className="space-y-1">
              <div className="flex items-center px-3 py-2">
                <img
                  src={user?.imgProfile}
                  alt="Profile"
                  className="w-8 h-8 rounded-full mr-3"
                />
                <span className="text-gray-700 font-medium">{user?.username || 'name placeholder'}</span>
              </div>
              <button
                onClick={() => {
                  setShowMobileMenu(false);
                  navigate('/profile');
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-teal-500 hover:bg-gray-50 transition-colors duration-200"
              >
                Profile
              </button>
              <button
                onClick={() => {
                  setShowMobileMenu(false);
                  handleLogout();
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-500 hover:bg-gray-50 transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="space-y-2 px-3 py-2">
              <button
                onClick={() => {
                  setShowMobileMenu(false);
                  navigate('/signup');
                }}
                className={`w-full px-4 py-2 rounded text-center ${location.pathname === '/signup'
                  ? 'bg-teal-500 text-white'
                  : 'bg-teal-100 text-teal-500 hover:bg-teal-200 transition-colors duration-200'
                  }`}
              >
                Sign up
              </button>
              <button
                onClick={() => {
                  setShowMobileMenu(false);
                  navigate('/signin');
                }}
                className={`w-full px-4 py-2 rounded text-center ${location.pathname === '/signin'
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

      {/* Logout Confirmation Modal */}
      <DialogMessage
        type={dialogState.type}
        title={dialogState.title}
        message={dialogState.message}
        isOpen={dialogState.isOpen}
        onClose={closeDialog}
        redirectPath={dialogState.redirectPath}
        onConfirm={dialogState.onConfirm}
        confirmText={dialogState.confirmText}
        cancelText={dialogState.cancelText}
        showCancel={dialogState.showCancel}
        autoClose={dialogState.autoClose}
        autoCloseDelay={dialogState.autoCloseDelay}
      />
    </header >
  );
};

export default Navbar;