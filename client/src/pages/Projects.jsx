import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ProjectCard } from '../components/ProjectCard';
import { CreateProjectModal } from '../components/Modals/CreateProjectModal';
import { Code2, Search, PlusCircle, Filter } from 'lucide-react';

const techFilters = ['ALL', 'Java', 'Python', 'React', 'Node.js', 'AI/ML', 'Cybersecurity', 'Cloud', 'Blockchain', 'C++', 'Rust'];

export const Projects = ({ openCreateProjectModal }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTech, setSelectedTech] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadProjects();
  }, [selectedTech, selectedStatus]);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedTech !== 'ALL') params.append('tech', selectedTech);
      if (selectedStatus !== 'ALL') params.append('status', selectedStatus);
      if (searchQuery.trim()) params.append('query', searchQuery.trim());

      const data = await api.getProjects(params.toString());
      setProjects(data);
    } catch (err) {
      console.error('Load projects error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadProjects();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <Code2 className="h-6 w-6 text-emerald-400" /> Project Showcase
          </h1>
          <p className="text-xs text-slate-400 mt-1">Discover, filter, and collaborate on software built by student developers</p>
        </div>

        <button
          onClick={openCreateProjectModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all"
        >
          <PlusCircle className="h-4 w-4" /> Publish New Project
        </button>
      </div>

      {/* Search & Status Filters */}
      <div className="mb-6 space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search projects by title, description, or stack..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-900/90 py-2.5 pl-9 pr-4 text-xs text-slate-200 placeholder-slate-400 focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl border border-slate-700 bg-slate-800 px-4 text-xs font-semibold text-slate-200 hover:bg-slate-700"
          >
            Search
          </button>
        </form>

        {/* Tech Stack Pills Filter */}
        <div>
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Filter className="h-3 w-3 text-indigo-400" /> Filter by Technology Stack
          </p>
          <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-2">
            {techFilters.map(tech => (
              <button
                key={tech}
                onClick={() => setSelectedTech(tech)}
                className={`rounded-xl px-3 py-1.5 text-xs font-mono font-medium transition-all ${
                  selectedTech === tech
                    ? 'bg-indigo-600 text-white border border-indigo-500 shadow-md shadow-indigo-600/20'
                    : 'border border-slate-800 bg-slate-900/80 text-slate-400 hover:border-slate-700'
                }`}
              >
                {tech}
              </button>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 pt-2">
          <span className="text-xs text-slate-400">Status:</span>
          {['ALL', 'IDEA', 'IN_DEVELOPMENT', 'COMPLETED'].map(status => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                selectedStatus === status
                  ? 'bg-slate-800 text-indigo-400 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="animate-pulse rounded-2xl border border-slate-800 bg-slate-900/40 h-80" />
          ))}
        </div>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(p => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center">
          <Code2 className="h-10 w-10 text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">No Projects Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
            Try adjusting your search query or technology filters.
          </p>
          <button
            onClick={() => { setSelectedTech('ALL'); setSelectedStatus('ALL'); setSearchQuery(''); }}
            className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
