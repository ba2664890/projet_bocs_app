// ============================================
// FATI - Formulaires par Secteur
// Acces aux formulaires pour tous les utilisateurs
// ============================================

import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
    ChevronRight,
    TrendingUp,
    Clock,
    CheckCircle2
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { dataCollectionService } from '@/services/dataCollection';
import { useAuthStore } from '@/store';

export const FormsPage = () => {
    const [forms, setForms] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState('available');
    const navigate = useNavigate();
    const location = useLocation();
    const user = useAuthStore((state) => state.user);
    const isEducationSpace = location.pathname.includes('/sector/education');
    const currentSector = isEducationSpace ? 'education' : 'health';
    const currentSectorLabel = isEducationSpace ? 'éducation' : 'santé';

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [formsRes, submissionsRes] = await Promise.all([
                    dataCollectionService.getForms({ sector: currentSector }),
                    dataCollectionService.getSubmissions()
                ]);
                const loadedForms = formsRes.results || formsRes || [];
                setForms(loadedForms.filter((form: any) => form.sector === currentSector));
                setSubmissions(submissionsRes.results || submissionsRes || []);
            } catch (err) {
                console.error('Failed to load forms', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [currentSector]);

    const filteredForms = forms.filter(f =>
        f.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.sector?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const userSubmissions = submissions.filter(s => s.submitted_by === user?.id);

    const getSectorIcon = (sector: string) => {
        if (sector?.includes('santé') || sector?.includes('health')) {
            return <Hospital className="h-5 w-5 text-red-500" />;
        }
        if (sector?.includes('éducation') || sector?.includes('education')) {
            return <School className="h-5 w-5 text-blue-500" />;
        }
        return <FileText className="h-5 w-5" />;
    };

    const getSectorColor = (sector: string) => {
        if (sector?.includes('santé') || sector?.includes('health')) {
            return 'bg-red-100 text-red-800 dark:bg-red-900/20';
        }
        if (sector?.includes('éducation') || sector?.includes('education')) {
            return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20';
        }
        return 'bg-gray-100 text-gray-800';
    };

    const handleFormClick = (formId: string) => {
        navigate(`/sector/${currentSector}/forms/${formId}`);
    };

    // Stats pour le tableau de bord
    const totalSubmitted = userSubmissions.length;
    const pendingForms = filteredForms.filter(f => !userSubmissions.find(s => s.form_id === f.id));
    const completionRate = filteredForms.length > 0 ? Math.round(((filteredForms.length - pendingForms.length) / filteredForms.length) * 100) : 0;

    return (
        <MainLayout space="sector">
            <div className="max-w-[1400px] mx-auto space-y-8 pb-12">
                {/* Header */}
                <div className="space-y-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 p-8 rounded-xl border border-indigo-200/50 dark:border-indigo-800/50">
                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                                <FileText className="h-8 w-8" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight text-foreground">Formulaires {isEducationSpace ? 'Éducation' : 'Santé'}</h1>
                                <p className="text-muted-foreground mt-1">
                                    Remplissez les formulaires {currentSectorLabel} affectés à votre structure.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card className="border-none shadow-sm bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/10">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Formulaires disponibles</p>
                                        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{filteredForms.length}</p>
                                    </div>
                                    <FileText className="h-8 w-8 text-blue-200 dark:text-blue-900/30" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-sm bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/10">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Complétés</p>
                                        <p className="text-3xl font-bold text-green-600 dark:text-green-400">{totalSubmitted}</p>
                                    </div>
                                    <CheckCircle2 className="h-8 w-8 text-green-200 dark:text-green-900/30" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-sm bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/20 dark:to-amber-900/10">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">En attente</p>
                                        <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{pendingForms.length}</p>
                                    </div>
                                    <Clock className="h-8 w-8 text-amber-200 dark:text-amber-900/30" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-sm bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/20 dark:to-purple-900/10">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Taux de réponse</p>
                                        <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{completionRate}%</p>
                                    </div>
                                    <TrendingUp className="h-8 w-8 text-purple-200 dark:text-purple-900/30" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="available">Formulaires disponibles ({filteredForms.length})</TabsTrigger>
                        <TabsTrigger value="submitted">Soumis ({totalSubmitted})</TabsTrigger>
                        <TabsTrigger value="progress">En cours ({pendingForms.length})</TabsTrigger>
                    </TabsList>
                </Tabs>

                {/* Search */}
                {activeTab === 'available' && (
                    <div className="flex gap-2">
                        <div className="relative flex-1 max-w-xl">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Rechercher un formulaire..."
                                className="pl-10 h-11 bg-background"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                )}

                {/* Content */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-4">
                        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                        <p className="text-muted-foreground">Chargement des formulaires...</p>
                    </div>
                ) : activeTab === 'available' ? (
                    filteredForms.length === 0 ? (
                        <Card className="border-dashed">
                            <CardContent className="p-12 text-center">
                                <FileText className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                                <p className="text-muted-foreground mb-4">
                                    {searchQuery ? 'Aucun formulaire ne correspond à votre recherche' : 'Aucun formulaire disponible'}
                                </p>
                                {searchQuery && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setSearchQuery('')}
                                    >
                                        Réinitialiser la recherche
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {filteredForms.map((form) => (
                                <Card
                                    key={form.id}
                                    className="group hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-700 transition-all cursor-pointer overflow-hidden h-full flex flex-col"
                                    onClick={() => handleFormClick(form.id)}
                                >
                                    <CardHeader className="pb-3 bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-900/20 dark:to-slate-900/10">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <CardTitle className="text-lg group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                                                    {form.name || 'Formulaire sans titre'}
                                                </CardTitle>
                                            </div>
                                            <div className="ml-2 flex-shrink-0">
                                                {getSectorIcon(form.sector)}
                                            </div>
                                        </div>
                                        <CardDescription className="line-clamp-2">
                                            {form.description || 'Formulaire sectoriel à remplir'}
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="flex-1 py-4 space-y-4">
                                        <div className="flex flex-wrap gap-2">
                                            <Badge className={getSectorColor(form.sector)}>
                                                {form.sector === 'health' ? 'Santé' : form.sector === 'education' ? 'Éducation' : 'Général'}
                                            </Badge>
                                        </div>

                                        <div className="space-y-2 text-sm text-muted-foreground">
                                            {form.created_at && (
                                                <div className="flex items-center justify-between">
                                                    <span>Créé:</span>
                                                    <span className="font-medium text-foreground">
                                                        {new Date(form.created_at).toLocaleDateString('fr-FR', {
                                                            year: 'numeric',
                                                            month: 'short'
                                                        })}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>

                                    <div className="px-6 py-4 border-t bg-slate-50/50 dark:bg-slate-900/20">
                                        <Button
                                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white group-hover:shadow-md transition-all"
                                        >
                                            Remplir le formulaire
                                            <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )
                ) : activeTab === 'submitted' ? (
                    userSubmissions.length === 0 ? (
                        <Card className="border-dashed">
                            <CardContent className="p-12 text-center">
                                <CheckCircle2 className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                                <p className="text-muted-foreground">Vous n'avez pas encore soumis de formulaire</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {userSubmissions.map((submission) => (
                                <Card key={submission.id} className="overflow-hidden hover:shadow-md transition-all">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-foreground">{submission.form_title}</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    Soumis le {new Date(submission.created_at).toLocaleDateString('fr-FR')}
                                                </p>
                                            </div>
                                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20">
                                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                                Soumis
                                            </Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )
                ) : (
                    <Card className="border-dashed">
                        <CardContent className="p-12 text-center">
                            <TrendingUp className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                            <p className="text-muted-foreground">Tous les formulaires sont complétés!</p>
                        </CardContent>
                    </Card>
                )}

                {/* Footer */}
                <div className="text-center pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                        Votre participation aide à améliorer les services publics
                    </p>
                </div>
            </div>
        </MainLayout>
    );
};
