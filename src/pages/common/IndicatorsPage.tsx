import { useLocation } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const IndicatorsPage = () => {
    const location = useLocation();
    const space = location.pathname.split('/')[1] as any;

    return (
        <MainLayout space={space} title="Indicateurs">
            <Card className="min-h-[400px]">
                <CardHeader>
                    <CardTitle>Tableau de bord des Indicateurs</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-64 bg-slate-50 dark:bg-slate-900 rounded-lg">
                    <p className="text-muted-foreground">Module des indicateurs en cours de développement</p>
                </CardContent>
            </Card>
        </MainLayout>
    );
};
