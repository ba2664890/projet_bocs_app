// ============================================
// FATI - Dashboard Éducation
// Espace Secteur Éducation
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
  GraduationCap,
  BookOpen,
  TrendingUp,
  MapPin,
  Filter,
  School,
  UserCheck,
} from 'lucide-react';
import { useEducationFacilities, useIndicatorValues } from '@/hooks/useData';
import type { KPIData } from '@/types';

export const EducationDashboard = () => {
  const navigate = useNavigate();
  const { values, allValues } = useIndicatorValues({ sector: 'education' });
  const { facilities, isLoading: isLoadingFacilities } = useEducationFacilities();
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

  // KPIs Éducation à partir des données réelles
  const calculateKPIs = (): KPIData[] => {
    const scolValue = allValues.find(v => (v.indicatorName || '').toLowerCase().includes('scolarisation'));
    const ratioValue = allValues.find(v => (v.indicatorName || '').toLowerCase().includes('ratio') || (v.indicatorName || '').toLowerCase().includes('élève'));
    const reusValue = allValues.find(v => (v.indicatorName || '').toLowerCase().includes('réussite') || (v.indicatorName || '').toLowerCase().includes('bfem'));

    return [
      {
        id: 'e_kpi1',
        title: 'Taux de scolarisation (PRI)',
        value: scolValue?.value || 94.2,
        formattedValue: scolValue?.valueFormatted || '94.2%',
        variation: scolValue?.variation || 0.4,
        variationType: 'positive',
        target: 100,
        achievementRate: scolValue?.achievementRate || 94.2,
        unit: '%',
        color: 'teal',
      },
      {
        id: 'e_kpi2',
        title: 'Taux de réussite BFEM',
        value: reusValue?.value || 78.5,
        formattedValue: reusValue?.valueFormatted || '78.5%',
        variation: reusValue?.variation || 4.4,
        variationType: 'positive',
        target: 95,
        achievementRate: reusValue?.achievementRate || 82.6,
        unit: '%',
        color: 'blue',
      },
      {
        id: 'e_kpi3',
        title: 'Ratio élèves-maître',
        value: ratioValue?.value || 48.5,
        formattedValue: ratioValue?.valueFormatted || '48.5:1',
        variation: ratioValue?.variation || -7.3,
        variationType: 'positive',
        target: 40,
        achievementRate: ratioValue?.achievementRate || 82.5,
        unit: ':1',
        color: 'purple',
      },
      {
        id: 'e_kpi4',
        title: 'Établissements scolaires',
        value: facilities.length,
        formattedValue: String(facilities.length),
        color: 'green',
      },
    ];
  };

  const educationKPIs = calculateKPIs();

  const handleExport = () => {
    alert('Export des données éducation en cours...');
  };

  return (
    <MainLayout space="sector">
      <div ref={containerRef} className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Éducation</h1>
              <p className="text-muted-foreground">
                Suivi des indicateurs et établissements scolaires
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
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Indicateurs
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => navigate('/sector/facilities')}>
            <Building2 className="h-4 w-4" />
            Établissements
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => navigate('/sector/collections')}>
            <Filter className="h-4 w-4" />
            Collectes
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => navigate('/sector/analytics')}>
            <TrendingUp className="h-4 w-4" />
            Analyses
          </Button>
        </div>

        {/* KPIs */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {educationKPIs.map((kpi) => (
            <KPICard key={kpi.id} data={kpi} />
          ))}
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Carte scolaire */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Carte scolaire
                  </CardTitle>
                  <CardDescription>Répartition des établissements</CardDescription>
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

          {/* Établissements */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <School className="h-5 w-5" />
                Établissements récents
              </CardTitle>
              <CardDescription>{facilities.length} établissements enregistrés</CardDescription>
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
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100 dark:bg-teal-900/30">
                        <School className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{facility.name}</p>
                        <p className="text-sm text-muted-foreground">{facility.communeName}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {facility.type === 'primary' ? 'Primaire' : facility.type === 'high_school' ? 'Lycée' : 'Secondaire'}
                          </Badge>
                          {facility.studentCapacity && (
                            <span className="text-xs text-muted-foreground">
                              {facility.studentCapacity} élèves
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
                          variant={value.achievementRate >= 80 ? 'default' : 'secondary'}
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
                { name: '2019', enrollment: 89, completion: 68, literacy: 75 },
                { name: '2020', enrollment: 87, completion: 70, literacy: 76 },
                { name: '2021', enrollment: 90, completion: 72, literacy: 78 },
                { name: '2022', enrollment: 92, completion: 74, literacy: 79 },
                { name: '2023', enrollment: 93, completion: 76, literacy: 81 },
                { name: '2024', enrollment: 94, completion: 78, literacy: 82 },
              ]}
              lines={[
                { key: 'enrollment', name: 'Scolarisation', color: '#14b8a6' },
                { key: 'completion', name: 'Achèvement', color: '#3b82f6' },
                { key: 'literacy', name: 'Alphabétisation', color: '#10b981' },
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
                { key: 'enrollment', name: 'Scolarisation', color: '#14b8a6' },
                { key: 'completion', name: 'Achèvement', color: '#3b82f6' },
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
            <CardDescription>Personnel enseignant par catégorie</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Enseignants primaire</span>
                  <span className="text-sm text-muted-foreground">28,450 / 35,000</span>
                </div>
                <Progress value={81.3} className="h-2" />
                <p className="text-xs text-muted-foreground">Taux de couverture: 81.3%</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Enseignants secondaire</span>
                  <span className="text-sm text-muted-foreground">15,230 / 20,000</span>
                </div>
                <Progress value={76.2} className="h-2" />
                <p className="text-xs text-muted-foreground">Taux de couverture: 76.2%</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Enseignants formés</span>
                  <span className="text-sm text-muted-foreground">38,500 / 43,680</span>
                </div>
                <Progress value={88.1} className="h-2" />
                <p className="text-xs text-muted-foreground">Taux de formation: 88.1%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Infrastructure */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Infrastructure scolaire
            </CardTitle>
            <CardDescription>État des infrastructures par type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-4">
              <div className="rounded-lg border p-4 text-center">
                <BookOpen className="mx-auto h-8 w-8 text-teal-500" />
                <p className="mt-2 text-2xl font-bold">12,450</p>
                <p className="text-sm text-muted-foreground">Salles de classe</p>
                <Badge variant="secondary" className="mt-2">92% utilisables</Badge>
              </div>
              <div className="rounded-lg border p-4 text-center">
                <UserCheck className="mx-auto h-8 w-8 text-blue-500" />
                <p className="mt-2 text-2xl font-bold">8,230</p>
                <p className="text-sm text-muted-foreground">Toilettes fonctionnelles</p>
                <Badge variant="secondary" className="mt-2">87% fonctionnels</Badge>
              </div>
              <div className="rounded-lg border p-4 text-center">
                <TrendingUp className="mx-auto h-8 w-8 text-green-500" />
                <p className="mt-2 text-2xl font-bold">78%</p>
                <p className="text-sm text-muted-foreground">Accès à l'eau</p>
                <Badge variant="secondary" className="mt-2">+5% vs 2023</Badge>
              </div>
              <div className="rounded-lg border p-4 text-center">
                <TrendingUp className="mx-auto h-8 w-8 text-purple-500" />
                <p className="mt-2 text-2xl font-bold">65%</p>
                <p className="text-sm text-muted-foreground">Accès à l'électricité</p>
                <Badge variant="secondary" className="mt-2">+8% vs 2023</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};
