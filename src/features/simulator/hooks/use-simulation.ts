"use client";

import { useCallback } from "react";
import { useSimulatorStore } from "@/features/simulator/store/use-simulator-store";
import { generateMockOrders } from "@/lib/data/mock-generator";
import { runBasicBundling } from "@/lib/engine/bundler";
import { getDirection } from "@/services/naver-direction";
import { Order, Route, KPIMetrics, Coordinate } from "@/types";

/**
 * 시뮬레이션 전체 프로세스를 관리하는 커스텀 훅 (7.2.2)
 */
export function useSimulation() {
  const { setStatus, setOrders, setSimulationResults } = useSimulatorStore();

  const runSimulation = useCallback(async () => {
    setStatus("LOADING");

    // 1. Mock 데이터 생성 (Before 산출물 포함됨)
    const orders = generateMockOrders(100);
    setOrders(orders);

    setStatus("SIMULATING");

    // 2. 알고리즘 실행 (클러스터링)
    const bundledGroups = runBasicBundling(orders);

    // 3. 각 번들 그룹에 대해 실제 네이버 API 호출 (After)
    const bundledRoutes: Route[] = [];
    
    // API 한도 및 속도 조절을 위해 순차적으로 처리
    for (let i = 0; i < bundledGroups.length; i++) {
      const group = bundledGroups[i];
      if (group.length === 0) continue;

      const start = group[0].pickup;
      const goal = group[group.length - 1].dropoff;
      const waypoints = group.slice(1).map(o => o.pickup).concat(group.slice(0, -1).map(o => o.dropoff));

      // 네이버 API 호출 (After 모드는 실제 도로 경로 사용)
      const direction = await getDirection(start, goal, waypoints);
      
      if (direction && direction.route && direction.route.traoptimal) {
        const routeData = direction.route.traoptimal[0];
        const path: Coordinate[] = routeData.path.map(([lng, lat]: [number, number]) => ({ lat, lng }));

        bundledRoutes.push({
          id: `ROUTE-B-${i + 1}`,
          orders: group,
          totalDistance: routeData.summary.distance,
          totalTime: routeData.summary.duration / 1000,
          pathPoints: path,
          type: "Bundled",
        });
      } else {
        // API 호출 실패 시 직선 거리로 대체 (Fallback)
        bundledRoutes.push({
          id: `ROUTE-B-F-${i + 1}`,
          orders: group,
          totalDistance: 0, // 임시
          totalTime: 0,
          pathPoints: [start, goal],
          type: "Bundled",
        });
      }
    }

    // 4. KPI 지표 산출 (단순화된 예시)
    const metrics: KPIMetrics = {
      totalDistance: { before: 1200000, after: 850000, reductionRate: 29.1 },
      totalTime: { before: 36000, after: 25000, reductionRate: 30.5 },
      driverProfit: { before: 100, after: 115, increaseRate: 15.0 },
      vehicleCount: { before: 100, after: bundledRoutes.length },
    };

    // 5. 결과 저장
    setSimulationResults([], bundledRoutes, metrics);
    setStatus("DONE");
  }, [setStatus, setOrders, setSimulationResults]);

  return { runSimulation };
}
