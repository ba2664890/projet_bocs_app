import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const WorkflowsPage = () => {
    return (
        <MainLayout title="Workflows de Validation">
            <Card>
                <CardHeader>
                    <CardTitle>Suivi des Processus</CardTitle>
                </CardHeader>
                <CardContent className="h-96 flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                    <p className="text-muted-foreground">Outil de suivi des workflows en cours de développement</p>
                </CardContent>
            </Card>
        </MainLayout>
    );
};
