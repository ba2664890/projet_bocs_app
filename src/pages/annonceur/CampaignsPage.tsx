import { useState, useEffect, useRef, useCallback, FormEvent } from 'react';
import { gsap } from 'gsap';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { dataCollectionService } from '@/services/dataCollection';
import type { DataCollection } from '@/types';
import {
    Megaphone,
    Plus,
    Search,
    Filter,
    MoreVertical,
    BarChart3,
    Calendar,
    Loader2,
    AlertCircle
} from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export const CampaignsPage = () => {
    const currentYear = new Date().getFullYear();
    const [searchTerm, setSearchTerm] = useState('');
    const [campaigns, setCampaigns] = useState<DataCollection[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [createError, setCreateError] = useState<string | null>(null);
    const [createForm, setCreateForm] = useState({
        name: '',
        description: '',
        sector: 'health',
        year: String(currentYear),
        period: 'Annuel',
        startDate: `${currentYear}-01-01`,
        endDate: `${currentYear}-12-31`,
        geographicScope: 'national',
    });
    const containerRef = useRef<HTMLDivElement>(null);

    const fetchCampaigns = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await dataCollectionService.getCollections();
            setCampaigns(response.results);
        } catch (error) {
            console.error('Failed to fetch campaigns:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCampaigns();
    }, [fetchCampaigns]);

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

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'ongoing':
                return <Badge className="bg-emerald-500 hover:bg-emerald-600">En cours</Badge>;
            case 'planned':
                return <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200">Planifiée</Badge>;
            case 'completed':
                return <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200">Terminée</Badge>;
            case 'closed':
                return <Badge variant="outline" className="text-slate-500 border-slate-200">Clôturée</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    const filteredCampaigns = campaigns.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const resetCreateForm = () => {
        setCreateForm({
            name: '',
            description: '',
            sector: 'health',
            year: String(currentYear),
            period: 'Annuel',
            startDate: `${currentYear}-01-01`,
            endDate: `${currentYear}-12-31`,
            geographicScope: 'national',
        });
    };

    const handleCreateCollection = async (event: FormEvent) => {
        event.preventDefault();
        setCreateError(null);
        setIsCreating(true);

        try {
            const payload: any = {
                name: createForm.name,
                description: createForm.description,
                sector: createForm.sector,
                year: Number(createForm.year),
                period: createForm.period,
                startDate: createForm.startDate,
                endDate: createForm.endDate,
                geographicScope: createForm.geographicScope,
                status: 'planned',
            };

            const created = await dataCollectionService.createCollection(payload);
            setCampaigns((prev) => [created, ...prev]);
            setIsCreateOpen(false);
            resetCreateForm();
        } catch (error: any) {
            const apiError =
                error?.response?.data?.detail ||
                error?.response?.data?.name?.[0] ||
                error?.response?.data?.error;
            setCreateError(apiError || 'Impossible de créer la collecte.');
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <MainLayout space="annonceur">
            <div ref={containerRef} className="max-w-[1600px] mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Gestion des Collectes</h1>
                        <p className="text-muted-foreground mt-1">Gérez vos formulaires et collectes de données territoriales.</p>
                    </div>
                    <Button
                        className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-lg shadow-indigo-200 dark:shadow-none"
                        onClick={() => setIsCreateOpen(true)}
                    >
                        <Plus className="h-4 w-4" />
                        Nouvelle Collecte
                    </Button>
                </div>

                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogContent className="sm:max-w-xl">
                        <DialogHeader>
                            <DialogTitle>Nouvelle collecte</DialogTitle>
                            <DialogDescription>
                                Créez une nouvelle campagne de collecte citoyenne.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleCreateCollection} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="collection-name">Nom</Label>
                                <Input
                                    id="collection-name"
                                    value={createForm.name}
                                    onChange={(event) => setCreateForm((prev) => ({ ...prev, name: event.target.value }))}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="collection-description">Description</Label>
                                <Textarea
                                    id="collection-description"
                                    value={createForm.description}
                                    onChange={(event) => setCreateForm((prev) => ({ ...prev, description: event.target.value }))}
                                />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Secteur</Label>
                                    <Select
                                        value={createForm.sector}
                                        onValueChange={(value) => setCreateForm((prev) => ({ ...prev, sector: value }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="health">Santé</SelectItem>
                                            <SelectItem value="education">Éducation</SelectItem>
                                            <SelectItem value="both">Santé & Éducation</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="collection-year">Année</Label>
                                    <Input
                                        id="collection-year"
                                        type="number"
                                        min={2000}
                                        max={2100}
                                        value={createForm.year}
                                        onChange={(event) => setCreateForm((prev) => ({ ...prev, year: event.target.value }))}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="collection-start">Date de début</Label>
                                    <Input
                                        id="collection-start"
                                        type="date"
                                        value={createForm.startDate}
                                        onChange={(event) => setCreateForm((prev) => ({ ...prev, startDate: event.target.value }))}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="collection-end">Date de fin</Label>
                                    <Input
                                        id="collection-end"
                                        type="date"
                                        value={createForm.endDate}
                                        onChange={(event) => setCreateForm((prev) => ({ ...prev, endDate: event.target.value }))}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="collection-period">Période</Label>
                                    <Input
                                        id="collection-period"
                                        value={createForm.period}
                                        onChange={(event) => setCreateForm((prev) => ({ ...prev, period: event.target.value }))}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Portée géographique</Label>
                                    <Select
                                        value={createForm.geographicScope}
                                        onValueChange={(value) => setCreateForm((prev) => ({ ...prev, geographicScope: value }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="national">Nationale</SelectItem>
                                            <SelectItem value="regional">Régionale</SelectItem>
                                            <SelectItem value="department">Départementale</SelectItem>
                                            <SelectItem value="commune">Communale</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {createError && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{createError}</AlertDescription>
                                </Alert>
                            )}

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                                    Annuler
                                </Button>
                                <Button type="submit" disabled={isCreating}>
                                    {isCreating ? 'Création...' : 'Créer la collecte'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Filters & Search */}
                <Card className="border-none shadow-sm bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                    <CardContent className="p-4 flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Rechercher une collecte..."
                                className="pl-10 bg-white dark:bg-slate-950"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" className="gap-2 bg-white dark:bg-slate-950">
                                <Filter className="h-4 w-4" />
                                Filtres
                            </Button>
                            <Button variant="outline" className="gap-2 bg-white dark:bg-slate-950">
                                <Calendar className="h-4 w-4" />
                                Période
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Campaigns Table */}
                <Card className="border-none shadow-xl overflow-hidden bg-white dark:bg-slate-900">
                    <CardHeader className="border-b bg-slate-50/50 dark:bg-slate-800/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg">Toutes les collectes</CardTitle>
                                <CardDescription>Visualisez la performance globale des collectes territoriales.</CardDescription>
                            </div>
                            <Badge variant="outline" className="font-mono">{filteredCampaigns.length} au total</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-4">
                                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                                <p className="text-muted-foreground animate-pulse">Chargement des données...</p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent bg-slate-50/30 dark:bg-slate-800/30">
                                        <TableHead className="w-[400px] py-4">Nom de la Collecte</TableHead>
                                        <TableHead>Secteur</TableHead>
                                        <TableHead>Statut</TableHead>
                                        <TableHead>Année</TableHead>
                                        <TableHead>Taux de Réponse</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredCampaigns.map((campaign) => (
                                        <TableRow key={campaign.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <TableCell className="font-medium py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                                                        <Megaphone className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <p>{campaign.name}</p>
                                                        <p className="text-xs text-muted-foreground font-normal">Du {new Date(campaign.startDate).toLocaleDateString()} au {new Date(campaign.endDate).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="capitalize">
                                                    {campaign.sector as string === 'both' ? 'Santé & Éducation' : campaign.sector}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                                    <span className="font-mono text-sm">{campaign.year}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1.5 min-w-[120px]">
                                                    <div className="flex items-center justify-between text-xs">
                                                        <span className="font-bold text-indigo-600 dark:text-indigo-400">{Math.round(campaign.responseRate)}%</span>
                                                        <BarChart3 className="h-3.5 w-3.5 text-indigo-500" />
                                                    </div>
                                                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-indigo-500 rounded-full transition-all duration-1000"
                                                            style={{ width: `${campaign.responseRate}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {filteredCampaigns.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                                Aucune collecte trouvée.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    );
};
