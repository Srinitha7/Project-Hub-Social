import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { TeamCard } from '../components/TeamCard';
import { CreateTeamModal } from '../components/Modals/CreateTeamModal';
import { Users, Search, PlusCircle, Filter } from 'lucide-react';

export const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadTeams();
  }, [skillFilter]);

  const loadTeams = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (skillFilter) params.append('skill', skillFilter);
      if (searchQuery.trim()) params.append('query', searchQuery.trim());

      const data = await api.getTeams(params.toString());
      setTeams(data);
    } catch (err) {
      console.error('Load teams error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadTeams();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <UserGroup className="h-6 w-6 text-indigo-400" /> Team Formation & Recruitment
          </h1>
          <p className="text-xs text-slate-400 mt-1">Join existing hackathon squads or create a new team and recruit talented developers</p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all"
        >
          <PlusCircle className="h-4 w-4" /> Form New Team
        </button>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="mb-6 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search teams by name, description, or required skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-900/90 py-2.5 pl-9 pr-3 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
          />
        </div>
        <button type="submit" className="rounded-xl border border-slate-700 bg-slate-800 px-4 text-xs font-semibold text-slate-200 hover:bg-slate-700">
          Search
        </button>
      </form>

      {/* Teams Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="animate-pulse rounded-2xl border border-slate-800 bg-slate-900/40 h-72" />
          ))}
        </div>
      ) : teams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map(t => (
            <TeamCard key={t.id} team={t} onRequestSent={loadTeams} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center">
          <UserGroup className="h-10 w-10 text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">No Teams Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
            Be the first leader to form a new hackathon team!
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
          >
            Create Team
          </button>
        </div>
      )}

      {showCreateModal && (
        <CreateTeamModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onTeamCreated={loadTeams}
        />
      )}
    </div>
  );
};
