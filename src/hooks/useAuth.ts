// ============================================
// FATI - Hook d'authentification
// ============================================

import { useCallback } from 'react';
import { useAuthStore } from '@/store';
import authService from '@/services/auth';

export const useAuth = () => {
  const { user, isAuthenticated, isLoading, login: storeLogin, logout: storeLogout, updateUser, setLoading } = useAuthStore();

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);

    try {
      // Ensure any previous session is cleared to avoid sending invalid tokens
      storeLogout();

      // Call real API
      const response = await authService.login({ email, password });

      // Store authentication data
      storeLogin(response.user, response.token, response.refresh_token);

      return { success: true };
    } catch (error: any) {
      console.error('Login error:', error);

      // Handle specific error messages
      let errorMessage = 'Erreur de connexion. Veuillez réessayer.';

      if (error.response?.status === 401) {
        errorMessage = 'Identifiants invalides';
      } else if (error.response?.status === 403) {
        errorMessage = 'Compte inactif ou suspendu';
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.message) {
        errorMessage = error.message;
      }

      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [storeLogin, storeLogout, setLoading]);

  const register = useCallback(async (data: any): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);

    try {
      // Ensure any previous session is cleared
      storeLogout();

      // Call real API
      const response = await authService.register(data);

      // Store authentication data
      storeLogin(response.user, response.token, response.refresh_token);

      return { success: true };
    } catch (error: any) {
      console.error('Registration error:', error);

      let errorMessage = "Erreur lors de la création du compte. Veuillez réessayer.";

      if (error.response?.data) {
        const data = error.response.data;
        // Collect field specific errors if they exist
        const fieldErrors = Object.keys(data)
          .map(key => `${key}: ${Array.isArray(data[key]) ? data[key].join(', ') : data[key]}`)
          .join(' | ');
        if (fieldErrors) errorMessage = fieldErrors;
      }

      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [storeLogin, storeLogout, setLoading]);

  const logout = useCallback(async () => {
    try {
      // Call API to invalidate token
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local state
      storeLogout();
    }
  }, [storeLogout]);

  const refreshProfile = useCallback(async (): Promise<boolean> => {
    if (!user) return false;

    setLoading(true);

    try {
      const updatedUser = await authService.getCurrentUser();
      updateUser(updatedUser);
      return true;
    } catch (error) {
      console.error('Failed to refresh profile:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, updateUser, setLoading]);

  const hasPermission = useCallback((resource: string, action: string): boolean => {
    if (!user) return false;
    return user.permissions.some(
      (p) => p.resource === '*' || (p.resource === resource && p.actions.includes(action as any))
    );
  }, [user]);

  const hasRole = useCallback((roles: string[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  }, [user]);

  const isAdmin = useCallback((): boolean => {
    return user?.role === 'admin';
  }, [user]);

  const isInstitution = useCallback((): boolean => {
    return user?.role === 'institution';
  }, [user]);

  const isSectorUser = useCallback((): boolean => {
    return user?.role === 'sector_health' || user?.role === 'sector_education';
  }, [user]);

  const isLocalManager = useCallback((): boolean => {
    return user?.role === 'local_manager';
  }, [user]);

  const isContributor = useCallback((): boolean => {
    return user?.role === 'contributor';
  }, [user]);

  const getUserSector = useCallback((): 'health' | 'education' | null => {
    if (user?.role === 'sector_health') return 'health';
    if (user?.role === 'sector_education') return 'education';
    return null;
  }, [user]);

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshProfile,
    hasPermission,
    hasRole,
    isAdmin,
    isInstitution,
    isSectorUser,
    isLocalManager,
    isContributor,
    getUserSector,
  };
};
