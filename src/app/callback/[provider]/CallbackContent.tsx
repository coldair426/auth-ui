'use client';

import { handleCallback } from '@/lib/api/auth';
import { useAuthStore } from '@/store/authStore';
import { Mode, Provider } from '@/types';
import { motion } from 'framer-motion';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { MOCK_CLIENT_ID } from '@/lib/api/mock';

export function CallbackContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setAccessToken } = useAuthStore();

  const provider = params.provider as Provider;
  const code = searchParams.get('code') ?? '';
  const state = searchParams.get('state') ?? '';

  const isDev = process.env.NODE_ENV === 'development';

  useEffect(() => {
    if (!code || !state) {
      router.replace('/error?code=INVALID_CALLBACK');
      return;
    }

    const clientId = sessionStorage.getItem('auth_clientId') || (isDev ? MOCK_CLIENT_ID : '');
    const redirectUri = sessionStorage.getItem('auth_redirectUri') ?? (isDev ? 'http://localhost:4000/callback' : '');
    const mode = (sessionStorage.getItem('auth_mode') ?? 'redirect') as Mode;

    handleCallback(provider, code, state)
      .then(({ accessToken, needsJoin }) => {
        setAccessToken(accessToken);

        if (needsJoin) {
          const joinParams = new URLSearchParams({ clientId, redirectUri, mode });
          router.replace(`/join?${joinParams.toString()}`);
          return;
        }

        if (mode === 'popup') {
          const targetOrigin = redirectUri ? new URL(redirectUri).origin : '*';
          window.opener?.postMessage({ type: 'AUTH_SUCCESS', accessToken }, targetOrigin);
          window.close();
          return;
        }

        window.location.assign(redirectUri);
      })
      .catch(() => router.replace('/error?code=CALLBACK_FAILED'))
      .finally(() => {
        sessionStorage.removeItem('auth_clientId');
        sessionStorage.removeItem('auth_redirectUri');
        sessionStorage.removeItem('auth_mode');
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="fixed inset-0 flex flex-col items-center justify-center bg-gray-950">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center gap-5"
      >
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-white/10" />
          <div className="absolute inset-0 rounded-full border-2 border-t-white border-r-transparent border-b-transparent border-l-transparent animate-spin" />
        </div>
        <p className="text-sm text-white/50">로그인 처리 중...</p>
      </motion.div>
    </main>
  );
}
