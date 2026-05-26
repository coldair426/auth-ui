import api from '@/lib/api/instance';
import { MOCK_USER_CONSENTS } from '@/lib/api/mock';
import type { UserConsent, ConsentRequest } from '@/types/consent';

// 유저 동의 이력 조회
// GET /api/v1/users/{userId}/consents
export function getUserConsents(userId: number): Promise<UserConsent[]> {
  if (process.env.NODE_ENV === 'development') {
    return Promise.resolve(MOCK_USER_CONSENTS);
  }
  return api.get(`/users/${userId}/consents`).then(res => res.data);
}

// 동의 저장
// POST /api/v1/consents
export function postConsents(body: ConsentRequest): Promise<void> {
  if (process.env.NODE_ENV === 'development') {
    return Promise.resolve();
  }
  return api.post('/consents', body).then(() => undefined);
}
