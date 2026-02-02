// ============================================
// FATI - Dashboard Administration
// Espace Administration & Gouvernance
// ============================================

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DataTable } from '@/components/ui/data-table';
import {
  Users,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Activity,
  Settings,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Download,
  Calendar,
  ArrowUpRight,
} from 'lucide-react';
import { useAlerts, useIndicatorValues, useUsers } from '@/hooks/useData';
import type { ColumnDef } from '@tanstack/react-table';
import { cn } from '@/lib/utils';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';

// Types pour les tables
interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  organization: string;
  status: string;
  lastLogin: string;
}

interface ValidationRow {
  id: string;
  indicator: string;
  region: string;
  value: string;
  submittedBy: string;
  submittedAt: string;
  status: string;
}

const trendData = [
  { name: 'Jan', validations: 45, submissions: 60 },
  { name: 'Fév', validations: 52, submissions: 58 },
  { name: 'Mar', validations: 48, submissions: 65 },
  { name: 'Avr', validations: 70, submissions: 75 },
  { name: 'Mai', validations: 85, submissions: 90 },
  { name: 'Juin', validations: 78, submissions: 82 },
];

const sectorData = [
  { name: 'Santé', value: 85, color: '#0d9488' },
  { name: 'Éducation', value: 72, color: '#0891b2' },
  { name: 'Admin', value: 95, color: '#7c3aed' },
  { name: 'Local', value: 64, color: '#ea580c' },
];

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { unreadAlertsCount } = useAlerts();
  const { values, allValues } = useIndicatorValues({ status: 'pending' });
  const { users } = useUsers();
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

  // Données pour la table utilisateurs
  const userData: UserRow[] = users.slice(0, 5).map((u) => ({
    id: u.id,
    name: `${u.firstName} ${u.lastName}`,
    email: u.email,
    role: u.role,
    organization: u.organization || '-',
    status: u.status,
    lastLogin: u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString('fr-FR') : 'Jamais',
  }));

  // Colonnes pour la table utilisateurs
  const userColumns: ColumnDef<UserRow>[] = [
    {
      accessorKey: 'name',
      header: 'Nom',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-medium">{row.original.name.charAt(0)}</span>
          </div>
          <div>
            <p className="font-medium">{row.original.name}</p>
            <p className="text-sm text-muted-foreground line-clamp-1">{row.original.email}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'role',
      header: 'Rôle',
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize">
          {row.original.role.replace('_', ' ')}
        </Badge>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Statut',
      cell: ({ row }) => (
        <Badge
          variant={row.original.status === 'active' ? 'default' : 'secondary'}
          className={cn(row.original.status === 'active' ? 'bg-emerald-500 hover:bg-emerald-600 border-none' : '')}
        >
          {row.original.status === 'active' ? 'Actif' : 'Inactif'}
        </Badge>
      ),
    },
    {
      id: 'actions',
      cell: () => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  // Données pour la table validations
  const validationData: ValidationRow[] = values.slice(0, 5).map((v) => ({
    id: v.id,
    indicator: v.indicatorName,
    region: v.geographicName,
    value: v.valueFormatted,
    submittedBy: 'Agent Terrain',
    submittedAt: new Date(v.createdAt).toLocaleDateString('fr-FR'),
    status: v.status,
  }));

  const validationColumns: ColumnDef<ValidationRow>[] = [
    {
      accessorKey: 'indicator',
      header: 'Indicateur',
    },
    {
      accessorKey: 'value',
      header: 'Valeur',
      cell: ({ row }) => <span className="font-bold">{row.original.value}</span>,
    },
    {
      accessorKey: 'status',
      header: 'Statut',
      cell: ({ row }) => (
        <Badge variant="outline" className="border-amber-500 text-amber-600">
          En attente
        </Badge>
      ),
    },
    {
      id: 'actions',
      cell: () => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
            Valider
          </Button>
        </div>
      ),
    },
  ];

  return (
    <MainLayout space="admin">
      <div ref={containerRef} className="space-y-6">
        {/* Top bar refined */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>Dernière mise à jour : Aujourd'hui, 14:30</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Console d'Administration</h1>
            <p className="text-muted-foreground text-lg">Gouvernance et supervision de la plateforme FATI</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="shadow-sm border-2">
              <Download className="mr-2 h-4 w-4" /> Export logs
            </Button>
            <Button className="shadow-lg bg-purple-600 hover:bg-purple-700 text-white">
              <Activity className="mr-2 h-4 w-4" /> Rapport d'audit
            </Button>
          </div>
        </div>

        {/* High Premium KPIs Section */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="relative overflow-hidden border-none bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Utilisateurs Actifs</p>
                  <h3 className="text-4xl font-black mt-1">
                    {users.filter((u) => u.status === 'active').length}
                  </h3>
                </div>
                <Users className="h-10 w-10 text-blue-200/50" />
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs">
                <div className="bg-white/20 hover:bg-white/30 rounded-full px-2 py-0.5 flex items-center gap-1">
                  +12% <TrendingUp className="h-3 w-3" />
                </div>
                <span className="text-blue-100 font-medium">vs mois dernier</span>
              </div>
            </CardContent>
            <div className="absolute top-0 right-0 -mr-4 -mt-4 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
          </Card>

          <Card className="relative overflow-hidden border-none bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100 text-sm font-medium">Validations en Attente</p>
                  <h3 className="text-4xl font-black mt-1">{values.length}</h3>
                </div>
                <Clock className="h-10 w-10 text-amber-200/50" />
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs">
                <div className="bg-white/20 hover:bg-white/30 rounded-full px-2 py-0.5 flex items-center gap-1">
                  Urgent <AlertTriangle className="h-3 w-3" />
                </div>
                <span className="text-amber-100 font-medium">3 alertes critiques</span>
              </div>
            </CardContent>
            <div className="absolute top-0 right-0 -mr-4 -mt-4 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
          </Card>

          <Card className="relative overflow-hidden border-none bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm font-medium">Complétude Territoriale</p>
                  <h3 className="text-4xl font-black mt-1">87.4%</h3>
                </div>
                <CheckCircle className="h-10 w-10 text-emerald-200/50" />
              </div>
              <div className="mt-4">
                <Progress value={87.4} className="h-2 bg-white/20" />
                <p className="text-[10px] mt-1 text-emerald-100 opacity-80 text-right font-medium">Objectif 95%</p>
              </div>
            </CardContent>
            <div className="absolute top-0 right-0 -mr-4 -mt-4 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
          </Card>

          <Card className="relative overflow-hidden border-none bg-gradient-to-br from-purple-500 to-indigo-700 text-white shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Qualité Data</p>
                  <h3 className="text-4xl font-black mt-1">94.2%</h3>
                </div>
                <Shield className="h-10 w-10 text-purple-200/50" />
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs">
                <div className="bg-white/20 hover:bg-white/30 rounded-full px-2 py-0.5 flex items-center gap-1">
                  Stable <Activity className="h-3 w-3" />
                </div>
                <span className="text-purple-100 font-medium">+2.1% ce trimestre</span>
              </div>
            </CardContent>
            <div className="absolute top-0 right-0 -mr-4 -mt-4 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
          </Card>
        </div>

        {/* Main Analytic Content */}
        <div className="grid gap-6 lg:grid-cols-7">
          {/* Trends Area Chart */}
          <Card className="lg:col-span-4 border-2 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-xl">Flux de Données</CardTitle>
                <CardDescription>Évolution des soumissions vs validations (6 mois)</CardDescription>
              </div>
              <Tabs defaultValue="vol" className="w-[180px]">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="vol">Volume</TabsTrigger>
                  <TabsTrigger value="per">Taux</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="pt-4">
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
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
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

          {/* Sector distribution Bar Chart */}
          <Card className="lg:col-span-3 border-2 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Performance Sectorielle</CardTitle>
              <CardDescription>Récupération des données par domaine</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sectorData} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600 }} />
                    <Tooltip cursor={{ fill: 'transparent' }} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={28}>
                      {sectorData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4">
                {sectorData.map((s) => (
                  <div key={s.name} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border">
                    <div className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                    <div className="min-w-0">
                      <p className="text-[10px] text-muted-foreground font-bold uppercase truncate">{s.name}</p>
                      <p className="text-sm font-extrabold">{s.value}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data & Users Tables Section */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Pending Validations Table */}
          <Card className="border-2 shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b bg-slate-50/50">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Shield className="h-5 w-5 text-amber-600" />
                  Validations Prioritaires
                </CardTitle>
                <CardDescription>Flux de données critiques à vérifier</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="font-bold underline text-amber-600 hover:text-amber-700" onClick={() => navigate('/admin/workflows')}>
                Explorer tout
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <DataTable columns={validationColumns} data={validationData} />
            </CardContent>
          </Card>

          {/* New Users Table */}
          <Card className="border-2 shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b bg-slate-50/50">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                  Gouvernance Utilisateurs
                </CardTitle>
                <CardDescription>Gestion des nouveaux comptes et privilèges</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="font-bold underline text-blue-600 hover:text-blue-700" onClick={() => navigate('/admin/users')}>
                Gérer annuaire
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <DataTable columns={userColumns} data={userData} />
            </CardContent>
          </Card>
        </div>

        {/* Audit Feed refined */}
        <Card className="border-2 shadow-sm">
          <CardHeader className="border-b bg-slate-50/50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Activity className="h-5 w-5 text-slate-800" />
                  Journal d'Actions Critiques
                </CardTitle>
                <CardDescription>Historique d'audit en temps réel pour la sécurité</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/admin/audit')}>
                Accéder aux logs complets
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {[
                { action: 'Mise à jour des seuils d\'alerte Santé (Région Dakar)', user: 'Admin Principal', time: 'Aujourd\'hui, 10:45', status: 'critical', icon: Settings, color: 'text-red-600', bg: 'bg-red-50' },
                { action: 'Validation massive des indicateurs Education T3', user: 'Moussa Sy', time: 'Aujourd\'hui, 09:12', status: 'success', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { action: 'Exportation de l\'inventaire cartographique National', user: 'Data Analyst', time: 'Hier, 17:30', status: 'info', icon: Download, color: 'text-blue-600', bg: 'bg-blue-50' },
                { action: 'Réinitialisation des clés API Secteur Privé', user: 'Système Sécure', time: 'Hier, 15:45', status: 'warning', icon: Shield, color: 'text-amber-600', bg: 'bg-amber-50' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-4 hover:bg-slate-50/80 transition-all cursor-default group">
                  <div className={cn("p-2.5 rounded-xl transition-transform group-hover:scale-110", item.bg)}>
                    <item.icon className={cn("h-5 w-5", item.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 leading-snug">{item.action}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 font-medium">Par {item.user} • {item.time}</p>
                  </div>
                  <Badge className={cn("hidden sm:flex border-none capitalize font-bold", item.bg, item.color)}>
                    {item.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};
