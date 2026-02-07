// ============================================
// FATI - Dashboard Santé
// Espace Secteur Santé
// ============================================

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { KPICard } from '@/components/cards/KPICard';
import { TrendChart } from '@/components/charts/TrendChart';
import { MapContainer } from '@/components/map/MapContainer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ArrowRight,
  Download,
  Plus,
  Building2,
  Users,
  HeartPulse,
  TrendingUp,
  MapPin,
  Filter,
  Activity,
  FileText
} from 'lucide-react';
import { useHealthFacilities, useIndicatorValues } from '@/hooks/useData';
import type { KPIData } from '@/types';

export const HealthDashboard = () => {
  const navigate = useNavigate();
  const { allValues } = useIndicatorValues({ sector: 'health' });
  const { facilities } = useHealthFacilities();
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

  // KPIs Santé à partir des données réelles
  const calculateKPIs = (): KPIData[] => {
    // Search for specific indicators in the loaded values
    const vaccValue = allValues.find(v =>
      (v.indicatorName || '').toLowerCase().includes('vaccin') ||
      (v.indicatorCode || '').toLowerCase().includes('vacc')
    );
    const mortValue = allValues.find(v =>
      (v.indicatorName || '').toLowerCase().includes('mortal') ||
      (v.indicatorCode || '').toLowerCase().includes('mort')
    );
    const paluValue = allValues.find(v =>
      (v.indicatorName || '').toLowerCase().includes('palu') ||
      (v.indicatorCode || '').toLowerCase().includes('palu')
    );

    return [
      {
        id: 'h_kpi1',
        title: 'Couverture vaccinale',
        value: vaccValue?.value || 0,
        formattedValue: vaccValue?.valueFormatted || '0%',
        variation: vaccValue?.variation || 0,
        variationType: (vaccValue?.variation || 0) >= 0 ? 'positive' : 'negative',
        target: 100,
        achievementRate: vaccValue?.achievementRate || 0,
        unit: '%',
        color: 'blue',
        trend: allValues
          .filter(v => v.indicatorId === vaccValue?.indicatorId)
          .sort((a, b) => a.year - b.year)
          .map(v => v.value)
      },
      {
        id: 'h_kpi2',
        title: 'Mortalité maternelle',
        value: mortValue?.value || 0,
        formattedValue: mortValue?.valueFormatted || '0',
        variation: mortValue?.variation || 0,
        variationType: (mortValue?.variation || 0) <= 0 ? 'positive' : 'negative',
        target: 200,
        achievementRate: mortValue?.achievementRate || 0,
        color: 'red',
        trend: allValues
          .filter(v => v.indicatorId === mortValue?.indicatorId)
          .sort((a, b) => a.year - b.year)
          .map(v => v.value)
      },
      {
        id: 'h_kpi3',
        title: 'Prévalence Paludisme',
        value: paluValue?.value || 0,
        formattedValue: paluValue?.valueFormatted || '0%',
        variation: paluValue?.variation || 0,
        variationType: (paluValue?.variation || 0) <= 0 ? 'positive' : 'negative',
        target: 1,
        achievementRate: paluValue?.achievementRate || 0,
        unit: '%',
        color: 'amber',
        trend: allValues
          .filter(v => v.indicatorId === paluValue?.indicatorId)
          .sort((a, b) => a.year - b.year)
          .map(v => v.value)
      },
      {
        id: 'h_kpi4',
        title: 'Structures de santé',
        value: facilities.length,
        formattedValue: String(facilities.length),
        color: 'indigo',
        variation: 12,
        variationType: 'positive',
        trend: [facilities.length - 12, facilities.length - 10, facilities.length - 5, facilities.length]
      },
    ];
  };

  const healthKPIs = calculateKPIs();

  const handleExport = () => {
    alert('Export des données santé en cours...');
  };

  return (
    <MainLayout space="sector">
      <div ref={containerRef} className="max-w-[1600px] mx-auto space-y-8 pb-12 animate-in fade-in duration-700">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-card p-6 rounded-xl border shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <HeartPulse className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Secteur Santé</h1>
              <p className="text-muted-foreground text-lg">
                Pilotage des indicateurs de santé publique et des infrastructures
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2" onClick={handleExport}>
              <Download className="h-4 w-4" />
              Rapport
            </Button>
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700 shadow-sm" onClick={() => navigate('/sector/health/forms')}>
              <Plus className="h-4 w-4" />
              Collecte de données
            </Button>
          </div>
        </div>

        {/* Navigation secondaire */}
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" className="gap-2 shadow-sm rounded-full px-4 bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 dark:hover:bg-blue-950/50 border border-blue-200 dark:border-blue-800" onClick={() => navigate('/sector/health/forms')}>
            <FileText className="h-4 w-4" />
            Collecte de données
          </Button>
          <Button variant="secondary" className="gap-2 shadow-sm rounded-full px-4" onClick={() => navigate('/sector/facilities')}>
            <Building2 className="h-4 w-4" />
            Structures
          </Button>
          <Button variant="secondary" className="gap-2 shadow-sm rounded-full px-4" onClick={() => navigate('/sector/analytics')}>
            <Activity className="h-4 w-4" />
            Analyses détaillées
          </Button>
          <Button variant="ghost" className="gap-2 rounded-full px-4 text-muted-foreground hover:text-foreground">
            <Filter className="h-4 w-4" />
            Filtres
          </Button>
        </div>

        {/* KPIs */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {healthKPIs.map((kpi) => (
            <KPICard key={kpi.id} data={kpi} className="shadow-sm hover:shadow-md transition-all duration-300" />
          ))}
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Carte sanitaire */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-sm bg-background/60 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-500" />
                    Analyse des Tendances
                  </CardTitle>
                  <Tabs defaultValue="trends" className="w-[300px]">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="trends">Evolution</TabsTrigger>
                      <TabsTrigger value="targets">Objectifs</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                <CardDescription>Visualisation comparative des indicateurs clés sur 5 ans</CardDescription>
              </CardHeader>
              <CardContent>
                <TrendChart
                  data={[
                    { name: '2020', vaccination: 75, assisted: 70, mortality: 30 },
                    { name: '2021', vaccination: 79, assisted: 73, mortality: 28 },
                    { name: '2022', vaccination: 82, assisted: 75, mortality: 26 },
                    { name: '2023', vaccination: 85, assisted: 77, mortality: 24 },
                    { name: '2024', vaccination: 87, assisted: 78, mortality: 22 },
                  ]}
                  lines={[
                    { key: 'vaccination', name: 'Couverture vaccinale', color: '#3b82f6', type: 'area' },
                    { key: 'assisted', name: 'Accouchements assistés', color: '#10b981', type: 'area' },
                  ]}
                  height={350}
                  referenceLine={80}
                />
              </CardContent>
            </Card>

            <Card className="overflow-hidden shadow-sm border-none">
              <CardHeader className="flex flex-row items-center justify-between pb-2 bg-slate-50/50 dark:bg-slate-900/20">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-indigo-500" />
                    Carte sanitaire
                  </CardTitle>
                  <CardDescription>Répartition géographique des structures</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="gap-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50" onClick={() => navigate('/sector/facilities')}>
                  Voir tout <ArrowRight className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <MapContainer height="400px" showControls />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Ressources humaines */}
            <Card className="shadow-sm border-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Users className="h-5 w-5 text-slate-500" />
                  Ressources humaines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Médecins</span>
                    <span className="text-muted-foreground">1,245 / 2,500</span>
                  </div>
                  <Progress value={49.8} className="h-2 bg-slate-100" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Infirmiers</span>
                    <span className="text-muted-foreground">8,520 / 10,000</span>
                  </div>
                  <Progress value={85.2} className="h-2 bg-slate-100" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Sages-femmes</span>
                    <span className="text-muted-foreground">1,890 / 3,000</span>
                  </div>
                  <Progress value={63} className="h-2 bg-slate-100" />
                </div>
              </CardContent>
            </Card>

            {/* Structures */}
            <Card className="shadow-sm border-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Building2 className="h-5 w-5 text-slate-500" />
                  Structures récentes
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[400px] px-6 pb-6">
                  <div className="space-y-4">
                    {facilities.slice(0, 8).map((facility) => (
                      <div
                        key={facility.id}
                        className="flex items-start gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-blue-200 transition-all cursor-pointer group"
                        onClick={() => navigate(`/sector/facilities/${facility.id}`)}
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm text-blue-600 group-hover:scale-110 transition-transform">
                          <Building2 className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate text-foreground group-hover:text-blue-600 transition-colors">{facility.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{facility.communeName}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout >
  );
};
