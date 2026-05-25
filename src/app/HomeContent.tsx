'use client';

import { motion } from 'framer-motion';
import Image from "next/image";
import { PageLayout } from '@/components/ui/PageLayout';

export default function HomeContent() {
  // 시그니처 색상 정의
  const from = '#D97706';
  const to = '#F59E0B';

  return (
    <PageLayout 
      from={from} 
      to={to} 
      width={400}
      footer={
        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1 }}
          className="text-[11px] font-bold text-amber-900/30 dark:text-amber-100/20 tracking-[0.2em] uppercase whitespace-nowrap"
        >
          © 2026 Breadkun Corporation
        </motion.footer>
      }
    >
      {/* JSON-LD for AI SEO (GEO) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "빵돌이 통합 인증",
            "operatingSystem": "Web",
            "applicationCategory": "SecurityApplication",
            "description": "어디서나 간편하게, 당신의 계정을 하나로 통합하세요. 빵돌이 통합 인증은 안전하고 빠른 로그인을 지원합니다.",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "KRW"
            },
            "author": {
              "@type": "Organization",
              "name": "Breadkun Corporation",
              "url": "https://breadkun.com"
            }
          })
        }}
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
        {/* Logo Section */}
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
          className="text-[15px] md:text-[17px] font-medium text-[#5C4D3E] dark:text-zinc-400 tracking-tight leading-relaxed mb-4 text-center"
        >
          어디서나 간편하게<br />
          <span className="text-amber-600/90 dark:text-amber-500/90 font-bold">당신의 계정을 하나로 통합하세요</span>
        </motion.p>
      </motion.div>
    </PageLayout>
  );
}
