import React from 'react';
import { use3DTilt } from './use3DTilt';
import { Calendar, MapPin, Trophy, Users, Plus } from 'lucide-react';

export const HackathonCard = ({ hackathon, onCreateTeam, onViewTeams }) => {
  const tilt = use3DTilt({ maxTilt: 6, scale: 1.01 });

  const modeColors = {
    ONLINE: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    OFFLINE: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    HYBRID: 'bg-purple-500/20 text-purple-300 border-purple-500/40'
  };

  return (
    <div 
      ref={tilt.ref}
      style={tilt.style}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      className="glass-card glass-card-hover tilt-card-3d flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#16182e]/90 text-white p-5 transition-all shadow-xl"
    >
      <div>
        {/* Banner */}
        <div className="relative mb-4 h-40 overflow-hidden rounded-xl bg-[#121427] border border-white/10">
          <img src={hackathon.bannerUrl} alt="" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <span className={`absolute left-3 top-3 rounded-full border px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase backdrop-blur-md shadow-sm ${modeColors[hackathon.mode] || modeColors.ONLINE}`}>
            {hackathon.mode}
          </span>
          {hackathon.prizePool && (
            <span className="absolute right-3 top-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white px-2.5 py-0.5 text-[11px] font-bold backdrop-blur-md flex items-center gap-1 shadow-md">
              <Trophy className="h-3 w-3" /> {hackathon.prizePool}
            </span>
          )}
        </div>

        {/* Title & Organizer */}
        <h3 className="text-base font-bold text-white mb-0.5">{hackathon.name}</h3>
        <p className="text-xs text-slate-400 mb-3">Organized by {hackathon.organizer}</p>

        {/* Info Grid */}
        <div className="mb-4 grid grid-cols-2 gap-2 text-xs font-medium text-slate-300 bg-[#121427] p-3 rounded-xl border border-white/10">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-purple-400 shrink-0" />
            <span className="truncate">{hackathon.date}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
            <span className="truncate">{hackathon.location}</span>
          </div>
        </div>

        <p className="text-xs text-slate-300 line-clamp-2 mb-4 leading-relaxed font-normal">
          {hackathon.description}
        </p>

        {/* Required Tech Pills */}
        <div className="mb-4">
          <p className="text-[10px] font-bold text-purple-300 uppercase tracking-wider mb-1.5">Target Technologies</p>
          <div className="flex flex-wrap gap-1.5">
            {(hackathon.technologiesList || []).map((tech, idx) => (
              <span key={idx} className="rounded-md border border-purple-500/30 bg-purple-500/10 px-2 py-0.5 text-[11px] font-mono font-semibold text-purple-300">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Action Buttons */}
      <div className="flex items-center gap-2 pt-3 border-t border-white/10">
        <button
          onClick={() => onViewTeams(hackathon)}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-[#1a1c36] py-2 text-xs font-semibold text-white hover:bg-white/10 transition-colors shadow-sm"
        >
          <Users className="h-3.5 w-3.5 text-purple-400" /> View Teams ({hackathon.teamsCount || 0})
        </button>

        <button
          onClick={() => onCreateTeam(hackathon)}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-2 text-xs font-semibold text-white hover:opacity-95 transition-colors shadow-md"
        >
          <Plus className="h-3.5 w-3.5" /> Create Team
        </button>
      </div>
    </div>
  );
};
