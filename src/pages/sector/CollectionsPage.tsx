// ============================================
// FATI - Centre de Collecte
// Accès direct aux formulaires de saisie
// ============================================

import { useState, useEffect, useMemo } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Search,
    Loader2,
    Hospital,
    School,
    FileText,
    ClipboardCheck,
    Calendar,
    ArrowRight,
    PlusCircle,
    Activity,
    Info,
    CheckCircle2,
    History
} from 'lucide-react';

import { dataCollectionService } from '@/services/dataCollection';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

export const CollectionsPage = () => {
    const [forms, setForms] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    // Déterminer le secteur actuel via l'URL
    const isHealthSpace = location.pathname.includes('/health');
    const isEducationSpace = location.pathname.includes('/education');

    useEffect(() => {
        const fetchForms = async () => {
            try {
                setIsLoading(true);
                const response = await dataCollectionService.getForms();
                let results = response.results || response || [];

                // Filtrer par secteur selon l'espace actuel
                if (isHealthSpace) {
                    results = results.filter((f: any) => f.sector?.toLowerCase().includes('santé') || f.sector?.toLowerCase().includes('health'));
                } else if (isEducationSpace) {
                    results = results.filter((f: any) => f.sector?.toLowerCase().includes('éducation') || f.sector?.toLowerCase().includes('education'));
                }

                setForms(results);
            } catch (err) {
                console.error('Failed to load forms', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchForms();
    }, [isHealthSpace, isEducationSpace]);

    const filteredForms = useMemo(() => {
        return forms.filter(f =>
            f.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            f.description?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [forms, searchQuery]);

    const handleFormClick = (formId: string) => {
        navigate(`/sector/${isHealthSpace ? 'health' : 'education'}/forms/${formId}`);
    };

    return (
        <MainLayout space="sector">
            <div className="max-w-[1400px] mx-auto space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* Hero Header */}
                <div className={cn(
                    "relative overflow-hidden p-8 md:p-12 rounded-3xl border shadow-2xl",
                    isHealthSpace
                        ? "bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 border-blue-400/30 text-white"
                        : "bg-gradient-to-br from-teal-600 via-teal-700 to-blue-800 border-teal-400/30 text-white"
                )}>
                    {/* Background Decorative Elements */}
                    <div className="absolute top-0 right-0 -mt-12 -mr-12 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
                    <div className="absolute bottom-0 left-0 -mb-12 -ml-12 h-48 w-48 rounded-full bg-black/10 blur-3xl" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md shadow-xl border border-white/30">
                            {isHealthSpace ? <Hospital className="h-10 w-10 text-white" /> : <School className="h-10 w-10 text-white" />}
                        </div>
                        <div className="text-center md:text-left">
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">
                                Centre de Collecte {isHealthSpace ? 'Santé' : 'Éducation'}
                            </h1>
                            <p className="text-white/80 text-lg max-w-2xl font-medium">
                                Saisissez et transmettez les données opérationnelles pour alimenter les indicateurs nationaux en temps réel.
                            </p>
                        </div>
                        <div className="md:ml-auto flex flex-col items-center gap-2 bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
                            <span className="text-xs font-bold uppercase tracking-widest text-white/60">Session de saisie</span>
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-lg font-black">{new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dashboard / Stats Center */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="hover:shadow-md transition-all border-none bg-emerald-50 dark:bg-emerald-950/10">
                        <CardHeader className="p-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600">
                                    <CheckCircle2 className="h-5 w-5" />
                                </div>
                                <CardTitle className="text-sm font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">Statut de Saisie</CardTitle>
                            </div>
                            <div className="mt-4">
                                <h3 className="text-2xl font-black text-emerald-900 dark:text-emerald-200">À jour</h3>
                                <p className="text-xs text-emerald-700/70 dark:text-emerald-400/70 mt-1">Dernière soumission: Il y a 2 jours</p>
                            </div>
                        </CardHeader>
                    </Card>
                    <Card className="hover:shadow-md transition-all border-none bg-blue-50 dark:bg-blue-950/10">
                        <CardHeader className="p-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600">
                                    <History className="h-5 w-5" />
                                </div>
                                <CardTitle className="text-sm font-bold uppercase tracking-wider text-blue-800 dark:text-blue-400">Historique</CardTitle>
                            </div>
                            <div className="mt-4">
                                <h3 className="text-2xl font-black text-blue-900 dark:text-blue-200">12 Soumissions</h3>
                                <p className="text-xs text-blue-700/70 dark:text-blue-400/70 mt-1">Total transmises ce trimestre</p>
                            </div>
                        </CardHeader>
                    </Card>
                    <Card className="hover:shadow-md transition-all border-none bg-indigo-50 dark:bg-indigo-950/10">
                        <CardHeader className="p-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600">
                                    <Activity className="h-5 w-5" />
                                </div>
                                <CardTitle className="text-sm font-bold uppercase tracking-wider text-indigo-800 dark:text-indigo-400">Performance</CardTitle>
                            </div>
                            <div className="mt-4">
                                <h3 className="text-2xl font-black text-indigo-900 dark:text-indigo-200">85% Précision</h3>
                                <p className="text-xs text-indigo-700/70 dark:text-indigo-400/70 mt-1">Validation automatique sans erreurs</p>
                            </div>
                        </CardHeader>
                    </Card>
                </div>

                {/* Main Action Area */}
                <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <ClipboardCheck className="h-6 w-6 text-primary" />
                            Formulaires Disponibles
                        </h2>

                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Filtrer les formulaires..."
                                className="pl-10 bg-card"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="h-10 w-10 animate-spin text-primary" />
                            <p className="text-muted-foreground font-medium">Préparation des formulaires...</p>
                        </div>
                    ) : filteredForms.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-32 bg-muted/20 rounded-3xl border-2 border-dashed">
                            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                                <FileText className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-bold">Aucun formulaire trouvé</h3>
                            <p className="text-muted-foreground mt-1 max-w-sm text-center">
                                {searchQuery ? "Votre recherche n'a retourné aucun résultat. Essayez d'autres mots-clés." : "Vous n'avez aucun formulaire de collecte affecté pour le moment."}
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {filteredForms.map((form) => (
                                <Card
                                    key={form.id}
                                    className="group relative flex flex-col overflow-hidden border-2 border-transparent hover:border-primary/20 hover:shadow-2xl transition-all duration-300 rounded-[2rem] bg-card"
                                >
                                    {/* Action Gradient Overlay on Hover */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <CardHeader className="pb-4">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className={cn(
                                                "h-14 w-14 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition-transform",
                                                isHealthSpace ? "bg-blue-100 text-blue-600" : "bg-teal-100 text-teal-600"
                                            )}>
                                                {isHealthSpace ? <Hospital className="h-7 w-7" /> : <School className="h-7 w-7" />}
                                            </div>
                                            <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest border-primary/20 py-1">
                                                ID: {form.id.slice(0, 8)}
                                            </Badge>
                                        </div>
                                        <CardTitle className="text-2xl font-black group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                                            {form.name}
                                        </CardTitle>
                                        <CardDescription className="line-clamp-2 text-sm pt-2">
                                            {form.description || "Remplissez ce formulaire pour transmettre vos relevés sectoriels."}
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="flex-1 space-y-4 pb-8">
                                        <div className="bg-muted/30 p-4 rounded-2xl space-y-3">
                                            <div className="flex items-center justify-between text-xs">
                                                <div className="flex items-center gap-2 text-muted-foreground font-medium">
                                                    <Calendar className="h-3.5 w-3.5" />
                                                    Périodicité
                                                </div>
                                                <span className="font-bold">Trimestrielle</span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs">
                                                <div className="flex items-center gap-2 text-muted-foreground font-medium">
                                                    <Info className="h-3.5 w-3.5" />
                                                    Sections
                                                </div>
                                                <span className="font-bold">4 Parties</span>
                                            </div>
                                        </div>

                                        <Button
                                            className={cn(
                                                "w-full h-14 rounded-2xl text-lg font-black gap-3 shadow-xl transition-all active:scale-95",
                                                isHealthSpace
                                                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200 dark:shadow-none"
                                                    : "bg-teal-600 hover:bg-teal-700 text-white shadow-teal-200 dark:shadow-none"
                                            )}
                                            onClick={() => handleFormClick(form.id)}
                                        >
                                            <PlusCircle className="h-6 w-6" />
                                            Commencer la saisie
                                            <ArrowRight className="h-5 w-5 ml-auto group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </CardContent>

                                    {/* Footer Info */}
                                    <div className="px-8 py-3 bg-muted/10 border-t flex items-center gap-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                        <div className="flex items-center gap-1">
                                            <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                            Temps estimé: 10 min
                                        </div>
                                        <div className="flex items-center gap-1 ml-auto">
                                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                            Validé
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* Help Section */}
                <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="max-w-xl text-center md:text-left">
                            <h3 className="text-2xl font-black mb-4">Besoin d'assistance pour vos saisies ?</h3>
                            <p className="text-slate-400 font-medium"> notre équipe support est disponible pour vous accompagner dans le remplissage de vos formulaires et la validation de vos données.</p>
                        </div>
                        <Button variant="outline" className="h-14 px-10 rounded-2xl font-bold bg-white/5 border-white/20 hover:bg-white/10 text-white">
                            Consulter le guide d'utilisation
                        </Button>
                    </div>
                </div>

            </div>
        </MainLayout>
    );
};
