"use client";

import { useSimulatorStore } from "../store/use-simulator-store";
import { generateMockOrders } from "../../../lib/data/mock-generator";
import { runBasicBundling } from "../../../lib/engine/bundler";

/**
 * 시뮬레이션 제어 패널 (4.3.1.1)
 */
export default function ControlPanel() {
  const { status, setStatus, setOrders, reset } = useSimulatorStore();

  const handleStart = async () => {
    setStatus("LOADING");
    
    // 1. Mock 데이터 생성
    const orders = generateMockOrders(100);
    setOrders(orders);
    
    setStatus("SIMULATING");
    
    // 2. 임시 딜레이 (애니메이션 효과)
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // 3. 알고리즘 실행 (실제로는 여기서 3단계의 엔진 호출)
    // 현재는 상태 업데이트만 시뮬레이션
    setStatus("DONE");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <button
          onClick={handleStart}
          disabled={status === "LOADING" || status === "SIMULATING"}
          className={`w-full py-4 rounded-xl font-black text-sm transition-all ${
            status === "IDLE" || status === "DONE"
              ? "bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20"
              : "bg-slate-800 text-slate-500 cursor-not-allowed"
          }`}
        >
          {status === "IDLE" ? "시뮬레이션 시작" : 
           status === "DONE" ? "다시 시뮬레이션" : "분석 중..."}
        </button>
        
        <button
          onClick={reset}
          className="w-full py-3 rounded-xl font-bold text-xs text-slate-400 hover:text-white hover:bg-white/5 transition-all"
        >
          초기화
        </button>
      </div>

      <div className="flex items-center gap-3 px-4 py-3 bg-slate-900/60 rounded-xl border border-slate-800/30">
        <div className={`w-2 h-2 rounded-full animate-pulse ${
          status === "DONE" ? "bg-emerald-500" : 
          status === "IDLE" ? "bg-slate-600" : "bg-amber-400"
        }`} />
        <span className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">
          Status: {status}
        </span>
      </div>
    </div>
  );
}
