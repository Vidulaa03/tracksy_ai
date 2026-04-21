import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import ApplicationsListPage from './pages/dashboard/ApplicationsListPage';
import ApplicationDetailPage from './pages/dashboard/ApplicationDetailPage';
import ResumePage from './pages/dashboard/ResumePage';
import './globals.css';

// Wraps every dashboard route with the sidebar layout
function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg)' }}>
      <Sidebar user={user} onLogout={handleLogout} />
      <main style={{ flex: 1, overflowY: 'auto', padding: '32px 40px' }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
          {children}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth/login"  element={<LoginPage />} />
          <Route path="/auth/signup" element={<SignupPage />} />

          <Route path="/dashboard" element={
            <ProtectedRoute><DashboardLayout><DashboardPage /></DashboardLayout></ProtectedRoute>
          } />
          <Route path="/dashboard/applications" element={
            <ProtectedRoute><DashboardLayout><ApplicationsListPage /></DashboardLayout></ProtectedRoute>
          } />
          <Route path="/dashboard/applications/:id" element={
            <ProtectedRoute><DashboardLayout><ApplicationDetailPage /></DashboardLayout></ProtectedRoute>
          } />
          <Route path="/dashboard/resume" element={
            <ProtectedRoute><DashboardLayout><ResumePage /></DashboardLayout></ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
