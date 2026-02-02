import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import {
    LayoutDashboard,
    Map,
    FileText,
    GitCompare,
    AlertTriangle
} from 'lucide-react';

export const InstitutionLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Determine active tab based on current path
    const getActiveTab = () => {
        const path = location.pathname;
        if (path.endsWith('/reports')) return 'reports';
        if (path.endsWith('/sectors')) return 'sectors';
        if (path.endsWith('/compare')) return 'compare';
        if (path.endsWith('/alerts')) return 'alerts';
        return 'dashboard';
    };

    const handleTabChange = (value: string) => {
        switch (value) {
            case 'dashboard':
                navigate('/institution');
                break;
            case 'sectors':
                navigate('/institution/sectors');
                break;
            case 'reports':
                navigate('/institution/reports');
                break;
            case 'compare':
                navigate('/institution/compare');
                break;
            case 'alerts':
                navigate('/institution/alerts');
                break;
            default:
                navigate('/institution');
        }
    };

    return (
        <MainLayout space="institution">
            <div className="max-w-[1600px] mx-auto space-y-6 pb-12">
                {/* Navigation Tabs */}
                <div className="sticky top-20 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-2">
                    <Tabs value={getActiveTab()} onValueChange={handleTabChange} className="w-full">
                        <div className="flex items-center justify-between">
                            <TabsList className="grid w-auto grid-cols-5 h-auto p-1 bg-muted/50">
                                <TabsTrigger value="dashboard" className="gap-2 px-4 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                                    <LayoutDashboard className="h-4 w-4" />
                                    <span className="hidden sm:inline">Vue d'ensemble</span>
                                </TabsTrigger>
                                <TabsTrigger value="sectors" className="gap-2 px-4 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                                    <Map className="h-4 w-4" />
                                    <span className="hidden sm:inline">Secteurs</span>
                                </TabsTrigger>
                                <TabsTrigger value="reports" className="gap-2 px-4 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                                    <FileText className="h-4 w-4" />
                                    <span className="hidden sm:inline">Rapports</span>
                                </TabsTrigger>
                                <TabsTrigger value="compare" className="gap-2 px-4 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                                    <GitCompare className="h-4 w-4" />
                                    <span className="hidden sm:inline">Comparaisons</span>
                                </TabsTrigger>
                                <TabsTrigger value="alerts" className="gap-2 px-4 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                                    <AlertTriangle className="h-4 w-4" />
                                    <span className="hidden sm:inline">Alertes</span>
                                </TabsTrigger>
                            </TabsList>
                        </div>
                    </Tabs>
                </div>

                {/* Page Content */}
                <div className="animate-in fade-in-50 slide-in-from-bottom-5 duration-500">
                    <Outlet />
                </div>
            </div>
        </MainLayout>
    );
};
