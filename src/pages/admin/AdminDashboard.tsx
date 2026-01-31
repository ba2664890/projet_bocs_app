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
} from 'lucide-react';
import { useAlerts, useIndicatorValues, useUsers } from '@/hooks/useData';
import type { ColumnDef } from '@tanstack/react-table';

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
  const userData: UserRow[] = users.map((u) => ({
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
            <p className="text-sm text-muted-foreground">{row.original.email}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'role',
      header: 'Rôle',
      cell: ({ row }) => (
        <Badge variant="outline">
          {row.original.role === 'admin' && 'Administrateur'}
          {row.original.role === 'institution' && 'Institution'}
          {row.original.role === 'sector_health' && 'Santé'}
          {row.original.role === 'sector_education' && 'Éducation'}
          {row.original.role === 'local_manager' && 'Responsable local'}
          {row.original.role === 'contributor' && 'Contributeur'}
        </Badge>
      ),
    },
    {
      accessorKey: 'organization',
      header: 'Organisation',
    },
    {
      accessorKey: 'status',
      header: 'Statut',
      cell: ({ row }) => (
        <Badge
          variant={row.original.status === 'active' ? 'default' : 'secondary'}
          className={row.original.status === 'active' ? 'bg-emerald-500' : ''}
        >
          {row.original.status === 'active' ? 'Actif' : 'Inactif'}
        </Badge>
      ),
    },
    {
      accessorKey: 'lastLogin',
      header: 'Dernière connexion',
    },
    {
      id: 'actions',
      cell: () => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  // Données pour la table validations
  const validationData: ValidationRow[] = values.slice(0, 10).map((v) => ({
    id: v.id,
    indicator: v.indicatorName,
    region: v.geographicName,
    value: v.valueFormatted,
    submittedBy: 'Moussa Sy',
    submittedAt: new Date(v.createdAt).toLocaleDateString('fr-FR'),
    status: v.status,
  }));

  // Colonnes pour la table validations
  const validationColumns: ColumnDef<ValidationRow>[] = [
    {
      accessorKey: 'indicator',
      header: 'Indicateur',
    },
    {
      accessorKey: 'region',
      header: 'Région',
    },
    {
      accessorKey: 'value',
      header: 'Valeur',
      cell: ({ row }) => (
        <span className="font-medium">{row.original.value}</span>
      ),
    },
    {
      accessorKey: 'submittedBy',
      header: 'Soumis par',
    },
    {
      accessorKey: 'submittedAt',
      header: 'Date',
    },
    {
      accessorKey: 'status',
      header: 'Statut',
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className={
            row.original.status === 'validated'
              ? 'border-emerald-500 text-emerald-600'
              : row.original.status === 'pending'
                ? 'border-amber-500 text-amber-600'
                : 'border-red-500 text-red-600'
          }
        >
          {row.original.status === 'validated' && <CheckCircle className="mr-1 h-3 w-3" />}
          {row.original.status === 'pending' && <Clock className="mr-1 h-3 w-3" />}
          {row.original.status === 'rejected' && <XCircle className="mr-1 h-3 w-3" />}
          {row.original.status === 'validated' ? 'Validé' : row.original.status === 'pending' ? 'En attente' : 'Rejeté'}
        </Badge>
      ),
    },
    {
      id: 'actions',
      cell: () => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-8 gap-1 text-emerald-600">
            <CheckCircle className="h-4 w-4" />
            Valider
          </Button>
          <Button variant="ghost" size="sm" className="h-8 gap-1 text-red-600">
            <XCircle className="h-4 w-4" />
            Rejeter
          </Button>
        </div>
      ),
    },
  ];

  return (
    <MainLayout space="admin">
      <div ref={containerRef} className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Administration</h1>
              <p className="text-muted-foreground">
                Gestion des utilisateurs, données et workflows
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
              <Activity className="h-4 w-4" />
              Audit
            </Button>
            <Button className="gap-2" onClick={() => navigate('/admin/settings')}>
              <Settings className="h-4 w-4" />
              Paramètres
            </Button>
          </div>
        </div>

        {/* KPIs Admin */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Utilisateurs actifs</p>
                  <p className="text-3xl font-bold">{users.filter((u) => u.status === 'active').length}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4 text-emerald-500" />
                <span className="text-emerald-600">+12%</span>
                <span className="text-muted-foreground">ce mois</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Données en attente</p>
                  <p className="text-3xl font-bold">{values.length}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
                  <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <span className="text-amber-600">3 critiques</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Données validées</p>
                  <p className="text-3xl font-bold">
                    {allValues.length > 0
                      ? Math.round((allValues.filter((v) => v.status === 'validated').length / allValues.length) * 100)
                      : 0}%
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                  <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
              <div className="mt-4">
                <Progress value={82} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Alertes non lues</p>
                  <p className="text-3xl font-bold">{unreadAlertsCount}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 dark:bg-red-900/30">
                  <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm">
                <TrendingDown className="h-4 w-4 text-emerald-500" />
                <span className="text-emerald-600">-5</span>
                <span className="text-muted-foreground">vs hier</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="validations" className="w-full">
          <TabsList className="grid w-full max-w-xl grid-cols-4">
            <TabsTrigger value="validations">Validations</TabsTrigger>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="data">Données</TabsTrigger>
            <TabsTrigger value="audit">Audit</TabsTrigger>
          </TabsList>

          <TabsContent value="validations" className="mt-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Validations en attente</CardTitle>
                  <CardDescription>
                    {values.filter((v) => v.status === 'pending').length} données à valider
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filtrer
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Tout valider
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <DataTable columns={validationColumns} data={validationData} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="mt-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Gestion des utilisateurs</CardTitle>
                  <CardDescription>{users.length} utilisateurs enregistrés</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Search className="h-4 w-4" />
                    Rechercher
                  </Button>
                  <Button size="sm" className="gap-2">
                    <Users className="h-4 w-4" />
                    Ajouter
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <DataTable columns={userColumns} data={userData} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Qualité des données</CardTitle>
                <CardDescription>Indicateurs de qualité et complétude</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Complétude Santé 2024</span>
                      <span className="text-sm text-muted-foreground">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Complétude Éducation 2024</span>
                      <span className="text-sm text-muted-foreground">88%</span>
                    </div>
                    <Progress value={88} className="h-2" />
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Cohérence des données</span>
                      <span className="text-sm text-muted-foreground">96%</span>
                    </div>
                    <Progress value={96} className="h-2" />
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Validation temps réel</span>
                      <span className="text-sm text-muted-foreground">78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Journal d'audit</CardTitle>
                <CardDescription>Historique des actions utilisateurs</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {[
                      { action: 'Validation de données', user: 'Moussa Sy', time: 'Il y a 5 min', type: 'success' },
                      { action: 'Création utilisateur', user: 'Admin', time: 'Il y a 15 min', type: 'info' },
                      { action: 'Modification indicateur', user: 'Aïssatou Ba', time: 'Il y a 30 min', type: 'warning' },
                      { action: 'Export données', user: 'Fatou Ndiaye', time: 'Il y a 1h', type: 'info' },
                      { action: 'Rejet de données', user: 'Amadou Diallo', time: 'Il y a 2h', type: 'error' },
                      { action: 'Connexion', user: 'Oumar Fall', time: 'Il y a 3h', type: 'info' },
                      { action: 'Mise à jour profil', user: 'Mariama Diop', time: 'Il y a 4h', type: 'info' },
                      { action: 'Validation en masse', user: 'Moussa Sy', time: 'Il y a 5h', type: 'success' },
                    ].map((log, i) => (
                      <div key={i} className="flex items-start gap-3 rounded-lg border p-3">
                        <div
                          className={`h-2 w-2 mt-2 rounded-full ${log.type === 'success'
                            ? 'bg-emerald-500'
                            : log.type === 'error'
                              ? 'bg-red-500'
                              : log.type === 'warning'
                                ? 'bg-amber-500'
                                : 'bg-blue-500'
                            }`}
                        />
                        <div className="flex-1">
                          <p className="font-medium">{log.action}</p>
                          <p className="text-sm text-muted-foreground">
                            par {log.user} • {log.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Workflows */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Workflows de validation
            </CardTitle>
            <CardDescription>État des processus de validation en cours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Collecte trimestrielle Q4</span>
                  <Badge variant="secondary">En cours</Badge>
                </div>
                <Progress value={65} className="mt-3 h-2" />
                <p className="mt-2 text-xs text-muted-foreground">65% complété • 12 régions sur 14</p>
              </div>
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Validation annuelle 2024</span>
                  <Badge variant="outline" className="border-amber-500 text-amber-600">En attente</Badge>
                </div>
                <Progress value={30} className="mt-3 h-2" />
                <p className="mt-2 text-xs text-muted-foreground">30% complété • En attente de données</p>
              </div>
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Audit données Santé</span>
                  <Badge variant="default" className="bg-emerald-500">Terminé</Badge>
                </div>
                <Progress value={100} className="mt-3 h-2" />
                <p className="mt-2 text-xs text-muted-foreground">100% complété • 245 données auditées</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};
