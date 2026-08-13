import { create } from 'zustand';
import { Role } from '../lib/permissions';

interface AuthState {
  user: any | null;
  role: Role | null;
  isLoading: boolean;
  setUser: (user: any | null, role: Role | null) => void;
  setLoading: (isLoading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: null,
  isLoading: true,
  setUser: (user, role) => set({ user, role }),
  setLoading: (isLoading) => set({ isLoading }),
}));
