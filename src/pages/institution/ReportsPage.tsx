import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const ReportsPage = () => {
    return (
        <MainLayout title="Rapports et Analyses">
            <Card>
                <CardHeader>
                    <CardTitle>Centre de Rapports</CardTitle>
                </CardHeader>
                <CardContent className="h-96 flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                    <p className="text-muted-foreground">Module de génération de rapports en cours de développement</p>
                </CardContent>
            </Card>
        </MainLayout>
    );
};
