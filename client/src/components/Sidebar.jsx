import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Rss, Compass, Code2, Users, Trophy, MessageSquare, 
  Bell, Bookmark, User, PlusCircle, Sparkles
} from 'lucide-react';

export const Sidebar = ({ isOpen, onClose, openCreatePostModal, openCreateProjectModal }) => {
  const { user } = useAuth();

  if (!user) return null;

  const navItems = [
    { label: 'Dashboard', icon: Rss, path: '/feed' },
    { label: 'Explore', icon: Compass, path: '/explore' },
    { label: 'Projects', icon: Code2, path: '/projects' },
    { label: 'Find Teammates', icon: Users, path: '/teammates' },
    { label: 'Hackathons', icon: Trophy, path: '/hackathons' },
    { label: 'Messages', icon: MessageSquare, path: '/messages' },
    { label: 'Notifications', icon: Bell, path: '/notifications' },
    { label: 'Saved', icon: Bookmark, path: '/saved' },
    { label: 'Profile', icon: User, path: `/profile/${user.username}` },
  ];

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside className={`
        fixed bottom-0 top-16 z-40 w-64 border-r border-white/10 bg-[#121427]/95 backdrop-blur-xl px-4 py-6 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 shadow-2xl shadow-black/40 flex flex-col justify-between
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div>
          {/* Quick Action Button */}
          <div className="mb-6">
            <button
              onClick={() => { openCreatePostModal && openCreatePostModal(); onClose && onClose(); }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-600/30 hover:opacity-95 transition-all"
            >
              <PlusCircle className="h-4 w-4" /> Share Post / Project
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) => `
                    flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all backdrop-blur-md
                    ${isActive
                      ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-600 text-white font-bold shadow-lg shadow-purple-500/25'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'}
                  `}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Go Pro / Developer Pass Promo Box (Matching Reference Sample Bottom Widget) */}
        <div className="mt-6 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-700 p-4 text-white shadow-xl shadow-purple-900/40 relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mt-2 -mr-2 h-16 w-16 rounded-full bg-cyan-400/20 blur-md" />
          <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider mb-1 text-cyan-200">
            <Sparkles className="h-4 w-4 text-amber-300" /> Go Pro
          </div>
          <p className="text-[11px] text-purple-100 mb-3 leading-tight">Stay connected with your developer team & match hackathons</p>
          <button className="w-full rounded-xl bg-white/20 hover:bg-white/30 border border-white/20 py-1.5 text-xs font-bold text-white transition-all">
            Upgrade Now
          </button>
        </div>
      </aside>
    </>
  );
};
