/**
 * TukTak Simulator 핵심 도메인 타입 정의
 */

/**
 * 위경도 좌표
 */
export interface Coordinate {
  lat: number;
  lng: number;
}

/**
 * 화물 카테고리
 */
export type CargoCategory = "Appliance" | "Furniture" | "StoreFixture" | "SmallOffice" | "General";

/**
 * 화물 정보
 */
export interface Cargo {
  category: CargoCategory;
  volume: number; // 적재 부피 점유율 (0.2 ~ 0.7)
  weight: number; // 중량 (kg)
}

/**
 * 시간 윈도우
 */
export interface TimeWindow {
  pickupAt: string; // ISO 8601 string
  deadlineAt: string; // ISO 8601 string
}

/**
 * 배차 주문 (Order)
 */
export interface Order {
  id: string;
  pickup: Coordinate;
  dropoff: Coordinate;
  pickupAddress?: string; // 상차지 상세 주소
  dropoffAddress?: string; // 하차지 상세 주소
  cargo: Cargo;
  timeWindow: TimeWindow;
  basePrice: number; // 단독 배송 시 기본 운임
  actualDistance?: number; // 네이버 API 실제 주행 거리 (meters)
  actualDuration?: number; // 네이버 API 실제 소요 시간 (seconds)
}

/**
 * 최적 방문 순서 포인트
 */
export interface SequencePoint {
  id: string;
  type: "Pickup" | "Dropoff";
  coordinate: Coordinate;
}

/**
 * 배송 루트 (Route)
 */
export interface Route {
  id: string;
  orders: Order[];
  totalDistance: number; // 총 주행 거리 (meters)
  totalTime: number; // 총 소요 시간 (seconds)
  pathPoints: Coordinate[]; // 지도 렌더링을 위한 경로 좌표 배열
  type: "Individual" | "Bundled";
  optimalSequence?: SequencePoint[]; // 최적 방문 순서
}

/**
 * 시뮬레이션 비교 지표 (KPI Metrics)
 */
export interface KPIMetrics {
  totalDistance: {
    before: number;
    after: number;
    reductionRate: number;
  };
  totalTime: {
    before: number;
    after: number;
    reductionRate: number;
  };
  driverProfit: {
    before: number;
    after: number;
    increaseRate: number;
  };
  vehicleCount: {
    before: number;
    after: number;
  };
}
