import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AdminTeams } from '../components/admin/AdminTeams';
import { AdminDrivers } from '../components/admin/AdminDrivers';
import { AdminCircuits } from '../components/admin/AdminCircuits';
import { AdminEvents } from '../components/admin/AdminEvents';
import { AdminResults } from '../components/admin/AdminResults';

export const Admin = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('teams');

  const tabs = [
    { id: 'teams', label: 'Teams', icon: '🏎️' },
    { id: 'drivers', label: 'Drivers', icon: '👤' },
    { id: 'circuits', label: 'Circuits', icon: '🏁' },
    { id: 'events', label: 'Events', icon: '📅' },
    { id: 'results', label: 'Results', icon: '📊' }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-full px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            ⚙️ Admin Panel
          </h1>
          <p className="text-gray-600">
            Welcome, {user?.username}. Manage Formula 1 data below.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                activeTab === tab.id
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {activeTab === 'teams' && <AdminTeams />}
          {activeTab === 'drivers' && <AdminDrivers />}
          {activeTab === 'circuits' && <AdminCircuits />}
          {activeTab === 'events' && <AdminEvents />}
          {activeTab === 'results' && <AdminResults />}
        </div>
      </div>
    </div>
  );
};
