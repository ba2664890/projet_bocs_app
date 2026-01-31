import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const DataPage = () => {
    return (
        <MainLayout title="Gestion des Données">
            <Card>
                <CardHeader>
                    <CardTitle>Base de Données Territoriale</CardTitle>
                </CardHeader>
                <CardContent className="h-96 flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                    <p className="text-muted-foreground">Interface de gestion des données en cours de développement</p>
                </CardContent>
            </Card>
        </MainLayout>
    );
};
