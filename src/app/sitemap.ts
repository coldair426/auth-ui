import { MetadataRoute } from 'next';

/**
 * sitemap.xml 생성기
 * 사이트의 전체 구조를 검색 엔진에 제공합니다.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://auth.breadkun.com';

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/join`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];
}
