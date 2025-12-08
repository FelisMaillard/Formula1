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
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-full px-8 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          🏎️ Formula 1 Dashboard
        </h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Drivers</h3>
            <p className="text-3xl font-bold text-red-600">
              {stats?.overall.total_drivers || 0}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Teams</h3>
            <p className="text-3xl font-bold text-red-600">
              {stats?.overall.total_teams || 0}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Circuits</h3>
            <p className="text-3xl font-bold text-red-600">
              {stats?.overall.total_circuits || 0}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Races</h3>
            <p className="text-3xl font-bold text-red-600">
              {stats?.overall.total_races || 0}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Results</h3>
            <p className="text-3xl font-bold text-red-600">
              {stats?.overall.total_results || 0}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Seasons</h3>
            <p className="text-3xl font-bold text-red-600">
              {stats?.overall.total_seasons || 0}
            </p>
          </div>
        </div>

        {/* Top Performers */}
        {stats?.topDriver && stats?.topTeam && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-4">🏆 Top Driver</h3>
              <div className="space-y-2">
                <p className="text-2xl font-bold">
                  {stats.topDriver.firstname} {stats.topDriver.lastname}
                </p>
                <p className="text-gray-600">Points: {stats.topDriver.total_points}</p>
                <p className="text-gray-600">Wins: {stats.topDriver.wins}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-4">🏁 Top Team</h3>
              <div className="space-y-2">
                <p className="text-2xl font-bold">{stats.topTeam.libelle}</p>
                <p className="text-gray-600">Points: {stats.topTeam.total_points}</p>
                <p className="text-gray-600">Wins: {stats.topTeam.wins}</p>
              </div>
            </div>
          </div>
        )}

        {/* Recent Results */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-xl font-bold mb-4">🏁 Recent Race Results</h3>
          <div className="space-y-6">
            {recentResults && recentResults.length > 0 ? (
              recentResults.map((race, raceIndex) => (
                <div key={race.id_planning || `race-${raceIndex}`} className="border-b pb-4 last:border-b-0">
                  <h4 className="font-bold text-lg mb-2">
                    {race.nom} - {race.circuit_nom}
                  </h4>
                  <p className="text-gray-600 text-sm mb-3">
                    {new Date(race.date_heure).toLocaleDateString()} - {race.pays}
                  </p>
                  <div className="space-y-2">
                    {race.topResults?.map((result, index) => (
                      <div
                        key={`${race.id_planning}-${result.place}-${index}`}
                        className="flex items-center gap-4 text-sm"
                      >
                        <span className="font-bold text-red-600 w-6">
                          P{result.place}
                        </span>
                        <span className="font-semibold">
                          {result.firstname} {result.lastname}
                        </span>
                        <span className="text-gray-600">{result.libelle}</span>
                        <span className="ml-auto font-semibold">
                          {result.point} pts
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600 text-center">Aucun résultat récent disponible</p>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <Link
            to="/teams"
            className="bg-red-600 text-white rounded-lg p-6 text-center hover:bg-red-700 transition"
          >
            <div className="text-3xl mb-2">🏎️</div>
            <div className="font-semibold">Teams</div>
          </Link>

          <Link
            to="/drivers"
            className="bg-red-600 text-white rounded-lg p-6 text-center hover:bg-red-700 transition"
          >
            <div className="text-3xl mb-2">👤</div>
            <div className="font-semibold">Drivers</div>
          </Link>

          <Link
            to="/circuits"
            className="bg-red-600 text-white rounded-lg p-6 text-center hover:bg-red-700 transition"
          >
            <div className="text-3xl mb-2">🏁</div>
            <div className="font-semibold">Circuits</div>
          </Link>

          <Link
            to="/calendar"
            className="bg-red-600 text-white rounded-lg p-6 text-center hover:bg-red-700 transition"
          >
            <div className="text-3xl mb-2">📅</div>
            <div className="font-semibold">Calendar</div>
          </Link>

          <Link
            to="/standings"
            className="bg-red-600 text-white rounded-lg p-6 text-center hover:bg-red-700 transition"
          >
            <div className="text-3xl mb-2">🏆</div>
            <div className="font-semibold">Standings</div>
          </Link>

          {user?.isAdmin && (
            <Link
              to="/admin"
              className="bg-yellow-500 text-black rounded-lg p-6 text-center hover:bg-yellow-400 transition"
            >
              <div className="text-3xl mb-2">⚙️</div>
              <div className="font-semibold">Admin</div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
