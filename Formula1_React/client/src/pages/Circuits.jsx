import { useState, useEffect } from 'react';
import api from '../api/axios';

export const Circuits = () => {
  const [circuits, setCircuits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchCircuits();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading circuits...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-full px-8 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">🏁 Circuits</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {circuits.map((circuit) => (
            <div
              key={circuit.id_circuits}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
            >
              <h3 className="text-xl font-bold text-red-600 mb-3">
                {circuit.nom}
              </h3>

              <div className="space-y-2 text-sm text-gray-600">
                {(circuit.ville || circuit.pays) && (
                  <p>
                    <span className="font-semibold">Localisation:</span>{' '}
                    {[circuit.ville, circuit.pays].filter(Boolean).join(', ')}
                  </p>
                )}
                {circuit.longueur && (
                  <p>
                    <span className="font-semibold">Longueur:</span>{' '}
                    {circuit.longueur} km
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {circuits.length === 0 && (
          <div className="text-center text-gray-600 mt-8">
            No circuits found
          </div>
        )}
      </div>
    </div>
  );
};
