export type Role = 'customer' | 'staff' | 'admin' | 'super_admin';

export type Permission = 
  | 'products:read' | 'products:write'
  | 'admin:products:read'
  | 'inventory:read' | 'inventory:adjust'
  | 'orders:read' | 'orders:update'
  | 'customers:read'
  | 'users:read' | 'users:manage'
  | 'settings:manage' | 'settings:tax';

export const PERMISSIONS: Record<Permission, Role[]> = {
  'products:read': ['customer', 'staff', 'admin', 'super_admin'],
  'admin:products:read': ['staff', 'admin', 'super_admin'],
  'products:write': ['admin', 'super_admin'],
  'inventory:read': ['staff', 'admin', 'super_admin'],
  'inventory:adjust': ['admin', 'super_admin'],
  'orders:read': ['staff', 'admin', 'super_admin'],
  'orders:update': ['staff', 'admin', 'super_admin'],
  'customers:read': ['staff', 'admin', 'super_admin'],
  'users:read': ['staff', 'admin', 'super_admin'],
  'users:manage': ['admin', 'super_admin'],
  'settings:manage': ['admin', 'super_admin'],
  'settings:tax': ['super_admin']
};

export function hasPermission(role: Role | undefined | null, permission: Permission): boolean {
  if (!role) return false;
  if (role === 'super_admin') return true;
  return PERMISSIONS[permission]?.includes(role) ?? false;
}
