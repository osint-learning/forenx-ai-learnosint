import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TOOL_CATEGORIES } from '../constants';
import type { ToolCategory } from '../types';

import { ToolDetailDrawer } from '../components/intelligence/ToolDetailDrawer';
import { ToolOrbitSystem } from '../components/intelligence/ToolOrbitSystem';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';

import {
  Compass,
  Sparkles,
} from 'lucide-react';

export const ToolExplorer: React.FC = () => {
  const {
    tools,
    setActiveCategory,
    setSelectedTool,
  } = useApp();

  const [selectedPlanet, setSelectedPlanet] =
    useState<ToolCategory | 'All'>('All');

  const [inspectedTool, setInspectedTool] =
    useState<any | null>(null);

  /*
   * ============================================================
   * CATEGORY SELECTION
   * ============================================================
   */

  const handlePlanetClick = (
    category: ToolCategory | 'All'
  ) => {
    setSelectedPlanet(category);
    setActiveCategory(category);
  };

  /*
   * ============================================================
   * OPEN ORIGINAL TOOL DETAIL DRAWER
   * ============================================================
   */

  const handleToolSelect = (tool: any) => {
    setSelectedTool(tool);
    setInspectedTool(tool);
  };

  /*
   * ============================================================
   * CLOSE TOOL DETAIL DRAWER
   * ============================================================
   */

  const closeToolDrawer = () => {
    setInspectedTool(null);
    setSelectedTool(null);
  };

  return (
    <div className="space-y-8">

      {/* ======================================================
          HEADER
      ======================================================= */}

      <div
        className="
          border-b
          border-[#00ff99]/20
          pb-6
          flex
          flex-col
          md:flex-row
          md:items-center
          md:justify-between
          gap-4
        "
      >

        <div>

          <div
            className="
              inline-flex
              items-center
              gap-2
              px-3
              py-1.5
              rounded-full
              border
              border-[#00ff99]/30
              bg-[#00ff99]/5
              text-[#00ff99]
              text-[10px]
              font-mono
              font-bold
              mb-3
            "
          >
            <Compass size={13} />

            OSINT TOOL INTELLIGENCE DATABASE
          </div>

          <h1
            className="
              text-3xl
              font-mono
              font-bold
              text-white
              uppercase
              flex
              items-center
              gap-3
            "
          >
            TOOL

            <span className="text-[#00ff99]">
              EXPLORER
            </span>

            <span className="text-[#00ff99]/60">
              // ORBITAL SYSTEM
            </span>
          </h1>

          <p
            className="
              text-slate-400
              font-mono
              text-xs
              sm:text-sm
              mt-2
            "
          >
            Navigate OSINT category planets and explore
            tools, commands, lessons and knowledge checks.
          </p>

        </div>

        <div className="flex items-center gap-2">

          <Badge variant="emerald">
            {tools.length} TOOLS AVAILABLE
          </Badge>

          <Badge variant="cyan">
            ORBITAL SYSTEM
          </Badge>

        </div>

      </div>


      {/* ======================================================
          CATEGORY BAR
      ======================================================= */}

      <div
        className="
          flex
          items-center
          gap-3
          overflow-x-auto
          pb-4
          scrollbar-thin
        "
      >

        {/* ALL CATEGORIES */}

        <button
          type="button"
          onClick={() =>
            handlePlanetClick('All')
          }
          className={`
            shrink-0
            px-4
            py-2
            rounded-xl
            text-xs
            font-mono
            font-bold
            transition-all
            border
            cursor-pointer
            ${
              selectedPlanet === 'All'
                ? 'bg-[#00ff99]/25 border-[#00ff99] text-[#00ff99] shadow-[0_0_20px_rgba(0,255,153,0.4)]'
                : 'bg-black/60 border-white/10 text-slate-300 hover:border-[#00ff99]/40 hover:text-white'
            }
          `}
        >
          🌌 ALL CATEGORIES
        </button>


        {/* CATEGORY BUTTONS */}

        {TOOL_CATEGORIES.map((category) => (

          <button
            type="button"
            key={category}
            onClick={() =>
              handlePlanetClick(category)
            }
            className={`
              shrink-0
              px-4
              py-2
              rounded-xl
              text-xs
              font-mono
              font-bold
              transition-all
              border
              flex
              items-center
              gap-2
              cursor-pointer
              ${
                selectedPlanet === category
                  ? 'bg-[#00ff99]/25 border-[#00ff99] text-[#00ff99] shadow-[0_0_20px_rgba(0,255,153,0.4)]'
                  : 'bg-black/60 border-white/10 text-slate-300 hover:border-[#00ff99]/40 hover:text-white'
              }
            `}
          >

            <span
              className="
                w-2
                h-2
                rounded-full
                bg-[#7efeff]
              "
            />

            {category}

          </button>

        ))}

      </div>


      {/* ======================================================
          ORBITAL TOOL SYSTEM
      ======================================================= */}

      <GlassCard
        glow="emerald"
        className="
          p-6
          relative
          min-h-[560px]
          overflow-hidden
        "
      >

        <div
          className="
            absolute
            top-4
            left-6
            z-20
            font-mono
            text-xs
            text-[#00ff99]
            flex
            items-center
            gap-2
          "
        >

          <Sparkles size={14} />

          <span>
            ACTIVE RING:{' '}
            {selectedPlanet.toUpperCase()}
          </span>

        </div>


        <ToolOrbitSystem
          tools={tools}
          categoryFilter={selectedPlanet}
          onToolSelect={handleToolSelect}
        />

      </GlassCard>


      {/* ======================================================
          ORIGINAL TOOL DETAIL DRAWER
          
          This restores:
          - Overview & Install
          - Commands
          - Lessons Included
          - Knowledge Check / Quiz
          - Lesson Viewer
          - Practice Lab
      ======================================================= */}

      {inspectedTool && (
        <ToolDetailDrawer
          tool={inspectedTool}
          onClose={closeToolDrawer}
        />
      )}

    </div>
  );
};

export default ToolExplorer;