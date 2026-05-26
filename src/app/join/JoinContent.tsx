'use client';

import { Button } from '@/components/ui/Button';
import { ClientLogo } from '@/components/ui/ClientLogo';
import { PageLayout } from '@/components/ui/PageLayout';
import { getClientInfo } from '@/lib/api/account';
import { joinProject } from '@/lib/api/auth';
import { useAuthStore } from '@/store/authStore';
import { Mode, OAuthClient } from '@/types';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { MOCK_CLIENT_ID } from '@/lib/api/mock';

export function JoinContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clientInfo: storedClientInfo, setClientInfo } = useAuthStore();

  const isDev = process.env.NODE_ENV === 'development';
  const clientId = searchParams.get('clientId') || (isDev ? MOCK_CLIENT_ID : null);
  const redirectUri = searchParams.get('redirectUri') ?? (isDev ? 'http://localhost:4000/callback' : '');
  const mode = (searchParams.get('mode') ?? 'redirect') as Mode;

  const [client, setClient] = useState<OAuthClient | null>(storedClientInfo);
  const [joining, setJoining] = useState(false);
  const [canceling, setCanceling] = useState(false);

  useEffect(() => {
    if (!clientId) {
      router.replace('/error?code=INVALID_CLIENT');
      return;
    }
    if (storedClientInfo) return;

    getClientInfo(clientId)
      .then((info) => {
        setClient(info);
        setClientInfo(info);
      })
      .catch(() => {
        router.replace(`/error?code=INVALID_CLIENT&clientId=${clientId}`);
      });
  }, [clientId, router, storedClientInfo, setClientInfo]);

  function handleComplete(accessToken: string) {
    if (mode === 'popup') {
      const targetOrigin = redirectUri ? new URL(redirectUri).origin : '*';
      window.opener?.postMessage({ type: 'AUTH_SUCCESS', accessToken }, targetOrigin);
      window.close();
      return;
    }
    window.location.assign(redirectUri);
  }

  async function handleJoin() {
    if (!clientId || joining) return;
    setJoining(true);
    try {
      await joinProject(clientId);
      const { accessToken } = useAuthStore.getState();
      handleComplete(accessToken ?? '');
    } catch {
      router.replace('/error?code=JOIN_FAILED');
    } finally {
      setJoining(false);
    }
  }

  function handleCancel() {
    setCanceling(true);
    if (mode === 'popup') {
      window.close();
      return;
    }
    window.location.assign(redirectUri);
  }

  if (!client) return null;

  // AI_RULES 기반 테마 컨벤션: dark: 프리픽스로 관리
  const titleColor = 'text-[#2D2319] dark:text-zinc-50';
  const descColor = 'text-[#5C4D3E] dark:text-zinc-400';
  const disclaimerClasses = 'bg-black/[0.05] dark:bg-white/[0.05] border-black/5 dark:border-white/10';

  return (
    <PageLayout from={client.gradientFrom} to={client.gradientTo} width={400}>
      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.12,
              delayChildren: 0.4
            }
          }
        }}
        className="flex flex-col items-center w-full"
      >
        {/* Logo & Title Section */}
        <div className="flex flex-col items-center mb-8 text-center">
          <ClientLogo 
            logoUrl={client.logoUrl} 
            name={client.name} 
            gradientFrom={client.gradientFrom} 
            gradientTo={client.gradientTo}
            size={112}
            className="mb-2"
          />
          <motion.h1 
            variants={{
              hidden: { y: 15, opacity: 0, filter: 'blur(10px)' },
              show: { y: 0, opacity: 1, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
            }}
            className="text-[28px] font-extrabold tracking-tight leading-tight text-gray-900 dark:text-white"
          >
            {client.name}
          </motion.h1>
          <motion.p
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { duration: 0.5, delay: 0.1 } }
            }}
            className="text-[14px] font-semibold text-black/40 dark:text-zinc-400 mt-1"
          >
            빵돌이 통합 계정으로 연동
          </motion.p>
        </div>

        {/* Disclaimer Box */}
        <motion.div
          variants={{
            hidden: { y: 15, opacity: 0, filter: 'blur(8px)' },
            show: { y: 0, opacity: 1, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
          }}
          className="w-full mb-8 overflow-hidden rounded-[32px] bg-black/[0.03] dark:bg-white/[0.03] border border-black/5 dark:border-white/10 backdrop-blur-sm p-6"
        >
          <p className="mb-4 font-bold text-[13px] tracking-tight text-gray-900 dark:text-zinc-100 opacity-90">
            이용 약관 및 정보 제공 동의
          </p>
          <ul className="space-y-3 text-[12.5px] font-semibold leading-relaxed text-black/50 dark:text-zinc-400">
            <li className="flex gap-2.5">
              <span className="shrink-0 text-black/20 dark:text-white/20 mt-1">•</span>
              <span><b>빵돌이 통합 이용약관</b> 및 <b>개인정보 처리방침</b>에 동의하게 됩니다.</span>
            </li>
            <li className="flex gap-2.5">
              <span className="shrink-0 text-black/20 dark:text-white/20 mt-1">•</span>
              <span>인증 완료 시, 서비스 이용을 위해 최소한의 프로필 정보가 <b>{client.name}</b> 측에 전달됩니다.</span>
            </li>
            <li className="flex gap-2.5">
              <span className="shrink-0 text-black/20 dark:text-white/20 mt-1">•</span>
              <span>서비스 내부의 개별 정책 및 데이터 관리는 해당 운영자의 책임하에 운영됩니다.</span>
            </li>
          </ul>
        </motion.div>

        {/* Actions Section */}
        <motion.div
          variants={{
            hidden: { y: 15, opacity: 0 },
            show: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
          }}
          className="flex flex-col gap-3 w-full"
        >
          <Button 
            variant="primary"
            fullWidth 
            loading={joining} 
            disabled={canceling} 
            onClick={handleJoin}
            className="h-14 rounded-2xl text-white shadow-xl transition-all duration-300 active:scale-[0.98]"
            style={{ 
              background: `linear-gradient(135deg, ${client.gradientFrom}, ${client.gradientTo})`,
              boxShadow: `0 12px 24px -8px ${client.gradientFrom}60`
            }}
          >
            {client.name} 시작하기
          </Button>
          <Button 
            variant="ghost" 
            fullWidth 
            loading={canceling} 
            disabled={joining} 
            onClick={handleCancel}
            className="h-12 rounded-2xl font-bold text-[14px] text-black/30 dark:text-zinc-500 hover:text-black dark:hover:text-zinc-300 transition-colors"
          >
            취소
          </Button>
        </motion.div>
      </motion.div>
    </PageLayout>
  );
}
