import { create } from 'zustand';
import { ConsentTrigger, PolicyMeta } from '@/types/consent';
import { getAllPolicyMetas } from '@/lib/policy';
import { getUserConsents } from '@/lib/api/consent';

interface ConsentState {
  needsConsent: boolean;
  trigger: ConsentTrigger | null;
  pendingPolicies: PolicyMeta[];

  checkConsent: (userId: number, serviceId?: string) => Promise<void>;
  resolveConsent: () => void;
}

export const useConsentStore = create<ConsentState>((set) => ({
  needsConsent: false,
  trigger: null,
  pendingPolicies: [],

  checkConsent: async (userId: number, serviceId?: string) => {
    try {
      const metas = await getAllPolicyMetas();
      const userConsents = await getUserConsents(userId);

      const pending: PolicyMeta[] = [];
      let currentTrigger: ConsentTrigger | null = null;

      // 1. 동의 이력이 아예 없는 경우 (신규 가입)
      if (userConsents.length === 0) {
        currentTrigger = 'SIGNUP';
        // 가입 시에는 TERMS와 PRIVACY 필수
        pending.push(...metas.filter(m => m.type === 'TERMS' || m.type === 'PRIVACY'));
      } else {
        // 2. 약관 버전 업데이트 체크
        const updatedPolicies = metas.filter(meta => {
          // 제3자 제공 동의는 버전 업데이트와 무관하게 서비스별로 체크
          if (meta.type === 'THIRD_PARTY') return false;

          const consent = userConsents.find(c => c.policyType === meta.type);
          return !consent || consent.version !== meta.version;
        });

        if (updatedPolicies.length > 0) {
          currentTrigger = 'POLICY_UPDATED';
          pending.push(...updatedPolicies);
        }

        // 3. 특정 서비스 최초 접근 체크 (제3자 정보 제공 동의)
        if (serviceId) {
          const hasThirdPartyConsent = userConsents.some(
            c => c.policyType === 'THIRD_PARTY' && c.serviceId === serviceId
          );
          
          if (!hasThirdPartyConsent) {
            const thirdPartyMeta = metas.find(m => m.type === 'THIRD_PARTY');
            if (thirdPartyMeta && !pending.find(p => p.type === 'THIRD_PARTY')) {
              pending.push(thirdPartyMeta);
              // 만약 버전 업데이트와 겹쳤다면 POLICY_UPDATED를 우선 유지하되, 
              // trigger가 없었다면 SERVICE_FIRST_ACCESS로 설정
              if (!currentTrigger) {
                currentTrigger = 'SERVICE_FIRST_ACCESS';
              }
            }
          }
        }
      }

      set({
        needsConsent: pending.length > 0,
        trigger: currentTrigger,
        pendingPolicies: pending,
      });

    } catch (error) {
      console.error('Failed to check consent:', error);
    }
  },

  resolveConsent: () => {
    set({
      needsConsent: false,
      trigger: null,
      pendingPolicies: [],
    });
  },
}));
