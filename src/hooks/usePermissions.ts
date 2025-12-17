import { useAuth } from './useAuth';

/**
 * Enum of user roles in the auto shop management system
 * admin: Full system access and management capabilities
 * mechanic: Can view and work with services, customers, and vehicles
 * secretary: Can view data and manage customer information
 */
export type UserRole = 'admin' | 'mechanic' | 'secretary';

/**
 * Permissions Object
 * Defines access control for various features based on user role
 */
export interface Permissions {
  canViewDashboard: boolean;
  canViewCustomers: boolean;
  canViewServices: boolean;
  canViewFinancials: boolean;
  canManageUsers: boolean;
  canEditCustomers: boolean;
  canEditServices: boolean;
  role: UserRole | null;
}

/**
 * usePermissions Hook
 * Determines user permissions based on their role
 * Used throughout the app to enable/disable features and UI elements
 *
 * Permissions by role:
 * - admin: Full access to all features
 * - mechanic: Can view and interact with services, customers, vehicles
 * - secretary: Can view data and manage customer information
 */
export function usePermissions(): Permissions {
  const { userProfile } = useAuth();
  const role = userProfile?.role as UserRole | null;

  /**
   * Dashboard and core view permissions
   * All roles can view dashboard and customer/service data
   */
  const canViewDashboard = role === 'admin' || role === 'mechanic' || role === 'secretary';
  const canViewCustomers = role === 'admin' || role === 'mechanic' || role === 'secretary';
  const canViewServices = role === 'admin' || role === 'mechanic' || role === 'secretary';

  /**
   * Admin-only permissions
   * Only admins can view financial data, manage users, or edit core information
   */
  const canViewFinancials = role === 'admin';
  const canManageUsers = role === 'admin';
  const canEditCustomers = role === 'admin';
  const canEditServices = role === 'admin';

  return {
    canViewDashboard,
    canViewCustomers,
    canViewServices,
    canViewFinancials,
    canManageUsers,
    canEditCustomers,
    canEditServices,
    role,
  };
}
