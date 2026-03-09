"use client";

import React from "react";

interface RouteBadgeProps {
  children: React.ReactNode;
  color: "emerald" | "amber" | "blue";
  icon: React.ReactNode;
}

export function RouteBadge({ children, color, icon }: RouteBadgeProps) {
  const colors = {
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    amber: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  };

  return (
    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${colors[color]}`}>
      {icon}
      {children}
    </span>
  );
}
