import React, { useState } from 'react';
import { api } from '../../services/api';
import { X, Users, Trophy } from 'lucide-react';

export const CreateTeamModal = ({ isOpen, onClose, defaultHackathon, onTeamCreated }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('');
  const [maxMembers, setMaxMembers] = useState(4);
  const [leaderRole, setLeaderRole] = useState('Team Leader & Fullstack Dev');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !description.trim() || !requiredSkills.trim()) return;

    setLoading(true);
    try {
      const skillsArray = requiredSkills.split(',').map(s => s.trim()).filter(Boolean);
      const newTeam = await api.createTeam({
        name,
        description,
        requiredSkills: skillsArray,
        maxMembers: parseInt(maxMembers),
        hackathonId: defaultHackathon ? defaultHackathon.id : null,
        leaderRole
      });
      if (onTeamCreated) onTeamCreated(newTeam);
      onClose();
    } catch (err) {
      alert(err.message || 'Failed to create team');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 p-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Users className="h-4 w-4 text-indigo-400" /> Create Hackathon / Project Team
          </h3>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          {defaultHackathon && (
            <div className="flex items-center gap-2 rounded-xl bg-amber-500/10 border border-amber-500/30 p-2.5 text-xs text-amber-300">
              <Trophy className="h-4 w-4 shrink-0" />
              <span>Target Hackathon: <strong>{defaultHackathon.name}</strong></span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Team Name</label>
            <input
              type="text"
              placeholder="e.g. Team DevSync AI"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Team Description & Goal</label>
            <textarea
              rows={3}
              placeholder="What is your team building? What kind of project or challenge are you tackling?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Required Member Skills (comma separated)</label>
            <input
              type="text"
              placeholder="e.g. React, Python, ML Engineer, UI/UX Designer"
              value={requiredSkills}
              onChange={(e) => setRequiredSkills(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Max Team Size</label>
              <input
                type="number"
                min={2}
                max={10}
                value={maxMembers}
                onChange={(e) => setMaxMembers(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Your Role in Team</label>
              <input
                type="text"
                value={leaderRole}
                onChange={(e) => setLeaderRole(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-800 px-4 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Form Team'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
