// ============================================
// FATI - Application Principale
// ============================================

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store';
import { Login } from '@/pages/auth/Login';
import { Register } from '@/pages/auth/Register';
import { InstitutionDashboard } from '@/pages/institution/Dashboard';
import { HealthDashboard } from '@/pages/sector/HealthDashboard';
import { EducationDashboard } from '@/pages/sector/EducationDashboard';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { ContributorDashboard } from '@/pages/contributor/ContributorDashboard';

// Composant de protection des routes
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Route par défaut selon le rôle
const DefaultRoute = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirection selon le rôle
  switch (user?.role) {
    case 'admin':
      return <Navigate to="/admin" replace />;
    case 'institution':
      return <Navigate to="/institution" replace />;
    case 'sector_health':
      return <Navigate to="/sector/health" replace />;
    case 'sector_education':
      return <Navigate to="/sector/education" replace />;
    case 'local_manager':
    case 'contributor':
      return <Navigate to="/contributor" replace />;
    default:
      return <Navigate to="/institution" replace />;
  }
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Default */}
        <Route path="/" element={<DefaultRoute />} />

        {/* Institution Space */}
        <Route
          path="/institution"
          element={
            <ProtectedRoute>
              <InstitutionDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/institution/*"
          element={
            <ProtectedRoute>
              <InstitutionDashboard />
            </ProtectedRoute>
          }
        />

        {/* Sector Space - Health */}
        <Route
          path="/sector/health"
          element={
            <ProtectedRoute>
              <HealthDashboard />
            </ProtectedRoute>
          }
        />

        {/* Sector Space - Education */}
        <Route
          path="/sector/education"
          element={
            <ProtectedRoute>
              <EducationDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin Space */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Contributor Space */}
        <Route
          path="/contributor"
          element={
            <ProtectedRoute>
              <ContributorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contributor/*"
          element={
            <ProtectedRoute>
              <ContributorDashboard />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
