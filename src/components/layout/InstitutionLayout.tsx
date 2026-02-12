import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  LayoutDashboard,
  Map,
  FileText,
  GitCompare,
  AlertTriangle,
} from 'lucide-react';

const institutionTabs = [
  {
    value: 'dashboard',
    label: "Vue d'ensemble",
    shortLabel: 'Dashboard',
    path: '/institution',
    icon: LayoutDashboard,
  },
  {
    value: 'sectors',
    label: 'Secteurs',
    shortLabel: 'Secteurs',
    path: '/institution/sectors',
    icon: Map,
  },
  {
    value: 'reports',
    label: 'Rapports',
    shortLabel: 'Rapports',
    path: '/institution/reports',
    icon: FileText,
  },
  {
    value: 'compare',
    label: 'Comparaisons',
    shortLabel: 'Comparer',
    path: '/institution/compare',
    icon: GitCompare,
  },
  {
    value: 'alerts',
    label: 'Alertes',
    shortLabel: 'Alertes',
    path: '/institution/alerts',
    icon: AlertTriangle,
  },
] as const;

export const InstitutionLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getActiveTab = () => {
    const path = location.pathname;
    if (path.endsWith('/reports')) return 'reports';
    if (path.endsWith('/sectors')) return 'sectors';
    if (path.endsWith('/compare')) return 'compare';
    if (path.endsWith('/alerts')) return 'alerts';
    return 'dashboard';
  };

  const activeTab = getActiveTab();
  const activeTabLabel =
    institutionTabs.find((tab) => tab.value === activeTab)?.label ?? "Vue d'ensemble";

  const handleTabChange = (value: string) => {
    const tab = institutionTabs.find((item) => item.value === value);
    navigate(tab?.path ?? '/institution');
  };

  return (
    <MainLayout space="institution">
      <div className="mx-auto max-w-[1620px] pb-12">
        <div className="institution-shell">
          <div className="relative z-10 space-y-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                  Pilotage institutionnel
                </p>
                <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                  Centre de coordination stratégique
                </h2>
                <p className="max-w-3xl text-sm text-slate-600 dark:text-slate-300">
                  Suivez les performances nationales, comparez les territoires et activez rapidement les actions
                  prioritaires.
                </p>
              </div>
              <Badge
                variant="outline"
                className="w-fit border-slate-300/70 bg-white/75 px-3 py-1 text-slate-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200"
              >
                Section active: {activeTabLabel}
              </Badge>
            </div>

            <div className="sticky top-20 z-20 rounded-xl border border-slate-200/80 bg-white/90 p-2 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:border-slate-800 dark:bg-slate-950/85 dark:supports-[backdrop-filter]:bg-slate-950/70">
              <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <div className="overflow-x-auto">
                  <TabsList className="h-auto min-w-max gap-1 bg-transparent p-0">
                    {institutionTabs.map((tab) => {
                      const Icon = tab.icon;

                      return (
                        <TabsTrigger
                          key={tab.value}
                          value={tab.value}
                          className="min-w-[132px] gap-2 rounded-lg px-3 py-2.5 text-slate-600 data-[state=active]:border data-[state=active]:border-slate-200 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm dark:text-slate-300 dark:data-[state=active]:border-slate-700 dark:data-[state=active]:bg-slate-900 dark:data-[state=active]:text-slate-100"
                        >
                          <Icon className="h-4 w-4" />
                          <span className="hidden sm:inline">{tab.label}</span>
                          <span className="sm:hidden">{tab.shortLabel}</span>
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>
                </div>
              </Tabs>
            </div>

            <div className="animate-in fade-in-50 slide-in-from-bottom-3 duration-500">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
