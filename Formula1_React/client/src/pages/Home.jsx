import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import F1Logo from '../assets/F1Logo';
import FIALogo from '../assets/FIALogo';

export const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 lg:px-12">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-48 w-96 h-96 bg-f1-red/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-f1-red/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-f1-red/5 to-transparent"></div>
          </div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          {/* Logos */}
          <div className="flex items-center justify-center gap-8 mb-8 animate-fade-in">
            <F1Logo className="w-32 lg:w-48 h-auto" />
            <div className="w-px h-24 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
            <FIALogo className="w-24 lg:w-32 h-auto opacity-80" />
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 animate-slide-up">
            <span className="gradient-text">FORMULA 1</span>
          </h1>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Championship Management System
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Track races, manage teams, follow drivers, and dive into comprehensive statistics from the world's premier motorsport championship.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl text-lg font-bold bg-gradient-to-r from-f1-red to-f1-red-light text-white transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-glow-red"
                >
                  Go to Dashboard
                </Link>
                {user.isAdmin && (
                  <Link
                    to="/admin"
                    className="w-full sm:w-auto px-8 py-4 rounded-xl text-lg font-bold glass-card text-white transition-all duration-300 hover:scale-105"
                  >
                    Admin Panel
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl text-lg font-bold bg-gradient-to-r from-f1-red to-f1-red-light text-white transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-glow-red"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl text-lg font-bold glass-card text-white transition-all duration-300 hover:scale-105"
                >
                  Create Account
                </Link>
              </>
            )}
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <Link to="/teams" className="glass-card-hover group">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🏎️</div>
              <h3 className="text-xl font-bold text-white mb-2">Teams</h3>
              <p className="text-gray-400 text-sm">Explore all Formula 1 teams and their history</p>
            </Link>

            <Link to="/drivers" className="glass-card-hover group">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">👤</div>
              <h3 className="text-xl font-bold text-white mb-2">Drivers</h3>
              <p className="text-gray-400 text-sm">Follow your favorite drivers and their performance</p>
            </Link>

            <Link to="/standings" className="glass-card-hover group">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🏆</div>
              <h3 className="text-xl font-bold text-white mb-2">Standings</h3>
              <p className="text-gray-400 text-sm">Real-time championship standings and rankings</p>
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              <span className="gradient-text">Everything F1</span>
            </h2>
            <p className="text-xl text-gray-400">Comprehensive tools for the ultimate Formula 1 experience</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link to="/calendar" className="glass-card-hover group">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-f1-red to-f1-red-dark flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                📅
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Race Calendar</h3>
              <p className="text-gray-400 text-sm">Complete schedule of all races, qualifying sessions, and events</p>
            </Link>

            <Link to="/circuits" className="glass-card-hover group">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-f1-red to-f1-red-dark flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                🌍
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Circuits</h3>
              <p className="text-gray-400 text-sm">Detailed information about iconic racing circuits worldwide</p>
            </Link>

            <Link to="/statistics" className="glass-card-hover group">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-f1-red to-f1-red-dark flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                📊
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Statistics</h3>
              <p className="text-gray-400 text-sm">In-depth analysis with wins, podiums, and performance metrics</p>
            </Link>

            <Link to="/standings" className="glass-card-hover group">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-f1-red to-f1-red-dark flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                🥇
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Live Standings</h3>
              <p className="text-gray-400 text-sm">Track driver and constructor championships in real-time</p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto glass-card text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-f1-red/20 to-transparent pointer-events-none"></div>
          <div className="relative z-10">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Ready to Experience Formula 1?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of F1 enthusiasts tracking the championship
            </p>
            {!user && (
              <Link
                to="/register"
                className="inline-block px-10 py-4 rounded-xl text-lg font-bold bg-gradient-to-r from-f1-red to-f1-red-light text-white transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-glow-red"
              >
                Get Started Free
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-6 lg:px-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <F1Logo className="w-16 h-auto" />
              <div className="text-sm text-gray-400">
                <p className="font-semibold text-white">Formula 1 Championship</p>
                <p>Management System © 2025</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <Link to="/teams" className="hover:text-white transition-colors">Teams</Link>
              <Link to="/drivers" className="hover:text-white transition-colors">Drivers</Link>
              <Link to="/standings" className="hover:text-white transition-colors">Standings</Link>
              <Link to="/statistics" className="hover:text-white transition-colors">Statistics</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
