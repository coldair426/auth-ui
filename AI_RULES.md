# 빵돌이 통합 인증 - 기술 설계 및 규칙 (AI_RULES.md)

> **Single Source of Truth**: 이 파일은 프로젝트의 모든 코딩 규칙, 아키텍처 가이드라인, 디자인 원칙을 정의합니다.

---

## 🎨 빵돌이 시그니처 디자인 시스템 (Identity: Cinematic Premium)

모든 페이지는 아래의 고도화된 디자인 정체성을 엄격히 준수해야 합니다.

### 1. 시각적 핵심 (Visual Core)
- **Glassmorphism (간판 스타일)**: 극한의 투명도와 깊이감을 강조합니다.
  - 사양: `backdrop-blur-[50px] bg-white/45 dark:bg-zinc-900/50 border border-white/80 dark:border-white/10`
  - 그림자: `shadow-[0_50px_100px_-20px_rgba(217,119,6,0.25)]` (앰버 톤이 섞인 깊은 그림자)
  - 곡률: `rounded-[64px]` (초대형 곡률로 부드러움 극대화)
- **Typography (전역 서체)**:
  - **Single Font**: `NanumSquareRound` (나눔스퀘어 라운드) 전역 통일.
  - **Main Title**: `text-[44px] font-extrabold tracking-[-0.04em] leading-[1.2]` (한국어 기준 최적 비율)
  - **Subtext**: 앰버 톤이 가미된 차콜 컬러 (`text-[#5C4D3E] dark:text-zinc-400`) 사용으로 고급스러운 대비 구현.
- **Signature Palette**: 
  - Primary: `#D97706` (Amber) / `#F59E0B` (Orange)
  - Background: `bg-[#fdfdfd]` (미색) / `bg-[#050505]` (딥 블랙)
- **Cinematic Texture**: 화면 전역에 `opacity-[0.03]` 수준의 필름 그레인(Grain) 오버레이를 적용하여 아날로그적인 질감 부여.

### 2. 애니메이션 원칙 (Cinematic Motion)
- **Unified Entrance (Elegant Stagger)**: 
  - 모든 요소는 개별적으로 튀지 않고 **"부드러운 상승(y:20) + 블러 페이드"**의 통일된 언어로 등장합니다.
  - 타이밍: `staggerChildren: 0.14s`, `ease: [0.22, 1, 0.36, 1]` (하이엔드 가속도 곡선)
- **Dynamic Background (Dynamic Orbs)**:
  - 4개 레이어(Amber, Orange, Indigo Purple, Cyan Teal)의 컬러 오브가 10~16초 주기로 화면을 크게 유영하며 회전/확장합니다. (`mix-blend-multiply`, `radial-gradient` 활용)
- **Micro-interactions**: 
  - 로고: 6초 주기의 우아한 부유 애니메이션 (`y: [0, -8, 0]`).
  - 카드: 상시 가동되는 미세한 `Shimmer Flare` 효과로 유리 질감 강조.

### 3. 에셋 및 레이아웃 규격
- **Vertical Spacing**: 요소 간 간격을 촘촘하게 배치하여 수직적인 밀도감을 높입니다. (Logo mb-8, Badge mb-6, Title mb-5 등)
- **High-Fidelity Assets**: `logo.webp` (26x26 기준 확대) 사용.

---

## 📂 아키텍처 및 기술 설계
- **Next.js 16 (App Router)**: 최신 컨벤션 준수.
- **Server-Client Separation**: SEO 및 메타데이터 최적화를 위해 메인 페이지는 서버 컴포넌트(`page.tsx`)와 클라이언트 컴포넌트(`HomeContent.tsx`)로 분리하여 관리합니다.
- **PageLayout Component**: `src/components/ui/PageLayout.tsx`는 배경 Orb 및 반응형 컨테이너 로직을 통합 관리합니다. 모든 페이지는 메인 페이지의 다이나믹 Orb 로직을 이식받아야 합니다.
- **Security & CSP**: `src/proxy.ts`에서 네이버 공식 CDN(`hangeul.pstatic.net`)을 포함한 엄격한 콘텐츠 보안 정책을 관리합니다.

---

## 📜 코딩 컨벤션
- **스타일**: Tailwind CSS 4 전용. 인라인 스타일 지양.
- **애니메이션**: Framer Motion 전용.
- **전역 설정**: `globals.css`에서 `@import` 순서 준수 (Fonts -> Tailwind -> Custom Animations).

---

<!-- CRITICAL: DO NOT DELETE THE SECTION BELOW -->
## 🤖 자동화 명령어 (Command Trigger)
사용자가 채팅이나 CLI에 `/sync` 또는 `문서정리`라고 입력하면, 즉시 아래의 **'문서 동기화 워크플로우'**를 수행하십시오:
> "오늘 논의한 프로젝트 방향성, 컨셉, 설계, 공통화 내용을 **Documentation Update Policy**에 따라 `README.md`와 `AI_RULES.md`에 논리적으로 분류하여 병합하고, 업데이트된 항목별 요약 결과를 보고하라."
<!-- END OF CRITICAL SECTION -->
