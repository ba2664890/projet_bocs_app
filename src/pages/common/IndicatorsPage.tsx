import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, TrendingUp, Target, BarChart3, Filter } from 'lucide-react';
import { useIndicators, useIndicatorValues } from '@/hooks/useData';
import { TrendChart } from '@/components/charts/TrendChart';

export const IndicatorsPage = () => {
  const location = useLocation();
  const space = location.pathname.split('/')[1] as any;
  const isEmbeddedInInstitutionLayout = space === 'institution';
  const { indicators, isLoading: loadingIndicators } = useIndicators();
  const { allValues, isLoading: loadingValues } = useIndicatorValues();
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'value'>('name');

  const filteredIndicators = useMemo(() => {
    let filtered = indicators;
    if (selectedSector !== 'all') {
      filtered = filtered.filter(i => i.sector === selectedSector);
    }
    return filtered.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
  }, [indicators, selectedSector, sortBy]);

  const sectors = Array.from(new Set(indicators.map(i => i.sector)));

  // Calculate summary statistics
  const summary = useMemo(() => {
    const uniqueIndicators = new Set(allValues.map(v => v.indicatorId)).size;
    const uniqueRegions = new Set(allValues.map(v => v.geographicId)).size;
    const recentValues = allValues.slice(0, 10);
    const avgValue = recentValues.length > 0 ? recentValues.reduce((a, v) => a + v.value, 0) / recentValues.length : 0;

    return {
      totalIndicators: uniqueIndicators,
      totalRegions: uniqueRegions,
      dataPoints: allValues.length,
      avgValue: avgValue.toFixed(1),
    };
  }, [allValues]);

  const isLoading = loadingIndicators || loadingValues;

  if (isLoading) {
    const loadingContent = (
      <div className="flex h-[600px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );

    if (isEmbeddedInInstitutionLayout) {
      return loadingContent;
    }

    return (
      <MainLayout space={space} title="Indicateurs">
        {loadingContent}
      </MainLayout>
    );
  }

  const content = (
    <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-card p-6 rounded-xl border shadow-sm">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight">Tableau de bord des Indicateurs</h2>
            <p className="text-muted-foreground">Suivi des performance des secteurs clés</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">Indicateurs</p>
                <BarChart3 className="h-4 w-4 text-blue-600" />
              </div>
              <p className="text-2xl font-bold">{summary.totalIndicators}</p>
              <p className="text-xs text-muted-foreground">Depuis le backend</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">Régions</p>
                <Target className="h-4 w-4 text-green-600" />
              </div>
              <p className="text-2xl font-bold">{summary.totalRegions}</p>
              <p className="text-xs text-muted-foreground">Couverture géographique</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">Points de données</p>
                <TrendingUp className="h-4 w-4 text-amber-600" />
              </div>
              <p className="text-2xl font-bold">{summary.dataPoints}</p>
              <p className="text-xs text-muted-foreground">Valeurs collectées</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">Moyenne</p>
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </div>
              <p className="text-2xl font-bold">{summary.avgValue}%</p>
              <p className="text-xs text-muted-foreground">Tendance générale</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="space-y-2">
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filtres
                </CardTitle>
              </div>
              <div className="flex gap-3 flex-wrap">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Secteur</label>
                  <Select value={selectedSector} onValueChange={setSelectedSector}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Tous les secteurs" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les secteurs</SelectItem>
                      {sectors.map(sector => (
                        <SelectItem key={sector} value={sector}>
                          {sector}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Trier par</label>
                  <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Trier par" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Nom</SelectItem>
                      <SelectItem value="value">Valeur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Indicators Table */}
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Indicateurs ({filteredIndicators.length})
            </CardTitle>
            <CardDescription>
              Liste complète des indicateurs avec leurs valeurs récentes
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Indicateur</TableHead>
                    <TableHead>Secteur</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Unité</TableHead>
                    <TableHead className="text-right">Valeur recent</TableHead>
                    <TableHead className="text-right">Cible</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredIndicators.map(indicator => {
                    const recentValue = allValues
                      .filter(v => v.indicatorId === indicator.id)
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .at(0);

                    const statusColor = recentValue
                      ? recentValue.value >= (indicator.targetValue || 0)
                        ? 'bg-green-50 dark:bg-green-900/20'
                        : 'bg-red-50 dark:bg-red-900/20'
                      : 'bg-gray-50';

                    return (
                      <TableRow key={indicator.id} className={statusColor}>
                        <TableCell className="font-medium">{indicator.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{indicator.sector}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-xs">
                          {indicator.description || '-'}
                        </TableCell>
                        <TableCell>{indicator.unit}</TableCell>
                        <TableCell className="text-right font-mono">
                          {recentValue ? `${recentValue.value.toFixed(1)}` : 'N/A'}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {indicator.targetValue?.toFixed(1) || 'N/A'}
                        </TableCell>
                        <TableCell>
                          {recentValue ? (
                            recentValue.value >= (indicator.targetValue || 0) ? (
                              <Badge className="bg-green-600">Atteint</Badge>
                            ) : (
                              <Badge className="bg-red-600">En retard</Badge>
                            )
                          ) : (
                            <Badge variant="secondary">Pas de données</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Trend Chart */}
        {allValues.length > 0 && (
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Tendances
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <TrendChart
                data={allValues.slice(0, 20).map((v, idx) => ({
                  name: `V${idx}`,
                  value: v.value,
                  target: v.targetValue || 75,
                }))}
                lines={[
                  { key: 'value', name: 'Valeur actuelle', color: '#3b82f6' },
                  { key: 'target', name: 'Cible', color: '#f59e0b' },
                ]}
                height={350}
              />
            </CardContent>
          </Card>
        )}

        {/* Info Box */}
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30">
          <CardContent className="p-4">
            <p className="text-sm text-blue-900 dark:text-blue-200">
              <span className="font-semibold">✓ Données opérationnelles:</span> Tous les indicateurs et leurs valeurs sont chargés en temps réel depuis le backend. Filtrez par secteur pour affiner votre analyse.
            </p>
          </CardContent>
        </Card>
    </div>
  );

  if (isEmbeddedInInstitutionLayout) {
    return content;
  }

  return (
    <MainLayout space={space} title="Indicateurs">
      {content}
    </MainLayout>
  );
};
