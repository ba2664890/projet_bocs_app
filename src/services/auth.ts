// ============================================
// FATI - Authentication Service
// ============================================

import axios from 'axios';
import apiClient from '@/lib/api';
import type { PaginatedResponse } from '@/lib/api';
import type { User } from '@/types';

// Login credentials
export interface LoginCredentials {
    email: string;
    password: string;
}

// Login response
export interface LoginResponse {
    token: string;
    // refresh_token is not returned by backend Token authentication
    refresh_token?: string;
    user: User;
}

// Auth service
export const authService = {
    /**
     * Login user with email and password
     */
    async login(credentials: LoginCredentials): Promise<LoginResponse> {
        // Backend maps UserViewSet to /users/, so login action is at /users/login/
        const response = await apiClient.post<LoginResponse>('/auth/users/login/', credentials);
        return response.data;
    },

    /**
     * Register new user
     */
    async register(data: any): Promise<LoginResponse> {
        // registration action is at /users/register/
        const response = await apiClient.post<LoginResponse>('/auth/users/register/', data);
        return response.data;
    },

    /**
     * Logout current user
     */
    async logout(): Promise<void> {
        try {
            await apiClient.post('/auth/users/logout/');
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 401) return;
            console.error('Logout error:', error);
        }
    },

    /**
     * Get current user profile
     */
    async getCurrentUser(): Promise<User> {
        const response = await apiClient.get<User>('/auth/users/me/');
        return response.data;
    },

    /**
     * Refresh authentication token
     * Note: Standard Token Auth doesn't support refresh like JWT. 
     * This might fail or needs backend support if used.
     */
    async refreshToken(refreshToken: string): Promise<{ access: string }> {
        // Keeping as-is for now but might need adjustment or backend support
        const response = await apiClient.post<{ access: string }>('/auth/token/refresh/', {
            refresh: refreshToken,
        });
        return response.data;
    },

    /**
     * Update user profile
     * Note: Backend 'me' endpoint currently only supports GET. 
     * Update might fail if backend 'me' doesn't handle PATCH.
     */
    async updateProfile(data: Partial<User>): Promise<User> {
        const response = await apiClient.patch<User>('/auth/users/me/', data);
        return response.data;
    },

    /**
     * Change password
     */
    async changePassword(oldPassword: string, newPassword: string): Promise<void> {
        // Backend action name is change_password (snake_case default)
        await apiClient.post('/auth/users/change_password/', {
            old_password: oldPassword,
            new_password: newPassword,
        });
    },

    /**
     * Get all users (admin only)
     */
    async getUsers(params?: any, signal?: AbortSignal): Promise<PaginatedResponse<User>> {
        const response = await apiClient.get<PaginatedResponse<User>>('/auth/users/', { params, signal });
        return response.data;
    },

    /**
     * Request password reset
     */
    async requestPasswordReset(email: string): Promise<void> {
        await apiClient.post('/auth/password-reset/', { email });
    },

    /**
     * Reset password with token
     */
    async resetPassword(token: string, newPassword: string): Promise<void> {
        await apiClient.post('/auth/password-reset/confirm/', {
            token,
            password: newPassword,
        });
    },
};

export default authService;
