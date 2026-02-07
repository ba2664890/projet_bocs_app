// ============================================
// FATI - Formulaires de Collecte
// Remplissage des formulaires de collecte
// ============================================

import { useState, useEffect } from 'react';
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
    ChevronRight
} from 'lucide-react';

import { dataCollectionService } from '@/services/dataCollection';
import { useNavigate } from 'react-router-dom';

export const CollectionsPage = () => {
    const [forms, setForms] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchForms = async () => {
            try {
                setIsLoading(true);
                const response = await dataCollectionService.getForms();
                setForms(response.results || response || []);
            } catch (err) {
                console.error('Failed to load forms', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchForms();
    }, []);

    const filteredForms = forms.filter(f =>
        f.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.sector?.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
        navigate(`/sector/forms/${formId}`);
    };

    return (
        <MainLayout space="sector">
            <div className="max-w-[1200px] mx-auto space-y-8 pb-12 animate-in fade-in duration-500">

                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 p-8 rounded-xl border border-indigo-200/50 dark:border-indigo-800/50 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                            <FileText className="h-7 w-7" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-foreground">Formulaires de Collecte</h1>
                            <p className="text-muted-foreground mt-1">
                                Sélectionnez un formulaire pour commencer la collecte de données
                            </p>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="flex gap-2">
                    <div className="relative flex-1 max-w-xl">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Rechercher un formulaire par nom ou secteur..."
                            className="pl-10 h-11 bg-background"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Forms Grid */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-4">
                        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                        <p className="text-muted-foreground">Chargement des formulaires...</p>
                    </div>
                ) : filteredForms.length === 0 ? (
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
                                        {form.description || 'Formulaire de collecte de données'}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="flex-1 py-4 space-y-4">
                                    {/* Sector Badge */}
                                    <div className="flex flex-wrap gap-2">
                                        <Badge className={getSectorColor(form.sector)}>
                                            {form.sector || 'Général'}
                                        </Badge>
                                    </div>

                                    {/* Form Metadata */}
                                    <div className="space-y-2 text-sm text-muted-foreground">
                                        {form.updated_at && (
                                            <div className="flex items-center justify-between">
                                                <span>Dernière mise à jour:</span>
                                                <span className="font-medium text-foreground">
                                                    {new Date(form.updated_at).toLocaleDateString('fr-FR', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                        )}
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

                                {/* Action Button */}
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
                )}

                {/* Summary Footer */}
                {filteredForms.length > 0 && (
                    <div className="text-center pt-4 border-t">
                        <p className="text-sm text-muted-foreground">
                            {filteredForms.length} formulaire{filteredForms.length > 1 ? 's' : ''} disponible{filteredForms.length > 1 ? 's' : ''}
                            {searchQuery && ` (sur ${forms.length} au total)`}
                        </p>
                    </div>
                )}

            </div>
        </MainLayout>
    );
};
