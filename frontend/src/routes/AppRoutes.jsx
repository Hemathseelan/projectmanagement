import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProtectedRoute from './ProtectedRoute';

import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Dashboard from '../pages/Dashboard';
import Projects from '../pages/Projects';
import ProjectDetails from '../pages/ProjectDetails';
import Tasks from '../pages/Tasks';
import Profile from '../pages/Profile';
import NotFound from '../pages/NotFound';

function GuestRoute({ children }) {
  const { isAuthenticated } = useSelector((state) => state.auth);
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
      <Route path="/projects/:id" element={<ProtectedRoute><ProjectDetails /></ProtectedRoute>} />
      <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
