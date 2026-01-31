import apiClient from '@/lib/api';
import type { PaginatedResponse } from '@/lib/api';
import type { Dashboard, DashboardWidget } from '@/types';

export interface ReportTemplate {
    id: string;
    name: string;
    format: string;
}

export interface GeneratedReport {
    id: string;
    templateId: string;
    fileUrl: string;
    createdAt: string;
}

export const dashboardsService = {
    // Dashboards
    async getDashboards(params?: any): Promise<PaginatedResponse<Dashboard>> {
        const response = await apiClient.get<PaginatedResponse<Dashboard>>('/dashboards/dashboards/', { params });
        return response.data;
    },

    async getDashboard(id: string): Promise<Dashboard> {
        const response = await apiClient.get<Dashboard>(`/dashboards/dashboards/${id}/`);
        return response.data;
    },

    async createDashboard(data: Partial<Dashboard>): Promise<Dashboard> {
        const response = await apiClient.post<Dashboard>('/dashboards/dashboards/', data);
        return response.data;
    },

    async updateDashboard(id: string, data: Partial<Dashboard>): Promise<Dashboard> {
        const response = await apiClient.patch<Dashboard>(`/dashboards/dashboards/${id}/`, data);
        return response.data;
    },

    async deleteDashboard(id: string): Promise<void> {
        await apiClient.delete(`/dashboards/dashboards/${id}/`);
    },

    // Widgets
    async getWidgets(params?: any): Promise<PaginatedResponse<DashboardWidget>> {
        const response = await apiClient.get<PaginatedResponse<DashboardWidget>>('/dashboards/widgets/', { params });
        return response.data;
    },

    // Templates
    async getTemplates(params?: any): Promise<PaginatedResponse<ReportTemplate>> {
        const response = await apiClient.get<PaginatedResponse<ReportTemplate>>('/dashboards/templates/', { params });
        return response.data;
    },

    // Reports
    async getReports(params?: any): Promise<PaginatedResponse<GeneratedReport>> {
        const response = await apiClient.get<PaginatedResponse<GeneratedReport>>('/dashboards/reports/', { params });
        return response.data;
    },

    // Dashboard Data Aggregation
    async getDashboardData(params?: any): Promise<any> {
        const response = await apiClient.get('/dashboards/data/', { params });
        return response.data;
    },
};
