import React from 'react'

interface NavbarProps {
  onNavigate: ( page: string ) => void;
  currentPage: string;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage }) => {
  const navItems = ['Home', 'Beaches', 'Events', 'Wishlist', 'Transaction History'];

  return (
    <header className="sticky top-0 bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src="public/logo.png"
            alt="Oceanique Logo"
            className="h-10 w-10 mr-2"
          />
          <span className="text-teal-500 font-semibold text-xl">Oceanique</span>
        </div>

        {/* Navigation Menu */}
        <nav className="hidden md:flex space-x-8">
          {navItems.map((item) => (
            <a
              key={item}
              href="#"
              className="text-gray-600 hover:text-teal-500"
            >
              {item}
            </a>
          ))}
        </nav>

        {/* Auth Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={() => onNavigate('signup')}
            className={`px-4 py-2 rounded ${currentPage === 'signup'
              ? 'bg-teal-500 text-white'
              : 'bg-teal-100 text-teal-500 hover:bg-teal-200'
              }`}
          >
            Sign up
          </button>
          <button
            onClick={() => onNavigate('signin')}
            className={`px-4 py-2 rounded ${currentPage === 'signin'
              ? 'bg-teal-500 text-white'
              : 'bg-teal-100 text-teal-500 hover:bg-teal-200'
              }`}
          >
            Sign in
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar