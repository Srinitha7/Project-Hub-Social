import React, { useState } from 'react';
import { api } from '../../services/api';
import { X, Code2 } from 'lucide-react';

export const CreateProjectModal = ({ isOpen, onClose, onProjectCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('IN_DEVELOPMENT');
  const [technologies, setTechnologies] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [githubLink, setGithubLink] = useState('');
  const [liveDemoLink, setLiveDemoLink] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !technologies.trim()) return;

    setLoading(true);
    try {
      const techArray = technologies.split(',').map(s => s.trim()).filter(Boolean);
      const newProj = await api.createProject({
        title,
        description,
        status,
        technologies: techArray,
        imageUrl,
        githubLink,
        liveDemoLink
      });
      if (onProjectCreated) onProjectCreated(newProj);
      onClose();
    } catch (err) {
      alert(err.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 p-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Code2 className="h-4 w-4 text-emerald-400" /> Create New Project Showcase
          </h3>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Project Title</label>
            <input
              type="text"
              placeholder="e.g. SentinelGuard Zero-Trust Monitor"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Project Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
            >
              <option value="IDEA">Idea Phase</option>
              <option value="IN_DEVELOPMENT">In Development</option>
              <option value="COMPLETED">Completed Project</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
            <textarea
              rows={3}
              placeholder="Detailed description of what the project does, key architecture decisions..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Technologies (comma separated)</label>
            <input
              type="text"
              placeholder="e.g. React, Node.js, Python, PostgreSQL, Docker"
              value={technologies}
              onChange={(e) => setTechnologies(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Project Image Banner URL</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">GitHub Repository Link</label>
              <input
                type="url"
                placeholder="https://github.com/username/repo"
                value={githubLink}
                onChange={(e) => setGithubLink(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Live Demo URL</label>
              <input
                type="url"
                placeholder="https://myproject.vercel.app"
                value={liveDemoLink}
                onChange={(e) => setLiveDemoLink(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
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
              {loading ? 'Creating...' : 'Publish Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
