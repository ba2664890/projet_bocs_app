import apiClient from '@/lib/api';
import type { PaginatedResponse } from '@/lib/api';
import type { Indicator, IndicatorValue } from '@/types';

export const indicatorsService = {
    // Indicators
    async getIndicators(params?: any, signal?: AbortSignal): Promise<PaginatedResponse<Indicator>> {
        const response = await apiClient.get<PaginatedResponse<Indicator>>('/indicators/indicators/', { params, signal });
        return response.data;
    },

    async getIndicator(id: string): Promise<Indicator> {
        const response = await apiClient.get<Indicator>(`/indicators/indicators/${id}/`);
        return response.data;
    },

    async createIndicator(data: Partial<Indicator>): Promise<Indicator> {
        const response = await apiClient.post<Indicator>('/indicators/indicators/', data);
        return response.data;
    },

    async updateIndicator(id: string, data: Partial<Indicator>): Promise<Indicator> {
        const response = await apiClient.patch<Indicator>(`/indicators/indicators/${id}/`, data);
        return response.data;
    },

    async deleteIndicator(id: string): Promise<void> {
        await apiClient.delete(`/indicators/indicators/${id}/`);
    },

    // Indicator Values
    async getIndicatorValues(params?: any, signal?: AbortSignal): Promise<PaginatedResponse<IndicatorValue>> {
        const response = await apiClient.get<PaginatedResponse<IndicatorValue>>('/indicators/values/', { params, signal });
        return response.data;
    },

    async getIndicatorValue(id: string): Promise<IndicatorValue> {
        const response = await apiClient.get<IndicatorValue>(`/indicators/values/${id}/`);
        return response.data;
    },

    async createIndicatorValue(data: Partial<IndicatorValue>): Promise<IndicatorValue> {
        const response = await apiClient.post<IndicatorValue>('/indicators/values/', data);
        return response.data;
    },

    async updateIndicatorValue(id: string, data: Partial<IndicatorValue>): Promise<IndicatorValue> {
        const response = await apiClient.patch<IndicatorValue>(`/indicators/values/${id}/`, data);
        return response.data;
    },

    async deleteIndicatorValue(id: string): Promise<void> {
        await apiClient.delete(`/indicators/values/${id}/`);
    },
};
