"use client";

import { Package, Layers, Weight } from "lucide-react";
import { Order } from "@/types";
import { RouteEfficiency } from "@/lib/engine/calculator";

interface RouteCargoInventoryProps {
  orders: Order[];
  efficiency: RouteEfficiency;
}

export function RouteCargoInventory({ orders, efficiency }: RouteCargoInventoryProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
          <Package size={12} /> 적재 화물 목록 (Inventory)
        </h4>
        <span className="text-[9px] text-emerald-500 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
          총 {orders.length}개 품목
        </span>
      </div>
      
      <div className="space-y-2">
        {orders.map((order, idx) => (
          <div key={order.id} className="bg-white/5 border border-white/5 p-3 rounded-xl hover:bg-white/10 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-indigo-500/20 flex items-center justify-center text-[10px] font-bold text-indigo-400 border border-indigo-500/20">
                  {idx + 1}
                </div>
                <span className="text-xs font-black text-white">{getCategoryLabel(order.cargo.category)}</span>
              </div>
              <div className="text-right">
                <span className="text-[9px] text-slate-500 block">화주 절감액</span>
                <span className="text-[10px] text-emerald-400 font-bold">-{efficiency.shipperSavings[idx].toLocaleString()}원</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-[11px]">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Layers size={10} /> 
                  <span>부피: {Math.round(order.cargo.volume * 100)}%</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Weight size={10} /> 
                  <span>중량: {order.cargo.weight}kg</span>
                </div>
              </div>
              <div className="space-y-1 border-l border-white/5 pl-4">
                <p className="text-[10px] text-slate-500 truncate">S: {order.pickupAddress?.split(' ').slice(1).join(' ')}</p>
                <p className="text-[10px] text-slate-500 truncate">E: {order.dropoffAddress?.split(' ').slice(1).join(' ')}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900/60 p-3 rounded-xl border border-white/5 flex items-center justify-between">
        <span className="text-[10px] text-slate-500 font-bold uppercase">Total Loading</span>
        <div className="flex gap-4">
          <div className="flex items-center gap-1">
            <Layers size={10} className="text-emerald-500" />
            <span className="text-xs text-white font-black">{Math.round(orders.reduce((s, o) => s + o.cargo.volume, 0) * 100)}%</span>
          </div>
          <div className="flex items-center gap-1">
            <Weight size={10} className="text-emerald-500" />
            <span className="text-xs text-white font-black">{orders.reduce((s, o) => s + o.cargo.weight, 0)}kg</span>
          </div>
        </div>
      </div>
    </div>
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
