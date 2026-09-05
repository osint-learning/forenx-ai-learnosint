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
  FileText
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

  const [rotationAngle, setRotationAngle] =
    useState<number>(0);

  const [isPaused, setIsPaused] =
    useState<boolean>(false);


  // --------------------------------------------------
  // CONTINUOUS ORBITAL ROTATION
  // --------------------------------------------------

  useEffect(() => {

    if (isPaused) {
      return;
    }

    const interval = setInterval(() => {

      setRotationAngle(
        previous =>
          (previous + 0.2) % 360
      );

    }, 40);

    return () => clearInterval(interval);

  }, [isPaused]);


  return (

    <div
      className="relative w-full min-h-[520px] flex items-center justify-center overflow-hidden py-10"

      onMouseEnter={() =>
        setIsPaused(true)
      }

      onMouseLeave={() =>
        setIsPaused(false)
      }
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

        {orbitModules.map(
          (module, index) => {

            const total =
              orbitModules.length;

            const baseAngle =
              (360 / total) * index;

            const currentAngle =
              (baseAngle + rotationAngle) *
              (Math.PI / 180);

            // Existing orbital perspective
            const radiusX = 320;
            const radiusY = 160;

            const x =
              Math.cos(currentAngle) *
              radiusX;

            const y =
              Math.sin(currentAngle) *
              radiusY;

            // Depth scaling
            const scale =
              0.85 +
              ((y / radiusY + 1) * 0.15);

            const zIndex =
              Math.round(
                (y + radiusY) * 10
              );


            return (

              <div
                key={module.id}

                onClick={() =>
                  navigate(module.path)
                }

                className="absolute transition-transform duration-300 ease-out cursor-pointer group"

                style={{
                  transform:
                    `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
                  zIndex
                }}
              >

                <GlassCard
                  glow="emerald"
                  className="w-48 p-4 flex flex-col items-center text-center space-y-2 group-hover:scale-105 group-hover:border-[#00ff99] transition-all"
                >

                  {/* ICON */}

                  <div
                    className="p-3 rounded-xl bg-[#00ff99]/10 text-[#00ff99] border border-[#00ff99]/30 group-hover:bg-[#00ff99]/20 group-hover:shadow-[0_0_15px_rgba(0,255,153,0.5)] transition-all"
                  >

                    {module.icon}

                  </div>


                  {/* MODULE NAME */}

                  <h3
                    className="font-mono font-bold text-white text-sm tracking-wide group-hover:text-[#00ff99] transition-colors"
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
                    className="text-[10px] text-slate-400 font-mono leading-relaxed line-clamp-3"
                  >
                    {module.description}
                  </p>

                </GlassCard>

              </div>

            );

          }
        )}

      </div>

    </div>

  );
};