import { Order, Coordinate } from "@/types";
import { getHaversineDistance } from "@/lib/engine/calculator";

/**
 * 합짐 가능 여부를 판단하는 하드 제약 조건 (Hard Constraints) 검증
 */
export const BUNDLING_CONSTRAINTS = {
  MAX_WEIGHT: 1100, // 최대 적재 중량 (kg)
  MAX_VOLUME: 1.0, // 최대 적재 부피 (비율, 1.0 = 100%)
  MAX_DISTANCE_RATIO: 1.3, // 직선 거리 대비 합짐 경로 거리 증가율 제한
};

/**
 * 1톤 차량 적재량 제약 조건 확인
 */
export function checkLoadCapacity(orders: Order[]): boolean {
  const totalWeight = orders.reduce((sum, o) => sum + o.cargo.weight, 0);
  const totalVolume = orders.reduce((sum, o) => sum + o.cargo.volume, 0);

  return (
    totalWeight <= BUNDLING_CONSTRAINTS.MAX_WEIGHT &&
    totalVolume <= BUNDLING_CONSTRAINTS.MAX_VOLUME
  );
}

/**
 * 시간 윈도우 및 방문 순서 제약 조건 확인
 */
export function checkTimeConstraints(orders: Order[]): boolean {
  return orders.every((o) => {
    const pickup = new Date(o.timeWindow.pickupAt);
    const deadline = new Date(o.timeWindow.deadlineAt);
    return pickup < deadline;
  });
}

/**
 * ALGORITHM_SPEC.md의 스코어링 함수(Score) 구현
 * Score = w1(ΔDistance) + w2(ΔTime) + w3(1 - Load Factor)
 */
export function calculateBundlingScore(
  individualDistances: number,
  bundledDistance: number,
  loadFactor: number,
): number {
  const w1 = 0.5; // 거리 가중치
  const w2 = 0.3; // 시간 가중치 (거리와 비례한다고 가정)
  const w3 = 0.2; // 적재율 가중치

  const deltaDistance = bundledDistance / individualDistances; // 거리 증가비율
  const deltaTime = deltaDistance; // 단순화: 시간 증가비율은 거리와 동일하다고 가정
  const emptyFactor = 1 - loadFactor; // 미적재율

  return w1 * deltaDistance + w2 * deltaTime + w3 * emptyFactor;
}

/**
 * 기초 합짐 엔진 (Cluster-First, Route-Second 프로토타입)
 * 100개 오더 중 인접한 오더들을 찾아 합짐 그룹을 생성합니다.
 */
export function runBasicBundling(orders: Order[]): Order[][] {
  const bundles: Order[][] = [];
  const usedIds = new Set<string>();

  // 그리디 기반 클러스터링 (단순 거리 기준)
  for (let i = 0; i < orders.length; i++) {
    if (usedIds.has(orders[i].id)) continue;

    const currentBundle: Order[] = [orders[i]];
    usedIds.add(orders[i].id);

    for (let j = i + 1; j < orders.length; j++) {
      if (usedIds.has(orders[j].id)) continue;

      // 상차지 간 거리가 5km 이내인 경우 합짐 후보로 고려
      const dist = getHaversineDistance(orders[i].pickup, orders[j].pickup);
      if (dist < 5000) {
        const potentialBundle = [...currentBundle, orders[j]];
        
        // 하드 제약 조건 검증 (적재량)
        if (checkLoadCapacity(potentialBundle)) {
          currentBundle.push(orders[j]);
          usedIds.add(orders[j].id);
        }
      }

      if (currentBundle.length >= 3) break; // 최대 3개까지 합짐
    }
    bundles.push(currentBundle);
  }

  return bundles;
}
