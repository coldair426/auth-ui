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

// easeOutBack cubic-bezier
const EASE_OUT_BACK: [number, number, number, number] = [0.34, 1.56, 0.64, 1];

export default function LoginPage() {
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
      window.location.href = url;
    } catch {
      setLoadingProvider(null);
    }
  }

  if (!client) return null;

  const textColor = client.textDark ? 'text-gray-900' : 'text-white';
  const subTextColor = client.textDark ? 'text-black/40' : 'text-white/50';
  const dividerColor = client.textDark ? 'border-black/20' : 'border-white/30';

  return (
    <main className="fixed inset-0 overflow-hidden">
      {/* 배경 그라데이션 */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${client.gradientFrom}, ${client.gradientTo})`,
        }}
      />

      {/* Orb 1 - 좌상단 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.55 }}
        transition={{ duration: 1.4 }}
        className="absolute -top-40 -left-40 w-[560px] h-[560px] rounded-full blur-3xl pointer-events-none"
        style={{ backgroundColor: client.gradientFrom }}
      />

      {/* Orb 2 - 우하단 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.55 }}
        transition={{ duration: 1.4, delay: 0.1 }}
        className="absolute -bottom-40 -right-40 w-[560px] h-[560px] rounded-full blur-3xl pointer-events-none"
        style={{ backgroundColor: client.gradientTo }}
      />

      {/* Orb 3 - 중앙 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.35 }}
        transition={{ duration: 1.6, delay: 0.15 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full blur-3xl pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${client.gradientFrom}, ${client.gradientTo})`,
        }}
      />

      {/* 카드 */}
      <motion.div
        initial={{ y: 64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.52, delay: 0.28, ease: EASE_OUT_BACK }}
        className={[
          'absolute backdrop-blur-xl',
          // 데스크탑: 하단 중앙 플로팅, 4면 둥근 모서리
          'md:bottom-8 md:left-1/2 md:-translate-x-1/2 md:w-[360px] md:rounded-2xl',
          // 모바일: Bottom Sheet, 상단만 둥근 모서리
          'max-md:bottom-0 max-md:left-0 max-md:right-0 max-md:rounded-t-2xl',
        ].join(' ')}
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
        }}
      >
        <div
          className="px-6 pt-8"
          style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
        >
          {/* 로고 + 타이틀 */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="flex flex-col items-center gap-3 mb-6"
          >
            {client.logoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={client.logoUrl}
                alt={client.name}
                width={56}
                height={56}
                className="rounded-xl object-contain"
              />
            )}
            <h1 className={`text-xl font-semibold ${textColor}`}>{client.name}</h1>
          </motion.div>

          {/* 구분선 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.72 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className={`flex-1 border-t ${dividerColor}`} />
            <span className={`text-xs ${subTextColor}`}>소셜 계정으로 로그인</span>
            <div className={`flex-1 border-t ${dividerColor}`} />
          </motion.div>

          {/* 소셜 버튼 */}
          <div className="flex flex-col gap-3">
            {PROVIDERS.map((provider, index) => (
              <motion.div
                key={provider}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.81 + index * 0.09, ease: 'easeOut' }}
              >
                <SocialLoginButton
                  provider={provider}
                  textDark={client.textDark}
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
            className={`mt-5 text-center text-xs ${subTextColor}`}
          >
            로그인 시{' '}
            <span className="underline underline-offset-2 cursor-pointer">이용약관</span> 및{' '}
            <span className="underline underline-offset-2 cursor-pointer">개인정보처리방침</span>에
            동의합니다.
          </motion.p>
        </div>
      </motion.div>
    </main>
  );
}
