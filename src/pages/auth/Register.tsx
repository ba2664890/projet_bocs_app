// ============================================
// FATI - Page de Création de Compte
// ============================================

import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    UserPlus,
    Mail,
    Lock,
    User,
    ArrowRight,
    AlertCircle,
    Building2,
    Phone,
} from 'lucide-react';

export const Register = () => {
    const navigate = useNavigate();
    const { register, isAuthenticated } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'contributor',
        organization: '',
        phone: '',
    });

    const containerRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        if (containerRef.current) {
            gsap.fromTo(
                containerRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.5 }
            );
        }
        if (formRef.current) {
            gsap.fromTo(
                formRef.current,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.6, delay: 0.2, ease: 'power2.out' }
            );
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (formData.password !== formData.confirmPassword) {
            setError("Les mots de passe ne correspondent pas.");
            return;
        }

        setIsLoading(true);

        try {
            const result = await register({
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                password: formData.password,
                role: formData.role,
                organization: formData.organization,
                phone: formData.phone,
            });

            if (result.success) {
                navigate('/');
            } else {
                setError(result.error || "Une erreur est survenue lors de l'inscription.");
            }
        } catch (err: any) {
            setError("Une erreur inattendue est survenue.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            ref={containerRef}
            className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4 dark:from-slate-900 dark:to-slate-800"
        >
            {/* Logo & Header */}
            <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
                    <UserPlus className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight">FATI</h1>
                <p className="text-muted-foreground">Création de votre compte</p>
            </div>

            {/* Register Card */}
            <div ref={formRef} className="w-full max-w-lg">
                <Card className="border-0 shadow-2xl">
                    <CardHeader>
                        <CardTitle>S'inscrire</CardTitle>
                        <CardDescription>
                            Rejoignez la plateforme FATI pour le suivi territorial
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">Prénom</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="firstName"
                                            placeholder="Jean"
                                            className="pl-10"
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Nom</Label>
                                    <Input
                                        id="lastName"
                                        placeholder="Dupont"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email professionnel</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="votre@email.com"
                                        className="pl-10"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="role">Rôle souhaité</Label>
                                    <Select
                                        value={formData.role}
                                        onValueChange={(value) => setFormData({ ...formData, role: value })}
                                    >
                                        <SelectTrigger id="role">
                                            <SelectValue placeholder="Sélectionner un rôle" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="contributor">Contributeur</SelectItem>
                                            <SelectItem value="institution">Institutionnel</SelectItem>
                                            <SelectItem value="sector_health">Secteur Santé</SelectItem>
                                            <SelectItem value="sector_education">Secteur Éducation</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Téléphone</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="phone"
                                            placeholder="+221 ..."
                                            className="pl-10"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="organization">Organisation / Institution</Label>
                                <div className="relative">
                                    <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="organization"
                                        placeholder="Ex: Ministère de la Santé"
                                        className="pl-10"
                                        value={formData.organization}
                                        onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="password">Mot de passe</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="••••••••"
                                            className="pl-10"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirmer</Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="••••••••"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <Button type="submit" className="w-full gap-2 mt-6" disabled={isLoading}>
                                {isLoading ? (
                                    <span className="animate-pulse">Création du compte...</span>
                                ) : (
                                    <>
                                        S'inscrire
                                        <ArrowRight className="h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-center border-t py-4">
                        <p className="text-sm text-muted-foreground">
                            Déjà un compte ?{' '}
                            <Link to="/login" className="font-medium text-primary hover:underline">
                                Se connecter
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};
