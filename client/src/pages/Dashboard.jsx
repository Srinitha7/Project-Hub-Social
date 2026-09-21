import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, Code2, Users, Trophy, 
  Sparkles, ArrowUpRight, TrendingUp, Bell, ShieldCheck, ChevronRight
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
    return <div className="py-20 text-center text-purple-300 font-semibold animate-pulse">Loading Cyber Security Developer Dashboard...</div>;
  }

  const counts = stats?._count || { projects: 0, followers: 0, following: 0, teamMemberships: 0 };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 animate-fade-in-up">
      
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            Cyber Analytics Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">"Protecting digital assets is vital. Cybersecurity shields against online threats, ensuring data integrity."</p>
        </div>

        <button className="self-start sm:self-auto rounded-xl bg-[#1A1C36] hover:bg-[#222548] border border-white/10 px-4 py-2 text-xs font-semibold text-white shadow-md transition-all flex items-center gap-2">
          <span>Filter Period</span>
          <ChevronRight className="h-4 w-4 text-purple-400 rotate-90" />
        </button>
      </div>

      {/* 4 Vivid Solid Gradient Stat Cards (Exact match to sample image) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Deep Indigo/Purple Gradient */}
        <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-5 text-white shadow-xl shadow-indigo-600/20 relative overflow-hidden group hover:scale-102 transition-transform">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Code2 className="h-4 w-4 text-white" />
              </div>
              <span className="text-xs font-bold tracking-wide text-white/90">Projects Built</span>
            </div>
            <span className="text-xs font-bold text-white/70">•••</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-extrabold font-mono tracking-tight">{counts.projects || 0}</p>
              <p className="text-[11px] text-indigo-200 mt-1">of 38 total showcases</p>
            </div>
            <div className="h-10 w-10 rounded-full border-2 border-white/30 flex items-center justify-center text-[10px] font-bold bg-white/10">
              80%
            </div>
          </div>
        </div>

        {/* Card 2: Sky/Cyan Blue Gradient */}
        <div className="rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 p-5 text-white shadow-xl shadow-sky-500/20 relative overflow-hidden group hover:scale-102 transition-transform">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Users className="h-4 w-4 text-white" />
              </div>
              <span className="text-xs font-bold tracking-wide text-white/90">Network Reach</span>
            </div>
            <span className="text-xs font-bold text-white/70">•••</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-extrabold font-mono tracking-tight">{counts.followers || 0}</p>
              <p className="text-[11px] text-sky-100 mt-1">of 26 total connections</p>
            </div>
            <div className="h-10 w-10 rounded-full border-2 border-white/30 flex items-center justify-center text-[10px] font-bold bg-white/10">
              32%
            </div>
          </div>
        </div>

        {/* Card 3: Deep Violet/Fuchsia Gradient */}
        <div className="rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 p-5 text-white shadow-xl shadow-purple-600/20 relative overflow-hidden group hover:scale-102 transition-transform">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Trophy className="h-4 w-4 text-white" />
              </div>
              <span className="text-xs font-bold tracking-wide text-white/90">Active Teams</span>
            </div>
            <span className="text-xs font-bold text-white/70">•••</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-extrabold font-mono tracking-tight">{counts.teamMemberships || 0}</p>
              <p className="text-[11px] text-purple-200 mt-1">of 09 total hackathons</p>
            </div>
            <div className="h-10 w-10 rounded-full border-2 border-white/30 flex items-center justify-center text-[10px] font-bold bg-white/10">
              60%
            </div>
          </div>
        </div>

        {/* Card 4: Fuchsia/Pink Gradient */}
        <div className="rounded-2xl bg-gradient-to-r from-fuchsia-500 to-pink-600 p-5 text-white shadow-xl shadow-pink-500/20 relative overflow-hidden group hover:scale-102 transition-transform">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-xs font-bold tracking-wide text-white/90">Skill Badges</span>
            </div>
            <span className="text-xs font-bold text-white/70">•••</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-extrabold font-mono tracking-tight">{stats?.skills?.length || 0}</p>
              <p className="text-[11px] text-pink-100 mt-1">of 12 total verified</p>
            </div>
            <div className="h-10 w-10 rounded-full border-2 border-white/30 flex items-center justify-center text-[10px] font-bold bg-white/10">
              10%
            </div>
          </div>
        </div>

      </div>

      {/* Main Analytics Graph & Side Settings Panel (Exact layout from sample image) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Sine Wave Chart Panel */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 relative overflow-hidden border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-white">Developer Activity & Network Pulse</h3>
              <p className="text-xs text-slate-400 mt-0.5">Monthly commits, project views & engagement metrics</p>
            </div>
            <button className="rounded-xl bg-[#1D1F3B] hover:bg-[#25284B] border border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-300">
              Investigate
            </button>
          </div>

          {/* Glowing Wave Graph Visual (Matching Sample Image Wave Chart) */}
          <div className="relative h-64 w-full flex flex-col justify-end">
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-indigo-900/90 border border-purple-500/40 px-3 py-1 rounded-xl text-center shadow-lg shadow-purple-500/20 z-10">
              <span className="text-xs font-bold text-white">$3,900</span>
              <p className="text-[10px] text-purple-300">July Peak</p>
            </div>

            <svg className="w-full h-48 overflow-visible" viewBox="0 0 500 150" preserveAspectRatio="none">
              <defs>
                <linearGradient id="waveGradient1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.6"/>
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0"/>
                </linearGradient>
                <linearGradient id="waveGradient2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.5"/>
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0"/>
                </linearGradient>
              </defs>

              {/* Wave 1 */}
              <path 
                d="M 0,110 C 60,30 120,130 180,90 C 240,40 300,120 360,60 C 420,10 480,100 500,80 L 500,150 L 0,150 Z" 
                fill="url(#waveGradient1)" 
              />
              <path 
                d="M 0,110 C 60,30 120,130 180,90 C 240,40 300,120 360,60 C 420,10 480,100 500,80" 
                fill="none" 
                stroke="#a855f7" 
                strokeWidth="3" 
              />

              {/* Wave 2 */}
              <path 
                d="M 0,90 C 80,140 160,40 240,100 C 320,130 400,30 500,70 L 500,150 L 0,150 Z" 
                fill="url(#waveGradient2)" 
              />
              <path 
                d="M 0,90 C 80,140 160,40 240,100 C 320,130 400,30 500,70" 
                fill="none" 
                stroke="#38bdf8" 
                strokeWidth="2.5" 
                strokeDasharray="4 2"
              />
            </svg>

            {/* X-Axis Months */}
            <div className="flex justify-between pt-4 text-[11px] font-semibold text-slate-400 border-t border-white/10">
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
              <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Environment Settings / Security Actions */}
        <div className="glass-card rounded-2xl p-6 border border-white/10 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-base font-bold text-white">Environment Settings</h3>
            <span className="text-slate-400 text-xs font-bold">•••</span>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl bg-[#1A1C36] p-3.5 border border-white/5 hover:border-purple-500/30 transition-all group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                    <Bell className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">Email notifications</h4>
                    <p className="text-[11px] text-slate-400">Activate alerts for risky events</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-white" />
              </div>
            </div>

            <div className="rounded-xl bg-[#1A1C36] p-3.5 border border-white/5 hover:border-purple-500/30 transition-all group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">Devices with issues</h4>
                    <p className="text-[11px] text-slate-400">Maintain full visibility of users</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-white" />
              </div>
            </div>

            <div className="rounded-xl bg-[#1A1C36] p-3.5 border border-white/5 hover:border-purple-500/30 transition-all group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">Security Investigations</h4>
                    <p className="text-[11px] text-slate-400">Analyze specific types of events</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-white" />
              </div>
            </div>
          </div>

          <button className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-500/25 hover:opacity-95 transition-all">
            View All Security Protocols
          </button>
        </div>

      </div>

      {/* Bottom Row: Skills & Quick Developer Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6 border border-white/10">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-400" /> Verified Developer Tech Stack
          </h3>
          <div className="flex flex-wrap gap-2">
            {(stats?.skills || []).map((s, idx) => (
              <span key={idx} className="rounded-xl border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 text-xs font-mono font-semibold text-purple-300">
                {s.skillName}
              </span>
            ))}
            {!stats?.skills?.length && (
              <p className="text-xs text-slate-400">Add skills to your profile to showcase your tech stack.</p>
            )}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-3">
          <h3 className="text-sm font-bold text-white mb-4">Quick Developer Actions</h3>
          <Link
            to="/projects"
            className="flex items-center justify-between p-3.5 rounded-xl bg-[#1A1C36] border border-white/5 text-xs font-semibold text-slate-200 hover:border-purple-500/50 hover:bg-[#222548] transition-all"
          >
            <span>Explore Projects Showcase</span>
            <ArrowUpRight className="h-4 w-4 text-cyan-400" />
          </Link>
          <Link
            to="/teammates"
            className="flex items-center justify-between p-3.5 rounded-xl bg-[#1A1C36] border border-white/5 text-xs font-semibold text-slate-200 hover:border-purple-500/50 hover:bg-[#222548] transition-all"
          >
            <span>Search Teammates by Tech Stack</span>
            <ArrowUpRight className="h-4 w-4 text-purple-400" />
          </Link>
          <Link
            to="/hackathons"
            className="flex items-center justify-between p-3.5 rounded-xl bg-[#1A1C36] border border-white/5 text-xs font-semibold text-slate-200 hover:border-purple-500/50 hover:bg-[#222548] transition-all"
          >
            <span>Browse Active Hackathons</span>
            <ArrowUpRight className="h-4 w-4 text-amber-400" />
          </Link>
        </div>
      </div>

    </div>
  );
};
