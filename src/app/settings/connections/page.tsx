'use client';

import { connectSocial, disconnectSocial, getConnections } from '@/lib/api/account';
import { Provider, SocialAccount } from '@/types';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const PROVIDERS: { key: Provider; label: string; icon: React.ReactNode }[] = [
  {
    key: 'naver',
    label: '네이버',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-[#03C75A]">
        <path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z" />
      </svg>
    ),
  },
  {
    key: 'kakao',
    label: '카카오',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-[#3A1D1D]">
        <path d="M12 3C6.477 3 2 6.582 2 11c0 2.819 1.786 5.296 4.5 6.77L5.5 21l4.077-2.687C10.344 18.432 11.16 18.5 12 18.5c5.523 0 10-3.582 10-8S17.523 3 12 3z" />
      </svg>
    ),
  },
  {
    key: 'google',
    label: '구글',
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

export default function ConnectionsPage() {
  const router = useRouter();

  const [connections, setConnections] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<Provider | null>(null);

  useEffect(() => {
    getConnections()
      .then(setConnections)
      .catch(() => router.replace('/error?code=UNAUTHORIZED'))
      .finally(() => setLoading(false));
  }, [router]);

  function getConnection(provider: Provider): SocialAccount | undefined {
    return connections.find((c) => c.provider === provider);
  }

  async function handleConnect(provider: Provider) {
    if (actionLoading) return;
    setActionLoading(provider);
    try {
      const { url } = await connectSocial(provider);
      window.location.href = url;
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
      // 서버에서 마지막 계정 해제 시도 시 에러 반환 — 무시하고 상태 유지
    } finally {
      setActionLoading(null);
    }
  }

  const isLastConnection = connections.length === 1;

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-lg mx-auto px-4 py-10">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white/80 transition-colors mb-6 cursor-pointer"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            뒤로
          </button>
          <h1 className="text-2xl font-bold">소셜 계정 연동</h1>
          <p className="mt-1 text-sm text-white/50">
            연동된 소셜 계정으로 로그인할 수 있습니다.
          </p>
        </motion.div>

        {/* 연동 목록 */}
        <div className="flex flex-col gap-3">
          {PROVIDERS.map(({ key, label, icon }, index) => {
            const connection = getConnection(key);
            const isConnected = !!connection;
            const isDisabled = isConnected && isLastConnection;
            const isActing = actionLoading === key;

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.06 }}
                className={[
                  'flex items-center justify-between px-4 py-4 rounded-2xl',
                  'border transition-colors',
                  isConnected
                    ? 'bg-white/8 border-white/15'
                    : 'bg-white/4 border-white/8',
                ].join(' ')}
              >
                {/* 왼쪽: 아이콘 + 이름 + 연결일 */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center flex-shrink-0">
                    {icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{label}</span>
                      {isConnected && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-medium">
                          연동됨
                        </span>
                      )}
                    </div>
                    {isConnected && connection.connectedAt && (
                      <p className="text-xs text-white/40 mt-0.5">
                        {formatDate(connection.connectedAt)} 연결
                      </p>
                    )}
                    {!isConnected && (
                      <p className="text-xs text-white/30 mt-0.5">연동되지 않음</p>
                    )}
                  </div>
                </div>

                {/* 오른쪽: 버튼 */}
                {loading ? (
                  <div className="w-16 h-8 rounded-lg bg-white/10 animate-pulse" />
                ) : isConnected ? (
                  <button
                    onClick={() => handleDisconnect(key)}
                    disabled={isDisabled || !!actionLoading}
                    title={isDisabled ? '마지막 연동 계정은 해제할 수 없습니다.' : undefined}
                    className={[
                      'text-xs px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer',
                      'border border-white/15',
                      isDisabled || actionLoading
                        ? 'opacity-30 cursor-not-allowed text-white/50'
                        : 'text-red-400 hover:bg-red-500/10',
                    ].join(' ')}
                  >
                    {isActing ? (
                      <span className="inline-block w-3.5 h-3.5 border border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      '해제'
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => handleConnect(key)}
                    disabled={!!actionLoading}
                    className={[
                      'text-xs px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer',
                      'border border-white/15 text-white/70 hover:bg-white/10',
                      actionLoading ? 'opacity-50 cursor-not-allowed' : '',
                    ].join(' ')}
                  >
                    {isActing ? (
                      <span className="inline-block w-3.5 h-3.5 border border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      '연동하기'
                    )}
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* 안내 문구 */}
        {!loading && isLastConnection && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="mt-4 text-xs text-white/30 text-center"
          >
            마지막 연동 계정은 해제할 수 없습니다.
          </motion.p>
        )}
      </div>
    </main>
  );
}
