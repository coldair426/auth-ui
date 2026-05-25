'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * 테마 토글 컴포넌트
 * - 사용자의 설정을 localStorage에 저장하여 기억합니다.
 * - 설정이 없는 경우 시스템 테마(Dark Mode) 설정을 따릅니다.
 * - 아이콘은 표준 유니코드 이모지를 사용하여 저작권 문제에서 자유롭습니다.
 */
export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // 1. 저장된 설정 확인
    const savedTheme = localStorage.getItem('theme');
    // 2. 시스템 설정 확인
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // 우선순위: 저장된 설정 > 시스템 설정
    const initialDark = savedTheme === 'dark' || (!savedTheme && systemPrefersDark);
    
    setIsDark(initialDark);
    if (initialDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    
    if (newDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  if (!mounted) return null;

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="fixed bottom-8 right-8 z-[9999] w-14 h-14 rounded-full bg-white/40 dark:bg-zinc-900/40 backdrop-blur-2xl border border-white/50 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.12)] flex items-center justify-center cursor-pointer group"
      aria-label="테마 전환"
    >
      <div className="relative w-6 h-6 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.span
              key="moon"
              initial={{ y: 10, opacity: 0, rotate: -20 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              exit={{ y: -10, opacity: 0, rotate: 20 }}
              className="absolute text-2xl select-none"
            >
              🌙
            </motion.span>
          ) : (
            <motion.span
              key="sun"
              initial={{ y: 10, opacity: 0, rotate: 20 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              exit={{ y: -10, opacity: 0, rotate: -20 }}
              className="absolute text-2xl select-none"
            >
              ☀️
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      
      {/* 시각적 피드백: Hover시 링 효과 */}
      <div className="absolute inset-0 rounded-full border-2 border-amber-500/0 group-hover:border-amber-500/20 transition-colors" />
    </motion.button>
  );
}
