import { useState, useEffect } from 'react';
import api from '../api/axios';

export const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await api.get('/teams');
        setTeams(response.data.teams);
      } catch (error) {
        console.error('Error fetching teams:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border-4 border-f1-red border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xl text-white font-semibold">Loading Teams...</span>
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
            <span className="gradient-text">TEAMS</span>
          </h1>
          <p className="text-gray-400 text-lg">Formula 1 Constructors Championship</p>
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 animate-slide-up">
          {teams.map((team, index) => (
            <div
              key={team.id_team}
              className="glass-card-hover group relative overflow-hidden"
              style={{
                animationDelay: `${index * 50}ms`
              }}
            >
              {/* Background glow effect */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-f1-red/10 rounded-full blur-3xl group-hover:bg-f1-red/20 transition-all"></div>

              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl lg:text-2xl font-bold text-white flex-1">
                    {team.libelle}
                  </h3>
                  <div className="text-3xl opacity-30 group-hover:opacity-50 transition-opacity ml-2">
                    🏎️
                  </div>
                </div>

                <div className="space-y-3">
                  {team.date_creation && (
                    <div className="flex justify-between items-center py-2 border-b border-glass/30">
                      <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                        Founded
                      </span>
                      <span className="text-white font-semibold">
                        {new Date(team.date_creation).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  )}

                  {team.points !== undefined && (
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                        Points
                      </span>
                      <span className="text-2xl font-bold gradient-text">
                        {team.points}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {teams.length === 0 && (
          <div className="flex items-center justify-center min-h-[400px] animate-fade-in">
            <div className="glass-card text-center">
              <div className="text-5xl mb-4">🏎️</div>
              <p className="text-xl text-gray-400">No teams found</p>
              <p className="text-sm text-gray-500 mt-2">Check back later for team data</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
