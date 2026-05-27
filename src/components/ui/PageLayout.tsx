'use client';

import { motion } from 'framer-motion';
import { ReactNode, useMemo } from 'react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { ToastContainer } from '@/components/ui/Toast';
import { isLightColor } from '@/lib/utils/color';

interface PageLayoutProps {
  children: ReactNode;
  footer?: ReactNode;
  isExiting?: boolean;
  from?: string;
  to?: string;
  width?: number;
}

export function PageLayout({
  children,
  footer,
  isExiting = false,
  from = '#D97706',
  to = '#F59E0B',
  width = 360,
}: PageLayoutProps) {
  const isBackgroundLight = useMemo(() => isLightColor(from), [from]);

  return (
    <main
      className={`relative min-h-dvh overflow-y-auto bg-[#fdfdfd] dark:bg-[#050505] transition-colors duration-300 flex flex-col items-center p-4 md:p-6 ${isBackgroundLight ? 'light-brand' : ''}`}
      style={{ '--client-primary': from } as React.CSSProperties}
    >
      {/* 전역 알림 컨테이너 */}
      <ToastContainer />

      {/* 배경 데코레이션 레이어 - 뷰포트 고정 컨테이너로 묶어 모바일 주소창 토글 시 리플로우 방지 */}
      <div
        aria-hidden
        className="fixed inset-0 z-[1] pointer-events-none overflow-hidden"
        style={{ contain: 'strict', willChange: 'transform', transform: 'translateZ(0)' }}
      >
        {/* Cinematic Grain Overlay - 모바일/데스크탑 공통 (모바일은 더 낮은 opacity) */}
        <div
          className="absolute inset-0 opacity-[0.05] md:opacity-[0.08] dark:opacity-[0.07] md:dark:opacity-[0.12] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
          }}
        />

        {/* 배경 Orb 애니메이션 - 데스크탑 전용 (모바일에서는 정적 그라데이션) */}
        <div
          className="md:hidden absolute inset-0 opacity-40 dark:opacity-18"
          style={{
            background: `radial-gradient(circle at 20% 0%, ${from} 0%, transparent 50%), radial-gradient(circle at 80% 100%, ${to} 0%, transparent 50%)`,
          }}
        />

        <motion.div
          animate={{
            x: [0, 150, -100, 80, 0],
            y: [0, -150, 120, -80, 0],
            scale: [1, 1.4, 0.7, 1.2, 1],
            rotate: [0, 120, 240, 360],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="hidden md:block absolute -top-[15%] -left-[10%] w-[800px] h-[800px] rounded-full mix-blend-multiply dark:mix-blend-normal opacity-35 dark:opacity-12"
          style={{ filter: 'blur(100px)', background: `radial-gradient(circle, ${from} 0%, transparent 70%)` }}
        />

        <motion.div
          animate={{
            x: [0, -180, 120, -60, 0],
            y: [0, 140, -150, 80, 0],
            scale: [1, 0.8, 1.3, 0.9, 1],
            rotate: [360, 240, 120, 0],
          }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
          className="hidden md:block absolute -bottom-[15%] -right-[15%] w-[900px] h-[900px] rounded-full mix-blend-multiply dark:mix-blend-normal opacity-30 dark:opacity-10"
          style={{ filter: 'blur(120px)', background: `radial-gradient(circle, ${to} 0%, transparent 70%)` }}
        />

        <motion.div
          animate={{
            x: [0, 200, -150, 0],
            y: [0, 100, -100, 0],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="hidden md:block absolute top-[20%] right-[5%] w-[600px] h-[600px] rounded-full mix-blend-overlay opacity-15 dark:opacity-6"
          style={{ filter: 'blur(110px)', background: `radial-gradient(circle, #6366f1 0%, transparent 70%)` }}
        />

        <motion.div
          animate={{
            x: [0, -150, 150, 0],
            y: [0, -100, 100, 0],
            scale: [1, 0.7, 1.1, 1],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="hidden md:block absolute bottom-[10%] left-[5%] w-[500px] h-[500px] rounded-full mix-blend-soft-light opacity-20 dark:opacity-7"
          style={{ filter: 'blur(90px)', background: `radial-gradient(circle, #06b6d4 0%, transparent 70%)` }}
        />
      </div>

      {/* 중앙 콘텐츠 (카드) */}
      <div className="relative z-10 w-full flex-1 flex items-center justify-center py-8 md:py-12">
        <motion.div
          initial={{ y: 60, opacity: 0, scale: 0.94, filter: 'blur(10px)' }}
          animate={isExiting ? {
            y: -40,
            opacity: 0,
            scale: 0.96,
            filter: 'blur(4px)',
          } : {
            y: 0,
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
          }}
          transition={isExiting ? {
            duration: 0.4,
            ease: 'easeOut',
          } : {
            duration: 1.2,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.2,
          }}
          className="relative w-full rounded-[40px] md:rounded-[64px] md:backdrop-blur-[50px] bg-white/95 md:bg-white/45 dark:bg-[rgba(24,24,27,0.97)] md:dark:bg-[rgba(24,24,27,0.84)] border border-black/10 dark:border-white/[0.14] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] dark:shadow-[0_36px_90px_-28px_rgba(0,0,0,0.82),0_12px_36px_-18px_rgba(0,0,0,0.5)]"
          style={{ 
            width: `min(100%, ${width}px)`,
            outline: !isBackgroundLight ? `1px solid ${from}15` : 'none',
            outlineOffset: '-1px'
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-[1px] hidden dark:block rounded-[39px] md:rounded-[63px]"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 18%, rgba(255,255,255,0) 42%, rgba(0,0,0,0.16) 100%)'
            }}
          />

          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-8 top-0 hidden h-24 dark:block"
            style={{
              background: `radial-gradient(circle at top, ${from}14 0%, transparent 72%)`,
              filter: 'blur(18px)',
            }}
          />

          {/* Shimmer Flare - 데스크탑 전용 (모바일 성능 보호) */}
          <motion.div
            animate={{ x: ['-200%', '200%'], opacity: [0, 0.7, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", repeatDelay: 5 }}
            className="hidden md:block absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/6 to-transparent pointer-events-none z-[11]"
          />

          {/* 카드 내부 우측 상단 테마 토글 */}
          <div className="absolute top-5 right-5 md:top-6 md:right-6 z-20">
            <ThemeToggle />
          </div>

          <div className="px-6 py-10 md:px-8 md:pt-16 md:pb-10">
            {children}
          </div>
        </motion.div>
      </div>

      {/* 푸터 영역 */}
      {footer && (
        <div className="fixed bottom-10 left-0 right-0 z-20 flex justify-center pointer-events-none">
          <div className="pointer-events-auto">
            {footer}
          </div>
        </div>
      )}
    </main>
  );
}
