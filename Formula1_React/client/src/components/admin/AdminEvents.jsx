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

  if (loading) return (
    <div className="flex items-center justify-center py-12">
      <div className="glass-card-no-hover px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-f1-red"></div>
          <span className="text-white text-lg">Loading events...</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Form Section */}
      <div className="glass-card-no-hover p-6 lg:p-8">
        <h2 className="text-3xl font-bold gradient-text mb-6">
          {editingId ? '✏️ Edit Event' : '➕ Add New Event'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2 lg:col-span-2">
              <label className="text-white/70 text-sm font-medium">Event Name *</label>
              <input
                type="text"
                placeholder="e.g., Monaco Grand Prix"
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                className="input-glass"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-white/70 text-sm font-medium">Date & Time *</label>
              <input
                type="datetime-local"
                value={formData.date_heure}
                onChange={(e) => setFormData({ ...formData, date_heure: e.target.value })}
                className="input-glass"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-white/70 text-sm font-medium">Circuit *</label>
              <select
                value={formData.id_circuits}
                onChange={(e) => setFormData({ ...formData, id_circuits: e.target.value })}
                className="input-glass"
                required
              >
                <option value="">Select a circuit</option>
                {circuits.map(circuit => (
                  <option key={circuit.id_circuits} value={circuit.id_circuits}>
                    {circuit.nom}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-white/70 text-sm font-medium">Season *</label>
              <select
                value={formData.id_saison}
                onChange={(e) => setFormData({ ...formData, id_saison: e.target.value })}
                className="input-glass"
                required
              >
                <option value="">Select a season</option>
                {seasons.map(season => (
                  <option key={season.id_saison} value={season.id_saison}>
                    {season.nom} ({season.annee})
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-white/70 text-sm font-medium">Event Type *</label>
              <select
                value={formData.id_type_evenement}
                onChange={(e) => setFormData({ ...formData, id_type_evenement: e.target.value })}
                className="input-glass"
                required
              >
                <option value="">Select event type</option>
                {eventTypes.map(type => (
                  <option key={type.id_type_evenement} value={type.id_type_evenement}>
                    {type.libelle}
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
              {editingId ? '💾 Update Event' : '✨ Create Event'}
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
          <span>📅</span>
          <span>Events List</span>
          <span className="text-sm font-normal text-white/50">({events.length} events)</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="table-glass">
            <thead>
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white/90">ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white/90">Event Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white/90">Date & Time</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white/90">Circuit</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white/90">Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white/90">Season</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white/90">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event, index) => (
                <tr
                  key={event.id_planning}
                  className="group hover:bg-white/5 transition-colors duration-200"
                  style={{
                    animationDelay: `${index * 0.05}s`
                  }}
                >
                  <td className="px-6 py-4 text-white/70">{event.id_planning}</td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-white">{event.nom}</span>
                  </td>
                  <td className="px-6 py-4 text-white/70">
                    {event.date_heure ? new Date(event.date_heure).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-white/70">{event.circuit_name || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 font-semibold text-xs">
                      {event.type_name || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-f1-red/20 text-f1-red font-semibold text-sm">
                      {event.saison_name} {event.annee}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(event)}
                        className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-all duration-200 font-medium text-sm"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(event.id_planning)}
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
