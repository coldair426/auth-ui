'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { PageLayout } from './PageLayout';

interface LoadingCardProps {
  /** 로고 영역 아래 본문 영역에 렌더링할 스켈레톤 (없으면 기본 형태 사용) */
  body?: ReactNode;
}

/**
 * 클라이언트 정보를 불러오는 동안 표시하는 공용 스켈레톤 카드.
 * Login / Join 등 동일한 로딩 UX가 필요한 페이지에서 재사용합니다.
 */
export function LoadingCard({ body }: LoadingCardProps) {
  return (
    <PageLayout from="#f3f4f6" to="#e5e7eb" width={400}>
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0.5 }}
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-16 h-16 rounded-[22px] bg-black/6 dark:bg-white/6 mb-6"
        />
        <div className="space-y-3 w-full flex flex-col items-center mb-8">
          <div className="h-4 w-24 bg-black/4 dark:bg-white/4 rounded-full" />
          <div className="h-8 w-40 bg-black/6 dark:bg-white/6 rounded-xl" />
        </div>
        {body ?? <DefaultBody />}
      </div>
    </PageLayout>
  );
}

function DefaultBody() {
  return (
    <div className="flex flex-col gap-3 w-full">
      {[1, 2, 3].map((i) => (
        <div key={i} className="w-full h-14 rounded-2xl bg-black/3 dark:bg-white/3 relative overflow-hidden">
          <motion.div
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 dark:via-white/5 to-transparent"
          />
        </div>
      ))}
    </div>
  );
}
