import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const AnalyticsPage = () => {
    return (
        <MainLayout title="Analyses Détaillées">
            <Card>
                <CardHeader>
                    <CardTitle>Analyses Sectorielles</CardTitle>
                </CardHeader>
                <CardContent className="h-96 flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                    <p className="text-muted-foreground">Module d'analyses avancées en cours de développement</p>
                </CardContent>
            </Card>
        </MainLayout>
    );
};
