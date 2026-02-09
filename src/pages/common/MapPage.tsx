// ============================================
// FATI - Cartographie Avancée
// ============================================

import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, MapPin, BarChart3, Building2, ShieldCheck } from 'lucide-react';
import { useGeographicData } from '@/hooks/useData';
import { MapDisplay } from '@/components/common/MapDisplay';

export const MapPage = () => {
  const location = useLocation();
  const space = location.pathname.split('/')[1] as any;
  const { regions, departments, communes, isLoading } = useGeographicData();
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [viewMode, setViewMode] = useState<'map' | 'table'>('map');
  const [geoLevel, setGeoLevel] = useState<'region' | 'department' | 'commune'>('region');

  useEffect(() => {
    if (regions.length > 0 && !selectedRegion) {
      setSelectedRegion(regions[0].id);
    }
  }, [regions]);

  const selectedRegionData = regions.find(r => r.id === selectedRegion);

  // Préparation des données GeoJSON pour MapDisplay
  const getGeoData = () => {
    let features: any[] = [];
    if (geoLevel === 'region') {
      features = regions.filter(r => !!r.geometry);
    } else if (geoLevel === 'department') {
      features = departments.filter(d => !!d.geometry && d.parentId === selectedRegion);
    } else if (geoLevel === 'commune') {
      const regionDepts = departments.filter(d => d.parentId === selectedRegion).map(d => d.id);
      features = communes.filter(c => !!c.geometry && regionDepts.includes(c.parentId as string));
    }

    return {
      type: 'FeatureCollection',
      features: features.map(f => ({
        type: 'Feature',
        properties: { id: f.id, name: f.name },
        geometry: f.geometry
      }))
    };
  };

  if (isLoading) {
    return (
      <MainLayout space={space} title="Cartographie">
        <div className="flex h-[600px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout space={space} title="Cartographie">
      <div className="space-y-6">
        {/* Header with controls */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-card p-6 rounded-xl border shadow-sm">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">Cartographie Administrative</h2>
            <p className="text-muted-foreground">Visualisez les régions et localités du Sénégal</p>
          </div>
          <div className="flex gap-2">
            <Select value={geoLevel} onValueChange={(v: any) => setGeoLevel(v)}>
              <SelectTrigger className="w-40 border-primary/20">
                <SelectValue placeholder="Niveau" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="region">Régions</SelectItem>
                <SelectItem value="department">Départements</SelectItem>
                <SelectItem value="commune">Communes</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant={viewMode === 'map' ? 'default' : 'outline'}
              onClick={() => setViewMode('map')}
              className="gap-2"
            >
              <MapPin className="h-4 w-4" />
              Vue Carte
            </Button>
            <Button
              variant={viewMode === 'table' ? 'default' : 'outline'}
              onClick={() => setViewMode('table')}
              className="gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              Tableau
            </Button>
          </div>
        </div>

        {/* Region selector filter bar */}
        <div className="flex items-center gap-4 bg-muted/30 p-4 rounded-lg border">
          <span className="text-sm font-semibold whitespace-nowrap">Focus Régional :</span>
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="max-w-md bg-background">
              <SelectValue placeholder="Choisir une région" />
            </SelectTrigger>
            <SelectContent>
              {regions.map(region => (
                <SelectItem key={region.id} value={region.id}>
                  {region.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedRegionData && (
            <Badge variant="secondary" className="px-3 py-1">
              {departments.filter(d => d.parentId === selectedRegion).length} Départements
            </Badge>
          )}
        </div>

        {/* Map View or Table View */}
        {viewMode === 'map' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 overflow-hidden h-[650px] border-primary/10 shadow-lg">
              <MapDisplay
                data={getGeoData()}
                level={geoLevel}
                onEntityClick={(id) => {
                  if (geoLevel === 'region') setSelectedRegion(id);
                }}
              />
            </Card>

            <Card className="h-[650px] flex flex-col border-primary/10 shadow-lg">
              <CardHeader className="border-b bg-muted/10">
                <CardTitle className="text-xl flex items-center gap-3">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  {selectedRegionData?.name || 'Sélection'}
                </CardTitle>
                <CardDescription>
                  Détails du territoire sélectionné
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 flex-1 overflow-auto">
                {selectedRegionData ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-200/50 dark:border-blue-800/50">
                        <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1">Population Totale</p>
                        <p className="text-3xl font-black text-slate-900 dark:text-white">{selectedRegionData.population?.toLocaleString() || 'N/A'}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-gradient-to-br from-teal-500/10 to-emerald-500/10 border border-teal-200/50 dark:border-teal-800/50">
                        <p className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest mb-1">Superficie</p>
                        <p className="text-2xl font-black text-slate-900 dark:text-white">{selectedRegionData.areaKm2?.toLocaleString() || 'N/A'} <span className="text-sm font-normal opacity-60">km²</span></p>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-primary" />
                          Départements ({departments.filter(d => d.parentId === selectedRegion).length})
                        </h4>
                      </div>
                      <div className="space-y-2">
                        {departments.filter(d => d.parentId === selectedRegion).map(dept => (
                          <div key={dept.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all border border-transparent hover:border-slate-200 group">
                            <div className="flex flex-col">
                              <span className="text-sm font-bold group-hover:text-primary transition-colors">{dept.name}</span>
                              <span className="text-[10px] opacity-60">Code: {dept.code}</span>
                            </div>
                            <Badge variant="outline" className="text-[10px] font-bold">{dept.population?.toLocaleString() || 'N/A'} hab.</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
                    <MapPin className="h-16 w-16 mb-4 opacity-10 animate-pulse" />
                    <p className="font-medium">Sélectionnez un territoire sur la carte pour explorer les données locales.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Table View */
          <Card className="border-primary/10 shadow-xl overflow-hidden">
            <CardHeader className="border-b bg-muted/10">
              <CardTitle className="flex items-center gap-2 text-xl">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                Liste Administrative Complète
              </CardTitle>
              <CardDescription>
                Détails exhaustifs des 14 régions du Sénégal
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="w-full">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="font-bold">Région</TableHead>
                      <TableHead className="font-bold">Code</TableHead>
                      <TableHead className="font-bold">Population</TableHead>
                      <TableHead className="font-bold">Départements</TableHead>
                      <TableHead className="text-right font-bold">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {regions.map(region => (
                      <TableRow key={region.id} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors">
                        <TableCell className="font-bold text-slate-900 dark:text-slate-100">{region.name}</TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">{region.code}</TableCell>
                        <TableCell className="font-medium">{region.population?.toLocaleString() || 'N/A'}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="font-bold">
                            {departments.filter(d => d.parentId === region.id).length} localités
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-primary hover:bg-primary/10 font-bold"
                            onClick={() => {
                              setSelectedRegion(region.id);
                              setViewMode('map');
                              setGeoLevel('region');
                            }}
                          >
                            Explorer
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        )}

        {/* Map Integration Legend / Status */}
        <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-600 text-white shadow-lg overflow-hidden relative">
          <div className="absolute right-0 top-0 h-full w-24 bg-white/10 skew-x-12 transform translate-x-10 translate-y-2 blur-2xl"></div>
          <div className="p-2 bg-white/20 rounded-lg">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <p className="text-sm font-medium">
            <span className="font-black">GIS SYNC OK:</span> {regions.length} régions, {departments.length} départements et {communes.length} communes synchronisées avec les serveurs PostGIS.
          </p>
        </div>
      </div>
    </MainLayout>
  );
};
