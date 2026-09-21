import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Rss, Compass, Code2, Users, Trophy, MessageSquare, 
  Bell, Bookmark, User, PlusCircle 
} from 'lucide-react';

export const Sidebar = ({ isOpen, onClose, openCreatePostModal, openCreateProjectModal }) => {
  const { user } = useAuth();

  if (!user) return null;

  const navItems = [
    { label: 'Home', icon: Rss, path: '/feed' },
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
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside className={`
        fixed bottom-0 top-16 z-40 w-64 border-r border-slate-200/80 bg-white/85 backdrop-blur-xl px-4 py-6 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 shadow-lg
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Quick Action Button */}
        <div className="mb-6">
          <button
            onClick={() => { openCreatePostModal && openCreatePostModal(); onClose && onClose(); }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:opacity-95 transition-all"
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
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold shadow-md shadow-indigo-600/20'
                    : 'text-slate-700 hover:bg-slate-100/80 hover:text-indigo-600'}
                `}
              >
                <Icon className={`h-4 w-4 ${item.path === window.location.pathname ? 'text-white' : 'text-indigo-500'}`} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User Mini Card at bottom */}
        <NavLink
          to={`/profile/${user.username}`}
          onClick={onClose}
          className="absolute bottom-6 left-4 right-4 rounded-2xl border border-slate-200/80 bg-white/90 backdrop-blur-md p-3 hover:border-cyan-400 transition-colors block shadow-xs"
        >
          <div className="flex items-center gap-3">
            <img src={user.avatarUrl} alt="" className="h-9 w-9 rounded-full object-cover ring-2 ring-indigo-500/20" />
            <div className="flex-1 truncate">
              <p className="text-xs font-bold text-slate-900 truncate">{user.fullName}</p>
              <p className="text-[11px] font-semibold text-slate-500 truncate">@{user.username}</p>
            </div>
          </div>
        </NavLink>
      </aside>
    </>
  );
};
