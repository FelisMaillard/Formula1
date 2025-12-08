import { useState, useEffect } from 'react';
import api from '../api/axios';

const getStatusBadge = (event) => {
  if (event.has_results > 0) {
    return {
      label: 'Completed',
      className: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
    };
  } else if (new Date(event.date_heure) < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) {
    return {
      label: 'No Results',
      className: 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
    };
  } else if (new Date(event.date_heure) < new Date()) {
    return {
      label: 'Pending',
      className: 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
    };
  } else {
    return {
      label: 'Upcoming',
      className: 'bg-f1-red/20 text-f1-red border border-f1-red/50'
    };
  }
};

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
        <div className="text-xl text-white/80 animate-fade-in">Loading calendar...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950">
      <div className="max-w-[1920px] mx-auto px-6 lg:px-12 py-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 animate-fade-in">
          <div>
            <h1 className="text-5xl lg:text-6xl font-bold gradient-text mb-2">
              Race Calendar
            </h1>
            <p className="text-white/50 text-lg">Formula 1 Season {season}</p>
          </div>

          {/* Season Selector */}
          <select
            value={season}
            onChange={(e) => setSeason(Number(e.target.value))}
            className="glass-button !px-8 !py-4 text-white cursor-pointer bg-dark-800/50 hover:bg-f1-red/20 border border-f1-red/30 hover:border-f1-red/50 rounded-xl text-base"
          >
            <option value={2024}>2024</option>
            <option value={2025}>2025</option>
            <option value={2026}>2026</option>
          </select>
        </div>

        {/* Calendar Table */}
        {calendar.length > 0 ? (
          <div className="table-glass animate-slide-up">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="px-6 lg:px-8 py-5 text-left text-sm lg:text-base font-semibold text-f1-red/80 uppercase tracking-wider">
                    Round
                  </th>
                  <th className="px-6 lg:px-8 py-5 text-left text-sm lg:text-base font-semibold text-f1-red/80 uppercase tracking-wider">
                    Grand Prix
                  </th>
                  <th className="px-6 lg:px-8 py-5 text-left text-sm lg:text-base font-semibold text-f1-red/80 uppercase tracking-wider">
                    Circuit
                  </th>
                  <th className="px-6 lg:px-8 py-5 text-left text-sm lg:text-base font-semibold text-f1-red/80 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 lg:px-8 py-5 text-left text-sm lg:text-base font-semibold text-f1-red/80 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {calendar.map((event, index) => {
                  const status = getStatusBadge(event);
                  return (
                    <tr
                      key={event.id_planning}
                      className="group hover:bg-white/5 transition-all duration-300"
                    >
                      <td className="px-6 lg:px-8 py-5">
                        <span className="text-f1-red font-bold text-lg lg:text-xl">
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-6 lg:px-8 py-5">
                        <div>
                          <div className="font-semibold text-white text-sm lg:text-base group-hover:text-f1-red transition-colors">
                            {event.nom}
                          </div>
                          <div className="text-xs lg:text-sm text-white/50 mt-1">
                            {event.ville && event.pays
                              ? `${event.ville}, ${event.pays}`
                              : event.pays || event.ville}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 lg:px-8 py-5">
                        <div>
                          <div className="font-semibold text-white text-sm lg:text-base">
                            {event.circuit_nom}
                          </div>
                          {event.longueur && (
                            <div className="text-xs lg:text-sm text-white/50 mt-1">
                              {event.longueur} km
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 lg:px-8 py-5">
                        <span className="text-white/70 text-sm lg:text-base font-medium">
                          {new Date(event.date_heure).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </td>
                      <td className="px-6 lg:px-8 py-5">
                        <span className={`inline-block px-4 py-2 rounded-lg text-xs lg:text-sm font-semibold transition-all duration-300 ${status.className}`}>
                          {status.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="glass-card flex items-center justify-center min-h-[400px] animate-fade-in">
            <p className="text-white/70 text-lg text-center">
              No races scheduled for {season}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
