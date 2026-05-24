# Unified Auth UI

여러 서비스에서 공유하여 사용하는 **범용 통합 인증 UI 서비스**입니다.  
`clientId`를 기반으로 각 프로젝트의 브랜딩(로고, 컬러, 제목 등)을 동적으로 반영하며, 심리학 및 UX 원칙에 기반한 프리미엄 사용자 경험을 제공합니다.

---

## 🎨 디자인 및 UX 철학 (Design Principles)

본 프로젝트는 단순한 기능을 넘어, 사용자의 인지 부하를 줄이고 신뢰감을 주는 **Premium Minimalist** 디자인을 지향합니다.

- **인지 심리학 기반**: 게슈탈트 법칙을 활용한 소셜 버튼 그룹화와 브랜드별 파스텔 틴트(Option B) 적용으로 0.1초 이내의 직관적 인지를 돕습니다.
- **유니버설 디자인**: 에러 상황에서도 명확한 탈출구(CTA)를 제공하며, 고대비 버튼 설정을 통해 누구나 쉽게 조작할 수 있도록 설계되었습니다.
- **마이크로 인터랙션**: Framer Motion의 물리 엔진(Spring)을 활용한 부드러운 입장/퇴장 애니메이션과 버튼 클릭 피드백으로 조작의 즐거움을 제공합니다.
- **다크 모드 최적화**: OS 설정에 따른 자동 테마 전환과 다크 모드 전용 브랜드 틴트 컬러를 지원하여 모든 환경에서 일관된 경험을 제공합니다.
- **동적 브랜딩**: 하나의 시스템이지만, 접속한 `clientId`에 따라 로고, 배경 그라데이션, 브라우저 탭 이름, 파비콘까지 실시간으로 변화합니다.

---

## 🔄 인증 프로세스 (Auth Process)

다른 프로젝트(Client)에서 이 시스템을 연동할 때의 전체 흐름입니다.

### 1. 인증 요청 (Redirect)
클라이언트 서비스는 사용자를 아래 URL로 리다이렉트 시킵니다.
```
https://auth.yourdomain.com/login?clientId={MY_CLIENT_ID}&redirectUri={MY_REDIRECT_URI}&mode=redirect
```
- **clientId**: 프로젝트 식별자 (로고 및 테마 결정)
- **redirectUri**: 인증 완료 후 돌아갈 주소
- **mode**: `redirect` 또는 `popup` 방식 선택

### 2. 테마 동적 로드
시스템은 서버 사이드에서 `clientId`를 분석하여 다음을 수행합니다.
- 브라우저 탭 제목 및 파비콘을 해당 서비스의 정보로 변경
- 서비스 고유 로고 및 브랜드 컬러 그라데이션 렌더링
- 사용자에게 친숙한 해당 서비스만의 로그인 환경 제공

### 3. 소셜 인증 및 콜백
사용자가 소셜 버튼을 클릭하면 인증 서버(`auth-server`)를 거쳐 콜백 처리가 진행됩니다.
- 신규 유저인 경우 가입 동의 페이지(`/join`)로 이동합니다.
- 기존 유저이거나 가입 완료 시 JWT 토큰이 발급됩니다.

### 4. 토큰 전달 및 귀환
설정된 `mode`에 따라 클라이언트 서비스로 토큰을 전달합니다.
- **Redirect 모드**: `redirectUri`로 이동하며 쿼리 파라미터로 토큰을 전달합니다.
- **Popup 모드**: `window.opener.postMessage`를 통해 토큰을 전달하고 팝업을 닫습니다.

---

## 📱 주요 페이지 및 기능

| 경로 | 설명 | 동적 변경 요소 |
|------|------|------|
| `/login` | 메인 로그인 화면 | 로고, 그라데이션, 타이틀, 파비콘 |
| `/join` | 서비스 가입 동의 | 로고, 브랜드 테마, 서비스 명칭 |
| `/settings/connections` | 소셜 계정 연동 관리 | 사용자 정보 및 연결된 소셜 계정 |

---

## 🛠 기술 스택

- **Framework**: Next.js 16 (App Router / Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4, Framer Motion
- **State**: Zustand
- **API**: Axios (Interceptors for Token Refresh)
- **Security**: Strict CSP, X-Frame-Options (Clickjacking Protection)
- **Accessibility**: ARIA labels compliant

---

## 🚀 로컬 실행 및 개발 가이드

```bash
# 1. 의존성 설치
yarn install

# 2. 환경변수 설정
cp .env.example .env.local

# 3. 개발 서버 실행
yarn dev
```

### 개발 편의를 위한 우회 전략 (Local Bypass)
빅테크 개발 문화를 반영하여, 로컬 환경(`development`)에서는 백엔드 서버 없이도 UI 개발이 가능하도록 아래 기능이 활성화되어 있습니다.
- **Auth Bypass**: 토큰이 없어도 `/settings` 등 인증 페이지 접근 가능.
- **API Fallback**: API 호출 실패 시 자동으로 Mock 데이터를 로드하여 UI 레이아웃 확인 가능.
- **Security Bypass**: 로컬 테스트를 방해하는 CSP 정책 등이 개발 모드에서는 자동 해제됨.
