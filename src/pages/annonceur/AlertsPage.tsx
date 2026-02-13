import { useMemo, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AlertCard } from '@/components/cards/AlertCard';
import { useAlerts } from '@/hooks/useData';
import { Bell, CheckCircle2, Search } from 'lucide-react';

const severityOptions = [
  { value: 'all', label: 'Toutes' },
  { value: 'critical', label: 'Critiques' },
  { value: 'high', label: 'Élevées' },
  { value: 'medium', label: 'Moyennes' },
  { value: 'low', label: 'Faibles' },
  { value: 'info', label: 'Infos' },
] as const;

export const AlertsPage = () => {
  const { alerts, unreadAlertsCount, markAsRead, markAllAsRead } = useAlerts();
  const [query, setQuery] = useState('');
  const [severity, setSeverity] = useState<(typeof severityOptions)[number]['value']>('all');

  const filteredAlerts = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return alerts.filter((alert) => {
      if (severity !== 'all' && alert.severity !== severity) {
        return false;
      }

      if (!normalized) {
        return true;
      }

      return (
        alert.title.toLowerCase().includes(normalized) ||
        alert.message.toLowerCase().includes(normalized) ||
        (alert.indicatorName || '').toLowerCase().includes(normalized) ||
        (alert.geographicName || '').toLowerCase().includes(normalized)
      );
    });
  }, [alerts, query, severity]);

  return (
    <MainLayout space="annonceur">
      <div className="max-w-[1600px] mx-auto space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
            <p className="text-muted-foreground mt-1">
              Suivez vos alertes et marquez-les comme traitées.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="h-8 px-3">
              {unreadAlertsCount} non lues
            </Badge>
            <Button onClick={markAllAsRead} variant="outline" className="gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Tout marquer comme lu
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="space-y-4">
            <CardTitle>Filtrer les alertes</CardTitle>
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Rechercher une alerte..."
                  className="pl-9"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {severityOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={severity === option.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSeverity(option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} onMarkAsRead={markAsRead} />
            ))}

            {filteredAlerts.length === 0 && (
              <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
                <Bell className="mx-auto h-5 w-5 mb-2" />
                Aucune notification pour les filtres sélectionnés.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};
