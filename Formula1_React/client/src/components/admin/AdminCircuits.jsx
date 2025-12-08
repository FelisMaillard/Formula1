import { useState, useEffect } from 'react';
import api from '../../api/axios';

export const AdminCircuits = () => {
  const [circuits, setCircuits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nom: '',
    longueur: '',
    ville: '',
    pays: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchCircuits();
  }, []);

  const fetchCircuits = async () => {
    try {
      const response = await api.get('/circuits');
      setCircuits(response.data.circuits);
    } catch (error) {
      console.error('Error fetching circuits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(`/circuits/${editingId}`, formData);
      } else {
        await api.post('/circuits', formData);
      }

      setFormData({
        nom: '',
        longueur: '',
        ville: '',
        pays: ''
      });
      setEditingId(null);
      fetchCircuits();
    } catch (error) {
      alert(error.response?.data?.error || 'Operation failed');
    }
  };

  const handleEdit = (circuit) => {
    setFormData({
      nom: circuit.nom || '',
      longueur: circuit.longueur || '',
      ville: circuit.ville || '',
      pays: circuit.pays || ''
    });
    setEditingId(circuit.id_circuits);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this circuit?')) return;

    try {
      await api.delete(`/circuits/${id}`);
      fetchCircuits();
    } catch (error) {
      alert(error.response?.data?.error || 'Delete failed');
    }
  };

  const handleCancel = () => {
    setFormData({
      nom: '',
      longueur: '',
      ville: '',
      pays: ''
    });
    setEditingId(null);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">
        {editingId ? 'Edit Circuit' : 'Add New Circuit'}
      </h2>

      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Nom du circuit *"
            value={formData.nom}
            onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
            className="px-4 py-2 border rounded-md"
            required
          />
          <input
            type="number"
            step="0.01"
            placeholder="Longueur (km)"
            value={formData.longueur}
            onChange={(e) => setFormData({ ...formData, longueur: e.target.value })}
            className="px-4 py-2 border rounded-md"
          />
          <input
            type="text"
            placeholder="Ville"
            value={formData.ville}
            onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
            className="px-4 py-2 border rounded-md"
          />
          <input
            type="text"
            placeholder="Pays"
            value={formData.pays}
            onChange={(e) => setFormData({ ...formData, pays: e.target.value })}
            className="px-4 py-2 border rounded-md"
          />
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Longueur (km)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ville</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pays</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {circuits.map((circuit) => (
              <tr key={circuit.id_circuits}>
                <td className="px-6 py-4 whitespace-nowrap">{circuit.id_circuits}</td>
                <td className="px-6 py-4 whitespace-nowrap">{circuit.nom}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {circuit.longueur ? `${parseFloat(circuit.longueur).toFixed(2)} km` : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{circuit.ville || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap">{circuit.pays || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                  <button
                    onClick={() => handleEdit(circuit)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(circuit.id_circuits)}
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
