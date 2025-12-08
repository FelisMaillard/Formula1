import { useState, useEffect } from 'react';
import api from '../api/axios';

export const Calendar = () => {
  const [calendar, setCalendar] = useState([]);
  const [season, setSeason] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCalendar = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/stats/calendar?saison=${season}`);
        setCalendar(response.data.calendar);
      } catch (error) {
        console.error('Error fetching calendar:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCalendar();
  }, [season]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading calendar...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-full px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">📅 Race Calendar</h1>
          <select
            value={season}
            onChange={(e) => setSeason(Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value={2024}>2024</option>
            <option value={2025}>2025</option>
            <option value={2026}>2026</option>
          </select>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full table-auto">
            <thead className="bg-red-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left">Round</th>
                <th className="px-6 py-3 text-left">Grand Prix</th>
                <th className="px-6 py-3 text-left">Circuit</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {calendar.map((event, index) => (
                <tr
                  key={event.id_planning}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 font-bold text-red-600">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-semibold">{event.nom}</div>
                      <div className="text-sm text-gray-600">
                        {event.ville && event.pays
                          ? `${event.ville}, ${event.pays}`
                          : event.pays || event.ville}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-semibold">{event.circuit_nom}</div>
                      {event.longueur && (
                        <div className="text-sm text-gray-600">
                          {event.longueur} km
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {new Date(event.date_heure).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short'
                    })}
                  </td>
                  <td className="px-6 py-4">
                    {event.has_results > 0 ? (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
                        Completed
                      </span>
                    ) : new Date(event.date_heure) < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) ? (
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-semibold">
                        No Results
                      </span>
                    ) : new Date(event.date_heure) < new Date() ? (
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-semibold">
                        Pending
                      </span>
                    ) : (
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">
                        Upcoming
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {calendar.length === 0 && (
          <div className="text-center text-gray-600 mt-8">
            No races scheduled for {season}
          </div>
        )}
      </div>
    </div>
  );
};
