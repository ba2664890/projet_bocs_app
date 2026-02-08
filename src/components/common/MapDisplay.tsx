// ============================================
// FATI - Composant de Cartographie Avancée
// ============================================

import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// Fix pour les icônes Leaflet par défaut
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapDisplayProps {
    data: any; // GeoJSON
    onEntityClick?: (entityId: string) => void;
    isLoading?: boolean;
    className?: string;
    level?: 'region' | 'department' | 'commune';
}

// Composant pour ajuster la vue de la carte
const MapResizer = ({ data }: { data: any }) => {
    const map = useMap();
    useEffect(() => {
        if (data && data.features && data.features.length > 0) {
            const geojsonLayer = L.geoJSON(data);
            map.fitBounds(geojsonLayer.getBounds(), { padding: [20, 20] });
        }
    }, [data, map]);
    return null;
};

export const MapDisplay: React.FC<MapDisplayProps> = ({
    data,
    onEntityClick,
    isLoading = false,
    className,
    level = 'region'
}) => {
    const [hoveredEntity, setHoveredEntity] = useState<string | null>(null);

    // Style dynamique des polygones
    const getStyle = (feature: any) => {
        const isHovered = hoveredEntity === feature.properties.id;
        return {
            fillColor: isHovered ? '#3b82f6' : '#94a3b8',
            weight: isHovered ? 2 : 1,
            opacity: 1,
            color: isHovered ? '#1d4ed8' : 'white',
            fillOpacity: isHovered ? 0.6 : 0.3,
            transition: 'all 0.2s'
        };
    };

    // Interactions avec les features
    const onEachFeature = (feature: any, layer: L.Layer) => {
        layer.on({
            mouseover: (e) => {
                setHoveredEntity(feature.properties.id);
                const l = e.target;
                l.setStyle({
                    fillOpacity: 0.7,
                    weight: 2
                });
            },
            mouseout: (e) => {
                setHoveredEntity(null);
                const l = e.target;
                l.setStyle({
                    fillOpacity: 0.3,
                    weight: 1
                });
            },
            click: () => {
                if (onEntityClick) {
                    onEntityClick(feature.properties.id);
                }
            }
        });

        // Tooltip simple
        layer.bindTooltip(`
      <div class="px-2 py-1">
        <div class="font-bold">${feature.properties.name}</div>
        <div class="text-xs text-muted-foreground">${level.charAt(0).toUpperCase() + level.slice(1)}</div>
      </div>
    `, { sticky: true, className: 'rounded-lg border shadow-sm bg-background p-0' });
    };

    if (isLoading) {
        return (
            <div className={cn("flex h-full w-full items-center justify-center bg-slate-50/50 dark:bg-slate-900/50 rounded-xl border", className)}>
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className={cn("relative h-full w-full overflow-hidden rounded-xl border shadow-sm", className)}>
            <MapContainer
                center={[14.4974, -14.4524]} // Centre du Sénégal
                zoom={7}
                style={{ height: '100%', width: '100%', background: '#f8fafc' }}
                zoomControl={false}
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {data && (
                    <GeoJSON
                        key={JSON.stringify(data.features?.length)} // Force re-render quand les données changent
                        data={data}
                        style={getStyle}
                        onEachFeature={onEachFeature}
                    />
                )}

                <MapResizer data={data} />
            </MapContainer>

            {/* Légende flottante / Info Bulle si besoin */}
            <div className="absolute bottom-4 left-4 z-[1000] bg-background/80 backdrop-blur-md p-2 rounded-lg border text-xs font-medium shadow-xl">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500/50 border border-blue-600 rounded-sm"></div>
                    <span>Sénégal - Divisions {level}s</span>
                </div>
            </div>
        </div>
    );
};
