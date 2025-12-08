import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AdminTeams } from '../components/admin/AdminTeams';
import { AdminUsers } from '../components/admin/AdminUsers';
import { AdminCircuits } from '../components/admin/AdminCircuits';
import { AdminEvents } from '../components/admin/AdminEvents';
import { AdminResults } from '../components/admin/AdminResults';

export const Admin = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('teams');

  const tabs = [
    { id: 'teams', label: 'Teams', icon: '🏎️' },
    { id: 'users', label: 'Users / Drivers', icon: '👤' },
    { id: 'circuits', label: 'Circuits', icon: '🏁' },
    { id: 'events', label: 'Events', icon: '📅' },
    { id: 'results', label: 'Results', icon: '📊' }
  ];

  return (
    <div className="min-h-screen bg-dark-950">
      <div className="max-w-[1920px] mx-auto px-6 lg:px-12 py-12">
        {/* Header */}
        <div className="mb-12 animate-fade-in">
          <h1 className="text-5xl lg:text-6xl font-bold gradient-text mb-4">
            Admin Panel
          </h1>
          <p className="text-white/70 text-lg">
            Welcome back, <span className="text-f1-red font-semibold">{user?.username}</span>. Manage your Formula 1 data with ease.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-3 mb-8 animate-slide-up">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group relative px-6 py-3.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                activeTab === tab.id
                  ? 'glass-card-active text-white shadow-lg shadow-f1-red/20'
                  : 'glass-card text-white/80 hover:text-white'
              }`}
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl transform group-hover:scale-110 transition-transform duration-300">
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
              </div>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-f1-red to-red-600 rounded-b-xl"></div>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="glass-card p-8 lg:p-10 animate-fade-in">
          {activeTab === 'teams' && <AdminTeams />}
          {activeTab === 'users' && <AdminUsers />}
          {activeTab === 'circuits' && <AdminCircuits />}
          {activeTab === 'events' && <AdminEvents />}
          {activeTab === 'results' && <AdminResults />}
        </div>
      </div>
    </div>
  );
};
