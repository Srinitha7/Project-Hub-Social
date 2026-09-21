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
      className="glass-card glass-card-hover tilt-card-3d flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 transition-all shadow-sm"
    >
      <div>
        {/* Header Tags */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase ${
            team.status === 'RECRUITING' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-100 text-slate-600 border border-slate-200'
          }`}>
            {team.status}
          </span>

          <span className="flex items-center gap-1 text-xs font-semibold text-slate-500">
            <Users className="h-3.5 w-3.5 text-indigo-600" />
            {team.members?.length || 1} / {team.maxMembers} Members
          </span>
        </div>

        {/* Name & Description */}
        <Link to={`/teams/${team.id}`} className="group">
          <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-1">
            {team.name}
          </h3>
        </Link>
        <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed font-normal">
          {team.description}
        </p>

        {/* Hackathon / Project Context */}
        {team.hackathon && (
          <div className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
            <Trophy className="h-3.5 w-3.5 text-amber-600 shrink-0" />
            <span className="truncate">For: {team.hackathon.name}</span>
          </div>
        )}

        {/* Leader Info */}
        <div className="mb-4 flex items-center gap-2">
          <img src={team.leader?.avatarUrl} alt="" className="h-6 w-6 rounded-full object-cover ring-1 ring-slate-200" />
          <span className="text-xs text-slate-600">
            Leader: <span className="font-semibold text-slate-900">{team.leader?.fullName}</span>
          </span>
        </div>

        {/* Required Skills */}
        <div className="mb-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Required Skills</p>
          <div className="flex flex-wrap gap-1.5">
            {(team.requiredSkillsList || []).map((skill, idx) => (
              <span key={idx} className="rounded-md bg-indigo-50 border border-indigo-200 px-2 py-0.5 text-[11px] font-mono font-semibold text-indigo-700">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div>
        {/* Action Button */}
        {showMsgInput ? (
          <form onSubmit={handleJoin} className="space-y-2 pt-3 border-t border-slate-100">
            <input
              type="text"
              placeholder="Short note to team leader (optional)..."
              value={requestMsg}
              onChange={(e) => setRequestMsg(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white p-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowMsgInput(false)}
                className="flex-1 rounded-xl border border-slate-300 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-xl bg-indigo-600 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 shadow-sm"
              >
                Submit Request
              </button>
            </div>
          </form>
        ) : (
          <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
            <Link
              to={`/teams/${team.id}`}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
            >
              Team Dashboard <ArrowRight className="h-3.5 w-3.5 text-indigo-600" />
            </Link>

            {user && team.leaderId !== user.id && !team.members?.some(m => m.userId === user.id) && (
              requested ? (
                <button disabled className="rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-700 flex items-center gap-1">
                  <Check className="h-3.5 w-3.5" /> Requested
                </button>
              ) : (
                <button
                  onClick={() => setShowMsgInput(true)}
                  disabled={team.status !== 'RECRUITING'}
                  className="rounded-xl bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 transition-colors flex items-center gap-1 shadow-xs"
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
