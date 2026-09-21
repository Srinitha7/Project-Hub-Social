import React from 'react';
import { use3DTilt } from './use3DTilt';
import { Calendar, MapPin, Trophy, Users, Plus } from 'lucide-react';

export const HackathonCard = ({ hackathon, onCreateTeam, onViewTeams }) => {
  const tilt = use3DTilt({ maxTilt: 6, scale: 1.01 });

  const modeColors = {
    ONLINE: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    OFFLINE: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    HYBRID: 'bg-purple-100 text-purple-800 border-purple-300'
  };

  return (
    <div 
      ref={tilt.ref}
      style={tilt.style}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      className="glass-card glass-card-hover tilt-card-3d flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 transition-all shadow-sm"
    >
      <div>
        {/* Banner */}
        <div className="relative mb-4 h-40 overflow-hidden rounded-xl bg-slate-100 border border-slate-200">
          <img src={hackathon.bannerUrl} alt="" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <span className={`absolute left-3 top-3 rounded-full border px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase backdrop-blur-md shadow-xs ${modeColors[hackathon.mode] || modeColors.ONLINE}`}>
            {hackathon.mode}
          </span>
          {hackathon.prizePool && (
            <span className="absolute right-3 top-3 rounded-full bg-amber-500 text-white px-2.5 py-0.5 text-[11px] font-bold backdrop-blur-md flex items-center gap-1 shadow-xs">
              <Trophy className="h-3 w-3" /> {hackathon.prizePool}
            </span>
          )}
        </div>

        {/* Title & Organizer */}
        <h3 className="text-base font-bold text-slate-900 mb-0.5">{hackathon.name}</h3>
        <p className="text-xs text-slate-500 mb-3">Organized by {hackathon.organizer}</p>

        {/* Info Grid */}
        <div className="mb-4 grid grid-cols-2 gap-2 text-xs font-medium text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
            <span className="truncate">{hackathon.date}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">{hackathon.location}</span>
          </div>
        </div>

        <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed font-normal">
          {hackathon.description}
        </p>

        {/* Required Tech Pills */}
        <div className="mb-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Target Technologies</p>
          <div className="flex flex-wrap gap-1.5">
            {(hackathon.technologiesList || []).map((tech, idx) => (
              <span key={idx} className="rounded-md border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[11px] font-mono font-semibold text-indigo-700">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Action Buttons */}
      <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
        <button
          onClick={() => onViewTeams(hackathon)}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
        >
          <Users className="h-3.5 w-3.5 text-indigo-600" /> View Teams ({hackathon.teamsCount || 0})
        </button>

        <button
          onClick={() => onCreateTeam(hackathon)}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors shadow-xs"
        >
          <Plus className="h-3.5 w-3.5" /> Create Team
        </button>
      </div>
    </div>
  );
};
