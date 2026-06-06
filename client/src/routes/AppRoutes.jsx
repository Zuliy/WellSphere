import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { ProtectedRoute, GuestRoute } from '../components/ProtectedRoute';
import Login from '../pages/Login';
import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';
import CreatePassport from '../pages/CreatePassport';
import AddRecord from '../pages/AddRecord';
import Passport from '../pages/Passport';
import DoctorPortal from '../pages/DoctorPortal';

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="login"
        element={
          <GuestRoute>
            <Login />
          </GuestRoute>
        }
      />

      <Route element={<MainLayout />}>
        <Route index element={<Navigate to="/login" replace />} />

        <Route
          path="home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="create-passport"
          element={
            <ProtectedRoute>
              <CreatePassport />
            </ProtectedRoute>
          }
        />

        <Route
          path="dashboard"
          element={
            <ProtectedRoute requirePassport>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="add-record"
          element={
            <ProtectedRoute requirePassport>
              <AddRecord />
            </ProtectedRoute>
          }
        />

        <Route
          path="passport"
          element={
            <ProtectedRoute requirePassport>
              <Passport />
            </ProtectedRoute>
          }
        />

        <Route
          path="doctor-portal"
          element={
            <ProtectedRoute requirePassport>
              <DoctorPortal />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}
