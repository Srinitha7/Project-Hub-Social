import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Terminal, Lock, Mail, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(identifier, password);
      navigate('/feed');
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-fade-in-up bg-slate-50">
      <div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg grid grid-cols-1 lg:grid-cols-2">
        
        {/* Left Side: Plain Light Developer Panel */}
        <div className="relative hidden lg:flex flex-col justify-between p-10 bg-slate-100 text-slate-900 overflow-hidden border-r border-slate-200">
          {/* Top Brand */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1 text-xs font-mono font-semibold text-indigo-700 mb-6 shadow-xs">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" /> Developer Social Network
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight mb-2 text-slate-900">
              Welcome to <br />
              <span className="text-indigo-600">
                ProjectHub Social
              </span>
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed max-w-sm font-normal">
              The social media platform engineered for developers, programmers, and hackathon innovators.
            </p>
          </div>

          {/* Code Window Graphic */}
          <div className="my-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-2.5 bg-slate-50">
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 font-mono text-[11px] text-slate-600 font-semibold">auth.config.ts</span>
              </div>
              <span className="font-mono text-[10px] text-emerald-600 font-bold">● 100% Verified</span>
            </div>

            <div className="p-4 font-mono text-xs leading-relaxed text-slate-800 bg-white">
              <p className="text-slate-400">// Authenticate & Access Developer Matrix</p>
              <p><span className="text-indigo-600 font-semibold">const</span> developer = <span className="text-amber-600 font-semibold">await</span> ProjectHub.<span className="text-indigo-600 font-semibold">authenticate</span>(&#123;</p>
              <p className="pl-4"><span className="text-indigo-600 font-semibold">platform</span>: <span className="text-emerald-600">'ProjectHub Social'</span>,</p>
              <p className="pl-4"><span className="text-indigo-600 font-semibold">features</span>: [<span className="text-emerald-600">'Showcase'</span>, <span className="text-emerald-600">'Teams'</span>, <span className="text-emerald-600">'GitHub'</span>]</p>
              <p>&#125;);</p>
            </div>
          </div>

          {/* Bottom Highlights */}
          <div className="space-y-2 text-xs text-slate-600 pt-4 border-t border-slate-200 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Connect with developers across MIT, Stanford & IIT</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Form recruiting squads for active hackathons</span>
            </div>
          </div>
        </div>

        {/* Right Side: Sign In Form */}
        <div className="flex flex-col justify-center p-8 sm:p-12 bg-white">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center gap-2 font-mono text-xl font-bold tracking-tight text-slate-900 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
                <Terminal className="h-5 w-5" />
              </div>
              <span>ProjectHub <span className="text-indigo-600 font-bold">Social</span></span>
            </Link>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 mt-2">Sign In to Your Account</h2>
            <p className="text-xs text-slate-500 mt-1">Enter your email or username to access your portfolio and teams</p>
          </div>

          {error && (
            <div className="mb-6 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-600 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email or Username</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="srinitha or srinitha@projecthub.dev"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 bg-white text-indigo-600 focus:ring-indigo-500"
                />
                Remember me
              </label>

              <button type="button" onClick={() => alert('Demo password for registered accounts is: password123')} className="text-indigo-600 font-semibold hover:underline">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 transition-all disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Sign In to Developer Network'} <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-slate-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-indigo-600 hover:underline">
              Create developer account
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};
