import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Terminal,
  BookOpen,
  FlaskConical,
} from 'lucide-react';

import { GlassCard } from '../ui/GlassCard';
import { Badge } from '../ui/Badge';

interface ToolOrbitSystemProps {
  tools: any[];
  categoryFilter?: string;
  onToolSelect?: (tool: any) => void;
}

export const ToolOrbitSystem: React.FC<ToolOrbitSystemProps> = ({
  tools,
  categoryFilter = 'All',
  onToolSelect,
}) => {
  const navigate = useNavigate();

  const [rotationAngle, setRotationAngle] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  /* ============================================================
     ORBIT ROTATION
  ============================================================ */

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setRotationAngle(
        previous => (previous + 0.18) % 360
      );
    }, 40);

    return () => clearInterval(interval);
  }, [isPaused]);

  /* ============================================================
     CATEGORY FILTER
  ============================================================ */

  const filteredTools = useMemo(() => {
    if (!tools || tools.length === 0) {
      return [];
    }

    if (
      !categoryFilter ||
      categoryFilter.toLowerCase() === 'all'
    ) {
      return tools;
    }

    return tools.filter(
      (tool: any) =>
        tool.category?.toLowerCase() ===
        categoryFilter.toLowerCase()
    );
  }, [tools, categoryFilter]);

  /* ============================================================
     COMMAND EXTRACTION
  ============================================================ */

  const getCommand = (tool: any): string => {
    const command = tool?.command;

    if (
      typeof command === 'string' &&
      command.trim()
    ) {
      return command.trim();
    }

    if (
      Array.isArray(command) &&
      command.length > 0
    ) {
      const first = command[0];

      if (typeof first === 'string') {
        return first;
      }

      if (
        typeof first === 'object' &&
        first !== null
      ) {
        return String(
          first.example ||
          first.command ||
          first.usage ||
          Object.values(first)[0] ||
          `Use ${tool.name || 'this tool'}`
        );
      }
    }

    if (
      typeof command === 'object' &&
      command !== null
    ) {
      return String(
        command.example ||
        command.command ||
        command.usage ||
        command.syntax ||
        Object.values(command)[0] ||
        `Use ${tool.name || 'this tool'}`
      );
    }

    if (
      Array.isArray(tool?.commands) &&
      tool.commands.length > 0
    ) {
      const first = tool.commands[0];

      if (typeof first === 'string') {
        return first;
      }

      if (
        typeof first === 'object' &&
        first !== null
      ) {
        return String(
          first.example ||
          first.command ||
          first.usage ||
          Object.values(first)[0] ||
          `Use ${tool.name || 'this tool'}`
        );
      }
    }

    if (
      typeof tool?.commands === 'string' &&
      tool.commands.trim()
    ) {
      return tool.commands.trim();
    }

    if (
      typeof tool?.commandExample === 'string' &&
      tool.commandExample.trim()
    ) {
      return tool.commandExample.trim();
    }

    if (
      typeof tool?.usage === 'string' &&
      tool.usage.trim()
    ) {
      return tool.usage.trim();
    }

    return `Use ${tool.name || 'this tool'} for OSINT investigation`;
  };

  /* ============================================================
     ACTIONS
  ============================================================ */

  const handleExplore = (tool: any) => {
    onToolSelect?.(tool);
  };

  const handlePractice = (tool: any) => {
    onToolSelect?.(tool);

    navigate(
      `/practice-labs?tool=${encodeURIComponent(
        tool.name || ''
      )}`
    );
  };

  /* ============================================================
     EMPTY STATE
  ============================================================ */

  if (filteredTools.length === 0) {
    return (
      <div className="relative w-full min-h-[500px] flex items-center justify-center">

        <GlassCard
          glow="emerald"
          className="p-10 text-center max-w-md"
        >
          <Terminal
            size={40}
            className="mx-auto text-[#00ff99] mb-4"
          />

          <h3 className="font-mono font-bold text-white">
            NO TOOLS IN THIS ORBIT
          </h3>

          <p className="text-xs font-mono text-slate-500 mt-2">
            Select another OSINT category to view
            available investigation tools.
          </p>
        </GlassCard>

      </div>
    );
  }

  /* ============================================================
     MAXIMUM VISIBLE TOOLS
  ============================================================ */

  const visibleTools = filteredTools.slice(0, 10);

  const total = visibleTools.length;

  /* ============================================================
     TOOL ORBIT
  ============================================================ */

  return (
    <div
      className="
        relative
        w-full
        min-h-[540px]
        flex
        items-center
        justify-center
        overflow-hidden
        py-6
      "
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >

      {/* ======================================================
          ORBITAL RINGS
      ======================================================= */}

      <div
        className="
          absolute
          w-[280px]
          h-[280px]
          rounded-full
          border
          border-[#00ff99]/20
          pointer-events-none
        "
      />

      <div
        className="
          absolute
          w-[460px]
          h-[460px]
          rounded-full
          border
          border-[#7efeff]/15
          pointer-events-none
        "
      />

      <div
        className="
          absolute
          w-[640px]
          h-[640px]
          rounded-full
          border
          border-[#00ff99]/10
          pointer-events-none
        "
      />

      {/* ======================================================
          CENTRAL TOOL CORE
      ======================================================= */}

      <div
        className="
          absolute
          w-[140px]
          h-[140px]
          rounded-full
          border
          border-[#00ff99]/30
          bg-[#00ff99]/5
          flex
          items-center
          justify-center
          shadow-[0_0_50px_rgba(0,255,153,0.12)]
          z-10
        "
      >

        <div
          className="
            w-[96px]
            h-[96px]
            rounded-full
            border
            border-[#00ff99]/40
            bg-black/75
            flex
            flex-col
            items-center
            justify-center
          "
        >

          <Terminal
            size={25}
            className="text-[#00ff99] mb-2"
          />

          <span className="text-[10px] font-mono font-bold text-[#00ff99]">
            TOOL CORE
          </span>

          <span className="text-[8px] font-mono text-slate-500 mt-1">
            {filteredTools.length} TOOLS
          </span>

        </div>

      </div>

      {/* ======================================================
          ORBIT CONTAINER
      ======================================================= */}

      <div
        className="
          relative
          w-full
          max-w-6xl
          h-[500px]
          flex
          items-center
          justify-center
        "
      >

        {visibleTools.map(
          (tool: any, index: number) => {

            const baseAngle =
              (360 / total) * index;

            const currentAngle =
              (baseAngle + rotationAngle) *
              (Math.PI / 180);

            /*
             * Horizontal orbit.
             *
             * Vertical radius is deliberately smaller
             * because cards are now taller.
             */

            const radiusX = 345;
            const radiusY = 125;

            const x =
              Math.cos(currentAngle) * radiusX;

            const y =
              Math.sin(currentAngle) * radiusY;

            /* ==================================================
               DEPTH / SCALE
            ================================================== */

            const depth =
              (y / radiusY + 1) / 2;

            const scale =
              0.84 + depth * 0.16;

            const zIndex =
            100 + Math.round(depth * 100);

            const command =
              getCommand(tool);

            return (
                <div
                key={
                    tool.id ||
                    tool._id ||
                    `${tool.name}-${index}`
                }
                className="
                    absolute
                    pointer-events-none
                    transition-transform
                    duration-300
                    ease-out
                "
                style={{
                  transform:
                    `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
                  zIndex,
                }}
              >

                {/* ==================================================
                    LANDSCAPE TOOL CARD
                =================================================== */}

                <GlassCard
                glow="emerald"
                className="
                    group
                    pointer-events-auto
                    w-[300px]
                    h-[210px]
                    p-4
                    flex
                    flex-col
                    border-[#00ff99]/20
                    hover:border-[#00ff99]
                    hover:shadow-[0_0_30px_rgba(0,255,153,0.25)]
                    transition-all
                  "
                >

                  {/* ==================================================
                      HEADER
                  =================================================== */}

                  <div className="flex items-start gap-3">

                    <div
                      className="
                        shrink-0
                        p-2
                        rounded-xl
                        bg-[#00ff99]/10
                        border
                        border-[#00ff99]/30
                        text-[#00ff99]
                        group-hover:bg-[#00ff99]/20
                        group-hover:shadow-[0_0_18px_rgba(0,255,153,0.45)]
                        transition-all
                      "
                    >
                      <Terminal size={18} />
                    </div>

                    <div className="min-w-0 flex-1">

                      <div className="flex items-center justify-between gap-2">

                        <h3
                          className="
                            text-sm
                            font-mono
                            font-black
                            text-white
                            uppercase
                            truncate
                            group-hover:text-[#00ff99]
                            transition-colors
                          "
                          title={tool.name}
                        >
                          {tool.name}
                        </h3>

                        <span
                          className="
                            shrink-0
                            text-[7px]
                            font-mono
                            font-bold
                            text-[#7efeff]
                            border
                            border-[#7efeff]/20
                            bg-[#7efeff]/5
                            rounded-md
                            px-1.5
                            py-1
                          "
                        >
                          TOOL
                        </span>

                      </div>

                      <div className="mt-1">

                        <Badge
                          variant="emerald"
                          size="sm"
                        >
                          {tool.category || 'OSINT'}
                        </Badge>

                      </div>

                    </div>

                  </div>


                  {/* ==================================================
                      DESCRIPTION
                  =================================================== */}

                  <p
                    className="
                      text-[8px]
                      text-slate-400
                      font-mono
                      leading-relaxed
                      mt-2
                      line-clamp-2
                      min-h-[24px]
                    "
                  >
                    {tool.description ||
                      'OSINT investigation and intelligence analysis tool.'}
                  </p>


                  {/* ==================================================
                      COMMAND
                  =================================================== */}

                  <div
                    className="
                      mt-2
                      rounded-lg
                      border
                      border-[#00ff99]/15
                      bg-black/60
                      px-3
                      py-2
                    "
                  >

                    <div
                      className="
                        flex
                        items-center
                        gap-1
                        text-[7px]
                        font-mono
                        font-bold
                        text-slate-500
                        mb-1
                      "
                    >
                      <Terminal size={8} />
                      COMMAND
                    </div>

                    <code
                      className="
                        block
                        text-[8px]
                        leading-relaxed
                        text-[#00ff99]
                        font-mono
                        whitespace-nowrap
                        overflow-hidden
                        text-ellipsis
                      "
                      title={String(command)}
                    >
                      {String(command)}
                    </code>

                  </div>


                  {/* ==================================================
                      ACTION BUTTONS
                  =================================================== */}

                  <div
                    className="
                      flex
                      gap-2
                      mt-auto
                      pt-3
                    "
                  >

                    <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleExplore(tool);
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                      className="
                        flex-1
                        flex
                        items-center
                        justify-center
                        gap-1
                        rounded-lg
                        border
                        border-white/10
                        bg-black/40
                        py-2
                        text-[8px]
                        font-mono
                        font-bold
                        text-slate-300
                        hover:border-[#00ff99]/50
                        hover:text-[#00ff99]
                        transition-all
                      "
                    >
                      <BookOpen size={10} />
                      EXPLORE
                    </button>


                    <button
                      onClick={() =>
                        handlePractice(tool)
                      }
                      className="
                        flex-1
                        flex
                        items-center
                        justify-center
                        gap-1
                        rounded-lg
                        border
                        border-[#00ff99]/30
                        bg-[#00ff99]/10
                        py-2
                        text-[8px]
                        font-mono
                        font-bold
                        text-[#00ff99]
                        hover:bg-[#00ff99]/20
                        hover:border-[#00ff99]
                        transition-all
                      "
                    >
                      <FlaskConical size={10} />
                      PRACTICE
                    </button>

                  </div>

                </GlassCard>

              </div>
            );
          }
        )}

      </div>


      {/* ======================================================
          MORE TOOLS
      ======================================================= */}

      {filteredTools.length > 10 && (
        <div
          className="
            absolute
            bottom-2
            left-1/2
            -translate-x-1/2
            px-3
            py-1.5
            rounded-lg
            border
            border-[#00ff99]/20
            bg-black/70
            text-[8px]
            font-mono
            text-slate-500
          "
        >
          DISPLAYING 10 OF {filteredTools.length} TOOLS
        </div>
      )}

    </div>
  );
};

export default ToolOrbitSystem;