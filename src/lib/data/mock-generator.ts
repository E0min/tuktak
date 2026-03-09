import { Coordinate, CargoCategory, Order, Cargo, TimeWindow } from "../../types";
import { getHaversineDistance, calculateBasePrice } from "../engine/calculator";

/**
 * 서울 지역 위경도 범위 (MOCK_DATA_SPEC.md 준수)
 */
export const SEOUL_BOUNDS = {
  LAT_MIN: 37.42,
  LAT_MAX: 37.7,
  LNG_MIN: 126.75,
  LNG_MAX: 127.2,
};

/**
 * 서울 지역 내 랜덤 좌표 생성
 */
export function getRandomCoordinate(): Coordinate {
  const lat = Math.random() * (SEOUL_BOUNDS.LAT_MAX - SEOUL_BOUNDS.LAT_MIN) + SEOUL_BOUNDS.LAT_MIN;
  const lng = Math.random() * (SEOUL_BOUNDS.LNG_MAX - SEOUL_BOUNDS.LNG_MIN) + SEOUL_BOUNDS.LNG_MIN;
  return { lat, lng };
}

/**
 * 랜덤 화물 정보 생성
 */
function getRandomCargo(): Cargo {
  const categories: CargoCategory[] = [
    "Appliance",
    "Furniture",
    "StoreFixture",
    "SmallOffice",
    "General",
  ];
  const category = categories[Math.floor(Math.random() * categories.length)];

  // 부피 점유율 (0.2 ~ 0.7)
  const volume = parseFloat((Math.random() * 0.5 + 0.2).toFixed(2));
  // 중량 (100kg ~ 800kg)
  const weight = Math.floor(Math.random() * 700 + 100);

  return { category, volume, weight };
}

/**
 * 랜덤 시간 윈도우 생성 (당일 기준)
 */
function getRandomTimeWindow(): TimeWindow {
  const startHour = Math.floor(Math.random() * 10 + 8); // 08:00 ~ 18:00
  const duration = Math.floor(Math.random() * 4 + 2); // 2 ~ 6시간 후 하차

  const pickupAt = new Date();
  pickupAt.setHours(startHour, 0, 0, 0);

  const deadlineAt = new Date(pickupAt);
  deadlineAt.setHours(startHour + duration);

  return {
    pickupAt: pickupAt.toISOString(),
    deadlineAt: deadlineAt.toISOString(),
  };
}

/**
 * 100개 랜덤 배차 콜 생성 엔진 (2.2.2)
 */
export function generateMockOrders(count: number = 100): Order[] {
  return Array.from({ length: count }, (_, i) => {
    const pickup = getRandomCoordinate();
    const dropoff = getRandomCoordinate();

    // 직선 거리를 기반으로 기초 운임 산정
    const distance = getHaversineDistance(pickup, dropoff);
    const basePrice = calculateBasePrice(distance);

    return {
      id: `ORDER-${(i + 1).toString().padStart(3, "0")}`,
      pickup,
      dropoff,
      cargo: getRandomCargo(),
      timeWindow: getRandomTimeWindow(),
      basePrice,
    };
  });
}
