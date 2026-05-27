import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { getClientInfo } from '@/lib/api/account';
import { OAuthClient } from '@/types';
import { MOCK_CLIENT_ID } from '@/lib/api/mock';

export interface UseClientInfoResult {
  clientId: string | null;
  client: OAuthClient | null;
  isLoading: boolean;
  error: string | null;
  redirectUri: string;
}

export function useClientInfo(): UseClientInfoResult {
  const router = useRouter();
  const searchParams = useSearchParams();
  const storedClientInfo = useAuthStore((s) => s.clientInfo);
  const setClientInfo = useAuthStore((s) => s.setClientInfo);

  const isDev = process.env.NODE_ENV === 'development';
  const clientId = searchParams.get('clientId') || (isDev ? MOCK_CLIENT_ID : null);
  const redirectUri = searchParams.get('redirectUri') ?? (isDev ? 'http://localhost:4000/callback' : '');

  const hasValidClient = !!(storedClientInfo && storedClientInfo.clientId === clientId);

  const [isLoading, setIsLoading] = useState(!hasValidClient && !!clientId);
  const [error, setError] = useState<string | null>(null);
  const fetchedClientId = useRef<string | null>(null);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    if (!clientId) {
      router.replace('/error?code=MISSING_CLIENT');
      return;
    }

    if (hasValidClient) {
      setIsLoading(false);
      return;
    }

    if (fetchedClientId.current === clientId) return;
    fetchedClientId.current = clientId;

    let isMounted = true;
    setIsLoading(true);

    getClientInfo(clientId)
      .then((info) => {
        if (!isMounted) return;

        setClientInfo(info);
        setError(null);
        setIsLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('[useClientInfo] Fetch failed:', err);
        setError('INVALID_CLIENT');
        fetchedClientId.current = null;
        router.replace(`/error?code=INVALID_CLIENT&clientId=${clientId}`);
      });

    return () => {
      isMounted = false;
    };
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [clientId, hasValidClient, router, setClientInfo]);

  return {
    clientId,
    client: storedClientInfo,
    isLoading,
    error,
    redirectUri,
  };
}
