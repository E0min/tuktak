import { create } from "zustand";
import { Order, Route, KPIMetrics } from "@/types";

type SimulatorStatus = "IDLE" | "LOADING" | "SIMULATING" | "DONE";

interface SimulatorState {
  status: SimulatorStatus;
  orders: Order[];
  individualRoutes: Route[];
  bundledRoutes: Route[];
  metrics: KPIMetrics | null;
  isRouteListOpen: boolean;
  isEfficiencyDashboardOpen: boolean;
  selectedRouteId: string | null;
  
  // Actions
  setStatus: (status: SimulatorStatus) => void;
  setOrders: (orders: Order[]) => void;
  setIsRouteListOpen: (open: boolean) => void;
  setIsEfficiencyDashboardOpen: (open: boolean) => void;
  setSelectedRouteId: (id: string | null) => void;
  setSimulationResults: (
    individual: Route[],
    bundled: Route[],
    metrics: KPIMetrics
  ) => void;
  reset: () => void;
}

/**
 * 시뮬레이션 전역 상태 관리 스토어 (Zustand) (4.3.1.2)
 */
export const useSimulatorStore = create<SimulatorState>((set) => ({
  status: "IDLE",
  orders: [],
  individualRoutes: [],
  bundledRoutes: [],
  metrics: null,
  isRouteListOpen: false,
  isEfficiencyDashboardOpen: false,
  selectedRouteId: null,

  setStatus: (status) => set({ status }),
  setOrders: (orders) => set({ orders }),
  setIsRouteListOpen: (open) => set({ isRouteListOpen: open }),
  setIsEfficiencyDashboardOpen: (open) => set({ isEfficiencyDashboardOpen: open }),
  setSelectedRouteId: (id) => set({ selectedRouteId: id }),
  setSimulationResults: (individual, bundled, metrics) =>
    set({
      individualRoutes: individual,
      bundledRoutes: bundled,
      metrics: metrics,
      status: "DONE",
    }),
  reset: () =>
    set({
      status: "IDLE",
      orders: [],
      individualRoutes: [],
      bundledRoutes: [],
      metrics: null,
      isRouteListOpen: false,
      selectedRouteId: null,
    }),
}));
