import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import F1Logo from '../assets/F1Logo';

export const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
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
            <p className="text-gray-400">Create your account</p>
          </div>

          {error && (
            <div className="glass-card bg-f1-red/10 border-f1-red/50 mb-6 animate-slide-down">
              <div className="flex items-center gap-3">
                <div className="text-f1-red text-xl">⚠️</div>
                <p className="text-f1-red text-sm">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300 font-medium mb-2 text-sm">
                Username <span className="text-f1-red">*</span>
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="input-glass"
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 font-medium mb-2 text-sm">
                Email Address <span className="text-f1-red">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-glass"
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 font-medium mb-2 text-sm">
                Password <span className="text-f1-red">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-glass"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 font-medium mb-2 text-sm">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="input-glass"
                  placeholder="First name"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-medium mb-2 text-sm">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="input-glass"
                  placeholder="Last name"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-f1-red to-f1-red-light text-white py-3 rounded-lg font-semibold hover:shadow-glow-red transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-6"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-f1-red hover:text-f1-red-light font-semibold transition-colors"
              >
                Sign In
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
