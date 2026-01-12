# AlgoGo Frontend 프로젝트 상세 분석

## 📋 프로젝트 개요

**AlgoGo**는 알고리즘 문제 풀이 및 코드 리뷰 플랫폼의 프론트엔드 애플리케이션입니다. React 19, TypeScript, Vite를 기반으로 구축되었으며, 개발자들이 알고리즘 문제를 풀고 서로의 코드를 리뷰하며 함께 성장할 수 있는 환경을 제공합니다.

---

## 🏗️ 기술 스택

### 핵심 기술
- **프레임워크**: React 19.1.1
- **언어**: TypeScript 5.9.3
- **빌드 도구**: Vite 7.1.7
- **라우팅**: React Router DOM 7.9.5
- **상태 관리**: Zustand 5.0.8
- **데이터 페칭**: TanStack React Query 5.90.7
- **HTTP 클라이언트**: Axios 1.13.2
- **스타일링**: Tailwind CSS 4.1.17
- **코드 에디터**: Monaco Editor 0.55.1 (@monaco-editor/react 4.7.0)

### 개발 도구
- **스토리북**: Storybook 10.1.4 (컴포넌트 문서화)
- **린터**: ESLint 9.36.0
- **포맷터**: Prettier 3.6.2
- **날짜 처리**: dayjs 1.11.19, date-fns 4.1.0

### 배포
- **호스팅**: Vercel (vercel.json 설정 포함)

---

## 📁 프로젝트 구조

```
frontend/
├── dist/                    # 빌드 결과물
├── node_modules/            # 의존성 패키지
├── public/                  # 정적 파일
│   ├── fonts/              # 폰트 파일 (IBMPlexSansKR, Mabinogi_Classic)
│   └── icons/              # SVG 아이콘 (39개)
├── src/
│   ├── api/                # API 호출 함수들
│   │   ├── auth/           # 인증 관련 API
│   │   ├── code/           # 코드 제출/리뷰 API
│   │   ├── group/          # 그룹 관리 API
│   │   ├── main/           # 메인 페이지 API
│   │   ├── notification/   # 알림 API
│   │   ├── problem/        # 문제 API
│   │   ├── problemset/    # 문제집 API (14개 파일)
│   │   ├── review/         # 리뷰 관리 API
│   │   ├── user/           # 사용자 API
│   │   ├── client.ts       # Axios 인스턴스 설정
│   │   └── getResponse.ts  # GET 요청 헬퍼
│   ├── assets/             # 이미지 등 리소스
│   │   └── images/
│   │       └── MainCard/   # 메인 카드 이미지 (10개)
│   ├── components/         # 재사용 가능한 컴포넌트 (115개 파일)
│   │   ├── badge/          # 배지 컴포넌트
│   │   ├── banner/         # 배너
│   │   ├── button/         # 버튼 컴포넌트
│   │   ├── cards/          # 카드 컴포넌트
│   │   │   ├── group/      # 그룹 관련 카드 (13개)
│   │   │   ├── list/       # 리스트 카드
│   │   │   ├── main/       # 메인 페이지 카드 (9개)
│   │   │   ├── mypage/     # 마이페이지 카드
│   │   │   ├── notification/ # 알림 카드
│   │   │   └── search/     # 검색 결과 카드
│   │   ├── common/         # 공통 컴포넌트
│   │   ├── empty/          # 빈 상태 컴포넌트
│   │   ├── footer/         # 푸터
│   │   ├── form/           # 폼 컴포넌트
│   │   │   ├── input/      # 입력 필드 (6개)
│   │   │   └── textarea/   # 텍스트 영역
│   │   ├── header/         # 헤더
│   │   ├── history/        # 히스토리 컴포넌트
│   │   ├── modal/          # 모달 컴포넌트
│   │   │   ├── alarm/      # 알림 모달
│   │   │   └── popup/      # 팝업 모달 (4개)
│   │   ├── mypage/         # 마이페이지 컴포넌트
│   │   ├── nav/            # 네비게이션
│   │   ├── notification/   # 알림 관련 컴포넌트
│   │   ├── pagination/     # 페이지네이션
│   │   ├── problemset/     # 문제집 컴포넌트
│   │   │   └── detail/     # 문제집 상세 컴포넌트 (4개)
│   │   ├── review/         # 리뷰 컴포넌트
│   │   ├── selectbox/      # 셀렉트 박스
│   │   ├── tables/         # 테이블 컴포넌트
│   │   ├── textLink/       # 텍스트 링크
│   │   ├── toast/          # 토스트 알림
│   │   └── toggle/         # 토글 컴포넌트
│   ├── pages/              # 페이지 컴포넌트 (24개)
│   │   ├── auth/           # 인증 페이지 (로그인, 회원가입)
│   │   ├── code/           # 코드 제출/리뷰 페이지
│   │   ├── group/          # 그룹 관련 페이지 (9개)
│   │   ├── main/           # 메인 페이지
│   │   ├── mypage/         # 마이페이지
│   │   ├── problemset/     # 문제집 페이지 (5개)
│   │   ├── search/         # 검색 페이지
│   │   └── BasePage.tsx    # 기본 페이지 레이아웃
│   ├── routes/             # 라우팅 설정
│   │   └── router.tsx      # React Router 설정
│   ├── store/              # 상태 관리 (Zustand)
│   │   ├── useAuthStore.ts    # 인증 상태 관리
│   │   └── useModalStore.ts   # 모달 상태 관리
│   ├── type/               # TypeScript 타입 정의 (13개 파일)
│   │   ├── auth/           # 인증 타입
│   │   ├── group/          # 그룹 타입
│   │   ├── mypage/         # 마이페이지 타입 (3개)
│   │   ├── notification/   # 알림 타입 (2개)
│   │   └── problemset/     # 문제집 타입 (3개)
│   ├── utils/              # 유틸리티 함수
│   │   ├── date.ts         # 날짜 포맷팅
│   │   └── notificationMessage.ts # 알림 메시지 생성
│   ├── App.tsx             # 메인 앱 컴포넌트
│   ├── main.tsx            # 진입점
│   └── index.css           # 전역 스타일
├── eslint.config.js        # ESLint 설정
├── index.html              # HTML 템플릿
├── package.json            # 프로젝트 의존성
├── pnpm-lock.yaml          # pnpm 락 파일
├── tsconfig.json           # TypeScript 설정
├── tsconfig.app.json       # 앱용 TypeScript 설정
├── tsconfig.node.json      # Node용 TypeScript 설정
├── vercel.json             # Vercel 배포 설정
└── vite.config.ts          # Vite 설정
```

---

## 🎯 주요 기능

### 1. 인증 시스템
- **로그인/회원가입**: 이메일 기반 인증
- **이메일/닉네임 중복 확인**: 실시간 검증
- **JWT 토큰 관리**: Zustand를 통한 영구 저장
- **자동 로그아웃**: 401/403 응답 시 자동 처리
- **사용자 프로필**: 프로필 조회 및 수정

**관련 파일**:
- `src/api/auth/auth.ts`
- `src/store/useAuthStore.ts`
- `src/pages/auth/LoginPage.tsx`, `JoinPage.tsx`

### 2. 메인 페이지
- **동적 콘텐츠**: 로그인 여부에 따라 다른 콘텐츠 표시
- **인기 코드 리뷰**: Hot/Recent/Join-in 카테고리별 인기 제출물
- **추천 문제집**: 인기 문제집 추천
- **그룹 현황**: 최근 생성된 그룹 목록
- **리뷰 요청**: 로그인 시 도착한 리뷰 요청 표시

**관련 파일**:
- `src/pages/main/MainPage.tsx`
- `src/api/main/getPopularProblem.ts`
- `src/components/cards/main/`

### 3. 문제집 (Problem Set) 관리
- **문제집 목록**: 카테고리별, 정렬, 검색 기능
- **문제집 생성/수정/삭제**: CRUD 기능
- **문제집 상세**: 문제 목록, 통계, 참여자 정보
- **문제 추가/제거**: 문제집에 문제 추가/삭제
- **문제 검색**: 문제집에 문제 검색 및 추가
- **통계 페이지**: 문제별 통계 정보

**관련 파일**:
- `src/pages/problemset/` (5개 페이지)
- `src/api/problemset/` (14개 API 파일)
- `src/components/problemset/`

### 4. 그룹 (Group) 기능
- **그룹 목록**: 검색, 정렬, 페이지네이션
- **그룹 생성/수정/삭제**: 그룹 관리
- **그룹 상세**: 그룹 정보, 문제 목록
- **멤버 관리**: 멤버 조회, 역할 변경, 추방
- **참여 신청**: 그룹 참여 신청 및 승인/거절
- **초대 기능**: 사용자 검색 및 초대
- **문제 관리**: 그룹에 문제 추가/삭제

**관련 파일**:
- `src/pages/group/` (9개 파일)
- `src/api/group/` (2개 파일)
- `src/components/cards/group/` (13개)

### 5. 코드 제출 및 리뷰
- **코드 제출**: Monaco Editor를 사용한 코드 작성 및 제출
- **코드 리뷰**: 제출된 코드에 대한 리뷰 작성
- **AI 리뷰**: AI 기반 코드 리뷰 (추정)
- **댓글 시스템**: 리뷰에 대한 댓글 작성
- **리뷰 요청 관리**: 리뷰 요청 조회 및 처리

**관련 파일**:
- `src/pages/code/CodeSubmitPage.tsx`, `CodeReviewPage.tsx`
- `src/api/code/` (2개 파일)
- `src/api/review/manageReview.ts`
- `src/components/review/`

### 6. 마이페이지
- **참여 현황**: 참여한 그룹, 문제집 목록
- **활동 내역**: 제출한 코드, 리뷰 작성 내역
- **작성 리뷰**: 작성한 리뷰 목록
- **받은 리뷰**: 받은 리뷰 목록
- **리뷰 요청**: 받은 리뷰 요청 목록
- **설정**: 프로필 수정, 계정 설정

**관련 파일**:
- `src/pages/mypage/MyPage.tsx`, `SettingsPage.tsx`
- `src/components/mypage/` (9개 컴포넌트)
- `src/api/mypage.ts`

### 7. 알림 시스템
- **실시간 알림**: Server-Sent Events (SSE) 또는 폴링 방식
- **알림 타입**:
  - 그룹 참여 신청/업데이트
  - 그룹 초대/업데이트
  - 리뷰 요청
  - 리뷰 생성
  - 댓글 작성
- **알림 카운트**: 읽지 않은 알림 수 표시
- **알림 목록**: 드롭다운으로 알림 목록 표시

**관련 파일**:
- `src/api/notification/` (6개 파일)
- `src/components/notification/`
- `src/utils/notificationMessage.ts`

### 8. 검색 기능
- **통합 검색**: 문제, 문제집, 그룹 등 통합 검색
- **검색 결과**: 카드 형태로 결과 표시

**관련 파일**:
- `src/pages/search/SearchPage.tsx`
- `src/components/nav/SearchNav.tsx`
- `src/components/cards/search/`

---

## 🔧 기술적 세부사항

### 상태 관리
1. **Zustand Store**:
   - `useAuthStore`: 인증 토큰 및 사용자 타입 관리 (localStorage 영구 저장)
   - `useModalStore`: 모달 열림/닫힘 상태 관리

2. **React Query**:
   - 서버 상태 관리 및 캐싱
   - 알림 데이터 캐싱 및 무효화

### API 클라이언트
- **Axios 인스턴스**: `src/api/client.ts`
  - Base URL 설정 (환경 변수 사용)
  - 요청 인터셉터: JWT 토큰 자동 추가
  - 응답 인터셉터: 401/403 시 자동 로그아웃
  - withCredentials: 쿠키 기반 인증 지원

### 라우팅
- **React Router v7**: Browser Router 사용
- **경로 별칭**: Vite path alias 설정
  - `@api`, `@assets`, `@components`, `@pages`, `@store`, `@type`, `@utils`

### 스타일링
- **Tailwind CSS 4**: 유틸리티 기반 CSS
- **커스텀 테마**: `index.css`에 정의된 색상 팔레트
  - Primary Blue 계열
  - Grayscale 계열
  - Status 색상 (success, warning, error, info)
- **커스텀 폰트**:
  - IBMPlexSansKR (Regular, Medium, SemiBold, Light)
  - Mabinogi_Classic (로고용)

### 코드 에디터
- **Monaco Editor**: VS Code 기반 코드 에디터
- **언어 지원**: 다양한 프로그래밍 언어 지원 (50+ 언어)

### 컴포넌트 구조
- **Storybook 통합**: 주요 컴포넌트에 `.stories.tsx` 파일 존재
- **재사용성**: 카드, 버튼, 배지 등 재사용 가능한 컴포넌트 구조
- **타입 안정성**: TypeScript로 모든 컴포넌트 타입 정의

---

## 📊 API 구조

### API 엔드포인트 패턴
- Base URL: `VITE_API_BASE_URL` 환경 변수
- 경로: `/api/v1/...`
- 인증: Bearer Token (JWT)

### 주요 API 카테고리

1. **인증** (`/api/v1/auths/`)
   - POST `/login` - 로그인
   - POST `/logout` - 로그아웃
   - GET `/me` - 현재 사용자 정보

2. **사용자** (`/api/v1/users/`)
   - POST `/signup` - 회원가입
   - POST `/check/emails` - 이메일 중복 확인
   - POST `/check/nicknames` - 닉네임 중복 확인
   - GET `/profiles` - 프로필 조회
   - GET `/profiles/{userId}` - 특정 사용자 프로필
   - GET `/search/members` - 사용자 검색

3. **문제집** (`/api/v1/problem-sets/`)
   - GET `/lists` - 문제집 목록
   - GET `/{programId}` - 문제집 상세
   - POST `/` - 문제집 생성
   - PUT `/{programId}` - 문제집 수정
   - DELETE `/{programId}` - 문제집 삭제
   - GET `/categories` - 카테고리 목록
   - GET `/{programId}/problems` - 문제집의 문제 목록
   - POST `/{programId}/problems` - 문제 추가
   - DELETE `/{programId}/problems` - 문제 삭제
   - GET `/search/title` - 제목으로 검색
   - GET `/search/problems` - 문제로 검색
   - GET `/statistics/{programProblemId}` - 문제 통계

4. **그룹** (`/api/v1/groups/`)
   - GET `/lists` - 그룹 목록
   - GET `/lists/me` - 내 그룹 목록
   - GET `/{programId}` - 그룹 상세
   - POST `/` - 그룹 생성
   - PUT `/{programId}` - 그룹 수정
   - DELETE `/{programId}` - 그룹 삭제
   - POST `/check/groupnames` - 그룹명 중복 확인
   - POST `/{programId}/join` - 그룹 참여
   - GET `/{programId}/problems/lists` - 그룹 문제 목록
   - POST `/{programId}/problems` - 그룹에 문제 추가
   - DELETE `/{programId}/problems` - 그룹에서 문제 삭제
   - GET `/{programId}/users` - 그룹 멤버 목록
   - PUT `/{programId}/users/{programUserId}/role` - 멤버 역할 변경
   - PUT `/{programId}/users/{programUserId}` - 멤버 추방
   - GET `/{programId}/join/lists` - 참여 신청 목록
   - PUT `/{programId}/join/{joinId}` - 참여 신청 처리
   - POST `/{programId}/invite` - 사용자 초대
   - GET `/{programId}/invite/lists` - 초대 목록
   - DELETE `/{programId}/invite/{inviteId}` - 초대 취소

5. **코드/리뷰** (`/api/v1/...`)
   - 코드 제출 및 리뷰 관련 API

6. **알림** (`/api/v1/notifications/`)
   - GET `/lists` - 알림 목록
   - GET `/count` - 알림 개수
   - DELETE `/{notificationId}` - 알림 삭제
   - PUT `/join/{joinId}` - 참여 신청 응답
   - PUT `/invite/{inviteId}` - 초대 응답

---

## 🎨 UI/UX 특징

### 디자인 시스템
- **색상**: Primary Blue 계열 (프로그래머스 스타일)
- **타이포그래피**: IBMPlexSansKR 폰트 사용
- **레이아웃**: 최대 너비 7xl (1280px) 중앙 정렬
- **반응형**: Tailwind의 반응형 클래스 활용

### 주요 UI 컴포넌트
- **카드**: 다양한 카드 컴포넌트 (그룹, 문제집, 제출물 등)
- **테이블**: 문제, 그룹, 통계 테이블
- **모달**: 확인 모달, 알림 모달, 팝업 모달
- **배지**: 카테고리, 레벨, 상태 배지
- **페이지네이션**: 목록 페이지네이션

### 사용자 경험
- **로딩 상태**: 스켈레톤 UI 및 로딩 인디케이터
- **빈 상태**: EmptyState 컴포넌트로 빈 상태 안내
- **에러 처리**: API 에러 시 자동 로그아웃 및 사용자 안내
- **모달 시스템**: 전역 모달 상태 관리

---

## 🔐 보안 및 인증

### 인증 방식
- **JWT 토큰**: Bearer Token 방식
- **토큰 저장**: Zustand persist를 통한 localStorage 저장
- **자동 갱신**: (추정) Refresh Token 메커니즘
- **자동 로그아웃**: 401/403 응답 시 자동 처리

### 보안 고려사항
- **CORS**: 개발 환경에서 프록시 설정
- **쿠키**: withCredentials로 쿠키 기반 인증 지원
- **토큰 관리**: 요청 시 자동으로 Authorization 헤더 추가

---

## 📦 빌드 및 배포

### 개발 환경
```bash
pnpm dev        # 개발 서버 실행
pnpm build      # 프로덕션 빌드
pnpm preview    # 빌드 결과 미리보기
pnpm lint       # ESLint 실행
pnpm storybook  # Storybook 실행
```

### 빌드 설정
- **Vite**: 빠른 개발 서버 및 최적화된 빌드
- **TypeScript**: 엄격한 타입 체크
- **환경 변수**: `VITE_API_BASE_URL` 사용

### 배포
- **Vercel**: SPA 라우팅을 위한 rewrite 설정
- **정적 파일**: public 폴더의 파일들이 루트에 배포

---

## 📝 코드 품질

### 타입 안정성
- **TypeScript**: 엄격한 타입 체크 활성화
- **타입 정의**: 모든 API 응답 및 컴포넌트 Props 타입 정의
- **타입 파일**: `src/type/` 디렉토리에 체계적으로 정리

### 코드 스타일
- **ESLint**: React Hooks, TypeScript 규칙 적용
- **Prettier**: 코드 포맷팅
- **Storybook**: 컴포넌트 문서화 및 테스트

### 아키텍처 패턴
- **컴포넌트 기반**: 재사용 가능한 컴포넌트 구조
- **관심사 분리**: API, 컴포넌트, 페이지, 타입 분리
- **경로 별칭**: 깔끔한 import 경로

---

## 🚀 성능 최적화

### 코드 분할
- **Monaco Editor**: 동적 로딩 (언어별 청크 분리)
- **라우트 기반**: React Router의 코드 스플리팅

### 최적화 기법
- **React Query**: 서버 상태 캐싱 및 자동 리페칭
- **이미지 최적화**: WebP 또는 최적화된 이미지 사용 가능
- **폰트 최적화**: font-display: swap 사용

---

## 🔄 상태 관리 흐름

### 인증 흐름
1. 사용자 로그인 → JWT 토큰 받음
2. Zustand store에 토큰 저장 (localStorage)
3. 모든 API 요청에 토큰 자동 추가
4. 401/403 응답 시 자동 로그아웃

### 모달 관리
1. `useModalStore`로 전역 모달 상태 관리
2. 모달 타입별 열림/닫힘 상태 관리
3. 컴포넌트에서 모달 타입 확인하여 표시

---

## 📚 주요 의존성 설명

- **@monaco-editor/react**: VS Code 기반 코드 에디터
- **@tanstack/react-query**: 서버 상태 관리 및 캐싱
- **axios**: HTTP 클라이언트
- **dayjs**: 날짜 처리 라이브러리
- **event-source-polyfill**: Server-Sent Events 폴리필
- **react-router-dom**: 클라이언트 사이드 라우팅
- **zustand**: 경량 상태 관리 라이브러리
- **tailwindcss**: 유틸리티 기반 CSS 프레임워크

---

## 🎯 향후 개선 가능한 부분

1. **에러 처리**: 전역 에러 바운더리 추가
2. **로딩 상태**: 전역 로딩 인디케이터
3. **테스트**: 단위 테스트 및 통합 테스트 추가
4. **접근성**: ARIA 레이블 및 키보드 네비게이션 개선
5. **국제화**: i18n 지원 (현재 한국어만)
6. **PWA**: Progressive Web App 기능 추가
7. **성능 모니터링**: 에러 추적 및 성능 분석 도구 통합

---

## 📌 특이사항

1. **Monaco Editor**: 대용량 번들 (언어별 청크 분리됨)
2. **Storybook**: 컴포넌트 문서화 도구 통합
3. **경로 별칭**: 깔끔한 import 경로 (`@api`, `@components` 등)
4. **타입 안정성**: 엄격한 TypeScript 설정
5. **한국어 중심**: UI 텍스트 및 날짜 포맷이 한국어 기준

---

## 📞 프로젝트 정보

- **프로젝트명**: AlgoGo Frontend
- **버전**: 0.0.0
- **패키지 매니저**: pnpm
- **Node 버전**: (package.json에 명시되지 않음, 추정: Node 18+)

---

이 분석 문서는 프로젝트의 전체 구조와 기능을 이해하는 데 도움이 됩니다. 추가 질문이나 특정 부분에 대한 상세 분석이 필요하시면 알려주세요.

