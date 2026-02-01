// ============================================
// FATI - Dashboard Annonceurs
// Espace Communication et Partenaires
// ============================================

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { geographyService } from '@/services/geography';
import { dataCollectionService } from '@/services/dataCollection';
import { dashboardsService } from '@/services/dashboards';
import type { GeneratedReport } from '@/services/dashboards';
import type { DataCollection } from '@/types';
import {
    Megaphone,
    Users,
    TrendingUp,
    Globe,
    Plus,
    ArrowRight,
    FileText,
    Calendar,
    Loader2,
    Hospital,
    GraduationCap
} from 'lucide-react';

export const AnnonceurDashboard = () => {
    const [stats, setStats] = useState({
        totalPopulation: 0,
        activeCampaigns: 0,
        avgResponseRate: 0,
        regionsCount: 0
    });
    const [recentCampaigns, setRecentCampaigns] = useState<DataCollection[]>([]);
    const [recentReports, setRecentReports] = useState<GeneratedReport[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [regRes, collRes, repRes] = await Promise.all([
                    geographyService.getRegions(),
                    dataCollectionService.getCollections(),
                    dashboardsService.getReports()
                ]);

                const totalPop = regRes.results.reduce((acc, r: any) => acc + (r.population || 0), 0);
                const activeOnes = collRes.results.filter(c => c.status === 'ongoing').length;
                const avgRate = collRes.results.length > 0
                    ? collRes.results.reduce((acc, c) => acc + (c.responseRate || 0), 0) / collRes.results.length
                    : 0;

                setStats({
                    totalPopulation: totalPop,
                    activeCampaigns: activeOnes,
                    avgResponseRate: avgRate,
                    regionsCount: regRes.count
                });
                setRecentCampaigns(collRes.results.slice(0, 3));
                setRecentReports(repRes.results.slice(0, 4));
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    useEffect(() => {
        if (!isLoading && containerRef.current) {
            gsap.fromTo(
                containerRef.current.children,
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    stagger: 0.1,
                    ease: 'power2.out',
                }
            );
        }
    }, [isLoading]);

    if (isLoading) {
        return (
            <MainLayout space="annonceur">
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-purple-600" />
                    <p className="text-muted-foreground animate-pulse font-medium">Initialisation de votre espace...</p>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout space="annonceur">
            <div ref={containerRef} className="max-w-[1600px] mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-600 shadow-lg shadow-purple-200 dark:shadow-none">
                            <Megaphone className="h-7 w-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Espace Annonceurs</h1>
                            <p className="text-muted-foreground">
                                Pilotage des campagnes et analyse de la portée territoriale
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="gap-2 bg-white dark:bg-slate-900 shadow-sm" asChild>
                            <a href="/annonceur/reports">
                                <Calendar className="h-4 w-4" />
                                Rapports
                            </a>
                        </Button>
                        <Button className="gap-2 bg-purple-600 hover:bg-purple-700 shadow-purple-100" asChild>
                            <a href="/annonceur/campaigns">
                                <Plus className="h-4 w-4" />
                                Gérer les Campagnes
                            </a>
                        </Button>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-none bg-white dark:bg-slate-900 shadow-xl border-l-4 border-l-purple-500">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Portée Potentielle</p>
                                    <p className="mt-2 text-3xl font-bold">{(stats.totalPopulation / 1000000).toFixed(1)}M</p>
                                </div>
                                <div className="h-12 w-12 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                                    <Users className="h-6 w-6 text-purple-600" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-2">
                                <span className="text-xs text-muted-foreground font-medium">Population totale recensée</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none bg-white dark:bg-slate-900 shadow-xl border-l-4 border-l-blue-500">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Taux de Réponse</p>
                                    <p className="mt-2 text-3xl font-bold">{Math.round(stats.avgResponseRate)}%</p>
                                </div>
                                <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                                    <TrendingUp className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-2">
                                <Badge variant="outline" className="text-blue-600 bg-blue-50 border-blue-100 font-bold">Engagement</Badge>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none bg-white dark:bg-slate-900 shadow-xl border-l-4 border-l-orange-500">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Régions de Collecte</p>
                                    <p className="mt-2 text-3xl font-bold">{stats.regionsCount}</p>
                                </div>
                                <div className="h-12 w-12 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
                                    <Globe className="h-6 w-6 text-orange-600" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-2">
                                <span className="text-xs text-muted-foreground font-medium">Couverture territoriale active</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none bg-white dark:bg-slate-900 shadow-xl border-l-4 border-l-teal-500">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Campagnes Actives</p>
                                    <p className="mt-2 text-3xl font-bold">{stats.activeCampaigns}</p>
                                </div>
                                <div className="h-12 w-12 rounded-xl bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center">
                                    <Megaphone className="h-6 w-6 text-teal-600" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-2">
                                <Badge variant="outline" className="text-teal-600 bg-teal-50 border-teal-100 font-bold uppercase text-[10px]">Statut: Optimal</Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Sections */}
                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Active Campaigns */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border-none shadow-xl overflow-hidden bg-white dark:bg-slate-900">
                            <CardHeader className="bg-slate-50/50 dark:bg-slate-800/20 border-b">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-lg">Campagnes récentes</CardTitle>
                                        <CardDescription>Flux d'activité de vos collectes et diffusions</CardDescription>
                                    </div>
                                    <Button variant="ghost" size="sm" className="text-purple-600 font-bold" asChild>
                                        <a href="/annonceur/campaigns">Voir tout</a>
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {recentCampaigns.length > 0 ? recentCampaigns.map((camp) => (
                                        <div key={camp.id} className="p-6 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors flex items-center gap-6 group">
                                            <div className="h-12 w-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                                <Megaphone className="h-6 w-6 text-purple-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-semibold text-base truncate">{camp.name}</h4>
                                                    <Badge variant="secondary" className="text-[10px] uppercase font-bold px-2">
                                                        {camp.sector as string === 'both' ? 'Mixte' : camp.sector}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                    <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {camp.year}</span>
                                                    <span className="flex items-center gap-1.5 font-bold text-indigo-600 dark:text-indigo-400">
                                                        <TrendingUp className="h-3.5 w-3.5" /> {Math.round(camp.responseRate)}% de réponse
                                                    </span>
                                                </div>
                                                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-3 overflow-hidden">
                                                    <div
                                                        className="h-full bg-purple-500 rounded-full transition-all duration-1000"
                                                        style={{ width: `${camp.responseRate}%` }}
                                                    />
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="icon" className="group-hover:translate-x-1 transition-transform" asChild>
                                                <a href="/annonceur/campaigns">
                                                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                                                </a>
                                            </Button>
                                        </div>
                                    )) : (
                                        <div className="p-12 text-center text-muted-foreground italic">
                                            Aucune campagne enregistrée.
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Territorial Reach Analysis Card */}
                        <Card className="border-none shadow-xl bg-white dark:bg-slate-900 overflow-hidden">
                            <CardHeader className="bg-slate-50/50 dark:bg-slate-800/20 border-b">
                                <CardTitle className="text-lg font-bold">Portée Territoriale</CardTitle>
                                <CardDescription>Consultez l'impact de vos actions sur les différents segments de la population</CardDescription>
                            </CardHeader>
                            <CardContent className="p-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center text-rose-600">
                                                <Hospital className="h-5 w-5" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-bold">Ciblage Santé</p>
                                                <p className="text-xs text-muted-foreground">Accès direct aux infrastructures sanitaires territoriales.</p>
                                            </div>
                                            <Button variant="ghost" size="sm" className="text-rose-600" asChild>
                                                <a href="/annonceur/audiences">Analyser</a>
                                            </Button>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600">
                                                <GraduationCap className="h-5 w-5" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-bold">Ciblage Éducation</p>
                                                <p className="text-xs text-muted-foreground">Portée sur le réseau des établissements scolaires.</p>
                                            </div>
                                            <Button variant="ghost" size="sm" className="text-indigo-600" asChild>
                                                <a href="/annonceur/audiences">Analyser</a>
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 flex items-center justify-center border border-slate-100 dark:border-slate-800">
                                        <div className="text-center">
                                            <Globe className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                                            <p className="text-2xl font-black">{stats.regionsCount}</p>
                                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Régions Couvertes</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-6">
                        <Card className="border-none shadow-2xl bg-gradient-to-br from-purple-600 to-indigo-800 text-white overflow-hidden relative">
                            <div className="absolute -right-8 -bottom-8 opacity-20">
                                <TrendingUp className="h-40 w-40" />
                            </div>
                            <CardContent className="p-8 relative">
                                <Badge className="mb-4 bg-white/20 hover:bg-white/30 border-none text-white font-bold">PRO</Badge>
                                <h3 className="text-2xl font-black mb-2 leading-tight">Optimisez votre Impact</h3>
                                <p className="text-purple-100 text-sm mb-6 leading-relaxed opacity-90">
                                    Utilisez nos rapports détaillés pour affiner votre stratégie de communication territoriale.
                                </p>
                                <Button className="w-full bg-white text-purple-700 hover:bg-white/90 font-bold border-none shadow-lg" asChild>
                                    <a href="/annonceur/reports">
                                        Voir les Analyses
                                    </a>
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-xl bg-white dark:bg-slate-900">
                            <CardHeader className="pb-2 border-b">
                                <CardTitle className="text-base font-bold flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-purple-600" />
                                    Derniers Rapports
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <ScrollArea className="h-[280px]">
                                    <div className="divide-y divide-slate-50 dark:divide-slate-800">
                                        {recentReports.length > 0 ? recentReports.map((rep) => (
                                            <div key={rep.id} className="p-4 flex gap-4 items-start hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                                <div className="h-9 w-9 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                                                    <FileText className="h-5 w-5 text-slate-500" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-center mb-0.5">
                                                        <span className="text-xs font-bold truncate">Rapport #{rep.id.slice(0, 6)}</span>
                                                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">{new Date(rep.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                    <p className="text-[11px] text-muted-foreground line-clamp-1 italic">Prêt pour téléchargement</p>
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="p-8 text-center text-xs text-muted-foreground">
                                                Aucun rapport disponible.
                                            </div>
                                        )}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-xl bg-slate-900 text-white">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base font-bold flex items-center gap-2">
                                    <Globe className="h-4 w-4 text-blue-400" />
                                    Centre de Ressources
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 space-y-2">
                                <Button variant="ghost" className="w-full justify-between text-[11px] h-9 px-3 hover:bg-white/10 text-slate-300">
                                    Guide de communication FATI
                                    <ArrowRight className="h-3 w-3" />
                                </Button>
                                <Button variant="ghost" className="w-full justify-between text-[11px] h-9 px-3 hover:bg-white/10 text-slate-300">
                                    Kit de marque Territoriale
                                    <ArrowRight className="h-3 w-3" />
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};
