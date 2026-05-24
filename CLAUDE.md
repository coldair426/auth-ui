# auth-ui

## 프로젝트 개요
- 공통 인증 서버 프론트엔드
- Next.js 14 App Router + TypeScript + Tailwind CSS
- 소셜 로그인만 지원 (네이버 / 카카오 / 구글)
- 이메일 / 비밀번호 로그인 없음
- Vercel 배포
- 백엔드: auth-server (Spring Boot / Kotlin)

## 인증 방식
- Access Token: zustand 메모리 저장
- Refresh Token: HttpOnly Cookie (서버 자동 세팅)
- 백엔드 URL: NEXT_PUBLIC_API_URL 환경변수로 관리

## 핵심 개념
- client_id: 어느 사이드 프로젝트에서 온 요청인지 식별
- project_members: 프로젝트별 가입 여부 별도 관리
- 소셜 연동: 사용자가 설정 페이지에서 직접 추가 / 해제
- 동일 사용자 통합: 자동 매칭 없음, 사용자가 직접 연동

## 페이지 구성
- /login                   소셜 로그인 선택 (client_id, redirect 쿼리 파라미터 수신)
- /join                    프로젝트 가입 페이지
- /callback/[provider]     소셜 콜백 처리
- /settings                계정 설정
- /settings/connections    소셜 연동 관리
- /error                   에러 페이지

## 디렉토리 규칙
- 백엔드 호출: src/lib/api/
- 전역 상태: src/store/
- 타입 정의: src/types/
- 공통 UI 컴포넌트: src/components/ui/
- 인증 컴포넌트: src/components/auth/

## 코딩 컨벤션
- 컴포넌트: function 선언식
- 클라이언트 컴포넌트: 파일 상단 'use client' 명시
- 에러 메시지: 한국어
- 스타일: Tailwind CSS만 사용
- 폼: react-hook-form + zod
- HTTP 요청: axios
- 전역 상태: zustand

## 환경변수
- NEXT_PUBLIC_API_URL: 백엔드 Auth Server URL
- NEXT_PUBLIC_APP_URL: 이 프론트 URL