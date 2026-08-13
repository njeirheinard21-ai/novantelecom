import { useEffect } from 'react';
import { onTokenChanged } from '../../lib/auth';
import { useAuthStore } from '../../store/authStore';
import { Role } from '../../lib/permissions';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore(state => state.setUser);
  const setLoading = useAuthStore(state => state.setLoading);

  useEffect(() => {
    const unsubscribe = onTokenChanged(async (user) => {
      if (user) {
        try {
          const tokenResult = await user.getIdTokenResult();
          const role = (tokenResult.claims.role as Role) || 'customer';
          setUser(user, role);
        } catch (error) {
          console.error("Failed to get token result", error);
          setUser(user, 'customer');
        }
      } else {
        setUser(null, null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setLoading]);

  return <>{children}</>;
}
