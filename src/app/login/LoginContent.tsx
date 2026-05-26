'use client';

import { SocialLoginButton } from '@/components/auth/SocialLoginButton';
import { ClientLogo } from '@/components/ui/ClientLogo';
import { PageLayout } from '@/components/ui/PageLayout';
import { getClientInfo } from '@/lib/api/account';
import { getSocialLoginUrl } from '@/lib/api/auth';
import { useAuthStore } from '@/store/authStore';
import { Mode, OAuthClient, Provider } from '@/types';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const PROVIDERS: Provider[] = ['naver', 'kakao', 'google'];

const FALLBACK_CLIENT: OAuthClient = {
  clientId: '',
  name: '피쉬하이',
  logoUrl: '/fishhi-logo.png',
  faviconUrl: '/fishhi-favicon.png',
  gradientFrom: '#A4E1F1',
  gradientTo: '#3FA9F5',
  allowedModes: ['redirect', 'popup'],
};

function WarningIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

import { MOCK_CLIENT_ID } from '@/lib/api/mock';

export function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setClientInfo } = useAuthStore();

  const isDev = process.env.NODE_ENV === 'development';
  const clientId = searchParams.get('clientId') || (isDev ? MOCK_CLIENT_ID : null);
  const redirectUri = searchParams.get('redirectUri') ?? (isDev ? 'http://localhost:4000/callback' : '');
  const mode = (searchParams.get('mode') ?? 'redirect') as Mode;

  const isInvalid = !clientId;

  const [client, setClient] = useState<OAuthClient>(FALLBACK_CLIENT);
  const [clientStatus, setClientStatus] = useState<'loading' | 'loaded' | 'error'>(
    () => (clientId ? 'loading' : 'loaded'),
  );

  const [retryKey, setRetryKey] = useState(0);
  const [loadingProvider, setLoadingProvider] = useState<Provider | null>(null);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (!clientId) return;

    getClientInfo(clientId)
      .then((info) => {
        setClient(info);
        setClientInfo(info);
        setClientStatus('loaded');
      })
      .catch(() => {
        setClientStatus('error');
      });
  }, [clientId, setClientInfo, retryKey]);

  async function handleLogin(provider: Provider) {
    if (!clientId || loadingProvider || isExiting) return;
    setLoadingProvider(provider);
    try {
      const { url } = await getSocialLoginUrl(provider, clientId, redirectUri, mode);
      sessionStorage.setItem('auth_clientId', clientId);
      sessionStorage.setItem('auth_redirectUri', redirectUri);
      sessionStorage.setItem('auth_mode', mode);
      
      setIsExiting(true);
      setTimeout(() => {
        window.location.assign(url);
      }, 400);
    } catch {
      setLoadingProvider(null);
      router.push(`/error?code=LOGIN_FAILED&clientId=${clientId}`);
    }
  }

  return (
    <PageLayout
      isExiting={isExiting}
      isLoading={clientStatus === 'loading'}
      isInvalid={isInvalid}
      from={client.gradientFrom}
      to={client.gradientTo}
      width={400}
    >
      {/* ── 로딩 상태 (Skeleton UI: 인지 부하 최소화) ── */}
      {clientStatus === 'loading' && !isInvalid && (
        <div className="flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0.5 }}
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-16 h-16 rounded-[22px] bg-black/[0.06] dark:bg-white/[0.06] mb-6" 
          />
          <div className="space-y-3 w-full flex flex-col items-center mb-8">
            <div className="h-4 w-24 bg-black/[0.04] dark:bg-white/[0.04] rounded-full" />
            <div className="h-8 w-40 bg-black/[0.06] dark:bg-white/[0.06] rounded-xl" />
          </div>
          <div className="flex flex-col gap-3 w-full">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-full h-14 rounded-2xl bg-black/[0.03] dark:bg-white/[0.03] relative overflow-hidden">
                <motion.div 
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 에러 상태 ── */}
      {clientStatus === 'error' && !isInvalid && (
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-[22px] bg-red-500/10 flex items-center justify-center mb-4 text-red-500">
            <LockIcon />
          </div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-zinc-100 tracking-tight mb-6">연결 오류</h1>
          <div className="bg-red-50/60 dark:bg-red-500/5 backdrop-blur-sm rounded-2xl p-5 mb-6 border border-red-100/50 dark:border-red-500/10 w-full">
            <p className="text-[14px] text-center text-red-700/80 dark:text-red-400/80 font-semibold leading-relaxed">
              서비스 정보를 불러오지 못했어요.<br />
              통신 상태를 확인해주세요.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: 'var(--btn-hover)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setRetryKey((k) => k + 1)}
            className="w-full h-14 bg-gray-900 dark:bg-zinc-100 text-white dark:text-black rounded-2xl text-[15px] font-bold tracking-tight shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2.5"
            style={{ '--btn-hover': '#1f2937' } as any}
            aria-label="데이터 로드 재시도"
          >
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 4v6h-6" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
              </svg>
            </motion.div>
            다시 시도하기
          </motion.button>
        </div>
      )}

      {/* ── 케이스 1: clientId 없음 ── */}
      {isInvalid && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center py-4"
        >
          <div className="w-20 h-20 rounded-[24px] bg-amber-500 flex items-center justify-center mb-6 shadow-lg shadow-amber-500/20 text-white">
            <WarningIcon />
          </div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-zinc-100 tracking-tight mb-3">서비스 연결이 필요해요</h1>
          <p className="text-[15px] text-gray-500 dark:text-zinc-400 leading-relaxed max-w-[240px] mb-8 font-medium">
            올바른 서비스 링크를 통해<br />다시 접속해주시겠어요?
          </p>
          <motion.button 
            whileHover={{ scale: 1.02, backgroundColor: '#1f2937' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => window.history.back()}
            className="w-full h-14 bg-gray-900 dark:bg-zinc-100 text-white dark:text-black rounded-2xl text-[15px] font-bold tracking-tight shadow-md transition-all cursor-pointer flex items-center justify-center"
            aria-label="이전 페이지로 돌아가기"
          >
            이전 페이지로 돌아가기
          </motion.button>
        </motion.div>
      )}

      {/* ── 정상 상태 ── */}
      {clientStatus === 'loaded' && !isInvalid && (
        <>
          <div className="flex flex-col items-center mb-8">
            <ClientLogo 
              logoUrl={client.logoUrl} 
              name={client.name} 
              gradientFrom={client.gradientFrom} 
              gradientTo={client.gradientTo}
              size={112}
              className="mb-2"
            />
            <motion.h1 
              initial={{ opacity: 0, y: 8 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5, delay: 0.9 }} 
              className="text-[28px] font-extrabold text-gray-900 dark:text-white tracking-tight text-center"
            >
              {client.name}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.0 }}
              className="text-[14px] font-semibold text-black/40 dark:text-zinc-400 mt-1"
            >
              빵돌이 통합 계정으로 로그인
            </motion.p>
          </div>
          
          <div className="flex flex-col gap-3 mb-8">
            {PROVIDERS.map((provider, index) => (
              <motion.div key={provider} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 1.1 + index * 0.08 }}>
                <SocialLoginButton provider={provider} onClick={() => handleLogin(provider)} disabled={!!loadingProvider} isLoading={loadingProvider === provider} isDimmed={!!loadingProvider && loadingProvider !== provider} />
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.4, delay: 1.5 }} 
            className="text-center text-[11px] leading-relaxed font-semibold text-black/30 dark:text-zinc-500 max-w-[260px] mx-auto"
          >
            로그인 시 빵돌이 통합{' '}
            <span className="hover:text-black/60 dark:hover:text-zinc-300 transition-colors cursor-pointer underline underline-offset-4 decoration-black/10 dark:decoration-white/10">이용약관</span>
            {' '}및{' '}
            <span className="hover:text-black/60 dark:hover:text-zinc-300 transition-colors cursor-pointer underline underline-offset-4 decoration-black/10 dark:decoration-white/10">개인정보처리방침</span>
            에 동의하게 됩니다.
          </motion.div>
        </>
      )}
    </PageLayout>
  );
}
