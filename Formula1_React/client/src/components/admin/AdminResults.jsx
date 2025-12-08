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

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">
        {editingId ? 'Edit Result' : 'Add New Result'}
      </h2>

      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={formData.id_planning}
            onChange={(e) => setFormData({ ...formData, id_planning: e.target.value })}
            className="px-4 py-2 border rounded-md"
            required
          >
            <option value="">Sélectionner un événement *</option>
            {events.map(event => (
              <option key={event.id_planning} value={event.id_planning}>
                {event.nom} - {event.circuit_name}
              </option>
            ))}
          </select>
          <select
            value={formData.id_driver}
            onChange={(e) => setFormData({ ...formData, id_driver: e.target.value })}
            className="px-4 py-2 border rounded-md"
            required
          >
            <option value="">Sélectionner un pilote *</option>
            {drivers.map(driver => (
              <option key={driver.id_driver} value={driver.id_driver}>
                {driver.firstname} {driver.lastname}
              </option>
            ))}
          </select>
          <select
            value={formData.id_bareme}
            onChange={(e) => setFormData({ ...formData, id_bareme: e.target.value })}
            className="px-4 py-2 border rounded-md"
          >
            <option value="">Sélectionner une position</option>
            {baremes.map(bareme => (
              <option key={bareme.id_bareme} value={bareme.id_bareme}>
                P{bareme.place} ({bareme.point} pts)
              </option>
            ))}
          </select>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Événement</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pilote</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Points</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {results.map((result) => (
              <tr key={result.id_result}>
                <td className="px-6 py-4 whitespace-nowrap">{result.id_result}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {result.event_name} - {result.circuit_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {result.firstname} {result.lastname}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {result.place ? `P${result.place}` : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {result.point || 0} pts
                </td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                  <button
                    onClick={() => handleEdit(result)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(result.id_result)}
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
