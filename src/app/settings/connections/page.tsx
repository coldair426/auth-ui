'use client';

import { getConnections, getClientInfo, connectSocial, disconnectSocial } from '@/lib/api/account';
import { OAuthClient, Provider, SocialAccount } from '@/types';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { Button } from '@/components/ui/Button';
import { PageLayout } from '@/components/ui/PageLayout';

const FALLBACK_CLIENT: OAuthClient = {
  clientId: '',
  name: 'Unified Auth',
  logoUrl: null,
  gradientFrom: '#4F46E5',
  gradientTo: '#7C3AED',
  textDark: false,
  allowedModes: ['redirect', 'popup'],
};

const PROVIDERS: { 
  key: Provider; 
  label: string; 
  icon: React.ReactNode; 
  tint: string; 
  darkTint: string 
}[] = [
  {
    key: 'naver',
    label: '네이버',
    tint: 'rgba(3, 199, 90, 0.08)',
    darkTint: 'rgba(3, 199, 90, 0.15)',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="#03C75A">
        <path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z" />
      </svg>
    ),
  },
  {
    key: 'kakao',
    label: '카카오',
    tint: 'rgba(254, 229, 0, 0.12)',
    darkTint: 'rgba(254, 229, 0, 0.18)',
    icon: (
      <span className="flex items-center justify-center w-[18px] h-[18px] rounded-[4px] bg-[#FEE500]">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="#3C1E1E">
          <path d="M12 3C6.477 3 2 6.582 2 11c0 2.819 1.786 5.296 4.5 6.77L5.5 21l4.077-2.687C10.344 18.432 11.16 18.5 12 18.5c5.523 0 10-3.582 10-8S17.523 3 12 3z" />
        </svg>
      </span>
    ),
  },
  {
    key: 'google',
    label: '구글',
    tint: 'rgba(66, 133, 244, 0.08)',
    darkTint: 'rgba(66, 133, 244, 0.15)',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
      </svg>
    ),
  },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function ConnectionsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clientId = searchParams.get('clientId');

  const [client, setClient] = useState<OAuthClient>(FALLBACK_CLIENT);
  const [connections, setConnections] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<Provider | null>(null);

  useEffect(() => {
    // 1. 브랜드 정보 로드
    if (clientId) {
      getClientInfo(clientId)
        .then(setClient)
        .catch(() => {
          if (process.env.NODE_ENV === 'development') {
            setClient({ ...FALLBACK_CLIENT, name: '테스트 프로젝트', clientId });
          }
        });
    }

    // 2. 연동 정보 로드
    getConnections()
      .then(setConnections)
      .catch(() => {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[Dev Mock] 계정 연동 API 호출 실패: 테스트 데이터를 로드합니다.');
          const mockConnections: SocialAccount[] = [
            { provider: 'naver', connectedAt: new Date().toISOString() },
            { provider: 'google', connectedAt: new Date().toISOString() },
          ];
          setConnections(mockConnections);
          return;
        }
        router.replace('/error?code=UNAUTHORIZED');
      })
      .finally(() => setLoading(false));
  }, [clientId, router]);

  function getConnection(provider: Provider): SocialAccount | undefined {
    return connections.find((c) => c.provider === provider);
  }

  async function handleConnect(provider: Provider) {
    if (actionLoading) return;
    setActionLoading(provider);
    try {
      const { url } = await connectSocial(provider);
      window.location.assign(url);
    } catch {
      setActionLoading(null);
    }
  }

  async function handleDisconnect(provider: Provider) {
    if (actionLoading) return;
    setActionLoading(provider);
    try {
      await disconnectSocial(provider);
      setConnections((prev) => prev.filter((c) => c.provider !== provider));
    } catch {
      // 에러 무시
    } finally {
      setActionLoading(null);
    }
  }

  const isLastConnection = connections.length === 1;

  return (
    <PageLayout 
      width={420} 
      from={client.gradientFrom} 
      to={client.gradientTo}
      isLoading={loading}
    >
      <div className="flex items-center justify-between mb-8 px-1">
        <div className="flex items-center gap-3">
          {client.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={client.logoUrl} alt={client.name} width={32} height={32} className="rounded-lg object-contain" />
          ) : (
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg font-black shadow-sm" style={{ background: `linear-gradient(135deg, ${client.gradientFrom}, ${client.gradientTo})` }}>
              {client.name[0]}
            </div>
          )}
          <div>
            <h1 className="text-xl font-black text-gray-900 dark:text-zinc-100 tracking-tight">계정 연결</h1>
            <p className="text-[11px] font-bold text-black/30 dark:text-white/30 uppercase tracking-widest">{client.name}</p>
          </div>
        </div>
        <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-gray-500 hover:bg-black/10 transition-colors cursor-pointer">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {PROVIDERS.map(({ key, label, icon, tint, darkTint }, index) => {
          const connection = getConnection(key);
          const isConnected = !!connection;
          const isDisabled = isConnected && isLastConnection;
          const isActing = actionLoading === key;

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 }}
              className="flex items-center justify-between px-5 py-4 rounded-2xl border border-black/[0.03] dark:border-white/[0.05]"
              style={{ backgroundColor: `var(--item-bg-${key})` } as any}
            >
              <style jsx>{`
                div { --item-bg-${key}: ${tint}; }
                @media (prefers-color-scheme: dark) {
                  div { --item-bg-${key}: ${darkTint}; }
                }
              `}</style>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                  {icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] font-bold text-gray-800 dark:text-zinc-200">{label}</span>
                    {isConnected && <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">연동됨</span>}
                  </div>
                  {isConnected && connection.connectedAt && <p className="text-[11px] font-medium text-gray-400 dark:text-zinc-500 mt-0.5">{formatDate(connection.connectedAt)} 연결</p>}
                  {!isConnected && <p className="text-[11px] font-medium text-gray-400 dark:text-zinc-500 mt-0.5">연동되지 않음</p>}
                </div>
              </div>

              {isConnected ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDisconnect(key)}
                  disabled={isDisabled || !!actionLoading}
                  className="text-red-500 dark:text-red-400 font-bold hover:bg-red-500/5 px-4"
                >
                  {isActing ? '...' : '해제'}
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleConnect(key)}
                  disabled={!!actionLoading}
                  className="px-4"
                >
                  {isActing ? '...' : '연동'}
                </Button>
              )}            </motion.div>
          );
        })}
      </div>

      {isLastConnection && (
        <p className="mt-6 text-[11px] font-medium text-amber-600/70 dark:text-amber-400/50 text-center px-4 leading-relaxed">
          보안을 위해 마지막 연동 계정은 해제할 수 없습니다.
        </p>
      )}
    </PageLayout>
  );
}

export default function ConnectionsPage() {
  return (
    <Suspense>
      <ConnectionsContent />
    </Suspense>
  );
}
