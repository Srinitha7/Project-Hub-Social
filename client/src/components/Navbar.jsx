import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  Terminal, Search, Bell, User, LogOut, LayoutDashboard, 
  Menu, Code2, Users, Trophy
} from 'lucide-react';

export const Navbar = ({ toggleMobileSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    if (user) {
      api.getNotifications()
        .then(res => setUnreadCount(res.unreadCount || 0))
        .catch(err => console.warn('Notifications fetch error:', err));
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = async (e) => {
    const val = e.target.value;
    setSearchQuery(val);

    if (val.trim().length > 1) {
      try {
        const res = await api.globalSearch(val);
        setSearchResults(res);
        setShowSearchDropdown(true);
      } catch (err) {
        console.error('Search error:', err);
      }
    } else {
      setShowSearchDropdown(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-xl shadow-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left: Mobile menu button & Brand logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleMobileSidebar}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link to={user ? "/feed" : "/"} className="flex items-center gap-2 font-mono text-lg font-bold tracking-tight text-slate-900 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 text-white shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Terminal className="h-5 w-5" />
            </div>
            <span className="hidden sm:inline-block text-slate-900 font-extrabold">
              ProjectHub <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent font-bold">Social</span>
            </span>
          </Link>
        </div>

        {/* Center: Global Search input with dropdown */}
        {user && (
          <div className="relative max-w-md flex-1 px-4" ref={searchRef}>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-indigo-500" />
              <input
                type="text"
                placeholder="Search developers, projects, hackathons..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => searchQuery.length > 1 && setShowSearchDropdown(true)}
                className="w-full rounded-full border border-slate-200 bg-white/90 py-1.5 pl-10 pr-4 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all shadow-xs"
              />
            </div>

            {/* Search Dropdown */}
            {showSearchDropdown && searchResults && (
              <div className="absolute left-4 right-4 top-11 max-h-96 overflow-y-auto rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-2xl backdrop-blur-xl z-50">
                {searchResults.users?.length > 0 && (
                  <div className="mb-3">
                    <h4 className="mb-2 px-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <Users className="h-3 w-3 text-indigo-600" /> Developers
                    </h4>
                    {searchResults.users.map(u => (
                      <Link
                        key={u.id}
                        to={`/profile/${u.username}`}
                        onClick={() => setShowSearchDropdown(false)}
                        className="flex items-center gap-3 rounded-xl p-2 hover:bg-slate-50 transition-colors"
                      >
                        <img src={u.avatarUrl} alt="" className="h-7 w-7 rounded-full object-cover" />
                        <div className="truncate">
                          <p className="text-xs font-bold text-slate-900">{u.fullName}</p>
                          <p className="text-[11px] text-slate-500">@{u.username} • {u.college || 'Developer'}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {searchResults.projects?.length > 0 && (
                  <div className="mb-3">
                    <h4 className="mb-2 px-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <Code2 className="h-3 w-3 text-emerald-600" /> Projects
                    </h4>
                    {searchResults.projects.map(p => (
                      <Link
                        key={p.id}
                        to={`/projects/${p.id}`}
                        onClick={() => setShowSearchDropdown(false)}
                        className="block rounded-xl p-2 hover:bg-slate-50 transition-colors"
                      >
                        <p className="text-xs font-bold text-slate-900 truncate">{p.title}</p>
                        <p className="text-[11px] text-slate-500 truncate">{p.description}</p>
                      </Link>
                    ))}
                  </div>
                )}

                {searchResults.hackathons?.length > 0 && (
                  <div className="mb-2">
                    <h4 className="mb-2 px-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <Trophy className="h-3 w-3 text-amber-500" /> Hackathons
                    </h4>
                    {searchResults.hackathons.map(h => (
                      <Link
                        key={h.id}
                        to={`/hackathons`}
                        onClick={() => setShowSearchDropdown(false)}
                        className="block rounded-xl p-2 hover:bg-slate-50 transition-colors"
                      >
                        <p className="text-xs font-bold text-slate-900 truncate">{h.name}</p>
                        <p className="text-[11px] text-slate-500">{h.organizer} • {h.date}</p>
                      </Link>
                    ))}
                  </div>
                )}

                {!searchResults.users?.length && !searchResults.projects?.length && !searchResults.hackathons?.length && (
                  <p className="p-3 text-center text-xs text-slate-500">No results matching "{searchQuery}"</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Right Nav Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {/* Notification Bell */}
              <Link
                to="/notifications"
                className="relative rounded-full p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white shadow-sm">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>

              {/* Profile Avatar Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(prev => !prev)}
                  className="flex items-center gap-2 rounded-full border border-slate-200 p-1 hover:border-cyan-400 transition-colors shadow-xs"
                >
                  <img src={user.avatarUrl} alt="" className="h-7 w-7 rounded-full object-cover" />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 top-10 w-48 rounded-2xl border border-slate-200 bg-white py-1.5 shadow-xl z-50">
                    <div className="border-b border-slate-100 px-3 py-2">
                      <p className="text-xs font-bold text-slate-900">{user.fullName}</p>
                      <p className="text-[11px] text-slate-500 truncate">@{user.username}</p>
                    </div>
                    
                    <Link
                      to={`/profile/${user.username}`}
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <User className="h-4 w-4 text-indigo-600" /> My Profile
                    </Link>

                    <Link
                      to="/dashboard"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4 text-emerald-600" /> Dashboard
                    </Link>

                    <button
                      onClick={() => { setShowProfileMenu(false); logout(); navigate('/login'); }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4" /> Log Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 hover:opacity-95 transition-colors"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
