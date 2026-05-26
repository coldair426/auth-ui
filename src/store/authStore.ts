import { OAuthClient } from '@/types';
import { create } from 'zustand';

interface AuthState {
  accessToken: string | null;
  clientInfo: OAuthClient | null;
  setAccessToken: (token: string) => void;
  setClientInfo: (info: OAuthClient) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  clientInfo: null,
  setAccessToken: (token) => set({ accessToken: token }),
  setClientInfo: (info) => set({ clientInfo: info }),
  clearAuth: () => set({ accessToken: null, clientInfo: null }),
}));
