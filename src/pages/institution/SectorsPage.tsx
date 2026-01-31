import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const SectorsPage = () => {
    return (
        <MainLayout title="Vue d'ensemble des Secteurs">
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Secteur Santé</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Données agrégées du secteur santé.</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Secteur Éducation</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Données agrégées du secteur éducation.</p>
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    );
};
