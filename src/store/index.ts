// ============================================
// FATI - Store Zustand
// Gestion d'état globale
// ============================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  User,
  UserRole,
  Sector,
  Alert,
  FilterState,
  AppConfig,
  GeographicEntity,
  Indicator,
  IndicatorValue,
  Dashboard,
  MapViewport,
  MapLayer,
  HealthFacility,
  EducationFacility,
} from '@/types';

// ----- Auth Store -----

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  refreshToken: string | null;

  // Actions
  login: (user: User, token: string, refreshToken?: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
  hasPermission: (resource: string, action: string) => boolean;
  hasRole: (roles: UserRole[]) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      token: null,
      refreshToken: null,

      login: (user, token, refreshToken) => {
        set({ user, token, refreshToken: refreshToken || null, isAuthenticated: true });
      },

      logout: () => {
        set({ user: null, token: null, refreshToken: null, isAuthenticated: false });
      },

      updateUser: (userData) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...userData } });
        }
      },

      setLoading: (loading) => set({ isLoading: loading }),

      hasPermission: (resource, action) => {
        const user = get().user;
        if (!user) return false;
        return user.permissions.some(
          (p) => p.resource === resource && p.actions.includes(action as any)
        );
      },

      hasRole: (roles) => {
        const user = get().user;
        if (!user) return false;
        return roles.includes(user.role);
      },
    }),
    {
      name: 'fati-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// ----- UI Store -----

interface UIState {
  theme: 'light' | 'dark' | 'system';
  sidebarCollapsed: boolean;
  sidebarMobileOpen: boolean;
  activeModal: string | null;
  modalData: unknown;
  toasts: Array<{ id: string; type: 'success' | 'error' | 'warning' | 'info'; message: string }>;

  // Actions
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleSidebar: () => void;
  setSidebarMobileOpen: (open: boolean) => void;
  openModal: (modal: string, data?: unknown) => void;
  closeModal: () => void;
  addToast: (toast: Omit<UIState['toasts'][0], 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      sidebarCollapsed: false,
      sidebarMobileOpen: false,
      activeModal: null,
      modalData: null,
      toasts: [],

      setTheme: (theme) => set({ theme }),

      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      setSidebarMobileOpen: (open) => set({ sidebarMobileOpen: open }),

      openModal: (modal, data) => set({ activeModal: modal, modalData: data }),

      closeModal: () => set({ activeModal: null, modalData: null }),

      addToast: (toast) => {
        const id = Math.random().toString(36).substring(7);
        set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
        setTimeout(() => get().removeToast(id), 5000);
      },

      removeToast: (id) => {
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
      },
    }),
    {
      name: 'fati-ui',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ theme: state.theme, sidebarCollapsed: state.sidebarCollapsed }),
    }
  )
);

// ----- Filter Store -----

interface FilterStoreState {
  filters: FilterState;

  // Actions
  setFilters: (filters: Partial<FilterState>) => void;
  clearFilters: () => void;
  setSectors: (sectors: Sector[]) => void;
  setRegions: (regions: string[]) => void;
  setDepartments: (departments: string[]) => void;
  setCommunes: (communes: string[]) => void;
  setYears: (years: number[]) => void;
  setIndicators: (indicators: string[]) => void;
  setSearch: (search: string) => void;
}

const defaultFilters: FilterState = {
  sectors: [],
  regions: [],
  departments: [],
  communes: [],
  years: [new Date().getFullYear()],
  indicators: [],
  categories: [],
  status: [],
  search: '',
};

export const useFilterStore = create<FilterStoreState>()(
  persist(
    (set) => ({
      filters: defaultFilters,

      setFilters: (newFilters) =>
        set((state) => ({ filters: { ...state.filters, ...newFilters } })),

      clearFilters: () => set({ filters: defaultFilters }),

      setSectors: (sectors) =>
        set((state) => ({ filters: { ...state.filters, sectors } })),

      setRegions: (regions) =>
        set((state) => ({ filters: { ...state.filters, regions } })),

      setDepartments: (departments) =>
        set((state) => ({ filters: { ...state.filters, departments } })),

      setCommunes: (communes) =>
        set((state) => ({ filters: { ...state.filters, communes } })),

      setYears: (years) =>
        set((state) => ({ filters: { ...state.filters, years } })),

      setIndicators: (indicators) =>
        set((state) => ({ filters: { ...state.filters, indicators } })),

      setSearch: (search) =>
        set((state) => ({ filters: { ...state.filters, search } })),
    }),
    {
      name: 'fati-filters',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

// ----- Data Store -----

interface DataState {
  // Geographic data
  regions: GeographicEntity[];
  departments: GeographicEntity[];
  communes: GeographicEntity[];

  // Indicators
  indicators: Indicator[];
  indicatorValues: IndicatorValue[];

  // Facilities
  healthFacilities: HealthFacility[];
  educationFacilities: EducationFacility[];

  // Dashboards
  dashboards: Dashboard[];
  activeDashboard: Dashboard | null;

  // Alerts
  alerts: Alert[];
  unreadAlertsCount: number;

  // Loading states
  isLoadingRegions: boolean;
  isLoadingIndicators: boolean;
  isLoadingValues: boolean;
  isLoadingHealthFacilities: boolean;
  isLoadingEducationFacilities: boolean;

  // Actions
  setRegions: (regions: GeographicEntity[]) => void;
  setDepartments: (departments: GeographicEntity[]) => void;
  setCommunes: (communes: GeographicEntity[]) => void;
  setIndicators: (indicators: Indicator[]) => void;
  setIndicatorValues: (values: IndicatorValue[]) => void;
  setHealthFacilities: (facilities: HealthFacility[]) => void;
  setEducationFacilities: (facilities: EducationFacility[]) => void;
  setDashboards: (dashboards: Dashboard[]) => void;
  setActiveDashboard: (dashboard: Dashboard | null) => void;
  setAlerts: (alerts: Alert[]) => void;
  markAlertAsRead: (alertId: string) => void;
  setLoading: (key: 'isLoadingRegions' | 'isLoadingIndicators' | 'isLoadingValues' | 'isLoadingHealthFacilities' | 'isLoadingEducationFacilities', value: boolean) => void;
}

export const useDataStore = create<DataState>()((set) => ({
  regions: [],
  departments: [],
  communes: [],
  indicators: [],
  indicatorValues: [],
  healthFacilities: [],
  educationFacilities: [],
  dashboards: [],
  activeDashboard: null,
  alerts: [],
  unreadAlertsCount: 0,
  isLoadingRegions: false,
  isLoadingIndicators: false,
  isLoadingValues: false,
  isLoadingHealthFacilities: false,
  isLoadingEducationFacilities: false,

  setRegions: (regions) => set({ regions }),
  setDepartments: (departments) => set({ departments }),
  setCommunes: (communes) => set({ communes }),
  setIndicators: (indicators) => set({ indicators }),
  setIndicatorValues: (indicatorValues) => set({ indicatorValues }),
  setHealthFacilities: (healthFacilities) => set({ healthFacilities }),
  setEducationFacilities: (educationFacilities) => set({ educationFacilities }),
  setDashboards: (dashboards) => set({ dashboards }),
  setActiveDashboard: (activeDashboard) => set({ activeDashboard }),
  setAlerts: (alerts) =>
    set({
      alerts,
      unreadAlertsCount: alerts.filter((a) => !a.isRead).length,
    }),
  markAlertAsRead: (alertId) =>
    set((state) => ({
      alerts: state.alerts.map((a) =>
        a.id === alertId ? { ...a, isRead: true } : a
      ),
      unreadAlertsCount: Math.max(0, state.unreadAlertsCount - 1),
    })),
  setLoading: (key, value) => set({ [key]: value } as Partial<DataState>),
}));

// ----- Map Store -----

interface MapState {
  viewport: MapViewport;
  layers: MapLayer[];
  selectedEntity: GeographicEntity | null;
  selectedIndicator: Indicator | null;
  showLabels: boolean;

  // Actions
  setViewport: (viewport: Partial<MapViewport>) => void;
  setLayers: (layers: MapLayer[]) => void;
  toggleLayer: (layerId: string) => void;
  setSelectedEntity: (entity: GeographicEntity | null) => void;
  setSelectedIndicator: (indicator: Indicator | null) => void;
  setShowLabels: (show: boolean) => void;
  flyTo: (center: [number, number], zoom?: number) => void;
}

const defaultViewport: MapViewport = {
  center: [14.4974, -14.4524], // Sénégal par défaut
  zoom: 7,
};

export const useMapStore = create<MapState>()((set) => ({
  viewport: defaultViewport,
  layers: [],
  selectedEntity: null,
  selectedIndicator: null,
  showLabels: true,

  setViewport: (newViewport) =>
    set((state) => ({ viewport: { ...state.viewport, ...newViewport } })),

  setLayers: (layers) => set({ layers }),

  toggleLayer: (layerId) =>
    set((state) => ({
      layers: state.layers.map((l) =>
        l.id === layerId ? { ...l, visible: !l.visible } : l
      ),
    })),

  setSelectedEntity: (entity) => set({ selectedEntity: entity }),

  setSelectedIndicator: (indicator) => set({ selectedIndicator: indicator }),

  setShowLabels: (show) => set({ showLabels: show }),

  flyTo: (center, zoom = 10) => set({ viewport: { center, zoom } }),
}));

// ----- Config Store -----

interface ConfigState {
  config: AppConfig;

  // Actions
  updateConfig: (config: Partial<AppConfig>) => void;
  setLanguage: (language: string) => void;
  setNotifications: (notifications: AppConfig['notifications']) => void;
}

const defaultConfig: AppConfig = {
  theme: 'system',
  language: 'fr',
  dateFormat: 'DD/MM/YYYY',
  numberFormat: 'fr-FR',
  currency: 'XOF',
  notifications: {
    email: true,
    push: true,
    alerts: true,
  },
};

export const useConfigStore = create<ConfigState>()(
  persist(
    (set) => ({
      config: defaultConfig,

      updateConfig: (newConfig) =>
        set((state) => ({ config: { ...state.config, ...newConfig } })),

      setLanguage: (language) =>
        set((state) => ({ config: { ...state.config, language } })),

      setNotifications: (notifications) =>
        set((state) => ({ config: { ...state.config, notifications } })),
    }),
    {
      name: 'fati-config',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// ----- Navigation Store -----

interface NavigationState {
  currentSpace: 'institution' | 'sector' | 'admin' | 'annonceur' | null;
  currentSector: Sector | null;
  breadcrumbs: Array<{ label: string; path?: string }>;

  // Actions
  setCurrentSpace: (space: NavigationState['currentSpace']) => void;
  setCurrentSector: (sector: Sector | null) => void;
  setBreadcrumbs: (breadcrumbs: NavigationState['breadcrumbs']) => void;
  addBreadcrumb: (item: NavigationState['breadcrumbs'][0]) => void;
  goBack: () => void;
}

export const useNavigationStore = create<NavigationState>()((set) => ({
  currentSpace: null,
  currentSector: null,
  breadcrumbs: [],

  setCurrentSpace: (space) => set({ currentSpace: space }),

  setCurrentSector: (sector) => set({ currentSector: sector }),

  setBreadcrumbs: (breadcrumbs) => set({ breadcrumbs }),

  addBreadcrumb: (item) =>
    set((state) => ({ breadcrumbs: [...state.breadcrumbs, item] })),

  goBack: () =>
    set((state) => ({
      breadcrumbs: state.breadcrumbs.slice(0, -1),
    })),
}));
