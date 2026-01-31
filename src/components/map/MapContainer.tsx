// ============================================
// FATI - Conteneur de Carte Leaflet
// ============================================

import { useEffect, useState } from 'react';
import { MapContainer as LeafletMap, TileLayer, GeoJSON, Marker, Popup, useMap, ZoomControl } from 'react-leaflet';
import { Icon, divIcon, point } from 'leaflet';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Maximize2,
  Minimize2,
  Locate,
} from 'lucide-react';

import 'leaflet/dist/leaflet.css';

// Fix pour les icônes Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// @ts-ignore
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface MapContainerProps {
  className?: string;
  height?: string;
  showControls?: boolean;
  interactive?: boolean;
  children?: React.ReactNode;
}

// Composant pour synchroniser la vue avec le store
const MapController = () => {
  const map = useMap();

  useEffect(() => {
    const handleMove = () => {
      // Mettre à jour le store si nécessaire
    };

    map.on('moveend', handleMove);
    map.on('zoomend', handleMove);

    return () => {
      map.off('moveend', handleMove);
      map.off('zoomend', handleMove);
    };
  }, [map]);

  return null;
};

// Icône personnalisée pour les marqueurs
const createCustomIcon = (color: string, size: number = 24) => {
  return divIcon({
    className: 'custom-marker',
    html: `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="${color}" stroke="white" stroke-width="2"/>
        <circle cx="12" cy="12" r="4" fill="white"/>
      </svg>
    `,
    iconSize: point(size, size),
    iconAnchor: point(size / 2, size / 2),
  });
};

// Données GeoJSON de démonstration pour les régions du Sénégal
const senegalRegionsGeoJSON: GeoJSON.FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { name: 'Dakar', code: 'DK', value: 88 },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-17.7, 14.6],
          [-17.3, 14.6],
          [-17.3, 14.9],
          [-17.7, 14.9],
          [-17.7, 14.6],
        ]],
      },
    },
    {
      type: 'Feature',
      properties: { name: 'Thiès', code: 'TH', value: 82 },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-17.3, 14.4],
          [-16.7, 14.4],
          [-16.7, 15.0],
          [-17.3, 15.0],
          [-17.3, 14.4],
        ]],
      },
    },
    {
      type: 'Feature',
      properties: { name: 'Saint-Louis', code: 'SL', value: 78 },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-16.7, 15.8],
          [-15.8, 15.8],
          [-15.8, 16.5],
          [-16.7, 16.5],
          [-16.7, 15.8],
        ]],
      },
    },
    {
      type: 'Feature',
      properties: { name: 'Kaolack', code: 'KL', value: 75 },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-16.5, 13.8],
          [-15.5, 13.8],
          [-15.5, 14.5],
          [-16.5, 14.5],
          [-16.5, 13.8],
        ]],
      },
    },
    {
      type: 'Feature',
      properties: { name: 'Ziguinchor', code: 'ZF', value: 72 },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-16.8, 12.3],
          [-15.8, 12.3],
          [-15.8, 13.0],
          [-16.8, 13.0],
          [-16.8, 12.3],
        ]],
      },
    },
  ],
};

// Style pour les régions
const getRegionStyle = (feature?: GeoJSON.Feature<GeoJSON.Geometry, any>) => {
  const value = feature?.properties?.value || 0;
  let fillColor = '#ef4444';
  if (value >= 85) fillColor = '#10b981';
  else if (value >= 70) fillColor = '#3b82f6';
  else if (value >= 60) fillColor = '#f59e0b';

  return {
    fillColor,
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.7,
  };
};

export const MapContainer = ({
  className,
  height = '500px',
  showControls = true,
  interactive = true,
  children,
}: MapContainerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    // Simuler le chargement
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleLocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          // Fly to location
        },
        (error) => {
          console.error('Erreur de géolocalisation:', error);
        }
      );
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <Skeleton className="w-full" style={{ height }} />
      </Card>
    );
  }

  return (
    <Card
      className={`relative overflow-hidden ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''
      } ${className || ''}`}
    >
      {/* Controls */}
      {showControls && (
        <div className="absolute right-4 top-4 z-[400] flex flex-col gap-2">
          <Button
            variant="secondary"
            size="icon"
            className="shadow-lg"
            onClick={handleLocate}
          >
            <Locate className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="shadow-lg"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      )}

      {/* Legend */}
      {showControls && (
        <div className="absolute bottom-4 left-4 z-[400] rounded-lg bg-white/90 p-3 shadow-lg backdrop-blur-sm dark:bg-slate-900/90">
          <p className="mb-2 text-xs font-medium">Performance</p>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-emerald-500" />
              <span className="text-xs">Excellente (≥85%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-500" />
              <span className="text-xs">Bonne (70-84%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-amber-500" />
              <span className="text-xs">Moyenne (60-69%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <span className="text-xs">À améliorer (&lt;60%)</span>
            </div>
          </div>
        </div>
      )}

      {/* Map */}
      <LeafletMap
        center={[14.4974, -14.4524]}
        zoom={7}
        style={{ height: isFullscreen ? '100vh' : height, width: '100%' }}
        zoomControl={false}
        scrollWheelZoom={interactive}
        doubleClickZoom={interactive}
        dragging={interactive}
      >
        <MapController />
        <ZoomControl position="bottomright" />

        {/* Base Layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Regions Layer */}
        <GeoJSON
          data={senegalRegionsGeoJSON}
          style={getRegionStyle}
          onEachFeature={(feature, layer) => {
            layer.bindPopup(`
              <div class="p-2">
                <h3 class="font-semibold">${feature.properties.name}</h3>
                <p class="text-sm">Performance: ${feature.properties.value}%</p>
              </div>
            `);
          }}
        />

        {/* Sample Markers */}
        <Marker
          position={[14.7167, -17.4677]}
          icon={createCustomIcon('#3b82f6')}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-semibold">Hôpital Principal de Dakar</h3>
              <p className="text-sm text-muted-foreground">Centre de santé de référence</p>
            </div>
          </Popup>
        </Marker>

        <Marker
          position={[14.7667, -17.3833]}
          icon={createCustomIcon('#10b981')}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-semibold">Centre de Santé de Pikine</h3>
              <p className="text-sm text-muted-foreground">Centre de santé</p>
            </div>
          </Popup>
        </Marker>

        <Marker
          position={[14.7167, -17.4677]}
          icon={createCustomIcon('#f59e0b', 20)}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-semibold">École Primaire de Dakar</h3>
              <p className="text-sm text-muted-foreground">École primaire publique</p>
            </div>
          </Popup>
        </Marker>

        {children}
      </LeafletMap>
    </Card>
  );
};
