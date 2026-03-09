---
description: 고성능 Next.js 15 개발을 위한 Vercel 베스트 프랙티스 적용 워크플로우
---

// turbo-all
이 워크플로우는 모든 프론트엔드 코드(컴포넌트, 페이지, 서버 액션 등) 작성 시 성능 최적화를 보장하기 위해 반드시 수행해야 하는 가이드라인 적용 절차입니다.

1. **지침 로드:** **`vercel-react-best-practices`** 스킬의 모든 규칙을 현재 작업 컨텍스트에 로드합니다.
2. **코드 설계 반영 (CRITICAL):**
   - **Eliminating Waterfalls:** 데이터 페칭이 필요한 경우 `Promise.all()`을 사용하여 병렬 처리가 가능한지 검토합니다.
   - **Bundle Optimization:** `next/dynamic`을 사용하여 무거운 라이브러리나 컴포넌트의 지연 로딩(Lazy Loading)을 설계에 반영합니다.
   - **Server Performance:** 서버 컴포넌트와 클라이언트 컴포넌트의 경계를 최적화하고, 불필요한 직렬화(Serialization)를 배제합니다.
3. **구현 세부 검증:**
   - **Re-render Optimization:** `useMemo`, `useCallback`을 사용하여 불필요한 리렌더링을 차단합니다.
   - **Rendering Performance:** SVG 애니메이션, 조건부 렌더링 패턴(`&&` 대신 삼항 연산자 사용 등)이 최적화되었는지 확인합니다.
4. **결과 확인:** 작성된 코드가 위 지침들을 모두 충족하는지 자가 진단하고, 미흡한 점이 있다면 즉시 수정합니다.
