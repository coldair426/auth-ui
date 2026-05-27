export type Provider = 'naver' | 'kakao' | 'google';

export interface OAuthClient {
  clientId: string;
  name: string;
  logoUrl: string | null;
  faviconUrl: string | null;
  gradientFrom: string;
  gradientTo: string;
  textDark?: boolean;
}

export interface CallbackResponse {
  accessToken: string;
  needsJoin: boolean;
  isNewUser: boolean;
}

export interface ApiError {
  message: string;
  code: string;
}
