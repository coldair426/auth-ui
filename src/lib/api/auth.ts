import { CallbackResponse, Provider } from '@/types';
import api from './instance';
import { MOCK_AUTH } from './mock';

export function getSocialLoginUrl(
  provider: Provider,
  clientId: string,
  redirectUri: string,
): Promise<{ url: string }> {
  if (process.env.NODE_ENV === 'development') {
    return Promise.resolve({ 
      url: MOCK_AUTH.getLoginUrl(provider) 
    });
  }
  return api
    .get(`/auth/${provider}/url`, { params: { clientId, redirectUri } })
    .then((res) => res.data);
}

export function handleCallback(
  provider: Provider,
  code: string,
  state: string,
): Promise<CallbackResponse> {
  if (process.env.NODE_ENV === 'development') {
    // 로컬 테스트 시 세션 스토리지 등을 활용해 join이 필요한지 여부를 제어할 수 있습니다.
    const forceJoin = sessionStorage.getItem('dev_force_join') === 'true';
    const isNewUser = sessionStorage.getItem('dev_is_new_user') !== 'false';
    return Promise.resolve(MOCK_AUTH.getCallbackResponse(forceJoin, isNewUser));
  }
  return api
    .post(`/auth/${provider}/callback`, { code, state })
    .then((res) => res.data);
}

export function joinProject(clientId: string): Promise<void> {
  if (process.env.NODE_ENV === 'development') {
    return Promise.resolve();
  }
  return api.post('/auth/join', { clientId }).then(() => undefined);
}

export function logout(): Promise<void> {
  if (process.env.NODE_ENV === 'development') {
    return Promise.resolve();
  }
  return api.post('/auth/logout').then(() => undefined);
}

export function refreshToken(): Promise<{ accessToken: string }> {
  if (process.env.NODE_ENV === 'development') {
    return Promise.resolve({ accessToken: 'mock_refreshed_access_token' });
  }
  return api.post('/auth/refresh').then((res) => res.data);
}
