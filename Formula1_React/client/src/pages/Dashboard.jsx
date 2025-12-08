import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentResults, setRecentResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, resultsRes] = await Promise.all([
          api.get('/stats/overall'),
          api.get('/stats/recent?limit=3')
        ]);

        setStats(statsRes.data);
        setRecentResults(resultsRes.data || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border-4 border-f1-red border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xl text-white font-semibold">Loading Dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-[1920px] mx-auto px-6 lg:px-12 py-12">
        {/* Header */}
        <div className="mb-12 animate-fade-in">
          <h1 className="text-5xl lg:text-6xl font-bold mb-3">
            <span className="gradient-text">FORMULA 1</span>
          </h1>
          <p className="text-gray-400 text-lg">Championship Dashboard & Statistics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6 mb-12 animate-slide-up">
          <div className="glass-card-hover group">
            <div className="flex flex-col">
              <h3 className="text-gray-400 text-xs lg:text-sm font-medium mb-2 uppercase tracking-wider">
                Drivers
              </h3>
              <p className="text-3xl lg:text-4xl font-bold gradient-text">
                {stats?.overall.total_drivers || 0}
              </p>
            </div>
            <div className="absolute top-3 right-3 text-2xl opacity-20 group-hover:opacity-40 transition-opacity">
              🏎️
            </div>
          </div>

          <div className="glass-card-hover group">
            <div className="flex flex-col">
              <h3 className="text-gray-400 text-xs lg:text-sm font-medium mb-2 uppercase tracking-wider">
                Teams
              </h3>
              <p className="text-3xl lg:text-4xl font-bold text-white">
                {stats?.overall.total_teams || 0}
              </p>
            </div>
            <div className="absolute top-3 right-3 text-2xl opacity-20 group-hover:opacity-40 transition-opacity">
              🏁
            </div>
          </div>

          <div className="glass-card-hover group">
            <div className="flex flex-col">
              <h3 className="text-gray-400 text-xs lg:text-sm font-medium mb-2 uppercase tracking-wider">
                Circuits
              </h3>
              <p className="text-3xl lg:text-4xl font-bold text-white">
                {stats?.overall.total_circuits || 0}
              </p>
            </div>
            <div className="absolute top-3 right-3 text-2xl opacity-20 group-hover:opacity-40 transition-opacity">
              🌍
            </div>
          </div>

          <div className="glass-card-hover group">
            <div className="flex flex-col">
              <h3 className="text-gray-400 text-xs lg:text-sm font-medium mb-2 uppercase tracking-wider">
                Races
              </h3>
              <p className="text-3xl lg:text-4xl font-bold text-white">
                {stats?.overall.total_races || 0}
              </p>
            </div>
            <div className="absolute top-3 right-3 text-2xl opacity-20 group-hover:opacity-40 transition-opacity">
              🏆
            </div>
          </div>

          <div className="glass-card-hover group">
            <div className="flex flex-col">
              <h3 className="text-gray-400 text-xs lg:text-sm font-medium mb-2 uppercase tracking-wider">
                Results
              </h3>
              <p className="text-3xl lg:text-4xl font-bold text-white">
                {stats?.overall.total_results || 0}
              </p>
            </div>
            <div className="absolute top-3 right-3 text-2xl opacity-20 group-hover:opacity-40 transition-opacity">
              📊
            </div>
          </div>

          <div className="glass-card-hover group">
            <div className="flex flex-col">
              <h3 className="text-gray-400 text-xs lg:text-sm font-medium mb-2 uppercase tracking-wider">
                Seasons
              </h3>
              <p className="text-3xl lg:text-4xl font-bold text-white">
                {stats?.overall.total_seasons || 0}
              </p>
            </div>
            <div className="absolute top-3 right-3 text-2xl opacity-20 group-hover:opacity-40 transition-opacity">
              📅
            </div>
          </div>
        </div>

        {/* Top Performers */}
        {stats?.topDriver && stats?.topTeam && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12 animate-slide-up">
            <div className="glass-card relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-f1-red/10 rounded-full blur-3xl group-hover:bg-f1-red/20 transition-all"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-f1-red to-f1-red-dark flex items-center justify-center text-2xl">
                    🏆
                  </div>
                  <h3 className="text-xl font-bold text-white">Top Driver</h3>
                </div>
                <div className="space-y-3">
                  <p className="text-3xl font-bold text-white">
                    {stats.topDriver.firstname} {stats.topDriver.lastname}
                  </p>
                  <div className="flex items-center gap-6 text-gray-400">
                    <div>
                      <span className="text-sm">Points</span>
                      <p className="text-2xl font-bold gradient-text">
                        {stats.topDriver.total_points}
                      </p>
                    </div>
                    <div className="w-px h-12 bg-glass"></div>
                    <div>
                      <span className="text-sm">Wins</span>
                      <p className="text-2xl font-bold text-white">
                        {stats.topDriver.wins}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-f1-red/10 rounded-full blur-3xl group-hover:bg-f1-red/20 transition-all"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-f1-red to-f1-red-dark flex items-center justify-center text-2xl">
                    🏁
                  </div>
                  <h3 className="text-xl font-bold text-white">Top Constructor</h3>
                </div>
                <div className="space-y-3">
                  <p className="text-3xl font-bold text-white">{stats.topTeam.libelle}</p>
                  <div className="flex items-center gap-6 text-gray-400">
                    <div>
                      <span className="text-sm">Points</span>
                      <p className="text-2xl font-bold gradient-text">
                        {stats.topTeam.total_points}
                      </p>
                    </div>
                    <div className="w-px h-12 bg-glass"></div>
                    <div>
                      <span className="text-sm">Wins</span>
                      <p className="text-2xl font-bold text-white">
                        {stats.topTeam.wins}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Results */}
        <div className="glass-card mb-12 animate-slide-up">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-f1-red to-f1-red-dark flex items-center justify-center text-xl">
              🏁
            </div>
            <h3 className="text-2xl font-bold text-white">Recent Race Results</h3>
          </div>
          <div className="space-y-8">
            {recentResults && recentResults.length > 0 ? (
              recentResults.map((race, raceIndex) => (
                <div
                  key={race.id_planning || `race-${raceIndex}`}
                  className="border-b border-glass/50 pb-6 last:border-b-0 last:pb-0"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 mb-4">
                    <h4 className="font-bold text-lg lg:text-xl text-white">
                      {race.nom} - {race.circuit_nom}
                    </h4>
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <span>{new Date(race.date_heure).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{race.pays}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {race.topResults?.map((result, index) => (
                      <div
                        key={`${race.id_planning}-${result.place}-${index}`}
                        className="glass-card !p-4 flex items-center gap-4"
                      >
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-f1-red to-f1-red-dark flex items-center justify-center">
                          <span className="font-bold text-white text-lg">
                            {result.place}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-white">
                            {result.firstname} {result.lastname}
                          </p>
                          <p className="text-sm text-gray-400">{result.libelle}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold gradient-text">
                            {result.point}
                          </p>
                          <p className="text-xs text-gray-400">PTS</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-8">No recent results available</p>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 animate-slide-up">
          <Link
            to="/teams"
            className="glass-card-hover group text-center"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🏎️</div>
            <div className="font-semibold text-white">Teams</div>
          </Link>

          <Link
            to="/drivers"
            className="glass-card-hover group text-center"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">👤</div>
            <div className="font-semibold text-white">Drivers</div>
          </Link>

          <Link
            to="/circuits"
            className="glass-card-hover group text-center"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🌍</div>
            <div className="font-semibold text-white">Circuits</div>
          </Link>

          <Link
            to="/calendar"
            className="glass-card-hover group text-center"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📅</div>
            <div className="font-semibold text-white">Calendar</div>
          </Link>

          <Link
            to="/standings"
            className="glass-card-hover group text-center"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🏆</div>
            <div className="font-semibold text-white">Standings</div>
          </Link>

          {user?.isAdmin && (
            <Link
              to="/admin"
              className="glass-card bg-f1-red/10 border-f1-red/30 hover:bg-f1-red/20 hover:border-f1-red hover:shadow-glow-red group text-center transition-all"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">⚙️</div>
              <div className="font-semibold text-f1-red">Admin</div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
