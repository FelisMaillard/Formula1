import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import F1Logo from '../assets/F1Logo';
import FIALogo from '../assets/FIALogo';
import { useState } from 'react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-glass/50 backdrop-blur-xl">
      <div className="max-w-[1920px] mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-4 group">
            <div className="flex items-center gap-3">
              <F1Logo className="w-16 h-auto transition-transform duration-300 group-hover:scale-110" />
              <div className="hidden lg:block w-px h-10 bg-glass"></div>
              <FIALogo className="hidden lg:block w-12 h-auto opacity-60 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
            <div className="hidden xl:flex flex-col">
              <span className="text-xl font-bold gradient-text">FORMULA 1</span>
              <span className="text-xs text-gray-400 tracking-widest">CHAMPIONSHIP</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            <Link
              to="/"
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-300"
            >
              Dashboard
            </Link>
            <Link
              to="/teams"
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-300"
            >
              Teams
            </Link>
            <Link
              to="/drivers"
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-300"
            >
              Drivers
            </Link>
            <Link
              to="/circuits"
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-300"
            >
              Circuits
            </Link>
            <Link
              to="/calendar"
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-300"
            >
              Calendar
            </Link>
            <Link
              to="/standings"
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-300"
            >
              Standings
            </Link>

            <div className="w-px h-8 bg-glass mx-2"></div>

            {user?.isAdmin && (
              <Link
                to="/admin"
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-f1-red/20 text-f1-red border border-f1-red/30 hover:bg-f1-red hover:text-white transition-all duration-300 hover:shadow-glow-red"
              >
                Admin
              </Link>
            )}

            {user ? (
              <div className="flex items-center gap-3 ml-2">
                <div className="glass-card !p-3 !rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-f1-red to-f1-red-dark flex items-center justify-center text-white text-sm font-bold">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-white">{user.username}</span>
                      {user.isAdmin && (
                        <span className="text-xs text-f1-red font-semibold">ADMIN</span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-f1-red to-f1-red-light text-white hover:shadow-glow-red transition-all duration-300 hover:scale-105"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden glass-card !p-3 !rounded-lg"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-glass/50 animate-slide-down">
            <div className="flex flex-col gap-2">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all"
              >
                Dashboard
              </Link>
              <Link
                to="/teams"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all"
              >
                Teams
              </Link>
              <Link
                to="/drivers"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all"
              >
                Drivers
              </Link>
              <Link
                to="/circuits"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all"
              >
                Circuits
              </Link>
              <Link
                to="/calendar"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all"
              >
                Calendar
              </Link>
              <Link
                to="/standings"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all"
              >
                Standings
              </Link>

              {user?.isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-lg text-sm font-semibold bg-f1-red/20 text-f1-red border border-f1-red/30 hover:bg-f1-red hover:text-white transition-all"
                >
                  Admin
                </Link>
              )}

              <div className="border-t border-glass/50 my-2"></div>

              {user ? (
                <div className="px-4 py-3 space-y-3">
                  <div className="glass-card !p-3 !rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-f1-red to-f1-red-dark flex items-center justify-center text-white font-bold">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-white">{user.username}</span>
                        {user.isAdmin && (
                          <span className="text-xs text-f1-red font-semibold">ADMIN</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mx-4 px-6 py-3 rounded-lg text-sm font-semibold bg-gradient-to-r from-f1-red to-f1-red-light text-white hover:shadow-glow-red transition-all text-center"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
