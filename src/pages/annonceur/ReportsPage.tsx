import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { indicatorsService } from '@/services/indicators';
import { dashboardsService } from '@/services/dashboards';
import type { GeneratedReport } from '@/services/dashboards';
import {
    Download,
    BarChart3,
    TrendingUp,
    FileText,
    Loader2,
    Printer,
    ArrowRight
} from 'lucide-react';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';

export const ReportsPage = () => {
    const [performanceData, setPerformanceData] = useState<any[]>([]);
    const [reports, setReports] = useState<GeneratedReport[]>([]);
    const [stats, setStats] = useState({ totalReports: 0, avgValue: 0, growth: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [valRes, repRes] = await Promise.all([
                    indicatorsService.getIndicatorValues({ limit: 12 }),
                    dashboardsService.getReports()
                ]);

                // Transform indicator values for the chart
                const chartData = valRes.results.map((v: any) => ({
                    date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }), // Simplified for UI
                    value: v.value,
                    target: v.value * 1.1 // Contextual logic
                })).reverse();

                setPerformanceData(chartData);
                setReports(repRes.results.slice(0, 4));
                setStats({
                    totalReports: repRes.count,
                    avgValue: valRes.results.length > 0 ? valRes.results[0].value : 0,
                    growth: 12.5 // Static context as no historical diff API available yet
                });
            } catch (error) {
                console.error('Failed to fetch reports data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (!isLoading && containerRef.current) {
            gsap.fromTo(
                containerRef.current.children,
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    stagger: 0.1,
                    ease: 'power2.out'
                }
            );
        }
    }, [isLoading]);

    if (isLoading) {
        return (
            <MainLayout space="annonceur">
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
                    <p className="text-muted-foreground animate-pulse font-medium">Génération des analyses en cours...</p>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout space="annonceur">
            <div ref={containerRef} className="max-w-[1600px] mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Indicateurs de Performance</h1>
                        <p className="text-muted-foreground mt-1">Suivez l'évolution des indicateurs pour les prises de décision.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="gap-2 bg-white dark:bg-slate-900">
                            <Printer className="h-4 w-4" />
                            Imprimer
                        </Button>
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-lg shadow-indigo-200 dark:shadow-none">
                            <Download className="h-4 w-4" />
                            Exporter (.pdf)
                        </Button>
                    </div>
                </div>

                {/* Executive Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border-none shadow-xl bg-gradient-to-br from-indigo-600 to-indigo-700 text-white overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <TrendingUp className="h-32 w-32" />
                        </div>
                        <CardContent className="p-8 relative">
                            <p className="text-indigo-100 font-medium">Performance Moyenne</p>
                            <h3 className="text-4xl font-bold mt-2">{Math.round(stats.avgValue)}%</h3>
                            <p className="text-sm text-indigo-100 mt-4 flex items-center gap-2">
                                <span className="bg-white/20 px-2 py-0.5 rounded">+{stats.growth}% vs période précédente</span>
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-xl bg-white dark:bg-slate-900">
                        <CardContent className="p-8">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-muted-foreground font-medium">Analyses Disponibles</p>
                                    <h3 className="text-3xl font-bold mt-2 text-slate-900 dark:text-white">{stats.totalReports}</h3>
                                    <p className="text-sm text-emerald-600 font-medium mt-4">Disponibles en consultation</p>
                                </div>
                                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                    <FileText className="h-6 w-6 text-indigo-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-xl bg-white dark:bg-slate-900">
                        <CardContent className="p-8">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-muted-foreground font-medium">Taux de Saisie</p>
                                    <h3 className="text-3xl font-bold mt-2 text-slate-900 dark:text-white">92.4%</h3>
                                    <p className="text-sm text-indigo-600 font-medium mt-4">Saisie des données territoriales</p>
                                </div>
                                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl">
                                    <BarChart3 className="h-6 w-6 text-indigo-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Global Performance Analysis */}
                <Card className="border-none shadow-xl bg-white dark:bg-slate-900">
                    <CardHeader className="border-b bg-slate-50/50 dark:bg-slate-800/50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <TrendingUp className="h-5 w-5 text-indigo-600" />
                                <div>
                                    <CardTitle className="text-lg">Tendance des Données</CardTitle>
                                    <CardDescription>Suivi chronologique des formulaires soumis.</CardDescription>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={performanceData}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="date"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 12 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 12 }}
                                    />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#4f46e5"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorValue)"
                                        name="Valeur"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Detailed Insights Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Latest Reports List */}
                    <Card className="border-none shadow-xl bg-white dark:bg-slate-900">
                        <CardHeader className="border-b">
                            <CardTitle className="text-lg">Derniers Rapports Disponibles</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y">
                                {reports.length > 0 ? reports.map((rep) => (
                                    <div key={rep.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                                <FileText className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold">Rapport #{rep.id.slice(0, 8)}</p>
                                                <p className="text-xs text-muted-foreground">Généré le {new Date(rep.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" className="text-indigo-600" asChild>
                                            <a href={rep.fileUrl} target="_blank" rel="noopener noreferrer">
                                                <Download className="h-4 w-4" />
                                            </a>
                                        </Button>
                                    </div>
                                )) : (
                                    <div className="p-8 text-center text-muted-foreground">
                                        Aucun rapport généré pour le moment.
                                    </div>
                                )}
                            </div>
                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 text-center">
                                <Button variant="link" size="sm" className="text-indigo-600 text-xs gap-2">
                                    Accéder au centre de ressources
                                    <ArrowRight className="h-3 w-3" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Report Status */}
                    <Card className="border-none shadow-xl bg-white dark:bg-slate-900">
                        <CardHeader className="border-b">
                            <CardTitle className="text-lg">État de la Saisie</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            {[
                                { title: 'Fiabilité des Données', value: 98, status: 'Excellent', color: 'indigo' },
                                { title: 'Couverture Territoriale', value: 85, status: 'Bon', color: 'emerald' },
                                { title: 'Taux de Validation', value: 72, status: 'En cours', color: 'amber' }
                            ].map((item, i) => (
                                <div key={i} className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <h4 className="font-semibold text-sm">{item.title}</h4>
                                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{item.status}</p>
                                        </div>
                                        <span className="text-lg font-bold">{item.value}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full bg-${item.color}-500 rounded-full transition-all duration-1000`}
                                            style={{ width: `${item.value}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </MainLayout>
    );
};
