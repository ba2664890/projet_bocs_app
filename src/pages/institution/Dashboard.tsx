import { useEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Download,
  FileText,
  Map as MapIcon,
  AlertTriangle,
  TrendingUp,
  Activity,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { useAlerts, useIndicatorValues } from '@/hooks/useData';
import type { KPIData } from '@/types';
import { MapContainer } from '@/components/map/MapContainer';
import { KPICard } from '@/components/cards/KPICard';
import { AlertCard } from '@/components/cards/AlertCard';
import { TrendChart } from '@/components/charts/TrendChart';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

const includesAny = (value: string, words: string[]) => words.some((word) => value.includes(word));

export const InstitutionDashboard = () => {
  const navigate = useNavigate();
  const { alerts, unreadAlertsCount, markAsRead } = useAlerts();
  const { allValues } = useIndicatorValues();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current.children,
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.09,
          ease: 'power3.out',
        }
      );
    }
  }, []);

  const healthValues = useMemo(
    () =>
      allValues.filter((v) => {
        const name = (v.indicatorName || '').toLowerCase();
        return includesAny(name, ['santé', 'vaccination']);
      }),
    [allValues]
  );

  const educationValues = useMemo(
    () =>
      allValues.filter((v) => {
        const name = (v.indicatorName || '').toLowerCase();
        return includesAny(name, ['éducation', 'scolarisation']);
      }),
    [allValues]
  );

  const avgHealth = useMemo(() => {
    if (healthValues.length === 0) return 0;
    return healthValues.reduce((acc, v) => acc + v.value, 0) / healthValues.length;
  }, [healthValues]);

  const avgEducation = useMemo(() => {
    if (educationValues.length === 0) return 0;
    return educationValues.reduce((acc, v) => acc + v.value, 0) / educationValues.length;
  }, [educationValues]);

  const criticalAlertsCount = alerts.filter((a) => a.severity === 'critical').length;
  const resolvedShare = alerts.length > 0 ? ((alerts.length - unreadAlertsCount) / alerts.length) * 100 : 100;

  const availableYears = Array.from(new Set(allValues.map((v) => v.year))).sort((a, b) => a - b);
  const years = availableYears.length > 0 ? availableYears : [new Date().getFullYear()];

  const trendData = years.map((year) => {
    const yearValues = allValues.filter((v) => v.year === year);
    const yearHealth = yearValues.filter((v) => includesAny((v.indicatorName || '').toLowerCase(), ['santé', 'vaccination']));
    const yearEducation = yearValues.filter((v) => includesAny((v.indicatorName || '').toLowerCase(), ['éducation', 'scolarisation']));

    return {
      name: String(year),
      health: yearHealth.length > 0 ? yearHealth.reduce((acc, v) => acc + v.value, 0) / yearHealth.length : 0,
      education: yearEducation.length > 0 ? yearEducation.reduce((acc, v) => acc + v.value, 0) / yearEducation.length : 0,
    };
  });

  const kpis: KPIData[] = [
    {
      id: 'kpi-health',
      title: 'Performance santé',
      value: avgHealth,
      formattedValue: avgHealth > 0 ? `${avgHealth.toFixed(1)}%` : 'N/A',
      unit: '%',
      color: 'blue',
      variation: 2.5,
      variationType: 'positive',
      trend: [65, 68, 70, 72, 75, avgHealth],
    },
    {
      id: 'kpi-education',
      title: 'Performance éducation',
      value: avgEducation,
      formattedValue: avgEducation > 0 ? `${avgEducation.toFixed(1)}%` : 'N/A',
      unit: '%',
      color: 'green',
      variation: 1.2,
      variationType: 'positive',
      trend: [60, 62, 65, 66, 68, avgEducation],
    },
    {
      id: 'kpi-completeness',
      title: 'Complétude des données',
      value: 94.2,
      formattedValue: '94.2%',
      unit: '%',
      color: 'teal',
      variation: 0.5,
      variationType: 'positive',
      trend: [90, 91, 92, 93, 94, 94.2],
    },
    {
      id: 'kpi-alerts',
      title: 'Alertes critiques',
      value: criticalAlertsCount,
      formattedValue: String(criticalAlertsCount),
      color: 'red',
      variation: -1,
      variationType: 'positive',
      trend: [],
    },
  ];

  const strategicInsights = [
    {
      title: 'Dynamique positive',
      message: `Le secteur santé se stabilise à ${avgHealth.toFixed(1)}%, avec une progression régulière sur les derniers exercices.`,
      tone: 'success',
    },
    {
      title: 'Arbitrage à prioriser',
      message: `Écart de ${(Math.abs(avgHealth - avgEducation)).toFixed(1)} points entre Santé et Éducation: renforcer le suivi ciblé des districts en recul.`,
      tone: 'warning',
    },
    {
      title: 'Qualité opérationnelle',
      message: `${resolvedShare.toFixed(0)}% des alertes sont déjà traitées, maintenir ce rythme pour réduire les risques critiques.`,
      tone: 'info',
    },
  ] as const;

  const handleExport = (format: 'pdf' | 'excel') => {
    const content =
      format === 'pdf'
        ? 'Rapport PDF - Tableau de bord stratégique\n\nCe fichier serait un PDF contenant tous les indicateurs et alertes.'
        : `Tableau,Performance Santé,Performance Éducation,Complétude\nValeurs,${healthValues.length},${educationValues.length},94.2`;

    const element = document.createElement('a');
    const file = new Blob([content], { type: format === 'pdf' ? 'application/pdf' : 'text/csv' });
    element.href = URL.createObjectURL(file);
    element.download = `tableau-de-bord.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div ref={containerRef} className="space-y-7">
      <section className="institution-hero">
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <p className="institution-kicker">Vision nationale</p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Tableau de bord stratégique</h1>
            <p className="max-w-2xl text-sm text-slate-100/90 sm:text-base">
              Consolidez la performance territoriale, anticipez les alertes prioritaires et pilotez les actions
              intersectorielles depuis un seul point d'entrée.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-medium">
                <AlertTriangle className="h-3.5 w-3.5" />
                {unreadAlertsCount} alertes non lues
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-medium">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Données jusqu'en {Math.max(...years)}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-white/35 bg-white/10 text-white hover:bg-white/20"
              onClick={() => handleExport('pdf')}
            >
              <FileText className="h-4 w-4" />
              Rapport PDF
            </Button>
            <Button
              size="sm"
              className="gap-2 bg-white text-slate-900 hover:bg-slate-100"
              onClick={() => handleExport('excel')}
            >
              <Download className="h-4 w-4" />
              Export Excel
            </Button>
          </div>
        </div>

        <div className="relative z-10 mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-white/25 bg-white/10 p-3">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-200">Données suivies</p>
            <p className="mt-1 text-2xl font-semibold">{allValues.length}</p>
            <p className="text-xs text-slate-200/85">Mesures consolidées</p>
          </div>
          <div className="rounded-xl border border-white/25 bg-white/10 p-3">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-200">Cycle actuel</p>
            <p className="mt-1 text-2xl font-semibold">{years.length} an(s)</p>
            <p className="text-xs text-slate-200/85">Historique exploité</p>
          </div>
          <div className="rounded-xl border border-white/25 bg-white/10 p-3">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-200">Alertes critiques</p>
            <p className="mt-1 text-2xl font-semibold">{criticalAlertsCount}</p>
            <p className="text-xs text-slate-200/85">Niveau à surveiller</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <KPICard
            key={kpi.id}
            data={kpi}
            className="border-slate-200/80 bg-white/90 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-950/65"
          />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <Card className="institution-panel overflow-hidden">
            <CardHeader className="space-y-3 border-b border-slate-200/70 pb-5 dark:border-slate-800/80">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <CardTitle className="flex items-center gap-2 text-xl text-slate-900 dark:text-slate-100">
                    <TrendingUp className="h-5 w-5 text-[hsl(var(--institution-blue))]" />
                    Analyse des tendances sectorielles
                  </CardTitle>
                  <CardDescription>
                    Évolution comparée des performances Santé et Éducation sur la période disponible.
                  </CardDescription>
                </div>
                <span className="institution-chip">{years[0]} - {years[years.length - 1]}</span>
              </div>
            </CardHeader>
            <CardContent className="pt-5">
              <TrendChart
                data={trendData}
                lines={[
                  { key: 'health', name: 'Santé', color: '#0891b2' },
                  { key: 'education', name: 'Éducation', color: '#1d4ed8' },
                ]}
                height={340}
                referenceLine={80}
              />
            </CardContent>
          </Card>

          <Card className="institution-panel overflow-hidden">
            <CardHeader className="border-b border-slate-200/70 pb-4 dark:border-slate-800/80">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <CardTitle className="flex items-center gap-2 text-xl text-slate-900 dark:text-slate-100">
                  <MapIcon className="h-5 w-5 text-[hsl(var(--institution-teal))]" />
                  Répartition géographique
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => navigate('/institution/compare')}>
                  Vue détaillée
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <MapContainer height="400px" showControls />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="institution-panel border-[hsl(var(--institution-blue)/0.25)] bg-gradient-to-br from-white via-white to-sky-50/70 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-slate-900 dark:text-slate-100">
                <Sparkles className="h-5 w-5 text-[hsl(var(--institution-blue))]" />
                Points clés de pilotage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {strategicInsights.map((insight) => (
                <div key={insight.title} className="rounded-xl border border-slate-200/70 bg-white/80 p-3 dark:border-slate-800 dark:bg-slate-900/65">
                  <div className="flex items-start gap-2">
                    <span
                      className={`mt-1 h-2.5 w-2.5 rounded-full ${
                        insight.tone === 'success'
                          ? 'bg-emerald-500'
                          : insight.tone === 'warning'
                            ? 'bg-amber-500'
                            : 'bg-sky-500'
                      }`}
                    />
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{insight.title}</p>
                      <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{insight.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="institution-panel flex flex-col">
            <CardHeader className="border-b border-slate-200/70 pb-4 dark:border-slate-800/80">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="flex items-center gap-2 text-lg text-slate-900 dark:text-slate-100">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Alertes récentes
                </CardTitle>
                <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30">
                  {unreadAlertsCount} nouvelles
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1 pt-5">
              <ScrollArea className="h-[360px] pr-4">
                <div className="space-y-3">
                  {alerts.slice(0, 5).map((alert) => (
                    <AlertCard
                      key={alert.id}
                      alert={alert}
                      compact
                      onMarkAsRead={markAsRead}
                      onClick={() => navigate('/institution/alerts')}
                    />
                  ))}
                  {alerts.length === 0 && (
                    <div className="rounded-xl border border-dashed border-slate-300/90 bg-slate-50 p-6 text-center dark:border-slate-700 dark:bg-slate-900/60">
                      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                        <Activity className="h-5 w-5 text-slate-500" />
                      </div>
                      <p className="text-sm text-muted-foreground">Aucune alerte active actuellement.</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
              <Button
                variant="ghost"
                className="mt-4 w-full text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                onClick={() => navigate('/institution/alerts')}
              >
                Voir toutes les alertes
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};
