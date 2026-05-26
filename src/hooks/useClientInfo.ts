import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { getClientInfo } from '@/lib/api/account';
import { OAuthClient, Mode } from '@/types';
import { MOCK_CLIENT_ID } from '@/lib/api/mock';

export interface UseClientInfoResult {
  clientId: string | null;
  client: OAuthClient | null;
  isLoading: boolean;
  error: string | null;
  redirectUri: string;
  mode: Mode;
}

export function useClientInfo(): UseClientInfoResult {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clientInfo: storedClientInfo, setClientInfo } = useAuthStore();

  const isDev = process.env.NODE_ENV === 'development';
  const clientId = searchParams.get('clientId') || (isDev ? MOCK_CLIENT_ID : null);
  const redirectUri = searchParams.get('redirectUri') ?? (isDev ? 'http://localhost:4000/callback' : '');
  const mode = (searchParams.get('mode') ?? 'redirect') as Mode;

  // 초기 상태: 이미 유효한 클라이언트 정보가 있으면 로딩 불필요
  const hasValidClient = !!(storedClientInfo && storedClientInfo.clientId === clientId);
  
  const [isLoading, setIsLoading] = useState(!hasValidClient && !!clientId);
  const [error, setError] = useState<string | null>(null);
  const fetchStarted = useRef(false);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    if (isDev) {
      console.log('[useClientInfo] clientId:', clientId, 'hasValidClient:', hasValidClient);
    }

    if (!clientId) {
      router.replace('/error?code=MISSING_CLIENT');
      return;
    }

    if (hasValidClient) {
      if (isLoading) setIsLoading(false);
      return;
    }

    if (fetchStarted.current) return;
    fetchStarted.current = true;

    let isMounted = true;
    setIsLoading(true);

    getClientInfo(clientId)
      .then((info) => {
        if (!isMounted) return;
        setClientInfo(info);
        setError(null);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('[useClientInfo] Fetch failed:', err);
        setError('INVALID_CLIENT');
        router.replace(`/error?code=INVALID_CLIENT&clientId=${clientId}`);
      })
      .finally(() => {
        if (!isMounted) return;
        setIsLoading(false);
        fetchStarted.current = false;
      });

    return () => {
      isMounted = false;
    };
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [clientId, router, hasValidClient, setClientInfo, isLoading, isDev]);

  return {
    clientId,
    client: storedClientInfo,
    isLoading,
    error,
    redirectUri,
    mode,
  };
}
