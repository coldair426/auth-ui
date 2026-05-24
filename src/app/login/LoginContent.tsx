'use client';

import { SocialLoginButton } from '@/components/auth/SocialLoginButton';
import { getClientInfo } from '@/lib/api/account';
import { getSocialLoginUrl } from '@/lib/api/auth';
import { useAuthStore } from '@/store/authStore';
import { Mode, OAuthClient, Provider } from '@/types';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const PROVIDERS: Provider[] = ['naver', 'kakao', 'google'];

const EASE_OUT_BACK: [number, number, number, number] = [0.34, 1.56, 0.64, 1];

const FALLBACK_CLIENT: OAuthClient = {
  clientId: '',
  name: 'Login',
  logoUrl: null,
  gradientFrom: '#38BDF8',
  gradientTo: '#818CF8',
  textDark: false,
  allowedModes: ['redirect', 'popup'],
};

export function LoginContent() {
  const searchParams = useSearchParams();
  const { setClientInfo } = useAuthStore();

  const clientId = searchParams.get('clientId');
  const redirectUri = searchParams.get('redirectUri') ?? '';
  const mode = (searchParams.get('mode') ?? 'redirect') as Mode;

  // fallback을 초기값으로, API 성공 시 업데이트
  const [client, setClient] = useState<OAuthClient>(FALLBACK_CLIENT);
  const [loadingProvider, setLoadingProvider] = useState<Provider | null>(null);

  useEffect(() => {
    if (!clientId) return;

    getClientInfo(clientId)
      .then((info) => {
        setClient(info);
        setClientInfo(info);
      })
      .catch(() => {});
  }, [clientId, setClientInfo]);

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

  const from = client?.gradientFrom ?? FALLBACK_CLIENT.gradientFrom;
  const to = client?.gradientTo ?? FALLBACK_CLIENT.gradientTo;

  return (
    <main className="fixed inset-0 overflow-hidden" style={{ backgroundColor: '#e8f4ff' }}>
      {/* 배경 Orb 1 — 좌상단 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.65 }}
        transition={{ duration: 1.4 }}
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ backgroundColor: from, filter: 'blur(80px)' }}
      />

      {/* 배경 Orb 2 — 우하단 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.65 }}
        transition={{ duration: 1.4, delay: 0.12 }}
        className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ backgroundColor: to, filter: 'blur(80px)' }}
      />

      {/* 배경 Orb 3 — 우상단 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.45 }}
        transition={{ duration: 1.6, delay: 0.22 }}
        className="absolute -top-32 -right-32 w-[460px] h-[460px] rounded-full pointer-events-none"
        style={{ backgroundColor: to, filter: 'blur(80px)' }}
      />

      {/* 카드 */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-center items-end md:pb-10">
          <motion.div
            initial={{ y: 72, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.55, ease: EASE_OUT_BACK }}
            className="w-full md:w-[360px] rounded-t-3xl md:rounded-2xl backdrop-blur-2xl"
            style={{
              backgroundColor: 'rgba(255,255,255,0.25)',
              border: '1px solid rgba(255,255,255,0.4)',
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
                transition={{ duration: 0.4, delay: 0.3 }}
                className="flex flex-col items-center mb-7"
              >
                {/* 그라데이션 링 */}
                <div
                  className="w-16 h-16 rounded-full p-[2.5px] mb-3"
                  style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
                >
                  <div className="w-full h-full rounded-full bg-white/60 flex items-center justify-center overflow-hidden backdrop-blur-sm">
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
                          background: `linear-gradient(135deg, ${from}, ${to})`,
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
                <p className="text-xs text-black/40 mb-1">{client.name}</p>

                {/* 타이틀 */}
                <h1 className="text-2xl font-bold text-gray-900">로그인</h1>
              </motion.div>

              {/* 소셜 버튼 */}
              <div className="flex flex-col gap-2.5">
                {PROVIDERS.map((provider, index) => (
                  <motion.div
                    key={provider}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.44 + index * 0.08, ease: 'easeOut' }}
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
                transition={{ duration: 0.3, delay: 0.8 }}
                className="mt-5 text-center text-xs text-black/30"
              >
                로그인 시{' '}
                <span className="underline underline-offset-2 cursor-pointer text-black/50">이용약관</span>
                {' '}및{' '}
                <span className="underline underline-offset-2 cursor-pointer text-black/50">개인정보처리방침</span>에
                동의합니다.
              </motion.p>
            </div>
          </motion.div>
        </div>
    </main>
  );
}
