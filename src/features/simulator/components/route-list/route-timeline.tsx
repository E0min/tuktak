"use client";

import { Layers } from "lucide-react";
import { Route } from "@/types";

interface RouteTimelineProps {
  route: Route;
}

export function RouteTimeline({ route }: RouteTimelineProps) {
  const sequence = route.optimalSequence || [];
  let currentVolume = 0;

  // 오더별 알파벳 라벨 매핑 (A, B, C...)
  const orderLabels: Record<string, string> = {};
  route.orders.forEach((o, i) => {
    orderLabels[o.id] = String.fromCharCode(65 + i);
  });

  return (
    <div className="space-y-3 mb-5 relative">
      <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-orange-500 via-emerald-500 to-blue-500 opacity-20" />
      
      {sequence.map((point, idx) => {
        const order = route.orders.find(o => o.id === point.id);
        if (!order) return null;

        const label = orderLabels[order.id];
        const isPickup = point.type === "Pickup";
        
        if (isPickup) {
          currentVolume += order.cargo.volume;
        } else {
          currentVolume -= order.cargo.volume;
        }
        
        const displayVolume = Math.max(0, Math.round(currentVolume * 100));
        const timeStr = isPickup 
          ? new Date(order.timeWindow.pickupAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false })
          : new Date(order.timeWindow.deadlineAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });

        // 합짐 할인 가격 (20% 할인)
        const bundledPrice = Math.floor(order.basePrice * 0.8 / 100) * 100;

        return (
          <div key={`${point.id}-${point.type}-${idx}`} className="flex gap-4 relative z-10 group/item">
            {/* ID Label (A, B, C...) */}
            <div className={`w-5 h-5 rounded-full bg-slate-900 border-2 flex items-center justify-center mt-1 transition-transform group-hover/item:scale-110 ${
              isPickup ? "border-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.3)]" : "border-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.3)]"
            }`}>
              <span className="text-[10px] font-black text-white">{label}</span>
            </div>

            <div className="flex-1 flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-black uppercase ${
                    isPickup ? "text-orange-400" : "text-blue-400"
                  }`}>
                    {isPickup ? "Pickup" : "Dropoff"} {label}
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono font-bold bg-white/5 px-1.5 py-0.5 rounded">
                    {timeStr}
                  </span>
                  </div>
                  <p className="text-[11px] text-slate-200 font-semibold truncate max-w-[140px] mt-0.5">
                  {isPickup ? order.pickupAddress : order.dropoffAddress}
                  </p>
                  </div>              <div className="text-right">
                <div className="flex items-center gap-1.5 justify-end">
                  <Layers size={10} className={isPickup ? "text-orange-500" : "text-blue-500"} />
                  <span className={`text-[10px] font-black ${displayVolume > 85 ? "text-amber-500" : "text-white"}`}>
                    {displayVolume}%
                  </span>
                </div>
                <span className="text-[8px] text-slate-500 font-bold uppercase tracking-tighter">Load Rate</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
