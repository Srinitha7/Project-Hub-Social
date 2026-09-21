import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { HackathonCard } from '../components/HackathonCard';
import { CreateTeamModal } from '../components/Modals/CreateTeamModal';
import { TeamCard } from '../components/TeamCard';
import { Trophy, Search, PlusCircle, Calendar, MapPin, X } from 'lucide-react';

export const Hackathons = () => {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modeFilter, setModeFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [selectedHackathonForTeam, setSelectedHackathonForTeam] = useState(null);
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [selectedHackathonForView, setSelectedHackathonForView] = useState(null);

  useEffect(() => {
    loadHackathons();
  }, [modeFilter]);

  const loadHackathons = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (modeFilter !== 'ALL') params.append('mode', modeFilter);
      if (searchQuery.trim()) params.append('query', searchQuery.trim());

      const data = await api.getHackathons(params.toString());
      setHackathons(data);
    } catch (err) {
      console.error('Load hackathons error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeamClick = (hackathon) => {
    setSelectedHackathonForTeam(hackathon);
    setShowCreateTeamModal(true);
  };

  const handleViewTeamsClick = (hackathon) => {
    setSelectedHackathonForView(hackathon);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <Trophy className="h-6 w-6 text-amber-400" /> Hackathon Hub
          </h1>
          <p className="text-xs text-slate-400 mt-1">Discover competitive hackathons, form dream teams, and build game-changing prototypes</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search hackathons by name, organizer, or technologies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-900/90 py-2.5 pl-9 pr-3 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          {['ALL', 'ONLINE', 'OFFLINE', 'HYBRID'].map(mode => (
            <button
              key={mode}
              onClick={() => setModeFilter(mode)}
              className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                modeFilter === mode
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  : 'border border-slate-800 bg-slate-900/80 text-slate-400 hover:border-slate-700'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Hackathons Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse rounded-2xl border border-slate-800 bg-slate-900/40 h-80" />
          ))}
        </div>
      ) : hackathons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hackathons.map(h => (
            <HackathonCard
              key={h.id}
              hackathon={h}
              onCreateTeam={handleCreateTeamClick}
              onViewTeams={handleViewTeamsClick}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center">
          <Trophy className="h-10 w-10 text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">No Hackathons Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
            Try switching mode filter or clearing search query.
          </p>
        </div>
      )}

      {/* View Teams Modal Drawer */}
      {selectedHackathonForView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 p-4 bg-slate-950">
              <div>
                <h3 className="text-base font-bold text-white">{selectedHackathonForView.name} - Recruiting Teams</h3>
                <p className="text-xs text-slate-400">Join an active team looking for your skill stack</p>
              </div>
              <button onClick={() => setSelectedHackathonForView(null)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-800">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-4">
              {selectedHackathonForView.teams?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedHackathonForView.teams.map(t => (
                    <TeamCard key={t.id} team={t} />
                  ))}
                </div>
              ) : (
                <p className="text-center py-8 text-xs text-slate-400">
                  No teams created for this hackathon yet. Be the first to start a team!
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create Team Modal */}
      {showCreateTeamModal && (
        <CreateTeamModal
          isOpen={showCreateTeamModal}
          onClose={() => setShowCreateTeamModal(false)}
          defaultHackathon={selectedHackathonForTeam}
          onTeamCreated={loadHackathons}
        />
      )}
    </div>
  );
};
