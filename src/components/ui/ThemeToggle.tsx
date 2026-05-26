'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { showToast } from './Toast';

type Theme = 'auto' | 'light' | 'dark';

/**
 * 최적화된 테마 토글 컴포넌트
 * - 아이콘 중심으로 간결하게 디자인되었습니다.
 * - 변경 시 토스트 알림을 띄워 시각적 피드백을 제공합니다.
 */
export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<Theme>('auto');
  const isFirstRender = useRef(true);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const applyTheme = () => {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const isDark = theme === 'dark' || (theme === 'auto' && systemPrefersDark);
      
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    applyTheme();
    localStorage.setItem('theme', theme);

    // 첫 렌더링(초기 설정 로드) 시에는 토스트를 띄우지 않음
    if (!isFirstRender.current) {
      const themeNames = { auto: '자동', light: '라이트', dark: '다크' };
      showToast(`${themeNames[theme]} 테마가 적용되었습니다.`, 'info');
    } else {
      isFirstRender.current = false;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'auto') applyTheme();
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, mounted]);

  if (!mounted) return null;

  const options: { value: Theme; icon: string; label: string }[] = [
    { value: 'light', icon: '☀️', label: '라이트' },
    { value: 'auto', icon: '🌓', label: '자동' },
    { value: 'dark', icon: '🌙', label: '다크' },
  ];

  return (
    <div className="flex items-center p-0.5 rounded-full bg-zinc-500/5 dark:bg-white/5 backdrop-blur-sm border border-black/5 dark:border-white/5 w-fit">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => setTheme(opt.value)}
          className={`
            relative p-2 rounded-full transition-all duration-300 flex items-center justify-center
            ${theme === opt.value 
              ? 'text-zinc-900 dark:text-white' 
              : 'text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300'}
          `}
          title={`${opt.label} 모드`}
          aria-label={`${opt.label} 모드`}
        >
          {theme === opt.value && (
            <motion.div
              layoutId="activeTheme"
              className="absolute inset-0 bg-white/80 dark:bg-zinc-800 shadow-[0_2px_8px_rgba(0,0,0,0.08)] dark:shadow-none rounded-full"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative z-10 text-base leading-none filter drop-shadow-sm">{opt.icon}</span>
        </button>
      ))}
    </div>
  );
}
