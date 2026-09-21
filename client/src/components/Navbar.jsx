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
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#121427]/90 backdrop-blur-xl shadow-xl shadow-black/20">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left: Mobile menu button & Brand logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleMobileSidebar}
            className="rounded-xl p-2 text-slate-300 hover:bg-white/10 hover:text-white lg:hidden transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link to={user ? "/feed" : "/"} className="flex items-center gap-2.5 font-mono text-lg font-bold tracking-tight text-white group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 text-white shadow-lg shadow-purple-500/25 group-hover:scale-105 transition-transform">
              <Terminal className="h-5 w-5" />
            </div>
            <span className="hidden sm:inline-block text-white font-extrabold tracking-wide">
              ProjectHub <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-bold">Social</span>
            </span>
          </Link>
        </div>

        {/* Center: Global Search input with dropdown */}
        {user && (
          <div className="relative max-w-md flex-1 px-4" ref={searchRef}>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-purple-400" />
              <input
                type="text"
                placeholder="Type to search developers, projects, hackathons..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => searchQuery.length > 1 && setShowSearchDropdown(true)}
                className="w-full rounded-full border border-white/10 bg-[#181a34] py-1.5 pl-10 pr-4 text-xs font-semibold text-white placeholder-slate-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/25 transition-all shadow-inner"
              />
            </div>

            {/* Search Dropdown */}
            {showSearchDropdown && searchResults && (
              <div className="absolute left-4 right-4 top-11 max-h-96 overflow-y-auto rounded-2xl border border-white/10 bg-[#16182e]/95 p-3 shadow-2xl backdrop-blur-xl z-50">
                {searchResults.users?.length > 0 && (
                  <div className="mb-3">
                    <h4 className="mb-2 px-2 text-[11px] font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1">
                      <Users className="h-3 w-3 text-purple-400" /> Developers
                    </h4>
                    {searchResults.users.map(u => (
                      <Link
                        key={u.id}
                        to={`/profile/${u.username}`}
                        onClick={() => setShowSearchDropdown(false)}
                        className="flex items-center gap-3 rounded-xl p-2 hover:bg-white/10 transition-colors"
                      >
                        <img src={u.avatarUrl} alt="" className="h-7 w-7 rounded-full object-cover ring-1 ring-purple-500/30" />
                        <div className="truncate">
                          <p className="text-xs font-bold text-white">{u.fullName}</p>
                          <p className="text-[11px] text-slate-400">@{u.username} • {u.college || 'Developer'}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {searchResults.projects?.length > 0 && (
                  <div className="mb-3">
                    <h4 className="mb-2 px-2 text-[11px] font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1">
                      <Code2 className="h-3 w-3 text-cyan-400" /> Projects
                    </h4>
                    {searchResults.projects.map(p => (
                      <Link
                        key={p.id}
                        to={`/projects/${p.id}`}
                        onClick={() => setShowSearchDropdown(false)}
                        className="block rounded-xl p-2 hover:bg-white/10 transition-colors"
                      >
                        <p className="text-xs font-bold text-white truncate">{p.title}</p>
                        <p className="text-[11px] text-slate-400 truncate">{p.description}</p>
                      </Link>
                    ))}
                  </div>
                )}

                {searchResults.hackathons?.length > 0 && (
                  <div className="mb-2">
                    <h4 className="mb-2 px-2 text-[11px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1">
                      <Trophy className="h-3 w-3 text-amber-400" /> Hackathons
                    </h4>
                    {searchResults.hackathons.map(h => (
                      <Link
                        key={h.id}
                        to={`/hackathons`}
                        onClick={() => setShowSearchDropdown(false)}
                        className="block rounded-xl p-2 hover:bg-white/10 transition-colors"
                      >
                        <p className="text-xs font-bold text-white truncate">{h.name}</p>
                        <p className="text-[11px] text-slate-400">{h.organizer} • {h.date}</p>
                      </Link>
                    ))}
                  </div>
                )}

                {!searchResults.users?.length && !searchResults.projects?.length && !searchResults.hackathons?.length && (
                  <p className="p-3 text-center text-xs text-slate-400">No results matching "{searchQuery}"</p>
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
                className="relative rounded-full p-2 text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-purple-500 text-[10px] font-bold text-white shadow-sm shadow-purple-500/50">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>

              {/* Profile Avatar Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(prev => !prev)}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-[#181a34] p-1 hover:border-purple-400/50 transition-colors shadow-sm"
                >
                  <img src={user.avatarUrl} alt="" className="h-7 w-7 rounded-full object-cover" />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 top-10 w-48 rounded-2xl border border-white/10 bg-[#16182e] py-1.5 shadow-2xl backdrop-blur-xl z-50">
                    <div className="border-b border-white/10 px-3 py-2">
                      <p className="text-xs font-bold text-white">{user.fullName}</p>
                      <p className="text-[11px] text-slate-400 truncate">@{user.username}</p>
                    </div>
                    
                    <Link
                      to={`/profile/${user.username}`}
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                    >
                      <User className="h-4 w-4 text-purple-400" /> My Profile
                    </Link>

                    <Link
                      to="/dashboard"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4 text-cyan-400" /> Dashboard
                    </Link>

                    <button
                      onClick={() => { setShowProfileMenu(false); logout(); navigate('/login'); }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors"
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
                className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-purple-600/25 hover:opacity-95 transition-colors"
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
