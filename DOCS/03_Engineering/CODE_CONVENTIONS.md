# 코드 작성 규칙 (CODE_CONVENTIONS.md)

이 문서는 프로젝트의 코드 품질과 일관성을 유지하기 위한 작성 규칙을 정의합니다.

## 1. 기본 원칙
- **TypeScript 사용:** 모든 파일은 TypeScript(`ts`, `tsx`)로 작성하며, 인터페이스와 타입을 통해 데이터 구조를 명확히 정의합니다.
- **`any` 사용 엄격 금지:** `any` 타입 사용을 금지합니다. 타입을 확신할 수 없는 외부 데이터의 경우 `unknown`을 사용하고, 반드시 **타입 가드(Type Guards)**를 통해 타입을 좁혀서 사용합니다.
- **함수형 컴포넌트:** 모든 React 컴포넌트는 함수형으로 작성하며, `export default function Name() {}` 형태를 사용합니다.
- **Client/Server 컴포넌트:** 브라우저 API나 상태(State)가 필요한 경우 파일 최상단에 `'use client';` 지시어를 명시하며, 이외에는 서버 컴포넌트로 유지합니다.

... (중략) ...

## 9. 타입 안전성 고도화 (Type Safety)
- **사용자 정의 타입 가드:** `arg is Type` 형식을 사용하여 런타임 데이터 검증 로직을 추상화합니다.
- **타입 단언(Type Assertion) 지양:** `as` 키워드 사용보다는 타입 가드나 타입 추론을 우선적으로 활용합니다.
- **엄격한 Null 체크:** `Optional Chaining(?.)`과 `Nullish Coalescing(??)`을 적극 활용하여 런타임 에러를 방지합니다.


## 2. 네이밍 규칙
- **컴포넌트:** `kebab-case` (예: `freight-map.tsx`)
- **변수 및 함수:** `camelCase` (예: `calculateDistance`)

- **상수:** `UPPER_SNAKE_CASE` (예: `SEOUL_CENTER_LAT`)

## 3. 임포트 규칙 (Import Conventions)
- **Path Alias:** 모든 임포트는 `@/`로 시작하는 절대 경로 별칭을 사용합니다. (`src/` 디렉토리 기준)
- **예시:** `import { Order } from "@/types"` (O), `import { Order } from "../../types"` (X)

## 4. 컴포넌트 패턴 (Component Patterns)
- **Props 타입 정의:** 모든 컴포넌트의 Props는 `interface`로 정의하며, 컴포넌트 파일 내 상단에 배치합니다.
- **구조 분해 할당:** Props는 매개변수 단계에서 구조 분해 할당하여 사용합니다.
- **컴포지션 패턴:** 복잡한 UI는 데이터 성격에 따라 작은 단위의 컴포넌트로 쪼개어 조합합니다.

## 4. 상태 관리 및 훅 (State & Hooks)
- **로컬 상태:** `useState`, `useReducer`를 사용하며, 관련 로직이 길어질 경우 커스텀 훅(`src/hooks/`)으로 분리합니다.
- **메모이제이션:** 불필요한 재렌더링 방지를 위해 `useMemo`, `useCallback`을 적절히 사용합니다 (특히 계산량이 많은 알고리즘 결과물 처리 시).

## 5. 성능 최적화 (Performance Optimization)
Vercel의 React 및 Next.js 베스트 프랙티스를 따라 최상의 사용자 경험을 제공합니다:
- **Waterfall 제거:** 독립적인 데이터 페칭은 `Promise.all()`을 사용하여 병렬화합니다.
- **번들 최적화:** 무거운 컴포넌트나 라이브러리는 `next/dynamic`을 사용해 지연 로딩(Lazy Loading)합니다.
- **서버 성능:** 불필요한 직렬화를 피하고, 서버 액션 시 적절한 캐싱 정책(`React.cache`)을 적용합니다.
- **불필요한 리렌더링 방지:** 무거운 연산은 `useMemo`로, 콜백 함수는 `useCallback`으로 최적화합니다.

## 6. 디버깅 및 로그 (Debugging & Logging)
- **콘솔 로그 제한:** 프로덕션 코드에 `console.log`, `console.warn`, `console.error`가 남지 않도록 합니다. 디버깅 후에는 반드시 제거해야 합니다.

## 7. 코드 품질 및 자동화 (Code Quality & Automation)
- **Prettier:** 일관된 코드 포맷팅을 위해 Prettier를 사용합니다.
- **ESLint:** 정적 분석을 통해 코드 오류와 잠재적 버그를 사전에 방지합니다.
- **Husky & lint-staged:** 커밋 직전에 자동으로 Linting과 Formatting을 수행하여 품질이 검증된 코드만 저장소에 반영합니다.

## 8. 주석 (CRITICAL)
- **언어:** 코드 내 모든 주석은 **한국어**로 작성합니다.
- **형식:** 함수나 복잡한 로직 위에는 JSDoc 스타일(`/** ... */`)의 설명을 추가하여 목적과 매개변수, 반환값을 명시합니다.
- **설명:** "무엇을(What)" 하는지뿐만 아니라 **"왜(Why)"** 그렇게 작성했는지 의도를 포함합니다.

