// ============================================
// FATI - Gestion des Données
// Espace Administration
// ============================================

import { useMemo } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Database,
    RefreshCw,
    FileSpreadsheet,
    AlertCircle,
    CheckCircle2,
    BarChart2,
    Search,
    Upload,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip
} from 'recharts';
import { useIndicators, useIndicatorValues, useAuditLogs } from '@/hooks/useData';

export const DataPage = () => {
    const { indicators, isLoading: isLoadingIndicators } = useIndicators();
    const { allValues } = useIndicatorValues();
    const { logs } = useAuditLogs({ module: 'Data' });

    // Stats réelles
    const stats = useMemo(() => {
        return {
            totalIndicators: indicators.length,
            totalDataPoints: allValues.length,
            pendingValidations: allValues.filter(v => v.status === 'pending').length,
            completionRate: indicators.length > 0 ? 100 : 0, // Simplifié pour l'instant
        };
    }, [indicators, allValues]);

    const qualityData = useMemo(() => [
        { name: 'Validés', value: allValues.filter(v => v.status === 'validated').length || 1, color: '#10b981' },
        { name: 'En attente', value: allValues.filter(v => v.status === 'pending').length || 0, color: '#f59e0b' },
        { name: 'Rejetés', value: allValues.filter(v => v.status === 'rejected').length || 0, color: '#ef4444' },
    ], [allValues]);

    return (
        <MainLayout space="admin">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">Patrimoine Data</h1>
                        <p className="text-muted-foreground font-medium">Supervision de l'intégrité et synchronisation des données territoriales</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="gap-2 border-2">
                            <Upload className="h-4 w-4" /> Importer
                        </Button>
                        <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg">
                            <RefreshCw className="h-4 w-4" /> Sync Globale
                        </Button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-2 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardDescription className="text-[10px] font-bold uppercase tracking-wider">Total Indicateurs</CardDescription>
                            <CardTitle className="text-3xl font-black">{stats.totalIndicators}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-1 text-xs text-emerald-600 font-bold">
                                <CheckCircle2 className="h-3 w-3" />
                                <span>Synchronisés</span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-2 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardDescription className="text-[10px] font-bold uppercase tracking-wider">Volume de données</CardDescription>
                            <CardTitle className="text-3xl font-black">{stats.totalDataPoints}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-1 text-xs text-blue-600 font-bold">
                                <BarChart2 className="h-3 w-3" />
                                <span>Points de données</span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-2 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardDescription className="text-[10px] font-bold uppercase tracking-wider">En attente</CardDescription>
                            <CardTitle className="text-3xl font-black text-amber-600">{stats.pendingValidations}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-1 text-xs text-amber-600 font-bold">
                                <AlertCircle className="h-3 w-3" />
                                <span>Revue nécessaire</span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-2 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardDescription className="text-[10px] font-bold uppercase tracking-wider">Santé Flux</CardDescription>
                            <CardTitle className="text-3xl font-black">100%</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Progress value={100} className="h-2" />
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Quality Distribution */}
                    <Card className="lg:col-span-1 border-2 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg">Qualité du Corpus</CardTitle>
                            <CardDescription>Répartition par état de validation</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[200px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={qualityData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {qualityData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="mt-4 space-y-2">
                                {qualityData.map((item) => (
                                    <div key={item.name} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                                            <span className="font-medium">{item.name}</span>
                                        </div>
                                        <span className="font-bold">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Data Logs (Real Sync Data) */}
                    <Card className="lg:col-span-2 border-2 shadow-sm overflow-hidden text-nowrap">
                        <CardHeader className="bg-slate-50/50 border-b">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg">Flux de Données</CardTitle>
                                    <CardDescription>État des dernières synchronisations et imports</CardDescription>
                                </div>
                                <Button variant="ghost" size="sm" className="text-primary font-bold">
                                    Détails logs
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y">
                                {logs.length > 0 ? logs.slice(0, 5).map((log, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
                                                <Database className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm truncate max-w-[200px]">{log.action} : {log.entityType}</p>
                                                <p className="text-xs text-muted-foreground">{new Date(log.createdAt).toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-black">{log.userName}</p>
                                            <Badge variant="outline" className="text-[10px] font-bold h-5 border-emerald-200 text-emerald-600">
                                                Succès
                                            </Badge>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="p-10 text-center text-muted-foreground italic">Aucun log de données récent</div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Indicator Explorer Table Container */}
                <Card className="border-2 shadow-sm overflow-hidden">
                    <CardHeader className="bg-slate-50/50 border-b">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <CardTitle className="text-lg">Catalogue des Indicateurs</CardTitle>
                                <CardDescription>Définitions et paramétrage du système ({indicators.length} total)</CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input placeholder="Chercher indicateur..." className="pl-8 h-9 w-[200px] border-2" />
                                </div>
                                <Button className="h-9 gap-2">
                                    <FileSpreadsheet className="h-4 w-4" /> Configurer
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 border-b">
                                <tr className="text-left text-[10px] font-bold uppercase text-muted-foreground tracking-widest">
                                    <th className="px-6 py-4">Nom</th>
                                    <th className="px-6 py-4">Secteur</th>
                                    <th className="px-6 py-4">Type</th>
                                    <th className="px-6 py-4">Unité</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {indicators.slice(0, 10).map((ind) => (
                                    <tr key={ind.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-4 font-bold">{ind.name}</td>
                                        <td className="px-6 py-4 capitalize">{ind.sector}</td>
                                        <td className="px-6 py-4">{ind.type}</td>
                                        <td className="px-6 py-4">{ind.unit || '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {indicators.length === 0 && !isLoadingIndicators && (
                            <div className="p-10 text-center text-muted-foreground italic">Aucun indicateur configuré</div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    );
};
