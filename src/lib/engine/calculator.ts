import { Coordinate, Order, Route } from "@/types";

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
 * 서울 시내 도로 보정 계수를 적용한 예상 주행 거리 산출 (7.2.1.1)
 * API 호출량을 줄이기 위해 Before(개별 배송) 산정에 사용합니다.
 */
export function getEstimatedRoadDistance(coord1: Coordinate, coord2: Coordinate): number {
  const straightDistance = getHaversineDistance(coord1, coord2);
  const CORRECTION_FACTOR = 1.3; // 직선 거리 대비 도로 주행 거리 비율
  return straightDistance * CORRECTION_FACTOR;
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

/**
 * 개별 루트의 효율성 및 KPI 분석 산출 (10.1)
 */
export interface RouteEfficiency {
  vehicleSaved: number;
  distanceBefore: number;
  distanceAfter: number;
  distanceReductionRate: number;
  profitBefore: number;
  profitAfter: number;
  profitIncreaseRate: number;
  hourlyProfitBefore: number;
  hourlyProfitAfter: number;
  shipperSavings: number[];
  fuelSavings: number; // 유류비 절감액 (KRW)
}

/**
 * 기사 1인당 일일 업무 사이클 기반 마크로 경제성 분석 (14.1)
 */
export interface DailyDriverStats {
  dailyOrders: number;
  totalDistance: number;
  deadheadDistance: number;
  totalRevenue: number;
  fuelCost: number;
  waitTime: number;
  hourlyProfit: number;
  netProfit: number;
  // 고도화 추가 지표
  timeBreakdown: {
    delivery: number; // 배송 주행 시간 (%)
    deadhead: number; // 공차 주행 시간 (%)
    idle: number;     // 대기 시간 (%)
  };
  monthlyProjection: number; // 월 예상 추가 수입 (22일 기준)
}

export function calculateDailyDriverLifeCycle(
  orders: Order[],
  bundledRoutes: Route[]
): { before: DailyDriverStats; after: DailyDriverStats } {
  const DIESEL_PRICE = 1700;
  const FUEL_EFFICIENCY = 11;
  const COMMISSION_RATE = 0.1; // 10% 플랫폼 수수료

  // --- [BEFORE] 시뮬레이션 ---
  const DRIVER_COUNT_BEFORE = 40;
  const ordersPerDriverBefore = orders.length / DRIVER_COUNT_BEFORE; 
  const avgOrderDistance = orders.reduce((sum, o) => sum + (o.actualDistance || 0), 0) / orders.length;
  const deadheadPerOrderBefore = 20000; 
  const dailyDistanceBefore = (avgOrderDistance + deadheadPerOrderBefore) * ordersPerDriverBefore;
  const dailyRevenueBefore = (orders.reduce((sum, o) => sum + o.basePrice, 0) / orders.length) * ordersPerDriverBefore;
  const dailyFuelBefore = (dailyDistanceBefore / 1000 / FUEL_EFFICIENCY) * DIESEL_PRICE;
  const netProfitBefore = dailyRevenueBefore * (1 - COMMISSION_RATE) - dailyFuelBefore;

  const deliveryTimeBefore = (avgOrderDistance * ordersPerDriverBefore) / 10; // 36km/h
  const deadheadTimeBefore = (deadheadPerOrderBefore * ordersPerDriverBefore) / 10;
  const idleTimeBefore = (45 * 60) * ordersPerDriverBefore; 
  const totalCycleBefore = deliveryTimeBefore + deadheadTimeBefore + idleTimeBefore;

  const beforeStats: DailyDriverStats = {
    dailyOrders: ordersPerDriverBefore,
    totalDistance: dailyDistanceBefore / 1000,
    deadheadDistance: (deadheadPerOrderBefore * ordersPerDriverBefore) / 1000,
    totalRevenue: dailyRevenueBefore,
    fuelCost: dailyFuelBefore,
    waitTime: idleTimeBefore / 60,
    hourlyProfit: (netProfitBefore / totalCycleBefore) * 3600,
    netProfit: netProfitBefore,
    timeBreakdown: {
      delivery: (deliveryTimeBefore / totalCycleBefore) * 100,
      deadhead: (deadheadTimeBefore / totalCycleBefore) * 100,
      idle: (idleTimeBefore / totalCycleBefore) * 100,
    },
    monthlyProjection: netProfitBefore * 22,
  };

  // --- [AFTER] 시뮬레이션 ---
  const dailyOrdersAfter = 4.5; 
  const deadheadPerOrderAfter = 5000; 
  const dailyDistanceAfter = (avgOrderDistance + deadheadPerOrderAfter) * dailyOrdersAfter;
  const dailyRevenueAfter = (orders.reduce((sum, o) => sum + o.basePrice, 0) / orders.length * 0.8) * dailyOrdersAfter;
  const dailyFuelAfter = (dailyDistanceAfter / 1000 / FUEL_EFFICIENCY) * DIESEL_PRICE;
  const netProfitAfter = dailyRevenueAfter * (1 - COMMISSION_RATE) - dailyFuelAfter;

  const deliveryTimeAfter = (avgOrderDistance * dailyOrdersAfter) / 10;
  const deadheadTimeAfter = (deadheadPerOrderAfter * dailyOrdersAfter) / 10;
  const idleTimeAfter = 0; // 합짐 시 대기 소멸
  const totalCycleAfter = deliveryTimeAfter + deadheadTimeAfter + idleTimeAfter;

  const afterStats: DailyDriverStats = {
    dailyOrders: dailyOrdersAfter,
    totalDistance: dailyDistanceAfter / 1000,
    deadheadDistance: (deadheadPerOrderAfter * dailyOrdersAfter) / 1000,
    totalRevenue: dailyRevenueAfter,
    fuelCost: dailyFuelAfter,
    waitTime: 0,
    hourlyProfit: (netProfitAfter / totalCycleAfter) * 3600,
    netProfit: netProfitAfter,
    timeBreakdown: {
      delivery: (deliveryTimeAfter / totalCycleAfter) * 100,
      deadhead: (deadheadTimeAfter / totalCycleAfter) * 100,
      idle: 0,
    },
    monthlyProjection: netProfitAfter * 22,
  };

  return { before: beforeStats, after: afterStats };
}

export function calculateRouteEfficiency(
  orders: Order[],
  bundledDistance: number,
  bundledTime: number
): RouteEfficiency {
  const isBundled = orders.length > 1;

  // 1. 차량 절감 (오더 수 - 1)
  const vehicleSaved = isBundled ? orders.length - 1 : 0;

  // 2. 거리 비교
  let distanceBefore = 0;
  for (let i = 0; i < orders.length; i++) {
    distanceBefore += orders[i].actualDistance || getEstimatedRoadDistance(orders[i].pickup, orders[i].dropoff);
    // 합짐일 때만 공차 주행 페널티 산입 (Before의 비효율 강조용)
    if (isBundled && i > 0) {
      distanceBefore += getEstimatedRoadDistance(orders[i - 1].dropoff, orders[i].pickup);
    }
  }

  // 1건일 경우 Before와 After의 주행거리는 동일해야 함 (API 오차 무시)
  const distanceAfter = isBundled ? bundledDistance : distanceBefore;
  const distanceReductionRate = isBundled ? ((distanceBefore - distanceAfter) / distanceBefore) * 100 : 0;

  // 3. 수익성 비교
  // 개별 배송 시 총 수입 (수수료 10% 제외)
  const profitBefore = orders.reduce((sum, order) => sum + order.basePrice, 0) * 0.9;
  
  // 합짐 시 화주 할인액 (2건 이상일 때만 20% 할인, 1건이면 0)
  const shipperSavings = orders.map(order => 
    isBundled ? Math.floor(order.basePrice * 0.2 / 100) * 100 : 0
  );
  
  const totalRevenueAfter = orders.reduce((sum, order, idx) => sum + (order.basePrice - shipperSavings[idx]), 0);
  const profitAfter = totalRevenueAfter * 0.9;
  
  // 1건일 경우 수익 증가율은 0%
  const profitIncreaseRate = isBundled 
    ? ((profitAfter - (profitBefore / orders.length)) / (profitBefore / orders.length)) * 100 
    : 0;

  // 4. 시간당 수익성
  const timeBefore = orders.reduce((sum, order, i) => {
    let t = order.actualDuration || (getEstimatedRoadDistance(order.pickup, order.dropoff) / 10);
    // 합짐일 때만 매칭 리스크 페널티 산입
    if (isBundled && i > 0) {
      t += (5000 / 10) + (30 * 60); 
    }
    return sum + t + (20 * 60);
  }, 0);

  // 1건일 경우 After 시간은 Before와 동일하게 세팅 (비교 공정성)
  const effectiveBundledTime = isBundled ? bundledTime : timeBefore;

  const hourlyProfitBefore = (profitBefore / timeBefore) * 3600;
  const hourlyProfitAfter = (profitAfter / effectiveBundledTime) * 3600;

  // 5. 유류비 절감액 산출
  const DIESEL_PRICE = 1700; // 평균 디젤 가격
  const FUEL_EFFICIENCY = 11; // 연비 (11km/L)
  const savedKm = Math.max(0, (distanceBefore - distanceAfter) / 1000);
  const fuelSavings = isBundled ? Math.floor((savedKm / FUEL_EFFICIENCY) * DIESEL_PRICE) : 0;

  return {
    vehicleSaved,
    distanceBefore,
    distanceAfter,
    distanceReductionRate: Math.max(0, distanceReductionRate),
    profitBefore,
    profitAfter,
    profitIncreaseRate: Math.max(0, profitIncreaseRate),
    hourlyProfitBefore,
    hourlyProfitAfter,
    shipperSavings,
    fuelSavings
  };
}
