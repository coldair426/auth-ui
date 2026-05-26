'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { ConsentTrigger, PolicyMeta, ConsentRequest, PolicyType } from '@/types/consent';
import { postConsents } from '@/lib/api/consent';
import { showToast } from '@/components/ui/Toast';

interface ConsentModalProps {
  trigger: ConsentTrigger;
  serviceId?: string;
  serviceName?: string;
  pendingPolicies: PolicyMeta[];
  onComplete: () => void;
  onCancel?: () => void;
}

export function ConsentModal({
  trigger,
  serviceId,
  serviceName = '서비스',
  pendingPolicies,
  onComplete,
  onCancel,
}: ConsentModalProps) {
  const [agreed, setAgreed] = useState<Record<PolicyType, boolean>>({
    TERMS: false,
    PRIVACY: false,
    THIRD_PARTY: false,
  });
  
  // 선택 항목 (예제용)
  const [marketingAgreed, setMarketingAgreed] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggle = (type: PolicyType) => {
    setAgreed(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const isAllRequiredAgreed = pendingPolicies.every(policy => agreed[policy.type]);

  const handleSubmit = async () => {
    if (!isAllRequiredAgreed) return;

    setIsSubmitting(true);
    try {
      const request: ConsentRequest = {
        consents: pendingPolicies.map(p => ({
          policyType: p.type,
          version: p.version,
        })),
        ...(serviceId && { serviceId }),
      };

      await postConsents(request);
      onComplete();
    } catch (error) {
      showToast('동의 처리 중 오류가 발생했습니다.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 렌더링 헬퍼
  const getTitle = () => {
    switch (trigger) {
      case 'SIGNUP': return '환영합니다! 가입을 위해 동의가 필요해요.';
      case 'SERVICE_FIRST_ACCESS': return `${serviceName}을(를) 이용하려면 추가 동의가 필요해요.`;
      case 'POLICY_UPDATED': return '이용약관이 일부 변경되었어요.';
      default: return '동의가 필요합니다.';
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onCancel}
        />
        
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-md bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 rounded-[32px] p-6 md:p-8 shadow-2xl overflow-hidden"
        >
          <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6">
            {getTitle()}
          </h2>
          
          <div className="space-y-4 mb-8">
            {pendingPolicies.map((policy) => (
              <div key={policy.type} className="flex flex-col gap-1 p-4 rounded-2xl bg-black/[0.03] dark:bg-white/[0.03] border border-black/5 dark:border-white/5">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center mt-0.5">
                    <input
                      type="checkbox"
                      className="peer appearance-none w-5 h-5 border-2 border-gray-300 dark:border-zinc-600 rounded-md checked:border-amber-500 checked:bg-amber-500 transition-all"
                      checked={agreed[policy.type]}
                      onChange={() => handleToggle(policy.type)}
                    />
                    <svg className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-bold text-gray-900 dark:text-zinc-100">
                        [필수] {policy.title}
                      </span>
                      <a href={`/policies/${policy.slug}?version=${policy.version}`} target="_blank" rel="noopener noreferrer" className="text-[11px] font-semibold text-amber-600 dark:text-amber-500 hover:underline underline-offset-2">
                        전문보기 ↗
                      </a>
                    </div>
                    <p className="text-[12px] font-medium text-gray-500 dark:text-zinc-400 mt-1 leading-relaxed">
                      {policy.summary}
                    </p>
                  </div>
                </label>
              </div>
            ))}

            {/* 선택 동의 예시 (SIGNUP 시에만) */}
            {trigger === 'SIGNUP' && (
              <div className="flex flex-col gap-1 p-4 rounded-2xl bg-black/[0.03] dark:bg-white/[0.03] border border-black/5 dark:border-white/5">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center mt-0.5">
                    <input
                      type="checkbox"
                      className="peer appearance-none w-5 h-5 border-2 border-gray-300 dark:border-zinc-600 rounded-md checked:border-amber-500 checked:bg-amber-500 transition-all"
                      checked={marketingAgreed}
                      onChange={() => setMarketingAgreed(!marketingAgreed)}
                    />
                    <svg className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  </div>
                  <div className="flex-1">
                    <span className="text-[14px] font-bold text-gray-900 dark:text-zinc-100">
                      [선택] 마케팅 정보 수신 동의
                    </span>
                    <p className="text-[12px] font-medium text-gray-500 dark:text-zinc-400 mt-1 leading-relaxed">
                      이벤트 및 혜택 정보를 받아보시겠어요?
                    </p>
                  </div>
                </label>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <Button 
              variant="primary"
              fullWidth
              loading={isSubmitting}
              disabled={!isAllRequiredAgreed}
              onClick={handleSubmit}
              className="h-14 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white shadow-xl shadow-amber-600/20 disabled:opacity-50"
            >
              동의하고 계속하기
            </Button>
            {onCancel && (
              <Button 
                variant="ghost" 
                fullWidth
                disabled={isSubmitting}
                onClick={onCancel}
                className="h-12 rounded-2xl font-bold text-[14px] text-black/40 dark:text-zinc-500 hover:text-black dark:hover:text-zinc-300"
              >
                {trigger === 'POLICY_UPDATED' ? '로그아웃' : '취소'}
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
