import { OAuthClient } from '@/types';
import api from './instance';
import { MOCK_CLIENT } from './mock';

export function getClientInfo(clientId: string): Promise<OAuthClient> {
  if (process.env.NODE_ENV === 'development') {
    return Promise.resolve(MOCK_CLIENT);
  }
  return api.get(`/clients/${clientId}`).then((res) => res.data);
}
