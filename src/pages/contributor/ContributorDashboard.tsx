// ============================================
// FATI - Dashboard Contributeur
// Espace Responsable Local / Contributeur
// ============================================

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ClipboardList,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  TrendingUp,
  Plus,
  Building2,
  Users,
  BarChart3,
  Bell,
  ChevronRight,
  FileText,
  School,
  GraduationCap,
  HeartPulse,
} from 'lucide-react';
import { useAuthStore } from '@/store';
import { useAlerts, useDataCollections } from '@/hooks/useData';

interface CollectionTask {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'validated';
  progress: number;
  sector: 'health' | 'education';
  facilityCount: number;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  date: string;
  read: boolean;
}

export const ContributorDashboard = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('collections');

  const { collections, isLoading: isLoadingCollections } = useDataCollections();
  const { alerts, unreadAlertsCount, markAllAsRead } = useAlerts();

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

  // Tâches de collecte - transformées depuis l'API si nécessaire
  const transformedTasks = collections.map(c => ({
    id: c.id,
    title: c.name,
    description: c.description || 'Pas de description',
    dueDate: c.endDate,
    status: (c.status.toLowerCase() as any) || 'pending',
    progress: c.progress || 0,
    sector: c.sector?.toLowerCase() as any || 'health',
    facilityCount: c.targetedFacilitiesCount || 0,
  }));

  const getStatusBadge = (status: CollectionTask['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="gap-1"><Clock className="h-3 w-3" /> En attente</Badge>;
      case 'in_progress':
        return <Badge variant="default" className="gap-1 bg-blue-500"><TrendingUp className="h-3 w-3" /> En cours</Badge>;
      case 'completed':
        return <Badge variant="outline" className="gap-1 border-emerald-500 text-emerald-600"><CheckCircle className="h-3 w-3" /> Complété</Badge>;
      case 'validated':
        return <Badge variant="default" className="gap-1 bg-emerald-500"><CheckCircle className="h-3 w-3" /> Validé</Badge>;
    }
  };

  const getStatusIcon = (status: CollectionTask['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-muted-foreground" />;
      case 'in_progress':
        return <TrendingUp className="h-5 w-5 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case 'validated':
        return <CheckCircle className="h-5 w-5 text-emerald-500" />;
    }
  };

  return (
    <MainLayout space="contributor">
      <div ref={containerRef} className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Bonjour, {user?.firstName}</h1>
            <p className="text-muted-foreground">
              {user?.organization} • {user?.department}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2" onClick={() => setActiveTab('notifications')}>
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
              {unreadAlertsCount > 0 && (
                <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 text-xs">{unreadAlertsCount}</Badge>
              )}
            </Button>
            <Button className="gap-2" onClick={() => navigate('/contributor/forms')}>
              <Plus className="h-4 w-4" />
              Nouvelle collecte
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <ClipboardList className="h-8 w-8 opacity-80" />
                <div>
                  <p className="text-sm opacity-80">Collectes en cours</p>
                  <p className="text-2xl font-bold">{collections.filter(c => c.status === 'in_progress').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 opacity-80" />
                <div>
                  <p className="text-sm opacity-80">Complétées</p>
                  <p className="text-2xl font-bold">{collections.filter(c => c.status === 'completed' || c.status === 'validated').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 opacity-80" />
                <div>
                  <p className="text-sm opacity-80">Notifications</p>
                  <p className="text-2xl font-bold">{unreadAlertsCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Building2 className="h-8 w-8 opacity-80" />
                <div>
                  <p className="text-sm opacity-80">Structures</p>
                  <p className="text-2xl font-bold">--</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:max-w-md">
            <TabsTrigger value="collections" className="gap-2">
              <ClipboardList className="h-4 w-4" />
              <span className="hidden sm:inline">Mes collectes</span>
              <span className="sm:hidden">Collectes</span>
            </TabsTrigger>
            <TabsTrigger value="forms" className="gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Formulaires</span>
              <span className="sm:hidden">Forms</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
              <span className="sm:hidden">Notifs</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="collections" className="mt-4 space-y-4">
            {isLoadingCollections && <p className="text-center py-8 text-muted-foreground">Chargement des collectes...</p>}
            {!isLoadingCollections && transformedTasks.length === 0 && (
              <p className="text-center py-8 text-muted-foreground">Aucune collecte assignée pour le moment.</p>
            )}
            {transformedTasks.map((task) => (
              <Card key={task.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row">
                    {/* Left side - Icon & Status */}
                    <div
                      className={`flex items-center justify-center p-4 sm:w-20 ${task.status === 'pending'
                          ? 'bg-slate-100 dark:bg-slate-800'
                          : task.status === 'in_progress'
                            ? 'bg-blue-100 dark:bg-blue-900/30'
                            : 'bg-emerald-100 dark:bg-emerald-900/30'
                        }`}
                    >
                      {getStatusIcon(task.status)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{task.title}</h3>
                            {getStatusBadge(task.status)}
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">{task.description}</p>
                          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              Échéance: {new Date(task.dueDate).toLocaleDateString('fr-FR')}
                            </span>
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <Building2 className="h-4 w-4" />
                              {task.facilityCount} structures
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {task.sector === 'health' ? 'Santé' : 'Éducation'}
                            </Badge>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center gap-2 sm:mt-0">
                          {task.status === 'pending' && (
                            <Button size="sm" className="gap-2">
                              <Plus className="h-4 w-4" />
                              Démarrer
                            </Button>
                          )}
                          {task.status === 'in_progress' && (
                            <Button size="sm" variant="outline" className="gap-2">
                              Continuer
                            </Button>
                          )}
                          {task.status === 'completed' && (
                            <Button size="sm" variant="outline" className="gap-2">
                              Voir
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Progress */}
                      {task.status === 'in_progress' && (
                        <div className="mt-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Progression</span>
                            <span className="font-medium">{task.progress}%</span>
                          </div>
                          <Progress value={task.progress} className="mt-2 h-2" />
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions rapides</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <Button variant="outline" className="h-auto flex-col items-start gap-2 p-4">
                    <Plus className="h-5 w-5" />
                    <span className="font-medium">Nouvelle collecte</span>
                    <span className="text-xs text-muted-foreground">Démarrer un formulaire</span>
                  </Button>
                  <Button variant="outline" className="h-auto flex-col items-start gap-2 p-4">
                    <Building2 className="h-5 w-5" />
                    <span className="font-medium">Mes structures</span>
                    <span className="text-xs text-muted-foreground">25 structures assignées</span>
                  </Button>
                  <Button variant="outline" className="h-auto flex-col items-start gap-2 p-4">
                    <BarChart3 className="h-5 w-5" />
                    <span className="font-medium">Mes statistiques</span>
                    <span className="text-xs text-muted-foreground">Voir mes performances</span>
                  </Button>
                  <Button variant="outline" className="h-auto flex-col items-start gap-2 p-4">
                    <TrendingUp className="h-5 w-5" />
                    <span className="font-medium">Carte</span>
                    <span className="text-xs text-muted-foreground">Voir sur la carte</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="forms" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Formulaires disponibles</CardTitle>
                <CardDescription>Sélectionnez un formulaire pour démarrer une collecte</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    { name: 'Indicateurs de santé trimestriels', sector: 'health', icon: HeartPulse, color: 'red' },
                    { name: 'Indicateurs d\'éducation trimestriels', sector: 'education', icon: GraduationCap, color: 'teal' },
                    { name: 'Mise à jour structures santé', sector: 'health', icon: Building2, color: 'blue' },
                    { name: 'Mise à jour établissements', sector: 'education', icon: School, color: 'green' },
                    { name: 'Ressources humaines santé', sector: 'health', icon: Users, color: 'purple' },
                    { name: 'Ressources humaines éducation', sector: 'education', icon: Users, color: 'amber' },
                  ].map((form, i) => (
                    <Card key={i} className="cursor-pointer transition-colors hover:bg-muted/50">
                      <CardContent className="flex items-center gap-4 p-4">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-${form.color}-100 dark:bg-${form.color}-900/30`}>
                          <form.icon className={`h-6 w-6 text-${form.color}-600 dark:text-${form.color}-400`} />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{form.name}</p>
                          <Badge variant="outline" className="mt-1 text-xs">
                            {form.sector === 'health' ? 'Santé' : 'Éducation'}
                          </Badge>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="mt-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>{unreadAlertsCount} non lues</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={markAllAsRead}>
                  Tout marquer comme lu
                </Button>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {alerts.length === 0 && (
                      <p className="text-center py-8 text-muted-foreground">Aucune notification.</p>
                    )}
                    {alerts.map((alert) => (
                      <div
                        key={alert.id}
                        className={`flex items-start gap-3 rounded-lg border p-3 ${!alert.isRead ? 'bg-muted/50' : ''
                          }`}
                      >
                        <div
                          className={`mt-1 h-2 w-2 rounded-full ${alert.severity === 'critical'
                              ? 'bg-red-500'
                              : alert.severity === 'high'
                                ? 'bg-amber-500'
                                : 'bg-blue-500'
                            }`}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{alert.title}</p>
                            {!alert.isRead && <Badge variant="secondary" className="text-xs">Nouveau</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground">{alert.message}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {new Date(alert.createdAt).toLocaleDateString('fr-FR')}
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

        {/* Help Card */}
        <Card className="bg-muted/50">
          <CardContent className="flex flex-col items-center gap-4 p-6 text-center sm:flex-row sm:text-left">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <AlertCircle className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Besoin d'aide ?</h3>
              <p className="text-sm text-muted-foreground">
                Consultez notre guide d'utilisation ou contactez le support technique
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">Guide d'utilisation</Button>
              <Button>Contacter le support</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};
