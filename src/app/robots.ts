import { MetadataRoute } from 'next';

/**
 * robots.txt 생성기
 * 검색 엔진 봇의 접근 권한을 설정합니다.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/callback/'], // 보안 및 비공개 경로는 차단
    },
    sitemap: 'https://auth.breadkun.com/sitemap.xml',
  };
}
