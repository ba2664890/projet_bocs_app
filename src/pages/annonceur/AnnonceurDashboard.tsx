// ============================================
// FATI - Dashboard Public
// Espace de participation citoyenne
// ============================================

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
            {/* Animated Background */}
            <div className="fixed inset-0 -z-10 bg-gradient-mesh opacity-50" />
            <div className="fixed inset-0 -z-10 bg-grid-pattern" />

            <div ref={containerRef} className="max-w-[1600px] mx-auto space-y-8 relative">
                {/* Floating Decorative Elements */}
                <div className="absolute top-20 right-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl float" />
                <div className="absolute bottom-40 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl float-delayed" />

                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between relative">
                    <div className="flex items-center gap-4">
                        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 shadow-2xl hover-scale shine">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-blue-400 rounded-2xl blur opacity-50 group-hover:opacity-75 transition-opacity" />
                            <Megaphone className="h-8 w-8 text-white relative z-10 hover-glow" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black tracking-tight gradient-text-animated">Espace Public</h1>
                            <p className="text-muted-foreground font-medium mt-1">
                                Participation à la collecte des données pour l'aide à la décision
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="gap-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-lg hover-lift border-2" asChild>
                            <a href="/annonceur/reports">
                                <Calendar className="h-4 w-4" />
                                Rapports
                            </a>
                        </Button>
                        <Button className="gap-2 btn-premium text-white font-bold" asChild>
                            <a href="/annonceur/campaigns">
                                <Plus className="h-4 w-4" />
                                Suivre les Collectes
                            </a>
                        </Button>
                    </div>
                </div>


                {/* Quick Stats - Premium Gradient Cards */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Card 1 - Purple Gradient */}
                    <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-purple-500 to-blue-600 p-[2px] hover-lift">
                        <div className="relative h-full rounded-3xl bg-white dark:bg-slate-900 p-6 backdrop-blur-xl">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative z-10">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <p className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest mb-2">Portée Potentielle</p>
                                        <p className="text-4xl font-black bg-gradient-to-br from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                            {(stats.totalPopulation / 1000000).toFixed(1)}M
                                        </p>
                                    </div>
                                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/50 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                                        <Users className="h-7 w-7 text-white" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-1.5 flex-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse" style={{ width: '85%' }} />
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground font-medium mt-3">Population totale recensée</p>
                            </div>
                        </div>
                    </div>

                    {/* Card 2 - Ocean Gradient */}
                    <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-600 p-[2px] hover-lift">
                        <div className="relative h-full rounded-3xl bg-white dark:bg-slate-900 p-6 backdrop-blur-xl">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative z-10">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2">Taux de Réponse</p>
                                        <p className="text-4xl font-black bg-gradient-to-br from-blue-600 to-teal-600 bg-clip-text text-transparent">
                                            {Math.round(stats.avgResponseRate)}%
                                        </p>
                                    </div>
                                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center shadow-lg shadow-blue-500/50 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                                        <TrendingUp className="h-7 w-7 text-white" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-1.5 flex-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-blue-500 to-teal-500 rounded-full animate-pulse" style={{ width: `${stats.avgResponseRate}%` }} />
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                                        ⚡ Engagement Élevé
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card 3 - Sunset Gradient */}
                    <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-600 via-pink-500 to-rose-600 p-[2px] hover-lift">
                        <div className="relative h-full rounded-3xl bg-white dark:bg-slate-900 p-6 backdrop-blur-xl">
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative z-10">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <p className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest mb-2">Régions de Collecte</p>
                                        <p className="text-4xl font-black bg-gradient-to-br from-orange-600 to-rose-600 bg-clip-text text-transparent">
                                            {stats.regionsCount}
                                        </p>
                                    </div>
                                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center shadow-lg shadow-orange-500/50 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                                        <Globe className="h-7 w-7 text-white" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-1.5 flex-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-orange-500 to-rose-500 rounded-full animate-pulse" style={{ width: '92%' }} />
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground font-medium mt-3">Couverture territoriale active</p>
                            </div>
                        </div>
                    </div>

                    {/* Card 4 - Emerald Gradient */}
                    <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-600 via-emerald-500 to-green-600 p-[2px] hover-lift">
                        <div className="relative h-full rounded-3xl bg-white dark:bg-slate-900 p-6 backdrop-blur-xl">
                            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative z-10">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <p className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest mb-2">Collectes Actives</p>
                                        <p className="text-4xl font-black bg-gradient-to-br from-teal-600 to-green-600 bg-clip-text text-transparent">
                                            {stats.activeCampaigns}
                                        </p>
                                    </div>
                                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-teal-500 to-green-500 flex items-center justify-center shadow-lg shadow-teal-500/50 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                                        <Megaphone className="h-7 w-7 text-white" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-1.5 flex-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-teal-500 to-green-500 rounded-full animate-pulse" style={{ width: '78%' }} />
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-800">
                                        ✓ Statut Optimal
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                {/* Main Sections */}
                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Active Campaigns */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border-none shadow-2xl overflow-hidden bg-white dark:bg-slate-900 hover-lift">
                            <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-slate-800/50 dark:to-slate-800/30 border-b border-purple-100 dark:border-slate-700">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-xl font-black bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Collectes récentes</CardTitle>
                                        <CardDescription className="font-medium">Flux d'activité de vos collectes et diffusions</CardDescription>
                                    </div>
                                    <Button variant="ghost" size="sm" className="text-purple-600 font-bold hover:bg-purple-100 dark:hover:bg-purple-900/30" asChild>
                                        <a href="/annonceur/campaigns">Voir tout →</a>
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {recentCampaigns.length > 0 ? recentCampaigns.map((camp) => (
                                        <div key={camp.id} className="p-6 hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-blue-50/50 dark:hover:from-slate-800/50 dark:hover:to-slate-800/30 transition-all duration-300 flex items-center gap-6 group cursor-pointer border-l-4 border-l-transparent hover:border-l-purple-500">
                                            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg shadow-purple-500/30">
                                                <Megaphone className="h-7 w-7 text-white" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h4 className="font-bold text-lg truncate group-hover:text-purple-600 transition-colors">{camp.name}</h4>
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                                                        {camp.sector as string === 'both' ? '🔄 Mixte' : camp.sector}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                                                    <span className="flex items-center gap-1.5 font-medium"><Calendar className="h-4 w-4" /> {camp.year}</span>
                                                    <span className="flex items-center gap-1.5 font-bold text-transparent bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text">
                                                        <TrendingUp className="h-4 w-4 text-purple-600" /> {Math.round(camp.responseRate)}% de réponse
                                                    </span>
                                                </div>
                                                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-purple-500 via-purple-400 to-blue-500 rounded-full transition-all duration-1000 shimmer"
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
                                            Aucune collecte enregistrée.
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
                        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-pink-600 to-indigo-700 p-[2px] shadow-2xl hover-lift group">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-400 opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500" />
                            <div className="relative h-full rounded-3xl bg-gradient-to-br from-purple-600 via-pink-600 to-indigo-700 p-8 overflow-hidden">
                                <div className="absolute -right-8 -bottom-8 opacity-10">
                                    <TrendingUp className="h-48 w-48 animate-pulse" />
                                </div>
                                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                                <div className="relative z-10">
                                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black bg-white/20 backdrop-blur-sm border border-white/30 text-white mb-4">
                                        ✨ PRO
                                    </span>
                                    <h3 className="text-3xl font-black mb-3 leading-tight text-white drop-shadow-lg">Optimisez votre Impact</h3>
                                    <p className="text-white/90 text-sm mb-6 leading-relaxed font-medium">
                                        Utilisez nos rapports détaillés pour affiner votre stratégie de communication territoriale.
                                    </p>
                                    <Button className="w-full bg-white text-purple-700 hover:bg-white hover:scale-105 font-black border-none shadow-2xl transition-all duration-300 py-6 text-base" asChild>
                                        <a href="/annonceur/reports">
                                            Voir les Analyses →
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <Card className="border-none shadow-2xl bg-white dark:bg-slate-900 hover-lift">
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
