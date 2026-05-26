import { useEffect } from 'react';
import { useConsentStore } from '@/store/consentStore';

export function useConsentCheck({
  userId,
  serviceId,
}: {
  userId: number;
  serviceId?: string;
}) {
  const { needsConsent, trigger, pendingPolicies, checkConsent } = useConsentStore();

  useEffect(() => {
    if (userId) {
      checkConsent(userId, serviceId);
    }
  }, [userId, serviceId, checkConsent]);

  return {
    needsConsent,
    trigger,
    pendingPolicies,
  };
}
