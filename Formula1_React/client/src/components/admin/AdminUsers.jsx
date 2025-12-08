import { useState, useEffect } from 'react';
import api from '../../api/axios';

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    is_admin: false,
    is_driver: false,
    driver_points: 0,
    id_team: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const teamsRes = await api.get('/teams');
      setTeams(teamsRes.data.teams);
      
      // Fetch all users with driver info
      const usersRes = await api.get('/users/all');
      if (usersRes.data.users) {
        setUsers(usersRes.data.users);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userData = {
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        is_admin: formData.is_admin,
        is_driver: formData.is_driver,
        driver_points: formData.is_driver ? formData.driver_points : undefined,
        id_team: formData.is_driver && formData.id_team ? formData.id_team : undefined
      };

      if (!editingId && formData.password) {
        userData.password = formData.password;
      }

      if (editingId) {
        await api.put(`/users/${editingId}`, userData);
      } else {
        await api.post('/users', userData);
      }

      setFormData({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        is_admin: false,
        is_driver: false,
        driver_points: 0,
        id_team: ''
      });
      setEditingId(null);
      setShowPassword(false);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.error || 'Operation failed');
    }
  };

  const handleEdit = (user) => {
    setFormData({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      password: '',
      is_admin: user.is_admin === 1,
      is_driver: user.is_driver || false,
      driver_points: user.driver_points || 0,
      id_team: user.id_team || ''
    });
    setEditingId(user.id_user);
    setShowPassword(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      await api.delete(`/users/${id}`);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.error || 'Delete failed');
    }
  };

  const handleCancel = () => {
    setFormData({
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      is_admin: false,
      is_driver: false,
      driver_points: 0,
      id_team: ''
    });
    setEditingId(null);
    setShowPassword(false);
  };

  if (loading) return (
    <div className="flex items-center justify-center py-12">
      <div className="glass-card px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-f1-red"></div>
          <span className="text-white text-lg">Loading users...</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Form Section */}
      <div className="glass-card p-6 lg:p-8">
        <h2 className="text-3xl font-bold gradient-text mb-6">
          {editingId ? '✏️ Edit User' : '➕ Add New User / Driver'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-white/70 text-sm font-medium">First Name *</label>
              <input
                type="text"
                placeholder="e.g., Lewis"
                value={formData.firstname}
                onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                className="input-glass"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-white/70 text-sm font-medium">Last Name *</label>
              <input
                type="text"
                placeholder="e.g., Hamilton"
                value={formData.lastname}
                onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                className="input-glass"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-white/70 text-sm font-medium">Email *</label>
              <input
                type="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-glass"
                required
                disabled={editingId}
              />
            </div>
            <div className="space-y-2">
              <label className="text-white/70 text-sm font-medium">
                {editingId ? "New Password (leave blank to keep current)" : "Password *"}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input-glass pr-12"
                  required={!editingId}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 p-4 glass-card">
            <label className="flex items-center space-x-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.is_admin}
                onChange={(e) => setFormData({ ...formData, is_admin: e.target.checked })}
                className="w-5 h-5 rounded border-white/20 bg-white/10 text-f1-red focus:ring-f1-red focus:ring-offset-0"
              />
              <span className="text-white group-hover:text-f1-red transition-colors">🔐 Administrator</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.is_driver}
                onChange={(e) => setFormData({ ...formData, is_driver: e.target.checked })}
                className="w-5 h-5 rounded border-white/20 bg-white/10 text-f1-red focus:ring-f1-red focus:ring-offset-0"
              />
              <span className="text-white group-hover:text-f1-red transition-colors">🏎️ Driver</span>
            </label>
          </div>

          {formData.is_driver && (
            <div className="glass-card p-6 space-y-4 animate-fade-in">
              <h4 className="text-lg font-semibold text-white mb-4">Driver Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-white/70 text-sm font-medium">Driver Points</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={formData.driver_points}
                    onChange={(e) => setFormData({ ...formData, driver_points: parseInt(e.target.value) || 0 })}
                    className="input-glass"
                  />
                </div>
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
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="glass-button-gradient"
            >
              {editingId ? '💾 Update User' : '✨ Create User'}
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
          <span>👥</span>
          <span>Users & Drivers</span>
          <span className="text-sm font-normal text-white/50">({users.length} users)</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="table-glass">
            <thead>
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white/90">ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white/90">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white/90">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white/90">Role</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white/90">Driver</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white/90">Points</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white/90">Team</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white/90">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr
                  key={user.id_user}
                  className="group hover:bg-white/5 transition-colors duration-200"
                  style={{
                    animationDelay: `${index * 0.05}s`
                  }}
                >
                  <td className="px-6 py-4 text-white/70">{user.id_user}</td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-white">
                      {user.firstname} {user.lastname}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-white/70">{user.email}</td>
                  <td className="px-6 py-4">
                    {user.is_admin === 1 ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 font-semibold text-xs">
                        🔐 Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-500/20 text-gray-400 font-semibold text-xs">
                        👤 User
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {user.is_driver ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-500/20 text-green-400 font-semibold text-xs">
                        🏎️ Driver
                      </span>
                    ) : (
                      <span className="text-white/30">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {user.is_driver ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-f1-red/20 text-f1-red font-semibold text-sm">
                        {user.driver_points || 0} pts
                      </span>
                    ) : (
                      <span className="text-white/30">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-white/70">
                    {user.team_name || <span className="text-white/30">-</span>}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-all duration-200 font-medium text-sm"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user.id_user)}
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
