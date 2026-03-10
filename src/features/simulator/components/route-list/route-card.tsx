"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Navigation, TrendingUp, Truck, Fuel, Coins } from "lucide-react";
import { Route } from "@/types";
import { calculateRouteEfficiency } from "@/lib/engine/calculator";
import { useSimulatorStore } from "@/features/simulator/store/use-simulator-store";
import { RouteBadge } from "./route-badge";
import { RouteTimeline } from "./route-timeline";
import { RouteMetricsComparison } from "./route-metrics-comparison";
import { RouteCargoInventory } from "./route-cargo-inventory";

interface RouteCardProps {
  route: Route;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}

export function RouteCard({ route, index, isExpanded, onToggle }: RouteCardProps) {
  const { setSelectedRouteId, selectedRouteId } = useSimulatorStore();
  const efficiency = calculateRouteEfficiency(route.orders, route.totalDistance, route.totalTime);
  const isSelected = selectedRouteId === route.id;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      onMouseEnter={() => setSelectedRouteId(route.id)}
      onMouseLeave={() => setSelectedRouteId(null)}
      onClick={onToggle}
      className={`bg-slate-800/40 border p-5 rounded-2xl transition-all group cursor-pointer relative overflow-hidden ${
        isSelected || isExpanded ? "border-emerald-500/50 bg-slate-800/60 shadow-[0_0_20px_rgba(16,185,129,0.1)]" : "border-white/5"
      }`}
    >
      {/* 1. Efficiency Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        <RouteBadge color="emerald" icon={<Navigation size={10} />}>
          거리 -{Math.round(efficiency.distanceReductionRate)}%
        </RouteBadge>
        <RouteBadge color="amber" icon={<TrendingUp size={10} />}>
          수익 {Math.round(efficiency.profitIncreaseRate)}% UP
        </RouteBadge>
        <RouteBadge color="blue" icon={<Truck size={10} />}>
          차량 {efficiency.vehicleSaved}대 절약
        </RouteBadge>
        <RouteBadge color="emerald" icon={<Fuel size={10} />}>
          유류비 {efficiency.fuelSavings.toLocaleString()}원 절감
        </RouteBadge>
      </div>

      {/* 2. Basic Info */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-slate-700/50 flex items-center justify-center text-xs font-black text-white border border-white/5">
            #{index + 1}
          </span>
          <div>
            <p className="text-xs font-bold text-white uppercase tracking-tight">Route {route.id.split('-')[0]}</p>
            <p className="text-[10px] text-slate-500 font-medium">총 {route.orders.length}개 주문 합짐</p>
          </div>
        </div>
        {isExpanded ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
      </div>

      {/* 3. Timeline */}
      <RouteTimeline route={route} />

      {/* 4. Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-4 border-t border-white/5 space-y-6">
              {/* Route Total Summary (Simplified) */}
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Estimated Net Profit</p>
                  <p className="text-2xl font-black text-white">{Math.round(efficiency.profitAfter).toLocaleString()}원</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Efficiency</p>
                  <p className="text-lg font-black text-emerald-400">+{Math.round(efficiency.profitIncreaseRate)}%</p>
                </div>
              </div>
              
              <div className="bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-xl">
                <h4 className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Coins size={12} /> 기사 수익성 정밀 분석
                </h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  이 묶음 배차를 완료할 경우, 개별 단일 건들을 따로 잡는 불확실한 대기 시간 없이 
                  <span className="text-emerald-400 font-black px-1 text-xs">
                    {Math.round(((efficiency.hourlyProfitAfter - efficiency.hourlyProfitBefore) / efficiency.hourlyProfitBefore) * 100)}%
                  </span> 
                  높은 시간당 생산성을 확보할 수 있습니다.
                </p>
              </div>

              <RouteCargoInventory orders={route.orders} efficiency={efficiency} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. Compact Footer */}
      {!isExpanded && (
        <div className="pt-4 border-t border-white/5 grid grid-cols-3 gap-2">
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">Distance</span>
            <p className="text-xs text-white font-black">{(route.totalDistance / 1000).toFixed(1)}km</p>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">Time</span>
            <p className="text-xs text-white font-black">{Math.floor(route.totalTime / 3600)}h {Math.round((route.totalTime % 3600) / 60)}m</p>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">Hourly Profit</span>
            <p className="text-xs text-emerald-400 font-black">+{Math.round(((efficiency.hourlyProfitAfter - efficiency.hourlyProfitBefore) / efficiency.hourlyProfitBefore) * 100)}%</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
