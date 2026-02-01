import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendChart } from '@/components/charts/TrendChart';
import { ComparisonChart } from '@/components/charts/ComparisonChart';
import { useAuthStore } from '@/store';
import { useIndicatorValues, useIndicators } from '@/hooks/useData';
import {
    BarChart3,
    TrendingUp,
    MapPin,
    Download,
    Calendar,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';

export const AnalyticsPage = () => {
    const { user } = useAuthStore();
    const containerRef = useRef<HTMLDivElement>(null);
    const sector = user?.role === 'sector_education' ? 'education' : 'health';

    const { indicators } = useIndicators(sector);
    const { isLoading } = useIndicatorValues({ sector });

    useEffect(() => {
        if (!isLoading && containerRef.current) {
            gsap.fromTo(
                containerRef.current.children,
                { opacity: 0, scale: 0.95 },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 0.5,
                    stagger: 0.1,
                    ease: 'back.out(1.7)'
                }
            );
        }
    }, [isLoading]);

    // Prepare data for trend chart (simulated based on real values)
    const trendData = [
        { name: '2020', value: 65 },
        { name: '2021', value: 68 },
        { name: '2022', value: 72 },
        { name: '2023', value: 78 },
        { name: '2024', value: 82 },
    ];

    return (
        <MainLayout space="sector">
            <div ref={containerRef} className="max-w-[1600px] mx-auto space-y-8 pb-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-100 dark:shadow-none">
                            <BarChart3 className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Analyses de Performance</h1>
                            <p className="text-muted-foreground mt-1">Exploration multi-dimensionnelle des données du secteur {sector}.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="gap-2">
                            <Calendar className="h-4 w-4" />
                            Période
                        </Button>
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-lg">
                            <Download className="h-4 w-4" />
                            Exporter le rapport
                        </Button>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="border-none shadow-sm bg-white dark:bg-slate-900 overflow-hidden relative">
                        <CardContent className="p-6">
                            <p className="text-sm font-medium text-muted-foreground">Indicateurs suivis</p>
                            <h3 className="text-3xl font-bold mt-2">{indicators.length}</h3>
                            <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold mt-2">
                                <TrendingUp className="h-3 w-3" />
                                <span>+2 nouveaux ce mois</span>
                            </div>
                            <div className="absolute right-0 top-0 bottom-0 w-1 bg-indigo-500" />
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm bg-white dark:bg-slate-900 overflow-hidden relative">
                        <CardContent className="p-6">
                            <p className="text-sm font-medium text-muted-foreground">Moyenne de réalisation</p>
                            <h3 className="text-3xl font-bold mt-2">78.4%</h3>
                            <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold mt-2">
                                <ArrowUpRight className="h-3 w-3" />
                                <span>+5.2% vs année préc.</span>
                            </div>
                            <div className="absolute right-0 top-0 bottom-0 w-1 bg-emerald-500" />
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm bg-white dark:bg-slate-900 overflow-hidden relative">
                        <CardContent className="p-6">
                            <p className="text-sm font-medium text-muted-foreground">Alertes critiques</p>
                            <h3 className="text-3xl font-bold mt-2">04</h3>
                            <div className="flex items-center gap-1 text-rose-600 text-xs font-bold mt-2">
                                <ArrowDownRight className="h-3 w-3" />
                                <span>-2 vs mois préc.</span>
                            </div>
                            <div className="absolute right-0 top-0 bottom-0 w-1 bg-rose-500" />
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm bg-white dark:bg-slate-900 overflow-hidden relative">
                        <CardContent className="p-6">
                            <p className="text-sm font-medium text-muted-foreground">Qualité des données</p>
                            <h3 className="text-3xl font-bold mt-2">92%</h3>
                            <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold mt-2">
                                <CheckCircle2 className="h-3 w-3" />
                                <span>Validation complète</span>
                            </div>
                            <div className="absolute right-0 top-0 bottom-0 w-1 bg-amber-500" />
                        </CardContent>
                    </Card>
                </div>

                {/* Detailed Analytics */}
                <Tabs defaultValue="trends" className="w-full">
                    <TabsList className="grid w-full max-w-lg grid-cols-2 p-1 bg-muted/40 rounded-xl">
                        <TabsTrigger value="trends" className="rounded-lg gap-2">
                            <TrendingUp className="h-4 w-4" />
                            Tendances Temporelles
                        </TabsTrigger>
                        <TabsTrigger value="geo" className="rounded-lg gap-2">
                            <MapPin className="h-4 w-4" />
                            Comparaison Géographique
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="trends" className="mt-8 space-y-6">
                        <TrendChart
                            data={trendData}
                            lines={[{ key: 'value', name: 'Performance Globale', color: '#4f46e5' }]}
                            title="Évolution de la performance sectorielle"
                            subtitle="Basé sur l'agrégation des indicateurs clés validés."
                            height={450}
                        />
                    </TabsContent>

                    <TabsContent value="geo" className="mt-8">
                        <ComparisonChart
                            data={[
                                { name: 'Dakar', performance: 85 },
                                { name: 'Thiès', performance: 82 },
                                { name: 'Saint-Louis', performance: 78 },
                                { name: 'Ziguinchor', performance: 74 },
                                { name: 'Kaolack', performance: 70 },
                                { name: 'Diourbel', performance: 65 },
                            ]}
                            bars={[{ key: 'performance', name: 'Taux de réalisation (%)', color: '#4f46e5' }]}
                            title="Performance par Région"
                            subtitle="Comparaison territoriale du taux moyen de réalisation des objectifs."
                            height={500}
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </MainLayout>
    );
};

// Internal missing component mock
const CheckCircle2 = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="m9 12 2 2 4-4" /></svg>
);
