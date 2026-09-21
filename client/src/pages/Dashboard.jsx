import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, Code2, Users, Trophy, 
  Sparkles, Award, ArrowUpRight, TrendingUp 
} from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      api.getMe()
        .then(res => setStats(res))
        .catch(err => console.error('Dashboard load error:', err))
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (loading) {
    return <div className="py-12 text-center text-slate-400">Loading Developer Dashboard...</div>;
  }

  const counts = stats?._count || { projects: 0, followers: 0, following: 0, teamMemberships: 0 };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
          <LayoutDashboard className="h-6 w-6 text-emerald-400" /> Developer Analytics Dashboard
        </h1>
        <p className="text-xs text-slate-400 mt-1">Overview of your software portfolio, team collaborations, and developer network activity</p>
      </div>

      {/* Main Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="glass-card rounded-2xl border border-slate-800 bg-slate-900/60 p-5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Projects Built</span>
            <div className="h-8 w-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Code2 className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white font-mono">{counts.projects || 0}</p>
          <p className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> Published on Showcase
          </p>
        </div>

        <div className="glass-card rounded-2xl border border-slate-800 bg-slate-900/60 p-5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Followers</span>
            <div className="h-8 w-8 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white font-mono">{counts.followers || 0}</p>
          <p className="text-[11px] text-slate-400 mt-2">Network Reach</p>
        </div>

        <div className="glass-card rounded-2xl border border-slate-800 bg-slate-900/60 p-5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Teams Joined</span>
            <div className="h-8 w-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white font-mono">{counts.teamMemberships || 0}</p>
          <p className="text-[11px] text-amber-400 mt-2 flex items-center gap-1">
            <Trophy className="h-3 w-3" /> Active Collaborations
          </p>
        </div>

        <div className="glass-card rounded-2xl border border-slate-800 bg-slate-900/60 p-5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tech Stack Skills</span>
            <div className="h-8 w-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white font-mono">{stats?.skills?.length || 0}</p>
          <p className="text-[11px] text-slate-400 mt-2">Verified Badges</p>
        </div>

      </div>

      {/* Skills Matrix & Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="glass-card rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <h3 className="text-sm font-bold text-white mb-4">Core Developer Skills</h3>
          <div className="flex flex-wrap gap-2">
            {(stats?.skills || []).map((s, idx) => (
              <span key={idx} className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-xs font-mono font-semibold text-indigo-300">
                {s.skillName}
              </span>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-3">
          <h3 className="text-sm font-bold text-white mb-4">Quick Developer Actions</h3>
          <Link
            to="/projects"
            className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-950/60 text-xs font-semibold text-slate-200 hover:border-indigo-500/50 transition-colors"
          >
            <span>Explore Projects Showcase</span>
            <ArrowUpRight className="h-4 w-4 text-indigo-400" />
          </Link>
          <Link
            to="/teammates"
            className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-950/60 text-xs font-semibold text-slate-200 hover:border-indigo-500/50 transition-colors"
          >
            <span>Search Teammates by Tech Stack</span>
            <ArrowUpRight className="h-4 w-4 text-indigo-400" />
          </Link>
          <Link
            to="/hackathons"
            className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-950/60 text-xs font-semibold text-slate-200 hover:border-indigo-500/50 transition-colors"
          >
            <span>Browse Active Hackathons</span>
            <ArrowUpRight className="h-4 w-4 text-amber-400" />
          </Link>
        </div>

      </div>
    </div>
  );
};
