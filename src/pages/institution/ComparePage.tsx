import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const ComparePage = () => {
    return (
        <MainLayout title="Outil de Comparaison">
            <Card>
                <CardHeader>
                    <CardTitle>Comparaison Territoriale</CardTitle>
                </CardHeader>
                <CardContent className="h-96 flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                    <p className="text-muted-foreground">Module de comparaison en cours de développement</p>
                </CardContent>
            </Card>
        </MainLayout>
    );
};
