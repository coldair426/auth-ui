# 빵돌이 통합 인증 (Breadkun Integrated Authentication)

여러 서비스에서 공유하여 사용하는 **범용 통합 인증 UI 서비스**입니다.  
`clientId`를 기반으로 각 프로젝트의 브랜딩(로고, 컬러, 제목 등)을 동적으로 반영하며, 심리학 및 UX 원칙에 기반한 프리미엄 사용자 경험을 제공합니다.

---

## 🎨 디자인 및 브랜딩 (Branding)

본 프로젝트는 **"Team Breadkun"**의 정체성을 담은 **Premium Minimalist** 디자인을 지향합니다.

- **브랜드 컬러**: 따뜻한 빵의 질감을 담은 Amber/Orange 그라데이션 (`#D97706` → `#F59E0B`)을 메인 테마로 사용합니다.
- **자동 대비 시스템 (Automatic Contrast)**: 브랜드 배경색의 밝기를 지능적으로 분석하여 글자색을 자동으로 최적화합니다. 밝은 배경에서는 어두운 텍스트를, 어두운 배경에서는 밝은 텍스트를 자동으로 선택하여 최상의 가독성을 보장합니다.
- **3-Way 테마 시스템**: 시스템 설정 동기화(Auto), 라이트, 다크 모드를 완벽하게 지원하며, 전용 토스트 알림을 통해 시각적 피드백을 제공합니다.
- **표준 UI 시스템**: 모든 페이지는 공통 `PageLayout`과 `Typography` 시스템을 공유하여 100% 일관된 톤앤매너를 유지합니다.
- **독립된 에셋 관리**: 로고(`logoUrl`)와 파비콘(`faviconUrl`)을 독립적으로 설정할 수 있어, 서비스별로 최적화된 비율의 이미지를 제공합니다.
- **글래스모피즘**: Framer Motion과 Tailwind CSS 4를 활용하여 50px 이상의 부드러운 `backdrop-blur` 효과를 적용했습니다.

---

## 🔄 인증 프로세스 (Auth Process)

### 1. 인증 요청 (Redirect)
클라이언트 서비스는 사용자를 아래 URL로 리다이렉트 시킵니다.
```
https://auth.breadkun.com/login?clientId={MY_CLIENT_ID}&redirectUri={MY_REDIRECT_URI}&mode=redirect
```

### 2. 로컬 개발 및 목업 시스템 (Mock System)
개발 환경(`yarn dev`)에서는 실제 백엔드 없이도 모든 기능을 테스트할 수 있는 **피쉬하이 (Fishhi)** 기반의 목업 시스템이 작동합니다.
- **피쉬하이 브랜딩**: 귀여운 물고기 로고와 시원한 하늘색 테마를 기본으로 제공합니다.
- **자동 로그인 흐름**: 소셜 로그인 시뮬레이션을 통해 콜백 처리 및 가입 동의 프로세스를 즉시 확인할 수 있습니다.
- **독립적 환경**: 해당 목업 데이터는 빌드 시점에 자동으로 제거되어 배포 환경에는 영향을 주지 않습니다.

---

## 📱 주요 페이지 및 기능

| 경로 | 설명 | 동적 변경 요소 |
|------|------|------|
| `/` | 메인 랜딩 페이지 | 서비스 소개 |
| `/login` | 메인 로그인 화면 | 로고, 파비콘, 그라데이션, 타이틀 |
| `/join` | 서비스 가입 동의 | 로고, 파비콘, 그라데이션, 타이틀 |
| `/callback/[provider]` | 인증 콜백 처리 | 자동 리다이렉션 처리 |
| `/error` | 에러 안내 화면 | 클라이언트별 테마(그라데이션), 커스텀 에러 메시지 |

---

## 🛠 기술 스택

- **Framework**: Next.js 16 (App Router / Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4, Framer Motion
- **State Management**: Zustand
- **API**: Axios (Interceptors for Token Refresh)
- **Performance**: WebP format assets, Metadata optimization

---

## 🚀 로컬 실행 가이드

```bash
# 1. 의존성 설치
yarn install

# 2. 환경변수 설정
cp .env.example .env.local

# 3. 개발 서버 실행
yarn dev
```
