"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface DashboardProps {
  children: ReactNode;
  isOpen?: boolean;
}

/**
 * 글래스모피즘 기반의 프리미엄 대시보드 사이드 패널 (4.2.1)
 */
export default function Dashboard({ children, isOpen = true }: DashboardProps) {
  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: isOpen ? 0 : "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed right-0 top-0 h-full w-96 bg-slate-950/80 backdrop-blur-xl border-l border-slate-800 p-6 shadow-2xl z-50 overflow-y-auto"
    >
      <div className="space-y-8">
        <header>
          <h1 className="text-2xl font-black text-indigo-500 tracking-tighter">
            TukTak <span className="text-white">SIMULATOR</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1 font-medium">
            AI 기반 배차 효율성 실시간 분석
          </p>
        </header>

        <main className="space-y-6">
          {children}
        </main>

        <footer className="pt-8 border-t border-slate-800/50">
          <p className="text-[10px] text-slate-500 text-center">
            &copy; 2026 TukTak Logistics Engineering. All rights reserved.
          </p>
        </footer>
      </div>
    </motion.div>
  );
}
