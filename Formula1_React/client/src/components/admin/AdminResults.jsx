import { useState, useEffect } from 'react';
import api from '../../api/axios';

export const AdminResults = () => {
  const [results, setResults] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [events, setEvents] = useState([]);
  const [baremes, setBaremes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    id_planning: '',
    id_driver: '',
    id_bareme: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resultsRes, driversRes, eventsRes] = await Promise.all([
        api.get('/results'),
        api.get('/drivers'),
        api.get('/events')
      ]);
      setResults(resultsRes.data.results);
      setDrivers(driversRes.data.drivers);
      setEvents(eventsRes.data.events);
      
      // Fetch bareme data from database (positions 1-10 with F1 points)
      // Since we don't have a direct API endpoint, we'll create the expected structure
      const baremeData = [
        { id_bareme: 1, place: 1, point: 25 },
        { id_bareme: 2, place: 2, point: 18 },
        { id_bareme: 3, place: 3, point: 15 },
        { id_bareme: 4, place: 4, point: 12 },
        { id_bareme: 5, place: 5, point: 10 },
        { id_bareme: 6, place: 6, point: 8 },
        { id_bareme: 7, place: 7, point: 6 },
        { id_bareme: 8, place: 8, point: 4 },
        { id_bareme: 9, place: 9, point: 2 },
        { id_bareme: 10, place: 10, point: 1 }
      ];
      setBaremes(baremeData);
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
        await api.put(`/results/${editingId}`, formData);
      } else {
        await api.post('/results', formData);
      }

      setFormData({
        id_planning: '',
        id_driver: '',
        id_bareme: ''
      });
      setEditingId(null);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.error || 'Operation failed');
    }
  };

  const handleEdit = (result) => {
    setFormData({
      id_planning: result.id_planning || '',
      id_driver: result.id_driver || '',
      id_bareme: result.id_bareme || ''
    });
    setEditingId(result.id_result);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this result?')) return;

    try {
      await api.delete(`/results/${id}`);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.error || 'Delete failed');
    }
  };

  const handleCancel = () => {
    setFormData({
      id_planning: '',
      id_driver: '',
      id_bareme: ''
    });
    setEditingId(null);
  };

  if (loading) return (
    <div className="flex items-center justify-center py-12">
      <div className="glass-card px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-f1-red"></div>
          <span className="text-white text-lg">Loading results...</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Form Section */}
      <div className="glass-card p-6 lg:p-8">
        <h2 className="text-3xl font-bold gradient-text mb-6">
          {editingId ? '✏️ Edit Result' : '➕ Add New Result'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-white/70 text-sm font-medium">Event *</label>
              <select
                value={formData.id_planning}
                onChange={(e) => setFormData({ ...formData, id_planning: e.target.value })}
                className="input-glass"
                required
              >
                <option value="">Select an event</option>
                {events.map(event => (
                  <option key={event.id_planning} value={event.id_planning}>
                    {event.nom} - {event.circuit_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-white/70 text-sm font-medium">Driver *</label>
              <select
                value={formData.id_driver}
                onChange={(e) => setFormData({ ...formData, id_driver: e.target.value })}
                className="input-glass"
                required
              >
                <option value="">Select a driver</option>
                {drivers.map(driver => (
                  <option key={driver.id_driver} value={driver.id_driver}>
                    {driver.firstname} {driver.lastname}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-white/70 text-sm font-medium">Position</label>
              <select
                value={formData.id_bareme}
                onChange={(e) => setFormData({ ...formData, id_bareme: e.target.value })}
                className="input-glass"
              >
                <option value="">Select position</option>
                {baremes.map(bareme => (
                  <option key={bareme.id_bareme} value={bareme.id_bareme}>
                    P{bareme.place} ({bareme.point} pts)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="glass-button-gradient"
            >
              {editingId ? '💾 Update Result' : '✨ Create Result'}
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
          <span>📊</span>
          <span>Results List</span>
          <span className="text-sm font-normal text-white/50">({results.length} results)</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="table-glass">
            <thead>
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white/90">ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white/90">Event</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white/90">Driver</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white/90">Position</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white/90">Points</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white/90">Actions</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr
                  key={result.id_result}
                  className="group hover:bg-white/5 transition-colors duration-200"
                  style={{
                    animationDelay: `${index * 0.05}s`
                  }}
                >
                  <td className="px-6 py-4 text-white/70">{result.id_result}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-white">{result.event_name}</span>
                      <span className="text-sm text-white/50">{result.circuit_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-white">
                      {result.firstname} {result.lastname}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {result.place ? (
                      <span className={`inline-flex items-center px-3 py-1 rounded-full font-bold text-sm ${
                        result.place === 1 ? 'bg-yellow-500/20 text-yellow-400' :
                        result.place === 2 ? 'bg-gray-400/20 text-gray-300' :
                        result.place === 3 ? 'bg-orange-600/20 text-orange-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {result.place === 1 ? '🥇' : result.place === 2 ? '🥈' : result.place === 3 ? '🥉' : ''}
                        {' '}P{result.place}
                      </span>
                    ) : (
                      <span className="text-white/30">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-f1-red/20 text-f1-red font-semibold text-sm">
                      {result.point || 0} pts
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(result)}
                        className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-all duration-200 font-medium text-sm"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(result.id_result)}
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
