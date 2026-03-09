import { create } from "zustand";
import { Order, Route, KPIMetrics } from "../../types";

type SimulatorStatus = "IDLE" | "LOADING" | "SIMULATING" | "DONE";

interface SimulatorState {
  status: SimulatorStatus;
  orders: Order[];
  individualRoutes: Route[];
  bundledRoutes: Route[];
  metrics: KPIMetrics | null;
  
  // Actions
  setStatus: (status: SimulatorStatus) => void;
  setOrders: (orders: Order[]) => void;
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

  setStatus: (status) => set({ status }),
  setOrders: (orders) => set({ orders }),
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
    }),
}));
