import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { use3DTilt } from './use3DTilt';
import { Users, Trophy, UserPlus, Check, ArrowRight } from 'lucide-react';

export const TeamCard = ({ team, onRequestSent }) => {
  const { user } = useAuth();
  const tilt = use3DTilt({ maxTilt: 6, scale: 1.01 });
  const [requested, setRequested] = useState(team.userRequestStatus === 'PENDING');
  const [loading, setLoading] = useState(false);
  const [requestMsg, setRequestMsg] = useState('');
  const [showMsgInput, setShowMsgInput] = useState(false);

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      await api.requestJoinTeam(team.id, requestMsg);
      setRequested(true);
      setShowMsgInput(false);
      if (onRequestSent) onRequestSent();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
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
        {/* Header Tags */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase ${
            team.status === 'RECRUITING' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-500/20 text-slate-300 border border-slate-500/40'
          }`}>
            {team.status}
          </span>

          <span className="flex items-center gap-1 text-xs font-semibold text-slate-400">
            <Users className="h-3.5 w-3.5 text-purple-400" />
            {team.members?.length || 1} / {team.maxMembers} Members
          </span>
        </div>

        {/* Name & Description */}
        <Link to={`/teams/${team.id}`} className="group">
          <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors mb-1">
            {team.name}
          </h3>
        </Link>
        <p className="text-xs text-slate-300 line-clamp-2 mb-4 leading-relaxed font-normal">
          {team.description}
        </p>

        {/* Hackathon / Project Context */}
        {team.hackathon && (
          <div className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-lg">
            <Trophy className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <span className="truncate">For: {team.hackathon.name}</span>
          </div>
        )}

        {/* Leader Info */}
        <div className="mb-4 flex items-center gap-2">
          <img src={team.leader?.avatarUrl} alt="" className="h-6 w-6 rounded-full object-cover ring-1 ring-purple-500/30" />
          <span className="text-xs text-slate-400">
            Leader: <span className="font-semibold text-white">{team.leader?.fullName}</span>
          </span>
        </div>

        {/* Required Skills */}
        <div className="mb-4">
          <p className="text-[10px] font-bold text-purple-300 uppercase tracking-wider mb-1">Required Skills</p>
          <div className="flex flex-wrap gap-1.5">
            {(team.requiredSkillsList || []).map((skill, idx) => (
              <span key={idx} className="rounded-md bg-purple-500/10 border border-purple-500/30 px-2 py-0.5 text-[11px] font-mono font-semibold text-purple-300">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div>
        {/* Action Button */}
        {showMsgInput ? (
          <form onSubmit={handleJoin} className="space-y-2 pt-3 border-t border-white/10">
            <input
              type="text"
              placeholder="Short note to team leader (optional)..."
              value={requestMsg}
              onChange={(e) => setRequestMsg(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#121427] p-2 text-xs text-white placeholder-slate-400 focus:border-purple-500 focus:outline-none"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowMsgInput(false)}
                className="flex-1 rounded-xl border border-white/10 py-1.5 text-xs font-semibold text-slate-300 hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-1.5 text-xs font-semibold text-white hover:opacity-95 shadow-md"
              >
                Submit Request
              </button>
            </div>
          </form>
        ) : (
          <div className="flex items-center gap-2 pt-3 border-t border-white/10">
            <Link
              to={`/teams/${team.id}`}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-[#1a1c36] py-2 text-xs font-semibold text-white hover:bg-white/10 transition-colors shadow-sm"
            >
              Team Dashboard <ArrowRight className="h-3.5 w-3.5 text-purple-400" />
            </Link>

            {user && team.leaderId !== user.id && !team.members?.some(m => m.userId === user.id) && (
              requested ? (
                <button disabled className="rounded-xl bg-emerald-500/20 border border-emerald-500/40 px-3 py-2 text-xs font-semibold text-emerald-300 flex items-center gap-1">
                  <Check className="h-3.5 w-3.5" /> Requested
                </button>
              ) : (
                <button
                  onClick={() => setShowMsgInput(true)}
                  disabled={team.status !== 'RECRUITING'}
                  className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-3 py-2 text-xs font-semibold text-white hover:opacity-95 disabled:opacity-50 transition-colors flex items-center gap-1 shadow-md"
                >
                  <UserPlus className="h-3.5 w-3.5" /> Join
                </button>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};
