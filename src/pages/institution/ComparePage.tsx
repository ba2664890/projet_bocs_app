import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ComparisonChart } from '@/components/charts/ComparisonChart';
import { Map, ArrowRightArrowLeft, TrendingUp, Trophy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const ComparePage = () => {
    const [regionA, setRegionA] = useState('region-nord');
    const [regionB, setRegionB] = useState('region-sud');

    // Mock comparison data
    const comparisonData = [
        { name: 'Taux Vaccination', regionA: 85, regionB: 72 },
        { name: 'Scolarisation', regionA: 92, regionB: 88 },
        { name: 'Infras. Santé', regionA: 65, regionB: 45 },
        { name: 'Infras. Édu.', regionA: 78, regionB: 82 },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Comparateur Territorial</h1>
                    <p className="text-muted-foreground">Analysez les écarts de performance entre les régions.</p>
                </div>
            </div>

            <Card className="bg-slate-50 dark:bg-slate-900 border-dashed">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row items-center gap-6 justify-center">
                        <div className="w-full md:w-1/3 space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Région A (Référence)</label>
                            <Select value={regionA} onValueChange={setRegionA}>
                                <SelectTrigger className="bg-background">
                                    <SelectValue placeholder="Sélectionner une région" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="region-nord">Région Nord</SelectItem>
                                    <SelectItem value="region-est">Région Est</SelectItem>
                                    <SelectItem value="region-ouest">Région Ouest</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center justify-center">
                            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                                <ArrowRightArrowLeft className="h-5 w-5" />
                            </div>
                        </div>

                        <div className="w-full md:w-1/3 space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Région B (Comparaison)</label>
                            <Select value={regionB} onValueChange={setRegionB}>
                                <SelectTrigger className="bg-background">
                                    <SelectValue placeholder="Sélectionner une région" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="region-sud">Région Sud</SelectItem>
                                    <SelectItem value="region-centre">Région Centre</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-blue-500" />
                            Analyse Comparative
                        </CardTitle>
                        <CardDescription>Performances sur les indicateurs clés</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ComparisonChart
                            data={comparisonData}
                            bars={[
                                { key: 'regionA', name: 'Région Nord', color: '#3b82f6' },
                                { key: 'regionB', name: 'Région Sud', color: '#f59e0b' },
                            ]}
                            height={350}
                        />
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-amber-600">
                                <Trophy className="h-5 w-5" />
                                Synthèse
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900/30">
                                <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Avantage Région A</p>
                                <p className="text-2xl font-bold text-blue-600 mt-1">+13 pts</p>
                                <p className="text-xs text-muted-foreground mt-1">Sur la couverture vaccinale par rapport à la Région B.</p>
                            </div>

                            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-900/30">
                                <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Déficit Région A</p>
                                <p className="text-2xl font-bold text-amber-600 mt-1">-4 pts</p>
                                <p className="text-xs text-muted-foreground mt-1">Sur les infrastructures éducatives.</p>
                            </div>

                            <Button className="w-full" variant="outline">
                                <FileText className="mr-2 h-4 w-4" />
                                Télécharger le rapport comparatif
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};
