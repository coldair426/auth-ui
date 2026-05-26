'use client';

import { motion } from 'framer-motion';

interface ClientLogoProps {
  logoUrl?: string;
  name: string;
  gradientFrom?: string;
  gradientTo?: string;
  size?: number;
  className?: string;
}

/**
 * 빵돌이 시그니처 클라이언트 로고 컴포넌트
 * 프레임 없이 로고 자체의 미학을 강조하며, 유영 애니메이션과 컬러 블룸 효과를 포함합니다.
 */
export function ClientLogo({
  logoUrl,
  name,
  gradientFrom = '#D97706',
  gradientTo = '#F59E0B',
  size = 80,
  className = '',
}: ClientLogoProps) {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -15 }}
      animate={{ scale: [0, 1.1, 1], rotate: 0 }}
      transition={{ 
        scale: { duration: 0.5, times: [0, 0.7, 1], ease: "easeOut", delay: 0.7 }, 
        rotate: { type: 'spring', stiffness: 300, damping: 20, delay: 0.7 } 
      }}
      className={`flex items-center justify-center relative ${className}`}
      style={{ width: size, height: size }}
    >
      {logoUrl ? (
        <motion.div 
          animate={{ y: [0, -size * 0.05, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-full h-full flex items-center justify-center relative z-10"
        >
          {/* 컬러 블룸 (Bloom) 효과 */}
          <div 
            className="absolute inset-0 blur-3xl opacity-20 rounded-full" 
            style={{ background: gradientFrom }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={logoUrl} 
            alt={name} 
            className="w-full h-full object-contain drop-shadow-2xl relative z-10" 
          />
        </motion.div>
      ) : (
        <motion.div
          animate={{ y: [0, -size * 0.04, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="flex items-center justify-center shadow-2xl text-white font-black relative z-10 tracking-tight"
          style={{ 
            width: size * 0.8, 
            height: size * 0.8, 
            borderRadius: size * 0.27,
            background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
            fontSize: size * 0.4
          }}
        >
          {name[0]}
        </motion.div>
      )}
    </motion.div>
  );
}
