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

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">
        {editingId ? 'Edit Team' : 'Add New Team'}
      </h2>

      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Nom de l'équipe *"
            value={formData.libelle}
            onChange={(e) => setFormData({ ...formData, libelle: e.target.value })}
            className="px-4 py-2 border rounded-md"
            required
          />
          <input
            type="date"
            placeholder="Date de création"
            value={formData.date_creation}
            onChange={(e) => setFormData({ ...formData, date_creation: e.target.value })}
            className="px-4 py-2 border rounded-md"
          />
          <input
            type="number"
            placeholder="Points"
            value={formData.points}
            onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })}
            className="px-4 py-2 border rounded-md"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700"
          >
            {editingId ? 'Update' : 'Create'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <h3 className="text-xl font-bold mb-4">Teams List</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Nom</th>
              <th className="px-4 py-2 text-left">Date création</th>
              <th className="px-4 py-2 text-left">Points</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => (
              <tr key={team.id_team} className="border-b">
                <td className="px-4 py-2 font-semibold">{team.libelle}</td>
                <td className="px-4 py-2">{team.date_creation ? new Date(team.date_creation).toLocaleDateString() : 'N/A'}</td>
                <td className="px-4 py-2">{team.points || 0}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleEdit(team)}
                    className="text-blue-600 hover:underline mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(team.id_team)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
