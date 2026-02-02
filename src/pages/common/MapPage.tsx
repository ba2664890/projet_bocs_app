import { useLocation } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const MapPage = () => {
    const location = useLocation();
    const space = location.pathname.split('/')[1] as any;

    return (
        <MainLayout space={space} title="Cartographie">
            <Card className="h-[600px] w-full">
                <CardHeader>
                    <CardTitle>Carte Interactive</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-full bg-slate-50 dark:bg-slate-900 rounded-lg">
                    <p className="text-muted-foreground">Module de cartographie en cours de développement</p>
                </CardContent>
            </Card>
        </MainLayout>
    );
};
