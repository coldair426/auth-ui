import { Metadata, ResolvingMetadata } from 'next';
import { Suspense } from 'react';
import { getClientInfo } from '@/lib/api/account';
import { LoginContent } from './LoginContent';

interface Props {
  searchParams: Promise<{ clientId?: string }>;
}

export async function generateMetadata(
  { searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { clientId } = await searchParams;

  if (!clientId) {
    if (process.env.NODE_ENV === 'development') {
      return {
        title: '피쉬하이 (Fishhi) - 빵돌이 통합 인증',
        description: '로컬 개발 환경에서 피쉬하이 UI를 확인하고 있습니다.',
        icons: {
          icon: '/fishhi-favicon.png',
        },
      };
    }
    return {
      title: '빵돌이 통합 인증',
      description: '서비스 연결을 위해 올바른 링크로 접속해주세요.',
    };
  }

  try {
    const client = await getClientInfo(clientId);
    return {
      title: `${client.name} - 빵돌이 통합 인증`,
      description: `${client.name} 서비스를 위한 인증 화면입니다.`,
      openGraph: {
        title: `${client.name} - 빵돌이 통합 인증`,
        description: `${client.name} 서비스를 위한 인증 화면입니다.`,
        images: client.logoUrl ? [client.logoUrl] : [],
      },
      icons: (client.faviconUrl || client.logoUrl) ? { icon: client.faviconUrl || client.logoUrl || '' } : undefined,
    };
  } catch {
    return {
      title: '빵돌이 통합 인증',
      description: '인증 서비스입니다.',
    };
  }
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
