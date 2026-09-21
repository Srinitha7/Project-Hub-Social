import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { 
  Bell, UserPlus, Heart, MessageSquare, Users, CheckCircle, Check 
} from 'lucide-react';

export const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await api.getNotifications();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (err) {
      console.error('Load notifications error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.markNotificationRead('all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Mark read error:', err);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'FOLLOW': return <UserPlus className="h-4 w-4 text-indigo-400" />;
      case 'LIKE': return <Heart className="h-4 w-4 text-rose-500" />;
      case 'COMMENT': return <MessageSquare className="h-4 w-4 text-emerald-400" />;
      case 'TEAM_REQUEST':
      case 'TEAM_ACCEPT': return <Users className="h-4 w-4 text-amber-400" />;
      default: return <Bell className="h-4 w-4 text-cyan-400" />;
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <Bell className="h-6 w-6 text-indigo-400" /> Notifications Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">Updates on followers, likes, comments, team requests & messages</p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700"
          >
            <Check className="h-3.5 w-3.5 text-emerald-400" /> Mark all read
          </button>
        )}
      </div>

      <div className="glass-card rounded-2xl border border-slate-800 bg-slate-900/60 p-4 divide-y divide-slate-800/60">
        {loading ? (
          <div className="py-8 text-center text-xs text-slate-400">Loading notifications...</div>
        ) : notifications.length > 0 ? (
          notifications.map(n => (
            <div
              key={n.id}
              className={`p-4 flex items-start gap-4 transition-colors ${
                n.isRead ? 'opacity-80' : 'bg-indigo-950/20 rounded-xl'
              }`}
            >
              <div className="rounded-full bg-slate-950 p-2.5 border border-slate-800 shrink-0">
                {getIcon(n.type)}
              </div>

              <div className="flex-1 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-slate-100">{n.title}</h4>
                  <span className="text-[10px] text-slate-400">
                    {new Date(n.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed mb-2">{n.body}</p>

                {n.link && (
                  <Link to={n.link} className="inline-block text-indigo-400 font-semibold hover:underline">
                    View Details →
                  </Link>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 text-center text-xs text-slate-400">
            No notifications yet.
          </div>
        )}
      </div>
    </div>
  );
};
