import { Navigate, useLocation } from 'react-router-dom';
import { useHealthPassport } from '../context/HealthPassportContext';

export function ProtectedRoute({ children, requirePassport = false }) {
  const { isAuthenticated, hasPassport, loading } = useHealthPassport();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-page">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (requirePassport && !hasPassport) {
    return <Navigate to="/create-passport" replace />;
  }

  return children;
}

export function GuestRoute({ children }) {
  const { isAuthenticated } = useHealthPassport();

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return children;
}
