// ============================================
// FATI - Journal d'Audit Système
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
    History,
    Search,
    Filter,
    Download,
    ShieldAlert,
    User,
    Activity,
    Settings,
    Globe,
    Lock,
    FileOutput,
    RefreshCw,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const auditLogs = [
    {
        id: 'LOG-8829',
        user: 'Moussa Sy',
        action: 'Suppression utilisateur',
        target: 'ID: 4421 (m.fall@gov.sn)',
        module: 'Users',
        type: 'critical',
        time: 'Il y a 10 min',
        ip: '192.168.1.45'
    },
    {
        id: 'LOG-8828',
        user: 'Système Sécure',
        action: 'Échec de connexion répétitif',
        target: 'Bureau Régional Kolda',
        module: 'Auth',
        type: 'warning',
        time: 'Il y a 25 min',
        ip: '45.12.89.122'
    },
    {
        id: 'LOG-8827',
        user: 'Admin Principal',
        action: 'Mise à jour configuration',
        target: 'Seuils Alertes Santé',
        module: 'Settings',
        type: 'info',
        time: 'Il y a 1 heure',
        ip: '192.168.1.1'
    },
    {
        id: 'LOG-8826',
        user: 'Aïssatou Ba',
        action: 'Export des données Q4',
        target: 'Fichier XLSX (15.4MB)',
        module: 'Reports',
        type: 'info',
        time: 'Il y a 3 heures',
        ip: '10.0.0.8'
    },
    {
        id: 'LOG-8825',
        user: 'Amadou Diallo',
        action: 'Validation de masse',
        target: '342 indicateurs Education',
        module: 'Data',
        type: 'success',
        time: 'Hier, 18:20',
        ip: '192.168.2.14'
    }
];

export const AuditPage = () => {
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
                        <Button variant="outline" className="gap-2 border-2">
                            <Download className="h-4 w-4" /> Exporter PDF
                        </Button>
                        <Button className="gap-2 bg-slate-900 text-white hover:bg-slate-800 shadow-lg">
                            <ShieldAlert className="h-4 w-4" /> Alertes Temps Réel
                        </Button>
                    </div>
                </div>

                {/* Audit Stats */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-2 border-b-4 border-b-red-600 shadow-sm">
                        <CardContent className="p-5">
                            <div className="flex items-center gap-3">
                                <div className="bg-red-50 p-2 rounded-xl">
                                    <Lock className="h-5 w-5 text-red-600" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase leading-none mb-1">Alertes Sécurité</p>
                                    <p className="text-2xl font-black">24</p>
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
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase leading-none mb-1">Actions Humaines</p>
                                    <p className="text-2xl font-black">156</p>
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
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase leading-none mb-1">Tâches Automatiques</p>
                                    <p className="text-2xl font-black">1.2k</p>
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
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase leading-none mb-1">Adresses IP Uniques</p>
                                    <p className="text-2xl font-black">42</p>
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
                                <Select defaultValue="all">
                                    <SelectTrigger className="w-[140px] h-10 border-2">
                                        <Filter className="h-3.5 w-3.5 mr-2" />
                                        <SelectValue placeholder="Module" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tout Modules</SelectItem>
                                        <SelectItem value="auth">Authentification</SelectItem>
                                        <SelectItem value="users">Utilisateurs</SelectItem>
                                        <SelectItem value="data">Données</SelectItem>
                                        <SelectItem value="settings">Système</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select defaultValue="all">
                                    <SelectTrigger className="w-[140px] h-10 border-2">
                                        <History className="h-3.5 w-3.5 mr-2" />
                                        <SelectValue placeholder="Niveau" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tout Niveaux</SelectItem>
                                        <SelectItem value="info">Information</SelectItem>
                                        <SelectItem value="success">Succès</SelectItem>
                                        <SelectItem value="warning">Avertissement</SelectItem>
                                        <SelectItem value="critical">Critique</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button variant="ghost" className="h-10 px-3">
                                    <RefreshCw className="h-4 w-4" />
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
                                <CardDescription>Visualisation chronologique des événements de la plateforme</CardDescription>
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
                                        <th className="px-6 py-4">Événement & Module</th>
                                        <th className="px-6 py-4">Utilisateur & IP</th>
                                        <th className="px-6 py-4">Cible</th>
                                        <th className="px-6 py-4">Date / Heure</th>
                                        <th className="px-6 py-4">Importance</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {auditLogs.map((log) => (
                                        <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group cursor-default">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-slate-900 group-hover:text-primary transition-colors">{log.action}</span>
                                                    <span className="text-[10px] font-bold text-muted-foreground uppercase">{log.module}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-slate-700">{log.user}</span>
                                                    <span className="text-[10px] font-mono text-muted-foreground">{log.ip}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 italic text-muted-foreground font-medium">
                                                {log.target}
                                            </td>
                                            <td className="px-6 py-4 font-bold text-slate-600">
                                                {log.time}
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant="outline" className={cn(
                                                    "border-2 font-black text-[10px] uppercase tracking-tighter shadow-sm",
                                                    log.type === 'critical' && "bg-red-50 border-red-200 text-red-600",
                                                    log.type === 'warning' && "bg-amber-50 border-amber-200 text-amber-600",
                                                    log.type === 'success' && "bg-emerald-50 border-emerald-200 text-emerald-600",
                                                    log.type === 'info' && "bg-blue-50 border-blue-200 text-blue-600",
                                                )}>
                                                    {log.type}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                    <div className="bg-slate-50 border-t p-4 flex items-center justify-between">
                        <p className="text-xs text-muted-foreground font-bold">Affichage de 5 logs sur 4,502 entries</p>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="h-8 px-4 font-bold disabled:opacity-50" disabled>Précédent</Button>
                            <Button variant="outline" size="sm" className="h-8 px-4 font-bold">Suivant</Button>
                        </div>
                    </div>
                </Card>
            </div>
        </MainLayout>
    );
};
