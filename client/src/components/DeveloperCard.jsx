import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { use3DTilt } from './use3DTilt';
import { MessageSquare, Plus, GraduationCap } from 'lucide-react';

export const DeveloperCard = ({ developer, onInviteToTeam }) => {
  const navigate = useNavigate();
  const tilt = use3DTilt({ maxTilt: 6, scale: 1.01 });

  const expColors = {
    Beginner: 'bg-slate-500/20 text-slate-300 border-slate-500/40',
    Intermediate: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    Advanced: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    Expert: 'bg-purple-500/20 text-purple-300 border-purple-500/40'
  };

  return (
    <div 
      ref={tilt.ref}
      style={tilt.style}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      className="glass-card glass-card-hover tilt-card-3d flex flex-col justify-between rounded-2xl border border-white/10 bg-[#16182e]/90 text-white p-5 transition-all shadow-xl"
    >
      <div>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <Link to={`/profile/${developer.username}`} className="flex items-center gap-3 group">
            <img src={developer.avatarUrl} alt="" className="h-12 w-12 rounded-full object-cover ring-2 ring-purple-500/30 group-hover:ring-purple-400 transition-all" />
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                {developer.fullName}
              </h3>
              <p className="text-xs text-slate-400">@{developer.username}</p>
            </div>
          </Link>

          <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase shadow-sm ${expColors[developer.experience] || expColors.Intermediate}`}>
            {developer.experience || 'Developer'}
          </span>
        </div>

        {/* College & Bio */}
        {developer.college && (
          <div className="mb-2 flex items-center gap-1.5 text-xs text-slate-300">
            <GraduationCap className="h-3.5 w-3.5 text-purple-400 shrink-0" />
            <span className="truncate">{developer.college}</span>
          </div>
        )}

        <p className="text-xs text-slate-300 line-clamp-2 mb-4 leading-relaxed font-normal">
          {developer.bio || 'Passionate developer building innovative open-source projects.'}
        </p>

        {/* Skills */}
        <div className="mb-4">
          <p className="text-[11px] font-bold text-purple-300 uppercase tracking-wider mb-1.5">Skills</p>
          <div className="flex flex-wrap gap-1.5">
            {(developer.skills || []).slice(0, 5).map((s, idx) => (
              <span
                key={idx}
                className="rounded-md border border-purple-500/30 bg-purple-500/10 px-2 py-0.5 text-[11px] font-mono font-semibold text-purple-300"
              >
                {s.skillName || s}
              </span>
            ))}
            {(developer.skills || []).length > 5 && (
              <span className="text-[11px] text-slate-400 self-center">+{developer.skills.length - 5} more</span>
            )}
          </div>
        </div>

        {/* Top Projects Preview */}
        {developer.projects && developer.projects.length > 0 && (
          <div className="mb-4 rounded-xl border border-white/10 bg-[#121427] p-2.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Featured Project</p>
            <p className="text-xs font-semibold text-white truncate">{developer.projects[0].title}</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-3 border-t border-white/10">
        <button
          onClick={() => navigate(`/messages`)}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-[#1a1c36] py-2 text-xs font-semibold text-white hover:bg-white/10 transition-colors shadow-sm"
        >
          <MessageSquare className="h-3.5 w-3.5 text-purple-400" /> Connect
        </button>

        {onInviteToTeam && (
          <button
            onClick={() => onInviteToTeam(developer)}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-2 text-xs font-semibold text-white hover:opacity-95 transition-colors shadow-md"
          >
            <Plus className="h-3.5 w-3.5" /> Invite to Team
          </button>
        )}
      </div>
    </div>
  );
};
