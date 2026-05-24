import { OAuthClient, User } from '@/types';
import { create } from 'zustand';

interface AuthState {
  accessToken: string | null;
  user: User | null;
  clientInfo: OAuthClient | null;
  setAccessToken: (token: string) => void;
  setUser: (user: User) => void;
  setClientInfo: (info: OAuthClient) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  clientInfo: null,
  setAccessToken: (token) => set({ accessToken: token }),
  setUser: (user) => set({ user }),
  setClientInfo: (info) => set({ clientInfo: info }),
  clearAuth: () => set({ accessToken: null, user: null, clientInfo: null }),
}));
