import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { use3DTilt } from './use3DTilt';
import { MessageSquare, Plus, GraduationCap } from 'lucide-react';

export const DeveloperCard = ({ developer, onInviteToTeam }) => {
  const navigate = useNavigate();
  const tilt = use3DTilt({ maxTilt: 6, scale: 1.01 });

  const expColors = {
    Beginner: 'bg-slate-100 text-slate-700 border-slate-300',
    Intermediate: 'bg-cyan-100 text-cyan-800 border-cyan-300',
    Advanced: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    Expert: 'bg-purple-100 text-purple-800 border-purple-300'
  };

  return (
    <div 
      ref={tilt.ref}
      style={tilt.style}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      className="glass-card glass-card-hover tilt-card-3d flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 transition-all shadow-sm"
    >
      <div>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <Link to={`/profile/${developer.username}`} className="flex items-center gap-3 group">
            <img src={developer.avatarUrl} alt="" className="h-12 w-12 rounded-full object-cover ring-2 ring-indigo-500/20 group-hover:ring-indigo-500/60 transition-all" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                {developer.fullName}
              </h3>
              <p className="text-xs text-slate-500">@{developer.username}</p>
            </div>
          </Link>

          <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase shadow-xs ${expColors[developer.experience] || expColors.Intermediate}`}>
            {developer.experience || 'Developer'}
          </span>
        </div>

        {/* College & Bio */}
        {developer.college && (
          <div className="mb-2 flex items-center gap-1.5 text-xs text-slate-600">
            <GraduationCap className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
            <span className="truncate">{developer.college}</span>
          </div>
        )}

        <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed font-normal">
          {developer.bio || 'Passionate developer building innovative open-source projects.'}
        </p>

        {/* Skills */}
        <div className="mb-4">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Skills</p>
          <div className="flex flex-wrap gap-1.5">
            {(developer.skills || []).slice(0, 5).map((s, idx) => (
              <span
                key={idx}
                className="rounded-md border border-indigo-200 bg-indigo-50/80 px-2 py-0.5 text-[11px] font-mono font-semibold text-indigo-700"
              >
                {s.skillName || s}
              </span>
            ))}
            {(developer.skills || []).length > 5 && (
              <span className="text-[11px] text-slate-500 self-center">+{developer.skills.length - 5} more</span>
            )}
          </div>
        </div>

        {/* Top Projects Preview */}
        {developer.projects && developer.projects.length > 0 && (
          <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-2.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Featured Project</p>
            <p className="text-xs font-semibold text-slate-800 truncate">{developer.projects[0].title}</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
        <button
          onClick={() => navigate(`/messages`)}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
        >
          <MessageSquare className="h-3.5 w-3.5 text-indigo-600" /> Connect
        </button>

        {onInviteToTeam && (
          <button
            onClick={() => onInviteToTeam(developer)}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" /> Invite to Team
          </button>
        )}
      </div>
    </div>
  );
};
