// ============================================
// FATI - Liste des Structures
// Vue unifiée des infrastructures (Santé & Éducation)
// ============================================

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import {
    Search,
    Filter,
    Building2,
    MapPin,
    School,
    HeartPulse,
    Plus,
    Loader2
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
import { facilitiesService } from '@/services/facilities';
import { useAuthStore } from '@/store';
import { useEducationFacilities, useHealthFacilities } from '@/hooks/useData';

export const FacilitiesPage = () => {
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');

    // Récupération des données selon le rôle ou le contexte
    const { facilities: healthFacilities, isLoading: loadingHealth } = useHealthFacilities();
    const { facilities: educationFacilities, isLoading: loadingEducation } = useEducationFacilities();

    // Détermination des structures à afficher
    const allFacilities = useMemo(() => {
        if (user?.role === 'admin') {
            return [...healthFacilities, ...educationFacilities];
        }
        if (user?.role === 'sector_health') return healthFacilities;
        if (user?.role === 'sector_education') return educationFacilities;
        return [];
    }, [user, healthFacilities, educationFacilities]);

    const loading = loadingHealth || loadingEducation;

    // Filtrage
    const filteredFacilities = useMemo(() => {
        return allFacilities.filter(facility => {
            const matchesSearch = facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                facility.communeName.toLowerCase().includes(searchQuery.toLowerCase());
            const computedStatus = facility.isActive ? 'operational' : 'maintenance';
            const matchesStatus = statusFilter === 'all' || computedStatus === statusFilter;
            const matchesType = typeFilter === 'all' || facility.type === typeFilter;

            return matchesSearch && matchesStatus && matchesType;
        });
    }, [allFacilities, searchQuery, statusFilter, typeFilter]);

    if (loading) {
        return (
            <MainLayout space="sector">
                <div className="flex items-center justify-center h-[calc(100vh-200px)]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout space="sector">
            <div className="max-w-[1600px] mx-auto space-y-8 pb-12 animate-in fade-in duration-500">

                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-card p-6 rounded-xl border shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                            <Building2 className="h-7 w-7" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-foreground">Infrastructures</h1>
                            <p className="text-muted-foreground text-lg">
                                Gestion et cartographie des établissements et structures
                            </p>
                        </div>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="gap-2 bg-primary hover:bg-primary/90 shadow-sm">
                                <Plus className="h-4 w-4" />
                                Nouvelle structure
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Nouvelle structure</DialogTitle>
                                <DialogDescription>Ajouter un établissement de santé ou éducatif</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={async (e) => {
                                e.preventDefault();
                                const form = e.target as HTMLFormElement & {
                                    name: { value: string };
                                    sector: { value: string };
                                    type: { value: string };
                                    communeName: { value: string };
                                };

                                const payload = {
                                    name: form.name.value,
                                    sector: form.sector.value as any,
                                    type: form.type.value,
                                    communeName: form.communeName.value,
                                    isActive: true,
                                };

                                try {
                                    if (payload.sector === 'health') {
                                        await facilitiesService.createHealthFacility(payload as any);
                                    } else {
                                        await facilitiesService.createEducationFacility(payload as any);
                                    }
                                    window.location.reload();
                                } catch (err) {
                                    console.error('Failed to create facility', err);
                                    alert('Échec de création');
                                }
                            }}>
                                <div className="grid gap-2">
                                    <div>
                                        <label className="text-sm">Nom</label>
                                        <Input name="name" required />
                                    </div>
                                    <div>
                                        <label className="text-sm">Secteur</label>
                                        <Select defaultValue="health" name="sector">
                                            <SelectTrigger className="w-full">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="health">Santé</SelectItem>
                                                <SelectItem value="education">Éducation</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <label className="text-sm">Type</label>
                                        <Input name="type" />
                                    </div>
                                    <div>
                                        <label className="text-sm">Commune</label>
                                        <Input name="communeName" />
                                    </div>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button variant="ghost">Annuler</Button>
                                        </DialogClose>
                                        <Button type="submit">Créer</Button>
                                    </DialogFooter>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Filters & Controls */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 border-b">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Rechercher une structure..."
                            className="pl-9 bg-background"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[160px]">
                                <SelectValue placeholder="État" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tous les états</SelectItem>
                                <SelectItem value="operational">Opérationnel</SelectItem>
                                <SelectItem value="maintenance">Maintenance</SelectItem>
                                <SelectItem value="construction">En construction</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Type de structure" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tous les types</SelectItem>
                                <SelectItem value="hospital">Hôpital</SelectItem>
                                <SelectItem value="health_center">Centre de santé</SelectItem>
                                <SelectItem value="primary">École primaire</SelectItem>
                                <SelectItem value="high_school">Lycée / Collège</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button variant="outline" size="icon">
                            <MapPin className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Results Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredFacilities.map((facility) => (
                        <Card key={facility.id} className="group hover:shadow-md transition-all duration-300 border-muted-foreground/10 hover:border-primary/50 cursor-pointer" onClick={() => navigate(`/sector/facilities/${facility.id}`)}>
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className={`p-2 rounded-lg ${facility.sector === 'health'
                                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                                        : 'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400'
                                        }`}>
                                        {facility.sector === 'health' ? <HeartPulse className="h-5 w-5" /> : <School className="h-5 w-5" />}
                                    </div>
                                    <Badge variant={facility.isActive ? 'default' : 'outline'} className={
                                        facility.isActive ? 'bg-green-100 text-green-700 hover:bg-green-100 border-none' : ''
                                    }>
                                        {facility.isActive ? 'Opérationnel' : 'Maintenance'}
                                    </Badge>
                                </div>
                                <CardTitle className="mt-4 text-lg font-semibold truncate group-hover:text-primary transition-colors">
                                    {facility.name}
                                </CardTitle>
                                <CardDescription className="flex items-center gap-1.5 text-xs">
                                    <MapPin className="h-3.5 w-3.5" />
                                    {facility.communeName}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                                    <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded border border-slate-100 dark:border-slate-800">
                                        <p className="text-xs text-muted-foreground">Type</p>
                                        <p className="font-medium truncate capitalize">{facility.type.replace('_', ' ')}</p>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded border border-slate-100 dark:border-slate-800">
                                        <p className="text-xs text-muted-foreground">Capacité</p>
                                        <p className="font-medium">
                                            {facility.sector === 'health' && facility.bedCapacity ? `${facility.bedCapacity} lits` :
                                                facility.sector === 'education' && facility.studentCapacity ? `${facility.studentCapacity} étu.` :
                                                    'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {filteredFacilities.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                            <div className="bg-muted/30 p-4 rounded-full mb-4">
                                <Filter className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold">Aucun résultat trouvé</h3>
                            <p className="text-muted-foreground max-w-sm mt-2">
                                Essayez de modifier vos filtres ou votre recherche pour trouver ce que vous cherchez.
                            </p>
                            <Button variant="outline" className="mt-6" onClick={() => { setSearchQuery(''); setStatusFilter('all'); setTypeFilter('all'); }}>
                                Réinitialiser les filtres
                            </Button>
                        </div>
                    )}
                </div>

            </div>
        </MainLayout>
    );
};
