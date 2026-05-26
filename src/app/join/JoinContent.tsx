'use client';

import { Button } from '@/components/ui/Button';
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
    <PageLayout from={client.gradientFrom} to={client.gradientTo} width={420}>
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
        {/* Logo Section */}
        <motion.div
          variants={{
            hidden: { y: 20, opacity: 0, filter: 'blur(10px)' },
            show: { y: 0, opacity: 1, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
          }}
          className="flex flex-col items-center gap-6 mb-8"
        >
          <motion.div 
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            <div 
              className="absolute inset-0 blur-2xl opacity-30 rounded-full" 
              style={{ background: client.gradientFrom }}
            />
            {client.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={client.logoUrl}
                alt={client.name}
                width={84}
                height={84}
                className="rounded-[28px] object-contain relative z-10 shadow-2xl shadow-black/10"
              />
            ) : (
              <div 
                className="w-20 h-20 rounded-[28px] flex items-center justify-center text-white text-3xl font-black relative z-10 shadow-2xl"
                style={{ background: `linear-gradient(135deg, ${client.gradientFrom}, ${client.gradientTo})` }}
              >
                {client.name[0]}
              </div>
            )}
          </motion.div>
          
          <div className="text-center">
            <h1 className={`text-[28px] md:text-[32px] font-extrabold tracking-[-0.04em] leading-tight ${titleColor}`}>
              {client.name}
            </h1>
          </div>
        </motion.div>

        {/* Description Section */}
        <motion.p
          variants={{
            hidden: { y: 15, opacity: 0, filter: 'blur(6px)' },
            show: { y: 0, opacity: 1, filter: 'blur(0px)', transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
          }}
          className={`text-center text-[16px] font-medium leading-relaxed mb-8 ${descColor} tracking-tight`}
        >
          반가워요! <b>빵돌이 통합 계정</b>을 만들어<br />
          <span className="font-bold text-amber-600/90 dark:text-amber-500/90">{client.name}</span> 연동을 시작할까요?
        </motion.p>

        {/* Disclaimer Box */}
        <motion.div
          variants={{
            hidden: { y: 15, opacity: 0, filter: 'blur(8px)' },
            show: { y: 0, opacity: 1, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
          }}
          className={`w-full mb-10 overflow-hidden rounded-[28px] border ${disclaimerClasses} backdrop-blur-sm p-6`}
        >
          <p className={`mb-3 font-bold text-[13px] tracking-tight ${titleColor} opacity-90`}>
            이용 약관 및 정보 제공 동의
          </p>
          <ul className={`space-y-2.5 text-[12.5px] font-medium leading-relaxed ${descColor}`}>
            <li className="flex gap-2.5">
              <span className="shrink-0 text-amber-600/50 dark:text-amber-500/50 mt-1">•</span>
              <span><b>빵돌이 통합 이용약관</b> 및 <b>개인정보 처리방침</b>에 동의하게 됩니다.</span>
            </li>
            <li className="flex gap-2.5">
              <span className="shrink-0 text-amber-600/50 dark:text-amber-500/50 mt-1">•</span>
              <span>인증 완료 시, 서비스 이용을 위해 최소한의 프로필 정보가 <b className="text-amber-600/80 dark:text-amber-500/80">{client.name}</b> 측에 전달됩니다.</span>
            </li>
            <li className="flex gap-2.5">
              <span className="shrink-0 text-amber-600/50 dark:text-amber-500/50 mt-1">•</span>
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
            className="h-14 rounded-[20px] bg-amber-600 hover:bg-amber-700 text-white shadow-xl shadow-amber-600/20"
          >
            {client.name} 시작하기
          </Button>
          <Button 
            variant="ghost" 
            fullWidth 
            loading={canceling} 
            disabled={joining} 
            onClick={handleCancel}
            className={`h-12 rounded-[20px] font-bold text-[14px] ${descColor} hover:text-amber-600 dark:hover:text-amber-500 transition-colors`}
          >
            취소
          </Button>
        </motion.div>
      </motion.div>
    </PageLayout>
  );
}
