// ============================================
// FATI - Dashboard Institution
// Espace Institutions & Gouvernements
// ============================================

import { useEffect, useRef } from 'react';
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
  Zap
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

export const InstitutionDashboard = () => {
  const navigate = useNavigate();
  const { alerts, unreadAlertsCount, markAsRead } = useAlerts();
  const { allValues } = useIndicatorValues();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current.children,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
        }
      );
    }
  }, []);

  const handleExport = (format: 'pdf' | 'excel') => {
    alert(`Export ${format.toUpperCase()} en cours de génération...`);
  };

  const calculateKPIs = (): KPIData[] => {
    const healthValues = allValues.filter(v => (v.indicatorName || '').toLowerCase().includes('santé') || (v.indicatorName || '').toLowerCase().includes('vaccination'));
    const educationValues = allValues.filter(v => (v.indicatorName || '').toLowerCase().includes('éducation') || (v.indicatorName || '').toLowerCase().includes('scolarisation'));

    const avgHealth = healthValues.length > 0 ? healthValues.reduce((acc, v) => acc + v.value, 0) / healthValues.length : 0;
    const avgEdu = educationValues.length > 0 ? educationValues.reduce((acc, v) => acc + v.value, 0) / educationValues.length : 0;

    return [
      {
        id: 'kpi-health',
        title: 'Performance Santé',
        value: avgHealth,
        formattedValue: avgHealth > 0 ? `${avgHealth.toFixed(1)}%` : 'N/A',
        unit: '%',
        color: 'blue',
        variation: 2.5,
        variationType: 'positive',
        trend: [65, 68, 70, 72, 75, avgHealth]
      },
      {
        id: 'kpi-education',
        title: 'Performance Éducation',
        value: avgEdu,
        formattedValue: avgEdu > 0 ? `${avgEdu.toFixed(1)}%` : 'N/A',
        unit: '%',
        color: 'green',
        variation: 1.2,
        variationType: 'positive',
        trend: [60, 62, 65, 66, 68, avgEdu]
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
        trend: [90, 91, 92, 93, 94, 94.2]
      },
      {
        id: 'kpi-alerts',
        title: 'Alertes Critiques',
        value: alerts.filter(a => a.severity === 'critical').length,
        formattedValue: String(alerts.filter(a => a.severity === 'critical').length),
        color: 'red',
        variation: -1,
        variationType: 'positive', // Less alerts is good
        trend: []
      }
    ];
  };

  const kpis = calculateKPIs();

  // Extract unique years from data or default to recent years
  const availableYears = Array.from(new Set(allValues.map(v => v.year))).sort();
  const years = availableYears.length > 0 ? availableYears : [new Date().getFullYear()];

  const trendData = years.map(year => {
    const yearValues = allValues.filter(v => v.year === year);
    const health = yearValues.filter(v => (v.indicatorName || '').toLowerCase().includes('santé') || (v.indicatorName || '').toLowerCase().includes('vaccination'));
    const edu = yearValues.filter(v => (v.indicatorName || '').toLowerCase().includes('éducation') || (v.indicatorName || '').toLowerCase().includes('scolarisation'));

    return {
      name: String(year),
      health: health.length > 0 ? health.reduce((acc, v) => acc + v.value, 0) / health.length : 0,
      education: edu.length > 0 ? edu.reduce((acc, v) => acc + v.value, 0) / edu.length : 0,
    };
  });

  return (
    <div ref={containerRef} className="space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-card p-6 rounded-xl border shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Tableau de bord stratégique
            </h1>
            <Badge variant="outline" className="ml-2 border-blue-200 text-blue-700 bg-blue-50">National</Badge>
          </div>
          <p className="text-muted-foreground text-lg">
            Vue d'ensemble et pilotage des indicateurs de performance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="hidden sm:flex gap-2" onClick={() => handleExport('pdf')}>
            <FileText className="h-4 w-4" />
            Rapport PDF
          </Button>
          <Button size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700" onClick={() => handleExport('excel')}>
            <Download className="h-4 w-4" />
            Exporter
          </Button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <KPICard key={kpi.id} data={kpi} className="shadow-sm hover:shadow-md transition-all duration-300" />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Charts Area */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-sm border-none bg-background/60 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  Analyse des Tendances
                </CardTitle>
                <Tabs defaultValue="trends" className="w-[300px]">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="trends">Evolution</TabsTrigger>
                    <TabsTrigger value="comparison">Comparaison</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <CardDescription>Visualisation comparative des secteurs Santé et Education sur 5 ans</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <TrendChart
                data={trendData}
                lines={[
                  { key: 'health', name: 'Santé', color: '#3b82f6' },
                  { key: 'education', name: 'Éducation', color: '#10b981' },
                ]}
                height={350}
                referenceLine={80}
              />
            </CardContent>
          </Card>

          {/* Map Section */}
          <Card className="overflow-hidden shadow-sm">
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-2">
                  <MapIcon className="h-5 w-5 text-indigo-500" />
                  Répartition Géographique
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => navigate('/institution/compare')}>
                  Vue détaillée <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <MapContainer height="400px" showControls />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar: Alerts & Insights */}
        <div className="space-y-6">
          {/* AI Insights / Highlights */}
          <Card className="bg-gradient-to-br from-indigo-50 to-white dark:from-slate-900 dark:to-slate-950 border-indigo-100 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
                <Zap className="h-5 w-5 fill-indigo-100" />
                Points Clés (IA)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3 items-start p-3 bg-white dark:bg-slate-900 rounded-lg border border-indigo-50 dark:border-slate-800 shadow-sm">
                <div className="mt-1 h-2 w-2 rounded-full bg-green-500 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">Progression notable</p>
                  <p className="text-xs text-muted-foreground mt-1">Le taux de vaccination a augmenté de 12% dans la région Nord par rapport à 2023.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start p-3 bg-white dark:bg-slate-900 rounded-lg border border-indigo-50 dark:border-slate-800 shadow-sm">
                <div className="mt-1 h-2 w-2 rounded-full bg-amber-500 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">Attention requise</p>
                  <p className="text-xs text-muted-foreground mt-1">Léger recul de la scolarisation primaire observé dans 3 districts du Sud.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alerts Widget */}
          <Card className="flex flex-col shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Alertes Récentes
                </CardTitle>
              </div>
              <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200">{unreadAlertsCount} nouvelles</Badge>
            </CardHeader>
            <CardContent className="flex-1">
              <ScrollArea className="h-[400px] pr-4">
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
                    <div className="text-center py-8">
                      <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                        <Activity className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground">Tout est calme. Aucune alerte.</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
              <Separator className="my-4" />
              <Button variant="ghost" className="w-full text-muted-foreground hover:text-foreground" onClick={() => navigate('/institution/alerts')}>
                Voir toutes les alertes <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
