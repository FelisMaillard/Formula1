import { useState, useEffect } from 'react';
import api from '../api/axios';

export const Statistics = () => {
  const [stats, setStats] = useState({
    topWinners: [],
    topPodiums: [],
    topPoints: [],
    driverStats: [],
    teamStats: [],
  });
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('winners');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [driversRes, resultsRes, teamsRes] = await Promise.all([
        api.get('/drivers'),
        api.get('/results'),
        api.get('/teams')
      ]);

      const drivers = driversRes.data.drivers || [];
      const results = resultsRes.data.results || [];
      const teams = teamsRes.data.teams || [];

      // Calculer les statistiques
      const driverStatsMap = {};

      drivers.forEach(driver => {
        driverStatsMap[driver.id_driver] = {
          id: driver.id_driver,
          name: `${driver.firstname} ${driver.lastname}`,
          points: driver.points || 0,
          wins: 0,
          podiums: 0,
          races: 0,
          bestPosition: null,
          averagePosition: 0,
        };
      });

      // Analyser les résultats
      results.forEach(result => {
        if (driverStatsMap[result.id_driver]) {
          const stat = driverStatsMap[result.id_driver];
          stat.races++;

          if (result.place === 1) stat.wins++;
          if (result.place <= 3) stat.podiums++;

          if (stat.bestPosition === null || result.place < stat.bestPosition) {
            stat.bestPosition = result.place;
          }
        }
      });

      // Calculer position moyenne
      Object.values(driverStatsMap).forEach(stat => {
        if (stat.races > 0) {
          const positions = results
            .filter(r => r.id_driver === stat.id)
            .map(r => r.place);
          stat.averagePosition = (
            positions.reduce((sum, pos) => sum + pos, 0) / positions.length
          ).toFixed(2);
        }
      });

      const driverStatsArray = Object.values(driverStatsMap).filter(s => s.races > 0);

      // Top gagnants
      const topWinners = [...driverStatsArray]
        .sort((a, b) => b.wins - a.wins)
        .slice(0, 10);

      // Top podiums
      const topPodiums = [...driverStatsArray]
        .sort((a, b) => b.podiums - a.podiums)
        .slice(0, 10);

      // Top points
      const topPoints = [...driverStatsArray]
        .sort((a, b) => b.points - a.points)
        .slice(0, 10);

      setStats({
        topWinners,
        topPodiums,
        topPoints,
        driverStats: driverStatsArray,
        teamStats: teams,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border-4 border-f1-red border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xl text-white font-semibold">Loading Statistics...</span>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'winners', label: 'Top Winners', icon: '🏆' },
    { id: 'podiums', label: 'Top Podiums', icon: '🥇' },
    { id: 'points', label: 'Top Points', icon: '⭐' },
    { id: 'detailed', label: 'Detailed Stats', icon: '📊' },
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-[1920px] mx-auto px-6 lg:px-12 py-12">
        {/* Header */}
        <div className="mb-12 animate-fade-in">
          <h1 className="text-5xl lg:text-6xl font-bold mb-3">
            <span className="gradient-text">DRIVER STATISTICS</span>
          </h1>
          <p className="text-gray-400 text-lg">Complete analysis of driver performances</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-3 mb-8 animate-slide-down">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`glass-card !p-4 flex items-center gap-3 transition-all duration-300 ${
                selectedTab === tab.id
                  ? 'glass-card-active'
                  : 'hover:bg-white/5'
              }`}
            >
              <span className="text-2xl">{tab.icon}</span>
              <span className="font-semibold text-white">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="animate-slide-up">
          {selectedTab === 'winners' && (
            <div className="glass-card">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="text-3xl">🏆</span>
                Top Winners
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats.topWinners.map((driver, index) => (
                  <div
                    key={driver.id}
                    className="glass-card-hover !p-4 relative overflow-hidden"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {index < 3 && (
                      <div className="absolute top-2 right-2">
                        {index === 0 && <span className="text-3xl">🥇</span>}
                        {index === 1 && <span className="text-3xl">🥈</span>}
                        {index === 2 && <span className="text-3xl">🥉</span>}
                      </div>
                    )}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-f1-red to-f1-red-dark flex items-center justify-center text-white text-xl font-bold">
                        #{index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white">{driver.name}</h3>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="text-center">
                            <p className="text-2xl font-bold gradient-text">{driver.wins}</p>
                            <p className="text-xs text-gray-400">Wins</p>
                          </div>
                          <div className="w-px h-8 bg-glass-light"></div>
                          <div className="text-center">
                            <p className="text-lg font-semibold text-white">{driver.races}</p>
                            <p className="text-xs text-gray-400">Races</p>
                          </div>
                          <div className="w-px h-8 bg-glass-light"></div>
                          <div className="text-center">
                            <p className="text-lg font-semibold text-white">
                              {((driver.wins / driver.races) * 100).toFixed(1)}%
                            </p>
                            <p className="text-xs text-gray-400">Win Rate</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedTab === 'podiums' && (
            <div className="glass-card">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="text-3xl">🥇</span>
                Top Podium Finishers
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats.topPodiums.map((driver, index) => (
                  <div
                    key={driver.id}
                    className="glass-card-hover !p-4 relative overflow-hidden"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {index < 3 && (
                      <div className="absolute top-2 right-2">
                        {index === 0 && <span className="text-3xl">🥇</span>}
                        {index === 1 && <span className="text-3xl">🥈</span>}
                        {index === 2 && <span className="text-3xl">🥉</span>}
                      </div>
                    )}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center text-white text-xl font-bold">
                        #{index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white">{driver.name}</h3>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-yellow-400">{driver.podiums}</p>
                            <p className="text-xs text-gray-400">Podiums</p>
                          </div>
                          <div className="w-px h-8 bg-glass-light"></div>
                          <div className="text-center">
                            <p className="text-lg font-semibold text-white">{driver.races}</p>
                            <p className="text-xs text-gray-400">Races</p>
                          </div>
                          <div className="w-px h-8 bg-glass-light"></div>
                          <div className="text-center">
                            <p className="text-lg font-semibold text-white">
                              {((driver.podiums / driver.races) * 100).toFixed(1)}%
                            </p>
                            <p className="text-xs text-gray-400">Podium Rate</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedTab === 'points' && (
            <div className="glass-card">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="text-3xl">⭐</span>
                Top Points Scorers
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats.topPoints.map((driver, index) => (
                  <div
                    key={driver.id}
                    className="glass-card-hover !p-4 relative overflow-hidden"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {index < 3 && (
                      <div className="absolute top-2 right-2">
                        {index === 0 && <span className="text-3xl">🥇</span>}
                        {index === 1 && <span className="text-3xl">🥈</span>}
                        {index === 2 && <span className="text-3xl">🥉</span>}
                      </div>
                    )}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                        #{index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white">{driver.name}</h3>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="text-center">
                            <p className="text-2xl font-bold gradient-text">{driver.points}</p>
                            <p className="text-xs text-gray-400">Points</p>
                          </div>
                          <div className="w-px h-8 bg-glass-light"></div>
                          <div className="text-center">
                            <p className="text-lg font-semibold text-white">{driver.races}</p>
                            <p className="text-xs text-gray-400">Races</p>
                          </div>
                          <div className="w-px h-8 bg-glass-light"></div>
                          <div className="text-center">
                            <p className="text-lg font-semibold text-white">
                              {(driver.points / driver.races).toFixed(1)}
                            </p>
                            <p className="text-xs text-gray-400">Avg/Race</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedTab === 'detailed' && (
            <div className="glass-card">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="text-3xl">📊</span>
                Detailed Driver Statistics
              </h2>
              <div className="table-glass">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                        Driver
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-white/70 uppercase tracking-wider">
                        Races
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-white/70 uppercase tracking-wider">
                        Wins
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-white/70 uppercase tracking-wider">
                        Podiums
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-white/70 uppercase tracking-wider">
                        Points
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-white/70 uppercase tracking-wider">
                        Best
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-white/70 uppercase tracking-wider">
                        Avg Pos
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.driverStats
                      .sort((a, b) => b.points - a.points)
                      .map((driver, index) => (
                        <tr
                          key={driver.id}
                          className="group hover:bg-white/5 transition-colors duration-200"
                          style={{ animationDelay: `${index * 30}ms` }}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className="font-bold text-f1-red">#{index + 1}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-semibold text-white">{driver.name}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center text-white/90">
                            {driver.races}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                              {driver.wins}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                              {driver.podiums}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-f1-red/20 text-f1-red border border-f1-red/30">
                              {driver.points}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className="font-semibold text-green-400">
                              P{driver.bestPosition || '-'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center text-white/70">
                            {driver.averagePosition || '-'}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
