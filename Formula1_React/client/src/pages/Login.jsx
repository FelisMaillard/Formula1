import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import F1Logo from '../assets/F1Logo';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-f1-red/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-f1-red/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-md w-full relative z-10 animate-scale-in">
        <div className="glass-card">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <F1Logo className="w-24 h-auto" />
            </div>
            <h1 className="text-3xl font-bold mb-2">
              <span className="gradient-text">FORMULA 1</span>
            </h1>
            <p className="text-gray-400">Sign in to your account</p>
          </div>

          {error && (
            <div className="glass-card bg-f1-red/10 border-f1-red/50 mb-6 animate-slide-down">
              <div className="flex items-center gap-3">
                <div className="text-f1-red text-xl">⚠️</div>
                <p className="text-f1-red text-sm">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-300 font-medium mb-2 text-sm">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-glass"
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 font-medium mb-2 text-sm">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-glass"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-f1-red to-f1-red-light text-white py-3 rounded-lg font-semibold hover:shadow-glow-red transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-f1-red hover:text-f1-red-light font-semibold transition-colors"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-500 text-xs">
            Formula 1 Championship Management System
          </p>
        </div>
      </div>
    </div>
  );
};
