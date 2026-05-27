'use client';

import { motion } from 'framer-motion';

interface BrandFooterProps {
  delay?: number;
}

/**
 * 공용 푸터: "© 2026 Team Breadkun"
 * Home / Error 페이지 등에서 동일하게 사용됩니다.
 */
export function BrandFooter({ delay = 1.0 }: BrandFooterProps) {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 1 }}
      className="text-[11px] font-bold text-amber-900/30 dark:text-amber-100/20 tracking-[0.2em] uppercase whitespace-nowrap"
    >
      © 2026 Team Breadkun
    </motion.footer>
  );
}
