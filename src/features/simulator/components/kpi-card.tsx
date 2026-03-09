"use client";

import { motion, useSpring, useTransform, animate } from "framer-motion";
import { useEffect } from "react";

interface KPICardProps {
  label: string;
  value: number;
  suffix?: string;
  subLabel?: string;
  color?: "indigo" | "emerald" | "amber";
  precision?: number;
}

/**
 * 시뮬레이션 지표를 시각화하는 KPI 카드 컴포넌트 (4.2.2)
 * Framer Motion을 활용한 숫자 카운팅 애니메이션 포함
 */
export default function KPICard({
  label,
  value,
  suffix = "",
  subLabel,
  color = "indigo",
  precision = 0,
}: KPICardProps) {
  const count = useSpring(0, {
    mass: 1,
    stiffness: 75,
    damping: 15,
  });
  
  const displayValue = useTransform(count, (latest) => 
    latest.toLocaleString(undefined, { 
      minimumFractionDigits: precision,
      maximumFractionDigits: precision 
    })
  );

  useEffect(() => {
    count.set(value);
  }, [value, count]);

  const colorClasses = {
    indigo: "text-indigo-500 bg-indigo-500/10",
    emerald: "text-emerald-500 bg-emerald-500/10",
    amber: "text-amber-400 bg-amber-400/10",
  };

  return (
    <div className="bg-slate-900/40 border border-slate-800/50 p-4 rounded-xl">
      <div className="flex flex-col gap-1">
        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
          {label}
        </span>
        <div className="flex items-baseline gap-1">
          <motion.span className={`text-2xl font-black ${colorClasses[color].split(" ")[0]}`}>
            {displayValue}
          </motion.span>
          <span className="text-xs font-bold text-slate-400">{suffix}</span>
        </div>
        {subLabel && (
          <span className="text-[10px] font-medium text-slate-600 mt-1">
            {subLabel}
          </span>
        )}
      </div>
    </div>
  );
}
