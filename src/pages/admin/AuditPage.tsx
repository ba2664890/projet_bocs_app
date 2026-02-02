// ============================================
// FATI - Journal d'Audit Système
// Espace Administration
// ============================================

import { useState } from 'react';
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
    Search,
    Filter,
    Download,
    ShieldAlert,
    User,
    Activity,
    Globe,
    Lock,
    FileOutput,
    RefreshCw,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useAuditLogs } from '@/hooks/useData';

export const AuditPage = () => {
    const [filter, setFilter] = useState({ module: 'all', type: 'all' });
    const { logs, total, isLoading, refresh } = useAuditLogs(
        filter.module !== 'all' || filter.type !== 'all' ? {
            module: filter.module !== 'all' ? filter.module : undefined,
        } : undefined
    );

    return (
        <MainLayout space="admin">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">Sécurité & Audit</h1>
                        <p className="text-muted-foreground font-medium">Surveillance exhaustive des activités critiques et journaux système</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="gap-2 border-2" onClick={() => refresh()}>
                            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} /> Rafraîchir
                        </Button>
                        <Button className="gap-2 bg-slate-900 text-white hover:bg-slate-800 shadow-lg">
                            <ShieldAlert className="h-4 w-4" /> Alertes Temps Réel
                        </Button>
                    </div>
                </div>

                {/* Audit Stats (Derived from stats or logs) */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-2 border-b-4 border-b-red-600 shadow-sm">
                        <CardContent className="p-5">
                            <div className="flex items-center gap-3">
                                <div className="bg-red-50 p-2 rounded-xl">
                                    <Lock className="h-5 w-5 text-red-600" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase leading-none mb-1">Actions Critiques</p>
                                    <p className="text-2xl font-black">{total > 0 ? Math.ceil(total * 0.05) : 0}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-2 border-b-4 border-b-blue-600 shadow-sm">
                        <CardContent className="p-5">
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-50 p-2 rounded-xl">
                                    <User className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase leading-none mb-1">Total Logs</p>
                                    <p className="text-2xl font-black">{total}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-2 border-b-4 border-b-emerald-600 shadow-sm">
                        <CardContent className="p-5">
                            <div className="flex items-center gap-3">
                                <div className="bg-emerald-50 p-2 rounded-xl">
                                    <Activity className="h-5 w-5 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase leading-none mb-1">Tâches Système</p>
                                    <p className="text-2xl font-black">Online</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-2 border-b-4 border-b-slate-600 shadow-sm">
                        <CardContent className="p-5">
                            <div className="flex items-center gap-3">
                                <div className="bg-slate-50 p-2 rounded-xl">
                                    <Globe className="h-5 w-5 text-slate-600" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase leading-none mb-1">Endpoints</p>
                                    <p className="text-2xl font-black">Active</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters & Search */}
                <Card className="border-2 shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input placeholder="Rechercher par utilisateur, action, IP..." className="pl-10 h-10 border-2" />
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <Select value={filter.module} onValueChange={(v) => setFilter({ ...filter, module: v })}>
                                    <SelectTrigger className="w-[140px] h-10 border-2">
                                        <Filter className="h-3.5 w-3.5 mr-2" />
                                        <SelectValue placeholder="Module" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tout Modules</SelectItem>
                                        <SelectItem value="Auth">Authentification</SelectItem>
                                        <SelectItem value="Users">Utilisateurs</SelectItem>
                                        <SelectItem value="Data">Données</SelectItem>
                                        <SelectItem value="Workflow">Processus</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button variant="ghost" className="h-10 px-3">
                                    <Download className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Audit Logs Table */}
                <Card className="border-2 shadow-sm overflow-hidden">
                    <CardHeader className="bg-slate-50 border-b pb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg">Journal des Opérations</CardTitle>
                                <CardDescription>Visualisation chronologique des événements réels ({total} entries)</CardDescription>
                            </div>
                            <Button size="sm" variant="outline" className="gap-2 font-bold h-8">
                                <FileOutput className="h-3.5 w-3.5" /> Exporter .csv
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-slate-50/50 text-left text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                        <th className="px-6 py-4">Utilisateur</th>
                                        <th className="px-6 py-4">Action</th>
                                        <th className="px-6 py-4">Module / Cible</th>
                                        <th className="px-6 py-4">Date / Heure</th>
                                        <th className="px-6 py-4">Détails</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y text-nowrap">
                                    {logs.map((log) => (
                                        <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group cursor-default">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-slate-900 group-hover:text-primary transition-colors">{log.userName}</span>
                                                    <span className="text-[10px] font-mono text-muted-foreground">{log.ipAddress || 'Internal'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant="outline" className="border-2 font-black text-[10px] uppercase tracking-tighter">
                                                    {log.action}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-slate-700">{log.entityType}</span>
                                                    <span className="text-[10px] text-muted-foreground italic truncate max-w-[150px]">{log.entityName || log.entityId}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-slate-600">
                                                {new Date(log.createdAt).toLocaleString('fr-FR')}
                                            </td>
                                            <td className="px-6 py-4">
                                                <Button variant="ghost" size="sm" className="h-8 px-2 text-primary font-bold">Détails</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {logs.length === 0 && !isLoading && (
                            <div className="p-20 text-center text-muted-foreground italic">Aucun log trouvé dans le système</div>
                        )}
                    </CardContent>
                    <div className="bg-slate-50 border-t p-4 flex items-center justify-between">
                        <p className="text-xs text-muted-foreground font-bold">Page 1 sur {Math.ceil(total / 10) || 1}</p>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="h-8 px-4 font-bold disabled:opacity-50" disabled>Précédent</Button>
                            <Button variant="outline" size="sm" className="h-8 px-4 font-bold" disabled={logs.length >= total}>Suivant</Button>
                        </div>
                    </div>
                </Card>
            </div>
        </MainLayout>
    );
};
