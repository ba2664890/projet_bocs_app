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
import { AnnonceurDashboard } from '@/pages/annonceur/AnnonceurDashboard';
import { CampaignsPage } from '@/pages/annonceur/CampaignsPage';
import { AudiencesPage } from '@/pages/annonceur/AudiencesPage';
import { ReportsPage as AnnonceurReportsPage } from '@/pages/annonceur/ReportsPage';
import { AlertsPage as AnnonceurAlertsPage } from '@/pages/annonceur/AlertsPage';

import { MapPage } from '@/pages/common/MapPage';
import { IndicatorsPage } from '@/pages/common/IndicatorsPage';
import { ProfilePage } from '@/pages/common/ProfilePage';
import { UserSettingsPage } from '@/pages/common/UserSettingsPage';

// Institution Pages
import { InstitutionLayout } from '@/components/layout/InstitutionLayout';
import { SectorsPage } from '@/pages/institution/SectorsPage';
import { ComparePage } from '@/pages/institution/ComparePage';
import { ReportsPage } from '@/pages/institution/ReportsPage';
import { AlertsPage } from '@/pages/institution/AlertsPage';

// Sector Pages
import { FacilitiesPage } from '@/pages/sector/FacilitiesPage';
import { FormsPage } from '@/pages/sector/FormsPage';
import { FormSubmissionPage } from '@/pages/sector/FormSubmissionPage';
import { AnalyticsPage } from '@/pages/sector/AnalyticsPage';
import { ExportsPage } from '@/pages/sector/ExportsPage';

// Admin Pages
import { UsersPage } from '@/pages/admin/UsersPage';
import { DataPage } from '@/pages/admin/DataPage';
import { WorkflowsPage } from '@/pages/admin/WorkflowsPage';
import { AuditPage } from '@/pages/admin/AuditPage';
import { SettingsPage } from '@/pages/admin/SettingsPage';

// Composant de protection des routes
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role) && user.role !== 'admin') {
    // If user is authenticated but not authorized for this route, 
    // redirect to '/' which will then redirect to their proper dashboard.
    // This breaks potential loops and ensures they land on a page they can see.
    return <Navigate to="/" replace />;
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
    case 'viewer':
    case 'annonceur':
      return <Navigate to="/annonceur" replace />;
    case 'sector_health':
      return <Navigate to="/sector/health" replace />;
    case 'sector_education':
      return <Navigate to="/sector/education" replace />;
    case 'local_manager':
      return <Navigate to="/sector/health" replace />;
    default:
      // Fallback safe for any other unexpected role
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
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><UserSettingsPage /></ProtectedRoute>} />

        {/* Institution Space */}
        <Route path="/institution" element={<ProtectedRoute allowedRoles={['institution', 'viewer']}><InstitutionLayout /></ProtectedRoute>}>
          <Route index element={<InstitutionDashboard />} />
          <Route path="map" element={<MapPage />} />
          <Route path="indicators" element={<IndicatorsPage />} />
          <Route path="sectors/*" element={<SectorsPage />} />
          <Route path="compare" element={<ComparePage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="alerts" element={<AlertsPage />} />
        </Route>

        {/* Sector Space - Health */}
        <Route path="/sector/health" element={<ProtectedRoute allowedRoles={['sector_health', 'local_manager']}><HealthDashboard /></ProtectedRoute>} />
        <Route path="/sector/health/map" element={<ProtectedRoute allowedRoles={['sector_health', 'local_manager']}><MapPage /></ProtectedRoute>} />
        <Route path="/sector/health/indicators" element={<ProtectedRoute allowedRoles={['sector_health', 'local_manager']}><IndicatorsPage /></ProtectedRoute>} />
        <Route path="/sector/health/facilities" element={<ProtectedRoute allowedRoles={['sector_health', 'local_manager']}><FacilitiesPage /></ProtectedRoute>} />
        <Route path="/sector/health/collections" element={<ProtectedRoute allowedRoles={['sector_health', 'local_manager']}><Navigate to="/sector/health/forms" replace /></ProtectedRoute>} />
        <Route path="/sector/health/forms" element={<ProtectedRoute allowedRoles={['sector_health', 'local_manager']}><FormsPage /></ProtectedRoute>} />
        <Route path="/sector/health/forms/:formId" element={<ProtectedRoute allowedRoles={['sector_health', 'local_manager']}><FormSubmissionPage /></ProtectedRoute>} />
        <Route path="/sector/health/analytics" element={<ProtectedRoute allowedRoles={['sector_health', 'local_manager']}><AnalyticsPage /></ProtectedRoute>} />
        <Route path="/sector/health/exports" element={<ProtectedRoute allowedRoles={['sector_health', 'local_manager']}><ExportsPage /></ProtectedRoute>} />

        {/* Sector Space - Education */}
        <Route path="/sector/education" element={<ProtectedRoute allowedRoles={['sector_education', 'local_manager']}><EducationDashboard /></ProtectedRoute>} />
        <Route path="/sector/education/map" element={<ProtectedRoute allowedRoles={['sector_education', 'local_manager']}><MapPage /></ProtectedRoute>} />
        <Route path="/sector/education/indicators" element={<ProtectedRoute allowedRoles={['sector_education', 'local_manager']}><IndicatorsPage /></ProtectedRoute>} />
        <Route path="/sector/education/facilities" element={<ProtectedRoute allowedRoles={['sector_education', 'local_manager']}><FacilitiesPage /></ProtectedRoute>} />
        <Route path="/sector/education/collections" element={<ProtectedRoute allowedRoles={['sector_education', 'local_manager']}><Navigate to="/sector/education/forms" replace /></ProtectedRoute>} />
        <Route path="/sector/education/forms" element={<ProtectedRoute allowedRoles={['sector_education', 'local_manager']}><FormsPage /></ProtectedRoute>} />
        <Route path="/sector/education/forms/:formId" element={<ProtectedRoute allowedRoles={['sector_education', 'local_manager']}><FormSubmissionPage /></ProtectedRoute>} />
        <Route path="/sector/education/analytics" element={<ProtectedRoute allowedRoles={['sector_education', 'local_manager']}><AnalyticsPage /></ProtectedRoute>} />
        <Route path="/sector/education/exports" element={<ProtectedRoute allowedRoles={['sector_education', 'local_manager']}><ExportsPage /></ProtectedRoute>} />

        {/* Admin Space */}
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><UsersPage /></ProtectedRoute>} />
        <Route path="/admin/data" element={<ProtectedRoute allowedRoles={['admin']}><DataPage /></ProtectedRoute>} />
        <Route path="/admin/validations" element={<ProtectedRoute allowedRoles={['admin']}><WorkflowsPage /></ProtectedRoute>} />
        <Route path="/admin/workflows" element={<ProtectedRoute allowedRoles={['admin']}><WorkflowsPage /></ProtectedRoute>} />
        <Route path="/admin/audit" element={<ProtectedRoute allowedRoles={['admin']}><AuditPage /></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['admin']}><SettingsPage /></ProtectedRoute>} />



        {/* Annonceur Space */}
        <Route path="/annonceur" element={<ProtectedRoute allowedRoles={['annonceur', 'viewer']}><AnnonceurDashboard /></ProtectedRoute>} />
        <Route path="/annonceur/campaigns" element={<ProtectedRoute allowedRoles={['annonceur', 'viewer']}><CampaignsPage /></ProtectedRoute>} />
        <Route path="/annonceur/audiences" element={<ProtectedRoute allowedRoles={['annonceur', 'viewer']}><AudiencesPage /></ProtectedRoute>} />
        <Route path="/annonceur/reports" element={<ProtectedRoute allowedRoles={['annonceur', 'viewer']}><AnnonceurReportsPage /></ProtectedRoute>} />
        <Route path="/annonceur/alerts" element={<ProtectedRoute allowedRoles={['annonceur', 'viewer']}><AnnonceurAlertsPage /></ProtectedRoute>} />
        <Route path="/annonceur/profile" element={<ProtectedRoute allowedRoles={['annonceur', 'viewer']}><ProfilePage /></ProtectedRoute>} />
        <Route path="/annonceur/settings" element={<ProtectedRoute allowedRoles={['annonceur', 'viewer']}><UserSettingsPage /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
