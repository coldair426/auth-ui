import { OAuthClient, Provider, SocialAccount } from '@/types';
import api from './instance';

export function getConnections(): Promise<SocialAccount[]> {
  return api.get('/account/connections').then((res) => res.data);
}

export function connectSocial(provider: Provider): Promise<{ url: string }> {
  return api.post(`/account/connections/${provider}`).then((res) => res.data);
}

export function disconnectSocial(provider: Provider): Promise<void> {
  return api.delete(`/account/connections/${provider}`).then(() => undefined);
}

export function getClientInfo(clientId: string): Promise<OAuthClient> {
  return api.get(`/clients/${clientId}`).then((res) => res.data);
}
