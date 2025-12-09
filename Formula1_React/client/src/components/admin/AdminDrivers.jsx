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

  if (loading) return (
    <div className="flex items-center justify-center py-12">
      <div className="glass-card-no-hover px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-f1-red"></div>
          <span className="text-white text-lg">Loading drivers...</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Form Section */}
      <div className="glass-card-no-hover p-6 lg:p-8">
        <h2 className="text-3xl font-bold gradient-text mb-6">
          {editingId ? '✏️ Edit Driver' : '➕ Add New Driver'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {!editingId && (
              <div className="space-y-2">
                <label className="text-white/70 text-sm font-medium">User ID *</label>
                <input
                  type="number"
                  placeholder="User ID"
                  value={formData.id_user}
                  onChange={(e) => setFormData({ ...formData, id_user: e.target.value })}
                  className="input-glass"
                  required
                />
              </div>
            )}
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
            {!editingId && (
              <div className="space-y-2">
                <label className="text-white/70 text-sm font-medium">Team (optional)</label>
                <select
                  value={formData.id_team}
                  onChange={(e) => setFormData({ ...formData, id_team: e.target.value })}
                  className="input-glass"
                >
                  <option value="">No team assigned</option>
                  {teams.map(team => (
                    <option key={team.id_team} value={team.id_team}>
                      {team.libelle}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="glass-button-gradient"
            >
              {editingId ? '💾 Update Driver' : '✨ Create Driver'}
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

      <div className="glass-card-no-hover">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <span>🏎️</span>
          <span>Drivers List</span>
          <span className="text-sm font-normal text-white/50">({drivers.length} drivers)</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="table-glass">
            <thead>
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white/90">ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white/90">First Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white/90">Last Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white/90">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white/90">Points</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white/90">Actions</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((driver, index) => (
                <tr
                  key={driver.id_driver}
                  className="group hover:bg-white/5 transition-colors duration-200"
                  style={{
                    animationDelay: `${index * 0.05}s`
                  }}
                >
                  <td className="px-6 py-4 text-white/70">{driver.id_driver}</td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-white">{driver.firstname}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-white">{driver.lastname}</span>
                  </td>
                  <td className="px-6 py-4 text-white/70">{driver.email}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-f1-red/20 text-f1-red font-semibold text-sm">
                      {driver.points || 0} pts
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(driver)}
                        className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-all duration-200 font-medium text-sm"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(driver.id_driver)}
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
