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
import { MapContainer } from '@/components/map/MapContainer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Activity,
  FileText
} from 'lucide-react';
import { useEducationFacilities, useIndicatorValues } from '@/hooks/useData';
import type { KPIData } from '@/types';

export const EducationDashboard = () => {
  const navigate = useNavigate();
  const { allValues } = useIndicatorValues({ sector: 'education' });
  const { facilities } = useEducationFacilities();
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

  // KPIs Éducation à partir des données réelles
  const calculateKPIs = (): KPIData[] => {
    const scolValue = allValues.find(v =>
      (v.indicatorName || '').toLowerCase().includes('scolar') ||
      (v.indicatorCode || '').toLowerCase().includes('scol')
    );
    const reusValue = allValues.find(v =>
      (v.indicatorName || '').toLowerCase().includes('réussite') ||
      (v.indicatorCode || '').toLowerCase().includes('reuss') ||
      (v.indicatorName || '').toLowerCase().includes('bfem')
    );
    const ratioValue = allValues.find(v =>
      (v.indicatorName || '').toLowerCase().includes('ratio') ||
      (v.indicatorName || '').toLowerCase().includes('élève')
    );

    return [
      {
        id: 'e_kpi1',
        title: 'Taux de scolarisation (PRI)',
        value: scolValue?.value || 0,
        formattedValue: scolValue?.valueFormatted || '0%',
        variation: scolValue?.variation || 0,
        variationType: (scolValue?.variation || 0) >= 0 ? 'positive' : 'negative',
        target: 100,
        achievementRate: scolValue?.achievementRate || 0,
        unit: '%',
        color: 'teal',
        trend: allValues
          .filter(v => v.indicatorId === scolValue?.indicatorId)
          .sort((a, b) => a.year - b.year)
          .map(v => v.value)
      },
      {
        id: 'e_kpi2',
        title: 'Taux de réussite BFEM',
        value: reusValue?.value || 0,
        formattedValue: reusValue?.valueFormatted || '0%',
        variation: reusValue?.variation || 0,
        variationType: (reusValue?.variation || 0) >= 0 ? 'positive' : 'negative',
        target: 95,
        achievementRate: reusValue?.achievementRate || 0,
        unit: '%',
        color: 'blue',
        trend: allValues
          .filter(v => v.indicatorId === reusValue?.indicatorId)
          .sort((a, b) => a.year - b.year)
          .map(v => v.value)
      },
      {
        id: 'e_kpi3',
        title: 'Ratio Élèves/Maître',
        value: ratioValue?.value || 0,
        formattedValue: ratioValue?.valueFormatted || '0',
        variation: ratioValue?.variation || 0,
        variationType: (ratioValue?.variation || 0) <= 0 ? 'positive' : 'negative',
        target: 40,
        achievementRate: ratioValue?.achievementRate || 0,
        color: 'amber',
        trend: allValues
          .filter(v => v.indicatorId === ratioValue?.indicatorId)
          .sort((a, b) => a.year - b.year)
          .map(v => v.value)
      },
      {
        id: 'e_kpi4',
        title: 'Établissements',
        value: facilities.length,
        formattedValue: String(facilities.length),
        color: 'green',
        variation: 8,
        variationType: 'positive',
        trend: [facilities.length - 8, facilities.length - 6, facilities.length - 4, facilities.length]
      },
    ];
  };

  const educationKPIs = calculateKPIs();

  const handleExport = () => {
    alert('Export des données éducation en cours...');
  };

  return (
    <MainLayout space="sector">
      <div ref={containerRef} className="max-w-[1600px] mx-auto space-y-8 pb-12 animate-in fade-in duration-700">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-card p-6 rounded-xl border shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400">
              <GraduationCap className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Secteur Éducation</h1>
              <p className="text-muted-foreground text-lg">
                Suivi des performances académiques et de la carte scolaire
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2 h-11 px-6 border-teal-200 hover:bg-teal-50 text-teal-700 hidden md:flex" onClick={handleExport}>
              <Download className="h-4 w-4" />
              Rapport
            </Button>
            <Button className="gap-3 bg-teal-600 hover:bg-teal-700 h-11 px-8 text-lg font-bold shadow-lg shadow-teal-200 dark:shadow-none animate-pulse-subtle" onClick={() => navigate('/sector/education/collections')}>
              <Plus className="h-5 w-5" />
              Collecte de données
            </Button>
          </div>
        </div>

        {/* Navigation secondaire */}
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" className="gap-2 shadow-sm rounded-full px-4 bg-teal-50 hover:bg-teal-100 text-teal-700 dark:bg-teal-950/30 dark:text-teal-400 dark:hover:bg-teal-950/50 border border-teal-200 dark:border-teal-800" onClick={() => navigate('/sector/education/collections')}>
            <FileText className="h-4 w-4" />
            Collecte de données
          </Button>
          <Button variant="secondary" className="gap-2 shadow-sm rounded-full px-4" onClick={() => navigate('/sector/facilities')}>
            <Building2 className="h-4 w-4" />
            Établissements
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
          {educationKPIs.map((kpi) => (
            <KPICard key={kpi.id} data={kpi} className="shadow-sm hover:shadow-md transition-all duration-300" />
          ))}
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Carte scolaire */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-sm bg-background/60 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-teal-500" />
                    Performance Académique
                  </CardTitle>
                  <Tabs defaultValue="trends" className="w-[300px]">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="trends">Evolution</TabsTrigger>
                      <TabsTrigger value="targets">Objectifs</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                <CardDescription>Indicateurs de scolarisation et de réussite sur 5 ans</CardDescription>
              </CardHeader>
              <CardContent>
                <TrendChart
                  data={[
                    { name: '2020', enrollment: 87, completion: 70, literacy: 76 },
                    { name: '2021', enrollment: 90, completion: 72, literacy: 78 },
                    { name: '2022', enrollment: 92, completion: 74, literacy: 79 },
                    { name: '2023', enrollment: 93, completion: 76, literacy: 81 },
                    { name: '2024', enrollment: 94, completion: 78, literacy: 82 },
                  ]}
                  lines={[
                    { key: 'enrollment', name: 'Scolarisation', color: '#14b8a6', type: 'area' },
                    { key: 'completion', name: 'Achèvement', color: '#3b82f6', type: 'area' },
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
                    Carte scolaire
                  </CardTitle>
                  <CardDescription>Répartition géographique des établissements</CardDescription>
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
                  Corps Enseignant
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Primaire</span>
                    <span className="text-muted-foreground">28,450 / 35,000</span>
                  </div>
                  <Progress value={81.3} className="h-2 bg-slate-100" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Secondaire</span>
                    <span className="text-muted-foreground">15,230 / 20,000</span>
                  </div>
                  <Progress value={76.2} className="h-2 bg-slate-100" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Formés</span>
                    <span className="text-muted-foreground">38,500 / 43,680</span>
                  </div>
                  <Progress value={88.1} className="h-2 bg-slate-100" />
                </div>
              </CardContent>
            </Card>

            {/* Établissements */}
            <Card className="shadow-sm border-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Building2 className="h-5 w-5 text-slate-500" />
                  Établissements récents
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[400px] px-6 pb-6">
                  <div className="space-y-4">
                    {facilities.slice(0, 8).map((facility) => (
                      <div
                        key={facility.id}
                        className="flex items-start gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-teal-200 transition-all cursor-pointer group"
                        onClick={() => navigate(`/sector/facilities/${facility.id}`)}
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm text-teal-600 group-hover:scale-110 transition-transform">
                          <School className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate text-foreground group-hover:text-teal-600 transition-colors">{facility.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{facility.communeName}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Stats Infrastructure */}
            <Card className="shadow-sm border-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <BookOpen className="h-5 w-5 text-slate-500" />
                  Infrastructures
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <div className="flex items-center gap-3">
                    <UserCheck className="h-5 w-5 text-blue-500" />
                    <span className="text-sm font-medium">Toilettes</span>
                  </div>
                  <Badge variant="outline" className="bg-white">87%</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    <span className="text-sm font-medium">Accès Eau</span>
                  </div>
                  <Badge variant="outline" className="bg-white">78%</Badge>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </MainLayout >
  );
};
