import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { PostCard } from '../components/PostCard';
import { 
  Rss, Users, PlusCircle, Trophy, 
  Code2 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Feed = ({ openCreatePostModal }) => {
  const { user } = useAuth();
  const [feedType, setFeedType] = useState('all');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [suggestedDevs, setSuggestedDevs] = useState([]);
  const [upcomingHackathons, setUpcomingHackathons] = useState([]);

  useEffect(() => {
    loadFeed();
  }, [feedType]);

  useEffect(() => {
    api.findTeammates('').then(res => setSuggestedDevs(res.slice(0, 4))).catch(() => {});
    api.getHackathons().then(res => setUpcomingHackathons(res.slice(0, 2))).catch(() => {});
  }, []);

  const loadFeed = async () => {
    setLoading(true);
    try {
      const data = await api.getPosts(feedType);
      setPosts(data);
    } catch (err) {
      console.error('Load feed error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 animate-fade-in-up">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Feed Column (2 cols wide) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Quick Create Post Box */}
          {user && (
            <div className="glass-card rounded-2xl border border-white/10 bg-[#16182e]/90 p-4 shadow-xl">
              <div className="flex items-center gap-3">
                <img src={user.avatarUrl} alt="" className="h-10 w-10 rounded-full object-cover ring-2 ring-purple-500/30" />
                <button
                  onClick={openCreatePostModal}
                  className="flex-1 text-left rounded-full border border-white/10 bg-[#121427] py-2.5 px-4 text-xs font-medium text-slate-400 hover:border-purple-500/50 hover:text-white transition-all"
                >
                  Share code snippet, project update, or hackathon news...
                </button>
                <button
                  onClick={openCreatePostModal}
                  className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 p-2.5 text-white hover:opacity-95 transition-colors shadow-lg shadow-purple-600/30"
                  title="Create Post"
                >
                  <PlusCircle className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* Feed Filter Tabs */}
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <button
              onClick={() => setFeedType('all')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                feedType === 'all'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-purple-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Rss className="h-4 w-4" /> Global Feed
            </button>

            {user && (
              <button
                onClick={() => setFeedType('following')}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                  feedType === 'following'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-purple-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Users className="h-4 w-4" /> Following
              </button>
            )}
          </div>

          {/* Feed Posts List */}
          {loading ? (
            <div className="space-y-4 py-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse rounded-2xl border border-white/10 bg-[#16182e]/90 p-6 h-48" />
              ))}
            </div>
          ) : posts.length > 0 ? (
            <div>
              {posts.map(post => (
                <PostCard key={post.id} post={post} onPostUpdated={loadFeed} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-[#16182e]/90 p-12 text-center shadow-xl">
              <Code2 className="h-10 w-10 text-purple-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white mb-1">No Posts Yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                Be the first developer to share a project update or code snippet!
              </p>
              <button
                onClick={openCreatePostModal}
                className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-xs font-semibold text-white hover:opacity-95 shadow-md"
              >
                Create First Post
              </button>
            </div>
          )}
        </div>

        {/* Right Sidebar Widgets Column */}
        <div className="space-y-6">
          
          {/* Upcoming Hackathons Banner Widget */}
          <div className="glass-card rounded-2xl border border-white/10 bg-[#16182e]/90 p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Trophy className="h-4 w-4" /> Featured Hackathons
              </h3>
              <Link to="/hackathons" className="text-[11px] font-semibold text-purple-300 hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {upcomingHackathons.map(h => (
                <div key={h.id} className="rounded-xl border border-white/10 bg-[#121427] p-3 hover:border-purple-500/40 transition-colors">
                  <span className="rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 text-[10px] font-mono font-semibold uppercase">
                    {h.mode}
                  </span>
                  <h4 className="text-xs font-bold text-white mt-1.5">{h.name}</h4>
                  <p className="text-[11px] text-slate-400">{h.date}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Suggested Developers Widget */}
          <div className="glass-card rounded-2xl border border-white/10 bg-[#16182e]/90 p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                <Users className="h-4 w-4 text-purple-400" /> Discover Developers
              </h3>
              <Link to="/teammates" className="text-[11px] font-semibold text-purple-300 hover:underline">
                Find More
              </Link>
            </div>

            <div className="space-y-3">
              {suggestedDevs.map(dev => (
                <div key={dev.id} className="flex items-center justify-between gap-3">
                  <Link to={`/profile/${dev.username}`} className="flex items-center gap-2.5 truncate group">
                    <img src={dev.avatarUrl} alt="" className="h-8 w-8 rounded-full object-cover shrink-0 ring-1 ring-purple-500/30" />
                    <div className="truncate">
                      <p className="text-xs font-bold text-white group-hover:text-purple-300 truncate">{dev.fullName}</p>
                      <p className="text-[10px] text-slate-400 truncate">@{dev.username}</p>
                    </div>
                  </Link>

                  <Link
                    to={`/profile/${dev.username}`}
                    className="rounded-lg border border-white/10 bg-[#121427] px-2.5 py-1 text-[11px] font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
