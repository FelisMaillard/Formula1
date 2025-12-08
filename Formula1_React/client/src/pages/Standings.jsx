import { useState, useEffect } from 'react';
import api from '../api/axios';

export const Standings = () => {
  const [activeTab, setActiveTab] = useState('drivers');
  const [driverStandings, setDriverStandings] = useState([]);
  const [constructorStandings, setConstructorStandings] = useState([]);
  const [season, setSeason] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStandings = async () => {
      setLoading(true);
      try {
        const [driversRes, constructorsRes] = await Promise.all([
          api.get(`/stats/drivers?saison=${season}`),
          api.get(`/stats/constructors?saison=${season}`)
        ]);

        setDriverStandings(driversRes.data.standings);
        setConstructorStandings(constructorsRes.data.standings);
      } catch (error) {
        console.error('Error fetching standings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStandings();
  }, [season]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading standings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-full px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">🏆 Standings</h1>
          <select
            value={season}
            onChange={(e) => setSeason(Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value={2024}>2024</option>
            <option value={2025}>2025</option>
            <option value={2026}>2026</option>
          </select>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('drivers')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'drivers'
                ? 'bg-red-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Driver Standings
          </button>
          <button
            onClick={() => setActiveTab('constructors')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'constructors'
                ? 'bg-red-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Constructor Standings
          </button>
        </div>

        {/* Driver Standings */}
        {activeTab === 'drivers' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full table-auto">
              <thead className="bg-red-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left">Pos</th>
                  <th className="px-6 py-3 text-left">Driver</th>
                  <th className="px-6 py-3 text-left">Team</th>
                  <th className="px-6 py-3 text-left">Points</th>
                  <th className="px-6 py-3 text-left">Wins</th>
                  <th className="px-6 py-3 text-left">Podiums</th>
                </tr>
              </thead>
              <tbody>
                {driverStandings.map((driver, index) => (
                  <tr
                    key={driver.id_driver}
                    className={`border-b hover:bg-gray-50 transition ${
                      index < 3 ? 'bg-yellow-50' : ''
                    }`}
                  >
                    <td className="px-6 py-4 font-bold text-red-600">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold">
                          {driver.firstname} {driver.lastname}
                        </div>
                        <div className="text-sm text-gray-600">
                          {driver.nationality}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{driver.libelle || 'N/A'}</td>
                    <td className="px-6 py-4 font-bold text-lg">
                      {driver.total_points || 0}
                    </td>
                    <td className="px-6 py-4">{driver.wins || 0}</td>
                    <td className="px-6 py-4">{driver.podiums || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Constructor Standings */}
        {activeTab === 'constructors' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full table-auto">
              <thead className="bg-red-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left">Pos</th>
                  <th className="px-6 py-3 text-left">Team</th>
                  <th className="px-6 py-3 text-left">Points</th>
                  <th className="px-6 py-3 text-left">Wins</th>
                  <th className="px-6 py-3 text-left">Podiums</th>
                </tr>
              </thead>
              <tbody>
                {constructorStandings.map((team, index) => (
                  <tr
                    key={team.id_team}
                    className={`border-b hover:bg-gray-50 transition ${
                      index < 3 ? 'bg-yellow-50' : ''
                    }`}
                  >
                    <td className="px-6 py-4 font-bold text-red-600">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold">{team.libelle}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-lg">
                      {team.total_points || 0}
                    </td>
                    <td className="px-6 py-4">{team.wins || 0}</td>
                    <td className="px-6 py-4">{team.podiums || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {((activeTab === 'drivers' && driverStandings.length === 0) ||
          (activeTab === 'constructors' && constructorStandings.length === 0)) && (
          <div className="text-center text-gray-600 mt-8">
            No standings data for {season}
          </div>
        )}
      </div>
    </div>
  );
};
