# 빵돌이 통합 인증 - 기술 설계 및 규칙 (AI_RULES.md)

> **Single Source of Truth**: 이 파일은 프로젝트의 모든 코딩 규칙, 아키텍처 가이드라인, 디자인 원칙을 정의합니다.

---

## 🎨 빵돌이 시그니처 디자인 시스템 (Identity: Cinematic Premium)

모든 페이지는 아래의 고도화된 디자인 정체성을 엄격히 준수해야 합니다.

### 1. 시각적 핵심 (Visual Core)
- **Signature Palette (Theme Tokens)**: 
  - **Primary**: `#D97706` (Amber) / `#F59E0B` (Orange)
  - **Background (Global)**:
    - Light: `bg-[#fdfdfd]` (미색) / `text-[#2D2319]` (Charcoal Brown)
    - Dark: `bg-[#050505]` (Deep Black) / `text-zinc-50` (White)
  - **Surface (Cards/Signboards)**:
    - Light: `bg-white/75 border-black/10 shadow-2xl` (고대비 및 깊은 그림자로 배경과 명확히 구분)
    - Dark: `bg-zinc-900/90 border-white/[0.08] shadow-2xl` (고농도 배경 및 초미세 화이트 테두리)
    - **Soft Glow (Dark Mode)**: 다크 모드에서는 테두리가 튀지 않도록 `1px`의 극저농도 컬러 아웃라인(`outline: 1px solid {brandColor}15`)을 사용하여 배경의 빛이 카드 가장자리에 스며든 듯한 효과를 부여합니다.
- **Card Standard Width**: 메인, 로그인, 회원가입 등 모든 주요 카드의 폭은 **400px**로 통합하여 데스크탑에서의 안정감과 모바일 가독성을 동시에 확보합니다.
- **Mobile-First Responsiveness (Small Device Optimization)**:
  - **Fluid Layout**: 소형 기기(iPhone SE 등) 대응을 위해 `PageLayout`은 `relative min-h-screen overflow-y-auto` 구조를 채택하여 콘텐츠가 길어질 경우 자연스러운 스크롤을 제공합니다.
  - **Responsive Scaling**: 모바일 환경에서는 카드 라운드(`rounded-3xl/4xl`), 여백(`p-5/6`), 로고 크기(112px -> 80px), 폰트 크기 등을 지능적으로 축소하여 가용 화면을 최대화합니다.
  - **Viewport Scroll**: 카드 내부의 중첩 스크롤은 지양하며, 전체 뷰포트 스크롤을 활용하여 모바일 조작감을 극대화합니다.
- **Theme System (3-Way Mode)**:
  - **Auto (System)**, **Light**, **Dark** 3가지 모드를 지원합니다.
  - 전역 테마 상태는 `html` 클래스의 `.dark` 존재 여부로 결정되며, `localStorage`에 `theme` 키로 저장됩니다.
  - **ThemeToggle**: 카드 내부 우측 상단(`absolute top-6 right-6`)에 위치하며, 아이콘 중심의 미니멀한 디자인을 유지합니다.
- **Dynamic Branding (Automatic Contrast & Compensation)**:
  - **Auto Contrast**: `isLightColor()` 유틸리티를 사용하여 배경색의 밝기를 분석하고, `.light-brand` 클래스를 통해 텍스트 색상을 자동으로 최적화합니다.
  - 클라이언트가 제공하는 `gradientFrom/To` 색상은 라이트/다크 모드에 따라 시스템이 자동으로 최적화합니다. (Light: `mix-blend-multiply`, Dark: `mix-blend-normal`)
  - **Error Page Integration**: 에러 페이지(`src/app/error/page.tsx`) 또한 `clientId`를 전달받아 해당 클라이언트의 테마 색상을 유지하며, 사용자에게 일관된 브랜딩 경험을 제공합니다.
- **Independent Asset Management**:
  - 로고(`logoUrl`)와 파비콘(`faviconUrl`)은 독립적으로 관리됩니다. 탭 아이콘 설정 시 `faviconUrl`을 최우선으로 하며, 없을 경우에만 `logoUrl`을 폴백으로 사용합니다.
- **Cinematic Texture**: 화면 전역에 `opacity-[0.03]` 수준의 필름 그레인(Grain) 오버레이를 적용하여 아날로그적인 질감 부여.

### 2. 표준 UI 구성 요소 (Standard UI Components)
모든 새로운 페이지는 아래의 공통 컴포넌트를 사용하여 톤앤매너를 유지해야 합니다.
- **PageLayout**: 배경 Orb 애니메이션(fixed), ToastContainer, ThemeToggle, 그리고 **Soft Glow 카드 시스템**이 내장된 표준 레이아웃 컨테이너. 모바일 스크롤과 유연한 여백 시스템을 포함합니다.
- **ClientLogo**: 클라이언트 브랜드 로고를 '프레임리스(Frameless)' 스타일로 렌더링하는 시네마틱 컴포넌트. 컬러 블룸 효과와 유영 애니메이션을 포함하며, `size` 조정을 통해 위계를 관리합니다. (Desktop: 112px, Mobile: 80px 권장)
- **Typography (`Heading`, `Description`, `Badge`)**: 표준 폰트 크기, 자간(`-0.04em`), 색상 및 등장 애니메이션이 적용된 텍스트 컴포넌트. 모바일 대응을 위한 반응형 크기 조절이 내장되어 있습니다.
- **Icons**: 서비스 전역에서 사용되는 2.5px 선 굵기의 표준 SVG 아이콘 라이브러리.
- **Toast**: 화면 하단 중앙(`bottom-12`)에 나타나는 비침습적 알림 시스템.

### 3. 애니메이션 원칙 (Cinematic Motion)
- **Unified Entrance (Elegant Stagger)**: 
  - 모든 요소는 **"부드러운 상승(y:15) + 블러 페이드"**의 통일된 언어로 등장합니다. (`FADE_IN_UP`)
  - 타이밍: `staggerChildren: 0.12s`, `ease: [0.22, 1, 0.36, 1]` (하이엔드 가속도 곡선)
- **Dynamic Background (Dynamic Orbs)**:
  - 4개 레이어의 컬러 오브가 화면을 크게 유영하며 회전/확장합니다. `PageLayout`에서 일괄 관리합니다.

---

## ⚖️ 통합 인증 및 법적 설계 원칙 (Integrated Auth & Legal Strategy)

1. **조직 명칭**: 모든 공식 문서 및 UI에서 **"Team Breadkun"** 명칭을 사용합니다.
2. **중앙 집중형 회원 관리**: 모든 사용자 정보는 통합 인증 서버에서 관리하며, 개별 프로젝트는 고유 ID만 보유합니다.
3. **약관 동의 시스템 (Consent System)**:
   - 모든 약관(이용약관, 개인정보처리방침, 제3자 제공 동의 등)은 `content/policies/` 폴더 내에 MDX 파일 형식으로 버전별 관리됩니다.
   - `src/lib/policy.ts` 유틸리티를 통해 파싱되며, `useConsentCheck` 훅과 `consentStore`를 통해 신규 가입, 서비스 최초 접근, 약관 업데이트 등의 상황을 자동 감지합니다.
   - **Selective UI**: 회원가입(`join`) 시 `isNewUser` 상태에 따라 노출 항목을 조정하며, 단일 항목 노출 시 '모두 동의' 버튼을 자동으로 숨겨 인지 부하를 최소화합니다.
   - 약관 전문은 `/policies/[slug]` 페이지를 통해 제공되며, 사용자는 `ConsentModal` 컴포넌트를 통해 개별 약관에 대해 명시적 동의(Opt-in)를 진행합니다.
4. **법적 책임의 분리**: 통합 서비스 내에서 개별 클라이언트 서비스 운영에 따른 책임은 각 운영자에게 있음을 명시합니다.

---

## 📂 아키텍처 및 기술 설계
- **Next.js 16 (App Router)**: 최신 컨벤션 준수.
- **Middleware**: `middleware.ts`를 통해 Edge 환경에서 Access Token 유무를 검증하고, 미인증 시 원래의 경로(`redirect_to`) 파라미터를 유지하며 안전하게 `/login`으로 리다이렉트합니다.
- **Unified API & Mock Strategy (Strict Standard)**: 
  - 모든 API 호출 함수(`src/lib/api/*.ts`)는 실제 API 로직과 Mock 로직을 하나의 함수 내에서 통합 관리해야 합니다.
  - **Environment Branching**: `if (process.env.NODE_ENV === 'development')` 조건절을 사용하여 개발 환경에서는 `src/lib/api/mock.ts`의 데이터를 반환하고, 운영 환경에서는 실제 `api` 인스턴스를 사용합니다.
  - **Zero-Manual-Switching**: 환경 변수나 코드의 수동 변경 없이, 빌드 환경에 따라 자동으로 동작을 전환하는 것을 원칙으로 합니다.
  - **Metadata Integration**: 페이지의 `generateMetadata` 또한 공통 API 함수를 사용하여 UI와 브라우저 탭 정보(제목, 파비콘)가 항상 Mock 데이터와 동기화되도록 합니다.
- **Mocking Data**: `src/lib/api/mock.ts`는 시스템의 유일한 가짜 데이터 소스(Single Source of Truth)이며, 로컬 개발 시 백엔드 없이도 전체 인증 플로우(로그인, 회원가입, 토큰 갱신, 동의 처리)를 완벽히 재현할 수 있어야 합니다.
- **PageLayout Component**: `src/components/ui/PageLayout.tsx`는 배경, 자동 대비 로직, 컨테이너를 통합 관리합니다.
- **Toast System**: `src/components/ui/Toast.tsx`를 통한 전역 상태 비의존적 알림 처리.

---

## 📜 코딩 컨벤션
- **스타일**: Tailwind CSS 4 전용. 인라인 스타일 지양.
- **애니메이션**: Framer Motion 전용. 상수로 정의된 `FADE_IN_UP`, `STAGGER_CONTAINER` 사용 권장.

---

<!-- CRITICAL: DO NOT DELETE THE SECTION BELOW -->
## 🤖 자동화 명령어 (Command Trigger)
사용자가 채팅이나 CLI에 `/sync` 또는 `문서정리`라고 입력하면, 즉시 아래의 **'문서 동기화 워크플로우'**를 수행하십시오:
> "오늘 논의한 프로젝트 방향성, 컨셉, 설계, 공통화 내용을 **Documentation Update Policy**에 따라 `README.md`와 `AI_RULES.md`에 논리적으로 분류하여 병합하고, 업데이트된 항목별 요약 결과를 보고하라."
<!-- END OF CRITICAL SECTION -->
