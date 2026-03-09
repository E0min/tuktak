import { Coordinate, CargoCategory, Order, Cargo, TimeWindow } from "../../types";

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
