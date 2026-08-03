import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TOOL_CATEGORIES } from '../constants';
import type { ToolCategory } from '../types';
import { OrbitSystem } from '../components/intelligence/OrbitSystem';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { Compass, Sparkles } from 'lucide-react';

export const ToolExplorer: React.FC = () => {
  const { tools, setActiveCategory } = useApp();
  const [selectedPlanet, setSelectedPlanet] = useState<ToolCategory | 'All'>('All');

  const handlePlanetClick = (cat: ToolCategory | 'All') => {
    setSelectedPlanet(cat);
    setActiveCategory(cat);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-[#00ff99]/20 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-mono font-bold text-white uppercase flex items-center gap-3">
            <Compass className="text-[#00ff99]" size={32} />
            TOOL EXPLORER <span className="neon-text-emerald">// ORBITAL SYSTEM</span>
          </h1>
          <p className="text-slate-400 font-mono text-xs sm:text-sm mt-1">
            Navigate OSINT category planets and launch orbiting tool inspection drawers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="emerald">{tools.length} TOOLS AVAILABLE</Badge>
          <Badge variant="cyan">8 ORBIT RINGS</Badge>
        </div>
      </div>

      {/* Floating Planet Categories Selector Bar */}
      <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-thin">
        <button
          onClick={() => handlePlanetClick('All')}
          className={`shrink-0 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all border cursor-pointer ${
            selectedPlanet === 'All'
              ? 'bg-[#00ff99]/25 border-[#00ff99] text-[#00ff99] shadow-[0_0_20px_rgba(0,255,153,0.4)]'
              : 'bg-black/60 border-white/10 text-slate-300 hover:border-[#00ff99]/40 hover:text-white'
          }`}
        >
          🌌 ALL CATEGORIES
        </button>

        {TOOL_CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => handlePlanetClick(cat)}
            className={`shrink-0 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all border flex items-center gap-2 cursor-pointer ${
              selectedPlanet === cat
                ? 'bg-[#00ff99]/25 border-[#00ff99] text-[#00ff99] shadow-[0_0_20px_rgba(0,255,153,0.4)]'
                : 'bg-black/60 border-white/10 text-slate-300 hover:border-[#00ff99]/40 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#7efeff]" />
            {cat}
          </button>
        ))}
      </div>

      {/* Interactive Orbital System Display */}
      <GlassCard glow="emerald" className="p-6 relative min-h-[560px] overflow-hidden">
        <div className="absolute top-4 left-6 z-10 font-mono text-xs text-[#00ff99] flex items-center gap-2">
          <Sparkles size={14} />
          <span>ACTIVE RING: {selectedPlanet.toUpperCase()}</span>
        </div>

        <OrbitSystem tools={tools} categoryFilter={selectedPlanet} />
      </GlassCard>
    </div>
  );
};
