import apiClient from '@/lib/api';
import type { PaginatedResponse } from '@/lib/api';
import type { AuditLog } from '@/types';

export const auditService = {
    // Logs
    async getLogs(params?: any, signal?: AbortSignal): Promise<PaginatedResponse<AuditLog>> {
        const response = await apiClient.get<PaginatedResponse<AuditLog>>('/audit/logs/', { params, signal });
        return response.data;
    },

    async getLog(id: string): Promise<AuditLog> {
        const response = await apiClient.get<AuditLog>(`/audit/logs/${id}/`);
        return response.data;
    },

    // Quality Checks
    async getQualityChecks(params?: any): Promise<any> {
        const response = await apiClient.get('/audit/quality/', { params });
        return response.data;
    },

    // Metrics
    async getSystemMetrics(params?: any): Promise<any> {
        const response = await apiClient.get('/audit/metrics/', { params });
        return response.data;
    },

    // Stats
    async getGlobalStats(params?: any): Promise<any> {
        const response = await apiClient.get('/audit/stats/', { params });
        return response.data;
    },
};
