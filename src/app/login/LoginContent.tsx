'use client';

import { SocialLoginButton } from '@/components/auth/SocialLoginButton';
import { ClientLogo } from '@/components/ui/ClientLogo';
import { LoadingCard } from '@/components/ui/LoadingCard';
import { PageLayout } from '@/components/ui/PageLayout';
import { getSocialLoginUrl } from '@/lib/api/auth';
import { Provider } from '@/types';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useClientInfo } from '@/hooks/useClientInfo';

const PROVIDERS: Provider[] = ['naver', 'kakao', 'google'];

export function LoginContent() {
  const router = useRouter();
  const { client, clientId, isLoading, redirectUri, mode } = useClientInfo();

  const [loadingProvider, setLoadingProvider] = useState<Provider | null>(null);
  const [isExiting, setIsExiting] = useState(false);

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
        globalThis.location.assign(url);
      }, 400);
    } catch {
      setLoadingProvider(null);
      router.push(`/error?code=LOGIN_FAILED&clientId=${clientId}`);
    }
  }

  if (isLoading || !client) {
    return <LoadingCard />;
  }

  return (
    <PageLayout
      isExiting={isExiting}
      from={client.gradientFrom}
      to={client.gradientTo}
      width={400}
    >
      <div className="flex flex-col items-center mb-6 md:mb-8 text-center">
        <ClientLogo 
          logoUrl={client.logoUrl} 
          name={client.name} 
          gradientFrom={client.gradientFrom} 
          gradientTo={client.gradientTo}
          size={80}
          className="mb-3 md:size-[112px] md:mb-2"
        />
        <motion.h1 
          initial={{ opacity: 0, y: 8 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, delay: 0.9 }} 
          className="text-[24px] md:text-[28px] font-extrabold text-gray-900 dark:text-white tracking-tight"
        >
          {client.name}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="text-[13px] md:text-[14px] font-semibold text-black/40 dark:text-zinc-400 mt-1.5 break-keep"
        >
          빵돌이 통합 인증 계정으로 로그인
        </motion.p>
      </div>
      
      <div className="flex flex-col gap-2.5 md:gap-3 mb-6 md:mb-8">
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
        className="text-center text-[11px] leading-relaxed font-semibold text-black/30 dark:text-zinc-500 max-w-65 mx-auto break-keep"
      >
        로그인 시 빵돌이 통합 인증{' '}
        <span className="hover:text-black/60 dark:hover:text-zinc-300 transition-colors cursor-pointer underline underline-offset-4 decoration-black/10 dark:decoration-white/10">이용약관</span>
        {' 및 '}
        <span className="hover:text-black/60 dark:hover:text-zinc-300 transition-colors cursor-pointer underline underline-offset-4 decoration-black/10 dark:decoration-white/10">개인정보처리방침</span>에 동의하게 됩니다.
      </motion.div>
    </PageLayout>
  );
}
