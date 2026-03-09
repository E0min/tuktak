# 기술 설계 문서 (TDD_MVP_SIMULATOR.md)

## 1. 시스템 아키텍처 (System Architecture)
본 프로젝트는 **Next.js 15 (App Router)** 기반의 단일 페이지 애플리케이션(SPA)으로 구축됩니다.

### Layered Architecture
- **UI Layer (`src/components`):** Naver Maps SDK 연동 및 Framer Motion 기반 애니메이션 처리.
- **Service Layer (`src/hooks`):** 시뮬레이션 상태(State) 관리 및 오케스트레이션.
- **Domain Layer (`src/lib/engine`):** 순수 함수형 알고리즘 로직 및 지표 연산 엔진.
- **Data Layer (`src/lib/data`):** Mock 데이터 생성기 및 API 연동.

## 2. 데이터 흐름 (Data Flow)
1. **Source:** `generateMockOrders(100)` 실행 -> `Order[]` 생성.
2. **Process 1:** `runIndividualSimulation` -> 건별 배송 주행 데이터 확보 (Naver Direction API 활용).
3. **Process 2:** `runBundlingAlgorithm` -> `ALGORITHM_SPEC`에 따른 클러스터링 및 루트 생성.
4. **Process 3:** `calculateMetrics` -> Before/After 비교 수치 산출.
5. **View:** React State 업데이트를 통한 지도 및 통계 위젯 리렌더링.

## 3. 핵심 기술 세부 설계

### 3.1 Naver Maps API 활용 전략
- **Async Loading:** `next/script`를 사용하여 지도를 초기 부하 없이 비동기 로드.
- **Custom Overlays:** 마커 커스텀 및 Polyline 애니메이션을 통한 시각적 프리미엄 구현.

### 3.2 알고리즘 구현 전략 (Route-Second)
- 클러스터 내 오더 방문 순서는 **Greedy 탐색**을 기본으로 하며, 1톤 용량(부피, 무게) 초과 시 분기를 생성함.

## 4. 데이터베이스 및 상태 구조 (State Schema)
```typescript
interface GlobalState {
  orders: Order[];             // 100개의 가상 콜
  individualResults: Route[];  // 기존 단독 배송 결과
  bundledResults: Route[];     // 최적화된 합짐 결과
  metrics: KPIMetrics;         // 비교 통계 데이터
  status: 'IDLE' | 'LOADING' | 'SIMULATING' | 'DONE';
}
```

## 5. 고려 사항 (Trade-offs)
- **속도 vs 정밀도:** Naver Direction API를 100건 모두 실시간 호출할 경우 API 쿼터 및 속도 문제가 발생할 수 있음.
- **해결책:** 주요 거점 간 거리는 미리 캐싱하거나, 초기 MVP에서는 직선 거리 기반으로 연산 후 보정 상수를 적용하는 방식 채택 고려 (이후 정교화).
