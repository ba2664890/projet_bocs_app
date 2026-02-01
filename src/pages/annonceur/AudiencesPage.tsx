import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { geographyService } from '@/services/geography';
import { facilitiesService } from '@/services/facilities';
import {
    Users,
    MapPin,
    Building2,
    Target,
    Loader2,
    Hospital,
    GraduationCap,
    TrendingUp
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    PieChart as RePieChart,
    Pie
} from 'recharts';

const COLORS = ['#4f46e5', '#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe'];

export const AudiencesPage = () => {
    const [regions, setRegions] = useState<any[]>([]);
    const [facilityStats, setFacilityStats] = useState<any[]>([]);
    const [totalPopulation, setTotalPopulation] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [regRes, healthRes, eduRes] = await Promise.all([
                    geographyService.getRegions(),
                    facilitiesService.getHealthFacilities(),
                    facilitiesService.getEducationFacilities()
                ]);

                const fetchedRegions = regRes.results.map((r: any) => ({
                    name: r.name,
                    value: r.population || 0,
                })).sort((a, b) => b.value - a.value).slice(0, 5);

                const totalPop = regRes.results.reduce((acc, r: any) => acc + (r.population || 0), 0);

                setRegions(fetchedRegions);
                setTotalPopulation(totalPop);
                setFacilityStats([
                    { name: 'Santé', value: healthRes.count },
                    { name: 'Éducation', value: eduRes.count },
                ]);
            } catch (error) {
                console.error('Failed to fetch audience data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (!isLoading && containerRef.current) {
            gsap.fromTo(
                containerRef.current.children,
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    stagger: 0.1,
                    ease: 'power2.out'
                }
            );
        }
    }, [isLoading]);

    if (isLoading) {
        return (
            <MainLayout space="annonceur">
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
                    <p className="text-muted-foreground animate-pulse font-medium">Analyse des données territoriales...</p>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout space="annonceur">
            <div ref={containerRef} className="max-w-[1600px] mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Analyse d'Audience</h1>
                        <p className="text-muted-foreground mt-1">Comprenez la portée potentielle de vos communications sur le territoire.</p>
                    </div>
                    <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/20 px-4 py-2 rounded-xl border border-indigo-100 dark:border-indigo-800">
                        <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        <span className="font-bold text-indigo-700 dark:text-indigo-300">{(totalPopulation / 1000000).toFixed(1)}M Portée Totale (Pop.)</span>
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Geographic Distribution */}
                    <Card className="xl:col-span-2 border-none shadow-xl bg-white dark:bg-slate-900 overflow-hidden">
                        <CardHeader className="border-b bg-slate-50/50 dark:bg-slate-800/50">
                            <div className="flex items-center gap-3">
                                <MapPin className="h-5 w-5 text-indigo-600" />
                                <div>
                                    <CardTitle className="text-lg">Distribution Géographique (Population)</CardTitle>
                                    <CardDescription>Portée potentielle par région basée sur les données réelles.</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="h-[350px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={regions} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                                        <XAxis type="number" hide />
                                        <YAxis
                                            dataKey="name"
                                            type="category"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#64748b', fontSize: 12 }}
                                            width={100}
                                        />
                                        <Tooltip
                                            cursor={{ fill: '#f1f5f9' }}
                                            contentStyle={{
                                                borderRadius: '12px',
                                                border: 'none',
                                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                                fontSize: '12px'
                                            }}
                                            formatter={(value) => [Number(value).toLocaleString(), 'Habitants']}
                                        />
                                        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                                            {regions.map((_, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Sector Breakdown */}
                    <Card className="border-none shadow-xl bg-white dark:bg-slate-900 flex flex-col">
                        <CardHeader className="border-b bg-slate-50/50 dark:bg-slate-800/50">
                            <div className="flex items-center gap-3">
                                <Building2 className="h-5 w-5 text-rose-500" />
                                <div>
                                    <CardTitle className="text-lg">Cibles par Secteur</CardTitle>
                                    <CardDescription>Nombre d'établissements territoriaux atteints.</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 flex-1 flex flex-col justify-center">
                            <div className="h-[250px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RePieChart>
                                        <Pie
                                            data={facilityStats}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={70}
                                            outerRadius={90}
                                            paddingAngle={8}
                                            dataKey="value"
                                        >
                                            {facilityStats.map((_, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => [value, 'Établissements']} />
                                    </RePieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="mt-8 grid grid-cols-2 gap-4">
                                {facilityStats.map((stat, i) => (
                                    <div key={i} className="flex flex-col items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                                        {stat.name === 'Santé' ? <Hospital className="h-4 w-4 text-rose-500 mb-2" /> : <GraduationCap className="h-4 w-4 text-indigo-500 mb-2" />}
                                        <span className="text-xs text-muted-foreground font-medium uppercase">{stat.name}</span>
                                        <span className="text-xl font-bold mt-1">{stat.value}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Top Regions Status */}
                    <Card className="xl:col-span-3 border-none shadow-xl bg-white dark:bg-slate-900 overflow-hidden">
                        <CardHeader className="border-b bg-slate-50/50 dark:bg-slate-800/50">
                            <div className="flex items-center gap-3">
                                <Target className="h-5 w-5 text-indigo-600" />
                                <div>
                                    <CardTitle className="text-lg">Portée Potentielle Détaillée</CardTitle>
                                    <CardDescription>Volume d'audience locale par région administrative.</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 divide-x dark:divide-slate-800">
                                {regions.map((region, i) => (
                                    <div key={i} className="p-6 group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="h-8 w-8 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                                                <span className="text-xs font-bold">{i + 1}</span>
                                            </div>
                                            <TrendingUp className="h-4 w-4 text-emerald-500" />
                                        </div>
                                        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{region.name}</p>
                                        <p className="text-2xl font-bold mt-1">{Number(region.value).toLocaleString()}</p>
                                        <div className="mt-4 flex items-center gap-2">
                                            <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-indigo-500 rounded-full"
                                                    style={{ width: `${(region.value / regions[0].value) * 100}%` }}
                                                />
                                            </div>
                                            <span className="text-[10px] font-bold text-muted-foreground">{Math.round((region.value / totalPopulation) * 100)}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </MainLayout>
    );
};
