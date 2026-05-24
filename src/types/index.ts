export type Provider = 'naver' | 'kakao' | 'google';

export type Mode = 'redirect' | 'popup';

export interface OAuthClient {
  clientId: string;
  name: string;
  logoUrl: string | null;
  gradientFrom: string;
  gradientTo: string;
  textDark: boolean;
  allowedModes: Mode[];
}

export interface LoginParams {
  clientId: string;
  redirectUri: string;
  mode: Mode;
}

export interface CallbackResponse {
  accessToken: string;
  needsJoin: boolean;
  isNewUser: boolean;
}

export interface SocialAccount {
  provider: Provider;
  connectedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  socialAccounts: SocialAccount[];
}

export interface ApiError {
  message: string;
  code: string;
}
