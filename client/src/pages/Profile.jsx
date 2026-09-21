import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ProjectCard } from '../components/ProjectCard';
import { PostCard } from '../components/PostCard';
import { EditProfileModal } from '../components/Modals/EditProfileModal';
import { 
  Github, MapPin, GraduationCap, Calendar, MessageSquare, 
  UserPlus, UserCheck, Edit3, Code2, Star, GitFork, Trophy, Award, Activity, Rss 
} from 'lucide-react';

export const Profile = () => {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('posts'); // 'posts', 'projects', 'achievements', 'activity', 'github'
  const [githubRepos, setGithubRepos] = useState([]);
  const [githubLoading, setGithubLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [username]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const data = await api.getProfile(username);
      setProfile(data);
      setIsFollowing(data.isFollowing);

      // Load posts by this user
      const allPosts = await api.getPosts('all');
      const filteredPosts = allPosts.filter(p => p.author?.username === username);
      setUserPosts(filteredPosts);

      if (data.githubUsername) {
        setGithubLoading(true);
        api.getGitHubRepos(data.githubUsername)
          .then(res => setGithubRepos(res.repos || []))
          .catch(() => {})
          .finally(() => setGithubLoading(false));
      }
    } catch (err) {
      console.error('Load profile error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    if (!currentUser || !profile) return;
    const newStatus = !isFollowing;
    setIsFollowing(newStatus);
    setProfile(prev => ({
      ...prev,
      followersCount: newStatus ? prev.followersCount + 1 : prev.followersCount - 1
    }));

    try {
      await api.toggleFollow(profile.id);
    } catch (err) {
      setIsFollowing(!newStatus);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 text-center text-slate-400">
        <div className="animate-pulse space-y-4 max-w-3xl mx-auto">
          <div className="h-48 rounded-2xl bg-slate-900" />
          <div className="h-24 rounded-2xl bg-slate-900" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 text-center text-slate-400">
        Developer profile not found.
      </div>
    );
  }

  const isOwner = currentUser && currentUser.id === profile.id;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      
      {/* Cover Banner */}
      <div className="relative h-48 sm:h-64 overflow-hidden rounded-3xl border border-slate-800 bg-slate-950">
        <img src={profile.coverUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'} alt="" className="h-full w-full object-cover" />
      </div>

      {/* Main Header Container */}
      <div className="relative -mt-16 sm:-mt-20 mb-8 px-4 sm:px-6">
        <div className="glass-card rounded-3xl border border-slate-800 bg-slate-900/90 p-6 backdrop-blur-xl shadow-2xl">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              <img
                src={profile.avatarUrl}
                alt=""
                className="h-20 w-20 sm:h-24 sm:w-24 rounded-full object-cover ring-4 ring-slate-950 shadow-xl"
              />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                  {profile.fullName}
                  <span className="rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 px-2.5 py-0.5 text-xs font-mono">
                    {profile.experience || 'Developer'}
                  </span>
                </h1>
                <p className="text-xs text-slate-400 font-mono">@{profile.username}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {isOwner ? (
                <button
                  onClick={() => setShowEditModal(true)}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
                >
                  <Edit3 className="h-3.5 w-3.5" /> Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={handleFollowToggle}
                    className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold transition-colors ${
                      isFollowing
                        ? 'bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700'
                        : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/30'
                    }`}
                  >
                    {isFollowing ? <UserCheck className="h-3.5 w-3.5" /> : <UserPlus className="h-3.5 w-3.5" />}
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>

                  <button
                    onClick={() => navigate('/messages')}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
                  >
                    <MessageSquare className="h-3.5 w-3.5 text-indigo-400" /> Message
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Bio */}
          <p className="text-xs sm:text-sm text-slate-300 mb-4 max-w-3xl leading-relaxed">
            {profile.bio || 'Developer on ProjectHub Social.'}
          </p>

          {/* Details Bar */}
          <div className="flex flex-wrap gap-4 text-xs text-slate-400 border-t border-slate-800/80 pt-4 mb-4">
            {profile.college && (
              <div className="flex items-center gap-1.5">
                <GraduationCap className="h-4 w-4 text-indigo-400 shrink-0" />
                <span>{profile.college}</span>
              </div>
            )}
            {profile.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>{profile.location}</span>
              </div>
            )}
            {profile.githubUsername && (
              <a
                href={`https://github.com/${profile.githubUsername}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-indigo-400 hover:underline"
              >
                <Github className="h-4 w-4" /> github.com/{profile.githubUsername}
              </a>
            )}
          </div>

          {/* Skills Grid */}
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Technical Skills</p>
            <div className="flex flex-wrap gap-1.5">
              {(profile.skills || []).map((s, idx) => (
                <span key={idx} className="rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-1 text-xs font-mono font-medium text-indigo-300">
                  {s.skillName || s}
                </span>
              ))}
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-slate-800 text-center">
            <div>
              <p className="text-lg font-bold text-white font-mono">{profile.projectsCount || 0}</p>
              <p className="text-[11px] text-slate-400 font-semibold uppercase">Projects</p>
            </div>
            <div>
              <p className="text-lg font-bold text-white font-mono">{profile.followersCount || 0}</p>
              <p className="text-[11px] text-slate-400 font-semibold uppercase">Followers</p>
            </div>
            <div>
              <p className="text-lg font-bold text-white font-mono">{profile.followingCount || 0}</p>
              <p className="text-[11px] text-slate-400 font-semibold uppercase">Following</p>
            </div>
          </div>

        </div>
      </div>

      {/* Profile Tabs: Posts | Projects | Achievements | Activity */}
      <div className="flex items-center gap-2 border-b border-slate-800 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
            activeTab === 'posts'
              ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Rss className="h-4 w-4" /> Posts ({userPosts.length})
        </button>

        <button
          onClick={() => setActiveTab('projects')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
            activeTab === 'projects'
              ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Code2 className="h-4 w-4" /> Projects ({profile.projects?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('achievements')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
            activeTab === 'achievements'
              ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Award className="h-4 w-4" /> Achievements
        </button>

        <button
          onClick={() => setActiveTab('activity')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
            activeTab === 'activity'
              ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="h-4 w-4" /> Activity
        </button>

        <button
          onClick={() => setActiveTab('github')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
            activeTab === 'github'
              ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Github className="h-4 w-4" /> GitHub Repos ({githubRepos.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'posts' && (
        <div className="max-w-3xl space-y-4">
          {userPosts.length > 0 ? (
            userPosts.map(p => (
              <PostCard key={p.id} post={p} onPostUpdated={loadProfile} />
            ))
          ) : (
            <p className="py-8 text-center text-xs text-slate-400">No posts shared yet.</p>
          )}
        </div>
      )}

      {activeTab === 'projects' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(profile.projects || []).map(p => (
            <ProjectCard key={p.id} project={{ ...p, creator: profile }} />
          ))}
          {(!profile.projects || profile.projects.length === 0) && (
            <p className="col-span-full py-8 text-center text-xs text-slate-400">No projects added yet.</p>
          )}
        </div>
      )}

      {activeTab === 'achievements' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-card rounded-2xl border border-amber-500/20 bg-amber-950/10 p-5 flex items-start gap-4">
            <div className="rounded-xl bg-amber-500/20 p-3 text-amber-400">
              <Trophy className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">Global DevHack 2026 Winner</h4>
              <p className="text-xs text-slate-300">Formed Team DevSync AI and secured 1st prize in Collaborative Tools division.</p>
            </div>
          </div>

          <div className="glass-card rounded-2xl border border-indigo-500/20 bg-indigo-950/10 p-5 flex items-start gap-4">
            <div className="rounded-xl bg-indigo-500/20 p-3 text-indigo-400">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">Top Open Source Contributor</h4>
              <p className="text-xs text-slate-300">Published top-starred developer productivity libraries used by 10k+ developers.</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="glass-card rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 max-w-2xl">
          <h4 className="text-sm font-bold text-white mb-2">Recent Developer Activity</h4>
          <div className="space-y-3 text-xs text-slate-300">
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>Published project <strong>DevSync Editor v0.8</strong></span>
            </div>
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="h-2 w-2 rounded-full bg-indigo-400" />
              <span>Formed hackathon squad <strong>Team DevSync AI</strong></span>
            </div>
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              <span>Commented on <strong>GlassUI Design System</strong></span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'github' && (
        <div>
          {githubLoading ? (
            <div className="text-center py-8 text-xs text-slate-400">Fetching GitHub Repositories...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {githubRepos.map((repo, idx) => (
                <a
                  key={idx}
                  href={repo.url}
                  target="_blank"
                  rel="noreferrer"
                  className="glass-card glass-card-hover block rounded-2xl border border-slate-800 bg-slate-900/60 p-4 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-bold text-white truncate flex items-center gap-1.5">
                      <Github className="h-4 w-4 text-indigo-400 shrink-0" /> {repo.name}
                    </h4>
                    <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-indigo-300">
                      {repo.language}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">
                    {repo.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 text-amber-400" /> {repo.stars} stars</span>
                    <span className="flex items-center gap-1"><GitFork className="h-3.5 w-3.5 text-slate-400" /> {repo.forks} forks</span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <EditProfileModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onProfileUpdated={loadProfile}
        />
      )}
    </div>
  );
};
