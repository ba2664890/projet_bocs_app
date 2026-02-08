// ============================================
// FATI - Workflows de Validation
// Espace Administration
// ============================================

import { useMemo } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    CheckCircle2,
    AlertCircle,
    ArrowRight,
    Plus,
    Play,
    Pause,
    MoreVertical,
    History,
    Layers,
    Clock,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDataCollections, useAuditLogs } from '@/hooks/useData';

export const WorkflowsPage = () => {
    const { collections, isLoading: isLoadingCollections } = useDataCollections();
    const { logs } = useAuditLogs({ module: 'Workflow' });

    // Stats réelles
    const stats = useMemo(() => {
        return {
            ongoing: collections.filter(c => c.status === 'ongoing').length,
            planned: collections.filter(c => c.status === 'planned').length,
            completed: collections.filter(c => c.status === 'completed' || c.status === 'closed').length,
        };
    }, [collections]);

    return (
        <MainLayout space="admin">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">Processus & Workflows</h1>
                        <p className="text-muted-foreground font-medium">Suivi en temps réel des collectes de données et cycles de validation</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="gap-2 border-2">
                            <History className="h-4 w-4" /> Historique
                        </Button>
                        <Button className="gap-2 bg-purple-600 hover:bg-purple-700 text-white shadow-lg">
                            <Plus className="h-4 w-4" /> Nouveau Workflow
                        </Button>
                    </div>
                </div>

                {/* Workflow Stats */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="border-2 border-l-purple-600 shadow-sm">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-muted-foreground uppercase opacity-70">En cours</p>
                                    <h3 className="text-4xl font-black mt-1">{stats.ongoing}</h3>
                                </div>
                                <div className="bg-purple-50 text-purple-600 p-3 rounded-2xl">
                                    <Play className="h-6 w-6 fill-current" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-2 border-l-amber-500 shadow-sm">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-muted-foreground uppercase opacity-70">Planifiés</p>
                                    <h3 className="text-4xl font-black mt-1">{stats.planned}</h3>
                                </div>
                                <div className="bg-amber-50 text-amber-600 p-3 rounded-2xl">
                                    <Pause className="h-6 w-6 fill-current" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-2 border-l-emerald-500 shadow-sm">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-muted-foreground uppercase opacity-70">Terminés</p>
                                    <h3 className="text-4xl font-black mt-1">{stats.completed}</h3>
                                </div>
                                <div className="bg-emerald-50 text-emerald-600 p-3 rounded-2xl">
                                    <CheckCircle2 className="h-6 w-6 fill-current" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Active Workflows List */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center justify-between mb-2 px-1">
                            <h2 className="text-xl font-extrabold flex items-center gap-2">
                                <Layers className="h-5 w-5 text-purple-600" />
                                Collectes Actuelles
                            </h2>
                            <Button variant="ghost" size="sm" className="font-bold underline">Vue Timeline</Button>
                        </div>

                        {collections.length > 0 ? collections.map((wf) => (
                            <Card key={wf.id} className="border-2 hover:shadow-md transition-all group">
                                <CardContent className="p-5">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 min-w-0 pr-4">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Badge variant="outline" className="text-[10px] font-black uppercase tracking-tighter h-5">
                                                    {wf.id.substring(0, 8)}
                                                </Badge>
                                                <Badge className={cn(
                                                    "text-[10px] font-black uppercase border-none",
                                                    wf.status === 'ongoing' ? "bg-purple-100 text-purple-700" : "bg-slate-100 text-slate-700"
                                                )}>
                                                    {wf.status}
                                                </Badge>
                                            </div>
                                            <h3 className="text-lg font-bold group-hover:text-purple-600 transition-colors truncate">
                                                {wf.name}
                                            </h3>
                                            <p className="text-sm text-muted-foreground font-medium mb-4 capitalize">Secteur : {wf.sector}</p>

                                            <div className="space-y-2 mb-4">
                                                <div className="flex justify-between text-xs font-bold">
                                                    <span>Taux de réponse</span>
                                                    <span>{wf.responseRate}%</span>
                                                </div>
                                                <Progress value={wf.responseRate} className="h-2 [&>div]:bg-purple-600" />
                                            </div>

                                            <div className="flex items-center gap-6 text-xs text-muted-foreground font-bold">
                                                <div className="flex items-center gap-1.5">
                                                    <Clock className="h-3.5 w-3.5" />
                                                    <span>Fin : {new Date(wf.endDate).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                                    <span>{wf.indicators.length} indicateurs</span>
                                                </div>
                                            </div>
                                        </div>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreVertical className="h-5 w-5" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem className="gap-2 font-bold"><Play className="h-4 w-4" /> Relancer rappels</DropdownMenuItem>
                                                <DropdownMenuItem className="gap-2 font-bold"><ArrowRight className="h-4 w-4" /> Détails workflow</DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600 gap-2 font-bold"><Pause className="h-4 w-4" /> Suspendre</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </CardContent>
                            </Card>
                        )) : !isLoadingCollections && (
                            <div className="p-10 text-center text-muted-foreground italic border-2 border-dashed rounded-2xl">
                                Aucune collecte de données active
                            </div>
                        )}
                    </div>

                    {/* Right Column: Timeline from Logs */}
                    <div className="space-y-6">
                        <Card className="border-2 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">Dernières Activités</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="relative space-y-6 before:absolute before:left-[11px] before:top-2 before:h-[calc(100%-16px)] before:w-0.5 before:bg-slate-100 dark:before:bg-slate-800">
                                    {logs.length > 0 ? logs.slice(0, 5).map((item, i) => (
                                        <div key={i} className="relative pl-8">
                                            <div className="absolute left-0 h-6 w-6 rounded-full border-4 border-white dark:border-slate-950 flex items-center justify-center shadow-sm bg-blue-500">
                                                <div className="h-1.5 w-1.5 rounded-full bg-white" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold leading-tight truncate max-w-[150px]">{item.action} {item.entityType}</p>
                                                <p className="text-xs text-muted-foreground mt-1 font-medium">
                                                    {item.userName} • {new Date(item.createdAt).toLocaleTimeString()}
                                                </p>
                                            </div>
                                        </div>
                                    )) : (
                                        <p className="text-sm text-center text-muted-foreground py-4">Aucune activité récente</p>
                                    )}
                                </div>
                                <Button variant="outline" className="w-full mt-6 text-xs h-9 font-bold bg-slate-50">
                                    Voir tout l'historique
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="border-2 bg-gradient-to-br from-slate-900 to-purple-950 text-white shadow-xl">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="bg-white/10 p-2 rounded-xl">
                                        <AlertCircle className="h-5 w-5 text-purple-200" />
                                    </div>
                                    <h3 className="font-bold">Analyse Intelligence</h3>
                                </div>
                                <p className="text-sm text-purple-100/80 mb-4 leading-relaxed">
                                    Le système a détecté une complétion de 100% sur les régions du Nord. Validation groupée suggérée.
                                </p>
                                <Button className="w-full bg-white text-slate-900 hover:bg-white/90 font-black h-10">
                                    Lancer validation
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};
