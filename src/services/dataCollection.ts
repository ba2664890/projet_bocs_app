import apiClient from '@/lib/api';
import type { PaginatedResponse } from '@/lib/api';
import type { DataCollection } from '@/types';

// Assuming basic types for Submission and FormTemplate if not yet defined
export interface DataSubmission {
    id: string;
    collectionId: string;
    data: Record<string, any>;
    status: string;
    submittedBy: string;
    submittedAt: string;
}

export interface FormTemplate {
    id: string;
    name: string;
    schema: Record<string, any>;
    createdAt: string;
}

export const dataCollectionService = {
    // Collections
    async getCollections(params?: any, signal?: AbortSignal): Promise<PaginatedResponse<DataCollection>> {
        const response = await apiClient.get<PaginatedResponse<DataCollection>>('/collections/collections/', { params, signal });
        return response.data;
    },

    async getCollection(id: string): Promise<DataCollection> {
        const response = await apiClient.get<DataCollection>(`/collections/collections/${id}/`);
        return response.data;
    },

    async createCollection(data: Partial<DataCollection>): Promise<DataCollection> {
        const response = await apiClient.post<DataCollection>('/collections/collections/', data);
        return response.data;
    },

    async updateCollection(id: string, data: Partial<DataCollection>): Promise<DataCollection> {
        const response = await apiClient.patch<DataCollection>(`/collections/collections/${id}/`, data);
        return response.data;
    },

    async deleteCollection(id: string): Promise<void> {
        await apiClient.delete(`/collections/collections/${id}/`);
    },

    // Submissions
    async getSubmissions(params?: any, signal?: AbortSignal): Promise<PaginatedResponse<DataSubmission>> {
        const response = await apiClient.get<PaginatedResponse<DataSubmission>>('/collections/submissions/', { params, signal });
        return response.data;
    },

    async getSubmission(id: string): Promise<DataSubmission> {
        const response = await apiClient.get<DataSubmission>(`/collections/submissions/${id}/`);
        return response.data;
    },

    async createSubmission(data: Partial<DataSubmission>): Promise<DataSubmission> {
        const response = await apiClient.post<DataSubmission>('/collections/submissions/', data);
        return response.data;
    },

    // Forms
    async getForms(params?: any): Promise<PaginatedResponse<FormTemplate>> {
        const response = await apiClient.get<PaginatedResponse<FormTemplate>>('/collections/forms/', { params });
        return response.data;
    },
};
