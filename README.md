# auth-ui

여러 사이드 프로젝트에서 공유하는 **공통 인증 UI** 서버입니다.
소셜 로그인(네이버 / 카카오 / 구글)을 통해 사용자를 인증하고, `clientId`로 어느 프로젝트에서 온 요청인지 구별합니다.

백엔드 인증 서버([auth-server](#관련-레포))와 연동하여 동작하며, JWT는 RS256 비대칭키 방식으로 발급됩니다.

---

## 기술 스택

| 분류 | 기술 |
|------|------|
| 프레임워크 | Next.js 14 (App Router) |
| 언어 | TypeScript |
| 스타일 | Tailwind CSS |
| 폼 | react-hook-form + zod |
| 상태 관리 | Zustand |
| HTTP 클라이언트 | axios |
| 배포 | Vercel |

---

## 주요 특징

### JWT RS256 비대칭키 인증
- auth-server가 Private Key로 JWT 서명
- 각 프로젝트 백엔드는 Public Key로 자체 검증 (auth-server 재호출 불필요)
- Access Token: 메모리 저장, 만료 15분 / Refresh Token: HttpOnly Cookie, 만료 7~30일

### clientId 기반 멀티 프로젝트
- 각 사이드 프로젝트는 고유한 `clientId`를 가짐
- 프로젝트별 로고, 그라데이션 컬러 등 UI가 독립적으로 구성됨
- 프로젝트 가입 여부도 독립 관리 (A 프로젝트 가입 ≠ B 프로젝트 가입)

### 소셜 계정 통합
- 자동 계정 통합 없음 (이메일/이름 기반 자동 매칭 불가)
- 사용자가 설정 페이지에서 직접 소셜 계정 연동/해제
- 마지막 소셜 계정은 해제 불가 (로그인 수단 보호)

---

## 인증 흐름

```
프로젝트 → auth-ui (clientId, redirectUri, mode 전달)
           ↓
        clientId로 로고/컬러 조회 후 로그인 화면 렌더링
           ↓
        소셜 로그인 진행
           ↓
        auth-server: 유저 처리 + 프로젝트 가입 여부 확인
           ↓ (미가입 시)
        /join 가입 페이지
           ↓
        JWT 발급 (RS256)
           ↓
    mode=redirect: redirectUri로 이동 + token 전달
    mode=popup:    postMessage로 token 전달 후 팝업 닫힘
           ↓
    프로젝트 백엔드: Public Key로 JWT 자체 검증
```

---

## 페이지 구성

| 경로 | 설명 |
|------|------|
| `/login` | 소셜 로그인 선택 화면. `clientId`, `redirectUri`, `mode` 수신 |
| `/join` | 프로젝트 가입 페이지 |
| `/callback/[provider]` | 소셜 로그인 콜백 처리 |
| `/settings` | 계정 설정 |
| `/settings/connections` | 소셜 계정 연동 관리 |
| `/error` | 에러 페이지 |

---

## 프로젝트 구조

```
src/
├── app/                      # Next.js App Router 페이지
│   ├── login/
│   ├── join/
│   ├── callback/[provider]/
│   ├── settings/
│   │   └── connections/
│   └── error/
├── components/
│   ├── ui/                   # 공통 UI 컴포넌트
│   └── auth/                 # 인증 관련 컴포넌트
├── lib/
│   └── api/                  # 백엔드 API 호출 함수
├── store/                    # Zustand 전역 상태
└── types/                    # TypeScript 타입 정의
```

---

## 로컬 실행 방법

```bash
# 1. 의존성 설치
npm install

# 2. 환경변수 파일 생성
cp .env.example .env.local
# .env.local 파일을 열어 환경변수 값을 채워주세요

# 3. 개발 서버 실행
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속합니다.

---

## 환경변수

`.env.local` 파일을 프로젝트 루트에 생성하고 아래 변수를 설정하세요.

```env
# 백엔드 Auth Server의 URL
NEXT_PUBLIC_API_URL=http://localhost:8080

# 이 프론트엔드의 URL (소셜 로그인 콜백 주소 생성에 사용)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

| 변수명 | 설명 |
|--------|------|
| `NEXT_PUBLIC_API_URL` | 백엔드 Auth Server URL |
| `NEXT_PUBLIC_APP_URL` | 이 프론트엔드의 배포 URL |

> `NEXT_PUBLIC_` 접두사가 붙은 변수는 브라우저에서도 접근 가능합니다.

---

## 관련 레포

| 레포 | 설명 |
|------|------|
| [auth-server](https://github.com/coldair426/auth-server) | 인증 백엔드 (Spring Boot / Kotlin) |
