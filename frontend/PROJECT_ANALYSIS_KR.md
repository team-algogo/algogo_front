# Algogo Frontend 프로젝트 상세 분석

## 📋 목차
1. [프로젝트 개요](#프로젝트-개요)
2. [기술 스택](#기술-스택)
3. [프로젝트 구조](#프로젝트-구조)
4. [주요 기능](#주요-기능)
5. [아키텍처 패턴](#아키텍처-패턴)
6. [설정 파일](#설정-파일)
7. [컴포넌트 구조](#컴포넌트-구조)
8. [API 구조](#api-구조)
9. [상태 관리](#상태-관리)
10. [스타일링 시스템](#스타일링-시스템)

---

## 프로젝트 개요

**Algogo**는 알고리즘 문제 해결 및 코드 리뷰 플랫폼의 프론트엔드 애플리케이션입니다. 
코드 제출, 리뷰, 그룹 관리, 문제집 관리 등의 기능을 제공하는 풀스택 웹 애플리케이션의 클라이언트 사이드입니다.

### 주요 특징
- 🎯 알고리즘 문제 제출 및 리뷰 시스템
- 👥 그룹 기반 협업 기능
- 📚 문제집(Problem Set) 관리
- 🔔 실시간 알림 시스템 (SSE)
- 📊 통계 및 분석 기능

---

## 기술 스택

### 핵심 프레임워크 및 라이브러리
- **React 19.1.1** - 최신 버전의 React 사용
- **TypeScript 5.9.3** - 타입 안정성 보장
- **Vite 7.1.7** - 빠른 개발 환경 및 빌드 도구
- **React Router DOM 7.9.5** - 클라이언트 사이드 라우팅

### 상태 관리 및 데이터 페칭
- **Zustand 5.0.8** - 경량 상태 관리 라이브러리
  - `useAuthStore` - 인증 상태 관리 (persist 미들웨어 사용)
  - `useModalStore` - 모달 상태 관리
  - `useToastStore` - 토스트 알림 상태 관리
- **TanStack Query 5.90.7** - 서버 상태 관리 및 캐싱
- **Axios 1.13.2** - HTTP 클라이언트

### UI/UX
- **Tailwind CSS 4.1.17** - 유틸리티 기반 CSS 프레임워크
- **Monaco Editor 0.55.1** - 코드 에디터 (VS Code 에디터 엔진)
- **@monaco-editor/react 4.7.0** - React용 Monaco Editor 래퍼

### 날짜/시간 처리
- **date-fns 4.1.0** - 날짜 포맷팅
- **dayjs 1.11.19** - 경량 날짜 라이브러리 (상대 시간, 타임존 처리)

### 실시간 통신
- **event-source-polyfill 1.0.31** - SSE(Server-Sent Events) 폴리필

### 개발 도구
- **ESLint 9.36.0** - 코드 린팅
- **Prettier 3.6.2** - 코드 포맷팅
- **Storybook 10.1.4** - 컴포넌트 문서화 및 개발 도구
- **TypeScript ESLint 8.45.0** - TypeScript 린팅

### 배포
- **Vercel** - 배포 플랫폼 (vercel.json 설정)

---

## 프로젝트 구조

```
frontend/
├── dist/                    # 빌드 출력 디렉토리
├── public/                  # 정적 자산
│   ├── fonts/              # 웹 폰트 파일들
│   │   ├── IBMPlexSansKR-*.woff
│   │   └── Mabinogi_Classic.woff
│   └── icons/              # SVG 아이콘들 (39개)
├── src/
│   ├── api/                # API 호출 로직 (33개 파일)
│   │   ├── auth/           # 인증 관련 API
│   │   ├── code/           # 코드 제출/리뷰 API
│   │   ├── group/          # 그룹 관리 API
│   │   ├── notification/   # 알림 API
│   │   ├── problem/        # 문제 관련 API
│   │   ├── problemset/     # 문제집 API
│   │   ├── review/         # 리뷰 관리 API
│   │   ├── user/           # 사용자 API
│   │   ├── client.ts       # Axios 인스턴스 및 인터셉터
│   │   └── getResponse.ts  # 응답 처리 유틸리티
│   ├── assets/             # 이미지 등 리소스
│   │   └── images/
│   │       └── MainCard/   # 메인 카드 이미지 (10개)
│   ├── components/         # 재사용 가능한 컴포넌트 (120개 파일)
│   │   ├── badge/          # 뱃지 컴포넌트
│   │   ├── banner/         # 배너 컴포넌트
│   │   ├── button/         # 버튼 컴포넌트
│   │   ├── cards/          # 카드 컴포넌트들
│   │   │   ├── group/      # 그룹 관련 카드 (13개)
│   │   │   ├── list/       # 리스트 카드 (2개)
│   │   │   ├── main/       # 메인 페이지 카드 (9개)
│   │   │   ├── mypage/     # 마이페이지 카드 (3개)
│   │   │   ├── notification/ # 알림 카드 (2개)
│   │   │   └── search/     # 검색 카드 (1개)
│   │   ├── form/           # 폼 컴포넌트
│   │   │   ├── input/      # 입력 필드 (6개)
│   │   │   └── textarea/   # 텍스트 영역 (2개)
│   │   ├── header/         # 헤더 컴포넌트
│   │   ├── history/        # 제출 이력 컴포넌트
│   │   ├── modal/          # 모달 컴포넌트
│   │   ├── mypage/         # 마이페이지 컴포넌트
│   │   ├── notification/   # 알림 컴포넌트
│   │   ├── pagination/     # 페이지네이션
│   │   ├── problemset/     # 문제집 컴포넌트
│   │   ├── review/         # 리뷰 컴포넌트
│   │   ├── tables/         # 테이블 컴포넌트
│   │   ├── toast/          # 토스트 알림
│   │   └── ...             # 기타 컴포넌트들
│   ├── hooks/              # 커스텀 훅
│   │   └── useNotificationSSE.ts  # SSE 알림 훅
│   ├── pages/              # 페이지 컴포넌트 (24개)
│   │   ├── auth/           # 인증 페이지
│   │   ├── code/           # 코드 제출/리뷰 페이지
│   │   ├── group/          # 그룹 페이지 (9개)
│   │   ├── main/           # 메인 페이지
│   │   ├── mypage/         # 마이페이지
│   │   ├── problemset/     # 문제집 페이지 (5개)
│   │   └── search/         # 검색 페이지
│   ├── routes/             # 라우팅 설정
│   │   └── router.tsx      # 라우터 구성
│   ├── store/              # 상태 관리 (Zustand 스토어)
│   │   ├── useAuthStore.ts    # 인증 상태
│   │   ├── useModalStore.ts   # 모달 상태
│   │   └── useToastStore.ts   # 토스트 상태
│   ├── type/               # TypeScript 타입 정의 (13개)
│   │   ├── auth/           # 인증 타입
│   │   ├── group/          # 그룹 타입
│   │   ├── mypage/         # 마이페이지 타입
│   │   ├── notification/   # 알림 타입
│   │   ├── problemset/     # 문제집 타입
│   │   └── response.d.ts   # 공통 응답 타입
│   ├── utils/              # 유틸리티 함수
│   │   ├── date.ts         # 날짜 포맷팅 유틸리티
│   │   └── notificationMessage.ts  # 알림 메시지 처리
│   ├── App.tsx             # 루트 컴포넌트
│   ├── main.tsx            # 애플리케이션 진입점
│   └── index.css           # 전역 스타일
├── .eslintrc.js            # ESLint 설정
├── index.html              # HTML 템플릿
├── package.json            # 의존성 및 스크립트
├── pnpm-lock.yaml          # pnpm 잠금 파일
├── tsconfig.json           # TypeScript 설정 (프로젝트 참조)
├── tsconfig.app.json       # TypeScript 앱 설정
├── tsconfig.node.json      # TypeScript Node 설정
├── vercel.json             # Vercel 배포 설정
└── vite.config.ts          # Vite 설정
```

---

## 주요 기능

### 1. 인증 시스템
- 로그인/로그아웃
- 회원가입
- 이메일/닉네임 중복 확인
- JWT 토큰 기반 인증
- 토큰 자동 갱신 및 만료 처리

### 2. 코드 제출 및 리뷰
- 코드 제출 페이지 (`/code/:programProblemId`)
- 코드 리뷰 페이지 (`/review/:submissionId`)
- Monaco Editor를 통한 코드 편집
- 알고리즘 태그 관리
- 실행 시간 및 메모리 표시

### 3. 문제집(Problem Set) 관리
- 문제집 목록 조회 (`/problemset`)
- 문제집 상세 보기 (`/problemset/:programId`)
- 문제집 생성 (`/problemset/create`)
- 문제집 수정 (`/problemset/:programId/edit`)
- 문제집 통계 (`/statistics/:programProblemId`)
- 카테고리별 필터링 및 정렬

### 4. 그룹 관리
- 그룹 목록 (`/group`)
- 그룹 상세 (`/group/:groupId`)
- 그룹 멤버 관리 (`/group/:groupId/members`)
- 그룹 초대 및 가입 요청
- 그룹 생성/수정/삭제

### 5. 실시간 알림 시스템
- SSE(Server-Sent Events) 기반 실시간 알림
- 알림 타입:
  - 그룹 가입 요청/초대
  - 리뷰 요청/생성
  - 댓글 알림
- 알림 배지 카운트 표시
- 토스트 메시지로 즉시 알림 표시

### 6. 마이페이지
- 프로필 관리
- 활동 이력 조회
- 받은 리뷰/작성한 리뷰 관리
- 설정 페이지

### 7. 검색 기능
- 문제집/그룹 검색
- 문제 검색
- 다양한 필터 옵션

---

## 아키텍처 패턴

### 1. 계층형 아키텍처
```
Pages (UI Layer)
  ↓
Components (Presentation Layer)
  ↓
API (Data Layer)
  ↓
Backend
```

### 2. 상태 관리 전략
- **서버 상태**: TanStack Query로 관리 (캐싱, 자동 리프레시)
- **클라이언트 상태**: Zustand로 관리 (인증, UI 상태)
- **폼 상태**: 로컬 컴포넌트 상태 또는 React Hook Form (추정)

### 3. API 클라이언트 패턴
- Axios 인스턴스 생성 (`src/api/client.ts`)
- 요청 인터셉터: Authorization 헤더 자동 추가
- 응답 인터셉터: 401/403 에러 시 자동 로그아웃

### 4. 라우팅 구조
- React Router v7의 `createBrowserRouter` 사용
- 중첩 라우팅 (App 컴포넌트가 레이아웃 역할)
- 동적 라우트 파라미터 (`:groupId`, `:submissionId` 등)

### 5. 컴포넌트 설계 원칙
- **재사용 가능한 컴포넌트**: Button, Input, Badge 등
- **도메인별 컴포넌트**: Group, ProblemSet, Review 등
- **스토리북 통합**: 주요 컴포넌트에 Storybook 스토리 작성

---

## 설정 파일

### vite.config.ts
- **개발 서버 프록시**: `/api` → `VITE_API_BASE_URL`
- **경로 별칭(Alias)**:
  - `@api` → `src/api`
  - `@components` → `src/components`
  - `@pages` → `src/pages`
  - `@store` → `src/store`
  - `@type` → `src/type`
  - `@utils` → `src/utils`
  - `@assets` → `src/assets`
- **플러그인**: React, Tailwind CSS

### tsconfig.app.json
- **타겟**: ES2022
- **모듈 시스템**: ESNext
- **JSX**: react-jsx
- **엄격 모드**: 활성화
- **경로 별칭**: vite.config.ts와 동일하게 설정

### index.css
- **커스텀 테마**: Tailwind CSS 4.0의 `@theme` 사용
- **컬러 팔레트**: Primary Blue, Grayscale, Status Colors
- **폰트 시스템**:
  - Logo: Mabinogi Classic
  - Body: IBM Plex Sans KR
- **타이포그래피 유틸리티 클래스**
- **커스텀 스크롤바 스타일**

---

## 컴포넌트 구조

### 주요 컴포넌트 카테고리

#### 1. Form Components (`components/form/`)
- **Input**: 다양한 타입의 입력 필드
- **Textarea**: 멀티라인 텍스트 입력

#### 2. Card Components (`components/cards/`)
- **Main Cards**: 메인 페이지용 카드들
  - MainProblemSetCard
  - MainSubmissionCard
  - MainProblemCard
  - ReviewRequestCard
- **Group Cards**: 그룹 관련 카드
- **Mypage Cards**: 마이페이지 카드

#### 3. Table Components (`components/tables/`)
- **ProblemTable**: 문제 목록 테이블
- **GroupTable**: 그룹 목록 테이블
- **StatisticsTable**: 통계 테이블
- 각 테이블마다 Item 컴포넌트 분리

#### 4. Modal Components (`components/modal/`)
- **ConfirmModal**: 확인 모달
- **AlertModal**: 알림 모달
- **Popup Modals**: 그룹 초대, 가입 요청 등

#### 5. Notification Components (`components/notification/`)
- **NotificationContainer**: 알림 컨테이너
- **NotificationDropdown**: 알림 드롭다운
- **NotificationItem**: 알림 아이템
- **InviteModal**: 초대 모달

#### 6. Review Components (`components/review/`)
- **AiReviewCard**: AI 리뷰 카드
- **AlgorithmTagList**: 알고리즘 태그 목록
- **CommentInput**: 댓글 입력
- **CommentItem**: 댓글 아이템

#### 7. History Components (`components/history/`)
- **HistoryBox**: 제출 이력 박스
- **HistoryItem**: 제출 이력 아이템
- **HistoryAlgorithmPopover**: 알고리즘 팝오버

### 컴포넌트 특징
- **Storybook 통합**: 많은 컴포넌트에 `.stories.tsx` 파일 존재
- **TypeScript**: 모든 컴포넌트 타입 안정성 보장
- **Tailwind CSS**: 유틸리티 클래스 기반 스타일링
- **재사용성**: Props 인터페이스로 유연한 사용

---

## API 구조

### API 클라이언트 (`src/api/client.ts`)
```typescript
- Axios 인스턴스 생성
- Base URL: 환경 변수에서 가져옴
- withCredentials: true (쿠키 사용)
- 요청 인터셉터: Authorization 헤더 추가
- 응답 인터셉터: 401/403 에러 처리
```

### API 모듈 구조

#### 1. Auth API (`api/auth/auth.ts`)
- `postLogin` - 로그인
- `postLogout` - 로그아웃
- `getCheckUser` - 현재 사용자 확인
- `postSignUp` - 회원가입
- `postCheckEmail` - 이메일 중복 확인
- `postCheckNickname` - 닉네임 중복 확인
- `getUserDetail` - 사용자 상세 정보

#### 2. Code API (`api/code/`)
- `codeSubmit.ts` - 코드 제출 관련
- `reviewSubmit.ts` - 리뷰 제출 관련

#### 3. Group API (`api/group/`)
- `groupApi.ts` - 그룹 CRUD
- `getGroupMe.ts` - 내 그룹 조회

#### 4. ProblemSet API (`api/problemset/`)
- `getProblemSetList` - 문제집 목록
- `getProblemSetDetail` - 문제집 상세
- `createProblemSet` - 문제집 생성
- `updateProblemSet` - 문제집 수정
- `deleteProblemSet` - 문제집 삭제
- `addProblems` - 문제 추가
- `removeProblems` - 문제 제거
- `getProblemSetProblems` - 문제집 내 문제 목록
- `getCategoryList` - 카테고리 목록
- `searchProblems` - 문제 검색
- `getProblemStatistics` - 문제 통계
- `getProblemSetSearchByTitle` - 제목으로 검색
- `getProblemSetSearchByProblems` - 문제로 검색

#### 5. Notification API (`api/notification/`)
- `getNotificationList` - 알림 목록
- `getAlarmCount` - 알림 개수
- `deleteNotification` - 알림 삭제
- `respondToInvite` - 초대 응답
- `respondToJoinRequest` - 가입 요청 응답
- `getGroupDetail` - 그룹 상세 (알림용)

#### 6. Review API (`api/review/`)
- `manageReview.ts` - 리뷰 관리

### API 응답 처리 (`api/getResponse.ts`)
- 공통 응답 타입 처리
- 에러 핸들링

---

## 상태 관리

### Zustand 스토어

#### 1. useAuthStore
```typescript
- userType: "User" | null
- authorization: string (JWT 토큰)
- persist 미들웨어 사용 (localStorage에 저장)
- 로그인 상태 유지
```

#### 2. useModalStore
```typescript
- modalType: "popup" | "alert" | "campaign" | null
- openModal(type)
- closeModal()
- isOpen(type)
```

#### 3. useToastStore
```typescript
- message: string
- type: "success" | "error" | "info" | "warning"
- isVisible: boolean
- showToast(message, type?)
- hideToast()
```

### TanStack Query
- 서버 상태 캐싱
- 자동 리프레시
- Optimistic Updates
- Query Key 패턴: `['alarmCount']`, `['notifications']` 등

---

## 스타일링 시스템

### Tailwind CSS 4.0 사용
- **@theme**: 커스텀 테마 정의
- **유틸리티 클래스**: 유연한 스타일링

### 디자인 시스템

#### 컬러 팔레트
- **Primary**: Blue 계열 (#0d6efd 메인)
- **Grayscale**: 50-900 단계
- **Status**: Success, Warning, Error, Info

#### 타이포그래피
- **폰트 패밀리**:
  - Logo: Mabinogi Classic
  - Display: Mabinogi Classic
  - Headline: IBM Plex Sans KR Semi-bold
  - Title: IBM Plex Sans KR Medium
  - Body: IBM Plex Sans KR Regular
  - Content: IBM Plex Sans KR Light

#### 유틸리티 클래스
- `.text-heading-1/2/3` - 헤딩 스타일
- `.text-body-1` - 본문 스타일
- `.text-small` - 작은 텍스트
- `.shadow-soft` - 부드러운 그림자
- `.shadow-card` - 카드 그림자
- `.text-logo` - 로고 스타일 (그라디언트)

### 반응형 디자인
- Tailwind의 반응형 브레이크포인트 사용
- `sm:`, `md:`, `lg:` 프리픽스 활용

---

## 특별한 기능 및 구현

### 1. SSE 알림 시스템
```typescript
// hooks/useNotificationSSE.ts
- EventSourcePolyfill 사용
- Authorization 헤더 포함
- 자동 재연결
- React Query와 통합 (캐시 무효화)
- 토스트 메시지 자동 표시
```

### 2. 날짜 처리
```typescript
// utils/date.ts
- UTC → 로컬 타임존 변환
- 상대 시간 포맷 ("방금 전", "5분 전")
- 한국어 로케일
```

### 3. 코드 에디터 통합
- Monaco Editor 사용
- 다양한 언어 지원 (TypeScript, Python, Java 등)
- 테마 및 설정 커스터마이징

### 4. 이미지 최적화
- WebP 또는 최적화된 이미지 형식
- Lazy loading 고려

---

## 개발 워크플로우

### 스크립트 명령어
```json
{
  "dev": "vite",              // 개발 서버 실행
  "build": "tsc -b && vite build",  // 프로덕션 빌드
  "lint": "eslint .",         // 코드 린팅
  "preview": "vite preview",  // 빌드 미리보기
  "storybook": "storybook dev -p 6006",  // Storybook 실행
  "build-storybook": "storybook build"   // Storybook 빌드
}
```

### 패키지 매니저
- **pnpm** 사용 (pnpm-lock.yaml 존재)

### 환경 변수
- `VITE_API_BASE_URL`: API 기본 URL

---

## 배포

### Vercel 설정 (`vercel.json`)
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```
- SPA 라우팅을 위한 모든 경로를 index.html로 리다이렉트

---

## 코드 품질

### TypeScript
- **엄격 모드** 활성화
- **타입 안정성** 보장
- **경로 별칭** 사용으로 깔끔한 import

### ESLint
- React Hooks 규칙
- TypeScript 규칙
- React Refresh 플러그인

### 컴포넌트 구조
- **함수형 컴포넌트** 사용
- **Custom Hooks**로 로직 분리
- **타입 정의** 명확히

---

## 개선 가능한 영역

1. **에러 처리**: 전역 에러 바운더리 추가 고려
2. **로딩 상태**: Suspense 및 로딩 스켈레톤 통일
3. **접근성**: ARIA 속성 및 키보드 네비게이션 개선
4. **성능 최적화**: React.memo, useMemo 등 최적화 기법 추가
5. **테스트**: 단위 테스트 및 통합 테스트 추가
6. **문서화**: API 문서 및 컴포넌트 사용 가이드 정리

---

## 프로젝트 통계

- **총 파일 수**: 약 200+ 파일
- **컴포넌트**: 120+ 컴포넌트
- **페이지**: 24개 페이지
- **API 엔드포인트**: 33+ API 함수
- **타입 정의**: 13+ 타입 파일
- **의존성**: 25개 (dependencies + devDependencies)

---

## 결론

Algogo Frontend는 현대적인 웹 개발 베스트 프랙티스를 따르는 잘 구조화된 React 애플리케이션입니다. 
TypeScript, Zustand, TanStack Query, Tailwind CSS 등의 최신 기술 스택을 활용하여 
확장 가능하고 유지보수하기 쉬운 코드베이스를 구축했습니다.

특히 다음과 같은 강점이 있습니다:
- ✅ 명확한 폴더 구조 및 관심사 분리
- ✅ 타입 안정성 보장
- ✅ 재사용 가능한 컴포넌트 설계
- ✅ 실시간 알림 시스템 통합
- ✅ 반응형 디자인
- ✅ 개발자 경험 개선 (Storybook, ESLint, Prettier)

---

**작성일**: 2024년
**프로젝트 버전**: 0.0.0 (개발 중)

