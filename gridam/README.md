# 🧭 Git & Code Convention Guide

## 1️⃣ Git 브랜치 전략

| 브랜치      | 설명                                                  |
| ----------- | ----------------------------------------------------- |
| `main`      | 항상 **배포 가능한 상태**, 보호 브랜치                |
| `dev`       | 개발 통합 브랜치                                      |
| `feature/*` | 기능 단위 작업 (`feature/login`, `feature/user-card`) |
| `hotfix/*`  | 긴급 수정용 브랜치                                    |

### 작업 흐름

1. **이슈 생성** → 작업 범위/AC 명시
2. `feature/*` 브랜치 생성 후 커밋 진행
3. PR 생성 → `dev`
4. **CI 통과 + 리뷰어 1명 이상 승인** 후 머지

> 매일 오후 4시 원격 `push` 진행

### 브랜치명 규칙

```
feature/<scope>-<short-desc>
```

---

## 2️⃣ 커밋 컨벤션

```
type(scope): message
```

예시:

```
feat(me): 게시글 조회 API 추가
style(me): 게시글 카드 컴포넌트 생성
```

| Type       | 설명                          |
| ---------- | ----------------------------- |
| `feat`     | 새로운 기능 추가              |
| `fix`      | 버그 수정                     |
| `refactor` | 리팩토링                      |
| `docs`     | 문서 수정                     |
| `chore`    | 빌드/설정 변경 (코드 X)       |
| `test`     | 테스트 추가/수정              |
| `perf`     | 성능 개선                     |
| `style`    | 포맷, 세미콜론 등 비로직 수정 |

---

## 3️⃣ 파일 & 폴더 네이밍

- **파일명:** `kebab-case` → `user-card.tsx`, `auth-service.ts`
- **컴포넌트명:** PascalCase → `function UserCard()`
- **훅:** 파일 `use-무엇.ts`, 함수 `use무엇`
- **테스트:** `.test.ts(x)`
- **스타일:** `.module.css` or `.module.scss`
- **폴더:** kebab-case
  > 예외: 설정/최상위 파일(`README.md`, `.eslintrc.cjs` 등)

---

## 4️⃣ 코딩 컨벤션 (TypeScript + React)

- **TypeScript 우선**, `any` 지양 (`TODO`로 표시)
- **함수형 컴포넌트 + 훅** 사용
- **불변성 유지**, **단방향 데이터 흐름**
- **사이드이펙트는 훅 내부로** (`useEffect`, custom hook)
- **Prettier 규칙**
  - 최대 줄 길이 120자
  - 2 스페이스 들여쓰기
  - 세미콜론 O, `'` 작은따옴표
  - import 정렬: 외부 → 절대(`@/*`) → 상대
- **명시적 반환 타입**, **조기 반환** 권장

---

## 5️⃣ React 컴포넌트 규칙

- 파일당 **1개의 주요 기능**
- Props는 명시적 타입
- `memo`, `useMemo`, `useCallback`은 필요 시에만
- `ref` 우선 사용, 직접 DOM 조작 최소화
- 접근성(a11y) 고려 (`alt`, `aria-*`, 포커스 등)

---

## 6️⃣ 타입 import 규칙

- **type-only import** 사용
  ```ts
  import type { User } from '@/types'
  ```
- `tsconfig`: `"verbatimModuleSyntax": true` 권장
- ESLint:
  ```js
  '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }]
  ```

---

## 7️⃣ 코드 리뷰 가이드

- PR 설명 충실, 변경 범위 작게 (가급적 300줄 이하)
- 리뷰어는 **의도 / 설계 / 테스트 케이스 중심** 피드백
- 승인 조건: CI 통과 + 1인 이상 승인 + 주요 피드백 반영

> 📌 이 문서는 팀 공통 개발 규칙을 요약한 것입니다.

---

# 📁 Gridam 폴더 구조 명세서

## 🗂 전체 구조

```
src/
  app/              # Next.js App Router 페이지/레이아웃
  components/
    ui/             # only UI 컴포넌트
    three/          # Three.js / R3F 관련 컴포넌트
  features/         # 도메인 단위 기능 모듈 (UI+상태+서비스 캡슐화)
  font/             # 커스텀 폰트 설정
  hooks/            # 전역 커스텀 훅 (도메인 비의존)
  providers/        # 전역 Provider (Query/Theme/Auth 등)
  queries/          # Supabase + React Query 데이터 로직 (유지)
  store/            # Zustand 전역 상태
  types/            # 전역 타입/스키마 정의
  utils/            # 공통 유틸 함수
  test/             # Jest/RTL 테스트
```

---

## 1️⃣ app/ — 페이지 및 라우팅

- Next.js 16의 **App Router** 기반

```
app/
  layout.tsx
  page.tsx
  dashboard/
    layout.tsx
    page.tsx
```

---

## 2️⃣ components/ — 재사용 UI 컴포넌트

- 프레젠테이션 중심 컴포넌트.
- `three/`는 R3F 씬/오브젝트/컨트롤 모음.

```
components/
  three/
    scene.tsx
    camera-controls.tsx
    grid-object.tsx
```

---

## 3️⃣ features/ — 도메인 단위 기능

- UI, 상태(Zustand), 서비스 로직을 **기능 단위로 캡슐화**.
- 외부 소비는 `features/<feature>/index.ts`로 제한해 의존성 경계를 명확히

```
features/
  auth/
    components/
      login-form.tsx
      signup-form.tsx
    hooks/
      use-auth-guard.ts
    services/
      session.ts         # 도메인 서비스(queries를 내부에서 사용 가능)
    store.ts             # auth 관련 Zustand
    index.ts
  grid/
    components/
      grid-canvas.tsx
      grid-item.tsx
    hooks/
      use-grid.ts
    services/
      grid.ts
    store.ts
    index.ts
```

**권장 규칙**

- **도메인 내부에서만** `queries/` 접근(서비스 계층을 통해).
- 컴포넌트는 내부 훅/스토어만 의존.

---

## 4️⃣font/ — 폰트 설정

---

## 5️⃣ hooks/ — 전역 커스텀 훅

- 도메인 무관 공용 훅. 브라우저/디바이스/테마/키보드 등.

```
hooks/
  use-theme.ts
  use-viewport.ts
  use-keyboard.ts
  use-supabase.ts       # Supabase 클라이언트/세션 헬퍼
```

## 6️⃣ providers/ — 전역 Provider

```
providers/
  query-provider.tsx     # React Query 설정(Devtools 옵션 포함)
  theme-provider.tsx
  supabase-provider.tsx  # 세션/쿠키 연동
```

---

## 7️⃣ queries/ — Supabase + React Query (유지)

- 백엔드 쿼리/뮤테이션, 캐시 키, 옵저버/구독 등.

```
queries/
  auth/
    getSession.ts
    signIn.ts
  user/
    useUserQuery.ts
  grid/
    useGridList.ts
    upsertGrid.ts
  client.ts            # Supabase 인스턴스
  keys.ts              # React Query 키 팩토리
```

---

## 8️⃣ store/ — Zustand 전역 상태

```
store/
  use-ui-store.ts
  use-scene-store.ts
  use-auth-store.ts
```

---

## 9️⃣ types/ — 전역 타입/스키마

Zod와 TypeScript 타입을 함께 관리합니다.

```
types/
  auth.ts        # AuthUser, Session 등
  user.ts        # Profile, Role 등
  grid.ts        # GridItem, SceneConfig 등
  common.ts      # 공통 유틸 타입
  zod/
    auth.ts      # zod 스키마
    grid.ts
```

---

## 🔟 utils/ — 공통 유틸

```
utils/
  cn.ts
  formatDate.ts
  debounce.ts
```

---

## 1️⃣1️⃣ test/ — 테스트

Jest + Testing Library 기반. 폴더 미러링을 권장합니다.

```
test/
  components/
    three/
      scene.test.tsx
  features/
    auth/
      login-form.test.tsx
    grid/
      grid.service.test.ts
  hooks/
    use-viewport.test.ts
  utils/
    formatDate.test.ts
```
