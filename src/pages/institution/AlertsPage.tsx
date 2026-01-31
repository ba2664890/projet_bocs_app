import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAlerts } from '@/hooks/useData';

export const AlertsPage = () => {
    const { alerts } = useAlerts();

    return (
        <MainLayout title="Gestion des Alertes">
            <div className="space-y-4">
                {alerts.length > 0 ? (
                    alerts.map(alert => (
                        <Card key={alert.id}>
                            <CardHeader>
                                <CardTitle className="text-lg">{alert.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>{alert.message}</p>
                                <p className="text-sm text-muted-foreground mt-2">{new Date(alert.createdAt).toLocaleDateString()}</p>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Card>
                        <CardContent className="p-8 text-center text-muted-foreground">
                            Aucune alerte pour le moment.
                        </CardContent>
                    </Card>
                )}
            </div>
        </MainLayout>
    );
};
