"use client";

import { useEffect, useState } from "react";
import NaverMap from "@/features/simulator/components/naver-map";
import Dashboard from "@/features/simulator/components/dashboard";
import KPICard from "@/features/simulator/components/kpi-card";
import ControlPanel from "@/features/simulator/components/control-panel";
import { useNaverMap } from "@/features/simulator/hooks/use-naver-map";
import { useSimulatorStore } from "@/features/simulator/store/use-simulator-store";
import { createMarker, drawPath } from "@/features/simulator/lib/map-utils";

/**
 * 시뮬레이터 메인 페이지 컴포넌트 (4.3.2.1)
 * 모든 UI 컴포넌트와 비즈니스 로직을 결합합니다.
 */
export function SimulatorPage() {
  const { map, handleMapLoad } = useNaverMap();
  const { status, orders, bundledRoutes, metrics } = useSimulatorStore();
  const [markers, setMarkers] = useState<any[]>([]);
  const [polylines, setPolylines] = useState<any[]>([]);

  // 오더 및 시뮬레이션 상태 변경 시 지도 객체 업데이트
  useEffect(() => {
    if (!map || orders.length === 0) return;

    // 1. 기존 오버레이 제거
    markers.forEach((m) => m.setMap(null));
    polylines.forEach((p) => p.setMap(null));

    // 2. 마커 생성 (상/하차지)
    const newMarkers = orders.map((order) => {
      const pickupMarker = createMarker(map, order.pickup, "Pickup");
      const dropoffMarker = createMarker(map, order.dropoff, "Dropoff");
      return [pickupMarker, dropoffMarker];
    }).flat();

    // 3. 경로(Polyline) 생성
    const newPolylines: any[] = [];

    if (status === "DONE" && bundledRoutes.length > 0) {
      // After: 실제 도로 주행 경로 (에메랄드색)
      bundledRoutes.forEach((route) => {
        const p = drawPath(map, route.pathPoints, "Bundled");
        if (p) newPolylines.push(p);
      });
    } else {
      // Before: 개별 배송 직선 경로 (인디고색 점선)
      orders.forEach((order) => {
        const p = drawPath(map, [order.pickup, order.dropoff], "Individual");
        if (p) newPolylines.push(p);
      });
    }

    setMarkers(newMarkers);
    setPolylines(newPolylines);
  }, [map, orders, bundledRoutes, status]);

  return (
    <div className="relative w-full h-screen bg-slate-950">
      <NaverMap onMapLoad={handleMapLoad} />

      <Dashboard isOpen={true}>
        <section className="space-y-4">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">
            Control
          </h2>
          <ControlPanel />
        </section>

        <section className="space-y-4">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">
            Real-time Metrics
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <KPICard 
              label="총 배차 수요" 
              value={orders.length} 
              suffix="건" 
              color="indigo"
            />
            <KPICard 
              label="최적화 루트" 
              value={status === "DONE" ? bundledRoutes.length : 0} 
              suffix="개" 
              color="emerald"
            />
            <KPICard 
              label="거리 절감률" 
              value={status === "DONE" && metrics ? metrics.totalDistance.reductionRate : 0} 
              suffix="%" 
              color="emerald" 
              precision={1}
            />
            <KPICard 
              label="기사 수익 증대" 
              value={status === "DONE" && metrics ? metrics.driverProfit.increaseRate : 0} 
              suffix="%" 
              color="amber" 
              precision={1}
            />
          </div>
        </section>

        {status === "DONE" && (
          <section className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
            <p className="text-xs text-emerald-400 font-medium leading-relaxed">
              알고리즘 분석 결과, 서울 시내 100건의 배차 중 상당수가 합짐 가능한 구조로 파악되었습니다. 
              실제 도로 주행 데이터를 기반으로 최적화된 루트를 지도에 표시합니다.
            </p>
          </section>
        )}
      </Dashboard>
    </div>
  );
}
