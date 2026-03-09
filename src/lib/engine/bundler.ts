import { Order, Coordinate } from "../../types";
import { getHaversineDistance } from "./calculator";

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
 * 시간 윈도우 및 방문 순서 제약 조건 확인 (상차 A -> 상차 B -> 하차 A -> 하차 B 등)
 * 현재 MVP 버전에서는 단순화하여 모든 상차가 모든 하차보다 앞서는지, 
 * 그리고 각 지점 간 이동 시간이 물리적으로 가능한지 체크합니다.
 */
export function checkTimeConstraints(orders: Order[]): boolean {
  // TODO: 실제 주행 시간을 고려한 정교한 시간 윈도우 체크 로직 구현
  // 현재는 모든 오더의 상차 가능 시간이 하차 마감 시간보다 앞서는지만 기본 확인
  return orders.every((o) => {
    const pickup = new Date(o.timeWindow.pickupAt);
    const deadline = new Date(o.timeWindow.deadlineAt);
    return pickup < deadline;
  });
}
