import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Github, ExternalLink, Heart, Bookmark, Code2, Users, Send, ArrowLeft } from 'lucide-react';

export const ProjectDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    loadProjectDetails();
  }, [id]);

  const loadProjectDetails = async () => {
    setLoading(true);
    try {
      const data = await api.getProjectById(id);
      setProject(data);
      setComments(data.comments || []);
      setIsLiked(data.isLiked);
      setLikesCount(data.likesCount || 0);
    } catch (err) {
      console.error('Load project detail error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) return;
    const newLiked = !isLiked;
    setIsLiked(newLiked);
    setLikesCount(prev => (newLiked ? prev + 1 : prev - 1));
    try {
      await api.likeProject(project.id);
    } catch (err) {
      setIsLiked(!newLiked);
      setLikesCount(prev => (newLiked ? prev - 1 : prev + 1));
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !user) return;

    try {
      const newComment = await api.commentProject(project.id, commentText.trim());
      setComments(prev => [...prev, newComment]);
      setCommentText('');
    } catch (err) {
      console.error('Add project comment error:', err);
    }
  };

  if (loading) {
    return <div className="py-12 text-center text-slate-400">Loading project details...</div>;
  }

  if (!project) {
    return <div className="py-12 text-center text-slate-400">Project not found.</div>;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      <Link to="/projects" className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:underline">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Projects Showcase
      </Link>

      {/* Main Banner */}
      <div className="relative h-64 sm:h-80 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
        <img src={project.imageUrl} alt="" className="h-full w-full object-cover" />
        <span className="absolute left-4 top-4 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 px-3 py-1 text-xs font-mono font-bold backdrop-blur-md">
          {project.status.replace('_', ' ')}
        </span>
      </div>

      {/* Header Info */}
      <div className="glass-card rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">{project.title}</h1>
            <p className="text-xs text-slate-400 mt-1">
              Created by{' '}
              <Link to={`/profile/${project.creator.username}`} className="font-semibold text-indigo-400 hover:underline">
                {project.creator.fullName}
              </Link>{' '}
              • {project.creator.college || 'Developer'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {project.githubLink && (
              <a
                href={project.githubLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700"
              >
                <Github className="h-4 w-4 text-indigo-400" /> Repository
              </a>
            )}

            {project.liveDemoLink && (
              <a
                href={project.liveDemoLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
              >
                <ExternalLink className="h-4 w-4" /> Live Demo
              </a>
            )}
          </div>
        </div>

        {/* Tech Stack */}
        <div>
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Technologies Used</p>
          <div className="flex flex-wrap gap-1.5">
            {(project.technologiesList || []).map((tech, idx) => (
              <span key={idx} className="rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-1 text-xs font-mono font-medium text-indigo-300">
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Full Description */}
        <div className="pt-4 border-t border-slate-800">
          <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">
            {project.description}
          </p>
        </div>

        {/* Interactive Bar */}
        <div className="flex items-center gap-4 pt-4 border-t border-slate-800 text-xs text-slate-400">
          <button onClick={handleLike} className={`flex items-center gap-1.5 ${isLiked ? 'text-rose-500 font-semibold' : 'hover:text-rose-400'}`}>
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-rose-500' : ''}`} />
            <span>{likesCount} Likes</span>
          </button>
        </div>
      </div>

      {/* Project Comments */}
      <div className="glass-card rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <h3 className="text-base font-bold text-white">Project Feedback & Discussion</h3>

        <div className="space-y-3">
          {comments.map((c, idx) => (
            <div key={c.id || idx} className="flex gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
              <img src={c.author?.avatarUrl} alt="" className="h-7 w-7 rounded-full object-cover shrink-0" />
              <div className="text-xs">
                <p className="font-semibold text-slate-200 mb-0.5">{c.author?.fullName}</p>
                <p className="text-slate-300">{c.content}</p>
              </div>
            </div>
          ))}
        </div>

        {user && (
          <form onSubmit={handleAddComment} className="flex gap-2 pt-2">
            <input
              type="text"
              placeholder="Leave feedback or ask a question about this project..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
