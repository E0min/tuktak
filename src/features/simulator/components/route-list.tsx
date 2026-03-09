"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Truck, TrendingUp } from "lucide-react";
import { Route } from "@/types";
import { RouteCard } from "./route-list/route-card";

interface RouteListProps {
  routes: Route[];
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 최적화 루트 상세 리스트 컨테이너 (RouteList)
 * 리팩토링: 관심사 분리 및 컴포넌트화를 통해 가독성과 유지보수성 향상 (13.1)
 */
export default function RouteList({ routes, isOpen, onClose }: RouteListProps) {
  const [expandedRouteId, setExpandedRouteId] = useState<string | null>(null);

  // 합짐된 루트만 필터링 (메모이제이션으로 성능 최적화)
  const bundledOnly = useMemo(() => 
    routes.filter(r => r.orders.length > 1), 
    [routes]
  );

  const toggleExpand = (id: string) => {
    setExpandedRouteId(prev => prev === id ? null : id);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Side Panel (Right) */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-slate-900/90 backdrop-blur-md border-l border-emerald-500/30 shadow-[-20px_0_80px_rgba(0,0,0,0.7)] z-[70] overflow-hidden flex flex-col"
          >
            {/* Header Section */}
            <header className="p-6 border-b border-white/5 flex items-center justify-between bg-emerald-500/5">
              <div>
                <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                  최적화 루트 <span className="text-emerald-500 italic">ANALYSIS</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  총 {bundledOnly.length}개의 배송 차량으로 최적화 완료
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-full text-slate-400 transition-colors"
              >
                <X size={20} />
              </button>
            </header>

            {/* Efficiency Summary Banner */}
            {bundledOnly.length > 0 && (
              <div className="mx-6 mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <p className="text-[10px] text-emerald-500/70 font-bold uppercase tracking-wider">Average Efficiency</p>
                  <p className="text-lg font-black text-white">평균 합짐률 64.5% 달성</p>
                </div>
              </div>
            )}

            {/* Route Cards List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {bundledOnly.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-2 opacity-50">
                  <Truck size={40} strokeWidth={1.5} />
                  <p className="text-sm font-medium">최적화(합짐)에 성공한 루트가 없습니다.</p>
                </div>
              ) : (
                bundledOnly.map((route, index) => (
                  <RouteCard
                    key={route.id}
                    route={route}
                    index={index}
                    isExpanded={expandedRouteId === route.id}
                    onToggle={() => toggleExpand(route.id)}
                  />
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
