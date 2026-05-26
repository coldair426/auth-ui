'use client';

import { PageLayout } from '@/components/ui/PageLayout';
import { Heading, Description } from '@/components/ui/Typography';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export default function PrivacyPage() {
  const router = useRouter();

  return (
    <PageLayout width={600}>
      <div className="max-h-[70vh] overflow-y-auto pr-4 custom-scrollbar">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8 text-left"
        >
          <section>
            <Heading className="text-2xl mb-4">개인정보 처리방침</Heading>
            <Description className="text-sm leading-relaxed">
              Team Breadkun은 사용자의 개인정보를 소중하게 생각하며, 관련 법령을 준수합니다. 본 방침은 사용자의 데이터가 어떻게 수집되고 이용되는지 설명합니다.
            </Description>
          </section>

          <section className="space-y-4">
            <h3 className="font-bold text-gray-900 dark:text-white">1. 수집하는 항목</h3>
            <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">
              인증 시 제공되는 항목: 이메일, 프로필 이름, 프로필 이미지 URL, 고유 식별자.
            </p>

            <h3 className="font-bold text-gray-900 dark:text-white">2. 개인정보의 제3자 제공</h3>
            <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">
              사용자가 특정 서비스(클라이언트)에 로그인을 시도할 경우, 서비스 제공을 위해 최소한의 정보를 해당 운영자에게 제공합니다.<br />
              - 제공받는 자: 개별 서비스 운영자<br />
              - 제공 항목: 고유 식별자, 프로필 정보<br />
              - 보유 기간: 서비스 이용 종료 시 혹은 사용자의 동의 철회 시까지
            </p>

            <h3 className="font-bold text-gray-900 dark:text-white">3. 개인정보의 파기</h3>
            <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">
              팀은 원칙적으로 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다.
            </p>
          </section>
        </motion.div>
      </div>

      <div className="mt-8 flex justify-center">
        <Button variant="ghost" onClick={() => router.back()}>이전으로 돌아가기</Button>
      </div>
    </PageLayout>
  );
}
