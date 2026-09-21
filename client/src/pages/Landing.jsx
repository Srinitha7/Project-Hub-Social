import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Terminal, Code2, Users, Trophy, Github, Sparkles, 
  ArrowRight, CheckCircle2 
} from 'lucide-react';

export const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-xs font-mono font-semibold text-indigo-700 mb-8 shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
            <span>The Developer Social Platform & Team Matcher</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl mb-6 text-slate-900">
            Where Developers <br />
            <span className="text-indigo-600">
              Showcase, Connect & Build
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-base sm:text-lg text-slate-600 mb-10 leading-relaxed font-normal">
            ProjectHub Social is designed specifically for student developers, programmers, and tech innovators to showcase projects, find hackathon teammates, and build real software together.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-8 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 transition-all"
            >
              Get Started Free <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-8 py-3.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition-all shadow-xs"
            >
              Member Login
            </Link>
          </div>

          {/* Interactive Code Window */}
          <div className="mt-8 mx-auto max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md text-left">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 font-mono text-xs text-slate-600 font-semibold">ProjectHub.config.ts</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                <Terminal className="h-3.5 w-3.5 text-indigo-600" /> main branch
              </div>
            </div>

            <div className="p-6 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto text-slate-800 bg-white">
              <p className="text-slate-400">// ProjectHub Social Developer Matrix</p>
              <p><span className="text-indigo-600 font-semibold">const</span> developer = <span className="text-amber-600 font-semibold">await</span> ProjectHub.<span className="text-indigo-600 font-semibold">findTeammates</span>(&#123;</p>
              <p className="pl-6"><span className="text-indigo-600 font-semibold">skills</span>: [<span className="text-emerald-600">'React'</span>, <span className="text-emerald-600">'Python'</span>, <span className="text-emerald-600">'AI/ML'</span>],</p>
              <p className="pl-6"><span className="text-indigo-600 font-semibold">interests</span>: [<span className="text-emerald-600">'Hackathons'</span>, <span className="text-emerald-600">'Open Source'</span>],</p>
              <p className="pl-6"><span className="text-indigo-600 font-semibold">college</span>: <span className="text-emerald-600">'MIT / Stanford / Global'</span></p>
              <p className="text-slate-800">&#125;);</p>
              <br />
              <p className="text-emerald-600 font-semibold">// Status: 100% Match Found • Inviting to Team DevSync AI...</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="py-16 border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-3">
              Designed For Real Engineering & Collaboration
            </h2>
            <p className="text-slate-600 text-sm max-w-xl mx-auto">
              Built from the ground up to empower student developers to turn ideas into working applications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card rounded-2xl p-6 border border-slate-200 bg-slate-50 hover:border-indigo-300 transition-all">
              <div className="h-10 w-10 rounded-xl bg-indigo-100 border border-indigo-200 text-indigo-700 flex items-center justify-center mb-4 font-bold">
                <Code2 className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Project Showcase</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Publish project cards with tech tags, live demo buttons, and GitHub repositories. Filter by Java, Python, AI/ML, Cloud & Blockchain.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6 border border-slate-200 bg-slate-50 hover:border-indigo-300 transition-all">
              <div className="h-10 w-10 rounded-xl bg-indigo-100 border border-indigo-200 text-indigo-700 flex items-center justify-center mb-4 font-bold">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Find Teammates</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Search developers by specific programming language, university, and experience level. Send instant team invites.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6 border border-slate-200 bg-slate-50 hover:border-indigo-300 transition-all">
              <div className="h-10 w-10 rounded-xl bg-amber-100 border border-amber-200 text-amber-700 flex items-center justify-center mb-4 font-bold">
                <Trophy className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Hackathon Hub</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Discover online and offline hackathons. Form recruiting teams, assign tasks, and manage join requests on team dashboards.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6 border border-slate-200 bg-slate-50 hover:border-indigo-300 transition-all">
              <div className="h-10 w-10 rounded-xl bg-emerald-100 border border-emerald-200 text-emerald-700 flex items-center justify-center mb-4 font-bold">
                <Github className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">GitHub Integration</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Connect your GitHub handle to automatically showcase public repositories, stars, and language stats on your developer profile.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Developer Stats Section */}
      <section className="py-14 border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-indigo-600 font-mono">10,000+</p>
              <p className="text-xs text-slate-600 mt-1 uppercase tracking-wider font-semibold">Active Developers</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-indigo-600 font-mono">15,000+</p>
              <p className="text-xs text-slate-600 mt-1 uppercase tracking-wider font-semibold">Projects Built</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-amber-600 font-mono">500+</p>
              <p className="text-xs text-slate-600 mt-1 uppercase tracking-wider font-semibold">Hackathons Joined</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-emerald-600 font-mono">3,200+</p>
              <p className="text-xs text-slate-600 mt-1 uppercase tracking-wider font-semibold">Teams Formed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-500 bg-white">
        <p>© 2026 ProjectHub Social. Designed for student developers & tech enthusiasts worldwide.</p>
      </footer>
    </div>
  );
};
