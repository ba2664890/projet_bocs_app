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

const BackgroundGradient = () => (
    <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-teal-500/20 blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full bg-purple-500/10 blur-[150px]" />
    </div>
);

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
        const tl = gsap.timeline();

        tl.fromTo(
            containerRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 1 }
        );

        tl.fromTo(
            ".auth-header",
            { opacity: 0, y: -20 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
            "-=0.5"
        );

        tl.fromTo(
            formRef.current,
            { opacity: 0, y: 40, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power4.out" },
            "-=0.6"
        );

        tl.fromTo(
            ".auth-footer",
            { opacity: 0 },
            { opacity: 1, duration: 1 },
            "-=0.4"
        );
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
            className="relative flex min-h-screen flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 transition-colors duration-500"
        >
            <BackgroundGradient />

            {/* Logo & Header */}
            <div className="auth-header mb-8 text-center text-balance">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-primary via-primary/90 to-blue-400 shadow-2xl shadow-primary/20 ring-4 ring-white/50 dark:ring-white/10 rotate-3 hover:rotate-0 transition-transform duration-500">
                    <UserPlus className="h-10 w-10 text-white" />
                </div>
                <h1 className="text-4xl font-extrabold tracking-tighter text-slate-900 dark:text-white sm:text-5xl">FATI</h1>
                <p className="mt-2 text-lg font-medium text-slate-500 dark:text-slate-400">Création de votre compte professionnel</p>
            </div>

            {/* Register Card */}
            <div ref={formRef} className="w-full max-w-lg">
                <Card className="glass-card border-white/20 dark:border-slate-800/50 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-3xl font-bold tracking-tight">S'inscrire</CardTitle>
                        <CardDescription className="text-base font-medium">
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

                            <Button
                                type="submit"
                                className="w-full h-12 gap-2 mt-6 text-base font-bold shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 text-white rounded-xl transition-all duration-300 hover:scale-[1.01] active:scale-95"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span className="animate-pulse">Création du compte...</span>
                                ) : (
                                    <>
                                        Créer mon compte
                                        <ArrowRight className="h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-center border-t border-slate-200/50 dark:border-slate-800/50 py-6">
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                            Déjà un compte ?{' '}
                            <Link to="/login" className="font-bold text-primary hover:text-primary/80 transition-colors">
                                Se connecter
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>

            {/* Footer */}
            <div className="auth-footer mt-12 text-center text-sm">
                <p className="text-slate-500 dark:text-slate-400 font-medium">© 2024 FATI - Fond d'Analyse Territoriale Intégrée</p>
                <div className="mt-2 flex items-center justify-center gap-4">
                    <span className="h-px w-8 bg-slate-300 dark:bg-slate-700"></span>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">Ministère de la Santé & de l'Éducation</p>
                    <span className="h-px w-8 bg-slate-300 dark:bg-slate-700"></span>
                </div>
            </div>
        </div>
    );
};
