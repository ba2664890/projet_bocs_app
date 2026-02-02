import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAlerts } from '@/hooks/useData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { AlertTriangle, CheckCircle2, Search, Filter, Bell, Clock } from 'lucide-react';
import { AlertCard } from '@/components/cards/AlertCard';

export const AlertsPage = () => {
    const { alerts, markAsRead, markAllAsRead } = useAlerts();

    const criticalAlerts = alerts.filter(a => a.severity === 'critical');
    const warningAlerts = alerts.filter(a => a.severity === 'high');
    const infoAlerts = alerts.filter(a => a.severity === 'info');

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Centre des Alertes</h1>
                    <p className="text-muted-foreground">Suivi en temps réel des anomalies et notifications critiques.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={markAllAsRead} className="gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        Tout marquer comme lu
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full text-red-600">
                            <AlertTriangle className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-red-900 dark:text-red-200">Critiques</p>
                            <p className="text-3xl font-bold text-red-700 dark:text-red-400">{criticalAlerts.length}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/30">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-full text-amber-600">
                            <Bell className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-amber-900 dark:text-amber-200">Avertissements</p>
                            <p className="text-3xl font-bold text-amber-700 dark:text-amber-400">{warningAlerts.length}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600">
                            <Clock className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-blue-900 dark:text-blue-200">Informations</p>
                            <p className="text-3xl font-bold text-blue-700 dark:text-blue-400">{infoAlerts.length}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <CardTitle>Flux d'alertes</CardTitle>
                        <div className="flex gap-2 w-full md:w-auto">
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Rechercher..." className="pl-8" />
                            </div>
                            <Button variant="ghost" size="icon">
                                <Filter className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="all" className="w-full">
                        <TabsList className="grid w-full grid-cols-4 mb-4">
                            <TabsTrigger value="all">Toutes ({alerts.length})</TabsTrigger>
                            <TabsTrigger value="critical" className="text-red-600 data-[state=active]:text-red-700">Critiques</TabsTrigger>
                            <TabsTrigger value="warning" className="text-amber-600 data-[state=active]:text-amber-700">Avertissements</TabsTrigger>
                            <TabsTrigger value="info" className="text-blue-600 data-[state=active]:text-blue-700">Infos</TabsTrigger>
                        </TabsList>

                        <ScrollArea className="h-[600px] pr-4">
                            <TabsContent value="all" className="space-y-4 mt-0">
                                {alerts.map(alert => (
                                    <AlertCard key={alert.id} alert={alert} onMarkAsRead={markAsRead} />
                                ))}
                                {alerts.length === 0 && <p className="text-center text-muted-foreground py-8">Aucune alerte</p>}
                            </TabsContent>
                            <TabsContent value="critical" className="space-y-4 mt-0">
                                {criticalAlerts.map(alert => (
                                    <AlertCard key={alert.id} alert={alert} onMarkAsRead={markAsRead} />
                                ))}
                                {criticalAlerts.length === 0 && <p className="text-center text-muted-foreground py-8">Aucune alerte critique</p>}
                            </TabsContent>
                            <TabsContent value="warning" className="space-y-4 mt-0">
                                {warningAlerts.map(alert => (
                                    <AlertCard key={alert.id} alert={alert} onMarkAsRead={markAsRead} />
                                ))}
                                {warningAlerts.length === 0 && <p className="text-center text-muted-foreground py-8">Aucun avertissement</p>}
                            </TabsContent>
                            <TabsContent value="info" className="space-y-4 mt-0">
                                {infoAlerts.map(alert => (
                                    <AlertCard key={alert.id} alert={alert} onMarkAsRead={markAsRead} />
                                ))}
                                {infoAlerts.length === 0 && <p className="text-center text-muted-foreground py-8">Aucune info</p>}
                            </TabsContent>
                        </ScrollArea>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
};
