"use client";

import { useState } from "react";
import NaverMap from "@/features/simulator/components/naver-map";
import Dashboard from "@/features/simulator/components/dashboard";
import KPICard from "@/features/simulator/components/kpi-card";
import ControlPanel from "@/features/simulator/components/control-panel";
import OrderList from "@/features/simulator/components/order-list";
import RouteList from "@/features/simulator/components/route-list";
import { useNaverMap } from "@/features/simulator/hooks/use-naver-map";
import { useSimulatorStore } from "@/features/simulator/store/use-simulator-store";
import { useMapOverlays } from "@/features/simulator/hooks/use-map-overlays";

/**
 * 시뮬레이터 메인 페이지 컴포넌트
 * 리팩토링: 관심사 분리를 통해 코드 응집도를 높이고 비즈니스 로직을 훅으로 격리 (13.3)
 */
export function SimulatorPage() {
  // 1. 상태 및 훅 초기화
  const { map, handleMapLoad } = useNaverMap();
  const { 
    status, 
    orders, 
    bundledRoutes, 
    metrics, 
    isRouteListOpen, 
    setIsRouteListOpen,
    selectedRouteId
  } = useSimulatorStore();
  
  const [isOrderListOpen, setIsOrderListOpen] = useState(false);

  // 2. 지도 오버레이 관리 (커스텀 훅으로 비즈니스 로직 격리)
  useMapOverlays({
    map,
    status,
    orders,
    bundledRoutes,
    selectedRouteId,
    isRouteListOpen,
  });

  return (
    <div className="relative w-full h-screen bg-slate-950 overflow-hidden">
      {/* 베이스 레이어: 네이버 지도 */}
      <NaverMap onMapLoad={handleMapLoad} />

      {/* 오버레이 레이어: 개별 배차 수요 리스트 (왼쪽) */}
      <OrderList 
        orders={orders} 
        isOpen={isOrderListOpen} 
        onClose={() => setIsOrderListOpen(false)} 
      />

      {/* 오버레이 레이어: 최적화 루트 분석 리스트 (오른쪽) */}
      <RouteList
        routes={bundledRoutes}
        isOpen={isRouteListOpen}
        onClose={() => setIsRouteListOpen(false)}
      />

      {/* 제어 레이어: 통합 대시보드 */}
      <Dashboard isOpen={true}>
        {/* 컨트롤 섹션 */}
        <section className="space-y-4">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Control</h2>
          <ControlPanel />
        </section>

        {/* 지표 섹션 */}
        <section className="space-y-4">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Real-time Metrics</h2>
          <div className="grid grid-cols-2 gap-3">
            <KPICard 
              label="총 배차 수요" 
              value={orders.length} 
              suffix="건" 
              color="indigo"
              onClick={() => setIsOrderListOpen(true)}
            />
            <KPICard 
              label="최적화 루트" 
              value={status === "DONE" ? bundledRoutes.filter(r => r.orders.length > 1).length : 0} 
              suffix="개" 
              color="emerald"
              onClick={() => {
                if (status === "DONE") setIsRouteListOpen(true);
              }}
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

        {/* 안내 메시지 섹션 */}
        {status === "DONE" && (
          <section className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
            <p className="text-xs text-emerald-400 font-medium leading-relaxed">
              알고리즘 분석 결과, 실제 도로 주행 데이터를 기반으로 최적화된 루트를 도출했습니다. 
              우측 상단 '최적화 루트' 카드를 클릭하여 상세 분석 리포트를 확인하세요.
            </p>
          </section>
        )}
      </Dashboard>
    </div>
  );
}
