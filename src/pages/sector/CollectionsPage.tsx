// ============================================
// FATI - Collectes de Données
// Gestion des campagnes de collecte
// ============================================

import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Clock,
    BarChart2,
    Search,
    Plus,
    MoreVertical,
    Calendar,
    FileText
} from 'lucide-react';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';

import { dataCollectionService } from '@/services/dataCollection';

import { useDataCollections } from '@/hooks/useData';
import { useAuthStore } from '@/store';

export const CollectionsPage = () => {
    const user = useAuthStore((state) => state.user);
    const sector = user?.role?.includes('education') ? 'education' : 'health';
    const { collections } = useDataCollections({ sector });
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [creating, setCreating] = useState(false);

    // Derived KPIs
    const totalCampaigns = collections.length;
    const activeCampaigns = collections.filter(c => c.status === 'ongoing').length;
    const avgResponseRate = collections.length > 0 ? Math.round(collections.reduce((s, c) => s + (c.responseRate || 0), 0) / collections.length) : 0;
    const totalPoints = collections.reduce((s, c) => s + (c.geographicIds ? c.geographicIds.length : 0), 0);



    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'ongoing':
                return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 border-none">En cours</Badge>;
            case 'completed':
                return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 border-none">Terminé</Badge>;
            case 'planned':
                return <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-400 border-none">À venir</Badge>;
            case 'closed':
                return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 border-none">Clôturée</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };



    const filteredCollections = collections.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <MainLayout space="sector">
            <div className="max-w-[1600px] mx-auto space-y-8 pb-12 animate-in fade-in duration-500">

                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-card p-6 rounded-xl border shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                            <FileText className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">Campagnes de Collecte</h1>
                            <p className="text-muted-foreground">
                                Gestion et suivi des remontées d'informations terrain
                            </p>
                        </div>
                    </div>
                    <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-sm">
                        <Plus className="h-4 w-4" />
                        Nouvelle campagne
                    </Button>
                </div>

                {/* Stats Summary */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Campagnes Actives</CardTitle>
                            <Clock className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{activeCampaigns}</div>
                            <p className="text-xs text-muted-foreground">Sur {totalCampaigns} campagnes</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Taux de Réponse Moyen</CardTitle>
                            <BarChart2 className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{avgResponseRate}%</div>
                            <p className="text-xs text-muted-foreground">Moyenne sur les campagnes</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Points de Collecte</CardTitle>
                            <FileText className="h-4 w-4 text-purple-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalPoints.toLocaleString('fr-FR')}</div>
                            <p className="text-xs text-muted-foreground">Points géographiques ciblés</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                <Card className="shadow-sm border-none bg-card">
                    <CardHeader className="border-b bg-muted/30">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <CardTitle>Historique des campagnes</CardTitle>
                                <CardDescription>Liste de toutes les campagnes de collecte passées et en cours</CardDescription>
                            </div>
                            <div className="relative w-full md:w-72">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Rechercher une campagne..."
                                    className="pl-9 bg-background"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                                    <DialogTrigger asChild>
                                        <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-sm">
                                            <Plus className="h-4 w-4" />
                                            Nouvelle campagne
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Nouvelle campagne de collecte</DialogTitle>
                                            <DialogDescription>Créez une nouvelle campagne et définissez la période</DialogDescription>
                                        </DialogHeader>

                                        <form
                                            onSubmit={async (e) => {
                                                e.preventDefault();
                                                const form = e.target as HTMLFormElement & {
                                                    name: { value: string };
                                                    year: { value: string };
                                                    period: { value: string };
                                                    startDate: { value: string };
                                                    endDate: { value: string };
                                                };

                                                const payload = {
                                                    name: form.name.value,
                                                    sector: sector as any,
                                                    year: Number(form.year.value) || new Date().getFullYear(),
                                                    period: form.period.value || 'annuel',
                                                    startDate: form.startDate.value || new Date().toISOString(),
                                                    endDate: form.endDate.value || new Date().toISOString(),
                                                    status: 'planned',
                                                    indicators: [],
                                                    geographicScope: 'commune',
                                                    geographicIds: [],
                                                    responseRate: 0,
                                                };

                                                try {
                                                    setCreating(true);
                                                    await dataCollectionService.createCollection(payload as any);
                                                    setIsCreateOpen(false);
                                                    // Refresh collections after create
                                                    // useDataCollections does not expose setter, so trigger full refresh by reloading window
                                                    window.location.reload();
                                                } catch (err) {
                                                    console.error('Failed to create collection', err);
                                                } finally {
                                                    setCreating(false);
                                                }
                                            }}
                                        >
                                            <div className="grid gap-2">
                                                <div className="grid grid-cols-1 gap-1">
                                                    <label className="text-sm">Nom</label>
                                                    <Input name="name" required />
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div>
                                                        <label className="text-sm">Année</label>
                                                        <Input name="year" defaultValue={new Date().getFullYear()} />
                                                    </div>
                                                    <div>
                                                        <label className="text-sm">Période</label>
                                                        <Input name="period" defaultValue="annuel" />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div>
                                                        <label className="text-sm">Début</label>
                                                        <Input name="startDate" type="date" />
                                                    </div>
                                                    <div>
                                                        <label className="text-sm">Fin</label>
                                                        <Input name="endDate" type="date" />
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <DialogClose asChild>
                                                        <Button variant="ghost">Annuler</Button>
                                                    </DialogClose>
                                                    <Button type="submit" disabled={creating}>{creating ? 'Création...' : 'Créer'}</Button>
                                                </DialogFooter>
                                            </div>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead>Campagne</TableHead>
                                    <TableHead>Période / Échéance</TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead className="w-[200px]">Progression</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredCollections.map((collection) => (
                                    <TableRow key={collection.id} className="hover:bg-muted/50 transition-colors cursor-pointer">
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium text-foreground">{collection.name}</span>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs text-muted-foreground px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800">
                                                        {collection.period}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        • {collection.sector}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Calendar className="h-3.5 w-3.5" />
                                                {new Date(collection.endDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {getStatusBadge(collection.status)}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1.5">
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="text-muted-foreground">Taux de réponse</span>
                                                    <span className="font-medium">{collection.responseRate}%</span>
                                                </div>
                                                <Progress value={collection.responseRate} className="h-2" />
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreVertical className="h-3.5 w-3.5" />
                                                        <span className="sr-only">Menu</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>Voir les détails</DropdownMenuItem>
                                                    <DropdownMenuItem>Modifier</DropdownMenuItem>
                                                    <DropdownMenuItem>Exporter les données</DropdownMenuItem>
                                                    <DropdownMenuItem className="text-red-600">Clôturer</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

            </div>
        </MainLayout>
    );
};
