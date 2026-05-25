'use client';

import { motion } from 'framer-motion';
import Image from "next/image";

export default function Home() {
  // 시그니처 색상 정의
  const from = '#D97706';
  const to = '#F59E0B';

  return (
    <main className="fixed inset-0 overflow-hidden bg-[#fdfdfd] dark:bg-[#050505] transition-colors duration-1000 flex items-center justify-center p-6">
      {/* Cinematic Grain Overlay */}
      <div className="absolute inset-0 z-[1] pointer-events-none opacity-[0.03] dark:opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* 배경 Orb 1 — Amber Primary */}
      <motion.div
        animate={{
          x: [0, 150, -100, 80, 0],
          y: [0, -150, 120, -80, 0],
          scale: [1, 1.4, 0.7, 1.2, 1],
          rotate: [0, 120, 240, 360],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-[15%] -left-[10%] w-[800px] h-[800px] rounded-full pointer-events-none mix-blend-multiply dark:mix-blend-normal opacity-60"
        style={{ filter: 'blur(100px)', background: `radial-gradient(circle, ${from} 0%, transparent 70%)` }}
      />
      
      {/* 배경 Orb 2 — Orange Secondary */}
      <motion.div
        animate={{
          x: [0, -180, 120, -60, 0],
          y: [0, 140, -150, 80, 0],
          scale: [1, 0.8, 1.3, 0.9, 1],
          rotate: [360, 240, 120, 0],
        }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-[15%] -right-[15%] w-[900px] h-[900px] rounded-full pointer-events-none mix-blend-multiply dark:mix-blend-normal opacity-50"
        style={{ filter: 'blur(120px)', background: `radial-gradient(circle, ${to} 0%, transparent 70%)` }}
      />

      {/* 배경 Orb 3 — Indigo/Purple Accent for Depth */}
      <motion.div
        animate={{
          x: [0, 200, -150, 0],
          y: [0, 100, -100, 0],
          scale: [0.8, 1.2, 0.8],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[20%] right-[5%] w-[600px] h-[600px] rounded-full pointer-events-none mix-blend-overlay opacity-30"
        style={{ filter: 'blur(110px)', background: `radial-gradient(circle, #6366f1 0%, transparent 70%)` }}
      />

      {/* 배경 Orb 4 — Cyan/Teal Accent for Richness */}
      <motion.div
        animate={{
          x: [0, -150, 150, 0],
          y: [0, -100, 100, 0],
          scale: [1, 0.7, 1.1, 1],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[10%] left-[5%] w-[500px] h-[500px] rounded-full pointer-events-none mix-blend-soft-light opacity-20"
        style={{ filter: 'blur(90px)', background: `radial-gradient(circle, #06b6d4 0%, transparent 70%)` }}
      />

      {/* 시그니처 간판 (Signboard) */}
      <motion.div
        initial={{ scale: 0.96, opacity: 0, filter: 'blur(20px)' }}
        animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-[400px] rounded-[64px] backdrop-blur-[50px] bg-white/70 md:bg-white/45 dark:bg-zinc-900/80 md:dark:bg-zinc-900/50 border border-white/80 dark:border-white/10 shadow-[0_50px_100px_-20px_rgba(217,119,6,0.25)] overflow-hidden p-10 md:p-14 flex flex-col items-center text-center"
      >
        {/* Shimmer Flare Animation (Enhanced) */}
        <motion.div 
          animate={{ x: ['-200%', '200%'], opacity: [0, 1, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none z-[11]"
        />
        
        {/* Unified Stagger Container */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.14,
                delayChildren: 0.5
              }
            }
          }}
          className="flex flex-col items-center w-full"
        >
          <motion.div
            variants={{
              hidden: { y: 20, opacity: 0, filter: 'blur(10px)' },
              show: { y: 0, opacity: 1, filter: 'blur(0px)', transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } }
            }}
            className="relative w-24 h-24 md:w-26 md:h-26 mb-8"
          >
            <motion.div 
              animate={{ 
                y: [0, -8, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-full h-full relative"
            >
              <div className="absolute inset-0 bg-amber-500/30 blur-3xl rounded-full" />
              <Image
                src="/logo.webp"
                alt="빵돌이 로고"
                fill
                className="object-contain relative z-10 drop-shadow-2xl"
                priority
              />
            </motion.div>
          </motion.div>
          {/* Badge Section */}
          <motion.div
            variants={{
              hidden: { y: 15, opacity: 0, filter: 'blur(6px)' },
              show: { y: 0, opacity: 1, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
            }}
            className="px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6"
          >
            <span className="text-[11px] md:text-[12px] font-bold text-amber-700/70 dark:text-amber-400/70 tracking-[0.2em] uppercase">
              One Account. Every Access.
            </span>
          </motion.div>
          
          {/* Title Section */}
          <motion.div
            variants={{
              hidden: { y: 15, opacity: 0, filter: 'blur(10px)' },
              show: { y: 0, opacity: 1, filter: 'blur(0px)', transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } }
            }}
            className="relative mb-5"
          >
            <h1 className="text-[32px] md:text-[40px] font-extrabold text-[#2D2319] dark:text-zinc-50 tracking-[-0.04em] leading-[1.2]">
              빵돌이 통합 인증
            </h1>
          </motion.div>
          
          {/* Description Section */}
          <motion.p
            variants={{
              hidden: { y: 10, opacity: 0, filter: 'blur(4px)' },
              show: { y: 0, opacity: 1, filter: 'blur(0px)', transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } }
            }}
            className="text-[15px] md:text-[17px] font-medium text-[#5C4D3E] dark:text-zinc-400 tracking-tight leading-relaxed"
          >
            어디서나 간편하게<br />
            <span className="text-amber-600/90 dark:text-amber-500/90 font-bold">당신의 계정을 하나로 통합하세요</span>
          </motion.p>
        </motion.div>
      </motion.div>

      {/* 푸터 */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="fixed bottom-10 z-20 text-[11px] font-bold text-amber-900/30 dark:text-amber-100/20 tracking-[0.2em] uppercase"
      >
        © 2026 Breadkun Corporation
      </motion.footer>
    </main>
  );
}
