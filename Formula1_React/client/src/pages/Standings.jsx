import { useState, useEffect } from 'react';
import api from '../api/axios';

const getMedalColor = (position) => {
  if (position === 0) return 'text-amber-300'; // Gold
  if (position === 1) return 'text-gray-300'; // Silver
  if (position === 2) return 'text-orange-300'; // Bronze
  return 'text-f1-red';
};

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
        <div className="text-xl text-white/80 animate-fade-in">Loading standings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950">
      <div className="max-w-[1920px] mx-auto px-6 lg:px-12 py-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 animate-fade-in">
          <div>
            <h1 className="text-5xl lg:text-6xl font-bold gradient-text mb-2">
              Standings
            </h1>
            <p className="text-white/50 text-lg">Formula 1 Season {season}</p>
          </div>

          {/* Season Selector */}
          <select
            value={season}
            onChange={(e) => setSeason(Number(e.target.value))}
            className="glass-button !px-8 !py-4 text-white cursor-pointer bg-dark-800/50 hover:bg-f1-red/20 border border-f1-red/30 hover:border-f1-red/50 rounded-xl text-base"
          >
            <option value={2024}>2024</option>
            <option value={2025}>2025</option>
            <option value={2026}>2026</option>
          </select>
        </div>

        {/* Tabs Section */}
        <div className="flex gap-3 mb-8 animate-slide-down">
          <button
            onClick={() => setActiveTab('drivers')}
            className={`relative px-8 py-4 rounded-xl font-semibold transition-all duration-300 overflow-hidden group ${
              activeTab === 'drivers'
                ? 'glass-card bg-f1-red/20 border border-f1-red/50 text-white'
                : 'glass hover:bg-white/5 text-white/70 hover:text-white'
            }`}
          >
            <span className="relative z-10">Driver Standings</span>
            {activeTab === 'drivers' && (
              <div className="absolute inset-0 bg-gradient-to-r from-f1-red/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('constructors')}
            className={`relative px-8 py-4 rounded-xl font-semibold transition-all duration-300 overflow-hidden group ${
              activeTab === 'constructors'
                ? 'glass-card bg-f1-red/20 border border-f1-red/50 text-white'
                : 'glass hover:bg-white/5 text-white/70 hover:text-white'
            }`}
          >
            <span className="relative z-10">Constructor Standings</span>
            {activeTab === 'constructors' && (
              <div className="absolute inset-0 bg-gradient-to-r from-f1-red/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </button>
        </div>

        {/* Driver Standings */}
        {activeTab === 'drivers' && (
          <div className="animate-slide-up">
            {driverStandings.length > 0 ? (
              <div className="table-glass">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="px-6 lg:px-8 py-5 text-left text-sm lg:text-base font-semibold text-f1-red/80 uppercase tracking-wider">
                        Pos
                      </th>
                      <th className="px-6 lg:px-8 py-5 text-left text-sm lg:text-base font-semibold text-f1-red/80 uppercase tracking-wider">
                        Driver
                      </th>
                      <th className="px-6 lg:px-8 py-5 text-left text-sm lg:text-base font-semibold text-f1-red/80 uppercase tracking-wider">
                        Team
                      </th>
                      <th className="px-6 lg:px-8 py-5 text-left text-sm lg:text-base font-semibold text-f1-red/80 uppercase tracking-wider">
                        Points
                      </th>
                      <th className="px-6 lg:px-8 py-5 text-left text-sm lg:text-base font-semibold text-f1-red/80 uppercase tracking-wider">
                        Wins
                      </th>
                      <th className="px-6 lg:px-8 py-5 text-left text-sm lg:text-base font-semibold text-f1-red/80 uppercase tracking-wider">
                        Podiums
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {driverStandings.map((driver, index) => (
                      <tr
                        key={driver.id_driver}
                        className={`group hover:bg-white/5 transition-all duration-300 ${
                          index < 3 ? 'bg-white/[0.03]' : ''
                        }`}
                      >
                        <td className="px-6 lg:px-8 py-5">
                          <span className={`font-bold text-lg lg:text-xl ${getMedalColor(index)}`}>
                            {index + 1}
                          </span>
                        </td>
                        <td className="px-6 lg:px-8 py-5">
                          <div>
                            <div className="font-semibold text-white text-sm lg:text-base group-hover:text-f1-red transition-colors">
                              {driver.firstname} {driver.lastname}
                            </div>
                            <div className="text-xs lg:text-sm text-white/50 mt-1">
                              {driver.nationality}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 lg:px-8 py-5 text-white/70 text-sm lg:text-base">
                          {driver.libelle || 'N/A'}
                        </td>
                        <td className="px-6 lg:px-8 py-5">
                          <span className="font-bold text-f1-red text-lg lg:text-xl">
                            {driver.total_points || 0}
                          </span>
                        </td>
                        <td className="px-6 lg:px-8 py-5 text-white/70 text-sm lg:text-base">
                          {driver.wins || 0}
                        </td>
                        <td className="px-6 lg:px-8 py-5 text-white/70 text-sm lg:text-base">
                          {driver.podiums || 0}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="glass-card flex items-center justify-center min-h-[400px] animate-fade-in">
                <p className="text-white/70 text-lg text-center">
                  No standings data for {season}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Constructor Standings */}
        {activeTab === 'constructors' && (
          <div className="animate-slide-up">
            {constructorStandings.length > 0 ? (
              <div className="table-glass">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="px-6 lg:px-8 py-5 text-left text-sm lg:text-base font-semibold text-f1-red/80 uppercase tracking-wider">
                        Pos
                      </th>
                      <th className="px-6 lg:px-8 py-5 text-left text-sm lg:text-base font-semibold text-f1-red/80 uppercase tracking-wider">
                        Team
                      </th>
                      <th className="px-6 lg:px-8 py-5 text-left text-sm lg:text-base font-semibold text-f1-red/80 uppercase tracking-wider">
                        Points
                      </th>
                      <th className="px-6 lg:px-8 py-5 text-left text-sm lg:text-base font-semibold text-f1-red/80 uppercase tracking-wider">
                        Wins
                      </th>
                      <th className="px-6 lg:px-8 py-5 text-left text-sm lg:text-base font-semibold text-f1-red/80 uppercase tracking-wider">
                        Podiums
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {constructorStandings.map((team, index) => (
                      <tr
                        key={team.id_team}
                        className={`group hover:bg-white/5 transition-all duration-300 ${
                          index < 3 ? 'bg-white/[0.03]' : ''
                        }`}
                      >
                        <td className="px-6 lg:px-8 py-5">
                          <span className={`font-bold text-lg lg:text-xl ${getMedalColor(index)}`}>
                            {index + 1}
                          </span>
                        </td>
                        <td className="px-6 lg:px-8 py-5">
                          <div className="font-semibold text-white text-sm lg:text-base group-hover:text-f1-red transition-colors">
                            {team.libelle}
                          </div>
                        </td>
                        <td className="px-6 lg:px-8 py-5">
                          <span className="font-bold text-f1-red text-lg lg:text-xl">
                            {team.total_points || 0}
                          </span>
                        </td>
                        <td className="px-6 lg:px-8 py-5 text-white/70 text-sm lg:text-base">
                          {team.wins || 0}
                        </td>
                        <td className="px-6 lg:px-8 py-5 text-white/70 text-sm lg:text-base">
                          {team.podiums || 0}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="glass-card flex items-center justify-center min-h-[400px] animate-fade-in">
                <p className="text-white/70 text-lg text-center">
                  No standings data for {season}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
