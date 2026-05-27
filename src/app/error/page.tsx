'use client';

import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import { Heading, Description, STAGGER_CONTAINER } from '@/components/ui/Typography';
import { BrandFooter } from '@/components/ui/BrandFooter';
import { Button } from '@/components/ui/Button';
import { PageLayout } from '@/components/ui/PageLayout';

const ERROR_MESSAGES: Record<string, { title: string; desc: string }> = {
  MISSING_CLIENT: {
    title: '서비스 연결이 필요해요',
    desc: '올바른 서비스 링크를 통해\n다시 접속해주시겠어요?',
  },
  INVALID_CLIENT: {
    title: '알 수 없는 서비스에요',
    desc: '요청하신 서비스 정보를 찾을 수 없습니다.\n주소를 확인해주세요.',
  },
  UNAUTHORIZED: {
    title: '권한이 없어요',
    desc: '접근 권한이 없거나\n세션이 만료되었습니다.',
  },
  DEFAULT: {
    title: '문제가 발생했습니다',
    desc: '요청을 처리하는 중\n예기치 못한 오류가 발생했습니다.',
  },
};

function ErrorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code') ?? 'DEFAULT';
  const errorInfo = ERROR_MESSAGES[code] || ERROR_MESSAGES.DEFAULT;

  useEffect(() => {
    // 탭 타이틀을 에러 타이틀로 표시 (예: 서비스 연결이 필요해요 | 빵돌이 통합 인증)
    document.title = `${errorInfo.title} | 빵돌이 통합 인증`;
  }, [errorInfo.title]);

  return (
    <PageLayout width={400} footer={<BrandFooter />}>
      <motion.div
        initial="hidden"
        animate="show"
        variants={STAGGER_CONTAINER}
        className="flex flex-col items-center text-center w-full"
      >
        {/* Logo Section - Matching Home Style */}
        <motion.div
          variants={{
            hidden: { y: 20, opacity: 0, filter: 'blur(10px)' },
            show: { y: 0, opacity: 1, filter: 'blur(0px)', transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } }
          }}
          className="relative w-20 h-20 md:w-24 md:h-24 mb-6 md:mb-8"
        >
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="w-full h-full relative">
            <div className="absolute inset-0 bg-amber-500/20 dark:bg-amber-500/10 blur-3xl rounded-full" />
            <div className="w-full h-full relative z-10 flex items-center justify-center bg-white dark:bg-zinc-800 rounded-[32px] shadow-2xl border border-black/5 dark:border-white/5">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Heading & Description with forced smaller sizes */}
        <Heading className="text-[23px]! md:text-[25px]! mb-2 tracking-tight">
          {errorInfo.title}
        </Heading>
        <Description className="!text-[14px] md:!text-[15px] mb-8 font-semibold text-black/40 dark:text-zinc-400 break-keep whitespace-pre-line leading-relaxed">
          {errorInfo.desc}
        </Description>
        
        <motion.div
          variants={{
            hidden: { y: 15, opacity: 0 },
            show: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
          }}
          className="w-full"
        >
          <Button 
            variant="primary" 
            size="lg"
            fullWidth 
            onClick={() => router.replace('/')}
            className="text-white border-none shadow-xl transition-all duration-300 active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, #D97706, #F59E0B)',
              boxShadow: '0 12px 24px -8px rgba(217, 119, 6, 0.5)'
            }}
          >
            홈으로 이동
          </Button>
        </motion.div>
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
