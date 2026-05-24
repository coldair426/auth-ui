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

export function JoinContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clientInfo: storedClientInfo, setClientInfo } = useAuthStore();

  const clientId = searchParams.get('clientId') ?? '';
  const redirectUri = searchParams.get('redirectUri') ?? '';
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
        if (process.env.NODE_ENV === 'development') {
          console.warn('[Dev Mock] 서비스 정보 API 호출 실패: 테스트 데이터를 로드합니다.');
          const mockClient: OAuthClient = {
            clientId,
            name: 'Unified Auth',
            logoUrl: null,
            gradientFrom: '#4F46E5',
            gradientTo: '#7C3AED',
            textDark: false,
            allowedModes: ['redirect', 'popup'],
          };
          setClient(mockClient);
          setClientInfo(mockClient);
          return;
        }
        router.replace('/error?code=INVALID_CLIENT');
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

  const textColor = client.textDark ? 'text-gray-900' : 'text-white';
  const subTextColor = client.textDark ? 'text-black/50' : 'text-white/60';

  return (
    <PageLayout from={client.gradientFrom} to={client.gradientTo} width={360}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          scale: { duration: 0.5, times: [0, 0.7, 1], ease: "easeOut", delay: 0.4 },
          opacity: { duration: 0.3, delay: 0.4 }
        }}
        className="flex flex-col items-center gap-4 mb-3"
      >
        {client.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={client.logoUrl}
            alt={client.name}
            width={72}
            height={72}
            className="rounded-[24px] object-contain shadow-xl shadow-black/5"
          />
        ) : (
          <div 
            className="w-16 h-16 rounded-[22px] flex items-center justify-center text-white text-2xl font-black"
            style={{ background: `linear-gradient(135deg, ${client.gradientFrom}, ${client.gradientTo})` }}
          >
            {client.name[0]}
          </div>
        )}
        <h1 className={`text-2xl font-black tracking-tight ${textColor}`}>{client.name}</h1>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.55 }}
        className={`text-center text-[15px] font-medium leading-relaxed mb-8 ${subTextColor}`}
      >
        처음 방문하셨네요.<br />
        <span className="font-bold">{client.name}</span>에 가입하고<br />서비스를 이용해보세요.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.7 }}
        className="flex flex-col gap-3"
      >
        <Button 
          variant={client.textDark ? 'primary' : 'secondary'} 
          fullWidth 
          loading={joining} 
          disabled={canceling} 
          onClick={handleJoin}
          className="h-14 rounded-2xl"
        >
          서비스 시작하기
        </Button>
        <Button 
          variant="ghost" 
          fullWidth 
          loading={canceling} 
          disabled={joining} 
          onClick={handleCancel}
          className={`h-12 rounded-2xl font-semibold ${client.textDark ? 'text-gray-500' : 'text-white/70'}`}
        >
          다음에 할게요
        </Button>
      </motion.div>
    </PageLayout>
  );
}
