import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store';
import { useHealthFacilities, useEducationFacilities } from '@/hooks/useData';
import {
    Building2,
    Search,
    Filter,
    Plus,
    MapPin,
    Hospital,
    GraduationCap,
    Loader2,
    Building,
    School,
    ChevronRight
} from 'lucide-react';

export const FacilitiesPage = () => {
    const { user } = useAuthStore();
    const [searchTerm, setSearchTerm] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    // Determine sector from user role
    const isEducationSector = user?.role === 'sector_education';

    const health = useHealthFacilities();
    const education = useEducationFacilities();

    // Use relevant data based on sector
    const facilities = isEducationSector ? education.facilities : health.facilities;
    const isLoading = isEducationSector ? education.isLoading : health.isLoading;

    useEffect(() => {
        if (!isLoading && containerRef.current) {
            gsap.fromTo(
                containerRef.current.children,
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    stagger: 0.05,
                    ease: 'power2.out'
                }
            );
        }
    }, [isLoading]);

    const filteredFacilities = facilities.filter(f =>
        f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.communeName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getSectorIcon = () => {
        if (isEducationSector) return <GraduationCap className="h-6 w-6 text-white" />;
        return <Hospital className="h-6 w-6 text-white" />;
    };

    const getSectorColor = () => {
        if (isEducationSector) return 'bg-teal-500';
        return 'bg-red-500';
    };

    return (
        <MainLayout space="sector">
            <div ref={containerRef} className="max-w-[1600px] mx-auto space-y-8 pb-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className={`h-12 w-12 rounded-xl ${getSectorColor()} flex items-center justify-center shadow-lg shadow-red-100 dark:shadow-none`}>
                            {getSectorIcon()}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Structures & Établissements</h1>
                            <p className="text-muted-foreground mt-1">Gestion et cartographie des infrastructures du secteur.</p>
                        </div>
                    </div>
                    <Button className={`${getSectorColor()} hover:opacity-90 text-white gap-2 shadow-lg`}>
                        <Plus className="h-4 w-4" />
                        Nouvelle Structure
                    </Button>
                </div>

                {/* Filters */}
                <Card className="border-none shadow-sm bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                    <CardContent className="p-4 flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Rechercher par nom ou localisation..."
                                className="pl-10 bg-white dark:bg-slate-950"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" className="gap-2 bg-white dark:bg-slate-950">
                            <Filter className="h-4 w-4" />
                            Filtrer par type
                        </Button>
                    </CardContent>
                </Card>

                {/* List */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="h-10 w-10 animate-spin text-red-500" />
                        <p className="text-muted-foreground animate-pulse">Chargement des établissements...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredFacilities.map((facility) => (
                            <Card key={facility.id} className="border-none shadow-md hover:shadow-xl transition-all group overflow-hidden bg-white dark:bg-slate-900">
                                <CardContent className="p-0">
                                    <div className="p-6 space-y-4">
                                        <div className="flex items-start justify-between">
                                            <div className="h-12 w-12 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 group-hover:bg-red-50 dark:group-hover:bg-red-900/20 group-hover:text-red-500 transition-colors">
                                                {isEducationSector ? <School className="h-6 w-6" /> : <Building className="h-6 w-6" />}
                                            </div>
                                            <Badge variant="secondary" className="capitalize">
                                                {facility.type.replace('_', ' ')}
                                            </Badge>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg leading-tight group-hover:text-red-600 transition-colors">{facility.name}</h3>
                                            <div className="flex items-center gap-1.5 text-muted-foreground text-sm mt-1">
                                                <MapPin className="h-3.5 w-3.5" />
                                                <span>{facility.communeName}, {facility.regionName}</span>
                                            </div>
                                        </div>
                                        <div className="pt-4 border-t flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-4">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Capacité</span>
                                                    <span className="font-bold">{(facility as any).bedCapacity || (facility as any).studentCapacity || '--'}</span>
                                                </div>
                                                <div className="flex flex-col border-l pl-4">
                                                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Status</span>
                                                    <span className="flex items-center gap-1.5 font-medium text-emerald-600">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                                        Actif
                                                    </span>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full group-hover:bg-red-500 group-hover:text-white transition-all">
                                                <ChevronRight className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className={`h-1 w-0 group-hover:w-full transition-all duration-500 ${getSectorColor()}`} />
                                </CardContent>
                            </Card>
                        ))}
                        {filteredFacilities.length === 0 && (
                            <div className="col-span-full py-20 text-center">
                                <Building2 className="h-12 w-12 mx-auto text-slate-200 mb-4" />
                                <h3 className="text-xl font-semibold text-slate-400">Aucun établissement trouvé</h3>
                                <p className="text-muted-foreground">Essayez d'ajuster vos filtres ou votre recherche.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </MainLayout>
    );
};
