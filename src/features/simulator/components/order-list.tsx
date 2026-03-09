"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Order } from "@/types";
import { X, MapPin, Clock, Package, Weight, Layers } from "lucide-react";

interface OrderListProps {
  orders: Order[];
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 배차 수요 상세 리스트 컴포넌트
 * 글래스모피즘 오버레이 레이어 (4.2.1 컨셉 유지)
 */
export default function OrderList({ orders, isOpen, onClose }: OrderListProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Side Panel (Left) */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-full max-w-md bg-slate-900/90 backdrop-blur-md border-r border-slate-800 shadow-[20px_0_80px_rgba(0,0,0,0.7)] z-[70] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
              <div>
                <h2 className="text-xl font-black text-white tracking-tight">
                  배차 수요 상세 <span className="text-indigo-500">LIST</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">총 {orders.length}건의 실시간 배차 데이터</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-800 rounded-full text-slate-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* List Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {orders.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-2">
                  <Layers size={40} strokeWidth={1.5} className="opacity-20" />
                  <p className="text-sm font-medium">생성된 배차 데이터가 없습니다.</p>
                </div>
              ) : (
                orders.map((order) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-800/40 border border-slate-700/50 p-4 rounded-xl hover:border-indigo-500/30 transition-all group"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                        ID: {order.id.split('-')[0].toUpperCase()}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                        <Package size={12} />
                        {getCategoryLabel(order.cargo.category)}
                      </div>
                    </div>

                    <div className="space-y-3">
                      {/* Pickup Info */}
                      <div className="flex gap-3">
                        <div className="flex flex-col items-center py-1">
                          <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
                          <div className="flex-1 w-px bg-slate-700 my-1" />
                          <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] text-slate-500 font-bold uppercase">Pickup</span>
                              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                <Clock size={10} /> {formatDate(order.timeWindow.pickupAt)}
                              </span>
                            </div>
                            <p className="text-sm text-slate-200 font-medium">{order.pickupAddress}</p>
                          </div>
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] text-slate-500 font-bold uppercase">Dropoff</span>
                              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                <Clock size={10} /> {formatDate(order.timeWindow.deadlineAt)}
                              </span>
                            </div>
                            <p className="text-sm text-slate-200 font-medium">{order.dropoffAddress}</p>
                          </div>
                        </div>
                      </div>

                      {/* Cargo Details Footer */}
                      <div className="pt-3 border-t border-slate-700/50 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Layers size={12} className="text-slate-500" />
                            부피 {Math.round(order.cargo.volume * 100)}%
                          </span>
                          <span className="flex items-center gap-1">
                            <Weight size={12} className="text-slate-500" />
                            중량 {order.cargo.weight}kg
                          </span>
                        </div>
                        <span className="text-white font-bold tracking-tight">
                          {order.basePrice.toLocaleString()}원
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function getCategoryLabel(category: string) {
  const labels: Record<string, string> = {
    Appliance: "가전",
    Furniture: "가구",
    StoreFixture: "매장집기",
    SmallOffice: "소형사무실",
    General: "일반화물",
  };
  return labels[category] || category;
}

function formatDate(isoString: string) {
  const date = new Date(isoString);
  return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
}
