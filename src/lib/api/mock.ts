import { OAuthClient, Provider, CallbackResponse } from '@/types';
import type { UserConsent } from '@/types/consent';

export const MOCK_CLIENT_ID = '77777777-7777-7777-7777-777777777777';

export const MOCK_CLIENT: OAuthClient = {
  clientId: MOCK_CLIENT_ID,
  name: '피쉬하이',
  logoUrl: '/fishhi-logo.png',
  faviconUrl: '/fishhi-favicon.png',
  gradientFrom: '#A4E1F1', // Sky Blue (Water)
  gradientTo: '#3FA9F5',   // Ocean Blue
  allowedModes: ['redirect', 'popup'],
};

export const MOCK_AUTH = {
  getLoginUrl: (provider: Provider) => {
    const params = new URLSearchParams({
      code: 'mock_auth_code_12345',
      state: 'mock_state_67890',
    });
    return `/callback/${provider}?${params.toString()}`;
  },
  
  getCallbackResponse: (needsJoin: boolean = false, isNewUser: boolean = false): CallbackResponse => ({
    accessToken: 'mock_access_token_abcde_fghij',
    needsJoin: needsJoin,
    isNewUser: isNewUser,
  }),
};

// 동의 이력 없음 (신규 유저 시뮬레이션)
export const MOCK_USER_CONSENTS: UserConsent[] = [];
