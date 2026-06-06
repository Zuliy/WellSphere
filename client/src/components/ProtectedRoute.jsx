import { Navigate, useLocation } from 'react-router-dom';
import { useHealthPassport } from '../context/HealthPassportContext';

export function ProtectedRoute({ children, requirePassport = false }) {
  const { isAuthenticated, hasPassport } = useHealthPassport();
  const location = useLocation();

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
