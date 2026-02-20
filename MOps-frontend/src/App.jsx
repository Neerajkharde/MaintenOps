import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import UserDashboard from './pages/dashboard/UserDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import SuperAdminDashboard from './pages/dashboard/SuperAdminDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* User Dashboard Routes */}
          <Route element={<ProtectedRoute allowedRoles={['REQUESTER']} />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<UserDashboard />} />
              <Route path="requests" element={<div>My Requests Placeholder</div>} />
              <Route path="profile" element={<div>Profile Placeholder</div>} />
            </Route>
          </Route>

          {/* Admin Dashboard Routes */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin" element={<DashboardLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="queue" element={<div>Action Queue Placeholder</div>} />
              <Route path="vendors" element={<div>Vendors Placeholder</div>} />
              <Route path="inventory" element={<div>Inventory Placeholder</div>} />
            </Route>
          </Route>

          {/* Super Admin Dashboard Routes */}
          <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']} />}>
            <Route path="/super-admin" element={<DashboardLayout />}>
              <Route index element={<SuperAdminDashboard />} />
              <Route path="escalations" element={<div>Escalations Placeholder</div>} />
              <Route path="approvals" element={<div>Approvals Placeholder</div>} />
              <Route path="admins" element={<div>Admins Placeholder</div>} />
              <Route path="settings" element={<div>Settings Placeholder</div>} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
