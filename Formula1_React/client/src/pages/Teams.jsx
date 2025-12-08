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
        <div className="text-xl">Loading teams...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-full px-8 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">🏎️ Teams</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {teams.map((team) => (
            <div
              key={team.id_team}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
            >
              <h3 className="text-xl font-bold text-red-600 mb-3">
                {team.libelle}
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                {team.date_creation && (
                  <p>
                    <span className="font-semibold">Créée le:</span> {new Date(team.date_creation).toLocaleDateString()}
                  </p>
                )}
                {team.points !== undefined && (
                  <p>
                    <span className="font-semibold">Points:</span> {team.points}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {teams.length === 0 && (
          <div className="text-center text-gray-600 mt-8">
            No teams found
          </div>
        )}
      </div>
    </div>
  );
};
