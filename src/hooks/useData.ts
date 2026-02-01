// ============================================
// FATI - Hook de gestion des données
// ============================================

import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useDataStore } from '@/store';
import {
  geographyService,
  indicatorsService,
  facilitiesService,
  workflowsService,
  dashboardsService,
  dataCollectionService,
} from '@/services';
import type {
  GeographicEntity,
  Indicator,
  IndicatorValue,
  Alert,
  Dashboard,
  HealthFacility,
  EducationFacility,
  Sector,
  AdministrativeLevel,
  ValidationStatus,
  User,
  DataCollection,
} from '@/types';
import { authService } from '@/services/auth';

// ----- Hook pour les données géographiques -----

export const useGeographicData = () => {
  const {
    regions,
    departments,
    communes,
    setRegions,
    setDepartments,
    setCommunes,
    isLoadingRegions,
    setLoading,
  } = useDataStore();

  const loadData = useCallback(async (signal?: AbortSignal) => {
    try {
      setLoading('isLoadingRegions', true);
      const [regionsRes, departmentsRes, communesRes] = await Promise.all([
        geographyService.getRegions({ page_size: 100 }, signal),
        geographyService.getDepartments({ page_size: 100 }, signal),
        geographyService.getCommunes({ page_size: 500 }, signal),
      ]);

      setRegions(regionsRes.results);
      setDepartments(departmentsRes.results.map((d: any) => ({ ...d, parentId: d.region })));
      setCommunes(communesRes.results.map((c: any) => ({ ...c, parentId: c.department })));
    } catch (error) {
      if (axios.isCancel(error)) return;
      console.error('Failed to load geographic data:', error);
    } finally {
      setLoading('isLoadingRegions', false);
    }
  }, [setRegions, setDepartments, setCommunes, setLoading]);

  useEffect(() => {
    if (regions.length === 0) {
      const controller = new AbortController();
      loadData(controller.signal);
      return () => controller.abort();
    }
  }, [regions.length, loadData]);

  const getRegionById = useCallback((id: string): GeographicEntity | undefined => {
    return regions.find((r) => r.id === id);
  }, [regions]);

  const getDepartmentsByRegion = useCallback((regionId: string): GeographicEntity[] => {
    return departments.filter((d) => d.parentId === regionId);
  }, [departments]);

  const getCommunesByDepartment = useCallback((departmentId: string): GeographicEntity[] => {
    return communes.filter((c) => c.parentId === departmentId);
  }, [communes]);

  const getEntityById = useCallback((id: string, level: AdministrativeLevel): GeographicEntity | undefined => {
    switch (level) {
      case 'region':
        return regions.find((r) => r.id === id);
      case 'department':
        return departments.find((d) => d.id === id);
      case 'commune':
        return communes.find((c) => c.id === id);
      default:
        return undefined;
    }
  }, [regions, departments, communes]);

  return {
    regions,
    departments,
    communes,
    isLoading: isLoadingRegions,
    getRegionById,
    getDepartmentsByRegion,
    getCommunesByDepartment,
    getEntityById,
    refresh: loadData,
  };
};

// ----- Hook pour les indicateurs -----

export const useIndicators = (sector?: Sector) => {
  const { indicators, setIndicators, isLoadingIndicators, setLoading } = useDataStore();
  const [filteredIndicators, setFilteredIndicators] = useState<Indicator[]>([]);

  const loadIndicators = useCallback(async (signal?: AbortSignal) => {
    try {
      setLoading('isLoadingIndicators', true);
      const response = await indicatorsService.getIndicators({ page_size: 100 }, signal);
      setIndicators(response.results);
    } catch (error) {
      if (axios.isCancel(error)) return;
      console.error('Failed to load indicators', error);
    } finally {
      setLoading('isLoadingIndicators', false);
    }
  }, [setIndicators, setLoading]);

  useEffect(() => {
    if (indicators.length === 0) {
      const controller = new AbortController();
      loadIndicators(controller.signal);
      return () => controller.abort();
    }
  }, [indicators.length, loadIndicators]);

  useEffect(() => {
    if (sector) {
      setFilteredIndicators(indicators.filter((i) => i.sector === sector));
    } else {
      setFilteredIndicators(indicators);
    }
  }, [indicators, sector]);

  const getIndicatorById = useCallback((id: string): Indicator | undefined => {
    return indicators.find((i) => i.id === id);
  }, [indicators]);

  const getIndicatorsByCategory = useCallback((category: string): Indicator[] => {
    return indicators.filter((i) => i.category === category);
  }, [indicators]);

  return {
    indicators: filteredIndicators,
    allIndicators: indicators,
    isLoading: isLoadingIndicators,
    getIndicatorById,
    getIndicatorsByCategory,
    refresh: loadIndicators,
  };
};

// ----- Hook pour les valeurs d'indicateurs -----

export const useIndicatorValues = (filters?: {
  indicatorId?: string;
  geographicId?: string;
  year?: number;
  sector?: Sector;
  status?: ValidationStatus;
}) => {
  const { indicatorValues, setIndicatorValues, isLoadingValues, setLoading } = useDataStore();
  const [filteredValues, setFilteredValues] = useState<IndicatorValue[]>([]);

  const loadValues = useCallback(async (signal?: AbortSignal) => {
    try {
      setLoading('isLoadingValues', true);
      // Pass sector directly to API if available in filters
      const apiParams: any = { page_size: 1000 };
      if (filters?.sector) {
        apiParams['indicator__sector'] = filters.sector;
      }
      if (filters?.indicatorId) {
        apiParams['indicator'] = filters.indicatorId;
      }
      if (filters?.year) {
        apiParams['year'] = filters.year;
      }
      if (filters?.status) {
        apiParams['status'] = filters.status;
      }

      const response = await indicatorsService.getIndicatorValues(apiParams, signal);
      // Map properties to match interface
      const mappedResults = response.results.map((v: any) => ({
        ...v,
        indicatorId: v.indicatorId || v.indicator,
        geographicId: v.geographicId || v.region || v.department || v.commune,
      }));
      setIndicatorValues(mappedResults);
    } catch (error) {
      if (axios.isCancel(error)) return;
      console.error('Failed to load indicator values', error);
    } finally {
      setLoading('isLoadingValues', false);
    }
  }, [setIndicatorValues, setLoading]);

  useEffect(() => {
    if (indicatorValues.length === 0) {
      const controller = new AbortController();
      loadValues(controller.signal);
      return () => controller.abort();
    }
  }, [indicatorValues.length, loadValues]);

  useEffect(() => {
    let result = [...indicatorValues];

    if (filters?.indicatorId) {
      result = result.filter((v) => v.indicatorId === filters.indicatorId);
    }
    if (filters?.geographicId) {
      result = result.filter((v) => v.geographicId === filters.geographicId);
    }
    if (filters?.year) {
      result = result.filter((v) => v.year === filters.year);
    }
    if (filters?.indicatorId) {
      result = result.filter((v) => v.indicatorId === filters.indicatorId);
    }
    if (filters?.geographicId) {
      result = result.filter((v) => v.geographicId === filters.geographicId);
    }
    if (filters?.year) {
      result = result.filter((v) => v.year === filters.year);
    }
    if (filters?.status) {
      result = result.filter((v) => v.status === filters.status);
    }

    setFilteredValues(result);
  }, [indicatorValues, JSON.stringify(filters)]);

  const getValuesByIndicator = useCallback((indicatorId: string): IndicatorValue[] => {
    return indicatorValues.filter((v) => v.indicatorId === indicatorId);
  }, [indicatorValues]);

  const getValuesByGeographic = useCallback((geographicId: string): IndicatorValue[] => {
    return indicatorValues.filter((v) => v.geographicId === geographicId);
  }, [indicatorValues]);

  const getLatestValue = useCallback((indicatorId: string, geographicId: string): IndicatorValue | undefined => {
    return indicatorValues
      .filter((v) => v.indicatorId === indicatorId && v.geographicId === geographicId)
      .sort((a, b) => b.year - a.year)[0];
  }, [indicatorValues]);

  return {
    values: filteredValues,
    allValues: indicatorValues,
    isLoading: isLoadingValues,
    getValuesByIndicator,
    getValuesByGeographic,
    getLatestValue,
    refresh: loadValues,
  };
};

// ----- Hook pour les alertes -----

export const useAlerts = () => {
  const { alerts, unreadAlertsCount, setAlerts, markAlertAsRead } = useDataStore();

  const loadAlerts = useCallback(async (signal?: AbortSignal) => {
    try {
      const response = await workflowsService.getAlerts({ page_size: 100 }, signal);
      setAlerts(response.results);
    } catch (error) {
      if (axios.isCancel(error)) return;
      console.error('Failed to load alerts', error);
    }
  }, [setAlerts]);

  useEffect(() => {
    if (alerts.length === 0) {
      const controller = new AbortController();
      loadAlerts(controller.signal);
      return () => controller.abort();
    }
  }, [alerts.length, loadAlerts]);

  const getAlertsBySeverity = useCallback((severity: string): Alert[] => {
    return alerts.filter((a) => a.severity === severity);
  }, [alerts]);

  const getAlertsBySector = useCallback((sector: Sector): Alert[] => {
    return alerts.filter((a) => a.sector === sector);
  }, [alerts]);

  const markAsRead = useCallback(async (alertId: string) => {
    try {
      await workflowsService.markAlertAsRead(alertId);
      markAlertAsRead(alertId);
    } catch (e) {
      console.error("Failed to mark alert as read", e);
    }
  }, [markAlertAsRead]);

  const markAllAsRead = useCallback(() => {
    // This API call might not exist in bulk, so we iterate or need a new endpoint
    alerts.forEach(async (a) => {
      if (!a.isRead) {
        try {
          await workflowsService.markAlertAsRead(a.id);
          markAlertAsRead(a.id);
        } catch (e) { }
      }
    });
  }, [alerts, markAlertAsRead]);

  return {
    alerts,
    unreadAlertsCount,
    criticalAlerts: alerts.filter((a) => a.severity === 'critical' && !a.isRead),
    highAlerts: alerts.filter((a) => a.severity === 'high' && !a.isRead),
    getAlertsBySeverity,
    getAlertsBySector,
    markAsRead,
    markAllAsRead,
    refresh: loadAlerts,
  };
};

// ----- Hook pour les dashboards -----

export const useDashboards = () => {
  const { dashboards, activeDashboard, setDashboards, setActiveDashboard } = useDataStore();

  const loadDashboards = useCallback(async () => {
    try {
      const response = await dashboardsService.getDashboards();
      setDashboards(response.results);
      if (!activeDashboard && response.results.length > 0) {
        setActiveDashboard(response.results[0]);
      }
    } catch (e) {
      console.error("Failed to load dashboards", e);
    }
  }, [setDashboards, setActiveDashboard, activeDashboard]);

  useEffect(() => {
    if (dashboards.length === 0) {
      loadDashboards();
    }
  }, [dashboards.length, loadDashboards]);

  const getDashboardById = useCallback((id: string): Dashboard | undefined => {
    return dashboards.find((d) => d.id === id);
  }, [dashboards]);

  const getDashboardsBySector = useCallback((sector: Sector): Dashboard[] => {
    return dashboards.filter((d) => d.sector === sector);
  }, [dashboards]);

  const selectDashboard = useCallback((dashboard: Dashboard) => {
    setActiveDashboard(dashboard);
  }, [setActiveDashboard]);

  return {
    dashboards,
    activeDashboard,
    getDashboardById,
    getDashboardsBySector,
    selectDashboard,
    refresh: loadDashboards,
  };
};

// ----- Hook pour les structures de santé -----

export const useHealthFacilities = () => {
  const { healthFacilities, setHealthFacilities, isLoadingHealthFacilities, setLoading } = useDataStore();

  const loadFacilities = useCallback(async (signal?: AbortSignal) => {
    try {
      setLoading('isLoadingHealthFacilities', true);
      const response = await facilitiesService.getHealthFacilities({ page_size: 1000 }, signal);
      setHealthFacilities(response.results);
    } catch (e) {
      if (axios.isCancel(e)) return;
      console.error("Failed to load health facilities", e);
    } finally {
      setLoading('isLoadingHealthFacilities', false);
    }
  }, [setHealthFacilities, setLoading]);

  useEffect(() => {
    if (healthFacilities.length === 0) {
      const controller = new AbortController();
      loadFacilities(controller.signal);
      return () => controller.abort();
    }
  }, [healthFacilities.length, loadFacilities]);

  const getFacilityById = useCallback((id: string): HealthFacility | undefined => {
    return healthFacilities.find((f) => f.id === id);
  }, [healthFacilities]);

  const getFacilitiesByRegion = useCallback((regionId: string): HealthFacility[] => {
    return healthFacilities.filter((f) => f.regionId === regionId);
  }, [healthFacilities]);

  const getFacilitiesByType = useCallback((type: string): HealthFacility[] => {
    return healthFacilities.filter((f) => f.type === type);
  }, [healthFacilities]);

  return {
    facilities: healthFacilities,
    isLoading: isLoadingHealthFacilities,
    getFacilityById,
    getFacilitiesByRegion,
    getFacilitiesByType,
    refresh: loadFacilities,
  };
};

// ----- Hook pour les structures d'éducation -----

export const useEducationFacilities = () => {
  const { educationFacilities, setEducationFacilities, isLoadingEducationFacilities, setLoading } = useDataStore();

  const loadFacilities = useCallback(async (signal?: AbortSignal) => {
    try {
      setLoading('isLoadingEducationFacilities', true);
      const response = await facilitiesService.getEducationFacilities({ page_size: 1000 }, signal);
      setEducationFacilities(response.results);
    } catch (e) {
      if (axios.isCancel(e)) return;
      console.error("Failed to load education facilities", e);
    } finally {
      setLoading('isLoadingEducationFacilities', false);
    }
  }, [setEducationFacilities, setLoading]);

  useEffect(() => {
    if (educationFacilities.length === 0) {
      const controller = new AbortController();
      loadFacilities(controller.signal);
      return () => controller.abort();
    }
  }, [educationFacilities.length, loadFacilities]);

  const getFacilityById = useCallback((id: string): EducationFacility | undefined => {
    return educationFacilities.find((f) => f.id === id);
  }, [educationFacilities]);

  const getFacilitiesByRegion = useCallback((regionId: string): EducationFacility[] => {
    return educationFacilities.filter((f) => f.regionId === regionId);
  }, [educationFacilities]);

  const getFacilitiesByType = useCallback((type: string): EducationFacility[] => {
    return educationFacilities.filter((f) => f.type === type);
  }, [educationFacilities]);

  return {
    facilities: educationFacilities,
    isLoading: isLoadingEducationFacilities,
    getFacilityById,
    getFacilitiesByRegion,
    getFacilitiesByType,
    refresh: loadFacilities,
  };
};

// ----- Hook pour les utilisateurs -----

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadUsers = useCallback(async (signal?: AbortSignal) => {
    try {
      setIsLoading(true);
      const response = await authService.getUsers({ page_size: 100 }, signal);
      setUsers(response.results);
    } catch (error) {
      if (axios.isCancel(error)) return;
      console.error('Failed to load users', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (users.length === 0) {
      const controller = new AbortController();
      loadUsers(controller.signal);
      return () => controller.abort();
    }
  }, [users.length, loadUsers]);

  return { users, isLoading, refresh: loadUsers };
};

// ----- Hook pour les collectes de données -----

export const useDataCollections = (filters?: {
  sector?: Sector;
  status?: string;
}) => {
  const [collections, setCollections] = useState<DataCollection[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadCollections = useCallback(async (signal?: AbortSignal) => {
    try {
      setIsLoading(true);
      const response = await dataCollectionService.getCollections({ page_size: 100, ...filters }, signal);
      setCollections(response.results);
    } catch (error) {
      if (axios.isCancel(error)) return;
      console.error('Failed to load collections', error);
    } finally {
      setIsLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    if (collections.length === 0) {
      const controller = new AbortController();
      loadCollections(controller.signal);
      return () => controller.abort();
    }
  }, [collections.length, loadCollections]);

  return { collections, isLoading, refresh: loadCollections };
};

// ----- Hook de recherche globale -----

export const useSearch = () => {
  const searchAll = useCallback(async (query: string): Promise<{
    indicators: Indicator[];
    geographic: GeographicEntity[];
    facilities: (HealthFacility | EducationFacility)[];
  }> => {
    // TODO: Implement real backend search or use existing loaded data
    console.log('Searching for:', query);
    return {
      indicators: [],
      geographic: [],
      facilities: []
    }
  }, []);

  return { searchAll };
};
