import { Metadata } from 'next';
import { Suspense } from 'react';
import { getClientInfo } from '@/lib/api/account';
import { MOCK_CLIENT_ID } from '@/lib/api/mock';
import { JoinContent } from './JoinContent';

interface Props {
  searchParams: Promise<{ clientId?: string }>;
}

export async function generateMetadata(
  { searchParams }: Props
): Promise<Metadata> {
  const { clientId: rawClientId } = await searchParams;
  const isDev = process.env.NODE_ENV === 'development';
  const clientId = rawClientId || (isDev ? MOCK_CLIENT_ID : null);

  if (!clientId) {
    return {
      title: '빵돌이 통합 인증',
      description: '서비스 연결을 위해 올바른 링크로 접속해주세요.',
    };
  }

  try {
    const client = await getClientInfo(clientId);
    return {
      title: `${client.name} | 빵돌이 통합 인증`,
      description: isDev 
        ? `[개발 모드] ${client.name} UI를 확인 중입니다.`
        : `${client.name} 서비스를 위한 인증 화면입니다.`,
      openGraph: {
        title: `${client.name} | 빵돌이 통합 인증`,
        description: `${client.name} 서비스를 위한 인증 화면입니다.`,
        images: client.logoUrl ? [client.logoUrl] : [],
      },
      icons: (client.faviconUrl || client.logoUrl) ? { 
        icon: client.faviconUrl || client.logoUrl || '' 
      } : undefined,
    };
  } catch {
    return {
      title: '빵돌이 통합 인증',
      description: '인증 서비스입니다.',
    };
  }
}

export default function JoinPage() {
  return (
    <Suspense>
      <JoinContent />
    </Suspense>
  );
}
