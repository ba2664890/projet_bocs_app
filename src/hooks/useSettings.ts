import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AppSettings {
    siteName: string;
    contactEmail: string;
    timezone: string;
    currency: string;
    language: string;
    performanceMode: boolean;
    autoOptimization: boolean;
    twoFactorAuth: boolean;
    sessionTimeout: string;
}

interface SettingsState extends AppSettings {
    updateSettings: (settings: Partial<AppSettings>) => void;
    resetSettings: () => void;
}

const defaultSettings: AppSettings = {
    siteName: "FATI - Fond d'Analyse Territoriale",
    contactEmail: "support@fati.gov.sn",
    timezone: "utc",
    currency: "xof",
    language: "fr",
    performanceMode: true,
    autoOptimization: true,
    twoFactorAuth: true,
    sessionTimeout: "60",
};

export const useSettings = create<SettingsState>()(
    persist(
        (set) => ({
            ...defaultSettings,
            updateSettings: (newSettings) => set((state) => ({ ...state, ...newSettings })),
            resetSettings: () => set(defaultSettings),
        }),
        {
            name: 'fati-settings',
        }
    )
);
