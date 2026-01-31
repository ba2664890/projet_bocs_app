import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const ExportsPage = () => {
    return (
        <MainLayout title="Export de Données">
            <Card>
                <CardHeader>
                    <CardTitle>Centre d'Export</CardTitle>
                </CardHeader>
                <CardContent className="h-96 flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                    <p className="text-muted-foreground">Module d'export de données en cours de développement</p>
                </CardContent>
            </Card>
        </MainLayout>
    );
};
