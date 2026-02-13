// ============================================
// FATI - Page de Connexion
// ============================================

import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Building2,
  Users,
  Smartphone,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

const spaceOptions = [
  {
    id: 'government',
    label: 'Gouvernement',
    icon: Building2,
    color: 'blue',
    description: 'Accès aux indicateurs de santé et éducation',
    bg: 'bg-blue-600',
    hoverBg: 'hover:bg-blue-700',
    text: 'text-blue-600',
    darkText: 'dark:text-blue-400',
    activeBg: 'group-data-[state=active]:bg-blue-50',
    activeDarkBg: 'dark:group-data-[state=active]:bg-blue-900/30',
    border: 'border-blue-200/50',
    darkBorder: 'dark:border-blue-800/50',
    lightBg: 'bg-blue-50/30',
    darkLightBg: 'dark:bg-blue-900/10',
    shadow: 'shadow-blue-600/20'
  },
  {
    id: 'representatives',
    label: 'Agents',
    icon: Users,
    color: 'indigo',
    description: 'Saisie des données et remplissage des formulaires',
    bg: 'bg-indigo-600',
    hoverBg: 'hover:bg-indigo-700',
    text: 'text-indigo-600',
    darkText: 'dark:text-indigo-400',
    activeBg: 'group-data-[state=active]:bg-indigo-50',
    activeDarkBg: 'dark:group-data-[state=active]:bg-indigo-900/30',
    border: 'border-indigo-200/50',
    darkBorder: 'dark:border-indigo-800/50',
    lightBg: 'bg-indigo-50/30',
    darkLightBg: 'dark:bg-indigo-900/10',
    shadow: 'shadow-indigo-600/20'
  },
  {
    id: 'annonceur',
    label: 'Public',
    icon: Smartphone,
    color: 'purple',
    description: 'Participation à la collecte citoyenne',
    bg: 'bg-purple-600',
    hoverBg: 'hover:bg-purple-700',
    text: 'text-purple-600',
    darkText: 'dark:text-purple-400',
    activeBg: 'group-data-[state=active]:bg-purple-50',
    activeDarkBg: 'dark:group-data-[state=active]:bg-purple-900/30',
    border: 'border-purple-200/50',
    darkBorder: 'dark:border-purple-800/50',
    lightBg: 'bg-purple-50/30',
    darkLightBg: 'dark:bg-purple-900/10',
    shadow: 'shadow-purple-600/20'
  },
];

const BackgroundGradient = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden bg-[#fafafa] dark:bg-[#050505]">
    {/* Animated Blobs */}
    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px] animate-pulse duration-[10s]" />
    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/20 blur-[120px] animate-pulse duration-[8s]" style={{ animationDelay: '2s' }} />
    <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-purple-500/10 blur-[100px] animate-pulse duration-[12s]" />

    {/* Mesh pattern overlay */}
    <div className="absolute inset-0 bg-grid-pattern opacity-[0.2] dark:opacity-[0.1]" />

    {/* Subtle Noise Texture overlay could go here but using css grain is more complex, 
        staying with gradient mesh for now */}
    <div className="absolute inset-0 bg-gradient-mesh" />
  </div>
);

export const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState('government');
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false,
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

  const getSpaceLabel = (id: string) => spaceOptions.find(s => s.id === id)?.label || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await login(formData.email, formData.password);

      if (result.success) {
        // Validation stricte du rôle pour l'espace sélectionné
        const user = (result as any).user || useAuthStore.getState().user;
        const role = user?.role;

        let isAuthorized = false;
        switch (selectedSpace) {
          case 'government':
            isAuthorized = role === 'admin' || role === 'institution';
            break;
          case 'representatives':
            isAuthorized = role === 'admin' || role === 'local_manager';
            break;
          case 'annonceur':
            isAuthorized = role === 'admin' || role === 'annonceur' || role === 'viewer';
            break;
        }

        if (!isAuthorized) {
          await useAuthStore.getState().logout();
          setError(`Accès refusé. Ce compte n'est pas autorisé pour l'espace ${getSpaceLabel(selectedSpace)}.`);
          setIsLoading(false);
          return;
        }

        // Redirection selon l'espace sélectionné
        switch (selectedSpace) {
          case 'government':
            navigate('/institution');
            break;
          case 'representatives':
            navigate('/sector/health');
            break;
          case 'annonceur':
            navigate('/annonceur');
            break;
          default:
            navigate('/');
        }
      } else {
        setError(result.error || 'Erreur de connexion');
      }
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
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

      {/* Modern Split Layout */}
      <div className="flex w-full flex-col lg:flex-row">

        {/* Left Side: Brand & Visuals (Visible only on desktop) */}
        <div
          ref={leftSideRef}
          className="hidden lg:flex lg:w-[45%] xl:w-[50%] relative flex-col items-center justify-center p-12 text-white overflow-hidden"
        >
          {/* Decorative Elements */}
          <div className="absolute inset-0 bg-primary/10 backdrop-blur-[2px]" />
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px]" />

          <div className="auth-header-content relative z-10 max-w-lg text-center lg:text-left">
            <div className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-2xl shadow-primary/40 rotate-3 hover:rotate-0 transition-transform duration-500 cursor-default">
              <Building2 className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-6xl font-black tracking-tighter sm:text-7xl mb-6">
              FATI
            </h1>
            <h2 className="text-2xl font-bold text-white/90 mb-6 leading-tight">
              Fond d'Analyse Territoriale Intégrée
            </h2>
            <p className="text-lg text-white/70 font-medium mb-12 max-w-md">
              La plateforme intelligente de pilotage, de collecte et de suivi des indicateurs territoriaux pour une gouvernance éclairée.
            </p>

            <div className="grid grid-cols-2 gap-6 mt-12">
              <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                <div className="h-10 w-10 rounded-xl bg-primary/30 flex items-center justify-center mb-3">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-bold mb-1">Collaboratif</h3>
                <p className="text-xs text-white/60">Connectez tous les acteurs du territoire sur une plateforme unique.</p>
              </div>
              <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                <div className="h-10 w-10 rounded-xl bg-blue-500/30 flex items-center justify-center mb-3">
                  <Smartphone className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-bold mb-1">Temps Réel</h3>
                <p className="text-xs text-white/60">Suivez l'évolution de vos indicateurs en direct sur le terrain.</p>
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 left-12 right-12 flex justify-between items-center opacity-40">
            <p className="text-xs font-medium uppercase tracking-widest">République du Sénégal</p>
            <div className="h-px flex-1 mx-4 bg-white/20"></div>
            <p className="text-xs font-medium uppercase tracking-widest">Pilier de la Gouvernance</p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div
          ref={rightSideRef}
          className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 lg:p-12 xl:p-24 z-10"
        >
          {/* Mobile Header (Visible only on mobile/tablet) */}
          <div className="lg:hidden mb-12 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-xl rotate-3">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">FATI</h1>
          </div>

          <div className="w-full max-w-[440px] space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Bienvenue</h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Connectez-vous pour accéder à votre espace de travail</p>
            </div>

            {error && (
              <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-2 rounded-xl border-red-200 bg-red-50 text-red-900 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="font-medium text-xs">{error}</AlertDescription>
              </Alert>
            )}

            <Tabs value={selectedSpace} onValueChange={setSelectedSpace} className="w-full">
              <TabsList className="grid w-full grid-cols-3 gap-3 p-1.5 h-auto bg-slate-200/50 dark:bg-slate-800/40 rounded-[20px] backdrop-blur-md">
                {spaceOptions.map((space) => (
                  <TabsTrigger
                    key={space.id}
                    value={space.id}
                    className="flex flex-col items-center gap-1.5 py-3.5 px-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-lg data-[state=active]:text-slate-900 dark:data-[state=active]:text-white rounded-[14px] transition-all duration-300 group ring-offset-0 focus-visible:ring-0"
                  >
                    <div className={`p-2 rounded-xl transition-all duration-300 group-data-[state=active]:scale-110 ${space.text} ${space.darkText} bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700`}>
                      <space.icon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-70 group-data-[state=active]:opacity-100">{space.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {spaceOptions.map((space) => (
                <TabsContent key={space.id} value={space.id} className="mt-8 space-y-6 animate-in fade-in zoom-in-95 duration-500 outline-none">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor={`email-${space.id}`} className="text-sm font-semibold ml-1 text-slate-700 dark:text-slate-300">Email professionnel</Label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <Input
                          id={`email-${space.id}`}
                          type="email"
                          placeholder="votre@email.com"
                          className="pl-12 h-13 rounded-2xl bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 focus-visible:ring-primary/20 focus-visible:ring-offset-0 focus-visible:border-primary transition-all duration-300 text-slate-900 dark:text-white"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between ml-1">
                        <Label htmlFor={`password-${space.id}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">Mot de passe</Label>
                        <Button variant="link" className="h-auto p-0 text-xs font-semibold text-primary hover:text-primary transition-colors">
                          Oublié ?
                        </Button>
                      </div>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <Input
                          id={`password-${space.id}`}
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          className="pl-12 pr-12 h-13 rounded-2xl bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 focus-visible:ring-primary/20 focus-visible:ring-offset-0 focus-visible:border-primary transition-all duration-300 text-slate-900 dark:text-white"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-1">
                      <Checkbox
                        id={`remember-${space.id}`}
                        checked={formData.rememberMe}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, rememberMe: checked as boolean })
                        }
                        className="rounded-md border-slate-300"
                      />
                      <Label htmlFor={`remember-${space.id}`} className="text-xs font-medium text-slate-500 cursor-pointer select-none">
                        Rester connecté sur cet appareil
                      </Label>
                    </div>

                    <Button
                      type="submit"
                      className={`w-full h-14 gap-3 text-base font-bold shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 text-white rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] mt-2`}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Authentification...</span>
                        </div>
                      ) : (
                        <>
                          Accéder au portail {space.label}
                          <ArrowRight className="h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </form>

                  {/* Redesigned Demo Credentials */}
                  <div className="p-4 rounded-2xl bg-slate-100/50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800/50">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Accès Démo : {space.label}</p>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {space.id === 'government' && (
                        <>
                          <div className="flex justify-between items-center text-[11px] p-2 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 shadow-sm">
                            <span className="font-semibold text-slate-600 dark:text-slate-400">Institution:</span>
                            <code className="text-primary font-bold">institution@fati.gov / password</code>
                          </div>
                          <div className="flex justify-between items-center text-[11px] p-2 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 shadow-sm">
                            <span className="font-semibold text-slate-600 dark:text-slate-400">Administrateur:</span>
                            <code className="text-primary font-bold">admin@fati.gov / password</code>
                          </div>
                        </>
                      )}
                      {space.id === 'representatives' && (
                        <div className="flex justify-between items-center text-[11px] p-2 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 shadow-sm">
                          <span className="font-semibold text-slate-600 dark:text-slate-400">Agent:</span>
                          <code className="text-primary font-bold">agent@fati.gov / password</code>
                        </div>
                      )}
                      {space.id === 'annonceur' && (
                        <div className="flex justify-between items-center text-[11px] p-2 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 shadow-sm">
                          <span className="font-semibold text-slate-600 dark:text-slate-400">Public:</span>
                          <code className="text-primary font-bold">public@fati.gov / password</code>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            <div className="pt-6 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                Nouveau sur la plateforme ?{' '}
                <Link to="/register" className="font-bold text-primary hover:underline underline-offset-4">
                  Créer un compte professionnel
                </Link>
              </p>
            </div>
          </div>

          {/* Footer Branding for Mobile */}
          <div className="mt-auto pt-12 lg:hidden text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-loose">
              Fond d'Analyse Territoriale Intégrée<br />
              © 2024 - Plan de Développement Territorial
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
