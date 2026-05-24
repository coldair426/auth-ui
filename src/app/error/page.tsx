'use client';

import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

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

  return (
    <main className="fixed inset-0 overflow-hidden bg-[#f9fafb] dark:bg-black transition-colors duration-500">
      {/* 배경 Orb — 로그인 페이지와 통일 */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-[#4F46E5]/15 blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-[#7C3AED]/15 blur-[100px] pointer-events-none" />

      <div className="fixed inset-0 flex items-end justify-center md:items-center p-4 md:p-6">
        <motion.div
          initial={{ y: 40, opacity: 0, scale: 0.96 }}
          animate={{ 
            y: 0, 
            opacity: 1, 
            scale: 1,
            x: [0, -4, 4, -4, 4, 0] // 에러 알림 진동 효과
          }}
          transition={{ 
            y: { type: 'spring', stiffness: 260, damping: 20 },
            x: { duration: 0.4, delay: 0.2 }
          }}
          className="w-full md:w-[360px] rounded-[32px] backdrop-blur-2xl bg-white/60 dark:bg-zinc-900/60 border border-white/70 dark:border-white/10 shadow-2xl relative z-10 overflow-hidden"
        >
          {/* 모바일 핸들 (Grabber) */}
          <div className="md:hidden flex justify-center pt-3">
            <div className="w-10 h-1 rounded-full bg-black/10 dark:bg-white/10" />
          </div>

          <div className="px-8 pt-6 md:pt-10 text-center" style={{ paddingBottom: 'max(2.5rem, env(safe-area-inset-bottom))' }}>
            <div className="w-20 h-20 rounded-[24px] bg-red-500/10 flex items-center justify-center mb-6 mx-auto text-red-500">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            
            <h1 className="text-2xl font-black text-gray-900 dark:text-zinc-100 tracking-tight mb-3">{title}</h1>
            <p className="text-[15px] text-gray-500 dark:text-zinc-400 leading-relaxed mb-8 font-medium">{desc}</p>
            
            <Button 
              variant="primary" 
              fullWidth 
              onClick={() => router.replace('/login')}
              className="h-14 rounded-2xl"
            >
              로그인으로 돌아가기
            </Button>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

export default function ErrorPage() {
  return (
    <Suspense>
      <ErrorContent />
    </Suspense>
  );
}
