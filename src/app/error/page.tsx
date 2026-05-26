'use client';

import { Button } from '@/components/ui/Button';
import { PageLayout } from '@/components/ui/PageLayout';
import { getClientInfo } from '@/lib/api/account';
import { MOCK_CLIENT_ID } from '@/lib/api/mock';
import { OAuthClient } from '@/types';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

const ERROR_MESSAGES: Record<string, { title: string; desc: string }> = {
  INVALID_CLIENT: {
    title: '잘못된 접근이에요',
    desc: '서비스 정보가 올바르지 않습니다. 다시 확인해주세요.',
  },
  UNAUTHORIZED: {
    title: '권한이 없어요',
    desc: '접근 권한이 없거나 세션이 만료되었습니다.',
  },
  DEFAULT: {
    title: '문제가 발생했습니다',
    desc: '요청을 처리하는 중 예기치 못한 오류가 발생했습니다.',
  },
};

function ErrorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code') ?? 'DEFAULT';
  const { title, desc } = ERROR_MESSAGES[code] || ERROR_MESSAGES.DEFAULT;

  const isDev = process.env.NODE_ENV === 'development';
  const clientId = searchParams.get('clientId') || (isDev ? MOCK_CLIENT_ID : null);

  const [client, setClient] = useState<OAuthClient | null>(null);

  useEffect(() => {
    if (clientId) {
      getClientInfo(clientId).then(setClient).catch(() => {});
    }
  }, [clientId]);

  const from = client?.gradientFrom ?? '#EF4444';
  const to = client?.gradientTo ?? '#B91C1C';

  return (
    <PageLayout from={from} to={to} width={360}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          x: [0, -4, 4, -4, 4, 0] // 에러 알림 진동 효과
        }}
        transition={{ 
          duration: 0.4,
          delay: 0.5
        }}
        className="flex flex-col items-center text-center"
      >
        <div className="w-20 h-20 rounded-[24px] bg-red-500/10 flex items-center justify-center mb-6 text-red-500">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-black text-gray-900 dark:text-zinc-100 tracking-tight mb-3">{title}</h1>
        <p className="text-[15px] text-gray-500 dark:text-zinc-400 leading-relaxed mb-8 font-medium">{desc}</p>
        
        <Button 
          variant="primary" 
          fullWidth 
          onClick={() => {
            const loginUrl = clientId ? `/login?clientId=${clientId}` : '/login';
            router.replace(loginUrl);
          }}
          className="h-14 rounded-2xl bg-gray-900 dark:bg-zinc-100 text-white dark:text-black hover:bg-gray-800 dark:hover:bg-zinc-200 shadow-xl"
        >
          로그인으로 돌아가기
        </Button>
      </motion.div>
    </PageLayout>
  );
}

export default function ErrorPage() {
  return (
    <Suspense>
      <ErrorContent />
    </Suspense>
  );
}
