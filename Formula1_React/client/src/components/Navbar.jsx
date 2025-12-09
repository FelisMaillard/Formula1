import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import F1Logo from '../assets/F1Logo';
import FIALogo from '../assets/FIALogo';
import { useState, useEffect, useRef } from 'react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileRef = useRef(null);

  // Fermer le menu profile quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };

    if (profileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileMenuOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setProfileMenuOpen(false);
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
            <Link
              to="/statistics"
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-300"
            >
              Statistics
            </Link>

            {user?.isAdmin && (
              <>
                <div className="w-px h-8 bg-glass mx-2"></div>
                <Link
                  to="/admin"
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-f1-red/20 text-f1-red border border-f1-red/30 hover:bg-f1-red hover:text-white transition-all duration-300"
                >
                  Admin
                </Link>
              </>
            )}

            <div className="w-px h-8 bg-glass mx-2"></div>

            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-f1-red to-f1-red-dark flex items-center justify-center text-white text-sm font-bold ring-2 ring-white/20 hover:ring-f1-red transition-all">
                    {user.firstname?.charAt(0).toUpperCase() || user.username?.charAt(0).toUpperCase()}
                    {user.lastname?.charAt(0).toUpperCase() || ''}
                  </div>
                  <svg
                    className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
                      profileMenuOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>

                {/* Profile Dropdown Menu */}
                {profileMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-96 bg-black/95 rounded-2xl border border-white/30 shadow-2xl animate-slide-down origin-top-right">
                    {/* User Info */}
                    <div className="px-6 py-5 bg-dark-850/95 rounded-t-2xl border-b border-white/20">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-f1-red to-f1-red-dark flex items-center justify-center text-white text-2xl font-bold shadow-xl ring-2 ring-white/30">
                          {user.firstname?.charAt(0).toUpperCase() || user.username?.charAt(0).toUpperCase()}
                          {user.lastname?.charAt(0).toUpperCase() || ''}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-bold text-lg truncate">
                            {user.firstname && user.lastname
                              ? `${user.firstname} ${user.lastname}`
                              : user.username}
                          </p>
                          <p className="text-sm text-gray-300 truncate">{user.email}</p>
                        </div>
                      </div>
                      {user.isAdmin && (
                        <div className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-f1-red/30 text-f1-red-light border border-f1-red/50">
                          <svg className="w-3.5 h-3.5 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                          Administrator
                        </div>
                      )}
                    </div>

                    {/* Profile Stats */}
                    <div className="px-6 py-5 bg-dark-900/95 border-b border-white/20">
                      <p className="text-xs text-gray-300 uppercase tracking-wider mb-3 font-semibold">Account Details</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-dark-800 rounded-lg p-4 border border-white/20">
                          <p className="text-xs text-gray-400 mb-1.5">Username</p>
                          <p className="text-sm font-bold text-white break-all">{user.username}</p>
                        </div>
                        <div className="bg-dark-800 rounded-lg p-4 border border-white/20">
                          <p className="text-xs text-gray-400 mb-1.5">Role</p>
                          <p className="text-sm font-bold text-white">
                            {user.isAdmin ? 'Admin' : 'User'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="px-6 py-5 bg-black/95 rounded-b-2xl">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl bg-gradient-to-r from-f1-red to-f1-red-light text-white font-bold text-base hover:shadow-glow-red transition-all duration-300 hover:scale-[1.02] shadow-xl"
                      >
                        <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                        </svg>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-f1-red to-f1-red-light text-white transition-all duration-300 hover:scale-105"
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
              <Link
                to="/statistics"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all"
              >
                Statistics
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
