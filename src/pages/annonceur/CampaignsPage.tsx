import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
    Loader2
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
    const [searchTerm, setSearchTerm] = useState('');
    const [campaigns, setCampaigns] = useState<DataCollection[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const response = await dataCollectionService.getCollections();
                setCampaigns(response.results);
            } catch (error) {
                console.error('Failed to fetch campaigns:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCampaigns();
    }, []);

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

    return (
        <MainLayout space="annonceur">
            <div ref={containerRef} className="max-w-[1600px] mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Gestion des Campagnes</h1>
                        <p className="text-muted-foreground mt-1">Gérez et optimisez vos campagnes de collecte et de communication.</p>
                    </div>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-lg shadow-indigo-200 dark:shadow-none">
                        <Plus className="h-4 w-4" />
                        Nouvelle Campagne
                    </Button>
                </div>

                {/* Filters & Search */}
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
                                <CardTitle className="text-lg">Toutes les campagnes</CardTitle>
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
                                        <TableHead className="w-[400px] py-4">Nom de la Campagne</TableHead>
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
                                                Aucune campagne trouvée.
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
