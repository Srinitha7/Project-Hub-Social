const API_BASE = '/api';

export const fetchAPI = async (endpoint, options = {}) => {
  const token = localStorage.getItem('projecthub_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `HTTP error! status: ${response.status}`);
  }

  return data;
};

export const api = {
  // Auth
  register: (body) => fetchAPI('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => fetchAPI('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  getMe: () => fetchAPI('/auth/me'),

  // Users & Profiles
  getProfile: (username) => fetchAPI(`/users/profile/${username}`),
  updateProfile: (body) => fetchAPI('/users/profile', { method: 'PUT', body: JSON.stringify(body) }),
  toggleFollow: (targetUserId) => fetchAPI('/users/follow', { method: 'POST', body: JSON.stringify({ targetUserId }) }),
  findTeammates: (params = '') => fetchAPI(`/users/teammates?${params}`),

  // Posts
  getPosts: (type = 'all') => fetchAPI(`/posts?feedType=${type}`),
  getSavedPosts: () => fetchAPI('/posts/saved'),
  createPost: (body) => fetchAPI('/posts', { method: 'POST', body: JSON.stringify(body) }),
  likePost: (postId) => fetchAPI(`/posts/${postId}/like`, { method: 'POST' }),
  commentPost: (postId, content) => fetchAPI(`/posts/${postId}/comment`, { method: 'POST', body: JSON.stringify({ content }) }),
  savePost: (postId) => fetchAPI(`/posts/${postId}/save`, { method: 'POST' }),

  // Projects
  getProjects: (params = '') => fetchAPI(`/projects?${params}`),
  getProjectById: (id) => fetchAPI(`/projects/${id}`),
  createProject: (body) => fetchAPI('/projects', { method: 'POST', body: JSON.stringify(body) }),
  likeProject: (id) => fetchAPI(`/projects/${id}/like`, { method: 'POST' }),
  commentProject: (id, content) => fetchAPI(`/projects/${id}/comment`, { method: 'POST', body: JSON.stringify({ content }) }),

  // Hackathons
  getHackathons: (params = '') => fetchAPI(`/hackathons?${params}`),
  getHackathonById: (id) => fetchAPI(`/hackathons/${id}`),

  // Teams
  getTeams: (params = '') => fetchAPI(`/teams?${params}`),
  getTeamById: (id) => fetchAPI(`/teams/${id}`),
  createTeam: (body) => fetchAPI('/teams', { method: 'POST', body: JSON.stringify(body) }),
  requestJoinTeam: (teamId, message) => fetchAPI(`/teams/${teamId}/request`, { method: 'POST', body: JSON.stringify({ message }) }),
  handleJoinRequest: (teamId, requestId, action, role) => fetchAPI(`/teams/${teamId}/request/${requestId}`, { method: 'PUT', body: JSON.stringify({ action, role }) }),
  createTeamTask: (teamId, title, assignedToId) => fetchAPI(`/teams/${teamId}/tasks`, { method: 'POST', body: JSON.stringify({ title, assignedToId }) }),
  updateTeamTaskStatus: (taskId, status) => fetchAPI(`/teams/tasks/${taskId}`, { method: 'PUT', body: JSON.stringify({ status }) }),

  // Messages
  getConversations: () => fetchAPI('/messages/conversations'),
  getMessagesWithUser: (partnerId) => fetchAPI(`/messages/${partnerId}`),
  sendMessage: (body) => fetchAPI('/messages', { method: 'POST', body: JSON.stringify(body) }),

  // Notifications
  getNotifications: () => fetchAPI('/notifications'),
  markNotificationRead: (id) => fetchAPI(`/notifications/${id}/read`, { method: 'PUT' }),

  // Search & GitHub
  globalSearch: (q) => fetchAPI(`/search?q=${encodeURIComponent(q)}`),
  getGitHubRepos: (username) => fetchAPI(`/github/${username}/repos`),
};
