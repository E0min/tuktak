"use client";

import { Navigation, Clock, Coins, Fuel } from "lucide-react";
import { RouteEfficiency } from "@/lib/engine/calculator";

interface RouteMetricsComparisonProps {
  efficiency: RouteEfficiency;
  totalTime: number;
}

export function RouteMetricsComparison({ efficiency, totalTime }: RouteMetricsComparisonProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <ComparisonBox 
        title="개별 배송 시 (Before)" 
        metrics={[
          { label: "총 거리", value: `${(efficiency.distanceBefore / 1000).toFixed(1)}km`, icon: <Navigation size={12} /> },
          { label: "총 시간", value: `${efficiency.vehicleSaved + 1}시간`, icon: <Clock size={12} /> },
          { label: "기사 수익", value: `${Math.round(efficiency.profitBefore).toLocaleString()}원`, icon: <Coins size={12} /> }
        ]}
        color="slate"
      />
      <ComparisonBox 
        title="TukTak 합짐 (After)" 
        metrics={[
          { label: "총 거리", value: `${(efficiency.distanceAfter / 1000).toFixed(1)}km`, icon: <Navigation size={12} />, highlight: true },
          { label: "유류비 절감", value: `${efficiency.fuelSavings.toLocaleString()}원`, icon: <Fuel size={12} />, highlight: true },
          { label: "기사 수익", value: `${Math.round(efficiency.profitAfter).toLocaleString()}원`, icon: <Coins size={12} />, highlight: true }
        ]}
        color="emerald"
      />
    </div>
  );
}

interface MetricItem {
  label: string;
  value: string;
  icon: React.ReactNode;
  highlight?: boolean;
}

function ComparisonBox({ title, metrics, color }: { title: string, metrics: MetricItem[], color: "slate" | "emerald" }) {
  const titleColors = {
    slate: "text-slate-400",
    emerald: "text-emerald-400"
  };
  
  return (
    <div className="space-y-2">
      <h5 className={`text-[10px] font-black uppercase tracking-tight ${titleColors[color]}`}>{title}</h5>
      <div className="space-y-1.5">
        {metrics.map((m, i) => (
          <div key={i} className="flex items-center justify-between bg-white/5 p-2 rounded-lg border border-white/5">
            <span className="text-slate-500">{m.icon}</span>
            <span className={`text-[11px] font-bold ${m.highlight ? "text-white" : "text-slate-400"}`}>{m.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
