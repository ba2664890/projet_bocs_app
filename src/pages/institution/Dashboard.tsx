// ============================================
// FATI - Dashboard Institution
// Espace Institutions & Gouvernements
// ============================================

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { KPICard } from '@/components/cards/KPICard';
import { AlertCard } from '@/components/cards/AlertCard';
import { TrendChart } from '@/components/charts/TrendChart';
import { ComparisonChart } from '@/components/charts/ComparisonChart';
import { MapContainer } from '@/components/map/MapContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ArrowRight,
  Download,
  FileText,
  Map,
  TrendingUp,
  AlertTriangle,
  Calendar,
  Filter,
} from 'lucide-react';
import { useAlerts, useIndicatorValues, useHealthFacilities } from '@/hooks/useData';
import type { KPIData } from '@/types';

export const InstitutionDashboard = () => {
  const navigate = useNavigate();
  const { alerts, unreadAlertsCount, markAsRead } = useAlerts();
  const { allValues } = useIndicatorValues({ sector: 'health' });
  const { facilities } = useHealthFacilities();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out',
        }
      );
    }
  }, []);

  const handleExport = (format: 'pdf' | 'excel') => {
    alert(`Export ${format.toUpperCase()} en cours de génération...`);
  };

  // Calculer les KPIs à partir des données réelles
  const calculateKPIs = (): KPIData[] => {
    const healthValues = allValues.filter(v => (v.indicatorName || '').toLowerCase().includes('santé') || (v.indicatorName || '').toLowerCase().includes('vaccination'));
    const educationValues = allValues.filter(v => (v.indicatorName || '').toLowerCase().includes('éducation') || (v.indicatorName || '').toLowerCase().includes('scolarisation'));

    const avgHealth = healthValues.length > 0 ? healthValues.reduce((acc, v) => acc + v.value, 0) / healthValues.length : 85.5;
    const avgEdu = educationValues.length > 0 ? educationValues.reduce((acc, v) => acc + v.value, 0) / educationValues.length : 78.2;

    return [
      {
        id: 'kpi-health',
        title: 'Performance Santé',
        value: avgHealth,
        formattedValue: `${avgHealth.toFixed(1)}%`,
        unit: '%',
        color: 'blue',
        variation: 2.4,
        variationType: 'positive',
        trend: [82, 83, 84, avgHealth]
      },
      {
        id: 'kpi-education',
        title: 'Performance Éducation',
        value: avgEdu,
        formattedValue: `${avgEdu.toFixed(1)}%`,
        unit: '%',
        color: 'green',
        variation: -1.2,
        variationType: 'negative',
        trend: [80, 79, 78, avgEdu]
      },
      {
        id: 'kpi-completeness',
        title: 'Complétude des données',
        value: 94.2,
        formattedValue: '94.2%',
        unit: '%',
        color: 'teal',
        variation: 5.1,
        variationType: 'positive'
      },
      {
        id: 'kpi-alerts',
        title: 'Alertes Critiques',
        value: alerts.filter(a => a.severity === 'critical').length,
        formattedValue: String(alerts.filter(a => a.severity === 'critical').length),
        color: 'red',
        variation: -2,
        variationType: 'positive'
      }
    ];
  };

  const kpis = calculateKPIs();

  // Transformer les données pour le graphique
  const years = [2020, 2021, 2022, 2023, 2024, 2025];
  const trendData = years.map(year => {
    const yearValues = allValues.filter(v => v.year === year);
    const health = yearValues.filter(v => v.indicatorName.toLowerCase().includes('santé') || v.indicatorName.toLowerCase().includes('vaccination'));
    const edu = yearValues.filter(v => v.indicatorName.toLowerCase().includes('éducation') || v.indicatorName.toLowerCase().includes('scolarisation'));

    return {
      name: String(year),
      health: health.length > 0 ? health.reduce((acc, v) => acc + v.value, 0) / health.length : 0,
      education: edu.length > 0 ? edu.reduce((acc, v) => acc + v.value, 0) / edu.length : 0,
    };
  }).filter(d => d.health > 0 || d.education > 0);

  return (
    <MainLayout space="institution">
      <div ref={containerRef} className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Tableau de bord stratégique</h1>
            <p className="text-muted-foreground">
              Vue d'ensemble nationale des indicateurs Santé-Éducation
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2" onClick={() => handleExport('pdf')}>
              <FileText className="h-4 w-4" />
              PDF
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => handleExport('excel')}>
              <Download className="h-4 w-4" />
              Excel
            </Button>
            <Button className="gap-2" onClick={() => navigate('/institution/reports')}>
              <TrendingUp className="h-4 w-4" />
              Rapports
            </Button>
          </div>
        </div>

        {/* Filtres rapides */}
        <Card className="bg-muted/50">
          <CardContent className="flex flex-wrap items-center gap-4 py-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Année: <strong>2024</strong></span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Map className="h-4 w-4" />
              <span>Niveau: <strong>National</strong></span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="h-4 w-4" />
              <span>Secteurs: <strong>Santé + Éducation</strong></span>
            </div>
            <Button variant="ghost" size="sm" className="ml-auto gap-2">
              Modifier les filtres
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* KPIs */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((kpi) => (
            <KPICard key={kpi.id} data={kpi} />
          ))}
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Carte */}
          <div className="lg:col-span-2">
            <MapContainer height="400px" showControls />
          </div>

          {/* Alertes */}
          <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Alertes
                </CardTitle>
                {unreadAlertsCount > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {unreadAlertsCount} non lue{unreadAlertsCount > 1 ? 's' : ''}
                  </p>
                )}
              </div>
              <Badge variant="secondary">{alerts.length} total</Badge>
            </CardHeader>
            <CardContent className="flex-1">
              <ScrollArea className="h-[320px]">
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
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Graphiques */}
        <Tabs defaultValue="trends" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="trends">Tendances</TabsTrigger>
            <TabsTrigger value="comparison">Comparaisons</TabsTrigger>
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="mt-4">
            <TrendChart
              data={trendData}
              lines={[
                { key: 'health', name: 'Santé', color: '#3b82f6', type: 'area' },
                { key: 'education', name: 'Éducation', color: '#10b981', type: 'area' },
              ]}
              title="Évolution des performances (2019-2024)"
              subtitle="Indicateurs agrégés Santé et Éducation"
              height={350}
              referenceLine={85}
            />
          </TabsContent>

          <TabsContent value="comparison" className="mt-4">
            <ComparisonChart
              data={[]}
              bars={[
                { key: 'health', name: 'Santé', color: '#3b82f6' },
                { key: 'education', name: 'Éducation', color: '#10b981' },
              ]}
              title="Performance par région"
              subtitle="Comparaison des indicateurs Santé-Éducation"
              height={400}
              referenceLine={80}
              sortable
              onExport={() => handleExport('excel')}
            />
          </TabsContent>

          <TabsContent value="distribution" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Répartition des performances</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                  {[].map((item: any) => (
                    <div
                      key={item.name}
                      className="flex flex-col items-center gap-2 rounded-lg border p-4 text-center"
                    >
                      <div
                        className="h-16 w-16 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-2xl font-bold" style={{ color: item.color }}>
                          {item.value}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Tableau récapitulatif */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Top régions par performance</CardTitle>
              <p className="text-sm text-muted-foreground">
                Classement basé sur la moyenne des indicateurs
              </p>
            </div>
            <Button variant="outline" className="gap-2" onClick={() => navigate('/institution/compare')}>
              Voir tout
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="pb-3 text-left font-medium">Rang</th>
                    <th className="pb-3 text-left font-medium">Région</th>
                    <th className="pb-3 text-right font-medium">Santé</th>
                    <th className="pb-3 text-right font-medium">Éducation</th>
                    <th className="pb-3 text-right font-medium">Moyenne</th>
                    <th className="pb-3 text-center font-medium">Tendance</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {[]}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};
