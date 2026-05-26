# 빵돌이 통합 인증 (Breadkun Integrated Authentication)

여러 서비스에서 공유하여 사용하는 **범용 통합 인증 UI 서비스**입니다.  
`clientId`를 기반으로 각 프로젝트의 브랜딩(로고, 컬러, 제목 등)을 동적으로 반영하며, 심리학 및 UX 원칙에 기반한 프리미엄 사용자 경험을 제공합니다.

---

## 🎨 디자인 및 브랜딩 (Branding)

본 프로젝트는 **"Team Breadkun"**의 정체성을 담은 **Premium Cinematic** 디자인을 지향합니다.

- **브랜드 컬러**: 따뜻한 빵의 질감을 담은 Amber/Orange 그라데이션 (`#D97706` → `#F59E0B`)을 메인 테마로 사용합니다.
- **표준 카드 시스템 (400px Unified Width)**: 모든 주요 인증 카드는 데스크탑 안정감을 위해 **400px** 너비로 통일되어 있으며, 모바일에서는 유연하게 반응합니다.
- **소프트 글로우 테두리 (Soft Glow Outline)**: 다크 모드에서 카드가 배경과 이질감 없이 융합되도록 미세한 컬러 글로우 효과를 적용했습니다.
- **프레임리스 로고 (Frameless Logo)**: 로고 고유의 미학을 극대화하기 위해 배경 프레임 없이 부유하는 시네마틱 애니메이션과 컬러 블룸 효과를 제공합니다.
- **자동 대비 시스템 (Automatic Contrast)**: 브랜드 배경색의 밝기를 지능적으로 분석하여 글자색을 자동으로 최적화합니다. (단, 다크 모드에서는 사용자 설정이 항상 최우선됩니다.)
- **3-Way 테마 시스템**: 시스템 설정 동기화(Auto), 라이트, 다크 모드를 완벽하게 지원합니다.
- **표준 UI 시스템**: 모든 페이지는 공통 `PageLayout`, `ClientLogo`, `Typography` 시스템을 공유하여 100% 일관된 톤앤매너를 유지합니다.

---

## 🔄 인증 프로세스 (Auth Process)

### 1. 인증 요청 (Redirect)
클라이언트 서비스는 사용자를 아래 URL로 리다이렉트 시킵니다.
```
https://auth.breadkun.com/login?clientId={MY_CLIENT_ID}&redirectUri={MY_REDIRECT_URI}&mode=redirect
```

### 2. 로컬 개발 및 통합 목업 전략 (Unified API & Mock Strategy)
개발 환경(`yarn dev`)에서는 실제 백엔드 의존성 없이도 전체 인증 라이프사이클을 테스트할 수 있는 **Unified API & Mock** 전략을 사용합니다.
- **통합 관리**: 실제 API 호출과 Mock 데이터 반환 로직이 동일한 함수 내에서 `NODE_ENV`에 따라 자동으로 분기됩니다.
- **자동 동기화**: `src/lib/api/mock.ts`에서 데이터를 수정하면 UI(로고, 색상)뿐만 아니라 브라우저 탭 정보(메타데이터)까지 실시간으로 반영됩니다.
- **피쉬하이(Fishhi) 브랜딩**: 기본 개발용 목업으로 시원한 하늘색 테마와 물고기 로고가 적용된 피쉬하이 환경을 제공합니다.
- **Zero-Manual-Switching**: 별도의 코드 수정 없이 운영 배포 시에는 자동으로 실제 API 엔드포인트로 전환됩니다.

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
