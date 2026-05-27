'use client';

import { Provider } from '@/types';
import { motion } from 'framer-motion';
import { MouseEvent, useState } from 'react';

interface SocialLoginButtonProps {
  provider: Provider;
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  isDimmed?: boolean;
}

const accentColors: Record<Provider, string> = {
  naver: '#03C75A',
  kakao: '#FEE500',
  google: '#4285F4',
};

const tintClasses: Record<Provider, string> = {
  naver: 'bg-[rgba(3,199,90,0.08)] hover:bg-[rgba(3,199,90,0.14)] dark:bg-[rgba(3,199,90,0.15)] dark:hover:bg-[rgba(3,199,90,0.25)]',
  kakao: 'bg-[rgba(254,229,0,0.12)] hover:bg-[rgba(254,229,0,0.2)] dark:bg-[rgba(254,229,0,0.18)] dark:hover:bg-[rgba(254,229,0,0.3)]',
  google: 'bg-[rgba(66,133,244,0.08)] hover:bg-[rgba(66,133,244,0.14)] dark:bg-[rgba(66,133,244,0.15)] dark:hover:bg-[rgba(66,133,244,0.25)]',
};

const providerConfig: Record<Provider, { label: string; ariaLabel: string; icon: React.ReactNode }> = {
  naver: {
    label: '네이버로 로그인',
    ariaLabel: '네이버 계정으로 로그인',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="#03C75A">
        <path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z" />
      </svg>
    ),
  },
  kakao: {
    label: '카카오로 로그인',
    ariaLabel: '카카오 계정으로 로그인',
    icon: (
      <span
        className="flex items-center justify-center w-[18px] h-[18px] rounded-[4px] flex-shrink-0"
        style={{ backgroundColor: '#FEE500' }}
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="#3C1E1E">
          <path d="M12 3C6.477 3 2 6.582 2 11c0 2.819 1.786 5.296 4.5 6.77L5.5 21l4.077-2.687C10.344 18.432 11.16 18.5 12 18.5c5.523 0 10-3.582 10-8S17.523 3 12 3z" />
        </svg>
      </span>
    ),
  },
  google: {
    label: 'Google로 로그인',
    ariaLabel: '구글 계정으로 로그인',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" className="flex-shrink-0">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
      </svg>
    ),
  },
};

export function SocialLoginButton({
  provider,
  onClick,
  disabled = false,
  isLoading = false,
  isDimmed = false,
}: SocialLoginButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);
  const config = providerConfig[provider];

  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    if (disabled || isLoading || isDimmed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const id = Date.now();
    setRipples((prev) => [...prev, { x: e.clientX - rect.left, y: e.clientY - rect.top, id }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 500);
    onClick?.();
  }

  return (
    <motion.button
      onMouseEnter={() => !isLoading && !isDimmed && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={!isLoading && !isDimmed ? { scale: 1.015, x: 2 } : {}}
      whileTap={!isLoading && !isDimmed ? { scale: 0.985 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={handleClick}
      disabled={disabled || isLoading || isDimmed}
      aria-label={config.ariaLabel}
      className={`relative w-full h-14 overflow-hidden flex items-center gap-3.5 text-[15px] font-bold tracking-tight transition-all duration-300 rounded-2xl px-5 border border-black/[0.06] dark:border-white/[0.08] text-gray-800 dark:text-zinc-100 ${tintClasses[provider]} ${
        isDimmed ? 'opacity-30 pointer-events-none' : 'opacity-100'
      } ${
        disabled || isLoading || isDimmed ? 'cursor-not-allowed' : 'cursor-pointer'
      }`}
    >
      {/* 브랜드 컬러 accent bar */}
      <motion.span
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: isHovered && !isLoading ? 1 : 0, opacity: isHovered && !isLoading ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="absolute left-0 top-[20%] h-[60%] w-[3px] rounded-r-[2px] origin-center"
        style={{ backgroundColor: accentColors[provider] }}
      />

      {/* ripple */}
      {ripples.map(({ x, y, id }) => (
        <span
          key={id}
          className="absolute rounded-full pointer-events-none bg-black/5 animate-ping"
          style={{
            left: x - 40,
            top: y - 40,
            width: 80,
            height: 80,
            animationDuration: '0.6s',
          }}
        />
      ))}

      <div className="relative z-10 flex items-center justify-center w-[20px] h-[20px] flex-shrink-0">
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
        ) : (
          config.icon
        )}
      </div>
      <span className="relative z-10 flex-1 text-left">{config.label}</span>
      {!isLoading && (
        <span className="relative z-10 text-black/20 text-lg font-light">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </span>
      )}
    </motion.button>
  );
}
