import React from 'react';
import { Shield, Activity, Lock, Cpu, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-[#00ff99]/20 bg-[#030303]/80 backdrop-blur-xl py-8 px-6 text-slate-400 font-mono text-xs z-10 relative">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#00ff99]/10 text-[#00ff99] border border-[#00ff99]/30">
            <Shield size={18} />
          </div>
          <div>
            <div className="font-bold text-white tracking-widest text-sm">FORENX AI LEARNOSINT</div>
            <div className="text-[10px] text-slate-500">NEXT-GEN CYBER INTELLIGENCE COMMAND CENTER v4.8.2</div>
          </div>
        </div>

        {/* Live System Status Indicators */}
        <div className="flex flex-wrap items-center gap-6 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00ff99] animate-ping" />
            <span className="text-[#00ff99]">CORE SYSTEM: ONLINE</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity size={14} className="text-[#7efeff]" />
            <span>LATENCY: 14ms</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock size={14} className="text-emerald-400" />
            <span>ENCRYPTION: AES-256 GCM</span>
          </div>
        </div>

        <div className="text-[10px] text-slate-500 text-center md:text-right">
          © 2026 FORENX AI OSINT ARCHITECTURE. ALL RIGHTS RESERVED.
        </div>
      </div>
    </footer>
  );
};
