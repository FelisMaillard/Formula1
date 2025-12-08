import { useState, useEffect } from 'react';
import api from '../../api/axios';

export const AdminDrivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    id_user: '',
    points: 0,
    id_team: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [driversRes, teamsRes] = await Promise.all([
        api.get('/drivers'),
        api.get('/teams')
      ]);
      setDrivers(driversRes.data.drivers);
      setTeams(teamsRes.data.teams);
      
      // Fetch users who are not already drivers
      const usersRes = await api.get('/auth/profile');
      // For now, we'll need to handle user selection differently
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(`/drivers/${editingId}`, {
          points: formData.points
        });
      } else {
        await api.post('/drivers', formData);
      }

      setFormData({
        id_user: '',
        points: 0,
        id_team: ''
      });
      setEditingId(null);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.error || 'Operation failed');
    }
  };

  const handleEdit = (driver) => {
    setFormData({
      id_user: driver.id_user || '',
      points: driver.points || 0,
      id_team: ''
    });
    setEditingId(driver.id_driver);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this driver?')) return;

    try {
      await api.delete(`/drivers/${id}`);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.error || 'Delete failed');
    }
  };

  const handleCancel = () => {
    setFormData({
      id_user: '',
      points: 0,
      id_team: ''
    });
    setEditingId(null);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">
        {editingId ? 'Edit Driver' : 'Add New Driver'}
      </h2>

      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {!editingId && (
            <input
              type="number"
              placeholder="User ID *"
              value={formData.id_user}
              onChange={(e) => setFormData({ ...formData, id_user: e.target.value })}
              className="px-4 py-2 border rounded-md"
              required
            />
          )}
          <input
            type="number"
            placeholder="Points"
            value={formData.points}
            onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })}
            className="px-4 py-2 border rounded-md"
          />
          {!editingId && (
            <select
              value={formData.id_team}
              onChange={(e) => setFormData({ ...formData, id_team: e.target.value })}
              className="px-4 py-2 border rounded-md"
            >
              <option value="">Sélectionner une équipe (optionnel)</option>
              {teams.map(team => (
                <option key={team.id_team} value={team.id_team}>
                  {team.libelle}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {editingId ? 'Update' : 'Create'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prénom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Points</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {drivers.map((driver) => (
              <tr key={driver.id_driver}>
                <td className="px-6 py-4 whitespace-nowrap">{driver.id_driver}</td>
                <td className="px-6 py-4 whitespace-nowrap">{driver.firstname}</td>
                <td className="px-6 py-4 whitespace-nowrap">{driver.lastname}</td>
                <td className="px-6 py-4 whitespace-nowrap">{driver.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{driver.points}</td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                  <button
                    onClick={() => handleEdit(driver)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(driver.id_driver)}
                    className="text-red-600 hover:text-red-900"
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
