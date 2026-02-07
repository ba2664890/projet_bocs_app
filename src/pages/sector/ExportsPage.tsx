// ============================================
// FATI - Centre d'Export
// Génération et téléchargement de rapports
// ============================================

import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Download,
    FileText,
    FileSpreadsheet,
    Table,
    History,
    CheckCircle2,
    Clock,
    Search,
    FileType
} from 'lucide-react';
import { Filter } from 'lucide-react';
import { useAuditLogs } from '@/hooks/useData';
import { dashboardsService } from '@/services/dashboards';


import { useAuthStore } from '@/store';

export const ExportsPage = () => {
    const user = useAuthStore((state) => state.user);
    const sector = user?.role?.includes('education') ? 'Éducation' : 'Santé';
    const [isGenerating, setIsGenerating] = useState<string | null>(null);

    const handleGenerate = async (type: string) => {
        setIsGenerating(type);
        try {
            // choose a simple template payload; backend will decide
            const payload = { format: type.toLowerCase() };
            const report = await dashboardsService.generateReport(payload);
            setIsGenerating(null);
            if (report?.fileUrl) {
                window.open(report.fileUrl, '_blank');
            } else {
                alert(`Rapport ${type} généré avec succès !`);
            }
        } catch (err) {
            console.error('Failed to generate report', err);
            setIsGenerating(null);
            alert('Échec de génération du rapport');
        }
    };

    const { logs: recentExports, isLoading } = useAuditLogs({ action: 'export' });

    return (
        <MainLayout space="sector">
            <div className="max-w-[1600px] mx-auto space-y-8 pb-12 animate-in fade-in duration-500">

                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-card p-6 rounded-xl border shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                            <Download className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">Centre d'Exports</h1>
                            <p className="text-muted-foreground">
                                Génération de rapports et extraction de données pour le secteur {sector}
                            </p>
                        </div>
                    </div>
                    <Button variant="outline" className="gap-2">
                        <History className="h-4 w-4" />
                        Historique complet
                    </Button>
                </div>

                {/* Export Options Grid */}
                <div className="grid gap-6 md:grid-cols-3">
                    {/* PDF Report */}
                    <Card className="hover:shadow-md transition-all border-l-4 border-l-red-500">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="p-2 bg-red-100 rounded-lg text-red-600">
                                    <FileText className="h-6 w-6" />
                                </div>
                                <Badge variant="secondary">Mensuel</Badge>
                            </div>
                            <CardTitle className="mt-4">Rapport PDF Standard</CardTitle>
                            <CardDescription>
                                Vue d'ensemble formatée avec graphiques, analyses et KPIs clés.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                                <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-green-500" /> Synthèse exécutive</li>
                                <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-green-500" /> Graphiques de tendances</li>
                                <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-green-500" /> Cartographie incluse</li>
                            </ul>
                            <Button
                                className="w-full gap-2 bg-red-600 hover:bg-red-700 text-white"
                                onClick={() => handleGenerate('PDF')}
                                disabled={isGenerating === 'PDF'}
                            >
                                {isGenerating === 'PDF' ? (
                                    <>Génération...</>
                                ) : (
                                    <>
                                        <Download className="h-4 w-4" /> Générer le PDF
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Excel Export */}
                    <Card className="hover:shadow-md transition-all border-l-4 border-l-green-600">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="p-2 bg-green-100 rounded-lg text-green-600">
                                    <FileSpreadsheet className="h-6 w-6" />
                                </div>
                                <Badge variant="secondary">Données</Badge>
                            </div>
                            <CardTitle className="mt-4">Export Excel</CardTitle>
                            <CardDescription>
                                Fichier Excel structuré avec onglets multiples pour analyse approfondie.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                                <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-green-500" /> Indicateurs détaillés</li>
                                <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-green-500" /> Données par région</li>
                                <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-green-500" /> Tableau croisé dynamique</li>
                            </ul>
                            <Button
                                className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => handleGenerate('Excel')}
                                disabled={isGenerating === 'Excel'}
                            >
                                {isGenerating === 'Excel' ? (
                                    <>Export en cours...</>
                                ) : (
                                    <>
                                        <Download className="h-4 w-4" /> Exporter en Excel
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* CSV Export */}
                    <Card className="hover:shadow-md transition-all border-l-4 border-l-blue-500">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                    <Table className="h-6 w-6" />
                                </div>
                                <Badge variant="secondary">Brut</Badge>
                            </div>
                            <CardTitle className="mt-4">Données Brutes (CSV)</CardTitle>
                            <CardDescription>
                                Export léger et compatible pour intégration avec d'autres outils.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                                <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-green-500" /> Format universel</li>
                                <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-green-500" /> Encodage UTF-8</li>
                                <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-green-500" /> Tous les historiques</li>
                            </ul>
                            <Button
                                className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={() => handleGenerate('CSV')}
                                disabled={isGenerating === 'CSV'}
                            >
                                {isGenerating === 'CSV' ? (
                                    <>Préparation...</>
                                ) : (
                                    <>
                                        <Download className="h-4 w-4" /> Télécharger CSV
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Custom Export Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Filter className="h-5 w-5 text-muted-foreground" />
                            Export Personnalisé
                        </CardTitle>
                        <CardDescription>Configurez les paramètres exacts de votre export</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6 md:grid-cols-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Période</label>
                                <Input type="date" className="w-full" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Type de données</label>
                                <Input placeholder="Toutes les données" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Format</label>
                                <Input placeholder="PDF (.pdf)" />
                            </div>
                            <div className="flex items-end">
                                <Button className="w-full gap-2">
                                    <Download className="h-4 w-4" /> Générer
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* History Section */}
                <Card className="overflow-hidden">
                    <CardHeader className="bg-muted/30 border-b pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Clock className="h-5 w-5 text-muted-foreground" />
                                Exports Récents
                            </CardTitle>
                            <div className="relative w-64">
                                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                                <Input placeholder="Filtrer l'historique..." className="pl-9 h-9" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <ScrollArea className="h-[300px]">
                            <div className="divide-y">
                                {isLoading ? (
                                    <div className="p-8 text-center text-muted-foreground">Chargement de l'historique...</div>
                                ) : recentExports.map((item: any) => (
                                    <div key={item.id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                                <FileType className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">{item.entityName || 'Export sans nom'}</p>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                                                    <span>•</span>
                                                    <span>{item.entityType || 'Données'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon">
                                            <Download className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>

            </div >
        </MainLayout >
    );
};
