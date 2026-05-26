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
    - Light: `bg-white/70 border-white/80 shadow-[rgba(217,119,6,0.1)]`
    - Dark: `bg-zinc-900/80 border-white/10 shadow-[rgba(0,0,0,0.4)]`
- **Theme System (3-Way Mode)**:
  - **Auto (System)**, **Light**, **Dark** 3가지 모드를 지원합니다.
  - 전역 테마 상태는 `html` 클래스의 `.dark` 존재 여부로 결정되며, `localStorage`에 `theme` 키로 저장됩니다.
  - **ThemeToggle**: 카드 내부 우측 상단(`absolute top-6 right-6`)에 위치하며, 아이콘 중심의 미니멀한 디자인을 유지합니다.
- **Dynamic Branding (Automatic Compensation)**:
  - 클라이언트가 제공하는 `gradientFrom/To` 색상은 라이트/다크 모드에 따라 시스템이 자동으로 최적화합니다.
  - **Light Mode**: `mix-blend-multiply`, `opacity-60` 적용.
  - **Dark Mode**: `mix-blend-normal`, `opacity-30` 내외로 자동 감쇄.
- **Cinematic Texture**: 화면 전역에 `opacity-[0.03]` 수준의 필름 그레인(Grain) 오버레이를 적용하여 아날로그적인 질감 부여.

### 2. 표준 UI 구성 요소 (Standard UI Components)
모든 새로운 페이지는 아래의 공통 컴포넌트를 사용하여 톤앤매너를 유지해야 합니다.
- **PageLayout**: 배경 Orb 애니메이션, ToastContainer, ThemeToggle이 내장된 표준 레이아웃 컨테이너.
- **Typography (`Heading`, `Description`, `Badge`)**: 표준 폰트 크기, 자간(`-0.04em`), 색상 및 등장 애니메이션이 적용된 텍스트 컴포넌트.
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
3. **법적 책임의 분리**: `/join` 페이지를 통해 서비스 이용 책임이 개별 운영자에게 있음을 명시합니다.

---

## 📂 아키텍처 및 기술 설계
- **Next.js 16 (App Router)**: 최신 컨벤션 준수.
- **PageLayout Component**: `src/components/ui/PageLayout.tsx`는 배경 및 컨테이너 로직을 통합 관리합니다.
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
