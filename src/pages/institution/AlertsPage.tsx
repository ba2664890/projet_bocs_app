import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAlerts } from '@/hooks/useData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  CheckCircle2,
  Search,
  Bell,
  Clock,
  ShieldAlert,
  SlidersHorizontal,
} from 'lucide-react';
import { AlertCard } from '@/components/cards/AlertCard';

const severityFilters = [
  { value: 'all', label: 'Toutes' },
  { value: 'critical', label: 'Critiques' },
  { value: 'high', label: 'Élevées' },
  { value: 'medium', label: 'Moyennes' },
  { value: 'info', label: 'Infos' },
] as const;

export const AlertsPage = () => {
  const { alerts, markAsRead, markAllAsRead } = useAlerts();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterSeverity, setFilterSeverity] = React.useState<(typeof severityFilters)[number]['value']>('all');

  const searchFilteredAlerts = useMemo(
    () =>
      alerts.filter((alert) => {
        const query = searchTerm.toLowerCase().trim();
        if (!query) return true;

        return (
          alert.title.toLowerCase().includes(query) ||
          alert.message.toLowerCase().includes(query) ||
          (alert.geographicName || '').toLowerCase().includes(query) ||
          (alert.indicatorName || '').toLowerCase().includes(query)
        );
      }),
    [alerts, searchTerm]
  );

  const filteredAlerts = useMemo(
    () =>
      searchFilteredAlerts.filter((alert) => {
        if (filterSeverity === 'all') return true;
        return alert.severity === filterSeverity;
      }),
    [searchFilteredAlerts, filterSeverity]
  );

  const criticalCount = searchFilteredAlerts.filter((a) => a.severity === 'critical').length;
  const highCount = searchFilteredAlerts.filter((a) => a.severity === 'high').length;
  const infoCount = searchFilteredAlerts.filter((a) => a.severity === 'info').length;
  const unreadCount = searchFilteredAlerts.filter((a) => !a.isRead).length;

  const resolutionRate =
    searchFilteredAlerts.length > 0
      ? ((searchFilteredAlerts.length - unreadCount) / searchFilteredAlerts.length) * 100
      : 100;

  return (
    <div className="space-y-7">
      <section className="institution-hero">
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <p className="institution-kicker">Supervision continue</p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Centre des alertes</h1>
            <p className="max-w-2xl text-sm text-slate-100/90 sm:text-base">
              Priorisez les anomalies critiques, suivez les signaux faibles et accélérez la réponse opérationnelle.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-medium">
                <ShieldAlert className="h-3.5 w-3.5" />
                {criticalCount} critiques
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-medium">
                <Clock className="h-3.5 w-3.5" />
                Taux de traitement {resolutionRate.toFixed(0)}%
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={markAllAsRead}
            className="gap-2 border-white/35 bg-white/10 text-white hover:bg-white/20"
          >
            <CheckCircle2 className="h-4 w-4" />
            Tout marquer comme lu
          </Button>
        </div>

        <div className="relative z-10 mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-white/25 bg-white/10 p-3">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-200">Critiques</p>
            <p className="mt-1 text-2xl font-semibold">{criticalCount}</p>
            <p className="text-xs text-slate-200/85">Intervention immédiate</p>
          </div>
          <div className="rounded-xl border border-white/25 bg-white/10 p-3">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-200">Élevées</p>
            <p className="mt-1 text-2xl font-semibold">{highCount}</p>
            <p className="text-xs text-slate-200/85">Priorité forte</p>
          </div>
          <div className="rounded-xl border border-white/25 bg-white/10 p-3">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-200">Informations</p>
            <p className="mt-1 text-2xl font-semibold">{infoCount}</p>
            <p className="text-xs text-slate-200/85">Suivi préventif</p>
          </div>
        </div>
      </section>

      <Card className="institution-panel">
        <CardHeader className="space-y-4 border-b border-slate-200/70 pb-5 dark:border-slate-800/80">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle className="text-xl text-slate-900 dark:text-slate-100">Flux d'alertes</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">Recherche rapide et filtrage intelligent par niveau de criticité.</p>
            </div>
            <div className="flex w-full items-center gap-2 lg:w-auto">
              <div className="relative w-full lg:w-80">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher une alerte, un territoire ou un indicateur..."
                  className="h-10 pl-9"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  setSearchTerm('');
                  setFilterSeverity('all');
                }}
              >
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {severityFilters.map((option) => {
              const isActive = filterSeverity === option.value;
              const count =
                option.value === 'all'
                  ? searchFilteredAlerts.length
                  : searchFilteredAlerts.filter((alert) => alert.severity === option.value).length;

              return (
                <Button
                  key={option.value}
                  variant="ghost"
                  onClick={() => setFilterSeverity(option.value)}
                  className={cn(
                    'h-8 rounded-full border px-3 text-xs font-medium',
                    isActive
                      ? 'border-[hsl(var(--institution-blue)/0.4)] bg-[hsl(var(--institution-blue)/0.12)] text-[hsl(var(--institution-navy))] dark:text-slate-100'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300'
                  )}
                >
                  {option.label}
                  <Badge
                    variant="secondary"
                    className={cn(
                      'ml-2 rounded-full px-1.5 py-0 text-[10px]',
                      isActive
                        ? 'bg-white/80 text-slate-800 dark:bg-slate-800 dark:text-slate-100'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                    )}
                  >
                    {count}
                  </Badge>
                </Button>
              );
            })}
          </div>
        </CardHeader>

        <CardContent className="pt-5">
          <ScrollArea className="h-[620px] pr-4">
            <div className="space-y-4">
              {filteredAlerts.map((alert) => (
                <AlertCard key={alert.id} alert={alert} onMarkAsRead={markAsRead} />
              ))}
            </div>

            {filteredAlerts.length === 0 && (
              <div className="mt-6 rounded-xl border border-dashed border-slate-300/90 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-900/60">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                  {searchTerm || filterSeverity !== 'all' ? (
                    <Search className="h-5 w-5 text-slate-500" />
                  ) : (
                    <Bell className="h-5 w-5 text-slate-500" />
                  )}
                </div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  {searchTerm || filterSeverity !== 'all'
                    ? 'Aucune alerte ne correspond à vos filtres.'
                    : 'Aucune alerte active pour le moment.'}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Essayez un autre mot-clé ou réinitialisez les filtres.</p>
                {(searchTerm || filterSeverity !== 'all') && (
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setSearchTerm('');
                      setFilterSeverity('all');
                    }}
                  >
                    Réinitialiser les filtres
                  </Button>
                )}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="institution-panel">
          <CardContent className="p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Total affiché</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">{filteredAlerts.length}</p>
          </CardContent>
        </Card>
        <Card className="institution-panel">
          <CardContent className="p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Non lues</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">{unreadCount}</p>
          </CardContent>
        </Card>
        <Card className="institution-panel">
          <CardContent className="p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Traitées</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
              {Math.max(searchFilteredAlerts.length - unreadCount, 0)}
            </p>
          </CardContent>
        </Card>
        <Card className="institution-panel">
          <CardContent className="p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Taux traitement</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">{resolutionRate.toFixed(0)}%</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
