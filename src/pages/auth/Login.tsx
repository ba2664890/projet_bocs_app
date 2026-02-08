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
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
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
  <div className="fixed inset-0 -z-10 overflow-hidden">
    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/20 blur-[120px] animate-pulse" />
    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-teal-500/20 blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full bg-purple-500/10 blur-[150px]" />
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
            isAuthorized = role === 'admin' || role === 'annonceur';
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
          case 'institution':
            navigate('/institution');
            break;
          case 'health':
            navigate('/sector/health');
            break;
          case 'education':
            navigate('/sector/education');
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
      className="relative flex min-h-screen flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 transition-colors duration-500"
    >
      <BackgroundGradient />

      {/* Logo & Header */}
      <div className="auth-header mb-8 text-center">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-tr from-primary via-primary/90 to-blue-400 shadow-2xl shadow-primary/20 ring-4 ring-white/50 dark:ring-white/10 rotate-3 hover:rotate-0 transition-transform duration-500">
          <Building2 className="h-12 w-12 text-white" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tighter text-slate-900 dark:text-white sm:text-5xl">
          FATI
        </h1>
        <p className="mt-2 text-lg font-medium text-slate-500 dark:text-slate-400">
          Fond d'Analyse Territoriale Intégrée
        </p>
      </div>

      {/* Login Card */}
      <div ref={formRef} className="w-full max-w-md">
        <Card className="glass-card border-white/20 dark:border-slate-800/50 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-3xl font-bold tracking-tight">Connexion</CardTitle>
            <CardDescription className="text-base">
              Portail sécurisé de pilotage territorial
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Space Selection - 4 Tabs Redesign */}
            {/* Error Alert */}
            {error && (
              <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Tabs value={selectedSpace} onValueChange={setSelectedSpace} className="w-full">
              <TabsList className="grid w-full grid-cols-3 gap-2 p-1.5 h-auto bg-slate-100/50 dark:bg-slate-800/50 rounded-2xl backdrop-blur-sm">
                {spaceOptions.map((space) => (
                  <TabsTrigger
                    key={space.id}
                    value={space.id}
                    className="flex flex-col items-center gap-2 py-4 px-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-lg data-[state=active]:text-slate-900 dark:data-[state=active]:text-white rounded-xl transition-all duration-300 group"
                  >
                    <div className={`p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 group-data-[state=active]:scale-110 transition-transform duration-300 ${space.text} ${space.darkText} ${space.activeBg} ${space.activeDarkBg}`}>
                      <space.icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider">{space.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {spaceOptions.map((space) => (
                <TabsContent key={space.id} value={space.id} className="mt-6 space-y-6 outline-none animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className={`rounded-2xl border-2 p-4 text-center ${space.border} ${space.lightBg} ${space.darkBorder} ${space.darkLightBg} backdrop-blur-sm`}>
                    <p className={`text-sm font-bold tracking-wide uppercase ${space.text} ${space.darkText}`}>Espace {space.label}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">{space.description}</p>
                  </div>

                  {/* Login Form localized in Tab */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email professionnel</Label>
                      <div className="relative">
                        <Mail className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground`} />
                        <Input
                          id="email"
                          type="email"
                          placeholder="votre@email.com"
                          className="pl-10 focus-visible:ring-offset-0 focus-visible:ring-1"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Mot de passe</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          className="pl-10 pr-10 focus-visible:ring-offset-0 focus-visible:ring-1"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="remember"
                          checked={formData.rememberMe}
                          onCheckedChange={(checked) =>
                            setFormData({ ...formData, rememberMe: checked as boolean })
                          }
                        />
                        <Label htmlFor="remember" className="text-xs font-normal cursor-pointer">
                          Se souvenir de moi
                        </Label>
                      </div>
                      <Button variant="link" className="h-auto p-0 text-xs font-semibold text-slate-500 hover:text-primary transition-colors">
                        Oublié ?
                      </Button>
                    </div>

                    <Button
                      type="submit"
                      className={`w-full h-12 gap-2 text-base font-bold shadow-lg ${space.shadow} ${space.bg} ${space.hoverBg} text-white rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-95`}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="animate-pulse">Connexion...</span>
                      ) : (
                        <>
                          Se connecter au portail {space.label}
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>

                  {/* Demo Credentials Filtered */}
                  <div className={`rounded-lg bg-${space.color}-50 dark:bg-${space.color}-950/30 p-3 border border-${space.color}-100 dark:border-${space.color}-900`}>
                    <p className={`mb-2 text-xs font-semibold text-${space.color}-700 dark:text-${space.color}-400`}>Compte de démonstration {space.label} :</p>
                    <div className="space-y-1 text-[10px] text-muted-foreground">
                      {space.id === 'institution' && (
                        <>
                          <p><strong>Institution:</strong> institution@fati.gov / password</p>
                          <p><strong>Admin:</strong> admin@fati.gov / password</p>
                        </>
                      )}
                      {space.id === 'health' && <p><strong>Santé:</strong> health@fati.gov / password</p>}
                      {space.id === 'education' && <p><strong>Éducation:</strong> education@fati.gov / password</p>}
                      {space.id === 'annonceur' && <p><strong>Public:</strong> public@fati.gov / password</p>}
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col items-center gap-2 border-t py-4">
            <p className="text-sm text-muted-foreground">
              Pas encore de compte ?{' '}
              <Link to="/register" className="font-medium text-primary hover:underline">
                Créer un compte
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
          <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">Ministère de la Santé & de l'Éducation</p>
          <span className="h-px w-8 bg-slate-300 dark:bg-slate-700"></span>
        </div>
      </div>
    </div>
  );
};
