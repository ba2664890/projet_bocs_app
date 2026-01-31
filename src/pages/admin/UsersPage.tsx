import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUsers } from '@/hooks/useData';

export const UsersPage = () => {
    const { users } = useUsers();

    return (
        <MainLayout title="Gestion des Utilisateurs">
            <Card>
                <CardHeader>
                    <CardTitle>Liste des Utilisateurs ({users.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Placeholder for Data Table */}
                    <div className="space-y-2">
                        {users.map(user => (
                            <div key={user.id} className="p-4 border rounded-lg flex justify-between items-center">
                                <div>
                                    <p className="font-medium">{user.firstName} {user.lastName}</p>
                                    <p className="text-sm text-muted-foreground">{user.email}</p>
                                </div>
                                <div className="text-sm capitalize px-2 py-1 bg-slate-100 rounded">
                                    {user.role}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </MainLayout>
    );
};
