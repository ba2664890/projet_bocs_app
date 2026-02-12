import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useIndicators } from '@/hooks/useData';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowRight,
  Activity,
  GraduationCap,
  Syringe,
  Baby,
  BookOpen,
  School,
  Stethoscope,
  LineChart,
} from 'lucide-react';

type SubSectorDescriptor = {
  name: string;
  description: string;
  keywords: string[];
  icon: React.ElementType;
};

const HEALTH_SUBSECTORS: SubSectorDescriptor[] = [
  {
    name: 'Vaccination',
    description: 'Couverture vaccinale et prévention',
    keywords: ['vaccin', 'immun'],
    icon: Syringe,
  },
  {
    name: 'Santé maternelle',
    description: 'Suivi prénatal et accouchements sécurisés',
    keywords: ['maternell', 'grossesse', 'accouchement'],
    icon: Baby,
  },
  {
    name: 'Soins essentiels',
    description: 'Disponibilité des services de base',
    keywords: ['consultation', 'hospital', 'mortalité', 'morbidité', 'maladie', 'palu', 'vih'],
    icon: Activity,
  },
];

const EDUCATION_SUBSECTORS: SubSectorDescriptor[] = [
  {
    name: 'Primaire',
    description: 'Accès et maintien au cycle primaire',
    keywords: ['primaire', 'élève', 'cp', 'ce'],
    icon: School,
  },
  {
    name: 'Secondaire',
    description: 'Progression du collège et lycée',
    keywords: ['secondaire', 'collège', 'lycée'],
    icon: BookOpen,
  },
  {
    name: 'Enseignement supérieur',
    description: 'Accès aux filières supérieures',
    keywords: ['supérieur', 'université', 'tertiaire'],
    icon: GraduationCap,
  },
];

export const SectorsPage = () => {
  const { indicators } = useIndicators();
  const navigate = useNavigate();

  const healthIndicators = indicators.filter((indicator) => {
    const category = indicator.category?.toLowerCase() ?? '';
    return indicator.sector === 'health' || category.includes('santé');
  });

  const educationIndicators = indicators.filter((indicator) => {
    const category = indicator.category?.toLowerCase() ?? '';
    return indicator.sector === 'education' || category.includes('éducation');
  });

  const getCountByKeywords = (items: typeof indicators, keywords: string[]) =>
    items.filter((indicator) => {
      const label = `${indicator.name} ${indicator.description || ''}`.toLowerCase();
      return keywords.some((keyword) => label.includes(keyword));
    }).length;

  const sectorCards = [
    {
      key: 'health',
      title: 'Santé publique',
      description: 'Pilotage des performances sanitaires nationales et locales.',
      totalIndicators: healthIndicators.length,
      icon: Stethoscope,
      accent: 'blue',
      subSectors: HEALTH_SUBSECTORS,
      route: '/institution/sectors/health',
      source: healthIndicators,
    },
    {
      key: 'education',
      title: 'Éducation',
      description: 'Suivi des acquis scolaires et de l’équité territoriale.',
      totalIndicators: educationIndicators.length,
      icon: GraduationCap,
      accent: 'teal',
      subSectors: EDUCATION_SUBSECTORS,
      route: '/institution/sectors/education',
      source: educationIndicators,
    },
  ] as const;

  const totalIndicators = healthIndicators.length + educationIndicators.length;

  return (
    <div className="space-y-7">
      <section className="institution-hero">
        <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <p className="institution-kicker">Lecture sectorielle</p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Vue d'ensemble des secteurs</h1>
            <p className="max-w-2xl text-sm text-slate-100/90 sm:text-base">
              Comparez la profondeur des indicateurs par secteur et repérez les domaines où renforcer la collecte
              et la décision opérationnelle.
            </p>
          </div>
          <div className="rounded-xl border border-white/25 bg-white/10 p-4 text-sm">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-200">Indicateurs suivis</p>
            <p className="mt-1 text-3xl font-semibold">{totalIndicators}</p>
            <p className="text-xs text-slate-200/90">Santé + Éducation</p>
          </div>
        </div>

        <div className="relative z-10 mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-white/25 bg-white/10 p-3">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-200">Santé</p>
            <p className="mt-1 text-2xl font-semibold">{healthIndicators.length}</p>
            <p className="text-xs text-slate-200/85">Indicateurs actifs</p>
          </div>
          <div className="rounded-xl border border-white/25 bg-white/10 p-3">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-200">Éducation</p>
            <p className="mt-1 text-2xl font-semibold">{educationIndicators.length}</p>
            <p className="text-xs text-slate-200/85">Indicateurs actifs</p>
          </div>
          <div className="rounded-xl border border-white/25 bg-white/10 p-3">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-200">Couverture sectorielle</p>
            <p className="mt-1 text-2xl font-semibold">{totalIndicators > 0 ? '100%' : '0%'}</p>
            <p className="text-xs text-slate-200/85">Axes monitorés</p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        {sectorCards.map((sector) => {
          const SectorIcon = sector.icon;

          return (
            <Card key={sector.key} className="institution-panel overflow-hidden">
              <CardHeader className="border-b border-slate-200/70 pb-5 dark:border-slate-800/80">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2 text-2xl text-slate-900 dark:text-slate-100">
                      <SectorIcon
                        className={`h-6 w-6 ${
                          sector.accent === 'blue' ? 'text-sky-600' : 'text-teal-600'
                        }`}
                      />
                      {sector.title}
                    </CardTitle>
                    <CardDescription>{sector.description}</CardDescription>
                  </div>
                  <Badge
                    className={`border text-xs ${
                      sector.accent === 'blue'
                        ? 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-300'
                        : 'border-teal-200 bg-teal-50 text-teal-700 dark:border-teal-500/30 dark:bg-teal-500/10 dark:text-teal-300'
                    }`}
                    variant="outline"
                  >
                    {sector.totalIndicators} indicateurs
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 pt-5">
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                  {sector.subSectors.map((subSector) => {
                    const count = getCountByKeywords(sector.source, subSector.keywords);
                    const share = sector.totalIndicators > 0 ? Math.min((count / sector.totalIndicators) * 100, 100) : 0;
                    const SubIcon = subSector.icon;

                    return (
                      <button
                        key={subSector.name}
                        type="button"
                        onClick={() => navigate(sector.route)}
                        className="group rounded-xl border border-slate-200/80 bg-white/85 p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-slate-700"
                      >
                        <div className="mb-3 flex items-start justify-between gap-2">
                          <div
                            className={`rounded-lg p-2 ${
                              sector.accent === 'blue'
                                ? 'bg-sky-50 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300'
                                : 'bg-teal-50 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300'
                            }`}
                          >
                            <SubIcon className="h-4 w-4" />
                          </div>
                          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{count}</span>
                        </div>

                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{subSector.name}</p>
                        <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{subSector.description}</p>

                        <div className="mt-3 space-y-1">
                          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                            <span>Couverture</span>
                            <span>{share.toFixed(0)}%</span>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                            <div
                              className={`h-full rounded-full ${sector.accent === 'blue' ? 'bg-sky-500' : 'bg-teal-500'}`}
                              style={{ width: `${share}%` }}
                            />
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/45">
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Accéder au pilotage {sector.title}</p>
                    <p className="text-xs text-muted-foreground">Analyse détaillée des territoires et des tendances clés.</p>
                  </div>
                  <Button
                    className={`${
                      sector.accent === 'blue'
                        ? 'bg-sky-600 hover:bg-sky-700'
                        : 'bg-teal-600 hover:bg-teal-700'
                    }`}
                    onClick={() => navigate(sector.route)}
                  >
                    Ouvrir le dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="institution-panel">
          <CardContent className="p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Signal santé</p>
            <p className="mt-2 flex items-center gap-2 text-xl font-semibold text-slate-900 dark:text-slate-100">
              <LineChart className="h-5 w-5 text-sky-600" />
              {healthIndicators.length > 0 ? 'Données exploitables' : 'À compléter'}
            </p>
          </CardContent>
        </Card>
        <Card className="institution-panel">
          <CardContent className="p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Signal éducation</p>
            <p className="mt-2 flex items-center gap-2 text-xl font-semibold text-slate-900 dark:text-slate-100">
              <LineChart className="h-5 w-5 text-teal-600" />
              {educationIndicators.length > 0 ? 'Données exploitables' : 'À compléter'}
            </p>
          </CardContent>
        </Card>
        <Card className="institution-panel">
          <CardContent className="p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Équilibre sectoriel</p>
            <p className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">
              {totalIndicators > 0
                ? `${Math.round((Math.min(healthIndicators.length, educationIndicators.length) / Math.max(healthIndicators.length, educationIndicators.length || 1)) * 100)}%`
                : 'N/A'}
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};
