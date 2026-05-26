'use client';

import { PageLayout } from '@/components/ui/PageLayout';
import { Heading, Description } from '@/components/ui/Typography';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export default function TermsPage() {
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
            <Heading className="text-2xl mb-4">서비스 이용약관</Heading>
            <Description className="text-sm leading-relaxed">
              본 약관은 Team Breadkun(이하 &quot;팀&quot;)이 제공하는 빵돌이 통합 인증 서비스(이하 &quot;서비스&quot;)의 이용 조건 및 절차에 관한 사항을 규정함을 목적으로 합니다.
            </Description>
          </section>

          <section className="space-y-4">
            <h3 className="font-bold text-gray-900 dark:text-white">제 1 조 (목적)</h3>
            <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">
              서비스는 사용자가 하나의 계정으로 팀이 운영하거나 제휴한 다양한 서비스를 편리하게 이용할 수 있도록 돕는 통합 인증 시스템입니다.
            </p>

            <h3 className="font-bold text-gray-900 dark:text-white">제 2 조 (용어의 정의)</h3>
            <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">
              1. &quot;통합 계정&quot;이라 함은 서비스를 이용하기 위해 사용자가 등록한 고유의 식별 정보를 의미합니다.<br />
              2. &quot;클라이언트&quot;라 함은 통합 인증을 통해 사용자에게 서비스를 제공하는 개별 운영 주체를 의미합니다.
            </p>

            <h3 className="font-bold text-gray-900 dark:text-white">제 3 조 (팀의 의무와 책임)</h3>
            <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">
              1. 팀은 안정적인 인증 환경을 제공하기 위해 최선을 다합니다.<br />
              2. 개별 클라이언트 서비스 내에서 발생하는 모든 활동 및 데이터 관리는 해당 클라이언트 운영자의 책임이며, 팀은 이에 대해 보증하거나 책임지지 않습니다.
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
