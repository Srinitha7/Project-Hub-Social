import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { ProjectCard } from '../components/ProjectCard';
import { DeveloperCard } from '../components/DeveloperCard';
import { HackathonCard } from '../components/HackathonCard';
import Developer3DCube from '../components/Developer3DCube';
import { 
  Compass, Flame, Users, Trophy, Code2, Sparkles, 
  ArrowRight, Search, Zap 
} from 'lucide-react';

export const Explore = () => {
  const [projects, setProjects] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTech, setActiveTech] = useState('ALL');

  const popularTechs = ['ALL', 'React', 'Python', 'AI/ML', 'Node.js', 'Rust', 'Cybersecurity', 'Blockchain', 'Cloud'];

  useEffect(() => {
    loadExploreData();
  }, [activeTech]);

  const loadExploreData = async () => {
    setLoading(true);
    try {
      const projParams = activeTech !== 'ALL' ? `tech=${activeTech}` : '';
      const [projData, devData, hackData] = await Promise.all([
        api.getProjects(projParams),
        api.findTeammates(''),
        api.getHackathons()
      ]);

      setProjects(projData.slice(0, 6));
      setDevelopers(devData.slice(0, 4));
      setHackathons(hackData.slice(0, 2));
    } catch (err) {
      console.error('Explore load error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 space-y-10 animate-fade-in-up">
      
      {/* Hero Banner with 3D Canvas */}
      <div className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-r from-indigo-50 via-violet-50 to-white p-6 sm:p-10 shadow-lg grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        <div className="relative z-10 lg:col-span-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/80 px-3.5 py-1 text-xs font-mono font-semibold text-indigo-700 shadow-sm mb-4">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" /> Explore Developer Ecosystem
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-3">
            Discover Trending Tech, Developers & Squads
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
            Find inspiration from completed open-source projects, connect with high-impact developers, and discover upcoming hackathon opportunities.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/teammates"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4.5 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-all shadow-md shadow-indigo-600/30"
            >
              <Users className="h-4 w-4" /> Find Teammates
            </Link>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
            >
              <Code2 className="h-4 w-4" /> Browse Showcase
            </Link>
          </div>
        </div>

        <div className="hidden lg:flex items-center justify-center">
          <Developer3DCube height="260px" />
        </div>
      </div>

      {/* Filter Pills */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-500" /> Filter by Popular Stack
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {popularTechs.map(tech => (
            <button
              key={tech}
              onClick={() => setActiveTech(tech)}
              className={`rounded-xl px-4 py-2 text-xs font-mono font-semibold transition-all ${
                activeTech === tech
                  ? 'bg-indigo-600 text-white border border-indigo-500 shadow-md shadow-indigo-600/20'
                  : 'border border-slate-200 bg-white text-slate-700 hover:border-indigo-300 shadow-sm'
              }`}
            >
              {tech}
            </button>
          ))}
        </div>
      </div>

      {/* Trending Projects Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Flame className="h-5 w-5 text-rose-500" /> Trending Projects Showcase
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Top-voted software built by developers across universities</p>
          </div>
          <Link to="/projects" className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1">
            View All <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse rounded-2xl border border-slate-200 bg-white h-72" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(p => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}
      </section>

      {/* Popular Developers Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Users className="h-5 w-5 text-indigo-600" /> Recommended Developers & Teammates
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Connect with talented engineers with verified skill badges</p>
          </div>
          <Link to="/teammates" className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1">
            Find Teammates <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {developers.map(dev => (
            <DeveloperCard key={dev.id} developer={dev} />
          ))}
        </div>
      </section>

      {/* Featured Hackathons Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" /> Featured Hackathons
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Join upcoming competitions and build winning software</p>
          </div>
          <Link to="/hackathons" className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1">
            Explore All Hackathons <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {hackathons.map(h => (
            <HackathonCard
              key={h.id}
              hackathon={h}
              onViewTeams={() => {}}
              onCreateTeam={() => {}}
            />
          ))}
        </div>
      </section>

    </div>
  );
};
