import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ComparisonChart } from '@/components/charts/ComparisonChart';
import {
  ArrowRightLeft,
  TrendingUp,
  Trophy,
  FileText,
  Loader2,
  GitCompare,
  Target,
  BarChart3,
} from 'lucide-react';
import { useGeographicData, useIndicatorValues } from '@/hooks/useData';

export const ComparePage = () => {
  const { regions, isLoading: isLoadingRegions } = useGeographicData();
  const { allValues, isLoading: isLoadingValues } = useIndicatorValues();

  const [regionA, setRegionA] = useState<string>('');
  const [regionB, setRegionB] = useState<string>('');

  useEffect(() => {
    if (regions.length >= 2 && !regionA && !regionB) {
      setRegionA(regions[0].id);
      setRegionB(regions[1].id);
    }
  }, [regions, regionA, regionB]);

  const comparisonData = useMemo(() => {
    if (!regionA || !regionB) return [];

    const relevantValues = allValues.filter((value) => value.geographicId === regionA || value.geographicId === regionB);
    const mapped = new Map<string, { name: string; regionA: number; regionB: number }>();

    relevantValues.forEach((value) => {
      const key = value.indicatorId;
      if (!mapped.has(key)) {
        mapped.set(key, {
          name: value.indicatorName || `Indicateur ${key}`,
          regionA: 0,
          regionB: 0,
        });
      }

      const current = mapped.get(key)!;
      if (value.geographicId === regionA) current.regionA = value.value;
      if (value.geographicId === regionB) current.regionB = value.value;
    });

    return Array.from(mapped.values()).slice(0, 7);
  }, [allValues, regionA, regionB]);

  const regionAName = regions.find((region) => region.id === regionA)?.name || 'Région A';
  const regionBName = regions.find((region) => region.id === regionB)?.name || 'Région B';

  const summary = useMemo(() => {
    if (comparisonData.length === 0) return null;

    let biggestAdvantage = comparisonData[0];
    let biggestDeficit = comparisonData[0];

    comparisonData.forEach((item) => {
      const diff = item.regionA - item.regionB;
      if (diff > biggestAdvantage.regionA - biggestAdvantage.regionB) {
        biggestAdvantage = item;
      }
      if (diff < biggestDeficit.regionA - biggestDeficit.regionB) {
        biggestDeficit = item;
      }
    });

    const averageDelta =
      comparisonData.reduce((sum, item) => sum + (item.regionA - item.regionB), 0) / comparisonData.length;

    const regionALeadCount = comparisonData.filter((item) => item.regionA > item.regionB).length;

    return {
      biggestAdvantage,
      biggestDeficit,
      averageDelta,
      regionALeadCount,
    };
  }, [comparisonData]);

  const handleDownloadReport = () => {
    const reportBody = [
      'Rapport comparatif territorial',
      '',
      `Région A: ${regionAName}`,
      `Région B: ${regionBName}`,
      `Indicateurs analysés: ${comparisonData.length}`,
      summary ? `Delta moyen (A-B): ${summary.averageDelta.toFixed(2)}` : 'Delta moyen (A-B): N/A',
    ].join('\n');

    const element = document.createElement('a');
    const file = new Blob([reportBody], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `comparaison_${regionAName}_${regionBName}_${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (isLoadingRegions || isLoadingValues) {
    return (
      <div className="flex h-[420px] items-center justify-center rounded-2xl border border-slate-200/70 bg-white/70 dark:border-slate-800 dark:bg-slate-900/60">
        <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--institution-blue))]" />
      </div>
    );
  }

  return (
    <div className="space-y-7">
      <section className="institution-hero">
        <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <p className="institution-kicker">Analyse comparative</p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Comparateur territorial</h1>
            <p className="max-w-2xl text-sm text-slate-100/90 sm:text-base">
              Mesurez les écarts de performance entre régions et identifiez les indicateurs où concentrer les efforts.
            </p>
          </div>
          <div className="rounded-xl border border-white/25 bg-white/10 p-4 text-sm">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-200">Indicateurs comparés</p>
            <p className="mt-1 text-3xl font-semibold">{comparisonData.length}</p>
            <p className="text-xs text-slate-200/90">Sur le périmètre sélectionné</p>
          </div>
        </div>

        <div className="relative z-10 mt-5 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-medium">
            <GitCompare className="h-3.5 w-3.5" />
            {regionAName} vs {regionBName}
          </span>
          {summary && (
            <span className="inline-flex items-center gap-1 rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-medium">
              <Target className="h-3.5 w-3.5" />
              Delta moyen {summary.averageDelta > 0 ? '+' : ''}
              {summary.averageDelta.toFixed(1)}
            </span>
          )}
        </div>
      </section>

      <Card className="institution-panel">
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="grid w-full gap-4 md:grid-cols-[1fr_auto_1fr] lg:max-w-4xl">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Région A (référence)
                </label>
                <Select value={regionA} onValueChange={setRegionA}>
                  <SelectTrigger className="h-10 bg-white dark:bg-slate-950">
                    <SelectValue placeholder="Sélectionner une région" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region.id} value={region.id}>
                        {region.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end justify-center pb-1">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setRegionA(regionB);
                    setRegionB(regionA);
                  }}
                  className="rounded-full"
                >
                  <ArrowRightLeft className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Région B (comparaison)
                </label>
                <Select value={regionB} onValueChange={setRegionB}>
                  <SelectTrigger className="h-10 bg-white dark:bg-slate-950">
                    <SelectValue placeholder="Sélectionner une région" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region.id} value={region.id}>
                        {region.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <Badge variant="outline" className="h-10 px-3 text-sm">
                {comparisonData.length} indicateurs
              </Badge>
              <Button variant="outline" className="h-10" onClick={handleDownloadReport}>
                <FileText className="mr-2 h-4 w-4" />
                Télécharger le rapport
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card className="institution-panel">
          <CardHeader className="border-b border-slate-200/70 pb-5 dark:border-slate-800/80">
            <CardTitle className="flex items-center gap-2 text-xl text-slate-900 dark:text-slate-100">
              <TrendingUp className="h-5 w-5 text-[hsl(var(--institution-blue))]" />
              Analyse comparative
            </CardTitle>
            <CardDescription>Performances respectives des régions sur les indicateurs clés sélectionnés.</CardDescription>
          </CardHeader>
          <CardContent className="pt-5">
            {comparisonData.length > 0 ? (
              <ComparisonChart
                data={comparisonData}
                bars={[
                  { key: 'regionA', name: regionAName, color: '#0ea5e9' },
                  { key: 'regionB', name: regionBName, color: '#0f766e' },
                ]}
                height={360}
              />
            ) : (
              <div className="flex h-[360px] items-center justify-center rounded-xl border border-dashed border-slate-300/90 bg-slate-50 text-muted-foreground dark:border-slate-700 dark:bg-slate-900/60">
                Aucune donnée disponible pour cette comparaison.
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="institution-panel">
            <CardHeader className="border-b border-slate-200/70 pb-4 dark:border-slate-800/80">
              <CardTitle className="flex items-center gap-2 text-lg text-slate-900 dark:text-slate-100">
                <Trophy className="h-5 w-5 text-amber-500" />
                Synthèse décisionnelle
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-5">
              {summary ? (
                <>
                  <div className="rounded-xl border border-sky-200 bg-sky-50/70 p-4 dark:border-sky-500/30 dark:bg-sky-500/10">
                    <p className="text-sm font-semibold text-sky-800 dark:text-sky-300">Avantage {regionAName}</p>
                    <p className="mt-1 text-3xl font-semibold text-sky-700 dark:text-sky-200">
                      {summary.biggestAdvantage.regionA > summary.biggestAdvantage.regionB ? '+' : ''}
                      {(summary.biggestAdvantage.regionA - summary.biggestAdvantage.regionB).toFixed(1)}
                    </p>
                    <p className="mt-1 text-xs text-sky-700/85 dark:text-sky-300/85">
                      Sur {summary.biggestAdvantage.name} par rapport à {regionBName}.
                    </p>
                  </div>

                  <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 dark:border-amber-500/30 dark:bg-amber-500/10">
                    <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">Point de vigilance {regionAName}</p>
                    <p className="mt-1 text-3xl font-semibold text-amber-700 dark:text-amber-200">
                      {(summary.biggestDeficit.regionA - summary.biggestDeficit.regionB).toFixed(1)}
                    </p>
                    <p className="mt-1 text-xs text-amber-700/85 dark:text-amber-300/85">
                      Sur {summary.biggestDeficit.name} face à {regionBName}.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-900/65">
                    <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Indicateurs où {regionAName} est devant</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                      {summary.regionALeadCount}/{comparisonData.length}
                    </p>
                  </div>
                </>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-300/90 bg-slate-50 p-6 text-center text-sm text-muted-foreground dark:border-slate-700 dark:bg-slate-900/60">
                  Aucune synthèse disponible pour les régions sélectionnées.
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="institution-panel">
            <CardContent className="p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Lecture rapide</p>
              <p className="mt-2 flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-slate-100">
                <BarChart3 className="h-4 w-4 text-[hsl(var(--institution-blue))]" />
                Comparez plusieurs années en exportant le rapport détaillé.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};
