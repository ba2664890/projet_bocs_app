import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const CollectionsPage = () => {
    return (
        <MainLayout title="Collectes de Données">
            <Card>
                <CardHeader>
                    <CardTitle>Campagnes de Collecte</CardTitle>
                </CardHeader>
                <CardContent className="h-96 flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                    <p className="text-muted-foreground">Module de gestion des collectes en cours de développement</p>
                </CardContent>
            </Card>
        </MainLayout>
    );
};
