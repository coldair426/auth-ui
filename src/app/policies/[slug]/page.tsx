import { getPolicyBySlug } from '@/lib/policy';
import { PageLayout } from '@/components/ui/PageLayout';
import { Heading, Description } from '@/components/ui/Typography';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ version?: string }>;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { version } = await searchParams;
  
  try {
    const { meta } = await getPolicyBySlug(slug, version);
    return {
      title: `${meta.title} | 빵돌이 통합 인증`,
      description: meta.summary,
    };
  } catch {
    return {
      title: '약관 상세 | 빵돌이 통합 인증',
    };
  }
}

export default async function PolicyPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { version } = await searchParams;
  
  let policy;
  try {
    policy = await getPolicyBySlug(slug, version);
  } catch {
    return (
      <PageLayout width={600}>
        <div className="text-center py-20">
          <Heading>문서를 찾을 수 없습니다.</Heading>
          <Description className="mt-4">요청하신 약관이나 정책이 존재하지 않습니다.</Description>
        </div>
      </PageLayout>
    );
  }

  const { meta, content } = policy;

  return (
    <PageLayout width={800}>
      <div className="max-h-[80vh] overflow-y-auto pr-6 custom-scrollbar text-left">
        <header className="mb-10 pb-6 border-b border-black/10 dark:border-white/10">
          <Heading className="text-3xl mb-3">{meta.title}</Heading>
          <div className="flex items-center gap-4 text-sm font-semibold text-amber-600 dark:text-amber-500">
            <span>버전: {meta.version}</span>
            <span>시행일: {meta.effectiveAt}</span>
          </div>
          <Description className="mt-4 text-base text-gray-700 dark:text-zinc-300">
            {meta.summary}
          </Description>
        </header>

        <article className="prose prose-zinc dark:prose-invert prose-headings:font-extrabold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-p:text-sm prose-p:leading-relaxed max-w-none">
          <MDXRemote source={content} />
        </article>
      </div>
    </PageLayout>
  );
}
