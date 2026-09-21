import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { use3DTilt } from './use3DTilt';
import { Github, ExternalLink, Heart, Bookmark } from 'lucide-react';

export const ProjectCard = ({ project }) => {
  const { user } = useAuth();
  const tilt = use3DTilt({ maxTilt: 6, scale: 1.01 });
  const [isLiked, setIsLiked] = useState(project.isLiked);
  const [likesCount, setLikesCount] = useState(project.likesCount || 0);
  const [isSaved, setIsSaved] = useState(project.isSaved);

  const statusColors = {
    IDEA: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    IN_DEVELOPMENT: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    COMPLETED: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
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
      className="glass-card glass-card-hover tilt-card-3d flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#16182e]/90 text-white p-5 transition-all shadow-xl"
    >
      <div>
        {/* Header Image & Status */}
        <div className="relative mb-4 h-44 overflow-hidden rounded-xl bg-[#121427] border border-white/10">
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
          <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1 mb-1.5">
            {project.title}
          </h3>
        </Link>
        <p className="text-xs text-slate-300 line-clamp-2 mb-4 leading-relaxed font-normal">
          {project.description}
        </p>

        {/* Tech Stack Pills */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {(project.technologiesList || []).map((tech, idx) => (
            <span
              key={idx}
              className="rounded-md border border-purple-500/30 bg-purple-500/10 px-2 py-0.5 text-[11px] font-mono font-semibold text-purple-300"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div>
        {/* Creator Info */}
        <div className="flex items-center justify-between py-3 border-t border-b border-white/10 mb-3">
          <Link to={`/profile/${project.creator.username}`} className="flex items-center gap-2 group">
            <img src={project.creator.avatarUrl} alt="" className="h-6 w-6 rounded-full object-cover ring-1 ring-purple-500/30" />
            <span className="text-xs font-semibold text-slate-300 group-hover:text-purple-300 transition-colors">
              {project.creator.fullName}
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {project.githubLink && (
              <a href={project.githubLink} target="_blank" rel="noreferrer" className="text-purple-400 hover:text-white transition-colors" title="GitHub Repo">
                <Github className="h-4 w-4" />
              </a>
            )}
            {project.liveDemoLink && (
              <a href={project.liveDemoLink} target="_blank" rel="noreferrer" className="text-cyan-400 hover:text-cyan-300 transition-colors" title="Live Demo">
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        {/* Action Footer */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <button onClick={handleLike} className={`flex items-center gap-1 font-semibold ${isLiked ? 'text-rose-400' : 'hover:text-rose-400'}`}>
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{likesCount}</span>
            </button>
            <button onClick={handleSave} className={`hover:text-purple-400 ${isSaved ? 'text-purple-400' : ''}`}>
              <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-purple-400' : ''}`} />
            </button>
          </div>

          <Link
            to={`/projects/${project.id}`}
            className="rounded-xl bg-purple-500/20 border border-purple-500/40 px-3 py-1 text-xs font-semibold text-purple-200 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 hover:text-white transition-all shadow-md"
          >
            View Project
          </Link>
        </div>
      </div>
    </div>
  );
};
