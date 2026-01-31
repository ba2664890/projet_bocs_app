import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const FacilitiesPage = () => {
    return (
        <MainLayout title="Liste des Structures">
            <Card>
                <CardHeader>
                    <CardTitle>Structures et Établissements</CardTitle>
                </CardHeader>
                <CardContent className="h-96 flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                    <p className="text-muted-foreground">Liste des structures en cours de développement</p>
                </CardContent>
            </Card>
        </MainLayout>
    );
};
