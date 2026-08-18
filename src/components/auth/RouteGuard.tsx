import { useTranslation } from 'react-i18next';
import { Navigate, useLocation } from 'react-router';
import { useAuthStore } from '../../store/authStore';
import { Role, hasPermission, Permission } from '../../lib/permissions';

interface RouteGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireRole?: Role[];
  requirePermission?: Permission;
}

export function RouteGuard({ children, requireAuth, requireRole, requirePermission }: RouteGuardProps) {
  const { t } = useTranslation();

  const user = useAuthStore(state => state.user);
  const role = useAuthStore(state => state.role);
  const isLoading = useAuthStore(state => state.isLoading);
  const location = useLocation();

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">{t('loading')}</div>;
  }

  if (requireAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireRole && role && !requireRole.includes(role)) {
    return <Navigate to="/" replace />;
  }

  if (requirePermission && !hasPermission(role, requirePermission)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
