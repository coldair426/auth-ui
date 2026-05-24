'use client';

import { Provider } from '@/types';
import { MouseEvent, useState } from 'react';

interface SocialLoginButtonProps {
  provider: Provider;
  onClick?: () => void;
  disabled?: boolean;
}

const providerConfig: Record<Provider, { label: string; icon: React.ReactNode }> = {
  naver: {
    label: '네이버로 로그인',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="#03C75A">
        <path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z" />
      </svg>
    ),
  },
  kakao: {
    label: '카카오로 로그인',
    icon: (
      <span
        className="flex items-center justify-center w-[18px] h-[18px] rounded-[4px]"
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
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
      </svg>
    ),
  },
};

export function SocialLoginButton({ provider, onClick, disabled = false }: SocialLoginButtonProps) {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);
  const config = providerConfig[provider];

  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = Date.now();
    setRipples((prev) => [...prev, { x: e.clientX - rect.left, y: e.clientY - rect.top, id }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 500);
    onClick?.();
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className="relative w-full h-11 rounded-xl overflow-hidden flex items-center gap-3 px-4 font-medium text-sm text-white/90 transition-all duration-150 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer hover:bg-white/[0.12]"
      style={{
        backgroundColor: 'rgba(255,255,255,0.07)',
        border: '1px solid rgba(255,255,255,0.12)',
      }}
    >
      {ripples.map(({ x, y, id }) => (
        <span
          key={id}
          className="absolute rounded-full pointer-events-none animate-ping"
          style={{
            left: x - 32,
            top: y - 32,
            width: 64,
            height: 64,
            backgroundColor: 'rgba(255,255,255,0.12)',
            animationDuration: '0.5s',
            animationIterationCount: 1,
          }}
        />
      ))}
      <span className="relative z-10 flex-shrink-0 flex items-center justify-center">
        {config.icon}
      </span>
      <span className="relative z-10">{config.label}</span>
    </button>
  );
}
