// ============================================
// FATI - Sidebar Navigation
// ============================================

import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useUIStore, useAuthStore } from '@/store';
import { useAuth } from '@/hooks/useAuth';
import { useAlerts } from '@/hooks/useData';
import {
  LayoutDashboard,
  Map,
  BarChart3,
  Building2,
  GraduationCap,
  HeartPulse,
  Settings,
  Users,
  FileText,
  Bell,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Database,
  ClipboardList,
  Shield,
  X,
  Megaphone,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SidebarProps {
  space: 'institution' | 'sector' | 'admin' | 'annonceur';
  collapsed: boolean;
  isMobile?: boolean;
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
  badge?: number;
  children?: NavItem[];
  roles?: string[];
}

const getNavigation = (space: string, locationPath: string, userRole: string): NavItem[] => {
  const isSector = space === 'sector';
  const sectorMatch = locationPath.match(/\/sector\/(health|education)/);
  const currentSector = sectorMatch ? sectorMatch[1] : '';
  const basePath = isSector && currentSector ? `/sector/${currentSector}` : `/${space}`;

  // Helper to check if user has access
  const hasRole = (allowedRoles: string[]) => allowedRoles.includes(userRole) || userRole === 'admin';

  const baseNav: NavItem[] = [
    { label: 'Tableau de bord', path: basePath, icon: LayoutDashboard },
    { label: 'Cartographie', path: `${basePath}/map`, icon: Map },
    { label: 'Indicateurs', path: `${basePath}/indicators`, icon: BarChart3 },
  ];

  switch (space) {
    case 'institution':
      if (!hasRole(['institution', 'viewer'])) return [];
      return [
        ...baseNav,
        {
          label: 'Secteurs',
          path: `${basePath}/sectors`,
          icon: Building2,
          children: [
            { label: 'Santé', path: `${basePath}/sectors/health`, icon: HeartPulse },
            { label: 'Éducation', path: `${basePath}/sectors/education`, icon: GraduationCap },
          ],
        },
        { label: 'Comparaisons', path: `${basePath}/compare`, icon: BarChart3 },
        { label: 'Rapports', path: `${basePath}/reports`, icon: FileText },
        { label: 'Alertes', path: `${basePath}/alerts`, icon: Bell, badge: 0 },
      ];

    case 'sector':
      if (currentSector === 'health' && !hasRole(['sector_health'])) return [];
      if (currentSector === 'education' && !hasRole(['sector_education'])) return [];

      const structuresLabel = currentSector === 'education' ? 'Établissements' : 'Structures';
      return [
        ...baseNav,
        { label: structuresLabel, path: `${basePath}/facilities`, icon: Building2 },
        { label: 'Collectes', path: `${basePath}/collections`, icon: ClipboardList },
        { label: 'Analyses', path: `${basePath}/analytics`, icon: BarChart3 },
        { label: 'Exports', path: `${basePath}/exports`, icon: FileText },
      ];

    case 'admin':
      if (userRole !== 'admin') return [];
      return [
        { label: 'Tableau de bord', path: `${basePath}`, icon: LayoutDashboard },
        { label: 'Utilisateurs', path: `${basePath}/users`, icon: Users },
        { label: 'Données', path: `${basePath}/data`, icon: Database },
        { label: 'Validations', path: `${basePath}/validations`, icon: Shield },
        { label: 'Workflows', path: `${basePath}/workflows`, icon: ClipboardList },
        { label: 'Audit', path: `${basePath}/audit`, icon: FileText },
        { label: 'Paramètres', path: `${basePath}/settings`, icon: Settings },
      ];


    case 'annonceur':
      if (!hasRole(['annonceur'])) return [];
      return [
        { label: 'Tableau de bord', path: `${basePath}`, icon: LayoutDashboard },
        { label: 'Collectes', path: `${basePath}/campaigns`, icon: Megaphone },
        { label: 'Audiences', path: `${basePath}/audiences`, icon: Users },
        { label: 'Rapports', path: `${basePath}/reports`, icon: FileText },
      ];

    default:
      return baseNav;
  }
};

const getSpaceConfig = (space: string) => {
  switch (space) {
    case 'institution':
      return {
        name: 'Institutions',
        color: 'bg-blue-600',
        icon: Building2,
      };
    case 'sector':
      return {
        name: 'Secteurs',
        color: 'bg-teal-600',
        icon: HeartPulse,
      };
    case 'admin':
      return {
        name: 'Administration',
        color: 'bg-purple-600',
        icon: Shield,
      };

    case 'annonceur':
      return {
        name: 'Public',
        color: 'bg-indigo-600',
        icon: Megaphone,
      };
    default:
      return {
        name: 'FATI',
        color: 'bg-primary',
        icon: LayoutDashboard,
      };
  }
};

export const Sidebar = ({ space, collapsed, isMobile }: SidebarProps) => {
  const location = useLocation();
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const setSidebarMobileOpen = useUIStore((state) => state.setSidebarMobileOpen);
  const { logout } = useAuth();
  const { unreadAlertsCount } = useAlerts();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const user = useAuthStore((state) => state.user);

  const navigation = getNavigation(space, location.pathname, user?.role || '');
  const spaceConfig = getSpaceConfig(space);

  const isAdmin = user?.role === 'admin';
  const isNotAdminSpace = space !== 'admin';

  const toggleExpand = (path: string) => {
    setExpandedItems((prev) =>
      prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path]
    );
  };

  const isExpanded = (path: string) => expandedItems.includes(path);

  const renderNavItem = (item: NavItem, depth = 0) => {
    const isDashboard = item.path === `/${space}` || item.path === `/sector/health` || item.path === `/sector/education` || item.path === `/annonceur` || item.path === `/admin`;
    const isActive = isDashboard
      ? location.pathname === item.path
      : location.pathname === item.path || location.pathname.startsWith(item.path + '/');
    const hasChildren = item.children && item.children.length > 0;
    const expanded = isExpanded(item.path);

    if (item.roles && !item.roles.includes(user?.role || '')) {
      return null;
    }

    return (
      <div key={item.path} className={cn('space-y-1', depth > 0 && 'ml-4')}>
        {hasChildren ? (
          <button
            onClick={() => toggleExpand(item.path)}
            className={cn(
              'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground',
              collapsed && !isMobile && 'justify-center px-2'
            )}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {(!collapsed || isMobile) && (
              <>
                <span className="flex-1 text-left">{item.label}</span>
                {expanded ? (
                  <ChevronLeft className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </>
            )}
          </button>
        ) : (
          <NavLink
            to={item.path}
            onClick={() => isMobile && setSidebarMobileOpen(false)}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground',
              collapsed && !isMobile && 'justify-center px-2'
            )}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {(!collapsed || isMobile) && (
              <>
                <span className="flex-1">{item.label}</span>
                {item.badge !== undefined && (
                  <Badge variant="secondary" className="h-5 min-w-[1.25rem] px-1 text-xs">
                    {item.badge || unreadAlertsCount}
                  </Badge>
                )}
              </>
            )}
          </NavLink>
        )}

        {hasChildren && expanded && (!collapsed || isMobile) && (
          <div className="mt-1 space-y-1">
            {item.children!.map((child) => renderNavItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-full flex-col border-r border-border bg-card">
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        <div className="flex items-center gap-3">
          <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', spaceConfig.color)}>
            <spaceConfig.icon className="h-5 w-5 text-white" />
          </div>
          {(!collapsed || isMobile) && (
            <div className="flex flex-col">
              <span className="text-lg font-bold leading-tight">FATI</span>
              <span className="text-xs text-muted-foreground">{spaceConfig.name}</span>
            </div>
          )}
        </div>
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={() => setSidebarMobileOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        )}
        {!isMobile && (
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="hidden lg:flex">
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navigation.map((item) => renderNavItem(item))}

          {isAdmin && isNotAdminSpace && (
            <div className="mt-6 pt-6 border-t border-border">
              <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
                Administration
              </p>
              <NavLink
                to="/admin"
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors text-purple-600 hover:bg-purple-50 hover:text-purple-700 dark:text-purple-400 dark:hover:bg-purple-900/20',
                  collapsed && !isMobile && 'justify-center px-2'
                )}
              >
                <ShieldCheck className="h-5 w-5 flex-shrink-0" />
                {(!collapsed || isMobile) && <span className="flex-1">Gérer la plateforme</span>}
              </NavLink>
            </div>
          )}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t border-border p-4">
        {(!collapsed || isMobile) && user && (
          <div className="mb-4 flex items-center gap-3 rounded-lg bg-accent/50 p-3">
            <img
              src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`}
              alt={user.firstName}
              className="h-10 w-10 rounded-full bg-background"
            />
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium">
                {user.firstName} {user.lastName}
              </p>
              <p className="truncate text-xs text-muted-foreground">{user.organization}</p>
            </div>
          </div>
        )}
        <Button variant="outline" className="w-full gap-2" onClick={logout}>
          <LogOut className="h-4 w-4" />
          {(!collapsed || isMobile) && <span>Déconnexion</span>}
        </Button>
      </div>
    </div>
  );
};
