import { Metadata } from 'next';
import HomeContent from './HomeContent';

export const metadata: Metadata = {
  title: '빵돌이 통합 인증 - 모든 서비스의 시작',
  description: '어디서나 간편하게, 당신의 계정을 하나로 통합하세요. 빵돌이 통합 인증은 안전하고 빠른 로그인을 지원합니다.',
  keywords: ['빵돌이', '통합인증', '로그인', 'SSO', 'Breadkun', '인증서비스'],
  alternates: {
    canonical: 'https://auth.breadkun.com',
  },
  openGraph: {
    title: '빵돌이 통합 인증',
    description: '어디서나 간편하게, 당신의 계정을 하나로 통합하세요.',
    url: 'https://auth.breadkun.com',
    siteName: '빵돌이 통합 인증',
    images: [
      {
        url: 'https://auth.breadkun.com/logo.webp', // 배포 서버의 절대 경로 사용 권장
        width: 1200,
        height: 630,
        alt: '빵돌이 통합 인증 메인 로고',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '빵돌이 통합 인증',
    description: '어디서나 간편하게, 당신의 계정을 하나로 통합하세요.',
    images: ['https://auth.breadkun.com/logo.webp'],
  },
};

export default function Home() {
  return <HomeContent />;
}
