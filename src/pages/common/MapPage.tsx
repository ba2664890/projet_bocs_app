import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
import { Loader2, MapPin, BarChart3 } from 'lucide-react';
import { useGeographicData } from '@/hooks/useData';

export const MapPage = () => {
  const location = useLocation();
  const space = location.pathname.split('/')[1] as any;
  const { regions, isLoading } = useGeographicData();
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [viewMode, setViewMode] = useState<'map' | 'table'>('map');

  useEffect(() => {
    if (regions.length > 0 && !selectedRegion) {
      setSelectedRegion(regions[0].id);
    }
  }, [regions]);

  const selectedRegionData = regions.find(r => r.id === selectedRegion);

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
            <Button 
              variant={viewMode === 'map' ? 'default' : 'outline'}
              onClick={() => setViewMode('map')}
              className="gap-2"
            >
              <MapPin className="h-4 w-4" />
              Vue Régions
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

        {/* Region selector */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sélectionner une région</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger className="w-full md:w-96">
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
          </CardContent>
        </Card>

        {/* Map View or Table View */}
        {viewMode === 'map' ? (
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                {selectedRegionData?.name || 'Région'}
              </CardTitle>
              <CardDescription>
                Localisation et informations administratives
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {selectedRegionData ? (
                <div className="space-y-6">
                  {/* Map placeholder with region info */}
                  <div className="h-96 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 rounded-lg border-2 border-dashed border-blue-200 dark:border-slate-700 flex flex-col items-center justify-center gap-4">
                    <div className="text-center space-y-2">
                      <MapPin className="h-12 w-12 text-blue-500 mx-auto" />
                      <h3 className="text-lg font-semibold">{selectedRegionData.name}</h3>
                      <p className="text-sm text-muted-foreground">Détails géographiques</p>
                    </div>
                  </div>

                  {/* Region details grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30">
                      <CardContent className="p-4 space-y-2">
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-200">Région</p>
                        <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{selectedRegionData.name}</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900/30">
                      <CardContent className="p-4 space-y-2">
                        <p className="text-sm font-medium text-green-900 dark:text-green-200">Code</p>
                        <p className="text-xl font-bold text-green-600 dark:text-green-400">{selectedRegionData.id}</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900/30">
                      <CardContent className="p-4 space-y-2">
                        <p className="text-sm font-medium text-amber-900 dark:text-amber-200">Statut</p>
                        <p className="text-xl font-bold text-amber-600 dark:text-amber-400">Actif</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-12">
                  Sélectionnez une région pour afficher les détails
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          /* Table View */
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                Toutes les régions
              </CardTitle>
              <CardDescription>
                Liste complète des divisions administratives
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Région</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Localités</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {regions.map(region => (
                      <TableRow key={region.id}>
                        <TableCell className="font-medium">{region.name}</TableCell>
                        <TableCell className="text-muted-foreground">{region.id}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">Région Administrative</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setSelectedRegion(region.id);
                              setViewMode('map');
                            }}
                          >
                            Voir détails
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

        {/* Info Box */}
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30">
          <CardContent className="p-4">
            <p className="text-sm text-blue-900 dark:text-blue-200">
              <span className="font-semibold">✓ Cartographie Sénégal:</span> {regions.length} régions chargées du backend. Naviguez entre les vues carte et tableau.
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};