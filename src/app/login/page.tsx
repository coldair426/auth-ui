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
      title: 'Unified Auth',
      description: 'Please provide a valid client ID to sign in.',
    };
  }

  try {
    const client = await getClientInfo(clientId);
    return {
      title: `${client.name} - Login`,
      description: `${client.name} authentication service.`,
      openGraph: {
        title: `${client.name} - Login`,
        description: `${client.name} authentication service.`,
        images: client.logoUrl ? [client.logoUrl] : [],
      },
      icons: client.logoUrl ? { icon: client.logoUrl } : undefined,
    };
  } catch {
    return {
      title: 'Unified Auth',
      description: 'Authentication service.',
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
