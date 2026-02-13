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
    Smartphone,
} from 'lucide-react';

const BackgroundGradient = () => (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#fafafa] dark:bg-[#050505]">
        {/* Animated Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px] animate-pulse duration-[10s]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/20 blur-[120px] animate-pulse duration-[8s]" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-purple-500/10 blur-[100px] animate-pulse duration-[12s]" />

        {/* Mesh pattern overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.2] dark:opacity-[0.1]" />
        <div className="absolute inset-0 bg-gradient-mesh" />
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
        role: 'institution',
        organization: '',
        phone: '',
    });

    const containerRef = useRef<HTMLDivElement>(null);
    const leftSideRef = useRef<HTMLDivElement>(null);
    const rightSideRef = useRef<HTMLDivElement>(null);

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
            { opacity: 1, duration: 0.8 }
        );

        tl.fromTo(
            leftSideRef.current,
            { opacity: 0, x: -50 },
            { opacity: 1, x: 0, duration: 1, ease: "power4.out" },
            "-=0.4"
        );

        tl.fromTo(
            rightSideRef.current,
            { opacity: 0, x: 50 },
            { opacity: 1, x: 0, duration: 1, ease: "power4.out" },
            "-=0.8"
        );

        tl.fromTo(
            ".auth-header-content > *",
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out" },
            "-=0.5"
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
            className="relative min-h-screen w-full flex overflow-hidden"
        >
            <BackgroundGradient />

            <div className="flex w-full flex-col lg:flex-row">

                {/* Left Side: Brand & Visuals */}
                <div
                    ref={leftSideRef}
                    className="hidden lg:flex lg:w-[40%] xl:w-[45%] relative flex-col items-center justify-center p-12 text-white overflow-hidden"
                >
                    <div className="absolute inset-0 bg-primary/10 backdrop-blur-[2px]" />
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />

                    <div className="auth-header-content relative z-10 max-w-md">
                        <div className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-2xl rotate-3">
                            <UserPlus className="h-10 w-10 text-primary" />
                        </div>
                        <h1 className="text-6xl font-black tracking-tighter mb-6">REJOINDRE</h1>
                        <h2 className="text-2xl font-bold text-white/90 mb-8">
                            Créez votre compte professionnel sur FATI
                        </h2>

                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="h-12 w-12 shrink-0 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
                                    <Building2 className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">Gestion Territoriale</h3>
                                    <p className="text-sm text-white/60">Accédez aux outils de suivi et d'analyse institutionnels.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="h-12 w-12 shrink-0 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
                                    <Smartphone className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">Collecte de Terrain</h3>
                                    <p className="text-sm text-white/60">Simplifiez la saisie des données sur vos zones d'intervention.</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-16 pt-8 border-t border-white/10">
                            <p className="text-sm font-medium text-white/50">Vous avez déjà un compte ?</p>
                            <Button
                                variant="link"
                                className="p-0 h-auto text-white font-bold text-lg hover:text-white/80 transition-colors"
                                onClick={() => navigate('/login')}
                            >
                                Connectez-vous ici <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div
                    ref={rightSideRef}
                    className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 lg:p-12 z-10 overflow-y-auto custom-scrollbar"
                >
                    <div className="w-full max-w-[560px] space-y-8 my-auto">
                        <div className="space-y-2 text-center lg:text-left">
                            <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Inscription</h2>
                            <p className="text-slate-500 dark:text-slate-400 font-medium">Complétez les informations pour rejoindre la plateforme</p>
                        </div>

                        {error && (
                            <Alert variant="destructive" className="rounded-2xl bg-red-50 text-red-900 border-red-100">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription className="text-xs font-semibold">{error}</AlertDescription>
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Identité Section */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold">1</span>
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Identité</h3>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="firstName" className="text-xs font-bold ml-1 text-slate-700 dark:text-slate-300">Prénom</Label>
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                                            <Input
                                                id="firstName"
                                                placeholder="Jean"
                                                className="pl-12 h-12 rounded-xl bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 focus-visible:ring-primary/20 text-slate-900 dark:text-white font-medium"
                                                value={formData.firstName}
                                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="lastName" className="text-xs font-bold ml-1 text-slate-700 dark:text-slate-300">Nom</Label>
                                        <Input
                                            id="lastName"
                                            placeholder="Dupont"
                                            className="h-12 rounded-xl bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 focus-visible:ring-primary/20 text-slate-900 dark:text-white font-medium"
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="phone" className="text-xs font-bold ml-1 text-slate-700 dark:text-slate-300">Téléphone</Label>
                                    <div className="relative group">
                                        <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                                        <Input
                                            id="phone"
                                            placeholder="+221 ..."
                                            className="pl-12 h-12 rounded-xl bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 focus-visible:ring-primary/20 text-slate-900 dark:text-white font-medium"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Professionnel Section */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold">2</span>
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Professionnel</h3>
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="email" className="text-xs font-bold ml-1">Email professionnel</Label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="votre@email.com"
                                            className="pl-12 h-12 rounded-xl bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 focus-visible:ring-primary/20"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="role" className="text-xs font-bold ml-1 text-slate-700 dark:text-slate-300">Rôle souhaité</Label>
                                        <Select
                                            value={formData.role}
                                            onValueChange={(value) => setFormData({ ...formData, role: value })}
                                        >
                                            <SelectTrigger id="role" className="h-12 rounded-xl bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 focus:ring-primary/20 text-slate-900 dark:text-white font-medium">
                                                <SelectValue placeholder="Sélectionner" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800">
                                                <SelectItem value="institution">Gouvernement</SelectItem>
                                                <SelectItem value="local_manager">Agents de Terrain</SelectItem>
                                                <SelectItem value="viewer">Public / Consultation</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {formData.role !== 'viewer' && (
                                        <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
                                            <Label htmlFor="organization" className="text-xs font-bold ml-1 text-slate-700 dark:text-slate-300">Institution / Organisation</Label>
                                            <div className="relative group">
                                                <Building2 className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                                                <Input
                                                    id="organization"
                                                    placeholder="Ministère, Agence, ONG..."
                                                    className="pl-12 h-12 rounded-xl bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 focus-visible:ring-primary/20 text-slate-900 dark:text-white font-medium"
                                                    value={formData.organization}
                                                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Sécurité Section */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold">3</span>
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Sécurité</h3>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="password" className="text-xs font-bold ml-1">Mot de passe</Label>
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                                            <Input
                                                id="password"
                                                type="password"
                                                placeholder="••••••••"
                                                className="pl-12 h-12 rounded-xl bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 focus-visible:ring-primary/20"
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="confirmPassword" className="text-xs font-bold ml-1">Confirmer</Label>
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            placeholder="••••••••"
                                            className="h-12 rounded-xl bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 focus-visible:ring-primary/20"
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-14 gap-3 mt-4 text-base font-bold shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 text-white rounded-2xl transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Traitement en cours...</span>
                                    </div>
                                ) : (
                                    <>
                                        Créer mon compte professionnel
                                        <ArrowRight className="h-5 w-5" />
                                    </>
                                )}
                            </Button>
                        </form>

                        <div className="pt-4 text-center block lg:hidden">
                            <p className="text-sm text-slate-500 font-medium">
                                Déjà un compte ?{' '}
                                <Link to="/login" className="font-bold text-primary hover:underline">
                                    Se connecter
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
