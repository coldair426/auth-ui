export type PolicyType = 'TERMS' | 'PRIVACY' | 'THIRD_PARTY';

export type ConsentTrigger = 'SIGNUP' | 'SERVICE_FIRST_ACCESS' | 'POLICY_UPDATED';

// MDX frontmatter + 파일 경로 포함
export interface PolicyMeta {
  type: PolicyType;
  title: string;
  version: string;
  summary: string;
  effectiveAt: string;
  slug: string; // URL 경로 (예: terms-of-service)
}

export interface UserConsent {
  id: number;
  userId: number;
  policyType: PolicyType;
  version: string; // 동의한 버전 (예: v1.0.0)
  serviceId: string | null;
  consentedAt: string;
}

export interface ConsentRequest {
  consents: {
    policyType: PolicyType;
    version: string;
  }[];
  serviceId?: string;
}
