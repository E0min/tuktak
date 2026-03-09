import { generateMockOrders } from "./mock-generator";

/**
 * 생성된 Mock 데이터의 유효성을 검증하는 간단한 테스트 스크립트
 */
export function validateMockData() {
  console.log("=== Mock Data Validation Start ===");
  const orders = generateMockOrders(100);

  // 1. 수량 확인
  if (orders.length !== 100) {
    console.error(`❌ 수량 불일치: ${orders.length}개 생성됨`);
  } else {
    console.log("✅ 100개 데이터 생성 확인");
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
    console.error("❌ 좌표 범위 이탈 발견");
  } else {
    console.log("✅ 모든 좌표가 서울 범위 내에 존재");
  }

  // 3. 화물 속성 확인
  const hasValidCargo = orders.every(
    (o) => o.cargo.volume >= 0.2 && o.cargo.volume <= 0.7 && o.cargo.weight >= 100 && o.cargo.weight <= 800,
  );
  if (!hasValidCargo) {
    console.error("❌ 화물 부피/무게 제약 조건 위반 발견");
  } else {
    console.log("✅ 모든 화물이 부피(0.2~0.7) 및 무게(100~800kg) 범위를 준수함");
  }

  console.log("=== Mock Data Validation End ===");
}

// 스크립트 직접 실행 시 (node 환경)
if (require.main === module) {
  validateMockData();
}
