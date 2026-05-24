# auth-ui (AI_RULES.md)

> **Single Source of Truth**: 이 파일은 프로젝트의 모든 코딩 규칙, 아키텍처 가이드라인, 디자인 원칙을 정의합니다. AI 어시스턴트는 코드를 생성하거나 수정하기 전 이 파일을 반드시 숙지해야 합니다.

## 프로젝트 개요
- 여러 서비스에서 공유하여 사용하는 범용 통합 인증 UI 서비스입니다.
- **핵심 기술 스택**: Next.js 16 (App Router), TypeScript, Tailwind CSS 4, Framer Motion, Zustand, Axios.

---

## 📂 아키텍처 및 기술 설계
- **Next.js 16 (Turbopack)**: 최신 컨벤션을 따르며, 특히 `middleware` 대신 `src/proxy.ts`를 사용하여 라우팅과 보안 정책을 관리합니다.
- **Dynamic Metadata**: `src/app/login/page.tsx`의 `generateMetadata`를 통해 `clientId`별로 타이틀, 파비콘, OG를 동적으로 생성합니다.
- **PageLayout Component**: `src/components/ui/PageLayout.tsx`는 프로젝트의 레이아웃 SSOT임. 배경 Orb, 반응형 컨테이너 로직, 모바일 핸들이 통합되어 있음.
- **JWT RS256**: `auth-server`의 비대칭키 서명을 활용하며, Access Token(메모리)과 Refresh Token(HttpOnly Cookie) 체계를 사용합니다.
- **Security & CSP**: `src/proxy.ts`에서 강력한 Content Security Policy와 Clickjacking 방지(`X-Frame-Options: DENY`)를 적용합니다.

---

## 🎨 UI/UX & 디자인 컨벤션
- **Premium Minimalist**: 글래스모피즘(`backdrop-blur`), 부드러운 Spring 애니메이션(Framer Motion), 고해상도 타이포그래피(`font-bold`, `tracking-tight`) 필수.
- **Floating Capsule Layout**: 모든 모달/카드는 `PageLayout` 컴포넌트를 사용해야 하며 아래 규격을 준수함.
  - **공통 곡률**: `rounded-[32px]` (사방 코너 통일).
  - **PC (Desktop)**: 화면 정중앙 배치, 가변 너비 (default `360px`).
  - **Mobile**: 하단 플로팅 바텀 시트 형태, 사방 여백(`p-4`) 필수, 상단 핸들(Grabber) 표시.
- **Universal Design**: 
  - 주 액션 버튼(Primary CTA)은 고대비(`bg-gray-900 dark:bg-zinc-100`) 스타일 유지.
  - 소셜 버튼은 인지 편의를 위해 브랜드별 파스텔 틴트(rgba 8~12%) 배경 적용 (Option B).
- **Accessibility**: 모든 인터랙티브 요소에 명확한 `aria-label` 부여.

---

## 🛠 로컬 개발 환경 최적화 (Local Bypass Policy)
백엔드 의존성을 제거하고 UI 개발 속도를 높이기 위해 로컬(`development`) 환경 전용 우회 정책을 시행합니다.
- **Auth Bypass**: `src/proxy.ts`에서 개발 모드 시 토큰 체크를 건너뜁니다.
- **API Fallback**: API 호출 실패 시 에러 페이지로 이동하는 대신, 개발 환경에 한해 Mock 데이터를 주입하여 UI를 렌더링합니다.
- **Security Bypass**: 개발 모드에서는 HMR 및 테스트를 방해하는 CSP/보안 헤더를 비활성화합니다.

---

## 📂 디렉토리 구조 및 규칙
- `src/app/`: Next.js App Router 기반 페이지.
- `src/components/ui/`: 프리미엄 공통 UI 컴포넌트.
- `src/components/auth/`: 인증 특화 컴포넌트.
- `src/lib/api/`: API 호출 및 Axios 인터셉터 (Token Refresh 포함).
- `src/proxy.ts`: 라우팅, 보안, 개발 우회 로직 통합 관리.

---

## 📜 코딩 컨벤션
- **컴포넌트**: `function` 선언식 사용. 최상단 `'use client'` 필수 체크.
- **스타일**: Tailwind CSS 4 전용. 인라인 스타일은 애니메이션이나 동적 컬러(rgba) 계산 시에만 사용.
- **다크 모드**: `dark:` 클래스와 CSS 변수를 활용하여 시스템 테마 완벽 지원.
- **언어**: 사용자 표시 메시지는 한국어(`ko`), 메타데이터 및 기술 문서는 다국어 고려.

---

## 📜 Documentation Update Policy
- **기획/컨셉/사용법**: `README.md`에 업데이트. (Unified Auth 정체성, 인증 프로세스 등)
- **기술/설계/규칙**: `AI_RULES.md`에 업데이트. (Proxy 로직, Bypass 정책, Next.js 16 규격 등)
- **SSOT 원칙**: 모든 AI 어시스턴트는 이 파일의 기술적 지시를 최우선으로 따릅니다.
- **영구 보존 규칙**: 파일 하단의 **'명령어 트리거(Command Trigger)'** 섹션은 자동화된 워크플로우를 위해 반드시 유지되어야 하며, 어떠한 경우에도 삭제하거나 누락시켜서는 안 됩니다.

---

<!-- CRITICAL: DO NOT DELETE THE SECTION BELOW -->
## 🤖 자동화 명령어 (Command Trigger)
사용자가 채팅이나 CLI에 `/sync` 또는 `문서정리`라고 입력하면, 즉시 아래의 **'문서 동기화 워크플로우'**를 수행하십시오:
> "오늘 논의한 프로젝트 방향성, 컨셉, 설계 내용을 **Documentation Update Policy**에 따라 `README.md`와 `AI_RULES.md`에 논리적으로 분류하여 병합하고, 업데이트된 항목별 요약 결과를 보고하라."
<!-- END OF CRITICAL SECTION -->