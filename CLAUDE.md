# auth-ui

## 프로젝트 개요
- 여러 사이드 프로젝트에서 공유하는 공통 인증 UI 서버
- Next.js 14 App Router + TypeScript + Tailwind CSS
- 소셜 로그인만 지원 (네이버 / 카카오 / 구글), 이메일/비밀번호 없음
- Vercel 배포
- 백엔드: auth-server (Spring Boot / Kotlin)

## 인증 방식
- JWT RS256 비대칭키
  - auth-server가 Private Key로 서명
  - 각 프로젝트 백엔드는 Public Key로 검증만 (auth-server 재호출 없음)
  - 초기: 환경변수로 Public Key 배포 → 추후 JWKS 엔드포인트로 확장 예정
- Access Token: Zustand 메모리 저장, 만료 15분
- Refresh Token: HttpOnly Cookie, 만료 7~30일
- 백엔드 URL: NEXT_PUBLIC_API_URL 환경변수로 관리

## 핵심 개념

### clientId
- 어느 사이드 프로젝트에서 온 요청인지 식별 (OAuth2 표준 용어, 유저 ID 아님)
- `oauth_clients` 테이블에서 clientId별 로고·컬러 등 UI 설정 관리

### 프로젝트 멤버십
- `project_members` 테이블로 프로젝트별 가입 여부 독립 관리
- A 프로젝트 가입 ≠ B 프로젝트 가입 (완전 독립)
- 가입 이력 없으면 `/join`으로 이동 (`needsJoin=true`)

### 소셜 계정 통합
- 자동 매칭 없음 (이메일/이름/생년월일 기반 자동 통합 없음)
- 사용자가 설정 페이지에서 직접 소셜 계정 연동/해제
- 마지막 남은 소셜 계정은 해제 불가 (로그인 수단 보호)

### 로그인 mode 파라미터
- `mode=redirect` (기본값): 로그인 완료 후 redirectUri로 페이지 이동, token 전달
- `mode=popup`: 팝업 창으로 열고 `postMessage`로 token 전달 후 팝업 닫힘
- DB `oauth_clients.allowed_modes`로 프로젝트별 허용 방식 제한 가능

## 페이지 구성
- `/login`                  소셜 로그인 선택 (clientId, redirectUri, mode 쿼리 파라미터 수신)
- `/join`                   프로젝트 가입 페이지
- `/callback/[provider]`   소셜 콜백 처리
- `/settings`              계정 설정
- `/settings/connections`  소셜 연동 관리
- `/error`                 에러 페이지

## 로그인 UI 상세
- clientId별로 로고(`logo_url`), 그라데이션(`gradient_from`, `gradient_to`) 다르게 표시
- `text_dark` 값으로 배경 밝기에 따라 글자색 자동 전환
- 입장 애니메이션: 배경 그라데이션 페이드인 → 카드 아래서 위로 올라옴
- 반응형:
  - 데스크탑: 하단 중앙 플로팅 카드 (360px 고정 너비)
  - 모바일: Bottom Sheet (100% 풀 너비, 상단 모서리만 둥글게, Safe Area 포함)

## 전체 인증 흐름
1. 프로젝트에서 auth-ui로 이동 (`clientId`, `redirectUri`, `mode` 전달)
2. auth-ui가 clientId로 로고/컬러 조회 후 렌더링
3. 소셜 버튼 클릭 → 소셜 로그인 진행
4. auth-server가 유저 처리 (신규 생성 or 기존 조회) + project_members 확인
5. `needsJoin=true`이면 `/join` 페이지로 이동
6. JWT 발급 (RS256, Private Key 서명)
7. mode에 따라 token 전달 (redirect or postMessage)
8. 각 프로젝트 백엔드는 Public Key로 자체 검증 (auth-server 호출 없음)

## DB 주요 테이블 (참고용)
| 테이블 | 주요 컬럼 |
|--------|-----------|
| `oauth_clients` | clientId, name, logo_url, gradient_from, gradient_to, text_dark, redirect_uris, allowed_modes |
| `users` | id, email, name, created_at |
| `social_accounts` | user_id, provider(naver/kakao/google), provider_id |
| `project_members` | user_id, client_id, joined_at |

## 디렉토리 규칙
- 백엔드 호출: `src/lib/api/`
- 전역 상태: `src/store/`
- 타입 정의: `src/types/`
- 공통 UI 컴포넌트: `src/components/ui/`
- 인증 컴포넌트: `src/components/auth/`

## 코딩 컨벤션
- 컴포넌트: function 선언식
- 클라이언트 컴포넌트: 파일 상단 `'use client'` 명시
- 에러 메시지: 한국어
- 스타일: Tailwind CSS만 사용
- 폼: react-hook-form + zod
- HTTP 요청: axios
- 전역 상태: zustand

## 환경변수
- `NEXT_PUBLIC_API_URL`: 백엔드 Auth Server URL
- `NEXT_PUBLIC_APP_URL`: 이 프론트엔드 URL
