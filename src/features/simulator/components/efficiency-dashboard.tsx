"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, TrendingUp, Truck, Fuel, Clock, Coins, Info, ArrowUpRight, Calendar, Calculator } from "lucide-react";
import { calculateDailyDriverLifeCycle, DailyDriverStats } from "@/lib/engine/calculator";
import { Order, Route } from "@/types";

interface EfficiencyDashboardProps {
  orders: Order[];
  routes: Route[];
  isOpen: boolean;
  onClose: () => void;
}

export default function EfficiencyDashboard({ orders, routes, isOpen, onClose }: EfficiencyDashboardProps) {
  const stats = calculateDailyDriverLifeCycle(orders, routes);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100]"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="fixed inset-4 md:inset-10 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl z-[110] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <header className="p-8 border-b border-white/5 flex items-center justify-between bg-indigo-500/5">
              <div>
                <h2 className="text-3xl font-black text-white tracking-tighter flex items-center gap-3">
                  기사 일일 평균 경제성 분석 <span className="text-indigo-500 italic">REPORT</span>
                </h2>
                <p className="text-slate-400 mt-2 text-sm max-w-2xl">
                  기사 1인의 하루 업무 사이클을 분석하여 TukTak 시스템 도입 시 얻는 시간적, 경제적 가치를 증명합니다.
                </p>
              </div>
              <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-full text-slate-400 transition-all">
                <X size={28} />
              </button>
            </header>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
              
              {/* 1. Monthly Projection Banner (New Goal 4) */}
              <div className="bg-gradient-to-r from-indigo-600 to-emerald-600 p-8 rounded-[2rem] shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full -mr-20 -mt-20 group-hover:bg-white/20 transition-all duration-700" />
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="space-y-2 text-center md:text-left">
                    <span className="inline-flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-widest">
                      <Calendar size={14} /> Monthly Projection
                    </span>
                    <h3 className="text-2xl md:text-4xl font-black text-white tracking-tight leading-tight">
                      TukTak 이용 시 월 <span className="text-emerald-300">{(stats.after.monthlyProjection - stats.before.monthlyProjection).toLocaleString()}원</span>의<br />
                      추가 순수익을 기대할 수 있습니다.
                    </h3>
                  </div>
                  <div className="bg-black/20 backdrop-blur-md p-6 rounded-2xl border border-white/10 text-center min-w-[200px]">
                    <p className="text-xs font-bold text-white/60 uppercase">월 예상 순수익 (22일)</p>
                    <p className="text-3xl font-black text-white mt-1">{Math.round(stats.after.monthlyProjection).toLocaleString()}원</p>
                    <div className="mt-2 text-[10px] text-emerald-300 font-bold flex items-center justify-center gap-1">
                      <ArrowUpRight size={12} /> 기존 대비 {Math.round((stats.after.monthlyProjection / stats.before.monthlyProjection - 1) * 100)}% 상승
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Work-Day Cycle Timeline (New Goal 1) */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 px-2">
                  <Calculator size={20} className="text-indigo-400" />
                  <h3 className="text-xl font-black text-white">업무 사이클 비교 (Work-Day Cycle)</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Before Timeline */}
                  <div className="space-y-4">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">기존 개별 배차 (8시간 기준)</p>
                    <div className="h-12 w-full bg-slate-800 rounded-xl overflow-hidden flex shadow-inner">
                      <div className="h-full bg-indigo-500/60" style={{ width: `${stats.before.timeBreakdown.delivery}%` }} />
                      <div className="h-full bg-amber-500/40" style={{ width: `${stats.before.timeBreakdown.deadhead}%` }} />
                      <div className="h-full bg-slate-700" style={{ width: `${stats.before.timeBreakdown.idle}%` }} />
                    </div>
                    <Legend items={[
                      { label: "실배송주행", color: "bg-indigo-500", percent: Math.round(stats.before.timeBreakdown.delivery) },
                      { label: "공차이동", color: "bg-amber-500", percent: Math.round(stats.before.timeBreakdown.deadhead) },
                      { label: "대기/탐색", color: "bg-slate-600", percent: Math.round(stats.before.timeBreakdown.idle) }
                    ]} />
                  </div>

                  {/* After Timeline */}
                  <div className="space-y-4">
                    <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest px-1">TukTak 고밀도 합짐 (8시간 기준)</p>
                    <div className="h-12 w-full bg-slate-800 rounded-xl overflow-hidden flex shadow-inner">
                      <div className="h-full bg-emerald-500" style={{ width: `${stats.after.timeBreakdown.delivery}%` }} />
                      <div className="h-full bg-amber-500/60" style={{ width: `${stats.after.timeBreakdown.deadhead}%` }} />
                      <div className="h-full bg-slate-700" style={{ width: `${stats.after.timeBreakdown.idle}%` }} />
                    </div>
                    <Legend items={[
                      { label: "실배송주행", color: "bg-emerald-500", percent: Math.round(stats.after.timeBreakdown.delivery) },
                      { label: "공차이동", color: "bg-amber-500", percent: Math.round(stats.after.timeBreakdown.deadhead) },
                      { label: "대기/탐색", color: "bg-slate-600", percent: Math.round(stats.after.timeBreakdown.idle) }
                    ]} />
                  </div>
                </div>
              </div>

              {/* 3. Detailed Statistics Comparison */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Traditional Stats */}
                <div className="bg-slate-950/50 rounded-3xl p-8 border border-white/5 space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400">
                      <Truck size={20} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-300">Traditional Market (Before)</h3>
                  </div>
                  <div className="space-y-4">
                    <StatRow label="일일 주행 거리" value={`${stats.before.totalDistance.toFixed(1)}km`} sub="공차 주행 포함" color="slate" />
                    <StatRow label="일일 매출" value={`${Math.round(stats.before.totalRevenue).toLocaleString()}원`} sub="2.5건 수행 기준" color="slate" />
                    <StatRow label="연료비 지출" value={`${Math.round(stats.before.fuelCost).toLocaleString()}원`} sub="불필요한 이동에 따른 낭비" color="slate" />
                    <StatRow label="일일 순이익" value={`${Math.round(stats.before.netProfit).toLocaleString()}원`} sub="실수령액 추정" color="slate" bold />
                  </div>
                </div>

                {/* TukTak Stats */}
                <div className="bg-emerald-500/5 rounded-3xl p-8 border border-emerald-500/20 space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                      <TrendingUp size={20} />
                    </div>
                    <h3 className="text-xl font-bold text-emerald-400">TukTak Optimized (After)</h3>
                  </div>
                  <div className="space-y-4">
                    <StatRow label="일일 주행 거리" value={`${stats.after.totalDistance.toFixed(1)}km`} sub="공차 주행 75% 감소" color="emerald" />
                    <StatRow label="일일 매출" value={`${Math.round(stats.after.totalRevenue).toLocaleString()}원`} sub="4.5건 합짐 수행 기준" color="emerald" />
                    <StatRow label="연료비 지출" value={`${Math.round(stats.after.fuelCost).toLocaleString()}원`} sub="고효율 주행으로 비용 절감" color="emerald" />
                    <StatRow label="일일 순이익" value={`${Math.round(stats.after.netProfit).toLocaleString()}원`} sub="단가는 낮아도 총 수익 증대" color="emerald" bold />
                  </div>
                </div>
              </div>

              {/* 4. Footer Insights */}
              <footer className="p-8 bg-indigo-500/10 rounded-3xl border border-indigo-500/20 flex items-start gap-6">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                  <Info size={24} />
                </div>
                <div className="space-y-2">
                  <h4 className="text-white font-bold">기사님, 기다리는 시간을 수익으로 바꾸세요.</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    분석 결과에 따르면, 기존 방식에서 기사는 하루 중 약 <span className="text-white font-bold">{Math.round(stats.before.timeBreakdown.idle)}%</span>를 콜 탐색과 대기에 허비합니다. 
                    반면 TukTak 합짐 시스템은 대기 시간을 없애고 실주행 시간을 수익 활동으로 채워줌으로써, 
                    <span className="text-emerald-400 font-black mx-1">월 평균 {(stats.after.monthlyProjection - stats.before.monthlyProjection).toLocaleString()}원</span> 이상의 가치를 더해드립니다.
                  </p>
                </div>
              </footer>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Legend({ items }: { items: { label: string, color: string, percent: number }[] }) {
  return (
    <div className="flex gap-4 px-1">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${item.color}`} />
          <span className="text-[10px] font-bold text-slate-500">{item.label} ({item.percent}%)</span>
        </div>
      ))}
    </div>
  );
}

function StatRow({ label, value, sub, color, bold = false }: any) {
  const colorClass = color === "emerald" ? "text-emerald-400" : "text-slate-400";
  return (
    <div className="flex items-center justify-between border-b border-white/5 pb-4">
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter">{label}</p>
        <p className="text-[10px] text-slate-600">{sub}</p>
      </div>
      <div className="text-right">
        <p className={`text-lg font-black ${bold ? (color === "emerald" ? "text-emerald-400" : "text-white") : colorClass}`}>{value}</p>
      </div>
    </div>
  );
}
