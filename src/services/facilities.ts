import apiClient from '@/lib/api';
import type { PaginatedResponse } from '@/lib/api';
import type { HealthFacility, EducationFacility, Equipment, Staff } from '@/types';

export const facilitiesService = {
    // Health Facilities
    async getHealthFacilities(params?: any, signal?: AbortSignal): Promise<PaginatedResponse<HealthFacility>> {
        const response = await apiClient.get<PaginatedResponse<HealthFacility>>('/facilities/health/', { params, signal });
        return response.data;
    },

    async getHealthFacility(id: string): Promise<HealthFacility> {
        const response = await apiClient.get<HealthFacility>(`/facilities/health/${id}/`);
        return response.data;
    },

    async createHealthFacility(data: Partial<HealthFacility>): Promise<HealthFacility> {
        const response = await apiClient.post<HealthFacility>('/facilities/health/', data);
        return response.data;
    },

    async updateHealthFacility(id: string, data: Partial<HealthFacility>): Promise<HealthFacility> {
        const response = await apiClient.patch<HealthFacility>(`/facilities/health/${id}/`, data);
        return response.data;
    },

    async deleteHealthFacility(id: string): Promise<void> {
        await apiClient.delete(`/facilities/health/${id}/`);
    },

    // Education Facilities
    async getEducationFacilities(params?: any, signal?: AbortSignal): Promise<PaginatedResponse<EducationFacility>> {
        const response = await apiClient.get<PaginatedResponse<EducationFacility>>('/facilities/education/', { params, signal });
        return response.data;
    },

    async getEducationFacility(id: string): Promise<EducationFacility> {
        const response = await apiClient.get<EducationFacility>(`/facilities/education/${id}/`);
        return response.data;
    },

    async createEducationFacility(data: Partial<EducationFacility>): Promise<EducationFacility> {
        const response = await apiClient.post<EducationFacility>('/facilities/education/', data);
        return response.data;
    },

    async updateEducationFacility(id: string, data: Partial<EducationFacility>): Promise<EducationFacility> {
        const response = await apiClient.patch<EducationFacility>(`/facilities/education/${id}/`, data);
        return response.data;
    },

    async deleteEducationFacility(id: string): Promise<void> {
        await apiClient.delete(`/facilities/education/${id}/`);
    },

    // Equipment
    async getEquipment(params?: any): Promise<PaginatedResponse<Equipment>> {
        const response = await apiClient.get<PaginatedResponse<Equipment>>('/facilities/equipment/', { params });
        return response.data;
    },

    // Staff
    async getStaff(params?: any): Promise<PaginatedResponse<Staff>> {
        const response = await apiClient.get<PaginatedResponse<Staff>>('/facilities/staff/', { params });
        return response.data;
    },
};
