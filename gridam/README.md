# 개발 규칙

# 1️⃣ Git 형상관리 (GitHub Flow 변형)

> **GitHub Projects**와 **Issues**를 중심으로 스프린트를 관리합니다.

- **Issue**: 하나의 작업 단위(Task)를 의미합니다.

- **Project**: 스프린트를 관리하는 보드(kanban 형식)입니다.

- **Milestone**: 스프린트 단위를 묶는 기간입니다.

- **Branch & Commit**: 각 이슈 기반으로 코드 작업을 진행합니다.

## 스프린트 운영 방식

1. **스프린트 시작 전**
   - `Milestone`으로 이번 스프린트를 생성
   - 해당 기간에 포함될 이슈를 모두 `Milestone`에 연결
   - `Project Board`의 `To Do` 컬럼에 배치
2. **진행 중**
   - 담당자는 자신의 이슈를 `In Progress`로 이동
   - 이슈 내에서 커밋, PR, 토론 등 진행
3. **완료 시**
   - PR이 merge되면 `Done`으로 이동
   - 이슈를 닫기(close)

## **이슈(Issue) 생성 규칙**

### 제목 규칙

```markdown
[기능/버그/문서] 간단한 설명

- `[기능] 로그인 API 구현`
- `[버그] 비밀번호 재설정 오류 수정`
```

### 내용 템플릿

```markdown
### 💡 목적

이 이슈의 목표를 간단히 설명합니다.

### ✅ 작업 내용

- [ ] 세부 작업 1
- [ ] 세부 작업 2

### 🧑 담당자

@담당자명

### 🕒 예상 일정

YYYY-MM-DD ~ YYYY-MM-DD
```

````

## 브랜치 전략

- `main`: 항상 **배포 가능한 상태**. 보호 브랜치로 설정.
- `dev`: 개발 브랜치 (feature 브랜치 분기 기준)
- `feature/*`: 기능 단위 작업 브랜치 (예: `feature/login`, `feature/user-card`)
- `hotfix/*`: 긴급 수정 브랜치

### 작업 흐름

1. 이슈 생성 → 작업 범위/수행 기준(AC) 명시
    1. 깃허브 프로젝트 이슈관리
    2. 깃허브 기업
2. 해당 이슈에서 `feature/*` 브랜치 생성 후 커밋 진행
3. PR 생성(→ `dev`)
4. 자동 검사(CI) 통과 + **리뷰어 1+ 승인** 후 머지

## 작업 브랜치 생성 규칙

해당 이슈에서 `feature/*` 브랜치 생성 후 작업 진행

```markdown
feature/<scope>-<short-desc>
````

- 매일 오후 4시에 원격으로 `push`를 진행합니다.
- 원격에 올린 작업 내용을 `dev` 브랜치에 `merge` 요청(Pull Requset)을 보내며, 요청 규칙은 아래와 같습니다.

## 커밋 규칙

```markdown
## 기본 형식

type(scope): message #이슈번호

## 커밋 메시지 작성 형식

type(scope): message (영문/한글 자유, 명령형 현재형) #23 - 요약형

## 커밋 메시지 작성 예시

브랜치명이 feature/me-post로 마이페이지 게시글 관련 내용 작업인 경우

- feat(me): 게시글 조회 API dusehd #23
- style(me): 게시글 조회 전용 카드 컴포넌트 생성 #23
```

`type`의 종류는 다음과 같습니다. ([참고 링크](https://overcome-the-limits.tistory.com/entry/%ED%98%91%EC%97%85-%ED%98%91%EC%97%85%EC%9D%84-%EC%9C%84%ED%95%9C-%EA%B8%B0%EB%B3%B8%EC%A0%81%EC%9D%B8-git-%EC%BB%A4%EB%B0%8B%EC%BB%A8%EB%B2%A4%EC%85%98-%EC%84%A4%EC%A0%95%ED%95%98%EA%B8%B0))

- `feat` : 새로운 기능을 추가할 경우
- `fix` : 버그를 고친 경우
- `refactor` : 프로덕션 코드의 리팩토링
- `docs` : 문서를 수정한 경우
- `chore` : 빌드 테스트 업데이트 혹은 패키지 매니저를 설정하는 경우(프로덕션 코드 변경 X)
- `test` : 테스트 추가, 테스트 리팩토링(프로덕션 코드 변경 X)
- `perf` : 성능과 관련한 코드 변경 사항이 있는 경우
- `style` : 코드 포맷 변경, 세미 콜록 누락 등 코드 수정(로직 변경)이 없는 경우

---

# 2️⃣ 파일/폴더 네이밍

- **파일명은 `소문자-소문자`(kebab-case)** 를 기본으로 합니다.
  - 예: `user-card.tsx`, `auth-service.ts`, `use-fetch.ts`
- **컴포넌트 파일 내부의 컴포넌트명은 PascalCase**
  - 예: `function UserCard() { ... }`
- **훅(Hook)**: `use-무엇.ts` (파일명), `use무엇` (함수명)
- **테스트 파일**: `.test.ts` 또는 `.test.tsx`
- **스타일 파일**: CSS Modules 사용 시 `.module.css` (또는 `.module.scss`)
- **폴더명** 역시 kebab-case를 기본으로 합니다.

> 예외: 환경설정/최상위 파일(README.md, .eslintrc.cjs, tsconfig.json 등)은 관례 유지

---

# 3️⃣ 코딩 컨벤션 (TypeScript + React)

### 기본 원칙

- **TypeScript를 우선 적용**: `any` 금지(불가피할 때 최소화하고 `TODO` 남김)
- **함수형 컴포넌트 + 훅** 우선, 클래스 컴포넌트 사용 금지
- **불변성** 유지, 상태 최소화, 단방향 데이터 흐름
- **사이드이펙트는 훅 내부로** (`useEffect`, 커스텀 훅)

### 코드 스타일 - Prettier 세팅 필요

- 최대 줄 길이 100~120자 (팀 합의값: **120자**)
- 들여쓰기 2 스페이스, 세미콜론 사용, 작은따옴표 `'`
- import 정렬: 외부 → 절대경로(`@/*`) → 상대경로
- **조기 반환(early return)**
- **명시적 반환 타입** (특히 공개 API/훅)

### React 규칙

- 컴포넌트 파일당 **기능 1개 원칙** (큰 컴포넌트는 분리)
- Props는 **명시적 타입** + `memo`/`useMemo`/`useCallback`은 필요 시에만
- DOM 접근은 `ref` 우선, 직접 조작 최소화
- 접근성(a11y) 준수: `alt`, `aria-*` 속성, 키보드 포커스 고려

### 상태 관리

- 범용: React Query/훅 중심 (라이브러리는 킥오프 시 확정)
- 전역 상태가 필요할 때만 상태관리 라이브러리 도입

### 예시 스니펫

```tsx
// 명시적 타입 + type-only import
import type { User } from '@/types/user'

type Props = { user: User }

export function UserCard({ user }: Props) {
  return <div>{user.name}</div>
}
```

---

# 4️⃣ `index.ts`로 경로 단축 (Barrel) & Path Alias - 컴포넌트에만

### Barrel 사용 원칙

- 각 폴더에 `index.ts`(또는 `index.tsx`)를 두고 **외부에 노출할 항목만** re-export
- 내부 구현 세부는 **폴더 내부에서만 import**

```tsx
// src/components/user/index.ts
export { UserCard } from './user-card'
export type { UserCardProps } from './user-card'
```

```tsx
// 사용처
import { UserCard } from '@/components/user'
```

### `tsconfig` 경로 별칭 예시

```json
{
  "compilerOptions": {
    "baseUrl": "src",
    "paths": {
      "@/*": ["*"]
    },
    "strict": true,
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "verbatimModuleSyntax": true,
    "isolatedModules": true
  }
}
```

> 번들러(Vite/Next 등) 설정에서도 @ 별칭을 동일하게 매핑합니다.

---

# 5️⃣ 타입 import 시 **type 확인** 필수

- **type-only import**를 기본으로 사용합니다.
  - 예: `import type { User } from '@/types'`
- TS 설정 권장: `"verbatimModuleSyntax": true` (또는 `preserveValueImports`)
- ESLint 규칙으로 강제

```jsx
// .eslintrc.cjs (발췌)
module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'import', 'react-hooks'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier',
  ],
  rules: {
    '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
    'import/order': ['error', { 'newlines-between': 'always', alphabetize: { order: 'asc' } }],
    'react-refresh/only-export-components': 'off',
  },
}
```

---

# 6️⃣ Lint/Format/CI

- **Prettier**로 포맷 일관화, **ESLint**로 규칙 강제
- **Husky + lint-staged**: 커밋 전 `eslint --fix`, `prettier --write`, 단위테스트
- CI(예: GitHub Actions): `install → lint → type-check → test → build` 파이프라인 필수 통과

```bash
# 예: package.json (발췌)
{
  "scripts": {
    "lint": "eslint . --ext .ts,.tsx",
    "format": "prettier --write .",
    "type-check": "tsc --noEmit",
    "test": "vitest"
  }
}
```

# 7️⃣ 폴더 구조

```
# 📁 Gridam 폴더 구조 명세서

## ⭐ 전체 구조

```

src/
app/ # Next.js App Router 페이지/레이아웃
components/
ui/ # only UI 컴포넌트
three/ # Three.js / R3F 관련 컴포넌트
features/ # 도메인 단위 기능 모듈 (UI+상태+서비스 캡슐화)
font/ # 커스텀 폰트 설정
hooks/ # 전역 커스텀 훅 (도메인 비의존)
providers/ # 전역 Provider (Query/Theme/Auth 등)
queries/ # Supabase + React Query 데이터 로직 (유지)
store/ # Zustand 전역 상태
types/ # 전역 타입/스키마 정의
utils/ # 공통 유틸 함수
test/ # Jest/RTL 테스트

```

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
session.ts # 도메인 서비스(queries를 내부에서 사용 가능)
store.ts # auth 관련 Zustand
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

## 4️⃣font/ — 폰트 설정

## 5️⃣ hooks/ — 전역 커스텀 훅

- 도메인 무관 공용 훅. 브라우저/디바이스/테마/키보드 등.

```

hooks/
use-theme.ts
use-viewport.ts
use-keyboard.ts
use-supabase.ts # Supabase 클라이언트/세션 헬퍼

```

## 6️⃣ providers/ — 전역 Provider

```

providers/
query-provider.tsx # React Query 설정(Devtools 옵션 포함)
theme-provider.tsx
supabase-provider.tsx # 세션/쿠키 연동

```

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
client.ts # Supabase 인스턴스
keys.ts # React Query 키 팩토리

```

## 8️⃣ store/ — Zustand 전역 상태

```

store/
use-ui-store.ts
use-scene-store.ts
use-auth-store.ts

```

## 9️⃣ types/ — 전역 타입/스키마

Zod와 TypeScript 타입을 함께 관리합니다.

```

types/
auth.ts # AuthUser, Session 등
user.ts # Profile, Role 등
grid.ts # GridItem, SceneConfig 등
common.ts # 공통 유틸 타입
zod/
auth.ts # zod 스키마
grid.ts

```

## 🔟 utils/ — 공통 유틸

```

utils/
cn.ts
formatDate.ts
debounce.ts

```

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

```

---

# 8️⃣ 코드 리뷰 가이드

- PR 설명 충실, 변경 범위 작게(가능하면 300줄 이하)
- 리뷰어는 **의도/설계/테스트 케이스**를 중심으로 피드백
- 승인 조건: CI 통과 + 최소 1인 승인 + 주요 피드백 반영
