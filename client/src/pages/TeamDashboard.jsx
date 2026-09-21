import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Users, Trophy, CheckCircle, Clock, Plus, ArrowLeft, 
  Check, X, MessageSquare, ShieldCheck, ListTodo 
} from 'lucide-react';

export const TeamDashboard = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showTaskInput, setShowTaskInput] = useState(false);
  const [acceptRoleMap, setAcceptRoleMap] = useState({});

  useEffect(() => {
    loadTeamDetails();
  }, [id]);

  const loadTeamDetails = async () => {
    setLoading(true);
    try {
      const data = await api.getTeamById(id);
      setTeam(data);
    } catch (err) {
      console.error('Load team error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskCreate = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const task = await api.createTeamTask(id, newTaskTitle.trim());
      setTeam(prev => ({
        ...prev,
        tasks: [task, ...(prev.tasks || [])]
      }));
      setNewTaskTitle('');
      setShowTaskInput(false);
    } catch (err) {
      alert(err.message || 'Failed to add task');
    }
  };

  const handleTaskStatusChange = async (taskId, newStatus) => {
    try {
      await api.updateTeamTaskStatus(taskId, newStatus);
      setTeam(prev => ({
        ...prev,
        tasks: prev.tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t)
      }));
    } catch (err) {
      console.error('Update task status error:', err);
    }
  };

  const handleJoinRequestDecision = async (requestId, action) => {
    try {
      const role = acceptRoleMap[requestId] || 'Developer';
      await api.handleJoinRequest(id, requestId, action, role);
      loadTeamDetails();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return <div className="py-12 text-center text-slate-400">Loading Team Dashboard...</div>;
  }

  if (!team) {
    return <div className="py-12 text-center text-slate-400">Team not found.</div>;
  }

  const tasksTodo = (team.tasks || []).filter(t => t.status === 'TODO');
  const tasksInProgress = (team.tasks || []).filter(t => t.status === 'IN_PROGRESS');
  const tasksDone = (team.tasks || []).filter(t => t.status === 'DONE');
  const pendingRequests = (team.requests || []).filter(r => r.status === 'PENDING');

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      <Link to="/teams" className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:underline">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Teams Directory
      </Link>

      {/* Header Banner */}
      <div className="glass-card rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-mono font-semibold uppercase">
                {team.status}
              </span>
              {team.hackathon && (
                <span className="rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 text-xs font-semibold flex items-center gap-1">
                  <Trophy className="h-3 w-3" /> {team.hackathon.name}
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-white">{team.name}</h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">{team.description}</p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/messages"
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
            >
              <MessageSquare className="h-4 w-4" /> Team Chat
            </Link>
          </div>
        </div>

        {/* Required Skills */}
        <div className="pt-3 border-t border-slate-800/80">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Required Skills</p>
          <div className="flex flex-wrap gap-1.5">
            {(team.requiredSkillsList || []).map((s, idx) => (
              <span key={idx} className="rounded-md bg-slate-800 border border-slate-700/60 px-2 py-0.5 text-xs font-mono text-indigo-300">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Roster & Pending Join Requests */}
        <div className="space-y-6">
          
          {/* Member Roster */}
          <div className="glass-card rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Users className="h-4 w-4 text-indigo-400" /> Member Roster
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {team.members?.length || 0} / {team.maxMembers}
              </span>
            </h3>

            <div className="space-y-3">
              {(team.members || []).map(m => (
                <div key={m.id} className="flex items-center justify-between gap-3 p-2.5 rounded-xl border border-slate-800 bg-slate-950/60">
                  <div className="flex items-center gap-2.5 truncate">
                    <img src={m.user?.avatarUrl} alt="" className="h-8 w-8 rounded-full object-cover shrink-0" />
                    <div className="truncate">
                      <p className="text-xs font-semibold text-slate-200 truncate">{m.user?.fullName}</p>
                      <p className="text-[10px] text-indigo-400 font-mono">{m.role}</p>
                    </div>
                  </div>

                  {m.userId === team.leaderId && (
                    <span className="rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 text-[10px] font-semibold">
                      Leader
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Pending Requests Drawer (Visible to Leader) */}
          {team.isLeader && (
            <div className="glass-card rounded-2xl border border-indigo-500/30 bg-indigo-950/20 p-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-300 mb-3 flex items-center justify-between">
                <span>Join Requests</span>
                <span className="rounded-full bg-indigo-500 text-white px-2 py-0.5 text-[10px]">
                  {pendingRequests.length}
                </span>
              </h3>

              {pendingRequests.length > 0 ? (
                <div className="space-y-3">
                  {pendingRequests.map(req => (
                    <div key={req.id} className="rounded-xl border border-slate-800 bg-slate-900 p-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <img src={req.user?.avatarUrl} alt="" className="h-7 w-7 rounded-full object-cover" />
                        <div>
                          <p className="text-xs font-semibold text-slate-200">{req.user?.fullName}</p>
                          <p className="text-[10px] text-slate-400">@{req.user?.username} • {req.user?.college}</p>
                        </div>
                      </div>
                      {req.message && <p className="text-xs text-slate-300 bg-slate-950 p-2 rounded-lg italic">"{req.message}"</p>}

                      <div className="flex gap-2 pt-1">
                        <input
                          type="text"
                          placeholder="Assign role..."
                          value={acceptRoleMap[req.id] || ''}
                          onChange={(e) => setAcceptRoleMap({ ...acceptRoleMap, [req.id]: e.target.value })}
                          className="flex-1 rounded-lg border border-slate-800 bg-slate-950 px-2 py-1 text-[11px] text-slate-200"
                        />
                        <button
                          onClick={() => handleJoinRequestDecision(req.id, 'ACCEPT')}
                          className="rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-emerald-500"
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleJoinRequestDecision(req.id, 'REJECT')}
                          className="rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1 text-xs font-semibold text-rose-400 hover:bg-slate-800"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 text-center py-4">No pending join requests.</p>
              )}
            </div>
          )}

        </div>

        {/* Right 2 Cols: Task Management Kanban Board */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ListTodo className="h-5 w-5 text-indigo-400" /> Team Project Kanban
            </h3>
            <button
              onClick={() => setShowTaskInput(prev => !prev)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" /> Add Task
            </button>
          </div>

          {showTaskInput && (
            <form onSubmit={handleTaskCreate} className="flex gap-2 p-3 rounded-xl border border-indigo-500/30 bg-indigo-950/30">
              <input
                type="text"
                placeholder="Task title (e.g. Implement WebSocket event schema)..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="flex-1 rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
              />
              <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500">
                Add
              </button>
            </form>
          )}

          {/* Kanban Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* TODO Column */}
            <div className="glass-card rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
                <span>To Do</span>
                <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300 font-mono">{tasksTodo.length}</span>
              </h4>
              <div className="space-y-2">
                {tasksTodo.map(t => (
                  <div key={t.id} className="p-3 rounded-xl border border-slate-800 bg-slate-950/80 space-y-2">
                    <p className="text-xs text-slate-200 font-medium">{t.title}</p>
                    <button
                      onClick={() => handleTaskStatusChange(t.id, 'IN_PROGRESS')}
                      className="w-full text-center rounded-lg bg-slate-800 hover:bg-indigo-600 py-1 text-[10px] font-semibold text-slate-300 hover:text-white transition-colors"
                    >
                      Start Task →
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* IN_PROGRESS Column */}
            <div className="glass-card rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center justify-between">
                <span>In Progress</span>
                <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-400 font-mono">{tasksInProgress.length}</span>
              </h4>
              <div className="space-y-2">
                {tasksInProgress.map(t => (
                  <div key={t.id} className="p-3 rounded-xl border border-amber-500/20 bg-slate-950/80 space-y-2">
                    <p className="text-xs text-slate-200 font-medium">{t.title}</p>
                    <button
                      onClick={() => handleTaskStatusChange(t.id, 'DONE')}
                      className="w-full text-center rounded-lg bg-emerald-600 hover:bg-emerald-500 py-1 text-[10px] font-semibold text-white transition-colors"
                    >
                      Mark Complete ✓
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* DONE Column */}
            <div className="glass-card rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center justify-between">
                <span>Completed</span>
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-400 font-mono">{tasksDone.length}</span>
              </h4>
              <div className="space-y-2">
                {tasksDone.map(t => (
                  <div key={t.id} className="p-3 rounded-xl border border-emerald-500/20 bg-slate-950/80">
                    <p className="text-xs text-slate-400 line-through font-medium">{t.title}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
