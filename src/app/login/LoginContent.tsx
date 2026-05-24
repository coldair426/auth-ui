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

const FALLBACK_CLIENT: OAuthClient = {
  clientId: '',
  name: 'Login',
  logoUrl: null,
  gradientFrom: '#38BDF8',
  gradientTo: '#818CF8',
  textDark: false,
  allowedModes: ['redirect', 'popup'],
};

function WarningIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

export function LoginContent() {
  const searchParams = useSearchParams();
  const { setClientInfo } = useAuthStore();

  const clientId = searchParams.get('clientId');
  const redirectUri = searchParams.get('redirectUri') ?? '';
  const mode = (searchParams.get('mode') ?? 'redirect') as Mode;

  const isInvalid = !clientId;

  const [client, setClient] = useState<OAuthClient>(FALLBACK_CLIENT);
  const [clientStatus, setClientStatus] = useState<'loading' | 'loaded' | 'error'>(
    () => (clientId ? 'loading' : 'loaded'),
  );
  const [retryKey, setRetryKey] = useState(0);
  const [loadingProvider, setLoadingProvider] = useState<Provider | null>(null);

  useEffect(() => {
    if (!clientId) return;

    getClientInfo(clientId)
      .then((info) => {
        setClient(info);
        setClientInfo(info);
        setClientStatus('loaded');
      })
      .catch(() => setClientStatus('error'));
  }, [clientId, setClientInfo, retryKey]);

  async function handleLogin(provider: Provider) {
    if (!clientId || loadingProvider) return;
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

  const from = client.gradientFrom;
  const to = client.gradientTo;
  const showCard = isInvalid || clientStatus !== 'loading';

  return (
    <main className="fixed inset-0 overflow-hidden" style={{ backgroundColor: '#e8f4ff' }}>
      {/* 배경 Orb 1 — 좌상단, 8s drift */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0, 0.65, 0.65, 0.65],
          x: [0, 30, -20, 0],
          y: [0, -25, 20, 0],
          scale: [1, 1.06, 0.97, 1],
        }}
        transition={{
          opacity: { duration: 1.4 },
          x: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
          y: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
          scale: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ backgroundColor: from, filter: 'blur(80px)' }}
      />
      {/* 배경 Orb 2 — 우하단, 10s drift */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0, 0.65, 0.65, 0.65],
          x: [0, -25, 20, 0],
          y: [0, 20, -30, 0],
          scale: [1, 1.04, 0.98, 1],
        }}
        transition={{
          opacity: { duration: 1.4, delay: 0.12 },
          x: { duration: 10, repeat: Infinity, ease: 'easeInOut' },
          y: { duration: 10, repeat: Infinity, ease: 'easeInOut' },
          scale: { duration: 10, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ backgroundColor: to, filter: 'blur(80px)' }}
      />
      {/* 배경 Orb 3 — 우상단, 7s drift */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0, 0.45, 0.45, 0.45],
          x: [0, 20, -30, 0],
          y: [0, 25, -15, 0],
          scale: [1, 1.08, 0.95, 1],
        }}
        transition={{
          opacity: { duration: 1.6, delay: 0.22 },
          x: { duration: 7, repeat: Infinity, ease: 'easeInOut' },
          y: { duration: 7, repeat: Infinity, ease: 'easeInOut' },
          scale: { duration: 7, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="absolute -top-32 -right-32 w-[460px] h-[460px] rounded-full pointer-events-none"
        style={{ backgroundColor: to, filter: 'blur(80px)' }}
      />

      {/* 카드 */}
      {showCard && (
        <div className="fixed bottom-0 left-0 right-0 flex justify-center items-end md:pb-10">
          <motion.div
            initial={{ y: 72, opacity: 0, scale: 0.92, filter: 'blur(8px)' }}
            animate={{ y: 0, opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.3 }}
            className="w-full md:w-[360px] rounded-t-3xl md:rounded-2xl backdrop-blur-2xl"
            style={{
              backgroundColor: 'rgba(255,255,255,0.55)',
              border: '1px solid rgba(255,255,255,0.7)',
            }}
          >
            <div
              className="px-6 pt-8"
              style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom))' }}
            >
              {/* ── 케이스 1: clientId 없음 ── */}
              {isInvalid ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                  className="flex flex-col items-center text-center mb-6"
                >
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                    style={{ background: 'linear-gradient(135deg, #F59E0B, #EF4444)' }}
                  >
                    <WarningIcon />
                  </div>
                  <h1 className="text-xl font-bold text-gray-900 mb-2">잘못된 접근이에요</h1>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    올바른 서비스 링크를 통해 다시 접속해주세요.
                  </p>
                </motion.div>
              ) : (
                <>
                  {/* ── 로고 링 + 타이틀 ── */}
                  <div className="flex flex-col items-center mb-5">
                    {/* 로고 링 */}
                    <motion.div
                      animate={{ scale: [0, 1.15, 1] }}
                      transition={{ duration: 0.5, delay: 0.7, times: [0, 0.7, 1] }}
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mb-3 overflow-hidden relative"
                      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
                    >
                      {/* 회전하는 그라디언트 오버레이 */}
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                        className="absolute inset-[-50%] pointer-events-none"
                        style={{
                          background: `conic-gradient(from 0deg, transparent 60%, rgba(255,255,255,0.25) 80%, transparent 100%)`,
                        }}
                      />
                      {clientStatus === 'error' ? (
                        <LockIcon />
                      ) : client.logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={client.logoUrl} alt={client.name} width={36} height={36} className="object-contain relative z-10" />
                      ) : (
                        <span className="text-white text-xl font-bold relative z-10">{client.name[0]}</span>
                      )}
                    </motion.div>

                    {/* 프로젝트명 */}
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.85 }}
                      className="text-xs text-black/40 mb-1"
                    >
                      {clientStatus === 'error' ? '서비스' : client.name}
                    </motion.p>

                    {/* 타이틀 */}
                    <motion.h1
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.9 }}
                      className="text-2xl font-bold text-gray-900"
                    >
                      {clientStatus === 'error' ? '서비스 로그인' : '로그인'}
                    </motion.h1>
                  </div>

                  {/* ── 케이스 2: API 실패 안내 + 재시도 ── */}
                  {clientStatus === 'error' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 1.0 }}
                      className="mb-4 px-1"
                    >
                      <p className="text-xs text-center text-gray-500 mb-3">
                        서비스 정보를 불러오지 못했어요.
                        <br />
                        잠시 후 다시 시도해주세요.
                      </p>
                      <button
                        onClick={() => setRetryKey((k) => k + 1)}
                        className="w-full h-9 rounded-xl text-sm font-medium text-gray-600 transition-colors cursor-pointer hover:bg-black/[0.06]"
                        style={{
                          backgroundColor: 'rgba(0,0,0,0.04)',
                          border: '1px solid rgba(0,0,0,0.08)',
                        }}
                      >
                        다시 시도
                      </button>
                    </motion.div>
                  )}

                  {/* ── 케이스 3: 소셜 버튼 + 푸터 ── */}
                  {clientStatus === 'loaded' && (
                    <>
                      {/* 구분선 */}
                      <motion.div
                        initial={{ opacity: 0, scaleX: 0 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        transition={{ duration: 0.3, delay: 0.95 }}
                        className="h-px bg-black/[0.06] mb-4 origin-left"
                      />

                      {/* 소셜 버튼 */}
                      <div className="flex flex-col gap-2.5">
                        {PROVIDERS.map((provider, index) => (
                          <motion.div
                            key={provider}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              duration: 0.35,
                              delay: 1.05 + index * 0.1,
                              ease: 'easeOut',
                            }}
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
                        transition={{ duration: 0.3, delay: 1.4 }}
                        className="mt-5 text-center text-xs text-black/30"
                      >
                        로그인 시{' '}
                        <span className="underline underline-offset-2 cursor-pointer text-black/50">이용약관</span>
                        {' '}및{' '}
                        <span className="underline underline-offset-2 cursor-pointer text-black/50">개인정보처리방침</span>에
                        동의합니다.
                      </motion.p>
                    </>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </main>
  );
}
