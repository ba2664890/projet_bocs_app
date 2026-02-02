import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const SettingsPage = () => {
    return (
        <MainLayout space="admin" title="Paramètres Système">
            <Card>
                <CardHeader>
                    <CardTitle>Configuration de la Plateforme</CardTitle>
                </CardHeader>
                <CardContent className="h-96 flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                    <p className="text-muted-foreground">Panneau de configuration en cours de développement</p>
                </CardContent>
            </Card>
        </MainLayout>
    );
};
