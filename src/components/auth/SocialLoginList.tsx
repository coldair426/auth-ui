'use client';

import { Provider } from '@/types';
import { motion } from 'framer-motion';
import { SocialLoginButton } from './SocialLoginButton';

interface SocialLoginListProps {
  textDark?: boolean;
  onLogin?: (provider: Provider) => void;
  disabled?: boolean;
}

const PROVIDERS: Provider[] = ['naver', 'kakao', 'google'];

export function SocialLoginList({
  textDark = false,
  onLogin,
  disabled = false,
}: SocialLoginListProps) {
  return (
    <div className="flex flex-col gap-3">
      {PROVIDERS.map((provider, index) => (
        <motion.div
          key={provider}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: index * 0.08, ease: 'easeOut' }}
        >
          <SocialLoginButton
            provider={provider}
            textDark={textDark}
            onClick={() => onLogin?.(provider)}
            disabled={disabled}
          />
        </motion.div>
      ))}
    </div>
  );
}
