'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isDarkTheme = document.documentElement.classList.contains('dark');
    setIsDark(isDarkTheme);
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
    >
      <div className="relative w-6 h-6 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.span
              key="moon"
              initial={{ y: 10, opacity: 0, rotate: -20 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              exit={{ y: -10, opacity: 0, rotate: 20 }}
              className="absolute text-2xl"
            >
              🌙
            </motion.span>
          ) : (
            <motion.span
              key="sun"
              initial={{ y: 10, opacity: 0, rotate: 20 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              exit={{ y: -10, opacity: 0, rotate: -20 }}
              className="absolute text-2xl"
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
