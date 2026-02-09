// ============================================
// FATI - Gestion des Structures (Infrastructures)
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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import {
    Search,
    Building2,
    MapPin,
    School,
    HeartPulse,
    Plus,
    Loader2,
    LayoutGrid,
    List,
    Activity,
    Users,
    Stethoscope,
    Phone,
    ChevronRight,
    SearchX
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
import { Label } from '@/components/ui/label';
import { facilitiesService } from '@/services/facilities';
import { useAuthStore } from '@/store';
import { useEducationFacilities, useHealthFacilities, useGeographicData } from '@/hooks/useData';
import { useGeolocation } from '@/hooks/useGeolocation';
import { cn } from '@/lib/utils';

export const FacilitiesPage = () => {
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);
    const { regions, departments, communes } = useGeographicData();
    const { coords, isLoading: geoLoading, getPosition } = useGeolocation();

    // State filters
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [regionFilter, setRegionFilter] = useState('all');
    const [deptFilter, setDeptFilter] = useState('all');
    const [communeFilter, setCommuneFilter] = useState('all');
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

    // State pour le formulaire de création
    const [isCreating, setIsCreating] = useState(false);
    const [newFacility, setNewFacility] = useState<any>({
        name: '',
        sector: 'health',
        type: '',
        code: '',
        regionId: '',
        departmentId: '',
        communeId: '',
        address: '',
        phone: '',
        email: '',
        managerName: '',
        capacity: ''
    });

    // Récupération des données
    const { facilities: healthFacilities, isLoading: loadingHealth } = useHealthFacilities();
    const { facilities: educationFacilities, isLoading: loadingEducation } = useEducationFacilities();

    // Fusion et filtrage
    const allFacilities = useMemo(() => {
        let list: any[] = [];
        if (user?.role === 'admin' || user?.role === 'institution') {
            list = [...healthFacilities, ...educationFacilities];
        } else if (user?.role === 'sector_health') {
            list = healthFacilities;
        } else if (user?.role === 'sector_education') {
            list = educationFacilities;
        }
        return list;
    }, [user, healthFacilities, educationFacilities]);

    const filteredFacilities = useMemo(() => {
        return allFacilities.filter(f => {
            const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                f.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                f.communeName?.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' ? f.isActive : !f.isActive);
            const matchesType = typeFilter === 'all' || f.type === typeFilter;

            const matchesRegion = regionFilter === 'all' || f.regionId === regionFilter;
            const matchesDept = deptFilter === 'all' || f.departmentId === deptFilter;
            const matchesCommune = communeFilter === 'all' || f.communeId === communeFilter;

            return matchesSearch && matchesStatus && matchesType && matchesRegion && matchesDept && matchesCommune;
        });
    }, [allFacilities, searchQuery, statusFilter, typeFilter, regionFilter, deptFilter, communeFilter]);

    // Statistiques
    const stats = useMemo(() => {
        const total = allFacilities.length;
        const active = allFacilities.filter(f => f.isActive).length;
        const health = allFacilities.filter(f => f.sector === 'health').length;
        const education = allFacilities.filter(f => f.sector === 'education').length;
        return { total, active, health, education };
    }, [allFacilities]);

    const handleCreateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const commonData = {
                name: newFacility.name,
                code: newFacility.code,
                commune: newFacility.communeId,
                address: newFacility.address,
                phone: newFacility.phone,
                email: newFacility.email,
                is_active: true,
                location: coords ? { type: 'Point', coordinates: [coords.longitude, coords.latitude] } : null
            };

            if (newFacility.sector === 'health') {
                await facilitiesService.createHealthFacility({
                    ...commonData,
                    facility_type: newFacility.type,
                    manager_name: newFacility.managerName,
                    bed_capacity: parseInt(newFacility.capacity) || 0,
                } as any);
            } else {
                await facilitiesService.createEducationFacility({
                    ...commonData,
                    facility_type: newFacility.type,
                    principal_name: newFacility.managerName,
                    student_capacity: parseInt(newFacility.capacity) || 0,
                    level: 'basic'
                } as any);
            }
            window.location.reload();
        } catch (err) {
            console.error(err);
            alert("Erreur lors de la création de la structure. Vérifiez les données saisies.");
        }
    };

    if (loadingHealth || loadingEducation) {
        return (
            <MainLayout space="sector" title="Structures">
                <div className="flex h-[600px] items-center justify-center">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout space="sector" title="Structures">
            <div className="space-y-6">
                {/* Header & Stats Banner */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="bg-gradient-to-br from-indigo-600 to-blue-700 text-white border-none shadow-lg">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-indigo-100 text-xs font-bold uppercase tracking-wider">Total Structures</p>
                                    <h3 className="text-3xl font-black mt-1">{stats.total}</h3>
                                </div>
                                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                    <Building2 className="h-6 w-6" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">Opérationnelles</p>
                                    <h3 className="text-3xl font-black mt-1">{stats.active}</h3>
                                </div>
                                <div className="p-3 bg-emerald-100 dark:bg-emerald-800/50 text-emerald-600 dark:text-emerald-400 rounded-xl">
                                    <Activity className="h-6 w-6" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">Santé</p>
                                    <h3 className="text-3xl font-black mt-1">{stats.health}</h3>
                                </div>
                                <div className="p-3 bg-blue-100 dark:bg-blue-800/50 text-blue-600 dark:text-blue-400 rounded-xl">
                                    <HeartPulse className="h-6 w-6" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-teal-50 dark:bg-teal-900/10 border-teal-100 dark:border-teal-800">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-teal-600 dark:text-teal-400 text-xs font-bold uppercase tracking-wider">Éducation</p>
                                    <h3 className="text-3xl font-black mt-1">{stats.education}</h3>
                                </div>
                                <div className="p-3 bg-teal-100 dark:bg-teal-800/50 text-teal-600 dark:text-teal-400 rounded-xl">
                                    <School className="h-6 w-6" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters & Actions Bar */}
                <div className="bg-card p-6 rounded-xl border shadow-sm space-y-4">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative flex-1 max-w-md w-full">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Rechercher par nom, code ou commune..."
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <div className="flex rounded-lg border p-1 bg-muted/30">
                                <Button
                                    variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                                    size="sm"
                                    onClick={() => setViewMode('grid')}
                                    className="h-8 px-3 gap-2"
                                >
                                    <LayoutGrid className="h-4 w-4" />
                                    Grille
                                </Button>
                                <Button
                                    variant={viewMode === 'table' ? 'secondary' : 'ghost'}
                                    size="sm"
                                    onClick={() => setViewMode('table')}
                                    className="h-8 px-3 gap-2"
                                >
                                    <List className="h-4 w-4" />
                                    Tableau
                                </Button>
                            </div>

                            <Dialog open={isCreating} onOpenChange={setIsCreating}>
                                <DialogTrigger asChild>
                                    <Button className="gap-2 font-bold shadow-indigo-200 dark:shadow-none">
                                        <Plus className="h-5 w-5" />
                                        Nouvelle Structure
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl font-black">Référencer une infrastructure</DialogTitle>
                                        <DialogDescription>Remplissez les détails pour enregistrer une nouvelle structure dans le système.</DialogDescription>
                                    </DialogHeader>

                                    <form onSubmit={handleCreateSubmit} className="space-y-6 mt-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Secteur & Identification */}
                                            <div className="space-y-4 col-span-2 pb-2 border-b">
                                                <h4 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                                                    <Activity className="h-4 w-4" />
                                                    Identification & Secteur
                                                </h4>
                                                <div className="flex gap-4">
                                                    <div className="flex-1 space-y-2">
                                                        <Label>Secteur d'activité</Label>
                                                        <Select
                                                            value={newFacility.sector}
                                                            onValueChange={(v) => setNewFacility({ ...newFacility, sector: v, type: '' })}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Choisir le secteur" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="health">Sante publique</SelectItem>
                                                                <SelectItem value="education">Education nationale</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="flex-1 space-y-2">
                                                        <Label>Code Etablissement</Label>
                                                        <Input
                                                            placeholder="Ex: SN-HOSP-001"
                                                            value={newFacility.code}
                                                            onChange={(e) => setNewFacility({ ...newFacility, code: e.target.value })}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Nom de la structure</Label>
                                                    <Input
                                                        placeholder="Nom officiel complet"
                                                        value={newFacility.name}
                                                        onChange={(e) => setNewFacility({ ...newFacility, name: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            {/* Géographie */}
                                            <div className="space-y-4 col-span-2 pb-2 border-b">
                                                <h4 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                                                    <MapPin className="h-4 w-4" />
                                                    Localisation Administrative
                                                </h4>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div className="space-y-2">
                                                        <Label>Région</Label>
                                                        <Select
                                                            value={newFacility.regionId}
                                                            onValueChange={(v) => setNewFacility({ ...newFacility, regionId: v, departmentId: '', communeId: '' })}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Région" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {regions.map(r => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Département</Label>
                                                        <Select
                                                            value={newFacility.departmentId}
                                                            onValueChange={(v) => setNewFacility({ ...newFacility, departmentId: v, communeId: '' })}
                                                            disabled={!newFacility.regionId}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Département" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {departments.filter(d => d.parentId === newFacility.regionId).map(d => (
                                                                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Commune</Label>
                                                        <Select
                                                            value={newFacility.communeId}
                                                            onValueChange={(v) => setNewFacility({ ...newFacility, communeId: v })}
                                                            disabled={!newFacility.departmentId}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Commune" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {communes.filter(c => c.parentId === newFacility.departmentId).map(c => (
                                                                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Adresse physique</Label>
                                                    <Input
                                                        placeholder="Quartier, Rue, Précisions..."
                                                        value={newFacility.address}
                                                        onChange={(e) => setNewFacility({ ...newFacility, address: e.target.value })}
                                                    />
                                                </div>
                                                <div className="flex gap-4 items-end">
                                                    <div className="flex-1 bg-muted/20 p-3 rounded-lg border border-dashed flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <MapPin className={cn("h-4 w-4", coords ? "text-emerald-500" : "text-slate-400")} />
                                                            <span className="text-xs">
                                                                {geoLoading ? "Capture en cours..." : coords ? `GPS: ${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}` : "Position GPS non définie"}
                                                            </span>
                                                        </div>
                                                        <Button type="button" variant="outline" size="sm" onClick={getPosition} disabled={geoLoading}>
                                                            {geoLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Capturer GPS"}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Type & Capacité */}
                                            <div className="space-y-4">
                                                <h4 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                                                    <Stethoscope className="h-4 w-4" />
                                                    Type & Capacité
                                                </h4>
                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <Label>Type d'établissement</Label>
                                                        <Select value={newFacility.type} onValueChange={(v) => setNewFacility({ ...newFacility, type: v })}>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Choisir le type" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {newFacility.sector === 'health' ? (
                                                                    <>
                                                                        <SelectItem value="hospital">Hôpital</SelectItem>
                                                                        <SelectItem value="health_center">Centre de Santé</SelectItem>
                                                                        <SelectItem value="health_post">Poste de Santé</SelectItem>
                                                                        <SelectItem value="clinic">Clinique</SelectItem>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <SelectItem value="preschool">Préscolaire</SelectItem>
                                                                        <SelectItem value="primary">Primaire</SelectItem>
                                                                        <SelectItem value="secondary">Collège (CEM)</SelectItem>
                                                                        <SelectItem value="high_school">Lycée</SelectItem>
                                                                        <SelectItem value="university">Université / Supérieur</SelectItem>
                                                                        <SelectItem value="vocational">Formation Pro</SelectItem>
                                                                    </>
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>{newFacility.sector === 'health' ? "Nombre de lits" : "Capacité élèves/étudiants"}</Label>
                                                        <Input
                                                            type="number"
                                                            value={newFacility.capacity}
                                                            onChange={(e) => setNewFacility({ ...newFacility, capacity: e.target.value })}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Contact & Responsable */}
                                            <div className="space-y-4">
                                                <h4 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                                                    <Users className="h-4 w-4" />
                                                    Responsable & Contacts
                                                </h4>
                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <Label>{newFacility.sector === 'health' ? "Nom du Médecin Chef" : "Nom du Directeur"}</Label>
                                                        <Input
                                                            placeholder="Prénom et Nom"
                                                            value={newFacility.managerName}
                                                            onChange={(e) => setNewFacility({ ...newFacility, managerName: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div className="space-y-2">
                                                            <Label>Téléphone</Label>
                                                            <Input
                                                                placeholder="77..."
                                                                value={newFacility.phone}
                                                                onChange={(e) => setNewFacility({ ...newFacility, phone: e.target.value })}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label>Email</Label>
                                                            <Input
                                                                placeholder="contact@fati.sn"
                                                                value={newFacility.email}
                                                                onChange={(e) => setNewFacility({ ...newFacility, email: e.target.value })}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <DialogFooter className="pt-4 border-t">
                                            <DialogClose asChild>
                                                <Button variant="ghost">Annuler</Button>
                                            </DialogClose>
                                            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 min-w-[150px]">
                                                Enregistrer la structure
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3 pt-4 border-t">
                        <Select value={regionFilter} onValueChange={(v) => { setRegionFilter(v); setDeptFilter('all'); setCommuneFilter('all'); }}>
                            <SelectTrigger className="w-[180px] bg-muted/20">
                                <SelectValue placeholder="Région" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Toutes les régions</SelectItem>
                                {regions.map(r => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
                            </SelectContent>
                        </Select>

                        <Select value={deptFilter} onValueChange={(v) => { setDeptFilter(v); setCommuneFilter('all'); }} disabled={regionFilter === 'all'}>
                            <SelectTrigger className="w-[180px] bg-muted/20">
                                <SelectValue placeholder="Département" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tous les dépts</SelectItem>
                                {departments.filter(d => d.parentId === regionFilter).map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                            </SelectContent>
                        </Select>

                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[150px] bg-muted/20">
                                <SelectValue placeholder="Statut" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tous les statuts</SelectItem>
                                <SelectItem value="active">Opérationnel</SelectItem>
                                <SelectItem value="inactive">Maintenance</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger className="w-[180px] bg-muted/20">
                                <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tous les types</SelectItem>
                                {allFacilities.map(f => f.type).filter((v, i, a) => a.indexOf(v) === i).map(t => (
                                    <SelectItem key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1).replace('_', ' ')}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Button
                            variant="ghost"
                            size="sm"
                            className="ml-auto text-muted-foreground hover:text-primary"
                            onClick={() => {
                                setSearchQuery('');
                                setStatusFilter('all');
                                setTypeFilter('all');
                                setRegionFilter('all');
                                setDeptFilter('all');
                                setCommuneFilter('all');
                            }}
                        >
                            Réinitialiser
                        </Button>
                    </div>
                </div>

                {/* View Content */}
                {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredFacilities.map(facility => (
                            <Card key={facility.id} className="group hover:shadow-xl transition-all duration-300 border-primary/5 hover:border-primary/40 cursor-pointer overflow-hidden flex flex-col" onClick={() => navigate(`/sector/facilities/${facility.id}`)}>
                                <div className={cn(
                                    "h-2 w-full",
                                    facility.sector === 'health' ? "bg-blue-600" : "bg-teal-600"
                                )} />
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-widest bg-muted/50">
                                            {facility.code || "NO-CODE"}
                                        </Badge>
                                        <Badge className={cn(
                                            "capitalize px-2 py-0 h-5",
                                            facility.isActive ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-rose-500/10 text-rose-600 border-rose-500/20"
                                        )}>
                                            {facility.isActive ? "Actif" : "Maintenance"}
                                        </Badge>
                                    </div>
                                    <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors flex items-center gap-2">
                                        {facility.sector === 'health' ? <HeartPulse className="h-4 w-4 text-blue-600" /> : <School className="h-4 w-4 text-teal-600" />}
                                        {facility.name}
                                    </CardTitle>
                                    <CardDescription className="flex items-center gap-1 mt-1 text-xs">
                                        <MapPin className="h-3 w-3" />
                                        {facility.communeName}, {facility.departmentName}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1 space-y-4">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="bg-muted/10 p-2 rounded-lg border border-muted/20">
                                            <p className="text-[10px] uppercase font-bold text-muted-foreground">Type</p>
                                            <p className="text-xs font-bold truncate">{facility.type.replace('_', ' ')}</p>
                                        </div>
                                        <div className="bg-muted/10 p-2 rounded-lg border border-muted/20">
                                            <p className="text-[10px] uppercase font-bold text-muted-foreground">Capacité</p>
                                            <p className="text-xs font-bold truncate">
                                                {facility.bedCapacity || facility.studentCapacity || "N/A"} {facility.sector === 'health' ? 'Lits' : 'Elèves'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-2 pt-2 border-t">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Users className="h-3 w-3" />
                                            <span className="font-medium truncate">{facility.managerName || facility.principalName || "Responsable non défini"}</span>
                                        </div>
                                        {facility.phone && (
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Phone className="h-3 w-3" />
                                                <span className="font-mono">{facility.phone}</span>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                                <div className="p-3 bg-muted/20 border-t flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-[10px] font-bold text-primary">VOIR LES DETAILS</span>
                                    <ChevronRight className="h-4 w-4 text-primary" />
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="overflow-hidden border-primary/10 shadow-lg">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead className="font-bold">Code</TableHead>
                                    <TableHead className="font-bold">Nom de la structure</TableHead>
                                    <TableHead className="font-bold">Type</TableHead>
                                    <TableHead className="font-bold">Commune</TableHead>
                                    <TableHead className="font-bold">Responsable</TableHead>
                                    <TableHead className="font-bold">Capacité</TableHead>
                                    <TableHead className="font-bold">Statut</TableHead>
                                    <TableHead className="text-right font-bold">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredFacilities.map(f => (
                                    <TableRow key={f.id} className="cursor-pointer hover:bg-muted/20" onClick={() => navigate(`/sector/facilities/${f.id}`)}>
                                        <TableCell className="font-bold text-xs">{f.code || "N/A"}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {f.sector === 'health' ? <HeartPulse className="h-4 w-4 text-blue-600" /> : <School className="h-4 w-4 text-teal-600" />}
                                                <span className="font-bold">{f.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="capitalize text-xs">{f.type.replace('_', ' ')}</TableCell>
                                        <TableCell className="text-xs">{f.communeName}</TableCell>
                                        <TableCell className="text-xs italic">{f.managerName || f.principalName || "N/A"}</TableCell>
                                        <TableCell className="font-medium tabular-nums text-xs">
                                            {f.bedCapacity || f.studentCapacity || "N/A"}
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={cn(
                                                "capitalize text-[10px] px-2",
                                                f.isActive ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-rose-500/10 text-rose-600 border-rose-500/20"
                                            )}>
                                                {f.isActive ? "Actif" : "Maintenance"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                <ChevronRight className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                )}

                {filteredFacilities.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 bg-muted/10 rounded-xl border-2 border-dashed">
                        <SearchX className="h-16 w-16 text-muted-foreground/30 mb-4" />
                        <h3 className="text-xl font-bold">Aucune structure trouvée</h3>
                        <p className="text-muted-foreground mt-2">Ajustez vos filtres ou effectuez une nouvelle recherche.</p>
                        <Button
                            variant="link"
                            className="mt-4"
                            onClick={() => {
                                setSearchQuery('');
                                setStatusFilter('all');
                                setTypeFilter('all');
                                setRegionFilter('all');
                                setDeptFilter('all');
                                setCommuneFilter('all');
                            }}
                        >
                            Réinitialiser tous les filtres
                        </Button>
                    </div>
                )}
            </div>
        </MainLayout>
    );
};
