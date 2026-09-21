import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { use3DTilt } from './use3DTilt';
import { 
  Heart, MessageSquare, Share2, Bookmark, Github, ExternalLink, 
  Code2, Send, Check
} from 'lucide-react';

export const PostCard = ({ post, onPostUpdated }) => {
  const { user } = useAuth();
  const tilt = use3DTilt({ maxTilt: 5, scale: 1.01 });
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [isSaved, setIsSaved] = useState(post.isSaved);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(post.comments || []);
  const [commentText, setCommentText] = useState('');
  const [copied, setCopied] = useState(false);
  const [animateHeart, setAnimateHeart] = useState(false);

  const handleLike = async () => {
    if (!user) return;
    const newLiked = !isLiked;
    setIsLiked(newLiked);
    setLikesCount(prev => (newLiked ? prev + 1 : prev - 1));

    if (newLiked) {
      setAnimateHeart(true);
      setTimeout(() => setAnimateHeart(false), 450);
    }

    try {
      await api.likePost(post.id);
    } catch (err) {
      setIsLiked(!newLiked);
      setLikesCount(prev => (newLiked ? prev - 1 : prev + 1));
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaved(!isSaved);
    try {
      await api.savePost(post.id);
    } catch (err) {
      setIsSaved(!isSaved);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !user) return;

    try {
      const newComment = await api.commentPost(post.id, commentText.trim());
      setComments(prev => [...prev, newComment]);
      setCommentText('');
    } catch (err) {
      console.error('Comment error:', err);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.origin + `/feed`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      ref={tilt.ref}
      style={tilt.style}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      className="glass-card glass-card-hover tilt-card-3d rounded-2xl p-5 mb-5 border border-white/10 bg-[#16182e]/90 text-white shadow-xl transition-all duration-300 animate-fade-in-up"
    >
      {/* Author Header */}
      <div className="flex items-center justify-between mb-4">
        <Link to={`/profile/${post.author.username}`} className="flex items-center gap-3 group">
          <img
            src={post.author.avatarUrl}
            alt=""
            className="h-10 w-10 rounded-full object-cover ring-2 ring-purple-500/30 group-hover:ring-purple-400 transition-all"
          />
          <div>
            <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
              {post.author.fullName}
            </h4>
            <p className="text-xs text-slate-400">
              @{post.author.username} • {post.author.college || 'Developer'}
            </p>
          </div>
        </Link>
        <span className="text-[11px] font-medium text-slate-400">
          {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </span>
      </div>

      {/* Post Content */}
      <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line mb-4 font-normal">
        {post.content}
      </p>

      {/* Attached Project Card */}
      {post.projectTitle && (
        <div className="mb-4 rounded-xl border border-purple-500/30 bg-purple-500/10 p-4">
          <div className="flex items-center gap-2 text-purple-300 text-xs font-bold uppercase tracking-wider mb-1">
            <Code2 className="h-4 w-4" /> Attached Project Showcase
          </div>
          <h5 className="text-base font-bold text-white mb-1">{post.projectTitle}</h5>
          {post.projectDesc && <p className="text-xs text-slate-300 mb-3 leading-relaxed">{post.projectDesc}</p>}
          
          {post.technologies && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {post.technologies.split(',').map((t, idx) => (
                <span key={idx} className="rounded-md bg-purple-500/20 px-2 py-0.5 text-[11px] font-mono font-semibold text-purple-300 border border-purple-500/30">
                  {t.trim()}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4 pt-2 border-t border-purple-500/20">
            {post.githubLink && (
              <a
                href={post.githubLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-xs font-semibold text-purple-300 hover:text-white transition-colors"
              >
                <Github className="h-3.5 w-3.5 text-purple-400" /> Repository
              </a>
            )}
            {post.liveDemoLink && (
              <a
                href={post.liveDemoLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5" /> Live Demo
              </a>
            )}
          </div>
        </div>
      )}

      {/* Post Image */}
      {post.imageUrl && (
        <div className="mb-4 overflow-hidden rounded-xl border border-white/10">
          <img src={post.imageUrl} alt="" className="w-full max-h-96 object-cover hover:scale-102 transition-transform duration-500" />
        </div>
      )}

      {/* Action Bar */}
      <div className="flex items-center justify-between pt-3 border-t border-white/10 text-slate-400">
        <div className="flex items-center gap-4">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${
              isLiked ? 'text-rose-400' : 'hover:text-rose-400'
            }`}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''} ${animateHeart ? 'animate-heart-pump' : ''}`} />
            <span>{likesCount}</span>
          </button>

          <button
            onClick={() => setShowComments(prev => !prev)}
            className="flex items-center gap-1.5 text-xs font-semibold hover:text-purple-300 transition-colors"
          >
            <MessageSquare className="h-4 w-4" />
            <span>{comments.length}</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 text-xs font-semibold hover:text-white transition-colors"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Share2 className="h-4 w-4" />}
            <span>{copied ? 'Copied!' : 'Share'}</span>
          </button>
        </div>

        <button
          onClick={handleSave}
          className={`text-xs transition-colors ${isSaved ? 'text-purple-400' : 'hover:text-purple-400'}`}
        >
          <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-purple-400 text-purple-400' : ''}`} />
        </button>
      </div>

      {/* Comments Drawer */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-white/10 space-y-3 animate-fade-in-up">
          {comments.map((c, idx) => (
            <div key={c.id || idx} className="flex gap-2.5 items-start bg-[#121427]/80 p-2.5 rounded-xl border border-white/5">
              <img src={c.author?.avatarUrl} alt="" className="h-6 w-6 rounded-full object-cover shrink-0 ring-1 ring-purple-500/20" />
              <div className="flex-1 text-xs">
                <span className="font-bold text-white mr-2">{c.author?.fullName}</span>
                <span className="text-slate-300">{c.content}</span>
              </div>
            </div>
          ))}

          {user && (
            <form onSubmit={handleAddComment} className="flex gap-2 mt-3">
              <input
                type="text"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 rounded-xl border border-white/10 bg-[#1a1c36] py-2 px-3 text-xs text-white placeholder-slate-400 focus:border-purple-500 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-3.5 py-2 text-xs font-semibold text-white hover:opacity-95 transition-colors shadow-md"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
