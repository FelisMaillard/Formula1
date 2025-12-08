import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-red-600 text-white shadow-lg">
      <div className="w-full px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold flex items-center gap-2">
            <span>🏎️</span>
            <span>Formula 1</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="hover:text-gray-200 transition">
              Dashboard
            </Link>
            <Link to="/teams" className="hover:text-gray-200 transition">
              Teams
            </Link>
            <Link to="/drivers" className="hover:text-gray-200 transition">
              Drivers
            </Link>
            <Link to="/circuits" className="hover:text-gray-200 transition">
              Circuits
            </Link>
            <Link to="/calendar" className="hover:text-gray-200 transition">
              Calendar
            </Link>
            <Link to="/standings" className="hover:text-gray-200 transition">
              Standings
            </Link>

            {user?.isAdmin && (
              <Link
                to="/admin"
                className="bg-yellow-500 text-black px-4 py-2 rounded-md hover:bg-yellow-400 transition font-semibold"
              >
                Admin
              </Link>
            )}

            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm">
                  {user.username} {user.isAdmin && '(Admin)'}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-gray-800 px-4 py-2 rounded-md hover:bg-gray-700 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-white text-red-600 px-4 py-2 rounded-md hover:bg-gray-100 transition font-semibold"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
