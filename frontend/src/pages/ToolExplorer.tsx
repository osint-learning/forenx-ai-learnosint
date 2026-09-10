import React, { useEffect, useState } from 'react';
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
  ChevronLeft,
  ChevronRight,
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

  // ============================================================
  // PAGINATION
  // ============================================================

  const TOOLS_PER_PAGE = 10;

  const [currentPage, setCurrentPage] = useState(1);

  // ============================================================
  // FILTER TOOLS BY CATEGORY
  // ============================================================

  const filteredTools =
    selectedPlanet === 'All'
      ? tools
      : tools.filter(
          (tool: any) =>
            tool.category === selectedPlanet
        );

  // Total pages
  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredTools.length / TOOLS_PER_PAGE
    )
  );

  // Get tools for current page
  const startIndex =
    (currentPage - 1) * TOOLS_PER_PAGE;

  const endIndex =
    startIndex + TOOLS_PER_PAGE;

  const paginatedTools =
    filteredTools.slice(
      startIndex,
      endIndex
    );

  // ============================================================
  // RESET PAGE WHEN CATEGORY CHANGES
  // ============================================================

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedPlanet]);

  // ============================================================
  // CATEGORY SELECTION
  // ============================================================

  const handlePlanetClick = (
    category: ToolCategory | 'All'
  ) => {
    setSelectedPlanet(category);
    setActiveCategory(category);
    setCurrentPage(1);
  };

  // ============================================================
  // PAGINATION CONTROLS
  // ============================================================

  const handlePreviousPage = () => {
    setCurrentPage((page) =>
      Math.max(1, page - 1)
    );
  };

  const handleNextPage = () => {
    setCurrentPage((page) =>
      Math.min(totalPages, page + 1)
    );
  };

  // ============================================================
  // OPEN TOOL DETAIL DRAWER
  // ============================================================

  const handleToolSelect = (tool: any) => {
    setSelectedTool(tool);
    setInspectedTool(tool);
  };

  // ============================================================
  // CLOSE TOOL DETAIL DRAWER
  // ============================================================

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
          tools={paginatedTools}
          categoryFilter="All"
          onToolSelect={handleToolSelect}
        />

      </GlassCard>


      {/* ======================================================
          PAGINATION
      ======================================================= */}

      {filteredTools.length > TOOLS_PER_PAGE && (

        <div
          className="
            flex
            flex-col
            sm:flex-row
            items-center
            justify-center
            gap-4
            font-mono
          "
        >

          {/* PREVIOUS */}

          <button
            type="button"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`
              flex
              items-center
              gap-2
              px-5
              py-2.5
              rounded-xl
              border
              text-xs
              font-bold
              transition-all
              ${
                currentPage === 1
                  ? 'border-white/5 text-slate-600 cursor-not-allowed'
                  : 'border-[#00ff99]/30 text-[#00ff99] bg-[#00ff99]/5 hover:bg-[#00ff99]/15 hover:border-[#00ff99]'
              }
            `}
          >
            <ChevronLeft size={15} />

            PREVIOUS

          </button>


          {/* PAGE INFORMATION */}

          <div
            className="
              px-5
              py-2.5
              rounded-xl
              border
              border-[#00ff99]/20
              bg-black/50
              text-[#00ff99]
              text-xs
              font-bold
              min-w-[150px]
              text-center
            "
          >

            PAGE {currentPage} / {totalPages}

          </div>


          {/* NEXT */}

          <button
            type="button"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`
              flex
              items-center
              gap-2
              px-5
              py-2.5
              rounded-xl
              border
              text-xs
              font-bold
              transition-all
              ${
                currentPage === totalPages
                  ? 'border-white/5 text-slate-600 cursor-not-allowed'
                  : 'border-[#00ff99]/30 text-[#00ff99] bg-[#00ff99]/5 hover:bg-[#00ff99]/15 hover:border-[#00ff99]'
              }
            `}
          >

            NEXT

            <ChevronRight size={15} />

          </button>

        </div>

      )}


      {/* ======================================================
          TOOL COUNT
      ======================================================= */}

      <div
        className="
          flex
          justify-center
          font-mono
          text-[10px]
          text-slate-500
          uppercase
          tracking-wider
        "
      >

        SHOWING{' '}
        {filteredTools.length === 0
          ? 0
          : startIndex + 1}
        –
        {Math.min(
          endIndex,
          filteredTools.length
        )}{' '}
        OF {filteredTools.length} TOOLS

      </div>


      {/* ======================================================
          ORIGINAL TOOL DETAIL DRAWER
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