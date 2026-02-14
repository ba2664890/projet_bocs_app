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
  auditService,
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
  AuditLog,
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

  const isRequestAborted = useCallback((error: unknown): boolean => {
    if (axios.isCancel(error)) {
      return true;
    }

    const axiosError = error as { code?: string; name?: string; message?: string } | null;
    const message = axiosError?.message?.toLowerCase() || '';

    return (
      axiosError?.code === 'ERR_CANCELED' ||
      axiosError?.name === 'CanceledError' ||
      message.includes('aborted') ||
      message.includes('canceled') ||
      message.includes('cancelled')
    );
  }, []);

  const fetchAllPages = useCallback(
    async (
      fetchPage: (params?: Record<string, unknown>, signal?: AbortSignal) => Promise<any>,
      initialParams: Record<string, unknown> = {},
      signal?: AbortSignal
    ) => {
      const allResults: any[] = [];
      let page = 1;
      const maxPages = 500;

      while (page <= maxPages) {
        if (signal?.aborted) {
          throw new axios.CanceledError('Request aborted');
        }

        const response = await fetchPage({ ...initialParams, page }, signal);
        const results = Array.isArray(response) ? response : (response?.results || []);
        allResults.push(...results);

        // If API is not paginated, we stop after first response
        if (Array.isArray(response)) {
          break;
        }

        if (!response?.next || results.length === 0) {
          break;
        }

        page += 1;
      }

      return allResults;
    },
    []
  );

  const loadData = useCallback(async (signal?: AbortSignal) => {
    try {
      setLoading('isLoadingRegions', true);
      const queryParams = { page_size: 1000 };
      const [regionsResult, departmentsResult, communesResult] = await Promise.allSettled([
        fetchAllPages((params, s) => geographyService.getRegions(params, s), queryParams, signal),
        fetchAllPages((params, s) => geographyService.getDepartments(params, s), queryParams, signal),
        fetchAllPages((params, s) => geographyService.getCommunes(params, s), queryParams, signal),
      ]);

      const rejectedResults = [regionsResult, departmentsResult, communesResult]
        .filter((result): result is PromiseRejectedResult => result.status === 'rejected');

      if (signal?.aborted) {
        return;
      }

      if (regionsResult.status === 'fulfilled') {
        setRegions(regionsResult.value.map((r: any) => ({ ...r, id: String(r.id) })));
      }

      if (departmentsResult.status === 'fulfilled') {
        setDepartments(departmentsResult.value.map((d: any) => ({
          ...d,
          id: String(d.id),
          parentId: d.region ? String(d.region) : undefined
        })));
      }

      if (communesResult.status === 'fulfilled') {
        setCommunes(communesResult.value.map((c: any) => ({
          ...c,
          id: String(c.id),
          parentId: c.department ? String(c.department) : undefined
        })));
      }

      rejectedResults
        .filter((result) => !isRequestAborted(result.reason))
        .forEach((result) => {
          console.error('Failed to load a geographic dataset:', result.reason);
        });
    } catch (error) {
      if (signal?.aborted && isRequestAborted(error)) return;
      console.error('Failed to load geographic data:', error);
    } finally {
      setLoading('isLoadingRegions', false);
    }
  }, [fetchAllPages, isRequestAborted, setRegions, setDepartments, setCommunes, setLoading]);

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
        id: String(v.id),
        indicatorId: v.indicatorId || v.indicator ? String(v.indicatorId || v.indicator) : undefined,
        geographicId: v.geographicId || v.region || v.department || v.commune ? String(v.geographicId || v.region || v.department || v.commune) : undefined,
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

  const markAllAsRead = useCallback(async () => {
    // Mark all unread alerts as read using Promise.all to wait for all requests
    const unreadAlerts = alerts.filter(a => !a.isRead);
    try {
      await Promise.all(
        unreadAlerts.map(a => workflowsService.markAlertAsRead(a.id))
      );
      // Update local state for all unread alerts
      unreadAlerts.forEach(a => markAlertAsRead(a.id));
    } catch (e) {
      console.error('Failed to mark all alerts as read', e);
    }
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
      const mappedResults = response.results.map((f: any) => ({
        ...f,
        id: String(f.id),
        communeId: f.commune ? String(f.commune) : String(f.communeId),
        departmentId: String(f.department_id),
        regionId: String(f.region_id),
        sector: 'health'
      }));
      setHealthFacilities(mappedResults);
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
      const mappedResults = response.results.map((f: any) => ({
        ...f,
        id: String(f.id),
        communeId: f.commune ? String(f.commune) : String(f.communeId),
        departmentId: String(f.department_id),
        regionId: String(f.region_id),
        sector: 'education'
      }));
      setEducationFacilities(mappedResults);
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
  const { indicators, regions, departments, communes, healthFacilities, educationFacilities } = useDataStore();

  const searchAll = useCallback(async (query: string): Promise<{
    indicators: Indicator[];
    geographic: GeographicEntity[];
    facilities: (HealthFacility | EducationFacility)[];
  }> => {
    if (!query || query.length < 2) {
      return { indicators: [], geographic: [], facilities: [] };
    }

    const q = query.toLowerCase();

    const filteredIndicators = indicators.filter(i =>
      i.name.toLowerCase().includes(q) ||
      i.description?.toLowerCase().includes(q) ||
      i.code.toLowerCase().includes(q)
    );

    const geoCombined = [...regions, ...departments, ...communes];
    const filteredGeographic = geoCombined.filter(g =>
      g.name.toLowerCase().includes(q) ||
      g.code.toLowerCase().includes(q)
    );

    const facCombined = [...healthFacilities, ...educationFacilities];
    const filteredFacilities = facCombined.filter(f =>
      f.name.toLowerCase().includes(q) ||
      f.code.toLowerCase().includes(q) ||
      f.type.toLowerCase().includes(q)
    );

    return {
      indicators: filteredIndicators.slice(0, 10),
      geographic: filteredGeographic.slice(0, 10),
      facilities: filteredFacilities.slice(0, 10)
    };
  }, [indicators, regions, departments, communes, healthFacilities, educationFacilities]);

  return { searchAll };
};

// ----- Hook pour l'audit et les métriques système -----

export const useAuditLogs = (filters?: {
  module?: string;
  type?: string;
  userId?: string;
  action?: string;
}) => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const loadLogs = useCallback(async (params?: any, signal?: AbortSignal) => {
    try {
      setIsLoading(true);
      const response = await auditService.getLogs({ ...filters, ...params }, signal);
      setLogs(response.results);
      setTotal(response.count);
    } catch (e) {
      if (axios.isCancel(e)) return;
      console.error("Failed to load audit logs", e);
    } finally {
      setIsLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    const controller = new AbortController();
    loadLogs({}, controller.signal);
    return () => controller.abort();
  }, [loadLogs]);

  return { logs, total, isLoading, refresh: loadLogs };
};

export const useSystemStats = () => {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadStats = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await auditService.getGlobalStats();
      setStats(data);
    } catch (e) {
      console.error("Failed to load system stats", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return { stats, isLoading, refresh: loadStats };
};
