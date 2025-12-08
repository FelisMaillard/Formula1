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
        <div className="text-xl">Loading drivers...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-full px-8 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">👤 Drivers</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {drivers.map((driver) => (
            <div
              key={driver.id_driver}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-bold text-gray-800">
                  {driver.firstname} {driver.lastname}
                </h3>
                <span className="text-2xl font-bold text-red-600">
                  {driver.points} pts
                </span>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                {driver.email && (
                  <p>
                    <span className="font-semibold">Email:</span> {driver.email}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {drivers.length === 0 && (
          <div className="text-center text-gray-600 mt-8">
            No drivers found
          </div>
        )}
      </div>
    </div>
  );
};
