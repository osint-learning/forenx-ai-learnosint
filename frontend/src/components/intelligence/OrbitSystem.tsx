import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../ui/GlassCard';
import { Badge } from '../ui/Badge';
import {
  BookOpen,
  Compass,
  Radar,
  Terminal,
  Search,
  FileText,
  ArrowRight
} from 'lucide-react';

interface OrbitSystemProps {
  tools?: any[];
  categoryFilter?: any;
}

interface OrbitModule {
  id: string;
  name: string;
  category: string;
  description: string;
  path: string;
  icon: React.ReactNode;
}

const orbitModules: OrbitModule[] = [
  {
    id: 'learn',
    name: 'Learn',
    category: 'ACADEMY',
    description: 'Learn OSINT concepts, techniques and investigation methods.',
    path: '/learn',
    icon: <BookOpen size={24} />
  },
  {
    id: 'tool-explorer',
    name: 'Tool Explorer',
    category: 'TOOLS',
    description: 'Explore OSINT tools, commands, guides and practical usage.',
    path: '/tool-explorer',
    icon: <Compass size={24} />
  },
  {
    id: 'recon',
    name: 'Recon Engine',
    category: 'RECON',
    description: 'Perform automated reconnaissance and analyze target intelligence.',
    path: '/recon',
    icon: <Radar size={24} />
  },
  {
    id: 'terminal',
    name: 'Terminal',
    category: 'COMMAND',
    description: 'Practice supported OSINT commands in the independent terminal.',
    path: '/terminal',
    icon: <Terminal size={24} />
  },
  {
    id: 'investigations',
    name: 'Investigations',
    category: 'CASES',
    description: 'Conduct investigations, collect evidence and correlate findings.',
    path: '/investigations',
    icon: <Search size={24} />
  },
  {
    id: 'reports',
    name: 'Reports',
    category: 'INTELLIGENCE',
    description: 'Review and generate structured intelligence investigation reports.',
    path: '/reports',
    icon: <FileText size={24} />
  }
];

export const OrbitSystem: React.FC<OrbitSystemProps> = () => {
  const navigate = useNavigate();

  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [focusedCardId, setFocusedCardId] = useState<string | null>(null);

  const activeCardId = hoveredCardId || focusedCardId;

  // --------------------------------------------------
  // CONTINUOUS ORBITAL ROTATION (PAUSED WHEN ACTIVE)
  // --------------------------------------------------
  useEffect(() => {
    if (isPaused || activeCardId) {
      return;
    }

    const interval = setInterval(() => {
      setRotationAngle(previous => (previous + 0.2) % 360);
    }, 40);

    return () => clearInterval(interval);
  }, [isPaused, activeCardId]);

  return (
    <div
      className="relative w-full min-h-[520px] flex items-center justify-center overflow-hidden py-10"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        setIsPaused(false);
        setHoveredCardId(null);
      }}
    >
      {/* ==================================================
          ORBITAL RINGS
      ================================================== */}
      <div
        className="absolute w-[360px] h-[360px] rounded-full border border-[#00ff99]/15 pointer-events-none animate-pulse"
      />
      <div
        className="absolute w-[560px] h-[560px] rounded-full border border-[#7efeff]/10 pointer-events-none"
      />
      <div
        className="absolute w-[760px] h-[760px] rounded-full border border-[#17ff88]/10 pointer-events-none"
      />

      {/* ==================================================
          ORBITING PLATFORM MODULES
      ================================================== */}
      <div className="relative w-full max-w-5xl h-[480px] flex items-center justify-center">
        {orbitModules.map((module, index) => {
          const total = orbitModules.length;
          const baseAngle = (360 / total) * index;
          const currentAngle = (baseAngle + rotationAngle) * (Math.PI / 180);

          // Orbital perspective
          const radiusX = 320;
          const radiusY = 160;

          const x = Math.cos(currentAngle) * radiusX;
          const y = Math.sin(currentAngle) * radiusY;

          // Depth scaling
          const depth = (y / radiusY + 1) / 2; // normalized 0 to 1
          const baseScale = 0.86 + depth * 0.14;
          const baseZIndex = 50 + Math.round(depth * 100);

          const isCardActive = activeCardId === module.id;

          // Pop forward elevation: active card gets high z-index and subtle scale
          const cardScale = isCardActive ? Math.min(baseScale * 1.10, 1.14) : baseScale;
          const cardZIndex = isCardActive ? 9999 : baseZIndex;

          return (
            <div
              key={module.id}
              className="absolute transition-transform duration-300 ease-out outline-none"
              style={{
                transform: `translate3d(${x}px, ${y}px, 0) scale(${cardScale})`,
                zIndex: cardZIndex,
                pointerEvents: 'auto'
              }}
              onMouseEnter={() => setHoveredCardId(module.id)}
              onMouseLeave={() => {
                setHoveredCardId(prev => (prev === module.id ? null : prev));
              }}
              onFocus={() => setFocusedCardId(module.id)}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                  setFocusedCardId(prev => (prev === module.id ? null : prev));
                }
              }}
              tabIndex={0}
              aria-label={`OSINT Module: ${module.name}`}
            >
              <GlassCard
                glow="emerald"
                className={`
                  w-52 p-4 flex flex-col items-center text-center space-y-2.5 cursor-pointer transition-all
                  ${
                    isCardActive
                      ? 'border-[#00ff99] shadow-[0_0_35px_rgba(0,255,153,0.45)] bg-black/95 scale-100'
                      : 'border-[#00ff99]/20 hover:border-[#00ff99] hover:shadow-[0_0_25px_rgba(0,255,153,0.25)]'
                  }
                `}
                onClick={() => navigate(module.path)}
              >
                {/* ICON */}
                <div
                  className={`
                    p-3 rounded-xl border transition-all
                    ${
                      isCardActive
                        ? 'bg-[#00ff99]/25 text-[#00ff99] border-[#00ff99] shadow-[0_0_18px_rgba(0,255,153,0.55)]'
                        : 'bg-[#00ff99]/10 text-[#00ff99] border-[#00ff99]/30'
                    }
                  `}
                >
                  {module.icon}
                </div>

                {/* MODULE NAME */}
                <h3
                  className={`
                    font-mono font-bold text-sm tracking-wide transition-colors
                    ${isCardActive ? 'text-[#00ff99]' : 'text-white'}
                  `}
                >
                  {module.name}
                </h3>

                {/* CATEGORY */}
                <Badge
                  variant="emerald"
                  size="sm"
                >
                  {module.category}
                </Badge>

                {/* DESCRIPTION */}
                <p
                  className="text-[10px] text-slate-300 font-mono leading-relaxed line-clamp-3 min-h-[36px]"
                >
                  {module.description}
                </p>

                {/* EXPLORE / ACTION BUTTON */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(module.path);
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  className={`
                    w-full mt-1 py-1.5 px-3 rounded-lg border font-mono text-[9px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer
                    ${
                      isCardActive
                        ? 'bg-[#00ff99] text-black border-[#00ff99] shadow-[0_0_15px_rgba(0,255,153,0.5)]'
                        : 'bg-[#00ff99]/10 text-[#00ff99] border-[#00ff99]/30 hover:bg-[#00ff99]/20 hover:border-[#00ff99]'
                    }
                  `}
                >
                  <span>LAUNCH</span>
                  <ArrowRight size={10} />
                </button>
              </GlassCard>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrbitSystem;
