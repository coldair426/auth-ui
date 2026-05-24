import { CallbackResponse, Mode, Provider } from '@/types';
import api from './instance';

export function getSocialLoginUrl(
  provider: Provider,
  clientId: string,
  redirectUri: string,
  mode: Mode,
): Promise<{ url: string }> {
  return api
    .get(`/auth/${provider}/url`, { params: { clientId, redirectUri, mode } })
    .then((res) => res.data);
}

export function handleCallback(
  provider: Provider,
  code: string,
  state: string,
): Promise<CallbackResponse> {
  return api
    .post(`/auth/${provider}/callback`, { code, state })
    .then((res) => res.data);
}

export function joinProject(clientId: string): Promise<void> {
  return api.post('/auth/join', { clientId }).then(() => undefined);
}

export function logout(): Promise<void> {
  return api.post('/auth/logout').then(() => undefined);
}

export function refreshToken(): Promise<{ accessToken: string }> {
  return api.post('/auth/refresh').then((res) => res.data);
}
