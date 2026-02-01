// ============================================
// FATI - Dashboard Annonceurs
// Espace Communication et Partenaires
// ============================================

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Megaphone,
    Users,
    TrendingUp,
    Globe,
    Plus,
    ArrowRight,
    MessageSquare,
    FileText,
    Calendar,
} from 'lucide-react';

export const AnnonceurDashboard = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            gsap.fromTo(
                containerRef.current.children,
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    stagger: 0.1,
                    ease: 'power2.out',
                }
            );
        }
    }, []);

    return (
        <MainLayout space="annonceur">
            <div ref={containerRef} className="space-y-8">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-600 shadow-lg shadow-purple-200 dark:shadow-none">
                            <Megaphone className="h-7 w-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Espace Annonceurs</h1>
                            <p className="text-muted-foreground">
                                Gérez vos campagnes de communication et partenariats territoriaux
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="gap-2">
                            <Calendar className="h-4 w-4" />
                            Planning
                        </Button>
                        <Button className="gap-2 bg-purple-600 hover:bg-purple-700">
                            <Plus className="h-4 w-4" />
                            Nouvelle Campagne
                        </Button>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-none bg-white dark:bg-slate-900 shadow-sm border-l-4 border-l-purple-500">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Audience Totale</p>
                                    <p className="mt-2 text-3xl font-bold">1.2M</p>
                                </div>
                                <div className="h-12 w-12 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                                    <Users className="h-6 w-6 text-purple-600" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-2">
                                <Badge variant="outline" className="text-green-600 bg-green-50 border-green-100 dark:bg-green-900/20 dark:border-green-800">+12%</Badge>
                                <span className="text-xs text-muted-foreground">vs mois dernier</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none bg-white dark:bg-slate-900 shadow-sm border-l-4 border-l-blue-500">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Engagement</p>
                                    <p className="mt-2 text-3xl font-bold">24.5%</p>
                                </div>
                                <div className="h-12 w-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                                    <TrendingUp className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-2">
                                <Badge variant="outline" className="text-green-600 bg-green-50 border-green-100 dark:bg-green-900/20 dark:border-green-800">+5.2%</Badge>
                                <span className="text-xs text-muted-foreground">vs mois dernier</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none bg-white dark:bg-slate-900 shadow-sm border-l-4 border-l-orange-500">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Pays Couverts</p>
                                    <p className="mt-2 text-3xl font-bold"> Dakar +8</p>
                                </div>
                                <div className="h-12 w-12 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
                                    <Globe className="h-6 w-6 text-orange-600" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">Expansion régionale en cours</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none bg-white dark:bg-slate-900 shadow-sm border-l-4 border-l-teal-500">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Campagnes Actives</p>
                                    <p className="mt-2 text-3xl font-bold">12</p>
                                </div>
                                <div className="h-12 w-12 rounded-full bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center">
                                    <Megaphone className="h-6 w-6 text-teal-600" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-2">
                                <Badge variant="outline" className="text-teal-600 bg-teal-50 border-teal-100 dark:bg-teal-900/20 dark:border-teal-800">En cours</Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Sections */}
                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Active Campaigns */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border-none shadow-sm overflow-hidden">
                            <CardHeader className="bg-slate-50 dark:bg-slate-800/50">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-lg">Campagnes en cours</CardTitle>
                                        <CardDescription>Performance et statut de vos diffusions</CardDescription>
                                    </div>
                                    <Button variant="ghost" size="sm" className="text-purple-600">Voir tout</Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {[
                                        { title: "Prévention Santé 2024", type: "Social", reach: "450k", performance: 85, color: "red" },
                                        { title: "Inscriptions Scolaires", type: "Web", reach: "280k", performance: 92, color: "teal" },
                                        { title: "Campagne Citoyenne", type: "Radio/TV", reach: "1.2M", performance: 78, color: "blue" },
                                    ].map((camp, idx) => (
                                        <div key={idx} className="p-6 hover:bg-slate-50 transition-colors flex items-center gap-6">
                                            <div className={`h-12 w-12 rounded-xl bg-${camp.color}-100 dark:bg-${camp.color}-900/30 flex items-center justify-center flex-shrink-0`}>
                                                <Megaphone className={`h-6 w-6 text-${camp.color}-600`} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-semibold text-base truncate">{camp.title}</h4>
                                                    <Badge variant="secondary" className="text-[10px] uppercase font-bold">{camp.type}</Badge>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                    <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> {camp.reach}</span>
                                                    <span className="flex items-center gap-1.5"><TrendingUp className="h-3.5 w-3.5" /> {camp.performance}% engagement</span>
                                                </div>
                                                <Progress value={camp.performance} className="h-1.5 mt-3" />
                                            </div>
                                            <Button variant="ghost" size="icon">
                                                <ArrowRight className="h-5 w-5 text-muted-foreground" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Audience Analysis Placeholder */}
                        <Card className="border-none shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold">Analyse de l'Audience Territoriale</CardTitle>
                                <CardDescription>Répartition démographique par région</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px] w-full bg-slate-50 dark:bg-slate-800/50 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700">
                                    <div className="text-center">
                                        <TrendingUp className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-50" />
                                        <p className="text-muted-foreground font-medium">Graphique d'audience interactive</p>
                                        <p className="text-xs text-muted-foreground mt-1 text-balance max-w-xs">Données en temps réel basées sur les collectes FATI</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-6">
                        <Card className="border-none shadow-sm bg-purple-600 text-white">
                            <CardContent className="p-6">
                                <h3 className="text-xl font-bold mb-2">Partenariat Territorial</h3>
                                <p className="text-purple-100 text-sm mb-6 leading-relaxed">
                                    Augmentez votre impact en ciblant précisément les zones nécessitant une attention locale
                                </p>
                                <Button className="w-full bg-white text-purple-600 hover:bg-white/90 font-bold border-none">
                                    Explorer les Territoires
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base font-bold flex items-center gap-2">
                                    <MessageSquare className="h-4 w-4 text-purple-600" />
                                    Messages Récents
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="h-[300px] pr-4">
                                    <div className="space-y-4">
                                        {[
                                            { user: "Admin FATI", msg: "Votre campagne 'Santé' a été validée.", time: "2h" },
                                            { user: "Partenaire B", msg: "Demande de collaboration sur Dakar.", time: "5h" },
                                            { user: "Système", msg: "Rapport hebdomadaire disponible.", time: "1j" },
                                            { user: "Support", msg: "Nouvelle mise à jour de l'outil d'analyse.", time: "2j" },
                                        ].map((msg, idx) => (
                                            <div key={idx} className="flex gap-3 items-start pb-4 border-b border-slate-50 last:border-0">
                                                <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                                                    <Users className="h-4 w-4 text-slate-500" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-center mb-0.5">
                                                        <span className="text-sm font-semibold">{msg.user}</span>
                                                        <span className="text-[10px] text-muted-foreground">{msg.time}</span>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground line-clamp-1">{msg.msg}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base font-bold flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-blue-600" />
                                    Ressources & Guides
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <Button variant="ghost" className="w-full justify-between text-xs h-9 px-3">
                                        Guide de communication FATI
                                        <ArrowRight className="h-3 w-3" />
                                    </Button>
                                    <Button variant="ghost" className="w-full justify-between text-xs h-9 px-3">
                                        Politique de confidentialité
                                        <ArrowRight className="h-3 w-3" />
                                    </Button>
                                    <Button variant="ghost" className="w-full justify-between text-xs h-9 px-3">
                                        Kit de marque Territoriale
                                        <ArrowRight className="h-3 w-3" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};
