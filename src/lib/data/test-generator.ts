import { generateMockOrders } from "./mock-generator";

/**
 * 생성된 Mock 데이터의 유효성을 검증하는 간단한 테스트 스크립트
 */
export function validateMockData(): boolean {
  const orders = generateMockOrders(100);

  // 1. 수량 확인
  if (orders.length !== 100) {
    return false;
  }

  // 2. 좌표 범위 확인
  const isWithinBounds = orders.every(
    (o) =>
      o.pickup.lat >= 37.42 &&
      o.pickup.lat <= 37.7 &&
      o.pickup.lng >= 126.75 &&
      o.pickup.lng <= 127.2,
  );
  if (!isWithinBounds) {
    return false;
  }

  // 3. 화물 속성 확인
  const hasValidCargo = orders.every(
    (o) =>
      o.cargo.volume >= 0.2 &&
      o.cargo.volume <= 0.7 &&
      o.cargo.weight >= 100 &&
      o.cargo.weight <= 800,
  );
  if (!hasValidCargo) {
    return false;
  }

  return true;
}

// 스크립트 직접 실행 시 (node 환경)
if (require.main === module) {
  validateMockData();
}
