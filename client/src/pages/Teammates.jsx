import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { DeveloperCard } from '../components/DeveloperCard';
import { Users, Search, Filter, GraduationCap, Code2, Sparkles } from 'lucide-react';

export const Teammates = () => {
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [collegeFilter, setCollegeFilter] = useState('');
  const [experienceFilter, setExperienceFilter] = useState('');

  useEffect(() => {
    loadDevelopers();
  }, [skillFilter, collegeFilter, experienceFilter]);

  const loadDevelopers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.append('query', searchQuery.trim());
      if (skillFilter) params.append('skill', skillFilter);
      if (collegeFilter) params.append('college', collegeFilter);
      if (experienceFilter) params.append('experience', experienceFilter);

      const data = await api.findTeammates(params.toString());
      setDevelopers(data);
    } catch (err) {
      console.error('Find teammates error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadDevelopers();
  };

  const handleQuickPreset = (skill) => {
    setSkillFilter(skill);
    setSearchQuery('');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
          <Users className="h-6 w-6 text-indigo-400" /> Find Teammates & Collaborators
        </h1>
        <p className="text-xs text-slate-400 mt-1">Discover student developers matching your target skill stack for hackathons or open-source projects</p>
      </div>

      {/* Quick Search Preset Bar */}
      <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <p className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-indigo-400" /> Popular Skill Combinations
        </p>
        <div className="flex flex-wrap gap-2">
          {['Python', 'AI/ML', 'React', 'Node.js', 'Rust', 'Cybersecurity', 'Solidity', 'Java', 'Tailwind CSS'].map(skill => (
            <button
              key={skill}
              onClick={() => handleQuickPreset(skill)}
              className={`rounded-xl px-3 py-1.5 text-xs font-mono font-semibold transition-all ${
                skillFilter === skill
                  ? 'bg-indigo-600 text-white border border-indigo-500 shadow-md shadow-indigo-600/30'
                  : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700'
              }`}
            >
              + {skill}
            </button>
          ))}
          {skillFilter && (
            <button
              onClick={() => setSkillFilter('')}
              className="rounded-xl bg-slate-800 text-rose-400 border border-slate-700 px-3 py-1.5 text-xs font-semibold hover:bg-slate-700"
            >
              Clear Filter
            </button>
          )}
        </div>
      </div>

      {/* Search Bar & Dropdown Filters */}
      <form onSubmit={handleSearchSubmit} className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by developer name, username, college, or bio..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-900/90 py-2.5 pl-9 pr-3 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div>
          <select
            value={experienceFilter}
            onChange={(e) => setExperienceFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-900/90 py-2.5 px-3 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
          >
            <option value="">All Experience Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="Expert">Expert</option>
          </select>
        </div>

        <button
          type="submit"
          className="rounded-xl bg-indigo-600 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors"
        >
          Find Developers
        </button>
      </form>

      {/* Developer Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="animate-pulse rounded-2xl border border-slate-800 bg-slate-900/40 h-72" />
          ))}
        </div>
      ) : developers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {developers.map(dev => (
            <DeveloperCard key={dev.id} developer={dev} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center">
          <Users className="h-10 w-10 text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">No Developers Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
            Try searching for a different skill or clearing your search filters.
          </p>
          <button
            onClick={() => { setSkillFilter(''); setCollegeFilter(''); setExperienceFilter(''); setSearchQuery(''); }}
            className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
