'use client';

import { motion } from 'framer-motion';
import Image from "next/image";
import { PageLayout } from '@/components/ui/PageLayout';
import { Badge, Description, Heading, STAGGER_CONTAINER } from '@/components/ui/Typography';

export default function HomeContent() {
  return (
    <PageLayout width={400} footer={<Footer />}>
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
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "KRW" },
            "author": { "@type": "Organization", "name": "Team Breadkun", "url": "https://breadkun.com" }
          })
        }}
      />
      
      <motion.div initial="hidden" animate="show" variants={STAGGER_CONTAINER} className="flex flex-col items-center w-full">
        {/* Logo Section */}
        <motion.div
          variants={{
            hidden: { y: 20, opacity: 0, filter: 'blur(10px)' },
            show: { y: 0, opacity: 1, filter: 'blur(0px)', transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } }
          }}
          className="relative w-20 h-20 md:w-26 md:h-26 mb-6 md:mb-8"
        >
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="w-full h-full relative">
            <div className="absolute inset-0 bg-amber-500/30 blur-3xl rounded-full" />
            <Image 
              src="/logo.webp" 
              alt="빵돌이 로고" 
              fill 
              sizes="(max-width: 768px) 80px, 104px"
              className="object-contain relative z-10 drop-shadow-2xl" 
              priority 
            />
          </motion.div>
        </motion.div>

        <Badge className="mb-6">One Account. Every Access.</Badge>
        <Heading className="mb-4 md:mb-5 text-center">빵돌이 통합 인증</Heading>
        <Description className="mb-4 text-center break-keep">
          어디서나 간편하게<br />
          <span className="text-amber-600/90 dark:text-amber-500/90 font-bold">당신의 계정을 하나로 통합하세요</span>
        </Description>
      </motion.div>
    </PageLayout>
  );
}

function Footer() {
  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.8, duration: 1 }}
      className="text-[11px] font-bold text-amber-900/30 dark:text-amber-100/20 tracking-[0.2em] uppercase whitespace-nowrap"
    >
      © 2026 Team Breadkun
    </motion.footer>
  );
}
