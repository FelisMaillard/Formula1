import { useState, useEffect } from 'react';
import api from '../../api/axios';

export const AdminTeams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    libelle: '',
    date_creation: '',
    points: 0
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchTeams();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(`/teams/${editingId}`, formData);
      } else {
        await api.post('/teams', formData);
      }

      setFormData({
        libelle: '',
        date_creation: '',
        points: 0
      });
      setEditingId(null);
      fetchTeams();
    } catch (error) {
      alert(error.response?.data?.error || 'Operation failed');
    }
  };

  const handleEdit = (team) => {
    setFormData({
      libelle: team.libelle,
      date_creation: team.date_creation?.split('T')[0] || '',
      points: team.points || 0
    });
    setEditingId(team.id_team);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this team?')) return;

    try {
      await api.delete(`/teams/${id}`);
      fetchTeams();
    } catch (error) {
      alert(error.response?.data?.error || 'Delete failed');
    }
  };

  const handleCancel = () => {
    setFormData({
      libelle: '',
      date_creation: '',
      points: 0
    });
    setEditingId(null);
  };

  if (loading) return (
    <div className="flex items-center justify-center py-12">
      <div className="glass-card px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-f1-red"></div>
          <span className="text-white text-lg">Loading teams...</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Form Section */}
      <div className="glass-card p-6 lg:p-8">
        <h2 className="text-3xl font-bold gradient-text mb-6">
          {editingId ? '✏️ Edit Team' : '➕ Add New Team'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-white/70 text-sm font-medium">Team Name *</label>
              <input
                type="text"
                placeholder="e.g., Red Bull Racing"
                value={formData.libelle}
                onChange={(e) => setFormData({ ...formData, libelle: e.target.value })}
                className="input-glass"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-white/70 text-sm font-medium">Creation Date</label>
              <input
                type="date"
                value={formData.date_creation}
                onChange={(e) => setFormData({ ...formData, date_creation: e.target.value })}
                className="input-glass"
              />
            </div>
            <div className="space-y-2">
              <label className="text-white/70 text-sm font-medium">Points</label>
              <input
                type="number"
                placeholder="0"
                value={formData.points}
                onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })}
                className="input-glass"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="glass-button-gradient"
            >
              {editingId ? '💾 Update Team' : '✨ Create Team'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                className="glass-button"
              >
                ✖️ Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Table Section */}
      <div className="glass-card p-6 lg:p-8">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <span>🏆</span>
          <span>Teams List</span>
          <span className="text-sm font-normal text-white/50">({teams.length} teams)</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="table-glass">
            <thead>
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white/90">Team Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white/90">Creation Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white/90">Points</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white/90">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team, index) => (
                <tr
                  key={team.id_team}
                  className="group hover:bg-white/5 transition-colors duration-200"
                  style={{
                    animationDelay: `${index * 0.05}s`
                  }}
                >
                  <td className="px-6 py-4">
                    <span className="font-semibold text-white">{team.libelle}</span>
                  </td>
                  <td className="px-6 py-4 text-white/70">
                    {team.date_creation ? new Date(team.date_creation).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-f1-red/20 text-f1-red font-semibold text-sm">
                      {team.points || 0} pts
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(team)}
                        className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-all duration-200 font-medium text-sm"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(team.id_team)}
                        className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all duration-200 font-medium text-sm"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
