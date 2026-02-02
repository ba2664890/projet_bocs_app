// ============================================
// FATI - Paramètres Système
// Espace Administration
// ============================================

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
    Key,
    Save,
    RefreshCw,
    Monitor,
    Lock,
    ShieldCheck,
    Bell,
    Globe,
    Database,
    Palette,
    Mail,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useSettings } from '@/hooks/useSettings';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export const SettingsPage = () => {
    const {
        siteName, contactEmail, timezone, currency, language,
        performanceMode, autoOptimization, twoFactorAuth, sessionTimeout,
        updateSettings, resetSettings
    } = useSettings();
    const [localSettings, setLocalSettings] = useState({
        siteName, contactEmail, timezone, currency, language,
        performanceMode, autoOptimization, twoFactorAuth, sessionTimeout
    });

    // Update local state when hook state changes (initial load)
    useEffect(() => {
        setLocalSettings({
            siteName, contactEmail, timezone, currency, language,
            performanceMode, autoOptimization, twoFactorAuth, sessionTimeout
        });
    }, [siteName, contactEmail, timezone, currency, language, performanceMode, autoOptimization, twoFactorAuth, sessionTimeout]);

    const handleSave = () => {
        updateSettings(localSettings);
        toast.success("Paramètres enregistrés", {
            description: "Les modifications ont été prises en compte."
        });
    };

    const handleReset = () => {
        resetSettings();
        toast.info("Paramètres réinitialisés", {
            description: "Retour aux valeurs par défaut."
        });
    };

    const updateLocal = (key: string, value: any) => {
        setLocalSettings(prev => ({ ...prev, [key]: value }));
    };

    return (
        <MainLayout space="admin">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">Configuration Plateforme</h1>
                        <p className="text-muted-foreground font-medium">Réglages globaux, sécurité et personnalisation de l'écosystème FATI</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="gap-2 border-2" onClick={handleReset}>
                            <RefreshCw className="h-4 w-4" /> Réinitialiser
                        </Button>
                        <Button className="gap-2 bg-purple-600 hover:bg-purple-700 text-white shadow-lg" onClick={handleSave}>
                            <Save className="h-4 w-4" /> Enregistrer les modifications
                        </Button>
                    </div>
                </div>

                <Tabs defaultValue="general" className="w-full">
                    <div className="flex overflow-x-auto pb-2 scrollbar-hide">
                        <TabsList className="bg-slate-100/50 p-1 border-2 mb-6 inline-flex">
                            <TabsTrigger value="general" className="gap-2 font-bold px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                <Globe className="h-4 w-4" /> Général
                            </TabsTrigger>
                            <TabsTrigger value="branding" className="gap-2 font-bold px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                <Palette className="h-4 w-4" /> Personnalisation
                            </TabsTrigger>
                            <TabsTrigger value="security" className="gap-2 font-bold px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                <ShieldCheck className="h-4 w-4" /> Sécurité
                            </TabsTrigger>
                            <TabsTrigger value="notifications" className="gap-2 font-bold px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                <Bell className="h-4 w-4" /> Notifications
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-4">
                        {/* Sidebar nav within settings */}
                        <div className="hidden lg:flex flex-col gap-1 col-span-1">
                            {[
                                { label: 'Identité visuelle', icon: Palette, active: true },
                                { label: 'Domaines & DNS', icon: Globe },
                                { label: 'Base de données', icon: Database },
                                { label: 'Clés API & Webhooks', icon: Key },
                                { label: 'E-mails système', icon: Mail },
                                { label: 'Gestion des rôles', icon: ShieldCheck },
                            ].map((item, i) => (
                                <button
                                    key={i}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left",
                                        item.active
                                            ? "bg-purple-50 text-purple-700 border-2 border-purple-100"
                                            : "text-muted-foreground hover:bg-slate-50 hover:text-slate-900"
                                    )}
                                >
                                    <item.icon className="h-4 w-4" />
                                    {item.label}
                                </button>
                            ))}

                            <div className="mt-8 p-4 bg-slate-900 rounded-2xl text-white shadow-xl">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Système Santé</span>
                                </div>
                                <p className="text-xs font-bold leading-relaxed">Infrastructure v2.4.0 active sur les clusters régionaux.</p>
                                <div className="mt-4 flex items-center justify-between text-[10px] font-black text-slate-500 uppercase">
                                    <span>CPU: 12%</span>
                                    <span>RAM: 4.2GB</span>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-3 space-y-6">
                            <TabsContent value="general" className="m-0 space-y-6">
                                <Card className="border-2 shadow-sm">
                                    <CardHeader>
                                        <CardTitle className="text-xl">Paramètres Généraux</CardTitle>
                                        <CardDescription>Configurez les informations de base de l'instance FATI.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="site-name" className="text-xs font-black uppercase">Nom de la plateforme</Label>
                                                <Input
                                                    id="site-name"
                                                    value={localSettings.siteName}
                                                    onChange={(e) => updateLocal('siteName', e.target.value)}
                                                    className="border-2 h-10"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="contact-email" className="text-xs font-black uppercase">Email de contact</Label>
                                                <Input
                                                    id="contact-email"
                                                    value={localSettings.contactEmail}
                                                    onChange={(e) => updateLocal('contactEmail', e.target.value)}
                                                    className="border-2 h-10"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-4 pt-4 border-t">
                                            <h4 className="text-sm font-black uppercase tracking-wider text-slate-500">Régionalisation</h4>
                                            <div className="grid gap-4 sm:grid-cols-3">
                                                <div className="space-y-2">
                                                    <Label className="text-[10px] font-bold uppercase">Fuseau Horaire</Label>
                                                    <Select value={localSettings.timezone} onValueChange={(v) => updateLocal('timezone', v)}>
                                                        <SelectTrigger className="border-2 h-10">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="utc">UTC (Casablanca, Dakar)</SelectItem>
                                                            <SelectItem value="par">UTC+1 (Paris, Bruxelles)</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-[10px] font-bold uppercase">Devise locale</Label>
                                                    <Select value={localSettings.currency} onValueChange={(v) => updateLocal('currency', v)}>
                                                        <SelectTrigger className="border-2 h-10">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="xof">XOF (Franc CFA)</SelectItem>
                                                            <SelectItem value="eur">EUR (€)</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-[10px] font-bold uppercase">Langue par défaut</Label>
                                                    <Select value={localSettings.language} onValueChange={(v) => updateLocal('language', v)}>
                                                        <SelectTrigger className="border-2 h-10">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="fr">Français (FR)</SelectItem>
                                                            <SelectItem value="en">Anglais (EN)</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-2 shadow-sm">
                                    <CardHeader>
                                        <CardTitle className="text-xl">Performances & Cache</CardTitle>
                                        <CardDescription>Optimisation de la vitesse de réponse applicative.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between p-4 rounded-xl border-2 bg-slate-50">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-white p-2 rounded-lg border">
                                                    <Monitor className="h-5 w-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm">Mode Performance Avancé</p>
                                                    <p className="text-xs text-muted-foreground">Active la mise en cache agressive des indicateurs.</p>
                                                </div>
                                            </div>
                                            <Switch
                                                checked={localSettings.performanceMode}
                                                onCheckedChange={(c) => updateLocal('performanceMode', c)}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between p-4 rounded-xl border-2 bg-slate-50">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-white p-2 rounded-lg border">
                                                    <Database className="h-5 w-5 text-emerald-600" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm">Auto-Optimisation DB</p>
                                                    <p className="text-xs text-muted-foreground">Indexation hebdomadaire intelligente.</p>
                                                </div>
                                            </div>
                                            <Switch
                                                checked={localSettings.autoOptimization}
                                                onCheckedChange={(c) => updateLocal('autoOptimization', c)}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="security" className="m-0 space-y-6">
                                <Card className="border-2 shadow-sm border-l-red-100">
                                    <CardHeader>
                                        <div className="flex items-center gap-2 mb-1">
                                            <Lock className="h-4 w-4 text-red-600" />
                                            <Badge variant="outline" className="text-[10px] font-black border-red-200 text-red-600 uppercase">Haute Protection</Badge>
                                        </div>
                                        <CardTitle className="text-xl">Politique d'Accès</CardTitle>
                                        <CardDescription>Gestion des contraintes d'authentification et sessions.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="flex items-center justify-between py-2">
                                            <div className="space-y-1">
                                                <p className="font-bold text-sm">Double Authentification (2FA)</p>
                                                <p className="text-xs text-muted-foreground">Obligatoire pour les administrateurs et directeurs.</p>
                                            </div>
                                            <Switch
                                                checked={localSettings.twoFactorAuth}
                                                onCheckedChange={(c) => updateLocal('twoFactorAuth', c)}
                                            />
                                        </div>
                                        <div className="space-y-4 pt-4 border-t">
                                            <Label className="text-xs font-black uppercase">Expiration des Sessions (Minutes)</Label>
                                            <Select value={localSettings.sessionTimeout} onValueChange={(v) => updateLocal('sessionTimeout', v)}>
                                                <SelectTrigger className="border-2 h-10 w-full sm:w-[200px]">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="15">15 minutes (Strict)</SelectItem>
                                                    <SelectItem value="60">1 heure (Standard)</SelectItem>
                                                    <SelectItem value="480">8 heures (Journalier)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </div>
                    </div>
                </Tabs>
            </div>
        </MainLayout>
    );
};
