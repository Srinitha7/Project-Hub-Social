import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { VantaBackground } from './components/VantaBackground';
import { CreatePostModal } from './components/Modals/CreatePostModal';
import { CreateProjectModal } from './components/Modals/CreateProjectModal';

// Pages
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Feed } from './pages/Feed';
import { Explore } from './pages/Explore';
import { Saved } from './pages/Saved';
import { Profile } from './pages/Profile';
import { Projects } from './pages/Projects';
import { ProjectDetail } from './pages/ProjectDetail';
import { Teammates } from './pages/Teammates';
import { Hackathons } from './pages/Hackathons';
import { Teams } from './pages/Teams';
import { TeamDashboard } from './pages/TeamDashboard';
import { Messages } from './pages/Messages';
import { Notifications } from './pages/Notifications';
import { Dashboard } from './pages/Dashboard';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="py-20 text-center text-slate-400">Loading auth state...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

export default function App() {
  const { user } = useAuth();
  const location = useLocation();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);

  const isPublicPage = ['/', '/login', '/register'].includes(location.pathname);

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900 flex flex-col overflow-x-hidden">
      
      {/* Plain Background Container */}
      <VantaBackground />

      {/* Top Navbar */}
      <Navbar toggleMobileSidebar={() => setMobileSidebarOpen(prev => !prev)} />

      <div className="relative z-10 flex flex-1">
        {user && !isPublicPage && (
          <Sidebar
            isOpen={mobileSidebarOpen}
            onClose={() => setMobileSidebarOpen(false)}
            openCreatePostModal={() => setShowCreatePostModal(true)}
            openCreateProjectModal={() => setShowCreateProjectModal(true)}
          />
        )}

        <main className="flex-1 w-full overflow-x-hidden">
          <Routes>
            <Route path="/" element={user ? <Navigate to="/feed" /> : <Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/feed" element={
              <ProtectedRoute>
                <Feed openCreatePostModal={() => setShowCreatePostModal(true)} />
              </ProtectedRoute>
            } />

            <Route path="/explore" element={<Explore />} />

            <Route path="/saved" element={
              <ProtectedRoute>
                <Saved />
              </ProtectedRoute>
            } />

            <Route path="/profile/:username" element={<Profile />} />

            <Route path="/projects" element={
              <Projects openCreateProjectModal={() => setShowCreateProjectModal(true)} />
            } />
            <Route path="/projects/:id" element={<ProjectDetail />} />

            <Route path="/teammates" element={<Teammates />} />
            <Route path="/hackathons" element={<Hackathons />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/teams/:id" element={<TeamDashboard />} />

            <Route path="/messages" element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            } />

            <Route path="/notifications" element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            } />

            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      {/* Global Modals */}
      {showCreatePostModal && (
        <CreatePostModal
          isOpen={showCreatePostModal}
          onClose={() => setShowCreatePostModal(false)}
        />
      )}

      {showCreateProjectModal && (
        <CreateProjectModal
          isOpen={showCreateProjectModal}
          onClose={() => setShowCreateProjectModal(false)}
        />
      )}
    </div>
  );
}
