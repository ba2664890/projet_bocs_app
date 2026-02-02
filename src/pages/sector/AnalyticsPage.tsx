// ============================================
// FATI - Analyses Détaillées
// Analyses croisées et tendances
// ============================================

import { useState, useMemo } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { TrendChart } from '@/components/charts/TrendChart';
import { ComparisonChart } from '@/components/charts/ComparisonChart';
import {
    Download,
    Filter,
    TrendingUp,
    PieChart,
    BarChart2,
    Share2,
    RefreshCw
} from 'lucide-react';
import { useIndicatorValues } from '@/hooks/useData';
import { useAuthStore } from '@/store';

export const AnalyticsPage = () => {
    const { user } = useAuthStore();
    const sector = user?.role?.includes('education') ? 'education' : 'health';
    const { allValues } = useIndicatorValues({ sector });
    const [period, setPeriod] = useState('year');

    // Aggregation des données pour les graphiques
    const performanceData = useMemo(() => {
        // Grouper par année pour la tendance (au lieu de mois si pas de données mensuelles)
        // Ou utiliser une logique plus complexe si les données ont des périodes
        const grouped = allValues.reduce((acc: any, curr) => {
            const key = curr.year.toString(); // ou une autre clé de période
            if (!acc[key]) {
                acc[key] = { name: key, actual: 0, count: 0, target: 0 };
            }
            acc[key].actual += curr.value;
            acc[key].target += curr.targetValue || 0;
            acc[key].count += 1;
            return acc;
        }, {});

        return Object.values(grouped).map((item: any) => ({
            name: item.name,
            actual: Math.round(item.actual / item.count), // Moyenne
            target: Math.round(item.target / item.count),
            previous: 0 // TODO: calculer previous
        })).sort((a: any, b: any) => a.name.localeCompare(b.name));
    }, [allValues]);

    const regionalData = useMemo(() => {
        // Grouper par région (nécessite de mapper geographicId vers nom région)
        // Pour l'instant on simule avec les ids si on n'a pas les noms facilement
        const grouped = allValues.reduce((acc: any, curr) => {
            const key = curr.geographicId || 'Unknown';
            if (!acc[key]) {
                acc[key] = { name: key, value: 0, count: 0, target: 0 };
            }
            acc[key].value += curr.value;
            acc[key].target += curr.targetValue || 0;
            acc[key].count += 1;
            return acc;
        }, {});

        return Object.values(grouped).map((item: any) => ({
            name: item.name,
            value: Math.round(item.value / item.count),
            target: Math.round(item.target / item.count)
        })).slice(0, 5);
    }, [allValues]);

    // Derived KPIs
    const kpis = useMemo(() => {
        if (allValues.length === 0) return { realized: 0, increasing: 0, total: 0, alerts: 0 };

        const avgAchievement = allValues.reduce((acc, v) => acc + (v.achievementRate || 0), 0) / allValues.length;
        const indicatorsIncr = allValues.filter(v => (v.variation || 0) > 0).length;
        const indicatorsTotal = new Set(allValues.map(v => v.indicatorId)).size;

        return {
            realized: (avgAchievement * 100).toFixed(1),
            increasing: indicatorsIncr,
            total: indicatorsTotal,
            alerts: allValues.filter(v => (v.achievementRate || 0) < 0.5).length // Poor performance as "alerts"
        };
    }, [allValues]);

    return (
        <MainLayout space="sector">
            <div className="max-w-[1600px] mx-auto space-y-8 pb-12 animate-in fade-in duration-500">

                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-card p-6 rounded-xl border shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                            <TrendingUp className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">Analyses & Tendances</h1>
                            <p className="text-muted-foreground">
                                Exploration approfondie des données du secteur {sector === 'health' ? 'Santé' : 'Éducation'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="gap-2">
                            <Share2 className="h-4 w-4" />
                            Partager
                        </Button>
                        <Button className="gap-2 bg-purple-600 hover:bg-purple-700">
                            <Download className="h-4 w-4" />
                            Exporter le rapport
                        </Button>
                    </div>
                </div>

                {/* Controls Toolbar */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between sticky top-0 z-10 bg-background/95 backdrop-blur p-4 border-b rounded-lg">
                    <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                        <Select defaultValue={period} onValueChange={setPeriod}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Période" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="month">Ce mois</SelectItem>
                                <SelectItem value="quarter">Ce trimestre</SelectItem>
                                <SelectItem value="year">Cette année</SelectItem>
                                <SelectItem value="custom">Personnalisé</SelectItem>
                            </SelectContent>
                        </Select>
                        <DatePickerWithRange className="w-[260px]" />
                        <Button variant="outline" size="icon" title="Actualiser">
                            <RefreshCw className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="gap-2">
                            <Filter className="h-4 w-4" />
                            Filtres avancés
                        </Button>
                    </div>
                </div>

                {/* Analytics Content */}
                <Tabs defaultValue="performance" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3 max-w-md">
                        <TabsTrigger value="performance">Performance</TabsTrigger>
                        <TabsTrigger value="geographic">Géographique</TabsTrigger>
                        <TabsTrigger value="quality">Qualité des données</TabsTrigger>
                    </TabsList>

                    <TabsContent value="performance" className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium">Taux de réalisation</CardTitle>
                                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{kpis.realized}%</div>
                                    <p className="text-xs text-muted-foreground">Moyenne globale des objectifs</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium">Indicateurs en hausse</CardTitle>
                                    <BarChart2 className="h-4 w-4 text-green-500" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{kpis.increasing}</div>
                                    <p className="text-xs text-muted-foreground">Sur {kpis.total} indicateurs suivis</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium">Points d'attention</CardTitle>
                                    <Filter className="h-4 w-4 text-orange-500" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{kpis.alerts}</div>
                                    <p className="text-xs text-muted-foreground">Indicateurs &lt; 50% de l'objectif</p>
                                </CardContent>
                            </Card>
                        </div>

                        <Card className="col-span-4">
                            <CardHeader>
                                <CardTitle>Évolution de la Performance</CardTitle>
                                <CardDescription>Comparaison Réalisé vs Objectif vs Année N-1</CardDescription>
                            </CardHeader>
                            <CardContent className="pl-2">
                                <TrendChart
                                    data={performanceData}
                                    lines={[
                                        { key: 'actual', name: 'Réalisé 2024', color: '#8b5cf6', type: 'area' },
                                        { key: 'target', name: 'Objectif', color: '#10b981', type: 'line' },
                                        { key: 'previous', name: 'Réalisé 2023', color: '#94a3b8', type: 'line' }
                                    ]}
                                    height={400}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="geographic" className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Comparaison Régionale</CardTitle>
                                    <CardDescription>Performance par région administrative</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ComparisonChart
                                        data={regionalData}
                                        bars={[
                                            { key: 'value', name: 'Performance actuelle', color: '#8b5cf6' },
                                            { key: 'target', name: 'Moyenne nationale', color: '#e2e8f0' }
                                        ]}
                                        height={400}
                                        sortable
                                    />
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Répartition par Zone</CardTitle>
                                    <CardDescription>Contribution par district</CardDescription>
                                </CardHeader>
                                <CardContent className="flex items-center justify-center">
                                    {/* Placeholder for Pie Chart since Recharts Pie is a bit verbose to set up here without a component wrapping it */}
                                    <div className="h-[400px] w-full flex items-center justify-center bg-slate-50 dark:bg-slate-900 rounded-lg border border-dashed">
                                        <div className="text-center">
                                            <PieChart className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                                            <p className="text-muted-foreground">Visualisation en cours de développement</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="quality" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Qualité des données</CardTitle>
                                <CardDescription>Complétude et promptitude des reportings</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="font-medium">Complétude des rapports</span>
                                            <span className="text-muted-foreground">92%</span>
                                        </div>
                                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                            <div className="h-full bg-green-500 w-[92%]" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="font-medium">Promptitude (délais respectés)</span>
                                            <span className="text-muted-foreground">78%</span>
                                        </div>
                                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                            <div className="h-full bg-amber-500 w-[78%]" />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

            </div>
        </MainLayout>
    );
};
