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
        <div className="glass-card animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border-4 border-f1-red border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xl text-white font-semibold">Loading Circuits...</span>
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
            <span className="gradient-text">CIRCUITS</span>
          </h1>
          <p className="text-gray-400 text-lg">Formula 1 Racing Circuits Worldwide</p>
        </div>

        {/* Circuits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-slide-up">
          {circuits.map((circuit, index) => (
            <div
              key={circuit.id_circuits}
              className="glass-card-hover group relative overflow-hidden"
              style={{
                animationDelay: `${index * 50}ms`
              }}
            >
              {/* Background glow effect */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-f1-red/10 rounded-full blur-3xl group-hover:bg-f1-red/20 transition-all"></div>

              {/* Content */}
              <div className="relative z-10">
                {/* Circuit Name */}
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl lg:text-2xl font-bold text-white flex-1">
                    {circuit.nom}
                  </h3>
                  <div className="text-3xl opacity-30 group-hover:opacity-50 transition-opacity ml-2">
                    🏁
                  </div>
                </div>

                {/* Location */}
                {(circuit.ville || circuit.pays) && (
                  <div className="mb-4 py-3 border-b border-glass/30">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                      Location
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">📍</span>
                      <span className="text-white font-semibold">
                        {[circuit.ville, circuit.pays].filter(Boolean).join(', ')}
                      </span>
                    </div>
                  </div>
                )}

                {/* Track Length */}
                {circuit.longueur && (
                  <div className="pt-2">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                      Track Length
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold gradient-text">
                        {circuit.longueur}
                      </span>
                      <span className="text-sm text-gray-400">km</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {circuits.length === 0 && (
          <div className="flex items-center justify-center min-h-[400px] animate-fade-in">
            <div className="glass-card text-center">
              <div className="text-5xl mb-4">🏁</div>
              <p className="text-xl text-gray-400">No circuits found</p>
              <p className="text-sm text-gray-500 mt-2">Check back later for circuit data</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
