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
  HeartPulse,
  GraduationCap,
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
  { id: 'institution', label: 'Institutionnel', icon: Building2, color: 'blue', description: 'Pilotage et gouvernance' },
  { id: 'health', label: 'Santé', icon: HeartPulse, color: 'red', description: 'Indicateurs de santé' },
  { id: 'education', label: 'Éducation', icon: GraduationCap, color: 'teal', description: 'Indicateurs éducation' },
  { id: 'annonceur', label: 'Annonceurs', icon: Smartphone, color: 'purple', description: 'Espace communication' },
];

export const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState('institution');
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
          case 'institution':
            isAuthorized = role === 'admin' || role === 'institution';
            break;
          case 'health':
            isAuthorized = role === 'admin' || role === 'sector_health';
            break;
          case 'education':
            isAuthorized = role === 'admin' || role === 'sector_education';
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
      className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4 dark:from-slate-900 dark:to-slate-800"
    >
      {/* Logo & Header */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
          <Building2 className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">FATI</h1>
        <p className="text-muted-foreground">Fond d'Analyse Territoriale Intégrée</p>
      </div>

      {/* Login Card */}
      <div ref={formRef} className="w-full max-w-md">
        <Card className="border-0 shadow-2xl overflow-hidden">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Connexion</CardTitle>
            <CardDescription>
              Sélectionnez votre espace et connectez-vous
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
              <TabsList className="grid w-full grid-cols-2 gap-2 p-1 h-auto bg-muted/50 rounded-xl">
                {spaceOptions.map((space) => (
                  <TabsTrigger
                    key={space.id}
                    value={space.id}
                    className="flex flex-col items-center gap-2 py-3 px-2 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all"
                  >
                    <div className={`p-1.5 rounded-lg bg-${space.color}-100 dark:bg-${space.color}-900/30 text-${space.color}-600 dark:text-${space.color}-400`}>
                      <space.icon className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-semibold">{space.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {spaceOptions.map((space) => (
                <TabsContent key={space.id} value={space.id} className="mt-6 space-y-6 outline-none animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className={`rounded-xl border p-4 text-center border-${space.color}-200 bg-${space.color}-50/50 dark:border-${space.color}-800 dark:bg-${space.color}-900/20`}>
                    <p className={`text-sm font-bold text-${space.color}-700 dark:text-${space.color}-400`}>Portail {space.label}</p>
                    <p className="text-xs text-muted-foreground mt-1">{space.description}</p>
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
                      <Button variant="link" className="h-auto p-0 text-xs">
                        Oublié ?
                      </Button>
                    </div>

                    <Button
                      type="submit"
                      className={`w-full gap-2 bg-${space.color}-600 hover:bg-${space.color}-700 text-white`}
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
                      {space.id === 'annonceur' && <p><strong>Annonceur:</strong> annonceur@fati.gov / password</p>}
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
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>© 2024 FATI - Fond d'Analyse Territoriale Intégrée</p>
        <p className="mt-1">Ministère de la Santé & Ministère de l'Éducation</p>
      </div>
    </div>
  );
};
