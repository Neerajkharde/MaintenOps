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
import RequestsPage from './pages/dashboard/RequestsPage';
import ProfilePage from './pages/dashboard/ProfilePage';
import { RequestProvider } from './context/RequestContext';
import ActionQueuePage from './pages/dashboard/admin/ActionQueuePage';
import VendorsPage from './pages/dashboard/admin/VendorsPage';
import InventoryPage from './pages/dashboard/admin/InventoryPage';
import CreateQuotationPage from './pages/dashboard/admin/CreateQuotationPage';
import ApprovalQueuePage from './pages/dashboard/superadmin/ApprovalQueuePage';
import SystemAdminsPage from './pages/dashboard/superadmin/SystemAdminsPage';
import SAVendorListsPage from './pages/dashboard/superadmin/SAVendorListsPage';
import SAItemsReadyPage from './pages/dashboard/superadmin/SAItemsReadyPage';
import SAInProductionPage from './pages/dashboard/superadmin/SAInProductionPage';

function App() {
  return (
    <AuthProvider>
      <RequestProvider>
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
                <Route path="requests" element={<RequestsPage />} />
                <Route path="profile" element={<ProfilePage />} />
              </Route>
            </Route>

            {/* Admin Dashboard Routes */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
              <Route path="/admin" element={<DashboardLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="queue" element={<ActionQueuePage />} />
                <Route path="vendors" element={<VendorsPage />} />
                <Route path="inventory" element={<InventoryPage />} />
                <Route path="create-quotation/:requestId" element={<CreateQuotationPage />} />
              </Route>
            </Route>

            {/* Super Admin Dashboard Routes */}
            <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']} />}>
              <Route path="/super-admin" element={<DashboardLayout />}>
                <Route index element={<SuperAdminDashboard />} />
                <Route path="approvals" element={<ApprovalQueuePage />} />
                <Route path="admins" element={<SystemAdminsPage />} />
                <Route path="vendor-lists" element={<SAVendorListsPage />} />
                <Route path="items-ready" element={<SAItemsReadyPage />} />
                <Route path="in-production" element={<SAInProductionPage />} />
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </RequestProvider>
    </AuthProvider>
  );
}

export default App;
