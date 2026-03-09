# 코드 작성 규칙 (CODE_CONVENTIONS.md)

이 문서는 프로젝트의 코드 품질과 일관성을 유지하기 위한 작성 규칙을 정의합니다.

## 1. 기본 원칙
- **TypeScript 사용:** 모든 파일은 TypeScript(`ts`, `tsx`)로 작성하며, 인터페이스와 타입을 통해 데이터 구조를 명확히 정의합니다. `any` 타입 사용을 금지합니다.
- **함수형 컴포넌트:** 모든 React 컴포넌트는 함수형으로 작성하며, `export default function Name() {}` 형태를 사용합니다.
- **Client/Server 컴포넌트:** 브라우저 API나 상태(State)가 필요한 경우 파일 최상단에 `'use client';` 지시어를 명시하며, 이외에는 서버 컴포넌트로 유지합니다.

## 2. 네이밍 규칙
- **컴포넌트:** `PascalCase` (예: `FreightMap.tsx`)
- **변수 및 함수:** `camelCase` (예: `calculateDistance`)
- **상수:** `UPPER_SNAKE_CASE` (예: `SEOUL_CENTER_LAT`)

## 3. 주석 (CRITICAL)
- **언어:** 코드 내 모든 주석은 **한국어**로 작성합니다.
- **형식:** 함수나 복잡한 로직 위에는 JSDoc 스타일(`/** ... */`)의 설명을 추가하여 목적과 매개변수, 반환값을 명시합니다.
