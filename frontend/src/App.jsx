import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { Navbar } from './components/Navbar';
import { ToastProvider } from './components/ui/Toast';

// Pages
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { CustomerHome } from './pages/customer/CustomerHome';
import { ServiceDiscovery } from './pages/customer/ServiceDiscovery';
import { EmergencyBooking } from './pages/customer/EmergencyBooking';
import { CustomerBookings } from './pages/customer/CustomerBookings';
import { WorkerPublicProfile } from './pages/customer/WorkerPublicProfile';

import { WorkerDashboard } from './pages/worker/WorkerDashboard';
import { WorkerRequests } from './pages/worker/WorkerRequests';
import { WorkerProfile } from './pages/worker/WorkerProfile';
import { WorkerWelfare } from './pages/worker/WorkerWelfare';
import { AiOperations } from './pages/cooperative/AiOperations';

// Protected Route Wrapper
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, role } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to={role === 'WORKER' ? '/worker/dashboard' : '/customer/home'} replace />;
  }

  return children;
};

export default function App() {
  const { role } = useAuthStore();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-brand-500 selection:text-white">
      <ToastProvider />
      <Navbar />

      <main className="flex-1 pb-16">
        <Routes>
          {/* Index Route */}
          <Route
            path="/"
            element={
              role === 'WORKER' ? (
                <Navigate to="/worker/dashboard" replace />
              ) : (
                <Navigate to="/customer/home" replace />
              )
            }
          />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Customer Routes */}
          <Route path="/customer/home" element={<CustomerHome />} />
          <Route path="/customer/discover" element={<ServiceDiscovery />} />
          <Route path="/customer/emergency" element={<EmergencyBooking />} />
          <Route
            path="/customer/bookings"
            element={
              <ProtectedRoute requiredRole="CUSTOMER">
                <CustomerBookings />
              </ProtectedRoute>
            }
          />
          <Route path="/worker/profile/:id" element={<WorkerPublicProfile />} />

          {/* Worker Routes */}
          <Route
            path="/worker/dashboard"
            element={
              <ProtectedRoute requiredRole="WORKER">
                <WorkerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/worker/requests"
            element={
              <ProtectedRoute requiredRole="WORKER">
                <WorkerRequests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/worker/profile"
            element={
              <ProtectedRoute requiredRole="WORKER">
                <WorkerProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/worker/welfare"
            element={
              <ProtectedRoute requiredRole="WORKER">
                <WorkerWelfare />
              </ProtectedRoute>
            }
          />

          {/* Cooperative Hub / AI Operations */}
          <Route path="/cooperative/ai-operations" element={<AiOperations />} />

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Global Minimal Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-semibold text-slate-700">
            SevaConnect © 2026 — Cooperative-Owned Independent Worker Marketplace
          </p>
          <p className="text-[11px] text-slate-400">
            Internal SIH 2026 • PS 26089 • Connecting Skills. Empowering Communities.
          </p>
        </div>
      </footer>
    </div>
  );
}
