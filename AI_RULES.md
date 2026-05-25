# 빵돌이 통합 인증 - 기술 설계 및 규칙 (AI_RULES.md)

> **Single Source of Truth**: 이 파일은 프로젝트의 모든 코딩 규칙, 아키텍처 가이드라인, 디자인 원칙을 정의합니다.

---

## 🎨 빵돌이 시그니처 디자인 시스템 (Identity: Cinematic Premium)

모든 페이지는 아래의 고도화된 디자인 정체성을 엄격히 준수해야 합니다.

### 1. 시각적 핵심 (Visual Core)
... (생략)
- **Signature Palette (Theme Tokens)**: 
  - **Primary**: `#D97706` (Amber) / `#F59E0B` (Orange)
  - **Background (Global)**:
    - Light: `bg-[#fdfdfd]` (미색) / `text-[#2D2319]` (Charcoal Brown)
    - Dark: `bg-[#050505]` (Deep Black) / `text-zinc-50` (White)
  - **Surface (Cards/Signboards)**:
    - Light: `bg-white/70 border-white/80 shadow-[rgba(217,119,6,0.1)]`
    - Dark: `bg-zinc-900/80 border-white/10 shadow-[rgba(0,0,0,0.4)]`
  - **Subtext**:
    - Light: `text-[#5C4D3E] opacity-80`
    - Dark: `text-zinc-400 opacity-90`
- **Theme Convention**:
  - 모든 색상은 Tailwind의 `dark:` 프리픽스를 통해 명시적으로 관리합니다.
  - 전역 테마 상태는 `html` 클래스의 `.dark` 존재 여부로 결정됩니다.
  - **동적 브랜딩 자동 보정 (Automatic Branding Compensation)**:
    - 클라이언트가 제공하는 `gradientFrom/To` 색상은 라이트/다크 모드에 따라 시스템이 자동으로 최적화합니다.
    - **Light Mode**: `mix-blend-multiply`, `opacity-60` 적용하여 배경과 부드럽게 융합.
    - **Dark Mode**: `mix-blend-normal`, `opacity-30` 내외로 자동 감쇄하여 검은 배경에서 눈의 피로도를 낮추고 깊이감 형성.
    - **Dynamic Shadow**: 카드의 그림자(`boxShadow`)는 클라이언트의 `gradientFrom` 색상을 기반으로 생성되어 일관된 브랜드 아이덴티티를 유지합니다.
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

## ⚖️ 통합 인증 및 법적 설계 원칙 (Integrated Auth & Legal Strategy)

본 프로젝트는 법적 책임 최소화와 운영 효율성을 위해 아래의 설계를 고수합니다.

1. **중앙 집중형 회원 관리 (Centralized Auth)**: 
   - 모든 사용자 정보(Email, Profile 등)는 `auth` 프로젝트 서버에서 통합 관리합니다. 
   - 개별 프로젝트(Client)는 유저의 고유 ID와 연동 기록만을 보유하며, 민감한 인증 정보는 직접 관리하지 않습니다.
2. **법적 책임의 분리 (Delegation of Liability)**:
   - 빵돌이 통합 인증은 **'인증 중개자'**로서의 지위를 가집니다.
   - 각 프로젝트에 처음 가입할 때 반드시 `/join` 페이지를 거쳐야 하며, 해당 페이지에서 **"서비스 이용 책임은 개별 프로젝트 운영자에게 있음"**을 명시하여 법적 보호막을 형성합니다.
3. **강제적 클라이언트 식별 (Strict Client Identification)**:
   - 모든 로그인 및 가입 프로세스는 유효한 `clientId`가 반드시 존재해야 시작될 수 있습니다. 
   - `clientId`가 없는 접근은 오류 페이지로 리다이렉트하여 시스템 오남용을 방지합니다.

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
