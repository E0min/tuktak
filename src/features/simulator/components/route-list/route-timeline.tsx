"use client";

import { Layers } from "lucide-react";
import { Route } from "@/types";

interface RouteTimelineProps {
  route: Route;
}

export function RouteTimeline({ route }: RouteTimelineProps) {
  const sequence = route.optimalSequence || [];
  let currentVolume = 0;

  return (
    <div className="space-y-3 mb-5 relative">
      <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-orange-500 via-emerald-500 to-blue-500 opacity-20" />
      
      {sequence.map((point, idx) => {
        const order = route.orders.find(o => o.id === point.id);
        if (!order) return null;

        if (point.type === "Pickup") {
          currentVolume += order.cargo.volume;
        } else {
          currentVolume -= order.cargo.volume;
        }
        
        const displayVolume = Math.max(0, Math.round(currentVolume * 100));

        return (
          <div key={`${point.id}-${point.type}-${idx}`} className="flex gap-4 relative z-10">
            <div className={`w-4 h-4 rounded-full bg-slate-900 border-2 flex items-center justify-center mt-1 ${
              point.type === "Pickup" ? "border-orange-500" : "border-blue-500"
            }`}>
              <span className="text-[8px] font-black text-white">{idx + 1}</span>
            </div>
            <div className="flex-1 flex justify-between items-center">
              <div>
                <span className={`text-[9px] font-bold uppercase block ${
                  point.type === "Pickup" ? "text-orange-400" : "text-blue-400"
                }`}>
                  {point.type} {order.id.split('-')[1]}
                </span>
                <p className="text-[11px] text-slate-200 font-semibold truncate max-w-[150px]">
                  {point.type === "Pickup" ? order.pickupAddress : order.dropoffAddress}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1.5 justify-end">
                  <Layers size={10} className={point.type === "Pickup" ? "text-orange-500" : "text-blue-500"} />
                  <span className={`text-[10px] font-black ${displayVolume > 85 ? "text-amber-500" : "text-white"}`}>
                    {displayVolume}%
                  </span>
                </div>
                <span className="text-[8px] text-slate-500 font-bold uppercase">Load</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
