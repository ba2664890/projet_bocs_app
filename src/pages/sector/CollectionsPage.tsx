import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store';
import { useDataCollections } from '@/hooks/useData';
import {
    Calendar,
    Search,
    Filter,
    Plus,
    ClipboardList,
    Clock,
    CheckCircle2,
    AlertCircle,
    ChevronRight,
    Loader2
} from 'lucide-react';

export const CollectionsPage = () => {
    const { user } = useAuthStore();
    const [searchTerm, setSearchTerm] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    // Deduce sector from user role
    const sector = user?.role === 'sector_education' ? 'education' : 'health';
    const { collections, isLoading } = useDataCollections({ sector });

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

    const filteredCollections = collections.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.description || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return <Badge className="bg-emerald-500 hover:bg-emerald-600 gap-1"><CheckCircle2 className="h-3 w-3" /> Terminée</Badge>;
            case 'ongoing':
                return <Badge className="bg-blue-500 hover:bg-blue-600 gap-1"><Clock className="h-3 w-3" /> En cours</Badge>;
            case 'planned':
                return <Badge variant="outline" className="gap-1"><AlertCircle className="h-3 w-3" /> Planifiée</Badge>;
            case 'closed':
                return <Badge variant="secondary" className="gap-1"><AlertCircle className="h-3 w-3" /> Clôturée</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    return (
        <MainLayout space="sector">
            <div ref={containerRef} className="max-w-[1600px] mx-auto space-y-8 pb-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-violet-500 flex items-center justify-center shadow-lg shadow-violet-100 dark:shadow-none">
                            <ClipboardList className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Collectes de Données</h1>
                            <p className="text-muted-foreground mt-1">Suivi et gestion des campagnes de collecte périodiques.</p>
                        </div>
                    </div>
                    <Button className="bg-violet-600 hover:bg-violet-700 text-white gap-2 shadow-lg">
                        <Plus className="h-4 w-4" />
                        Nouvelle Collecte
                    </Button>
                </div>

                {/* Filters */}
                <Card className="border-none shadow-sm bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                    <CardContent className="p-4 flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Rechercher une campagne..."
                                className="pl-10 bg-white dark:bg-slate-950"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" className="gap-2 bg-white dark:bg-slate-950">
                            <Filter className="h-4 w-4" />
                            Filtres avancés
                        </Button>
                    </CardContent>
                </Card>

                {/* List */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="h-10 w-10 animate-spin text-violet-500" />
                        <p className="text-muted-foreground animate-pulse">Chargement des collectes...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {filteredCollections.map((collection) => (
                            <Card key={collection.id} className="border-none shadow-sm hover:shadow-md transition-all group cursor-pointer bg-white dark:bg-slate-900 overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="flex items-center p-6 gap-6">
                                        <div className="flex items-center justify-center h-14 w-14 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-500 group-hover:bg-violet-50 dark:group-hover:bg-violet-900/20 group-hover:text-violet-600 transition-colors shrink-0">
                                            <Calendar className="h-7 w-7" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3">
                                                <h3 className="font-bold text-xl truncate">{collection.name}</h3>
                                                {getStatusBadge(collection.status)}
                                            </div>
                                            <p className="text-muted-foreground text-sm line-clamp-1 mt-1">{collection.description || 'Campagne de collecte périodique pour le suivi des indicateurs.'}</p>
                                            <div className="flex items-center gap-6 mt-4 text-sm font-medium">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-muted-foreground uppercase text-[10px] tracking-wider font-bold">Période</span>
                                                    <span>{collection.period} {collection.year}</span>
                                                </div>
                                                <div className="flex items-center gap-2 border-l pl-6">
                                                    <span className="text-muted-foreground uppercase text-[10px] tracking-wider font-bold">Réponse</span>
                                                    <span>{collection.responseRate || 0}%</span>
                                                </div>
                                                <div className="flex items-center gap-2 border-l pl-6">
                                                    <span className="text-muted-foreground uppercase text-[10px] tracking-wider font-bold">Indicateurs</span>
                                                    <span>{collection.indicators?.length || 0}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 shrink-0">
                                            <Button variant="ghost" size="icon" className="rounded-full group-hover:bg-violet-600 group-hover:text-white transition-all">
                                                <ChevronRight className="h-5 w-5" />
                                            </Button>
                                        </div>
                                    </div>
                                    {collection.status === 'ongoing' && (
                                        <div className="h-1 w-full bg-slate-100 dark:bg-slate-800">
                                            <div
                                                className="h-full bg-violet-600 transition-all duration-1000"
                                                style={{ width: `${collection.responseRate || 10}%` }}
                                            />
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                        {filteredCollections.length === 0 && (
                            <div className="py-20 text-center bg-slate-50 dark:bg-slate-900/50 rounded-2xl border-2 border-dashed">
                                <ClipboardList className="h-12 w-12 mx-auto text-slate-300 mb-4" />
                                <h3 className="text-xl font-semibold text-slate-500">Aucune campagne à afficher</h3>
                                <p className="text-muted-foreground">Les campagnes de collecte apparaîtront ici dès qu'elles seront initiées.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </MainLayout>
    );
};
