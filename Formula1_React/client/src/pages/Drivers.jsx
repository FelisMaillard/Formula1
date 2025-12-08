import { useState, useEffect } from 'react';
import api from '../api/axios';

export const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await api.get('/drivers');
        setDrivers(response.data.drivers);
      } catch (error) {
        console.error('Error fetching drivers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border-4 border-f1-red border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xl text-white font-semibold">Loading Drivers...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-[1920px] mx-auto px-6 lg:px-12 py-12">
        {/* Header */}
        <div className="mb-12 animate-fade-in">
          <h1 className="text-5xl lg:text-6xl font-bold mb-3">
            <span className="gradient-text">DRIVERS</span>
          </h1>
          <p className="text-gray-400 text-lg">Formula 1 Championship Drivers</p>
        </div>

        {/* Drivers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 animate-slide-up">
          {drivers.map((driver, index) => (
            <div
              key={driver.id_driver}
              className="glass-card-hover group relative overflow-hidden"
              style={{
                animationDelay: `${index * 50}ms`
              }}
            >
              {/* Background glow effect */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-f1-red/10 rounded-full blur-3xl group-hover:bg-f1-red/20 transition-all"></div>

              {/* Content */}
              <div className="relative z-10">
                {/* Driver Name and Avatar */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-f1-red to-f1-red-dark flex items-center justify-center text-lg font-bold text-white flex-shrink-0">
                    {driver.firstname?.charAt(0)}{driver.lastname?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg lg:text-xl font-bold text-white truncate">
                      {driver.firstname}
                    </h3>
                    <p className="text-sm text-gray-400 truncate">
                      {driver.lastname}
                    </p>
                  </div>
                </div>

                {/* Points */}
                <div className="mb-4 py-3 border-b border-glass/30">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                    Points
                  </p>
                  <p className="text-3xl font-bold gradient-text">
                    {driver.points}
                  </p>
                </div>

                {/* Email */}
                {driver.email && (
                  <div className="pt-2">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                      Email
                    </p>
                    <p className="text-sm text-gray-300 truncate hover:text-white transition-colors">
                      {driver.email}
                    </p>
                  </div>
                )}

                {/* Driver Emoji */}
                <div className="absolute top-3 right-3 text-3xl opacity-20 group-hover:opacity-40 transition-opacity">
                  👤
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {drivers.length === 0 && (
          <div className="flex items-center justify-center min-h-[400px] animate-fade-in">
            <div className="glass-card text-center">
              <div className="text-5xl mb-4">👤</div>
              <p className="text-xl text-gray-400">No drivers found</p>
              <p className="text-sm text-gray-500 mt-2">Check back later for driver data</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
