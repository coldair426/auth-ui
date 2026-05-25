# 빵돌이 통합 인증 (Breadkun Integrated Authentication)

여러 서비스에서 공유하여 사용하는 **범용 통합 인증 UI 서비스**입니다.  
`clientId`를 기반으로 각 프로젝트의 브랜딩(로고, 컬러, 제목 등)을 동적으로 반영하며, 심리학 및 UX 원칙에 기반한 프리미엄 사용자 경험을 제공합니다.

---

## 🎨 디자인 및 브랜딩 (Branding)

본 프로젝트는 **"Breadkun (빵돌이)"**의 정체성을 담은 **Premium Minimalist** 디자인을 지향합니다.

- **브랜드 컬러**: 따뜻한 빵의 질감을 담은 Amber/Orange 그라데이션 (`#D97706` → `#F59E0B`)을 메인 테마로 사용합니다.
- **에셋 최적화**: 고화질 `logo.webp`를 사용하여 로딩 속도와 선명도를 모두 확보했습니다.
- **글래스모피즘**: Framer Motion과 Tailwind CSS 4를 활용하여 부드러운 `backdrop-blur` 효과를 적용했습니다. 특히 모바일 환경에서는 배경 요소와의 간섭을 고려하여 투명도를 동적으로 최적화하여 일관된 가독성을 제공합니다.

---

## 🔄 인증 프로세스 (Auth Process)

다른 프로젝트(Client)에서 이 시스템을 연동할 때의 전체 흐름입니다.

### 1. 인증 요청 (Redirect)
클라이언트 서비스는 사용자를 아래 URL로 리다이렉트 시킵니다.
```
https://auth.breadkun.com/login?clientId={MY_CLIENT_ID}&redirectUri={MY_REDIRECT_URI}&mode=redirect
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

---

## 📱 주요 페이지 및 기능

| 경로 | 설명 | 동적 변경 요소 |
|------|------|------|
| `/` | 메인 랜딩 페이지 | 데모 로그인 및 서비스 소개 |
| `/login` | 메인 로그인 화면 | 로고, 그라데이션, 타이틀, 파비콘 |
| `/join` | 서비스 가입 동의 | 로고, 브랜드 테마, 서비스 명칭 |
| `/settings/connections` | 소셜 계정 연동 관리 | 사용자 정보 및 연결된 소셜 계정 |

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
