import apiClient from '@/lib/api';
import type { PaginatedResponse } from '@/lib/api';
import type { WorkflowInstance, Alert } from '@/types';

export interface WorkflowDefinition {
    id: string;
    name: string;
    description?: string;
    steps: any[];
    isActive: boolean;
}

export const workflowsService = {
    // Definitions
    async getDefinitions(params?: any, signal?: AbortSignal): Promise<PaginatedResponse<WorkflowDefinition>> {
        const response = await apiClient.get<PaginatedResponse<WorkflowDefinition>>('/workflows/definitions/', { params, signal });
        return response.data;
    },

    async getDefinition(id: string): Promise<WorkflowDefinition> {
        const response = await apiClient.get<WorkflowDefinition>(`/workflows/definitions/${id}/`);
        return response.data;
    },

    // Instances
    async getInstances(params?: any, signal?: AbortSignal): Promise<PaginatedResponse<WorkflowInstance>> {
        const response = await apiClient.get<PaginatedResponse<WorkflowInstance>>('/workflows/instances/', { params, signal });
        return response.data;
    },

    async getInstance(id: string): Promise<WorkflowInstance> {
        const response = await apiClient.get<WorkflowInstance>(`/workflows/instances/${id}/`);
        return response.data;
    },

    // Alerts
    async getAlerts(params?: any, signal?: AbortSignal): Promise<PaginatedResponse<Alert>> {
        const response = await apiClient.get<PaginatedResponse<Alert>>('/workflows/alerts/', { params, signal });
        return response.data;
    },

    async getAlert(id: string): Promise<Alert> {
        const response = await apiClient.get<Alert>(`/workflows/alerts/${id}/`);
        return response.data;
    },

    async markAlertAsRead(id: string): Promise<Alert> {
        // Assuming a custom action, usually POST or PATCH
        const response = await apiClient.post<Alert>(`/workflows/alerts/${id}/mark_read/`);
        return response.data;
    },
};
