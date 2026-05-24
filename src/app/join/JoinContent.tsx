'use client';

import { Button } from '@/components/ui/Button';
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
      .catch(() => router.replace('/error?code=INVALID_CLIENT'));
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
    <main className="fixed inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${client.gradientFrom}, ${client.gradientTo})`,
        }}
      />
      <div
        className="absolute -top-40 -left-40 w-[560px] h-[560px] rounded-full blur-3xl opacity-50 pointer-events-none"
        style={{ backgroundColor: client.gradientFrom }}
      />
      <div
        className="absolute -bottom-40 -right-40 w-[560px] h-[560px] rounded-full blur-3xl opacity-50 pointer-events-none"
        style={{ backgroundColor: client.gradientTo }}
      />

      <motion.div
        initial={{ y: 48, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, delay: 0.1, ease: [0.34, 1.56, 0.64, 1] }}
        className={[
          'absolute backdrop-blur-xl',
          'md:bottom-8 md:left-1/2 md:-translate-x-1/2 md:w-[360px] md:rounded-2xl',
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
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.3 }}
            className="flex flex-col items-center gap-3 mb-2"
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

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35, delay: 0.42 }}
            className={`text-center text-sm mb-6 ${subTextColor}`}
          >
            처음 방문하셨네요.
            <br />
            {client.name}에 가입하고 서비스를 이용해보세요.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.54 }}
            className="flex flex-col gap-2"
          >
            <Button variant="primary" fullWidth loading={joining} disabled={canceling} onClick={handleJoin}>
              가입하기
            </Button>
            <Button variant="ghost" fullWidth loading={canceling} disabled={joining} onClick={handleCancel}>
              취소
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </main>
  );
}
