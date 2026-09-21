import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { PostCard } from '../components/PostCard';
import { ProjectCard } from '../components/ProjectCard';
import { Bookmark, Code2, Rss } from 'lucide-react';

export const Saved = () => {
  const [savedPosts, setSavedPosts] = useState([]);
  const [savedProjects, setSavedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('posts'); // 'posts' or 'projects'

  useEffect(() => {
    loadSavedData();
  }, []);

  const loadSavedData = async () => {
    setLoading(true);
    try {
      const data = await api.getSavedPosts();
      setSavedPosts(data.posts || []);
      setSavedProjects(data.projects || []);
    } catch (err) {
      console.error('Load saved data error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
          <Bookmark className="h-6 w-6 text-indigo-400" /> Saved Posts & Bookmarks
        </h1>
        <p className="text-xs text-slate-400 mt-1">Your personal collection of bookmarked developer posts and projects</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setTab('posts')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
            tab === 'posts'
              ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Rss className="h-4 w-4" /> Saved Posts ({savedPosts.length})
        </button>

        <button
          onClick={() => setTab('projects')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
            tab === 'projects'
              ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Code2 className="h-4 w-4" /> Saved Projects ({savedProjects.length})
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-12 text-center text-slate-400">Loading saved bookmarks...</div>
      ) : tab === 'posts' ? (
        <div>
          {savedPosts.length > 0 ? (
            <div className="max-w-3xl">
              {savedPosts.map(post => (
                <PostCard key={post.id} post={post} onPostUpdated={loadSavedData} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-slate-400">No saved posts yet.</div>
          )}
        </div>
      ) : (
        <div>
          {savedProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedProjects.map(p => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-slate-400">No saved projects yet.</div>
          )}
        </div>
      )}

    </div>
  );
};
