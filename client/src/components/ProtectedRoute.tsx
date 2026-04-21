import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', background: 'var(--bg)',
      }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: '50%',
          border: '2px solid transparent',
          borderTopColor: 'var(--primary)', borderRightColor: 'var(--primary)',
          animation: 'spin 0.75s linear infinite',
        }} />
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/auth/login" replace />;
}
