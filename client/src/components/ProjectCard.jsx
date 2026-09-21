import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { use3DTilt } from './use3DTilt';
import { Github, ExternalLink, Heart, Bookmark, Code2 } from 'lucide-react';

export const ProjectCard = ({ project }) => {
  const { user } = useAuth();
  const tilt = use3DTilt({ maxTilt: 6, scale: 1.01 });
  const [isLiked, setIsLiked] = useState(project.isLiked);
  const [likesCount, setLikesCount] = useState(project.likesCount || 0);
  const [isSaved, setIsSaved] = useState(project.isSaved);

  const statusColors = {
    IDEA: 'bg-amber-100 text-amber-800 border-amber-300',
    IN_DEVELOPMENT: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    COMPLETED: 'bg-emerald-100 text-emerald-800 border-emerald-300'
  };

  const handleLike = async (e) => {
    e.stopPropagation();
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

  const handleSave = async (e) => {
    e.stopPropagation();
    if (!user) return;
    setIsSaved(!isSaved);
    try {
      await api.savePost(project.id);
    } catch (err) {
      setIsSaved(!isSaved);
    }
  };

  return (
    <div 
      ref={tilt.ref}
      style={tilt.style}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      className="glass-card glass-card-hover tilt-card-3d flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 transition-all shadow-sm"
    >
      <div>
        {/* Header Image & Status */}
        <div className="relative mb-4 h-44 overflow-hidden rounded-xl bg-slate-100 border border-slate-200">
          <img
            src={project.imageUrl || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80'}
            alt=""
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <span className={`absolute left-3 top-3 rounded-full border px-2.5 py-1 text-[11px] font-mono font-bold uppercase tracking-wider backdrop-blur-md shadow-sm ${statusColors[project.status] || statusColors.IN_DEVELOPMENT}`}>
            {project.status.replace('_', ' ')}
          </span>
        </div>

        {/* Title & Description */}
        <Link to={`/projects/${project.id}`} className="block group">
          <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 mb-1.5">
            {project.title}
          </h3>
        </Link>
        <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed font-normal">
          {project.description}
        </p>

        {/* Tech Stack Pills */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {(project.technologiesList || []).map((tech, idx) => (
            <span
              key={idx}
              className="rounded-md border border-indigo-200 bg-indigo-50/80 px-2 py-0.5 text-[11px] font-mono font-semibold text-indigo-700"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div>
        {/* Creator Info */}
        <div className="flex items-center justify-between py-3 border-t border-b border-slate-100 mb-3">
          <Link to={`/profile/${project.creator.username}`} className="flex items-center gap-2 group">
            <img src={project.creator.avatarUrl} alt="" className="h-6 w-6 rounded-full object-cover ring-1 ring-slate-200" />
            <span className="text-xs font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors">
              {project.creator.fullName}
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {project.githubLink && (
              <a href={project.githubLink} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-slate-900 transition-colors" title="GitHub Repo">
                <Github className="h-4 w-4" />
              </a>
            )}
            {project.liveDemoLink && (
              <a href={project.liveDemoLink} target="_blank" rel="noreferrer" className="text-emerald-600 hover:text-emerald-700 transition-colors" title="Live Demo">
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        {/* Action Footer */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <button onClick={handleLike} className={`flex items-center gap-1 font-semibold ${isLiked ? 'text-rose-600' : 'hover:text-rose-500'}`}>
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-rose-600' : ''}`} />
              <span>{likesCount}</span>
            </button>
            <button onClick={handleSave} className={`hover:text-indigo-600 ${isSaved ? 'text-indigo-600' : ''}`}>
              <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-indigo-600' : ''}`} />
            </button>
          </div>

          <Link
            to={`/projects/${project.id}`}
            className="rounded-lg bg-indigo-50 border border-indigo-200 px-3 py-1 text-xs font-semibold text-indigo-700 hover:bg-indigo-600 hover:text-white transition-all shadow-xs"
          >
            View Project
          </Link>
        </div>
      </div>
    </div>
  );
};
