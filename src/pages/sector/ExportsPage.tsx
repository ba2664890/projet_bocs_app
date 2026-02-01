import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store';
import {
    FileDown,
    FileSpreadsheet,
    FileText,
    Download,
    Clock,
    Calendar,
    Loader2
} from 'lucide-react';

export const ExportsPage = () => {
    const { user } = useAuthStore();
    const containerRef = useRef<HTMLDivElement>(null);
    const sector = user?.role === 'sector_education' ? 'education' : 'health';
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        gsap.fromTo(
            containerRef.current?.children || [],
            { opacity: 0, x: -20 },
            {
                opacity: 1,
                x: 0,
                duration: 0.5,
                stagger: 0.1,
                ease: 'power2.out'
            }
        );
    }, []);

    const reports = [
        {
            id: 'rep1',
            name: `Rapport Annuel ${sector} 2024`,
            type: 'PDF',
            date: '15/01/2026',
            size: '4.2 MB',
            status: 'ready'
        },
        {
            id: 'rep2',
            name: `Indicateurs Trimestriels Q4`,
            type: 'Excel',
            date: '10/01/2026',
            size: '1.5 MB',
            status: 'ready'
        },
        {
            id: 'rep3',
            name: `Base de données strucutres`,
            type: 'CSV',
            date: '05/01/2026',
            size: '850 KB',
            status: 'ready'
        }
    ];

    const handleDownload = (name: string) => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            alert(`Téléchargement de ${name} démarré.`);
        }, 1500);
    };

    return (
        <MainLayout space="sector">
            <div ref={containerRef} className="max-w-[1600px] mx-auto space-y-8 pb-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-100 dark:shadow-none">
                            <FileDown className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Exportations & Rapports</h1>
                            <p className="text-muted-foreground mt-1">Générez et téléchargez vos rapports sectoriels consolidés.</p>
                        </div>
                    </div>
                </div>

                {/* Export Options */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border-none shadow-md hover:shadow-lg transition-shadow group cursor-pointer bg-white dark:bg-slate-900">
                        <CardContent className="p-8 text-center flex flex-col items-center">
                            <div className="h-16 w-16 rounded-full bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <FileText className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold">Rapport PDF</h3>
                            <p className="text-sm text-muted-foreground mt-2">Mise en page professionnelle avec graphiques et analyses détaillées.</p>
                            <Button className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white">Générer PDF</Button>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-md hover:shadow-lg transition-shadow group cursor-pointer bg-white dark:bg-slate-900">
                        <CardContent className="p-8 text-center flex flex-col items-center">
                            <div className="h-16 w-16 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <FileSpreadsheet className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold">Données Excel</h3>
                            <p className="text-sm text-muted-foreground mt-2">Exports de données brutes pour retraitement et analyse externe.</p>
                            <Button className="mt-6 w-full bg-emerald-600 hover:bg-emerald-700 text-white">Générer Excel</Button>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-md hover:shadow-lg transition-shadow group cursor-pointer bg-white dark:bg-slate-900">
                        <CardContent className="p-8 text-center flex flex-col items-center">
                            <div className="h-16 w-16 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <FileDown className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold">Consolidation CSV</h3>
                            <p className="text-sm text-muted-foreground mt-2">Format léger pour intégration dans d'autres systèmes BI.</p>
                            <Button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white">Générer CSV</Button>
                        </CardContent>
                    </Card>
                </div>

                {/* History */}
                <Card className="border-none shadow-sm bg-white dark:bg-slate-900">
                    <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-2">
                            <Clock className="h-5 w-5 text-indigo-500" />
                            Historique des exports récents
                        </CardTitle>
                        <CardDescription>Retrouvez vos rapports précédemment générés.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {reports.map((report) => (
                                <div key={report.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${report.type === 'PDF' ? 'bg-red-100 text-red-600' : report.type === 'Excel' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                                            {report.type === 'PDF' ? <FileText className="h-5 w-5" /> : <FileSpreadsheet className="h-5 w-5" />}
                                        </div>
                                        <div>
                                            <h4 className="font-bold">{report.name}</h4>
                                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                                                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {report.date}</span>
                                                <span>•</span>
                                                <span>{report.size}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        className="gap-2"
                                        onClick={() => handleDownload(report.name)}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                                        Télécharger
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    );
};
