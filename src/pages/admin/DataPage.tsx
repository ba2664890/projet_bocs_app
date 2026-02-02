// ============================================
// FATI - Gestion des Données
// Espace Administration
// ============================================

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
    Download,
    Upload,
    RefreshCw,
    FileSpreadsheet,
    AlertCircle,
    CheckCircle2,
    BarChart2,
    Table as TableIcon,
    Search,
    Filter,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts';

const qualityData = [
    { name: 'Complets', value: 850, color: '#10b981' },
    { name: 'Manquants', value: 120, color: '#f59e0b' },
    { name: 'Erreurs', value: 30, color: '#ef4444' },
];

const syncHistory = [
    { source: 'Secteur Santé (DHIS2)', date: 'Aujourd\'hui, 12:00', status: 'success', records: 1245 },
    { source: 'SIGE (Éducation)', date: 'Hier, 18:30', status: 'success', records: 890 },
    { source: 'Recensement National', date: '01 Fév 2024', status: 'warning', records: 0 },
    { source: 'Données Communales', date: '30 Jan 2024', status: 'success', records: 450 },
];

export const DataPage = () => {
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
                            <CardTitle className="text-3xl font-black">156</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-1 text-xs text-emerald-600 font-bold">
                                <CheckCircle2 className="h-3 w-3" />
                                <span>100% Configurés</span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-2 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardDescription className="text-[10px] font-bold uppercase tracking-wider">Volume de données</CardDescription>
                            <CardTitle className="text-3xl font-black">1.2M</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-1 text-xs text-blue-600 font-bold">
                                <BarChart2 className="h-3 w-3" />
                                <span>+15k ce mois</span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-2 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardDescription className="text-[10px] font-bold uppercase tracking-wider">Erreurs de Sync</CardDescription>
                            <CardTitle className="text-3xl font-black text-red-600">3</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-1 text-xs text-red-600 font-bold">
                                <AlertCircle className="h-3 w-3" />
                                <span>Action requise</span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-2 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardDescription className="text-[10px] font-bold uppercase tracking-wider">Temps Reel</CardDescription>
                            <CardTitle className="text-3xl font-black">84%</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Progress value={84} className="h-2" />
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Quality Distribution */}
                    <Card className="lg:col-span-1 border-2 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg">Qualité du Corpus</CardTitle>
                            <CardDescription>Répartition par état de complétude</CardDescription>
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

                    {/* Data Sources Grid */}
                    <Card className="lg:col-span-2 border-2 shadow-sm overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg">Sources Connectées</CardTitle>
                                    <CardDescription>État des flux de synchronisation externes</CardDescription>
                                </div>
                                <Button variant="ghost" size="sm" className="text-primary font-bold">
                                    Gérer les API
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y">
                                {syncHistory.map((sync, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "p-2 rounded-lg",
                                                sync.status === 'success' ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                                            )}>
                                                <Database className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm">{sync.source}</p>
                                                <p className="text-xs text-muted-foreground">{sync.date}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-black">{sync.records} records</p>
                                            <Badge variant="outline" className={cn(
                                                "text-[10px] font-bold h-5",
                                                sync.status === 'success' ? "border-emerald-200 text-emerald-600" : "border-amber-200 text-amber-600"
                                            )}>
                                                {sync.status === 'success' ? 'Synchronisé' : 'Erreur réseau'}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
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
                                <CardDescription>Définitions, calculs et mappings géographiques</CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input placeholder="Chercher indicateur..." className="pl-8 h-9 w-[200px]" />
                                </div>
                                <Button className="h-9 gap-2">
                                    <FileSpreadsheet className="h-4 w-4" /> Nouveau dictionnaire
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 flex items-center justify-center h-64 bg-slate-50/30">
                        <div className="text-center">
                            <TableIcon className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                            <p className="text-sm font-medium text-muted-foreground">Explorateur de métadonnées en cours de chargement...</p>
                            <Button variant="link" className="mt-2 text-primary font-bold">Ouvrir le dictionnaire complet</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    );
};
