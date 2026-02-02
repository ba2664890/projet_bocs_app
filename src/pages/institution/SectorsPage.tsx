import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useIndicators } from '@/hooks/useData';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Activity, GraduationCap, Syringe, Baby, BookOpen, School, TrendingUp } from 'lucide-react';

export const SectorsPage = () => {
    const { indicators } = useIndicators();
    const navigate = useNavigate();

    const healthIndicators = indicators.filter(i => (i.sector === 'health' || i.category?.toLowerCase().includes('santé')));
    const educationIndicators = indicators.filter(i => (i.sector === 'education' || i.category?.toLowerCase().includes('éducation')));

    // Mock sub-sector data
    const healthSubSectors = [
        { name: 'Vaccination', count: healthIndicators.filter(i => i.name.toLowerCase().includes('vaccin')).length || 12, icon: Syringe, trend: '+5%' },
        { name: 'Santé Maternelle', count: healthIndicators.filter(i => i.name.toLowerCase().includes('maternell')).length || 8, icon: Baby, trend: '+2%' },
        { name: 'Maladies', count: healthIndicators.filter(i => i.name.toLowerCase().includes('palu') || i.name.toLowerCase().includes('vih')).length || 15, icon: Activity, trend: '-1%' },
    ];

    const educationSubSectors = [
        { name: 'Primaire', count: educationIndicators.filter(i => i.name.toLowerCase().includes('primaire')).length || 20, icon: School, trend: '+4%' },
        { name: 'Secondaire', count: educationIndicators.filter(i => i.name.toLowerCase().includes('secondaire')).length || 18, icon: BookOpen, trend: '+3%' },
        { name: 'Supérieur', count: educationIndicators.filter(i => i.name.toLowerCase().includes('supérieur')).length || 10, icon: GraduationCap, trend: '+1%' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Vue d'ensemble des Secteurs</h1>
                <p className="text-muted-foreground">Exploration détaillée des indicateurs par domaine d'intervention.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                {/* Health Sector Column */}
                <div className="space-y-4">
                    <Card className="border-t-4 border-t-blue-500 shadow-sm hover:shadow-md transition-all">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="text-2xl text-blue-700 flex items-center gap-2">
                                        <Activity className="h-6 w-6" />
                                        Santé Publique
                                    </CardTitle>
                                    <CardDescription>Indicateurs de performance sanitaire</CardDescription>
                                </div>
                                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">{healthIndicators.length} Indicateurs</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                {healthSubSectors.map((sub, idx) => (
                                    <div key={idx} className="flex flex-col p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border hover:bg-blue-50/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer" onClick={() => navigate('/institution/sectors/health')}>
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                                                <sub.icon className="h-4 w-4" />
                                            </div>
                                            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{sub.trend}</span>
                                        </div>
                                        <h4 className="font-semibold text-sm">{sub.name}</h4>
                                        <p className="text-xs text-muted-foreground">{sub.count} mesures actives</p>
                                    </div>
                                ))}
                            </div>
                            <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => navigate('/institution/sectors/health')}>
                                Accéder au Dashboard Santé <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Key Health Metric Preview */}
                    <Card className="bg-blue-50/50 dark:bg-slate-900/50 border-blue-100 dark:border-blue-900/30">
                        <CardContent className="p-4 flex items-center gap-4">
                            <TrendingUp className="h-8 w-8 text-blue-500" />
                            <div>
                                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Taux de couverture vaccinale</p>
                                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">88.5% <span className="text-sm font-normal text-muted-foreground">Moyenne nationale</span></p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Education Sector Column */}
                <div className="space-y-4">
                    <Card className="border-t-4 border-t-emerald-500 shadow-sm hover:shadow-md transition-all">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="text-2xl text-emerald-700 flex items-center gap-2">
                                        <GraduationCap className="h-6 w-6" />
                                        Éducation
                                    </CardTitle>
                                    <CardDescription>Indicateurs de performance scolaire</CardDescription>
                                </div>
                                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200">{educationIndicators.length} Indicateurs</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                {educationSubSectors.map((sub, idx) => (
                                    <div key={idx} className="flex flex-col p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border hover:bg-emerald-50/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer" onClick={() => navigate('/institution/sectors/education')}>
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="p-2 rounded-full bg-emerald-100 text-emerald-600">
                                                <sub.icon className="h-4 w-4" />
                                            </div>
                                            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{sub.trend}</span>
                                        </div>
                                        <h4 className="font-semibold text-sm">{sub.name}</h4>
                                        <p className="text-xs text-muted-foreground">{sub.count} mesures actives</p>
                                    </div>
                                ))}
                            </div>
                            <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={() => navigate('/institution/sectors/education')}>
                                Accéder au Dashboard Éducation <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Key Education Metric Preview */}
                    <Card className="bg-emerald-50/50 dark:bg-slate-900/50 border-emerald-100 dark:border-emerald-900/30">
                        <CardContent className="p-4 flex items-center gap-4">
                            <TrendingUp className="h-8 w-8 text-emerald-500" />
                            <div>
                                <p className="text-sm font-medium text-emerald-900 dark:text-emerald-100">Taux de scolarisation (Primaire)</p>
                                <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">92.1% <span className="text-sm font-normal text-muted-foreground">Moyenne nationale</span></p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};
