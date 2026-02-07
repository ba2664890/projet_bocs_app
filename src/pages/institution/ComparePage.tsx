import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ComparisonChart } from '@/components/charts/ComparisonChart';
import { ArrowRightLeft, TrendingUp, Trophy, FileText, Loader2 } from 'lucide-react';
import { useGeographicData, useIndicatorValues } from '@/hooks/useData';

export const ComparePage = () => {
    const { regions, isLoading: isLoadingRegions } = useGeographicData();
    const { allValues, isLoading: isLoadingValues } = useIndicatorValues();

    // Initialize with first two regions if available
    const [regionA, setRegionA] = useState<string>('');
    const [regionB, setRegionB] = useState<string>('');

    // Update initial selection once regions are loaded
    useMemo(() => {
        if (regions.length >= 2 && !regionA && !regionB) {
            setRegionA(regions[0].id);
            setRegionB(regions[1].id);
        }
    }, [regions]);

    // Derived comparison data
    const comparisonData = useMemo(() => {
        if (!regionA || !regionB) return [];

        // Get unique indicators present in the data
        const indicators = Array.from(new Set(allValues.map(v => v.indicatorId)));

        // Pick a few relevant indicators to compare (max 5)
        return indicators.slice(0, 5).map(indicatorId => {
            const valA = allValues.find(v => v.indicatorId === indicatorId && v.geographicId === regionA);
            const valB = allValues.find(v => v.indicatorId === indicatorId && v.geographicId === regionB);

            return {
                name: valA?.indicatorName || valB?.indicatorName || 'Indicateur ' + indicatorId,
                regionA: valA?.value || 0,
                regionB: valB?.value || 0,
            };
        });
    }, [allValues, regionA, regionB]);

    const regionAName = regions.find(r => r.id === regionA)?.name || 'Région A';
    const regionBName = regions.find(r => r.id === regionB)?.name || 'Région B';

    // Summary logic
    const summary = useMemo(() => {
        if (comparisonData.length === 0) return null;

        // Find biggest advantage and deficit for Region A
        let biggestAdvantage = comparisonData[0];
        let biggestDeficit = comparisonData[0];

        comparisonData.forEach(d => {
            const diff = d.regionA - d.regionB;
            if (diff > (biggestAdvantage.regionA - biggestAdvantage.regionB)) {
                biggestAdvantage = d;
            }
            if (diff < (biggestDeficit.regionA - biggestDeficit.regionB)) {
                biggestDeficit = d;
            }
        });

        return { biggestAdvantage, biggestDeficit };
    }, [comparisonData]);

    if (isLoadingRegions || isLoadingValues) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

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
                                    {regions.map(r => (
                                        <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center justify-center">
                            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                                <ArrowRightLeft className="h-5 w-5" />
                            </div>
                        </div>

                        <div className="w-full md:w-1/3 space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Région B (Comparaison)</label>
                            <Select value={regionB} onValueChange={setRegionB}>
                                <SelectTrigger className="bg-background">
                                    <SelectValue placeholder="Sélectionner une région" />
                                </SelectTrigger>
                                <SelectContent>
                                    {regions.map(r => (
                                        <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                                    ))}
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
                        {comparisonData.length > 0 ? (
                            <ComparisonChart
                                data={comparisonData}
                                bars={[
                                    { key: 'regionA', name: regionAName, color: '#3b82f6' },
                                    { key: 'regionB', name: regionBName, color: '#f59e0b' },
                                ]}
                                height={350}
                            />
                        ) : (
                            <div className="flex h-[350px] items-center justify-center text-muted-foreground italic">
                                Aucune donnée disponible pour cette comparaison.
                            </div>
                        )}
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
                            {summary ? (
                                <>
                                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900/30">
                                        <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Avantage {regionAName}</p>
                                        <p className="text-2xl font-bold text-blue-600 mt-1">
                                            {summary.biggestAdvantage.regionA > summary.biggestAdvantage.regionB ? '+' : ''}
                                            {(summary.biggestAdvantage.regionA - summary.biggestAdvantage.regionB).toFixed(1)}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">Sur {summary.biggestAdvantage.name} par rapport à {regionBName}.</p>
                                    </div>

                                    <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-900/30">
                                        <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Déficit {regionAName}</p>
                                        <p className="text-2xl font-bold text-amber-600 mt-1">
                                            {(summary.biggestDeficit.regionA - summary.biggestDeficit.regionB).toFixed(1)}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">Sur {summary.biggestDeficit.name}.</p>
                                    </div>
                                </>
                            ) : (
                                <p className="text-sm text-muted-foreground italic">Aucune synthèse disponible.</p>
                            )}

                            <Button 
                                className="w-full" 
                                variant="outline"
                                onClick={() => {
                                    const element = document.createElement('a');
                                    const file = new Blob([`Rapport Comparatif\n\nRégion A: ${regionAName}\nRégion B: ${regionBName}\n\nComparaison des indicateurs clés`], { type: 'text/plain' });
                                    element.href = URL.createObjectURL(file);
                                    element.download = `comparaison_${regionAName}_${regionBName}_${Date.now()}.txt`;
                                    document.body.appendChild(element);
                                    element.click();
                                    document.body.removeChild(element);
                                }}
                            >
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

