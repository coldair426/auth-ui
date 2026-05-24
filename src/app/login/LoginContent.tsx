'use client';

import { SocialLoginButton } from '@/components/auth/SocialLoginButton';
import { getClientInfo } from '@/lib/api/account';
import { getSocialLoginUrl } from '@/lib/api/auth';
import { useAuthStore } from '@/store/authStore';
import { Mode, OAuthClient, Provider } from '@/types';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const PROVIDERS: Provider[] = ['naver', 'kakao', 'google'];

const EASE_OUT_BACK: [number, number, number, number] = [0.34, 1.56, 0.64, 1];

export function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setClientInfo } = useAuthStore();

  const clientId = searchParams.get('clientId');
  const redirectUri = searchParams.get('redirectUri') ?? '';
  const mode = (searchParams.get('mode') ?? 'redirect') as Mode;

  const [client, setClient] = useState<OAuthClient | null>(null);
  const [loadingProvider, setLoadingProvider] = useState<Provider | null>(null);

  useEffect(() => {
    if (!clientId) {
      router.replace('/error?code=INVALID_CLIENT');
      return;
    }

    getClientInfo(clientId)
      .then((info) => {
        setClient(info);
        setClientInfo(info);
      })
      .catch(() => router.replace('/error?code=INVALID_CLIENT'));
  }, [clientId, router, setClientInfo]);

  async function handleLogin(provider: Provider) {
    if (!clientId || !client || loadingProvider) return;
    setLoadingProvider(provider);
    try {
      const { url } = await getSocialLoginUrl(provider, clientId, redirectUri, mode);
      sessionStorage.setItem('auth_clientId', clientId);
      sessionStorage.setItem('auth_redirectUri', redirectUri);
      sessionStorage.setItem('auth_mode', mode);
      window.location.assign(url);
    } catch {
      setLoadingProvider(null);
    }
  }

  if (!client) return null;

  return (
    <main className="fixed inset-0 overflow-hidden bg-gray-950">
      {/* 배경 Orb 1 — 좌상단 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 1.6 }}
        className="absolute -top-48 -left-48 w-[640px] h-[640px] rounded-full blur-[120px] pointer-events-none"
        style={{ backgroundColor: client.gradientFrom }}
      />

      {/* 배경 Orb 2 — 우하단 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 1.6, delay: 0.15 }}
        className="absolute -bottom-48 -right-48 w-[640px] h-[640px] rounded-full blur-[120px] pointer-events-none"
        style={{ backgroundColor: client.gradientTo }}
      />

      {/* 배경 Orb 3 — 우상단 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1.8, delay: 0.25 }}
        className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full blur-[100px] pointer-events-none"
        style={{ backgroundColor: client.gradientTo }}
      />

      {/* 카드 */}
      <motion.div
        initial={{ y: 72, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, delay: 0.28, ease: EASE_OUT_BACK }}
        className={[
          'absolute backdrop-blur-2xl',
          'md:bottom-8 md:left-1/2 md:-translate-x-1/2 md:w-[360px] md:rounded-2xl',
          'max-md:bottom-0 max-md:left-0 max-md:right-0 max-md:rounded-t-2xl',
        ].join(' ')}
        style={{
          backgroundColor: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <div
          className="px-6 pt-8"
          style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom))' }}
        >
          {/* 로고 링 + 프로젝트명 + 타이틀 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="flex flex-col items-center mb-7"
          >
            {/* 그라데이션 링 */}
            <div
              className="w-16 h-16 rounded-full p-[2.5px] mb-3"
              style={{
                background: `linear-gradient(135deg, ${client.gradientFrom}, ${client.gradientTo})`,
              }}
            >
              <div className="w-full h-full rounded-full bg-gray-950/70 flex items-center justify-center overflow-hidden">
                {client.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={client.logoUrl}
                    alt={client.name}
                    width={36}
                    height={36}
                    className="object-contain"
                  />
                ) : (
                  <span
                    className="text-lg font-bold"
                    style={{
                      background: `linear-gradient(135deg, ${client.gradientFrom}, ${client.gradientTo})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {client.name[0]}
                  </span>
                )}
              </div>
            </div>

            {/* 프로젝트명 */}
            <p className="text-xs text-white/40 mb-1">{client.name}</p>

            {/* 타이틀 */}
            <h1 className="text-2xl font-bold text-white">로그인</h1>
          </motion.div>

          {/* 소셜 버튼 */}
          <div className="flex flex-col gap-2.5">
            {PROVIDERS.map((provider, index) => (
              <motion.div
                key={provider}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.72 + index * 0.08, ease: 'easeOut' }}
              >
                <SocialLoginButton
                  provider={provider}
                  onClick={() => handleLogin(provider)}
                  disabled={!!loadingProvider}
                />
              </motion.div>
            ))}
          </div>

          {/* 푸터 */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 1.08 }}
            className="mt-5 text-center text-xs text-white/25"
          >
            로그인 시{' '}
            <span className="underline underline-offset-2 cursor-pointer text-white/40">이용약관</span>
            {' '}및{' '}
            <span className="underline underline-offset-2 cursor-pointer text-white/40">개인정보처리방침</span>에
            동의합니다.
          </motion.p>
        </div>
      </motion.div>
    </main>
  );
}
