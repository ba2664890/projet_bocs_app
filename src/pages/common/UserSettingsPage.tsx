import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { useSettings } from '@/hooks/useSettings';
import { useUIStore, useAuthStore } from '@/store';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';

const getLayoutSpace = (role?: string): 'institution' | 'sector' | 'admin' | 'annonceur' => {
  if (role === 'admin') return 'admin';
  if (role === 'sector_health' || role === 'sector_education' || role === 'local_manager') return 'sector';
  if (role === 'annonceur' || role === 'viewer') return 'annonceur';
  return 'institution';
};

export const UserSettingsPage = () => {
  const user = useAuthStore((state) => state.user);
  const theme = useUIStore((state) => state.theme);
  const setTheme = useUIStore((state) => state.setTheme);

  const {
    language,
    timezone,
    sessionTimeout,
    performanceMode,
    autoOptimization,
    updateSettings,
  } = useSettings();

  const [local, setLocal] = useState({
    language,
    timezone,
    sessionTimeout,
    performanceMode,
    autoOptimization,
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setLocal({
      language,
      timezone,
      sessionTimeout,
      performanceMode,
      autoOptimization,
    });
  }, [language, timezone, sessionTimeout, performanceMode, autoOptimization]);

  const saveSettings = () => {
    updateSettings(local);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <MainLayout space={getLayoutSpace(user?.role)}>
      <div className="max-w-3xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Paramètres</CardTitle>
            <CardDescription>
              Configurez vos préférences d’affichage et de session.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Thème</Label>
              <Select value={theme} onValueChange={(value: 'light' | 'dark' | 'system') => setTheme(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Clair</SelectItem>
                  <SelectItem value="dark">Sombre</SelectItem>
                  <SelectItem value="system">Système</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Langue</Label>
                <Select value={local.language} onValueChange={(value) => setLocal((prev) => ({ ...prev, language: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="en">Anglais</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Fuseau horaire</Label>
                <Select value={local.timezone} onValueChange={(value) => setLocal((prev) => ({ ...prev, timezone: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc">UTC</SelectItem>
                    <SelectItem value="par">UTC+1 (Paris)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label>Expiration de session (minutes)</Label>
                <Input
                  value={local.sessionTimeout}
                  onChange={(event) => setLocal((prev) => ({ ...prev, sessionTimeout: event.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-md border p-3">
                <div>
                  <p className="font-medium">Mode performance</p>
                  <p className="text-xs text-muted-foreground">Accélère le chargement des données.</p>
                </div>
                <Switch
                  checked={local.performanceMode}
                  onCheckedChange={(checked) => setLocal((prev) => ({ ...prev, performanceMode: checked }))}
                />
              </div>

              <div className="flex items-center justify-between rounded-md border p-3">
                <div>
                  <p className="font-medium">Optimisation automatique</p>
                  <p className="text-xs text-muted-foreground">Ajuste automatiquement certains paramètres techniques.</p>
                </div>
                <Switch
                  checked={local.autoOptimization}
                  onCheckedChange={(checked) => setLocal((prev) => ({ ...prev, autoOptimization: checked }))}
                />
              </div>
            </div>

            {saved && (
              <Alert>
                <AlertDescription>Paramètres enregistrés.</AlertDescription>
              </Alert>
            )}

            <Button onClick={saveSettings}>Enregistrer</Button>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};
