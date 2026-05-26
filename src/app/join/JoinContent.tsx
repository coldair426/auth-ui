'use client';

import { Button } from '@/components/ui/Button';
import { ClientLogo } from '@/components/ui/ClientLogo';
import { PageLayout } from '@/components/ui/PageLayout';
import { joinProject } from '@/lib/api/auth';
import { useAuthStore } from '@/store/authStore';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useMemo } from 'react';
import NextLink from 'next/link';
import { useClientInfo } from '@/hooks/useClientInfo';

interface ConsentItemProps {
  id: string;
  label: string;
  sublabel?: string;
  link?: string;
  required?: boolean;
  checked: boolean;
  onChange: (id: string, checked: boolean) => void;
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className}
      width="12" 
      height="12" 
      viewBox="0 0 12 12" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 8 9 4" />
    </svg>
  );
}

function ConsentItem({ id, label, sublabel, link, required, checked, onChange }: ConsentItemProps) {
  return (
    <div 
      className="flex items-start gap-3 py-1 group cursor-pointer"
      onClick={() => onChange(id, !checked)}
    >
      <div className={`
        mt-0.5 shrink-0 w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center
        ${checked 
          ? 'bg-black border-black dark:bg-white dark:border-white text-white dark:text-black' 
          : 'border-black/10 dark:border-white/10 group-hover:border-black/20 dark:group-hover:border-white/20'}
      `}>
        {checked && <CheckIcon />}
      </div>
      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <div className="flex items-start justify-between gap-2">
          <span className="text-[13px] font-bold text-gray-900 dark:text-zinc-100 flex items-start gap-1 leading-tight">
            {required && <span className="text-blue-500 dark:text-blue-400 shrink-0">[필수]</span>}
            <span className="break-keep">{label}</span>
          </span>
          {link && (
            <NextLink 
              href={link} 
              target="_blank"
              onClick={(e) => e.stopPropagation()}
              className="text-[11px] font-semibold text-black/30 dark:text-zinc-500 underline underline-offset-2 hover:text-black dark:hover:text-zinc-300 transition-colors shrink-0 pt-0.5"
            >
              보기
            </NextLink>
          )}
        </div>
        {sublabel && (
          <p className="text-[11px] font-medium text-black/40 dark:text-zinc-400 leading-tight break-keep">
            {sublabel}
          </p>
        )}
      </div>
    </div>
  );
}

export function JoinContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { client, clientId, isLoading, redirectUri, mode } = useClientInfo();
  
  const isNewUser = searchParams.get('isNewUser') !== 'false';

  const [joining, setJoining] = useState(false);
  const [canceling, setCanceling] = useState(false);

  // Consent State
  const [consents, setConsents] = useState<Record<string, boolean>>({
    tos: false,
    privacy: false,
    thirdParty: false,
  });

  const handleConsentChange = (id: string, checked: boolean) => {
    setConsents(prev => ({ ...prev, [id]: checked }));
  };

  const isAllRequiredChecked = useMemo(() => {
    if (isNewUser) {
      return consents.tos && consents.privacy && consents.thirdParty;
    }
    return consents.thirdParty; // Existing users only need to agree to information provision to the new project
  }, [consents, isNewUser]);

  function handleComplete(accessToken: string) {
    if (mode === 'popup') {
      const targetOrigin = redirectUri ? new URL(redirectUri).origin : '*';
      globalThis.opener?.postMessage({ type: 'AUTH_SUCCESS', accessToken }, targetOrigin);
      globalThis.close();
      return;
    }
    globalThis.location.assign(redirectUri);
  }

  async function handleJoin() {
    if (!clientId || joining || !isAllRequiredChecked) return;
    setJoining(true);
    try {
      await joinProject(clientId);
      const { accessToken } = useAuthStore.getState();
      handleComplete(accessToken ?? '');
    } catch {
      router.replace('/error?code=JOIN_FAILED');
    } finally {
      setJoining(false);
    }
  }

  function handleCancel() {
    setCanceling(true);
    if (mode === 'popup') {
      globalThis.close();
      return;
    }
    globalThis.location.assign(redirectUri);
  }

  if (isLoading || !client) {
    return (
      <PageLayout from="#f3f4f6" to="#e5e7eb" width={400}>
        <div className="flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0.5 }}
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-16 h-16 rounded-[22px] bg-black/6 dark:bg-white/6 mb-6" 
          />
          <div className="space-y-3 w-full flex flex-col items-center mb-8">
            <div className="h-4 w-24 bg-black/4 dark:bg-white/4 rounded-full" />
            <div className="h-8 w-40 bg-black/6 dark:bg-white/6 rounded-xl" />
          </div>
          <div className="w-full h-40 rounded-3xl bg-black/3 dark:bg-white/3" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout from={client.gradientFrom} to={client.gradientTo} width={400}>
      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.12,
              delayChildren: 0.4
            }
          }
        }}
        className="flex flex-col items-center w-full"
      >
        {/* Logo & Title Section */}
        <div className="flex flex-col items-center mb-6 md:mb-8 text-center">
          <ClientLogo
            logoUrl={client.logoUrl}
            name={client.name}
            gradientFrom={client.gradientFrom}
            gradientTo={client.gradientTo}
            size={80}
            className="mb-3 md:size-[112px] md:mb-2"
          />
          <motion.h1
            variants={{
              hidden: { y: 15, opacity: 0, filter: 'blur(10px)' },
              show: { y: 0, opacity: 1, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
            }}
            className="text-[24px] md:text-[28px] font-extrabold tracking-tight leading-tight text-gray-900 dark:text-white"
          >
            {client.name}
          </motion.h1>
          <motion.p
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { duration: 0.5, delay: 0.1 } }
            }}
            className="text-[13px] md:text-[14px] font-semibold text-black/40 dark:text-zinc-400 mt-1.5 max-w-[280px] break-keep"
          >
            {isNewUser ? (
                <>빵돌이 통합 인증 계정을 생성하고,<br />서비스를 시작합니다</>
            ) : (
                '빵돌이 통합 인증 계정으로 서비스를 연결합니다'
            )}
          </motion.p>
        </div>

        {/* Disclaimer Box */}
        <motion.div
          variants={{
            hidden: { y: 15, opacity: 0, filter: 'blur(8px)' },
            show: { y: 0, opacity: 1, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
          }}
          className="w-full mb-6 md:mb-8 overflow-hidden rounded-3xl md:rounded-4xl bg-black/3 dark:bg-white/3 border border-black/5 dark:border-white/10 backdrop-blur-sm p-5 md:p-6"
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between mb-1">
              <span className="font-black text-[14px] tracking-tight text-gray-900 dark:text-zinc-100">
                약관 및 정보 제공 동의
              </span>
              {isNewUser && (
                <button 
                  onClick={() => {
                    const allTrue = Object.values(consents).every(v => v);
                    setConsents({
                      tos: !allTrue,
                      privacy: !allTrue,
                      thirdParty: !allTrue,
                    });
                  }}
                  className="text-[11px] font-bold text-blue-500 dark:text-blue-400 hover:opacity-80 transition-opacity"
                >
                  모두 동의
                </button>
              )}
            </div>

            <div className="space-y-3 md:space-y-4">
              {isNewUser && (
                <>
                  <ConsentItem 
                    id="tos"
                    label="서비스 이용약관"
                    required
                    link="/policies/terms-of-service"
                    checked={consents.tos}
                    onChange={handleConsentChange}
                  />
                  <ConsentItem 
                    id="privacy"
                    label="개인정보 처리방침"
                    required
                    link="/policies/privacy-policy"
                    checked={consents.privacy}
                    onChange={handleConsentChange}
                  />
                </>
              )}
              <ConsentItem 
                id="thirdParty"
                label={`제3자 정보 제공 동의 (${client.name})`}
                sublabel={`서비스 이용을 위한 최소한의 프로필 정보가 제공됩니다.`}
                required
                link="/policies/third-party-consent"
                checked={consents.thirdParty}
                onChange={handleConsentChange}
              />
            </div>
          </div>
        </motion.div>

        {/* Actions Section */}
        <motion.div
          variants={{
            hidden: { y: 15, opacity: 0 },
            show: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
          }}
          className="flex flex-col gap-2.5 md:gap-3 w-full"
        >
          <Button
            variant="primary"
            fullWidth
            loading={joining}
            disabled={canceling || !isAllRequiredChecked}
            onClick={handleJoin}
            className={`h-13 md:h-14 rounded-2xl text-[15px] md:text-[16px] text-white shadow-xl transition-all duration-300 active:scale-[0.98] ${!isAllRequiredChecked ? 'opacity-50 grayscale cursor-not-allowed shadow-none' : ''}`}
            style={isAllRequiredChecked ? {
              background: `linear-gradient(135deg, ${client.gradientFrom}, ${client.gradientTo})`,
              boxShadow: `0 12px 24px -8px ${client.gradientFrom}60`
            } : {}}
          >
            {isNewUser ? '계정 생성 및 시작하기' : `시작하기`}
          </Button>
          <Button
            variant="ghost"
            fullWidth
            loading={canceling}
            disabled={joining}
            onClick={handleCancel}
            className="h-11 md:h-12 rounded-2xl font-bold text-[14px] text-black/30 dark:text-zinc-500 hover:text-black dark:hover:text-zinc-300 transition-colors"
          >
            취소
          </Button>
        </motion.div>
      </motion.div>
    </PageLayout>
  );
}
