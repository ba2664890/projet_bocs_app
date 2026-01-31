import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const AuditPage = () => {
    return (
        <MainLayout title="Journal d'Audit">
            <Card>
                <CardHeader>
                    <CardTitle>Historique des Activités</CardTitle>
                </CardHeader>
                <CardContent className="h-96 flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                    <p className="text-muted-foreground">Interface d'audit système en cours de développement</p>
                </CardContent>
            </Card>
        </MainLayout>
    );
};
