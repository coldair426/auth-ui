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
      icons: client.logoUrl ? { icon: client.logoUrl } : undefined,
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
