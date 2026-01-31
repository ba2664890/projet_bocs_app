import apiClient from '@/lib/api';
import type { PaginatedResponse } from '@/lib/api';
import type { Region, Department, Commune, GeographicEntity } from '@/types';

export const geographyService = {
    // Regions
    async getRegions(params?: any, signal?: AbortSignal): Promise<PaginatedResponse<GeographicEntity>> {
        const response = await apiClient.get<PaginatedResponse<GeographicEntity>>('/geography/regions/', { params, signal });
        return response.data;
    },

    async getRegion(id: string): Promise<Region> {
        const response = await apiClient.get<Region>(`/geography/regions/${id}/`);
        return response.data;
    },

    // Departments
    async getDepartments(params?: any, signal?: AbortSignal): Promise<PaginatedResponse<GeographicEntity>> {
        const response = await apiClient.get<PaginatedResponse<GeographicEntity>>('/geography/departments/', { params, signal });
        return response.data;
    },

    async getDepartment(id: string): Promise<Department> {
        const response = await apiClient.get<Department>(`/geography/departments/${id}/`);
        return response.data;
    },

    // Communes
    async getCommunes(params?: any, signal?: AbortSignal): Promise<PaginatedResponse<GeographicEntity>> {
        const response = await apiClient.get<PaginatedResponse<GeographicEntity>>('/geography/communes/', { params, signal });
        return response.data;
    },

    async getCommune(id: string): Promise<Commune> {
        const response = await apiClient.get<Commune>(`/geography/communes/${id}/`);
        return response.data;
    },
};
