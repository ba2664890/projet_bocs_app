// ============================================
// FATI - Gestion des Utilisateurs
// Espace Administration
// ============================================

import { useState, useMemo } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Search,
    Filter,
    MoreHorizontal,
    UserPlus,
    Shield,
    UserCheck,
    UserMinus,
    Mail,
    Building2,
    Calendar,
    Download,
} from 'lucide-react';
import { useUsers } from '@/hooks/useData';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { ColumnDef } from '@tanstack/react-table';

// Types étendus pour l'affichage
interface UserRow {
    id: string;
    fullName: string;
    email: string;
    role: string;
    organization: string;
    status: 'active' | 'inactive' | 'pending' | 'suspended';
    lastLogin: string;
    avatar?: string;
}

export const UsersPage = () => {
    const { users } = useUsers();
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

    // Stats calculées sur les vraies données
    const stats = useMemo(() => {
        return {
            total: users.length,
            active: users.filter(u => u.status === 'active').length,
            pending: users.filter(u => u.status === 'pending').length,
            // On simule "connecté" si lastLogin est inférieur à 15min (si on avait la donnée)
            // On va juste mettre une valeur basée sur les actifs pour l'instant
            online: Math.ceil(users.filter(u => u.status === 'active').length * 0.2),
        };
    }, [users]);

    // Transformation des données pour la table
    const data: UserRow[] = useMemo(() => {
        return users
            .filter(u => {
                const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
                const matchesSearch = fullName.includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesRole = roleFilter === 'all' || u.role === roleFilter;
                return matchesSearch && matchesRole;
            })
            .map(u => ({
                id: u.id,
                fullName: `${u.firstName} ${u.lastName}`,
                email: u.email,
                role: u.role,
                organization: u.organization || 'Non assigné',
                status: u.status,
                lastLogin: u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString('fr-FR') : 'Jamais',
                avatar: u.avatar
            }));
    }, [users, searchQuery, roleFilter]);

    // Définition des colonnes
    const columns: ColumnDef<UserRow>[] = [
        {
            accessorKey: 'fullName',
            header: 'Utilisateur',
            cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border-2 border-background shadow-sm">
                        <AvatarImage src={row.original.avatar} />
                        <AvatarFallback className="bg-primary/10 font-bold text-primary text-xs uppercase">
                            {row.original.fullName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0">
                        <span className="font-bold text-sm truncate">{row.original.fullName}</span>
                        <span className="text-xs text-muted-foreground truncate">{row.original.email}</span>
                    </div>
                </div>
            ),
        },
        {
            accessorKey: 'role',
            header: 'Rôle & Permissions',
            cell: ({ row }) => {
                const role = row.original.role;
                return (
                    <Badge
                        variant="outline"
                        className={cn(
                            "capitalize font-bold border-2",
                            role === 'admin' && "border-purple-200 bg-purple-50 text-purple-700",
                            role.startsWith('sector') && "border-teal-200 bg-teal-50 text-teal-700",
                            role === 'institution' && "border-blue-200 bg-blue-50 text-blue-700",
                        )}
                    >
                        {role.replace('_', ' ')}
                    </Badge>
                );
            },
        },
        {
            accessorKey: 'organization',
            header: 'Organisation',
            cell: ({ row }) => (
                <div className="flex items-center gap-2 text-sm">
                    <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="truncate max-w-[150px]">{row.original.organization}</span>
                </div>
            ),
        },
        {
            accessorKey: 'status',
            header: 'État',
            cell: ({ row }) => {
                const status = row.original.status;
                return (
                    <div className="flex items-center gap-2">
                        <div className={cn(
                            "h-2 w-2 rounded-full",
                            status === 'active' ? "bg-emerald-500 animate-pulse" :
                                status === 'pending' ? "bg-amber-500" : "bg-slate-300"
                        )} />
                        <span className={cn(
                            "text-xs font-bold",
                            status === 'active' ? "text-emerald-600" :
                                status === 'pending' ? "text-amber-600" : "text-slate-500"
                        )}>
                            {status === 'active' ? 'Actif' : status === 'pending' ? 'Invitation' : 'Désactivé'}
                        </span>
                    </div>
                );
            },
        },
        {
            accessorKey: 'lastLogin',
            header: 'Connexion',
            cell: ({ row }) => (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{row.original.lastLogin}</span>
                </div>
            ),
        },
        {
            id: 'actions',
            cell: () => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem className="gap-2 font-bold">
                            <UserCheck className="h-4 w-4" /> Modifier rattach.
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-blue-600 font-bold">
                            <Mail className="h-4 w-4" /> Envoyer accès
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive font-bold">
                            <UserMinus className="h-4 w-4" /> Suspendre
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    return (
        <MainLayout space="admin">
            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">Annuaire Utilisateurs</h1>
                        <p className="text-muted-foreground font-medium">Gestion centralisée des accès et privilèges de la plateforme</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="gap-2 border-2">
                            <Download className="h-4 w-4" /> Exporter
                        </Button>

                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="gap-2 bg-purple-600 hover:bg-purple-700 text-white shadow-lg">
                                    <UserPlus className="h-4 w-4" /> Nouvel Utilisateur
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Inviter un collaborateur</DialogTitle>
                                    <DialogDescription>
                                        Envoyez une invitation par email pour rejoindre la plateforme FATI.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="name" className="text-right text-xs font-bold uppercase">Nom</Label>
                                        <Input id="name" placeholder="Prénom Nom" className="col-span-3 h-9" />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="email" className="text-right text-xs font-bold uppercase">Email</Label>
                                        <Input id="email" type="email" placeholder="email@fati.gov" className="col-span-3 h-9" />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="role" className="text-right text-xs font-bold uppercase">Rôle</Label>
                                        <Select defaultValue="local_manager">
                                            <SelectTrigger className="col-span-3 h-9">
                                                <SelectValue placeholder="Choisir un rôle" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="institution">Institutionnel</SelectItem>
                                                <SelectItem value="sector_health">Responsable Santé</SelectItem>
                                                <SelectItem value="sector_education">Responsable Éducation</SelectItem>
                                                <SelectItem value="local_manager">Responsable Local</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" className="w-full bg-purple-600 text-white">Envoyer l'invitation</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* User Stats Summary */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-none bg-slate-100/50 dark:bg-slate-900/50">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Total Comptes</p>
                                <p className="text-2xl font-black mt-1">{stats.total}</p>
                            </div>
                            <div className="h-10 w-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm border">
                                <Shield className="h-5 w-5 text-purple-600" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-none bg-emerald-50/50 dark:bg-emerald-950/20">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest leading-none">Actifs</p>
                                <p className="text-2xl font-black mt-1">{stats.active}</p>
                            </div>
                            <div className="h-10 w-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm border">
                                <UserCheck className="h-5 w-5 text-emerald-600" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-none bg-blue-50/50 dark:bg-blue-950/20">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest leading-none">Connectés (estim.)</p>
                                <p className="text-2xl font-black mt-1">{stats.online}</p>
                            </div>
                            <div className="h-10 w-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm border animate-pulse">
                                <div className="h-2 w-2 rounded-full bg-blue-600" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-none bg-amber-50/50 dark:bg-amber-950/20">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest leading-none">Invitations</p>
                                <p className="text-2xl font-black mt-1">{stats.pending}</p>
                            </div>
                            <div className="h-10 w-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm border">
                                <Mail className="h-5 w-5 text-amber-600" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* DataTable Section */}
                <Card className="border-2 shadow-sm overflow-hidden">
                    <CardHeader className="bg-slate-50/50 border-b pb-4">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <CardTitle className="text-lg">Annuaire des contributeurs</CardTitle>
                                <CardDescription>Visualisez et gérez les rôles de chaque membre de l'organisation.</CardDescription>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <div className="relative w-full md:w-[250px]">
                                    <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Chercher par nom, email..."
                                        className="pl-9 h-9 border-2"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <Select value={roleFilter} onValueChange={setRoleFilter}>
                                    <SelectTrigger className="w-[150px] h-9 border-2">
                                        <Filter className="h-3.5 w-3.5 mr-2" />
                                        <SelectValue placeholder="Rôle" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tout rôles</SelectItem>
                                        <SelectItem value="admin">Administrateur</SelectItem>
                                        <SelectItem value="institution">Institutionnel</SelectItem>
                                        <SelectItem value="sector_health">Plateforme Santé</SelectItem>
                                        <SelectItem value="sector_education">Plateforme Éducation</SelectItem>
                                        <SelectItem value="local_manager">Responsable Local</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <DataTable
                            columns={columns}
                            data={data}
                        />
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    );
};
