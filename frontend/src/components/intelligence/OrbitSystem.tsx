import React, { useState, useEffect } from 'react';
import type { OsintTool, ToolCategory } from '../../types';
import { GlassCard } from '../ui/GlassCard';
import { DynamicIcon } from '../../utils/iconHelper';
import { Badge } from '../ui/Badge';
import { useApp } from '../../context/AppContext';
import { ToolDetailDrawer } from './ToolDetailDrawer';
import { OsintService } from '../../services/api';
interface OrbitSystemProps {
  tools: OsintTool[];
  categoryFilter?: ToolCategory | 'All';
}

export const OrbitSystem: React.FC<OrbitSystemProps> = ({ tools, categoryFilter = 'All' }) => {
  const { selectedTool, setSelectedTool } = useApp();
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const filteredTools = categoryFilter === 'All'
    ? tools
    : tools.filter(t => t.category === categoryFilter);

  // Slow continuous orbital rotation
  useEffect(() => {
    if (isPaused || selectedTool) return;
    const interval = setInterval(() => {
      setRotationAngle(prev => (prev + 0.2) % 360);
    }, 40);
    return () => clearInterval(interval);
  }, [isPaused, selectedTool]);

  return (
    <div
      className="relative w-full min-h-[520px] flex items-center justify-center overflow-hidden py-10"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Visual Orbital Ring Tracks */}
      <div className="absolute w-[360px] h-[360px] rounded-full border border-[#00ff99]/15 pointer-events-none animate-pulse" />
      <div className="absolute w-[560px] h-[560px] rounded-full border border-[#7efeff]/10 pointer-events-none" />
      <div className="absolute w-[760px] h-[760px] rounded-full border border-[#17ff88]/10 pointer-events-none" />

      {/* Orbiting Tool Cards */}
      <div className="relative w-full max-w-5xl h-[480px] flex items-center justify-center">
        {filteredTools.map((tool, index) => {
          const total = filteredTools.length;
          const baseAngle = (360 / total) * index;
          const currentAngle = (baseAngle + rotationAngle) * (Math.PI / 180);
          const radiusX = 320; // horizontal orbital radius
          const radiusY = 160; // vertical orbital perspective radius

          const x = Math.cos(currentAngle) * radiusX;
          const y = Math.sin(currentAngle) * radiusY;
          const scale = 0.85 + (y / radiusY + 1) * 0.15; // depth scaling
          const zIndex = Math.round((y + radiusY) * 10);

          const isSelected = selectedTool?.id === tool.id;

          return (
            <div
              key={tool.id}
              onClick={async () => {
                try {
                  const fullTool = await OsintService.getToolById(tool.id);

                  if (fullTool) {
                    setSelectedTool(fullTool);
                  }
                } catch (error) {
                  console.error(error);
                }
              }}
              className="absolute transition-transform duration-300 ease-out cursor-pointer group"
              style={{
                transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
                zIndex: isSelected ? 20 : zIndex
              }}
            >
              <GlassCard
                glow="emerald"
                active={isSelected}
                className="w-48 p-4 flex flex-col items-center text-center space-y-2 group-hover:scale-105 group-hover:border-[#00ff99] transition-all"
              >
                <div className="p-3 rounded-xl bg-[#00ff99]/10 text-[#00ff99] border border-[#00ff99]/30 group-hover:bg-[#00ff99]/20 group-hover:shadow-[0_0_15px_rgba(0,255,153,0.5)] transition-all">
                  <DynamicIcon name={tool.icon} size={24} />
                </div>
                <h3 className="font-mono font-bold text-white text-sm tracking-wide group-hover:text-[#00ff99] transition-colors">
                  {tool.name}
                </h3>
                <Badge variant="emerald" size="sm">
                  {tool.category.split(' ')[0]}
                </Badge>
              </GlassCard>
            </div>
          );
        })}
      </div>

      {/* Side Panel Tool Details Drawer */}
      <ToolDetailDrawer tool={selectedTool} onClose={() => setSelectedTool(null)} />
    </div>
  );
};
