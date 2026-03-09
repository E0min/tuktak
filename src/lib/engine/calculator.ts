import { Coordinate } from "@/types";

/**
 * 하버사인(Haversine) 공식을 이용한 두 지점 간의 직선 거리 계산 (단위: meters)
 */
export function getHaversineDistance(coord1: Coordinate, coord2: Coordinate): number {
  const R = 6371e3; // 지구 반지름 (meters)
  const dLat = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const dLng = ((coord2.lng - coord1.lng) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coord1.lat * Math.PI) / 180) *
      Math.cos((coord2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * PRICING_MODEL.md 기반의 기본 배송 요금 산정 (Before)
 * @param distanceInMeters 주행 거리 (meters)
 * @returns 산정된 운임 (KRW)
 */
export function calculateBasePrice(distanceInMeters: number): number {
  const BASE_FEE = 35000; // 기본료 (35,000원)
  const DISTANCE_RATE = 1500; // km당 요금 (1,500원)

  const distanceInKm = distanceInMeters / 1000;
  const price = BASE_FEE + distanceInKm * DISTANCE_RATE;

  // 100원 단위 절사
  return Math.floor(price / 100) * 100;
}
