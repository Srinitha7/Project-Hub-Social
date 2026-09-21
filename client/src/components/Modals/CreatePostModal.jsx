import React, { useState } from 'react';
import { api } from '../../services/api';
import { X, Code2, Image, Github, ExternalLink, Send } from 'lucide-react';

export const CreatePostModal = ({ isOpen, onClose, onPostCreated }) => {
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [githubLink, setGithubLink] = useState('');
  const [liveDemoLink, setLiveDemoLink] = useState('');
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      const newPost = await api.createPost({
        content,
        imageUrl,
        projectTitle: showProjectDetails ? projectTitle : '',
        projectDesc: showProjectDetails ? projectDesc : '',
        technologies: showProjectDetails ? technologies : '',
        githubLink: showProjectDetails ? githubLink : '',
        liveDemoLink: showProjectDetails ? liveDemoLink : ''
      });
      if (onPostCreated) onPostCreated(newPost);
      onClose();
    } catch (err) {
      alert(err.message || 'Failed to publish post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 p-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Send className="h-4 w-4 text-indigo-400" /> Share Developer Post
          </h3>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <textarea
              rows={4}
              placeholder="What are you building or learning today? Share code snippets, project updates, or hackathon news..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <input
              type="url"
              placeholder="Optional image URL..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="pt-2 border-t border-slate-800/80">
            <button
              type="button"
              onClick={() => setShowProjectDetails(prev => !prev)}
              className="flex items-center gap-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
            >
              <Code2 className="h-4 w-4" /> {showProjectDetails ? 'Remove Attached Project' : '+ Attach Project Information'}
            </button>
          </div>

          {showProjectDetails && (
            <div className="space-y-3 rounded-xl border border-indigo-500/20 bg-indigo-950/20 p-3">
              <input
                type="text"
                placeholder="Project Title (e.g., DevSync Code Editor)"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-200"
              />
              <input
                type="text"
                placeholder="Technologies used (e.g. React, Node.js, Socket.IO)"
                value={technologies}
                onChange={(e) => setTechnologies(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-200"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="url"
                  placeholder="GitHub Link"
                  value={githubLink}
                  onChange={(e) => setGithubLink(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-200"
                />
                <input
                  type="url"
                  placeholder="Live Demo Link"
                  value={liveDemoLink}
                  onChange={(e) => setLiveDemoLink(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-200"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-800 px-4 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Publishing...' : 'Publish Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
