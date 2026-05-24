'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface PageLayoutProps {
  children: ReactNode;
  isExiting?: boolean;
  isLoading?: boolean;
  isInvalid?: boolean;
  from?: string;
  to?: string;
  width?: number;
}

export function PageLayout({
  children,
  isExiting = false,
  isLoading = false,
  isInvalid = false,
  from = '#4F46E5',
  to = '#7C3AED',
  width = 360,
}: PageLayoutProps) {
  return (
    <main className="fixed inset-0 overflow-hidden bg-[#f9fafb] dark:bg-black transition-colors duration-500">
      {/* 배경 Orb 1 — 9s drift */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: isExiting ? 1 : (isLoading ? 0.3 : 0.6),
          x: [0, 30, -20, 0],
          y: [0, -25, 20, 0],
          scale: [1, 1.08, 0.95, 1],
          backgroundColor: isExiting ? '#ffffff' : from,
        }}
        transition={{
          opacity: { duration: isExiting ? 0.4 : 1.4 },
          x: { duration: 9, repeat: Infinity, ease: 'easeInOut' },
          y: { duration: 9, repeat: Infinity, ease: 'easeInOut' },
          scale: { duration: 9, repeat: Infinity, ease: 'easeInOut' },
          backgroundColor: { duration: 0.4 },
        }}
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full pointer-events-none mix-blend-multiply dark:mix-blend-normal"
        style={{ filter: 'blur(90px)' }}
      />
      {/* 배경 Orb 2 — 11s drift */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: isExiting ? 1 : (isLoading ? 0.3 : 0.6),
          x: [0, -25, 20, 0],
          y: [0, 20, -30, 0],
          scale: [1, 0.95, 1.06, 1],
          backgroundColor: isExiting ? '#ffffff' : to,
        }}
        transition={{
          opacity: { duration: isExiting ? 0.4 : 1.4, delay: 0.12 },
          x: { duration: 11, repeat: Infinity, ease: 'easeInOut' },
          y: { duration: 11, repeat: Infinity, ease: 'easeInOut' },
          scale: { duration: 11, repeat: Infinity, ease: 'easeInOut' },
          backgroundColor: { duration: 0.4 },
        }}
        className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full pointer-events-none mix-blend-multiply dark:mix-blend-normal"
        style={{ filter: 'blur(90px)' }}
      />

      <div className="fixed inset-0 flex items-end justify-center md:items-center p-4 md:p-6">
        <motion.div
          initial={{ y: 60, opacity: 0, scale: 0.94, filter: 'blur(6px)' }}
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
            type: 'spring',
            stiffness: 280,
            damping: 28,
            delay: 0.3,
          }}
          className="w-full md:max-w-[420px] rounded-[32px] backdrop-blur-2xl bg-white/55 dark:bg-zinc-900/60 border border-white/70 dark:border-white/10 shadow-2xl relative z-10 overflow-hidden"
          style={{ width: `min(100%, ${width}px)` }}
        >
          {/* 모바일 핸들 (Grabber) */}
          <div className="md:hidden flex justify-center pt-3">
            <div className="w-10 h-1 rounded-full bg-black/10 dark:bg-white/10" />
          </div>

          <div
            className="px-7 pt-5 md:pt-8"
            style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom))' }}
          >
            {children}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
