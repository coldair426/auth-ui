'use client';

import { ReactNode } from 'react';
import { motion, Variants } from 'framer-motion';

/**
 * 빵돌이 통합 인증 표준 애니메이션 Variants
 */
export const FADE_IN_UP: Variants = {
  hidden: { y: 15, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  }
};

export const STAGGER_CONTAINER: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.4
    }
  }
};

interface TypographyProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

/**
 * 표준 헤딩 컴포넌트
 */
export function Heading({ children, className = '', delay = 0 }: TypographyProps) {
  return (
    <motion.h1
      variants={FADE_IN_UP}
      transition={{ delay }}
      className={`text-[28px] md:text-[36px] font-extrabold text-[#2D2319] dark:text-zinc-50 tracking-[-0.04em] leading-[1.2] ${className}`}
    >
      {children}
    </motion.h1>
  );
}

/**
 * 표준 설명 텍스트 컴포넌트
 */
export function Description({ children, className = '', delay = 0 }: TypographyProps) {
  return (
    <motion.p
      variants={FADE_IN_UP}
      transition={{ delay }}
      className={`text-[15px] md:text-[16px] font-medium text-[#5C4D3E] dark:text-zinc-400 tracking-tight leading-relaxed ${className}`}
    >
      {children}
    </motion.p>
  );
}

/**
 * 표준 배지 컴포넌트
 */
export function Badge({ children, className = '', delay = 0 }: TypographyProps) {
  return (
    <motion.div
      variants={FADE_IN_UP}
      transition={{ delay }}
      className={`px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 w-fit ${className}`}
    >
      <span className="text-[11px] md:text-[12px] font-bold text-amber-700/70 dark:text-amber-400/70 tracking-[0.2em] uppercase">
        {children}
      </span>
    </motion.div>
  );
}
