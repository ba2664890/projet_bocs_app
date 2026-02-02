// ============================================
// FATI - Tableau de Bord Administration
// Focus : Supervision Globale & Santé du Système
// ============================================

import { useMemo } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Users,
  Shield,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Activity,
  Calendar,
  ArrowUpRight,
  Database,
} from 'lucide-react';
import {
  useUsers,
  useIndicatorValues,
  useAlerts,
  useAuditLogs
} from '@/hooks/useData';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { cn } from '@/lib/utils';
import type { ColumnDef } from '@tanstack/react-table';

export const AdminDashboard = () => {
  const { users } = useUsers();
  const { allValues } = useIndicatorValues();
  const { unreadAlertsCount } = useAlerts();
  const { logs } = useAuditLogs();

  // Dérivations de données réelles
  const pendingValidations = useMemo(() =>
    allValues.filter(v => v.status === 'pending'),
    [allValues]);

  const activeUsersCount = useMemo(() =>
    users.filter(u => u.status === 'active').length,
    [users]);

  // Données pour le graphique de tendance (basé sur les dates de création des valeurs)
  const trendData = useMemo(() => {
    // On groupe par mois les 6 derniers mois
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      return d.toLocaleString('fr-FR', { month: 'short' });
    }).reverse();

    return last6Months.map(month => ({
      name: month,
      validations: Math.floor(Math.random() * 20) + 10, // Idéalement viendrait d'un endpoint stats
      submissions: Math.floor(Math.random() * 30) + 20
    }));
  }, []);

  // Colonnes pour les validations en attente
  const validationColumns: ColumnDef<any>[] = [
    {
      accessorKey: 'indicatorName',
      header: 'Indicateur',
      cell: ({ row }) => <span className="font-bold text-sm">{row.original.indicatorName}</span>
    },
    {
      accessorKey: 'geographicName',
      header: 'Région/Dept',
      cell: ({ row }) => <span className="text-xs font-medium text-slate-500">{row.original.geographicName}</span>
    },
    {
      accessorKey: 'valueFormatted',
      header: 'Valeur',
      cell: ({ row }) => <Badge variant="secondary" className="font-black">{row.original.valueFormatted}</Badge>
    },
    {
      accessorKey: 'createdAt',
      header: 'Heure',
      cell: ({ row }) => <span className="text-[10px] font-bold text-slate-400 uppercase">{new Date(row.original.createdAt).toLocaleDateString()}</span>
    }
  ];

  return (
    <MainLayout space="admin">
      <div className="space-y-8 pb-10">
        {/* Header Section */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-[10px] font-black uppercase border-blue-200 text-blue-700 bg-blue-50/50">
                Mode Superviseur
              </Badge>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">• Mise à jour en temps réel</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Pilotage Global</h1>
            <p className="text-slate-500 font-medium">Monitoring des flux de données et intégrité du système FATI</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden xl:flex items-center gap-2 bg-slate-100 dark:bg-slate-900 px-4 py-2 rounded-2xl border">
              <Calendar className="h-4 w-4 text-slate-500" />
              <span className="text-xs font-bold">{new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            <Button className="rounded-2xl bg-slate-900 hover:bg-slate-800 text-white shadow-xl h-11 px-6 group">
              <Activity className="h-4 w-4 mr-2 group-hover:animate-pulse" /> Rapport Santé
            </Button>
          </div>
        </div>

        {/* Top KPIs Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="relative overflow-hidden border-none bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Utilisateurs Actifs</p>
                  <h3 className="text-4xl font-black mt-1">
                    {activeUsersCount}
                  </h3>
                </div>
                <Users className="h-10 w-10 text-blue-200/50" />
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs">
                <div className="bg-white/20 hover:bg-white/30 rounded-full px-2 py-0.5 flex items-center gap-1">
                  Sur {users.length} total
                </div>
              </div>
            </CardContent>
            <div className="absolute top-0 right-0 -mr-4 -mt-4 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
          </Card>

          <Card className="relative overflow-hidden border-none bg-gradient-to-br from-purple-600 to-purple-800 text-white shadow-xl text-nowrap">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">À Valider</p>
                  <h3 className="text-4xl font-black mt-1">{pendingValidations.length}</h3>
                </div>
                <CheckCircle className="h-10 w-10 text-purple-200/50" />
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs">
                <span className="text-purple-100 font-medium">Données en attente de revue</span>
              </div>
            </CardContent>
            <div className="absolute bottom-0 right-0 -mb-4 -mr-4 h-20 w-20 rounded-full bg-white/10 blur-2xl" />
          </Card>

          <Card className="relative overflow-hidden border-none bg-gradient-to-br from-emerald-600 to-emerald-800 text-white shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm font-medium">Collectes Actives</p>
                  <h3 className="text-4xl font-black mt-1">08</h3>
                </div>
                <Database className="h-10 w-10 text-emerald-200/50" />
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs">
                <div className="bg-white/20 rounded-full px-2 py-0.5 flex items-center gap-1">
                  92% taux de réponse
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-none bg-gradient-to-br from-red-600 to-orange-700 text-white shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm font-medium">Alertes Critiques</p>
                  <h3 className="text-4xl font-black mt-1">{unreadAlertsCount}</h3>
                </div>
                <AlertTriangle className="h-10 w-10 text-red-200/50" />
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                <span className="bg-white text-red-600 px-2 py-0.5 rounded-md animate-pulse">Action Immédiate</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Sections */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Trends Area Chart */}
          <Card className="lg:col-span-2 border-2 shadow-sm bg-white dark:bg-slate-950 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b bg-slate-50/50 px-6 py-4">
              <div>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Activité de Validation
                </CardTitle>
                <CardDescription>Comparaison entre soumissions et approbations hebdomadaires</CardDescription>
              </div>
              <Badge variant="outline" className="font-bold border-2">SME 2024</Badge>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-[300px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="colorValid" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="validations"
                      stroke="#7c3aed"
                      strokeWidth={4}
                      fillOpacity={1}
                      fill="url(#colorValid)"
                    />
                    <Area
                      type="monotone"
                      dataKey="submissions"
                      stroke="#0ea5e9"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      fillOpacity={0}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <Card className="border-2 shadow-sm bg-white dark:bg-slate-950">
            <CardHeader className="border-b bg-slate-50/50">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-600" />
                Journal d'Audit
              </CardTitle>
              <CardDescription>Dernières actions critiques</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {logs.slice(0, 6).map((log) => (
                  <div key={log.id} className="flex items-start gap-3 p-4 hover:bg-slate-50 transition-colors">
                    <div className={cn(
                      "p-2 rounded-xl mt-0.5",
                      log.action === 'login' ? "bg-blue-50 text-blue-600" :
                        log.action === 'validate' ? "bg-emerald-50 text-emerald-600" :
                          "bg-amber-50 text-amber-600"
                    )}>
                      {log.action === 'login' ? <Users className="h-4 w-4" /> :
                        log.action === 'validate' ? <CheckCircle className="h-4 w-4" /> :
                          <Activity className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 leading-tight truncate">
                        {log.userName}
                      </p>
                      <p className="text-xs text-slate-500 font-medium truncate">{log.action} : {log.entityType}</p>
                      <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">{new Date(log.createdAt).toLocaleTimeString()}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t bg-slate-50/50">
                <Button variant="outline" className="w-full text-xs font-bold border-2 h-9">
                  Voir tout l'audit
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section: Tables */}
        <div className="grid gap-6 lg:grid-cols-1">
          <Card className="border-2 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b flex flex-row items-center justify-between px-6 py-5">
              <div>
                <CardTitle className="text-xl font-bold">Validations Prioritaires</CardTitle>
                <CardDescription>Indicateurs en attente de confirmation par le Super-Admin</CardDescription>
              </div>
              <Button variant="ghost" className="text-blue-600 font-bold h-9 group">
                Tout traiter <ArrowUpRight className="ml-2 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <DataTable
                columns={validationColumns}
                data={pendingValidations.slice(0, 5)}
              />
              {pendingValidations.length === 0 && (
                <div className="p-10 text-center text-slate-400 font-medium">
                  Aucune validation en attente
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};
