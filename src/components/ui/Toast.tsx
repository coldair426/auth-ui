'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export type ToastType = 'info' | 'success' | 'error';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

/**
 * 전역 알림 시스템을 위한 싱글톤 이벤트 핸들러
 */
let toastCallback: (message: string, type: ToastType) => void;

export const showToast = (message: string, type: ToastType = 'info') => {
  if (toastCallback) toastCallback(message, type);
};

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    toastCallback = (message, type) => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);
    };
  }, []);

  return (
    <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[10000] flex flex-col items-center gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ y: 20, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`
              px-5 py-2.5 rounded-2xl shadow-lg backdrop-blur-xl border flex items-center gap-3 pointer-events-auto
              whitespace-nowrap min-w-fit max-w-[90vw]
              ${toast.type === 'info' ? 'bg-white/70 dark:bg-zinc-800/70 border-zinc-200/50 dark:border-white/5 text-zinc-600 dark:text-zinc-300' : ''}
              ${toast.type === 'success' ? 'bg-emerald-500/90 border-emerald-400 text-white' : ''}
              ${toast.type === 'error' ? 'bg-rose-500/90 border-rose-400 text-white' : ''}
            `}
          >
            <span className="text-sm font-medium tracking-tight">{toast.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
