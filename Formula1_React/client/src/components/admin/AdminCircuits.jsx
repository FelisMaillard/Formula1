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

  if (loading) return (
    <div className="flex items-center justify-center py-12">
      <div className="glass-card-no-hover px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-f1-red"></div>
          <span className="text-white text-lg">Loading circuits...</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Form Section */}
      <div className="glass-card-no-hover p-6 lg:p-8">
        <h2 className="text-3xl font-bold gradient-text mb-6">
          {editingId ? '✏️ Edit Circuit' : '➕ Add New Circuit'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-white/70 text-sm font-medium">Circuit Name *</label>
              <input
                type="text"
                placeholder="e.g., Monaco Grand Prix Circuit"
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                className="input-glass"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-white/70 text-sm font-medium">Length (km)</label>
              <input
                type="number"
                step="0.01"
                placeholder="e.g., 5.412"
                value={formData.longueur}
                onChange={(e) => setFormData({ ...formData, longueur: e.target.value })}
                className="input-glass"
              />
            </div>
            <div className="space-y-2">
              <label className="text-white/70 text-sm font-medium">City</label>
              <input
                type="text"
                placeholder="e.g., Monte Carlo"
                value={formData.ville}
                onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                className="input-glass"
              />
            </div>
            <div className="space-y-2">
              <label className="text-white/70 text-sm font-medium">Country</label>
              <input
                type="text"
                placeholder="e.g., Monaco"
                value={formData.pays}
                onChange={(e) => setFormData({ ...formData, pays: e.target.value })}
                className="input-glass"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="glass-button-gradient"
            >
              {editingId ? '💾 Update Circuit' : '✨ Create Circuit'}
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
      <div className="glass-card-no-hover p-6 lg:p-8">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <span>🏁</span>
          <span>Circuits List</span>
          <span className="text-sm font-normal text-white/50">({circuits.length} circuits)</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="table-glass">
            <thead>
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white/90">ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white/90">Circuit Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white/90">Length</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white/90">City</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white/90">Country</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white/90">Actions</th>
              </tr>
            </thead>
            <tbody>
              {circuits.map((circuit, index) => (
                <tr
                  key={circuit.id_circuits}
                  className="group hover:bg-white/5 transition-colors duration-200"
                  style={{
                    animationDelay: `${index * 0.05}s`
                  }}
                >
                  <td className="px-6 py-4 text-white/70">{circuit.id_circuits}</td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-white">{circuit.nom}</span>
                  </td>
                  <td className="px-6 py-4">
                    {circuit.longueur ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 font-semibold text-sm">
                        {parseFloat(circuit.longueur).toFixed(2)} km
                      </span>
                    ) : (
                      <span className="text-white/30">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-white/70">{circuit.ville || 'N/A'}</td>
                  <td className="px-6 py-4 text-white/70">{circuit.pays || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(circuit)}
                        className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-all duration-200 font-medium text-sm"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(circuit.id_circuits)}
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
