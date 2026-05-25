import { Metadata } from 'next';
import HomeContent from './HomeContent';

export const metadata: Metadata = {
  title: '빵돌이 통합 인증',
  description: '어디서나 간편하게, 당신의 계정을 하나로 통합하세요.',
  openGraph: {
    title: '빵돌이 통합 인증',
    description: '어디서나 간편하게, 당신의 계정을 하나로 통합하세요.',
    url: 'https://auth.breadkun.com',
    siteName: '빵돌이 통합 인증',
    images: [
      {
        url: '/logo.webp',
        width: 800,
        height: 600,
        alt: '빵돌이 통합 인증 로고',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
};

export default function Home() {
  return <HomeContent />;
}
