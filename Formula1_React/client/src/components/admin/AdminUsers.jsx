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

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">
        {editingId ? 'Edit User' : 'Add New User'}
      </h2>

      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Prénom *"
            value={formData.firstname}
            onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
            className="px-4 py-2 border rounded-md"
            required
          />
          <input
            type="text"
            placeholder="Nom *"
            value={formData.lastname}
            onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
            className="px-4 py-2 border rounded-md"
            required
          />
          <input
            type="email"
            placeholder="Email *"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="px-4 py-2 border rounded-md"
            required
            disabled={editingId}
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder={editingId ? "Nouveau mot de passe (laisser vide pour ne pas changer)" : "Mot de passe *"}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="px-4 py-2 border rounded-md w-full"
              required={!editingId}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-6">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_admin}
              onChange={(e) => setFormData({ ...formData, is_admin: e.target.checked })}
              className="w-4 h-4"
            />
            <span>Administrator</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_driver}
              onChange={(e) => setFormData({ ...formData, is_driver: e.target.checked })}
              className="w-4 h-4"
            />
            <span>Pilote (Driver)</span>
          </label>
        </div>

        {formData.is_driver && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Points du pilote
              </label>
              <input
                type="number"
                placeholder="Points"
                value={formData.driver_points}
                onChange={(e) => setFormData({ ...formData, driver_points: parseInt(e.target.value) || 0 })}
                className="px-4 py-2 border rounded-md w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Équipe (optionnel)
              </label>
              <select
                value={formData.id_team}
                onChange={(e) => setFormData({ ...formData, id_team: e.target.value })}
                className="px-4 py-2 border rounded-md w-full"
              >
                <option value="">Aucune équipe</option>
                {teams.map(team => (
                  <option key={team.id_team} value={team.id_team}>
                    {team.libelle}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Admin</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pilote</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Points</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Équipe</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id_user}>
                <td className="px-6 py-4 whitespace-nowrap">{user.id_user}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.firstname} {user.lastname}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.is_admin === 1 ? (
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                      Admin
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                      User
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.is_driver ? (
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Driver
                    </span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.is_driver ? user.driver_points || 0 : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.team_name || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                  <button
                    onClick={() => handleEdit(user)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user.id_user)}
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
