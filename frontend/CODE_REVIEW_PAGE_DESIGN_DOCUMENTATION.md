# Code Review Page (`/review/:submissionId`) 디자인 문서

## 페이지 개요
- **경로**: `/review/:submissionId`
- **메인 컴포넌트**: `src/pages/code/CodeReviewPage.tsx`
- **레이아웃 래퍼**: `BasePage` (최대 너비 `max-w-7xl`, 패딩 `py-4`)
- **페이지 컨테이너**: 최대 너비 `max-w-[1200px]`, 수평 패딩 없음, 하단 패딩 `pb-[80px]`, 상단 패딩 없음

---

## 전체 레이아웃 구조

### 컨테이너 스타일
```css
className="mx-auto flex h-full w-full max-w-[1200px] flex-col items-start gap-8 bg-white p-[40px_0px_80px]"
```
- 최대 너비: `1200px`
- 배경: `white`
- 플렉스: 세로 방향, 좌측 정렬
- 간격: `gap-8` (32px)
- 패딩: 상단 `40px`, 하단 `80px`, 좌우 없음

---

## 1. 헤더 섹션 (Header Section)

### 컨테이너
```css
className="flex w-full flex-row items-end justify-between border-b border-[#d0d7de] pb-6"
```
- 하단 경계선: `border-[#d0d7de]` (1px)
- 하단 패딩: `pb-6` (24px)

### 좌측 영역
#### "통계로 돌아가기" 버튼
- 위치: 헤더 상단
- 스타일:
  - 텍스트: `text-sm text-[#656d76]`
  - 호버: `hover:text-[#0969da]`
  - 아이콘: 화살표 SVG (16x16, stroke `currentColor`)
  - 간격: `gap-1` (4px)

#### 문제 제목 영역
- **제목**:
  - 크기: `text-[24px]`
  - 굵기: `font-semibold`
  - 색상: `text-[#1f2328]`
  - 줄 높이: `leading-tight`
  - 호버(링크인 경우): `hover:text-[#0969da]`
  - 형식: `{problemNo}. {title}`

- **플랫폼 배지** (문제 제목 옆):
  ```css
  className="inline-flex items-center rounded-md border border-[#d0d7de] bg-[#f6f8fa] px-2 py-0.5 text-xs leading-none font-semibold text-[#1f2328]"
  ```
  - 테두리: `border-[#d0d7de]`
  - 배경: `bg-[#f6f8fa]`
  - 패딩: `px-2 py-0.5`
  - 텍스트: `text-xs font-semibold text-[#1f2328]`

- **작성자 정보**:
  - 텍스트: `text-sm text-[#656d76]`
  - 형식: `{nickname}님의 코드`
  - 닉네임: `font-medium text-[#1f2328]`

---

## 2. 상단 섹션 (Top Section: Approach & History)

### 컨테이너
```css
className="flex w-full gap-6"
```
- 간격: `gap-6` (24px)

### 좌측: Problem Approach

#### 컨테이너
```css
className="flex flex-1 flex-col gap-4"
```

#### 헤더 (제목 + 알고리즘 태그)
```css
className="flex items-center justify-between gap-4"
```
- **제목**: `text-lg font-semibold text-[#1f2328]`
  - 텍스트: "Problem Approach"
  - 수평 정렬: 좌측 (`shrink-0`)

- **알고리즘 태그 리스트**:
  - 위치: 제목 오른쪽
  - 컨테이너: `min-w-0 flex-1`
  - 컴포넌트: `AlgorithmTagList`

#### 전략 내용 영역
```css
className="flex h-[335px] flex-col border-t border-b border-[#d0d7de]"
```
- **높이**: 고정 `335px`
- **경계선**: 상하 `border-[#d0d7de]`
- **내부 컨테이너**:
  ```css
  className="flex-1 overflow-y-auto px-0 py-4"
  ```
  - 스크롤: 내용이 길면 세로 스크롤
  - 패딩: 좌우 없음, 상하 `py-4`

- **내용 텍스트**:
  ```css
  className="text-sm leading-6 whitespace-pre-wrap text-[#1f2328]"
  ```
  - 빈 내용일 때:
    ```css
    className="text-[#656d76] italic"
    ```
    - 텍스트: "문제를 어떻게 접근했는지 작성해주세요!"

### 우측: 제출 히스토리 (History Box)

#### 컨테이너
```css
className="flex shrink-0"
```

#### HistoryBox 컴포넌트 스타일
```css
className="flex h-[380px] w-[340px] flex-col rounded border border-[#d0d7de] bg-white"
```
- **크기**: 고정 `340px × 380px`
- **테두리**: `rounded border border-[#d0d7de]`
- **배경**: `bg-white`

##### 헤더
```css
className="flex items-center justify-between border-b border-[#d0d7de] bg-[#f6f8fa] px-4 py-2.5"
```
- 제목: `text-sm font-semibold text-[#1f2328]` ("제출 히스토리")
- 개수: `text-xs font-medium text-[#656d76]` ("{history.length}개")

##### 히스토리 리스트
```css
className="flex flex-1 flex-col overflow-y-auto px-3 pt-3 pb-3"
```
- 스크롤: 세로 스크롤 가능
- 간격: `gap-2` (8px)

##### HistoryItem 스타일

**현재 제출 (isCurrent)**:
```css
className="group flex flex-col gap-2.5 rounded-lg border bg-white px-3.5 py-3 transition-all border-[#0969da]/40 bg-[#f0f7ff] shadow-sm"
```

**일반 제출**:
```css
className="group flex flex-col gap-2.5 rounded-lg border bg-white px-3.5 py-3 transition-all border-[#e1e4e8] hover:border-[#d0d7de] hover:shadow-sm"
```

**Header (날짜 + 배지)**:
- 날짜: `text-sm font-medium text-[#1f2328]`
- 형식: `yyyy-MM-dd HH:mm`

**배지들**:
- **Current 배지**:
  ```css
  className="inline-flex items-center rounded-md border border-[#0969da]/30 bg-[#e6f6ff] px-2 py-0.5 text-xs font-semibold whitespace-nowrap text-[#0969da]"
  ```
- **Success 배지**:
  ```css
  className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold whitespace-nowrap border-[#1a7f37]/30 bg-[#dafbe1] text-[#1a7f37]"
  ```
- **Failed 배지**:
  ```css
  className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold whitespace-nowrap border-[#cf222e]/30 bg-[#ffebe9] text-[#cf222e]"
  ```

**성능 지표** (Execution Time, Memory):
- 컨테이너: `flex items-center gap-3 text-sm text-[#656d76]`
- 아이콘: SVG (14x14, `text-[#656d76]`)
- 텍스트: `{execTime} ms` / `{formatMemory(memory)}`

**알고리즘 버튼**:
- 스타일: `text-[12px] font-medium text-[#656d76] hover:text-[#1f2328]`
- 형식: "알고리즘 ({count})"
- 호버 시 Popover 표시

##### HistoryAlgorithmPopover
- 위치: Portal 기반, 트리거 요소 기준 동적 위치
- 크기: `w-[280px] max-h-[240px]`
- 스타일:
  ```css
  className="fixed z-[1000] overflow-y-auto rounded-md border border-[#d0d7de] bg-white p-3 shadow-lg"
  ```
- 헤더: "알고리즘 ({count}개)" + 닫기 버튼
- 태그 리스트: `flex flex-wrap gap-1.5`
- 태그 스타일:
  ```css
  className="inline-flex h-[22px] items-center rounded-full border border-[#d0d7de] bg-[#f6f8fa] px-2 py-0.5 text-xs font-medium text-[#656d76]"
  ```

---

## 3. 코드 에디터 섹션 (Code Editor Section)

### 컨테이너
```css
className="w-full overflow-hidden rounded border border-[#d0d7de] bg-white"
```
- 테두리: `rounded border border-[#d0d7de]`
- 배경: `bg-white`

### 헤더 바
```css
className="border-b border-[#d0d7de] bg-[#f6f8fa] px-4 py-2.5"
```

#### 좌측: "제출 정보" 레이블
```css
className="text-xs font-medium text-[#656d76]"
```

#### 우측: 배지 + 버튼
```css
className="flex items-center gap-2"
```

##### Language Badge
```css
className="inline-flex items-center rounded-md border border-[#d0d7de] bg-white px-2.5 py-1 font-mono text-xs font-semibold text-[#0969da]"
```

##### Success/Failure Badge
- **Success**:
  ```css
  className="inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold border-[#1a7f37]/30 bg-[#dafbe1] text-[#1a7f37]"
  ```
- **Failed**:
  ```css
  className="inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold border-[#cf222e]/30 bg-[#ffebe9] text-[#cf222e]"
  ```

##### Copy Button
```css
className="inline-flex h-7 w-7 items-center justify-center rounded border border-[#d0d7de] bg-white text-[#656d76] transition-colors hover:bg-[#f6f8fa]"
```
- 아이콘: 14x14 SVG
- 복사 완료 시: 체크 아이콘으로 변경

### Monaco Editor
- **테마**: `light`
- **높이**: 동적 (코드 줄 수에 따라, 최소 100px, 최대 400px)
- **옵션**:
  - `fontFamily`: "Menlo, Monaco, 'Courier New', monospace"
  - `fontSize`: 14
  - `minimap`: disabled
  - `scrollBeyondLastLine`: false
  - `readOnly`: true
  - `lineNumbers`: "on"
  - `padding`: { top: 12, bottom: 12 }
- **줄 클릭 시**: `selectedLine` 상태 업데이트 및 댓글 입력 영역으로 스크롤

---

## 4. AI 평가 섹션 (AI Evaluation Section)

### 컨테이너
```css
className="w-full border-t border-[#d0d7de] pt-8"
```
- 조건부 렌더링: `submissionDetail?.aiScoreReason` 존재 시에만 표시

### 헤더
```css
className="mb-4 flex items-center gap-3"
```

#### AI 아이콘
```css
className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0969da]"
```
- 텍스트: `text-xs font-semibold text-white` ("AI")

#### 제목 + 점수
- 제목: `text-base font-semibold text-[#1f2328]` ("AI 코드 평가")
- 점수 영역:
  ```css
  className="flex items-baseline gap-1.5"
  ```
  - 레이블: `text-xs text-[#656d76]` ("종합 점수")
  - 점수: `text-base font-semibold text-[#0969da]` ("{aiScore}점")

### 내용
```css
className="text-sm leading-6 whitespace-pre-line text-[#1f2328]"
```
- `aiScoreReason` 텍스트 표시

---

## 5. 리뷰 대화 섹션 (Review Conversation Section)

### 컨테이너
```css
className="w-full border-t border-[#d0d7de] pt-8"
```

### 제목
```css
className="mb-4 text-base font-semibold text-[#1f2328]"
```
- 텍스트: "Review Conversation"

### 댓글 리스트
```css
className="flex flex-col gap-0"
```
- 각 댓글 간격: 첫 번째 제외하고 `pt-6` (24px)

### CommentItem 컴포넌트

#### 메인 댓글 행
```css
className="group flex w-full gap-3"
```

##### 좌측: 아바타 + 타임라인 라인
```css
className="flex w-10 shrink-0 flex-col items-center"
```
- **아바타**:
  - 크기: `h-10 w-10`
  - 프로필 이미지 있을 때:
    ```css
    className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white shadow-md ring-2 ring-gray-100"
    ```
  - 프로필 이미지 없을 때:
    - 본인: `bg-gradient-to-br from-blue-500 to-blue-600`
    - 타인: `bg-gradient-to-br from-gray-400 to-gray-500`
    - 텍스트: `text-sm font-bold text-white` (닉네임 첫 2글자)

- **타임라인 라인** (children 또는 nextSibling 있을 때):
  ```css
  className="mt-1.5 w-0.5 flex-1 bg-gray-200"
  ```

##### 우측: 댓글 박스

**댓글 박스**:
```css
className="relative rounded-md border border-gray-300 bg-white"
```

**Speech Bubble Arrow** (좌측):
```css
className="absolute top-2.5 -left-2 h-3 w-3 rotate-45 border-b border-l border-gray-300 bg-gray-100"
```

**헤더**:
```css
className="relative flex items-center justify-between gap-2 rounded-t-md border-b border-gray-200 bg-gray-100 px-2.5 py-1.5"
```

- 좌측 정보:
  - 닉네임: `font-semibold text-gray-900`
  - 시간: `text-grayscale-warm-gray text-xs` (formatDistanceToNow)
  - 줄 번호 배지:
    ```css
    className="text-primary-main inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium ring-1 ring-blue-700/10 ring-inset"
    ```
    - 텍스트: "{codeLine}번 줄"
  - Author 배지 (본인 댓글):
    ```css
    className="inline-flex items-center rounded-full border border-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600"
    ```

- 우측 액션 (본인 댓글, 편집 모드 아닐 때):
  - 편집 버튼: `text-grayscale-warm-gray hover:text-primary-main`
  - 삭제 버튼: `hover:text-alert-error text-grayscale-warm-gray`
  - 아이콘: 16x16 SVG

**본문**:
```css
className="rounded-b-md bg-white px-2.5 py-2"
```
- 편집 모드:
  - `CommentInput` 컴포넌트 (`compact={true}`)
- 일반 모드:
  ```css
  className="break-words text-sm leading-relaxed text-gray-800"
  ```
  - Markdown 코드 블록 파싱 지원
  - 코드 블록 스타일:
    ```css
    className="mt-1 mb-0 overflow-hidden rounded-lg border border-gray-200/80 bg-gradient-to-br from-gray-50 to-gray-100/50 shadow-sm"
    ```
    - 헤더 (언어명):
      ```css
      className="border-b border-gray-200/60 bg-gradient-to-r from-gray-100 to-gray-50/50 px-4 py-2"
      ```
      - 텍스트: `text-xs font-bold tracking-wide text-gray-700 uppercase`
    - 코드:
      ```css
      className="font-mono text-xs leading-relaxed text-gray-900"
      ```

**Footer (Reactions)**:
```css
className="flex items-center gap-3 px-2.5 pb-2"
```

- **좋아요 버튼**:
  - 활성화:
    ```css
    className="group flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold transition-all duration-200 bg-gradient-to-br from-red-50 to-pink-50 text-red-600 shadow-sm hover:from-red-100 hover:to-pink-100 hover:shadow-md"
    ```
  - 비활성화:
    ```css
    className="group flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold transition-all duration-200 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
    ```
  - 아이콘: 16x16 SVG (하트)
  - 개수: `font-semibold` (활성화: `text-red-700`, 비활성화: `text-gray-600`)

- **Reply 버튼** (depth < 1일 때만):
  ```css
  className="text-grayscale-warm-gray flex items-center gap-1 text-xs font-medium hover:text-gray-800"
  ```
  - 아이콘: 16x16 SVG (화살표)

**Reply Input** (isReplying일 때):
```css
className="mt-2 ml-1"
```
- `CommentInput` 컴포넌트 (`compact={true}`, `placeholder="Leave a reply"`)

**하위 댓글 (Replies)**:
```css
className="mt-2 flex flex-col gap-2"
```
- 재귀적으로 `CommentItem` 렌더링 (`depth + 1`)

### 새 댓글 작성 (CommentInput - 메인)

#### 컨테이너
```css
className="rounded-xl border border-[#e1e4e8] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-200 focus-within:border-[#0969da] focus-within:shadow-[0_0_0_3px_rgba(9,105,218,0.1)]"
```

#### 그리드 레이아웃
```css
className="grid grid-cols-[1fr_140px] items-stretch gap-3 p-3"
```

##### 좌측: 텍스트 입력 영역
- **줄 선택 버튼**:
  ```css
  className="group inline-flex w-fit items-center gap-1.5 rounded-lg border border-[#c8e1ff] bg-gradient-to-br from-[#f0f7ff] via-[#e8f4ff] to-[#e0f0ff] px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-[#0969da] shadow-[0_1px_2px_rgba(9,105,218,0.08)] transition-all duration-200 hover:-translate-y-[1px] hover:border-[#96c8ff] hover:from-[#e0f0ff] hover:via-[#d8ecff] hover:to-[#d0e8ff] hover:shadow-[0_2px_4px_rgba(9,105,218,0.12)] active:translate-y-0 active:shadow-[0_1px_2px_rgba(9,105,218,0.08)]"
  ```
  - 아이콘: 14x14 SVG (문서 아이콘)
  - 텍스트: `{selectedLine ? `${selectedLine}번 줄` : "전체 리뷰"}`

- **Textarea**:
  ```css
  className="resize-none bg-transparent text-sm leading-6 text-[#1f2328] placeholder-[#8b949e] transition-all outline-none"
  ```
  - 최소 높이: `48px` (2줄)
  - 최대 높이: `220px` (9줄)
  - 자동 높이 조절
  - 단축키: Cmd/Ctrl + Enter로 제출

##### 우측: 버튼 컬럼 (고정 폭 140px)
```css
className="flex shrink-0 flex-col justify-center gap-2"
```

- **Comment 버튼**:
  ```css
  className="inline-flex h-9 w-full items-center justify-center rounded-lg bg-[#0969da] text-xs font-semibold text-white shadow-[0_1px_2px_rgba(9,105,218,0.2)] transition-colors duration-200 hover:bg-[#0550ae] hover:shadow-[0_2px_4px_rgba(9,105,218,0.3)] disabled:cursor-not-allowed disabled:opacity-50"
  ```
  - 비활성화: 내용 없을 때

- **Cancel 버튼**:
  ```css
  className="inline-flex h-9 w-full items-center justify-center rounded-lg border border-[#d1d9e0] bg-white text-xs font-medium text-[#24292f] shadow-[0_1px_0_rgba(0,0,0,0.04)] transition-all duration-200 hover:border-[#c1c9d1] hover:bg-[#f6f8fa] hover:shadow-[0_1px_2px_rgba(0,0,0,0.06)] active:bg-[#f0f2f5]"
  ```

### CommentInput (Compact 모드 - 답글/편집용)

#### 컨테이너
```css
className="flex flex-col gap-2 rounded-md border border-[#d0d7de] bg-white p-3"
```

#### Textarea
```css
className="flex-1 resize-none bg-transparent text-sm text-[#1f2328] placeholder-[#656d76] outline-none"
```
- 고정 높이: `rows={2}`

#### 버튼 (우측 정렬)
```css
className="flex justify-end gap-2"
```

- **Cancel 버튼**:
  ```css
  className="inline-flex h-8 items-center justify-center rounded-md border border-[#d0d7de] bg-[#f6f8fa] px-3 text-sm font-medium text-[#1f2328] transition-colors hover:bg-[#e6e9ed]"
  ```

- **Comment 버튼**:
  ```css
  className="inline-flex h-8 items-center justify-center rounded-md bg-[#0969da] px-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0550ae] disabled:cursor-not-allowed disabled:opacity-50"
  ```

---

## 6. 삭제 확인 배너 (Delete Confirm Banner)

### 컨테이너
```css
className="fixed inset-x-0 top-0 z-[100] flex items-center justify-center p-4"
```
- 위치: 화면 최상단 중앙
- z-index: `100`

### 배너 박스
```css
className="w-full max-w-md animate-slideDown"
```
- 애니메이션: `animate-slideDown` (0.2s ease-out, 아래로 슬라이드)

#### 내부 박스
```css
className="rounded-lg border border-[#d0d7de] bg-white shadow-lg"
```

##### 헤더
```css
className="flex items-center justify-between border-b border-[#d0d7de] bg-[#f6f8fa] px-4 py-3"
```
- 제목: `text-sm font-semibold text-[#1f2328]` ("삭제 확인")
- 닫기 버튼: `h-7 w-7 rounded text-[#656d76] hover:bg-[#e6e9ed] hover:text-[#1f2328]`

##### 본문
```css
className="flex items-center justify-between gap-4 px-4 py-4"
```
- 메시지: `text-sm leading-6 text-[#1f2328]`

- 버튼들:
  - **취소 버튼**:
    ```css
    className="inline-flex h-8 items-center justify-center rounded-md border border-[#d0d7de] bg-white px-4 text-sm font-medium text-[#1f2328] transition-colors hover:bg-[#f6f8fa]"
    ```
  - **삭제 버튼**:
    ```css
    className="inline-flex h-8 items-center justify-center rounded-md bg-[#cf222e] px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#a40e26]"
    ```

---

## 7. AlgorithmTagList 컴포넌트

### 컨테이너
```css
className="relative flex items-center"
```

### 태그 리스트
```css
className="flex items-center gap-2 overflow-hidden"
```
- `flexWrap: "nowrap"` (줄바꿈 없음)

### 태그 스타일
```css
className="inline-flex shrink-0 items-center rounded-full border border-[#d0d7de] bg-[#f6f8fa] px-2.5 py-0.5 text-xs font-medium text-[#656d76] whitespace-nowrap"
```

### +N 버튼 (숨겨진 태그 있을 때)
```css
className="relative inline-flex shrink-0 items-center rounded-full border border-[#d0d7de] bg-[#f6f8fa] px-2.5 py-0.5 text-xs font-medium text-[#656d76] whitespace-nowrap hover:bg-[#e6e9ed] transition-colors"
```
- 호버 시 Tooltip 표시

### Tooltip
```css
className="absolute right-0 top-full z-50 mt-2 max-w-[300px] rounded-md border border-[#d0d7de] bg-white p-3 shadow-lg"
```
- 헤더: `text-xs font-semibold text-[#656d76]` ("전체 알고리즘 ({count}개)")
- 태그 리스트: `flex flex-wrap gap-2`

---

## 색상 팔레트

### 주요 색상
- **배경**:
  - 메인: `#ffffff` (white)
  - 서브: `#f6f8fa` (연한 회색)
  - 호버: `#e6e9ed` (밝은 회색)

- **텍스트**:
  - 주요: `#1f2328` (거의 검정)
  - 보조: `#656d76` (회색)
  - 푸터/레이블: `#8b949e` (밝은 회색)

- **테두리**:
  - 기본: `#d0d7de` (연한 회색)
  - 호버: `#c1c9d1` (약간 어두운 회색)

- **강조 색상**:
  - Primary: `#0969da` (파란색)
  - Primary Hover: `#0550ae` (어두운 파란색)
  - Success: `#1a7f37` (초록색)
  - Success BG: `#dafbe1` (연한 초록색)
  - Error: `#cf222e` (빨간색)
  - Error BG: `#ffebe9` (연한 빨간색)

---

## 애니메이션

### slideDown (ConfirmBanner)
```css
@keyframes slideDown {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
```
- duration: `0.2s`
- easing: `ease-out`

---

## 반응형 디자인

현재 페이지는 반응형을 크게 고려하지 않았으며, 주로 고정 너비를 사용합니다:
- 최대 너비: `1200px`
- 히스토리 박스: 고정 `340px`
- Approach 섹션: `flex-1` (나머지 공간 차지)

---

## 상태 및 인터랙션

### 줄 선택 (Line Selection)
- Monaco Editor에서 줄 클릭 시 `selectedLine` 상태 업데이트
- 선택된 줄 번호가 댓글 입력 영역의 줄 선택 버튼에 표시
- 댓글 입력 영역으로 자동 스크롤 (`smooth`, `block: center`)

### 댓글 작성/편집/삭제
- 본인 댓글만 편집/삭제 가능
- 편집 모드: `CommentInput` (compact) 렌더링
- 삭제 시: `ConfirmBanner` 표시

### 좋아요
- 클릭 시 즉시 UI 업데이트 (optimistic update)
- API 호출 후 쿼리 무효화

### 답글
- 최대 깊이: 2 (depth < 1일 때만 Reply 버튼 표시)
- 답글 입력: `CommentInput` (compact, `selectedLine={null}`)

---

## 접근성 고려사항

- 버튼에 `title` 속성 포함 (도구 설명)
- 키보드 접근성: ESC 키로 배너 닫기
- 포커스 관리: 텍스트 입력 필드 자동 포커스 (compact 모드)

---

## 기타 참고사항

- 모든 색상은 GitHub 스타일을 따름
- 플랫한 디자인 (minimal border-radius, subtle shadows)
- 일관된 간격: `gap-2`, `gap-3`, `gap-4`, `gap-6`, `gap-8` 사용
- 폰트: 시스템 폰트 스택 (sans-serif), Monaco Editor는 monospace
- 모든 SVG 아이콘은 인라인 SVG 사용

