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
      className={`fixed inset-0 overflow-hidden bg-[#fdfdfd] dark:bg-[#050505] transition-colors duration-1000 flex flex-col items-center justify-center p-4 md:p-6 ${isBackgroundLight ? 'light-brand' : ''}`}
      style={{ '--client-primary': from } as React.CSSProperties}
    >
      {/* 전역 알림 컨테이너 */}
      <ToastContainer />

      {/* Cinematic Grain Overlay */}
      <div className="absolute inset-0 z-[1] pointer-events-none opacity-[0.03] dark:opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* 배경 Orb 애니메이션 */}
      <motion.div
        animate={{
          x: [0, 150, -100, 80, 0],
          y: [0, -150, 120, -80, 0],
          scale: [1, 1.4, 0.7, 1.2, 1],
          rotate: [0, 120, 240, 360],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-[15%] -left-[10%] w-[800px] h-[800px] rounded-full pointer-events-none mix-blend-multiply dark:mix-blend-normal opacity-60 dark:opacity-30"
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
        className="absolute -bottom-[15%] -right-[15%] w-[900px] h-[900px] rounded-full pointer-events-none mix-blend-multiply dark:mix-blend-normal opacity-50 dark:opacity-25"
        style={{ filter: 'blur(120px)', background: `radial-gradient(circle, ${to} 0%, transparent 70%)` }}
      />

      <motion.div
        animate={{
          x: [0, 200, -150, 0],
          y: [0, 100, -100, 0],
          scale: [0.8, 1.2, 0.8],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[20%] right-[5%] w-[600px] h-[600px] rounded-full pointer-events-none mix-blend-overlay opacity-30 dark:opacity-20"
        style={{ filter: 'blur(110px)', background: `radial-gradient(circle, #6366f1 0%, transparent 70%)` }}
      />

      <motion.div
        animate={{
          x: [0, -150, 150, 0],
          y: [0, -100, 100, 0],
          scale: [1, 0.7, 1.1, 1],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[10%] left-[5%] w-[500px] h-[500px] rounded-full pointer-events-none mix-blend-soft-light opacity-20 dark:opacity-10"
        style={{ filter: 'blur(90px)', background: `radial-gradient(circle, #06b6d4 0%, transparent 70%)` }}
      />

      {/* 중앙 콘텐츠 (카드) */}
      <div className="relative z-10 w-full flex items-center justify-center">
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
          className="relative w-full rounded-[64px] backdrop-blur-[50px] bg-white/75 md:bg-white/45 dark:bg-zinc-900/90 md:dark:bg-zinc-900/70 border border-black/10 dark:border-white/[0.08] overflow-hidden shadow-2xl"
          style={{ 
            width: `min(100%, ${width}px)`,
            boxShadow: isBackgroundLight 
              ? `0 40px 80px -20px rgba(0,0,0,0.08)` 
              : `0 50px 100px -20px ${from}25`,
            outline: !isBackgroundLight ? `1px solid ${from}15` : 'none',
            outlineOffset: '-1px'
          }}
        >
          {/* Shimmer Flare */}
          <motion.div 
            animate={{ x: ['-200%', '200%'], opacity: [0, 1, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent pointer-events-none z-[11]"
          />

          {/* 카드 내부 우측 상단 테마 토글 */}
          <div className="absolute top-6 right-6 z-20">
            <ThemeToggle />
          </div>

          <div className="px-8 pt-16 pb-10">
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
