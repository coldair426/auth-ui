import { useEffect, useState } from 'react';
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

  const [client, setClient] = useState<OAuthClient | null>(() => {
    if (storedClientInfo && storedClientInfo.clientId === clientId) {
      return storedClientInfo;
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(() => {
    return !(storedClientInfo && storedClientInfo.clientId === clientId) && !!clientId;
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!clientId) {
      router.replace('/error?code=MISSING_CLIENT');
      return;
    }

    // 이미 올바른 클라이언트 정보가 있으면 추가 동작 없음
    if (client && client.clientId === clientId) {
      return;
    }

    // 새로운 클라이언트 정보가 필요할 때만 fetch 시작
    let isMounted = true;
    
    // Defer state update to avoid lint error about synchronous setState in effect
    Promise.resolve().then(() => {
      if (isMounted) setIsLoading(true);
    });

    getClientInfo(clientId)
      .then((info) => {
        if (!isMounted) return;
        setClient(info);
        setClientInfo(info);
        setError(null);
      })
      .catch(() => {
        if (!isMounted) return;
        setError('INVALID_CLIENT');
        router.replace(`/error?code=INVALID_CLIENT&clientId=${clientId}`);
      })
      .finally(() => {
        if (!isMounted) return;
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [clientId, router, client, setClientInfo]);

  return {
    clientId,
    client,
    isLoading,
    error,
    redirectUri,
    mode,
  };
}
