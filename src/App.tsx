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
import { AnnonceurDashboard } from '@/pages/annonceur/AnnonceurDashboard';

import { MapPage } from '@/pages/common/MapPage';
import { IndicatorsPage } from '@/pages/common/IndicatorsPage';

// Institution Pages
import { SectorsPage } from '@/pages/institution/SectorsPage';
import { ComparePage } from '@/pages/institution/ComparePage';
import { ReportsPage } from '@/pages/institution/ReportsPage';
import { AlertsPage } from '@/pages/institution/AlertsPage';

// Sector Pages
import { FacilitiesPage } from '@/pages/sector/FacilitiesPage';
import { CollectionsPage } from '@/pages/sector/CollectionsPage';
import { AnalyticsPage } from '@/pages/sector/AnalyticsPage';
import { ExportsPage } from '@/pages/sector/ExportsPage';

// Admin Pages
import { UsersPage } from '@/pages/admin/UsersPage';
import { DataPage } from '@/pages/admin/DataPage';
import { WorkflowsPage } from '@/pages/admin/WorkflowsPage';
import { AuditPage } from '@/pages/admin/AuditPage';
import { SettingsPage } from '@/pages/admin/SettingsPage';

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
  // ... same as before
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
    case 'annonceur':
      return <Navigate to="/annonceur" replace />;
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
        <Route path="/institution" element={<ProtectedRoute><InstitutionDashboard /></ProtectedRoute>} />
        <Route path="/institution/map" element={<ProtectedRoute><MapPage /></ProtectedRoute>} />
        <Route path="/institution/indicators" element={<ProtectedRoute><IndicatorsPage /></ProtectedRoute>} />
        <Route path="/institution/sectors/*" element={<ProtectedRoute><SectorsPage /></ProtectedRoute>} />
        <Route path="/institution/compare" element={<ProtectedRoute><ComparePage /></ProtectedRoute>} />
        <Route path="/institution/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
        <Route path="/institution/alerts" element={<ProtectedRoute><AlertsPage /></ProtectedRoute>} />

        {/* Sector Space - Health */}
        <Route path="/sector/health" element={<ProtectedRoute><HealthDashboard /></ProtectedRoute>} />
        <Route path="/sector/health/map" element={<ProtectedRoute><MapPage /></ProtectedRoute>} />
        <Route path="/sector/health/indicators" element={<ProtectedRoute><IndicatorsPage /></ProtectedRoute>} />
        <Route path="/sector/health/facilities" element={<ProtectedRoute><FacilitiesPage /></ProtectedRoute>} />
        <Route path="/sector/health/collections" element={<ProtectedRoute><CollectionsPage /></ProtectedRoute>} />
        <Route path="/sector/health/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
        <Route path="/sector/health/exports" element={<ProtectedRoute><ExportsPage /></ProtectedRoute>} />

        {/* Sector Space - Education */}
        <Route path="/sector/education" element={<ProtectedRoute><EducationDashboard /></ProtectedRoute>} />
        <Route path="/sector/education/map" element={<ProtectedRoute><MapPage /></ProtectedRoute>} />
        <Route path="/sector/education/indicators" element={<ProtectedRoute><IndicatorsPage /></ProtectedRoute>} />
        <Route path="/sector/education/facilities" element={<ProtectedRoute><FacilitiesPage /></ProtectedRoute>} />
        <Route path="/sector/education/collections" element={<ProtectedRoute><CollectionsPage /></ProtectedRoute>} />
        <Route path="/sector/education/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
        <Route path="/sector/education/exports" element={<ProtectedRoute><ExportsPage /></ProtectedRoute>} />

        {/* Admin Space */}
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />
        <Route path="/admin/data" element={<ProtectedRoute><DataPage /></ProtectedRoute>} />
        <Route path="/admin/validations" element={<ProtectedRoute><WorkflowsPage /></ProtectedRoute>} />
        <Route path="/admin/workflows" element={<ProtectedRoute><WorkflowsPage /></ProtectedRoute>} />
        <Route path="/admin/audit" element={<ProtectedRoute><AuditPage /></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

        {/* Contributor Space */}
        <Route path="/contributor" element={<ProtectedRoute><ContributorDashboard /></ProtectedRoute>} />
        <Route path="/contributor/collections" element={<ProtectedRoute><CollectionsPage /></ProtectedRoute>} />
        {/* Forms and Notifications could reuse existing or need new ones, mapping to Collections for now to avoid 404 */}
        <Route path="/contributor/forms" element={<ProtectedRoute><CollectionsPage /></ProtectedRoute>} />
        <Route path="/contributor/notifications" element={<ProtectedRoute><AlertsPage /></ProtectedRoute>} />

        {/* Annonceur Space */}
        <Route path="/annonceur" element={<ProtectedRoute><AnnonceurDashboard /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
