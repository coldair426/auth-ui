import { Suspense } from 'react';
import { CallbackContent } from './CallbackContent';

export default function CallbackPage() {
  return (
    <Suspense>
      <CallbackContent />
    </Suspense>
  );
}
