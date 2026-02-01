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
import { ComparisonChart } from '@/components/charts/ComparisonChart';
import { MapContainer } from '@/components/map/MapContainer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
} from 'lucide-react';
import { useHealthFacilities, useIndicatorValues } from '@/hooks/useData';
import type { KPIData } from '@/types';

export const HealthDashboard = () => {
  const navigate = useNavigate();
  const { values, allValues } = useIndicatorValues({ sector: 'health' });
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

  // KPIs Santé à partir des données réelles
  const calculateKPIs = (): KPIData[] => {
    const vaccValue = allValues.find(v => (v.indicatorName || '').toLowerCase().includes('vaccination'));
    const mortValue = allValues.find(v => (v.indicatorName || '').toLowerCase().includes('mortalité'));
    const paluValue = allValues.find(v => (v.indicatorName || '').toLowerCase().includes('paludisme'));

    return [
      {
        id: 'h_kpi1',
        title: 'Couverture vaccinale DTC3',
        value: vaccValue?.value || 87.3,
        formattedValue: vaccValue?.valueFormatted || '87.3%',
        variation: vaccValue?.variation || 3.8,
        variationType: 'positive',
        target: 95,
        achievementRate: vaccValue?.achievementRate || 91.9,
        unit: '%',
        color: 'green',
      },
      {
        id: 'h_kpi2',
        title: 'Mortalité maternelle',
        value: mortValue?.value || 315,
        formattedValue: mortValue?.valueFormatted || '315',
        variation: mortValue?.variation || -5.2,
        variationType: 'positive',
        target: 200,
        achievementRate: mortValue?.achievementRate || 63,
        color: 'red',
      },
      {
        id: 'h_kpi3',
        title: 'Prévalence Paludisme',
        value: paluValue?.value || 4.2,
        formattedValue: paluValue?.valueFormatted || '4.2%',
        variation: paluValue?.variation || -10.5,
        variationType: 'positive',
        target: 2,
        achievementRate: paluValue?.achievementRate || 40,
        unit: '%',
        color: 'teal',
      },
      {
        id: 'h_kpi4',
        title: 'Structures de santé',
        value: facilities.length,
        formattedValue: String(facilities.length),
        color: 'blue',
      },
    ];
  };

  const healthKPIs = calculateKPIs();

  const handleExport = () => {
    alert('Export des données santé en cours...');
  };

  return (
    <MainLayout space="sector">
      <div ref={containerRef} className="max-w-[1600px] mx-auto space-y-10 pb-12">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500">
              <HeartPulse className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Santé</h1>
              <p className="text-muted-foreground">
                Suivi des indicateurs et structures de santé
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2" onClick={handleExport}>
              <Download className="h-4 w-4" />
              Exporter
            </Button>
            <Button className="gap-2" onClick={() => navigate('/sector/collections')}>
              <Plus className="h-4 w-4" />
              Nouvelle collecte
            </Button>
          </div>
        </div>

        {/* Navigation secondaire */}
        <div className="flex flex-wrap gap-3 p-1.5 bg-muted/30 rounded-xl w-fit">
          <Button variant="secondary" className="gap-2 shadow-sm">
            <TrendingUp className="h-4 w-4" />
            Indicateurs
          </Button>
          <Button variant="ghost" className="gap-2 hover:bg-background/50" onClick={() => navigate('/sector/facilities')}>
            <Building2 className="h-4 w-4" />
            Structures
          </Button>
          <Button variant="ghost" className="gap-2 hover:bg-background/50" onClick={() => navigate('/sector/collections')}>
            <Filter className="h-4 w-4" />
            Collectes
          </Button>
          <Button variant="ghost" className="gap-2 hover:bg-background/50" onClick={() => navigate('/sector/analytics')}>
            <TrendingUp className="h-4 w-4" />
            Analyses
          </Button>
        </div>

        {/* KPIs */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {healthKPIs.map((kpi) => (
            <KPICard key={kpi.id} data={kpi} />
          ))}
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Carte sanitaire */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Carte sanitaire
                  </CardTitle>
                  <CardDescription>Répartition des structures de santé</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filtrer
                </Button>
              </CardHeader>
              <CardContent>
                <MapContainer height="350px" showControls />
              </CardContent>
            </Card>
          </div>

          {/* Structures */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Structures récentes
              </CardTitle>
              <CardDescription>{facilities.length} structures enregistrées</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[350px]">
                <div className="space-y-3">
                  {facilities.slice(0, 10).map((facility) => (
                    <div
                      key={facility.id}
                      className="flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50 cursor-pointer"
                      onClick={() => navigate(`/sector/facilities/${facility.id}`)}
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
                        <Building2 className="h-5 w-5 text-red-600 dark:text-red-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{facility.name}</p>
                        <p className="text-sm text-muted-foreground">{facility.communeName}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {facility.type === 'hospital' ? 'Hôpital' : 'Centre de santé'}
                          </Badge>
                          {facility.bedCapacity && (
                            <span className="text-xs text-muted-foreground">
                              {facility.bedCapacity} lits
                            </span>
                          )}
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Indicateurs détaillés */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full max-w-lg grid-cols-3">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="trends">Tendances</TabsTrigger>
            <TabsTrigger value="regions">Par région</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {values.slice(0, 4).map((value) => {
                return (
                  <Card key={value.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">{value.indicatorName}</p>
                          <p className="mt-1 text-2xl font-bold">
                            {value.valueFormatted}
                          </p>
                        </div>
                        <Badge
                          variant={(value.achievementRate ?? 0) >= 80 ? 'default' : 'secondary'}
                        >
                          {value.achievementRate?.toFixed(0) || 0}%
                        </Badge>
                      </div>
                      {value.achievementRate !== undefined && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Objectif atteint</span>
                            <span>{value.valueFormatted}</span>
                          </div>
                          <Progress
                            value={value.achievementRate}
                            className="mt-1 h-2"
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="trends" className="mt-4">
            <TrendChart
              data={[
                { name: '2019', vaccination: 72, assisted: 68, mortality: 32 },
                { name: '2020', vaccination: 75, assisted: 70, mortality: 30 },
                { name: '2021', vaccination: 79, assisted: 73, mortality: 28 },
                { name: '2022', vaccination: 82, assisted: 75, mortality: 26 },
                { name: '2023', vaccination: 85, assisted: 77, mortality: 24 },
                { name: '2024', vaccination: 87, assisted: 78, mortality: 22 },
              ]}
              lines={[
                { key: 'vaccination', name: 'Couverture vaccinale', color: '#3b82f6' },
                { key: 'assisted', name: 'Accouchements assistés', color: '#10b981' },
                { key: 'mortality', name: 'Mortalité infantile (inversé)', color: '#ef4444' },
              ]}
              title="Évolution des indicateurs clés"
              subtitle="Tendances sur 6 ans"
              height={350}
            />
          </TabsContent>

          <TabsContent value="regions" className="mt-4">
            <ComparisonChart
              data={[]}
              bars={[
                { key: 'vaccination', name: 'Vaccination', color: '#3b82f6' },
                { key: 'assisted', name: 'Accouchements', color: '#10b981' },
              ]}
              title="Performance par région"
              subtitle="Comparaison des indicateurs clés"
              height={400}
              referenceLine={80}
              sortable
            />
          </TabsContent>
        </Tabs>

        {/* Ressources humaines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Ressources humaines
            </CardTitle>
            <CardDescription>Personnel de santé par catégorie</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Médecins</span>
                  <span className="text-sm text-muted-foreground">1,245 / 2,500</span>
                </div>
                <Progress value={49.8} className="h-2" />
                <p className="text-xs text-muted-foreground">Taux de couverture: 49.8%</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Infirmiers</span>
                  <span className="text-sm text-muted-foreground">8,520 / 10,000</span>
                </div>
                <Progress value={85.2} className="h-2" />
                <p className="text-xs text-muted-foreground">Taux de couverture: 85.2%</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Sages-femmes</span>
                  <span className="text-sm text-muted-foreground">1,890 / 3,000</span>
                </div>
                <Progress value={63} className="h-2" />
                <p className="text-xs text-muted-foreground">Taux de couverture: 63%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout >
  );
};
