import { useAuth } from './useAuth';

export type UserRole = 'admin' | 'mechanic' | 'secretary';

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

export function usePermissions(): Permissions {
  const { userProfile } = useAuth();
  const role = userProfile?.role as UserRole | null;

  const canViewDashboard = role === 'admin' || role === 'mechanic' || role === 'secretary';
  const canViewCustomers = role === 'admin' || role === 'mechanic' || role === 'secretary';
  const canViewServices = role === 'admin' || role === 'mechanic' || role === 'secretary';
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
