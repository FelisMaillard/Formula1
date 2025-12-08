import { useState, useEffect } from 'react';
import api from '../../api/axios';

export const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [circuits, setCircuits] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nom: '',
    date_heure: '',
    id_circuits: '',
    id_saison: '',
    id_type_evenement: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [eventsRes, circuitsRes, seasonsRes, typesRes] = await Promise.all([
        api.get('/events'),
        api.get('/circuits'),
        api.get('/events/seasons'),
        api.get('/events/types')
      ]);
      setEvents(eventsRes.data.events);
      setCircuits(circuitsRes.data.circuits);
      setSeasons(seasonsRes.data.seasons);
      setEventTypes(typesRes.data.eventTypes);
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
        await api.put(`/events/${editingId}`, formData);
      } else {
        await api.post('/events', formData);
      }

      setFormData({
        nom: '',
        date_heure: '',
        id_circuits: '',
        id_saison: '',
        id_type_evenement: ''
      });
      setEditingId(null);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.error || 'Operation failed');
    }
  };

  const handleEdit = (event) => {
    setFormData({
      nom: event.nom || '',
      date_heure: event.date_heure?.split('.')[0] || '',
      id_circuits: event.id_circuits || '',
      id_saison: event.id_saison || '',
      id_type_evenement: event.id_type_evenement || ''
    });
    setEditingId(event.id_planning);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      await api.delete(`/events/${id}`);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.error || 'Delete failed');
    }
  };

  const handleCancel = () => {
    setFormData({
      nom: '',
      date_heure: '',
      id_circuits: '',
      id_saison: '',
      id_type_evenement: ''
    });
    setEditingId(null);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">
        {editingId ? 'Edit Event' : 'Add New Event'}
      </h2>

      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Nom de l'événement *"
            value={formData.nom}
            onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
            className="px-4 py-2 border rounded-md"
            required
          />
          <input
            type="datetime-local"
            placeholder="Date et heure *"
            value={formData.date_heure}
            onChange={(e) => setFormData({ ...formData, date_heure: e.target.value })}
            className="px-4 py-2 border rounded-md"
            required
          />
          <select
            value={formData.id_circuits}
            onChange={(e) => setFormData({ ...formData, id_circuits: e.target.value })}
            className="px-4 py-2 border rounded-md"
            required
          >
            <option value="">Sélectionner un circuit *</option>
            {circuits.map(circuit => (
              <option key={circuit.id_circuits} value={circuit.id_circuits}>
                {circuit.nom}
              </option>
            ))}
          </select>
          <select
            value={formData.id_saison}
            onChange={(e) => setFormData({ ...formData, id_saison: e.target.value })}
            className="px-4 py-2 border rounded-md"
            required
          >
            <option value="">Sélectionner une saison *</option>
            {seasons.map(season => (
              <option key={season.id_saison} value={season.id_saison}>
                {season.nom} ({season.annee})
              </option>
            ))}
          </select>
          <select
            value={formData.id_type_evenement}
            onChange={(e) => setFormData({ ...formData, id_type_evenement: e.target.value })}
            className="px-4 py-2 border rounded-md"
            required
          >
            <option value="">Sélectionner un type *</option>
            {eventTypes.map(type => (
              <option key={type.id_type_evenement} value={type.id_type_evenement}>
                {type.libelle}
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Circuit</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Saison</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {events.map((event) => (
              <tr key={event.id_planning}>
                <td className="px-6 py-4 whitespace-nowrap">{event.id_planning}</td>
                <td className="px-6 py-4 whitespace-nowrap">{event.nom}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {event.date_heure ? new Date(event.date_heure).toLocaleString('fr-FR') : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{event.circuit_name || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap">{event.type_name || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {event.saison_name} ({event.annee})
                </td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                  <button
                    onClick={() => handleEdit(event)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(event.id_planning)}
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
