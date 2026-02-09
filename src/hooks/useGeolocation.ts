import { useState, useCallback } from 'react';

interface GeolocationState {
    coords: {
        latitude: number;
        longitude: number;
    } | null;
    error: string | null;
    isLoading: boolean;
}

export const useGeolocation = () => {
    const [state, setState] = useState<GeolocationState>({
        coords: null,
        error: null,
        isLoading: false,
    });

    const getPosition = useCallback(() => {
        if (!navigator.geolocation) {
            setState(prev => ({ ...prev, error: 'La géolocalisation n\'est pas supportée par votre navigateur' }));
            return;
        }

        setState(prev => ({ ...prev, isLoading: true, error: null }));

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setState({
                    coords: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    },
                    error: null,
                    isLoading: false,
                });
            },
            (error) => {
                let errorMessage = 'Erreur lors de la récupération de la position';
                if (error.code === 1) errorMessage = 'Accès à la localisation refusé';
                else if (error.code === 2) errorMessage = 'Position non disponible';
                else if (error.code === 3) errorMessage = 'Délai d\'attente dépassé';

                setState({
                    coords: null,
                    error: errorMessage,
                    isLoading: false,
                });
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    }, []);

    return { ...state, getPosition };
};
