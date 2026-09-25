import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { TOOL_CATEGORIES } from '../constants';
import type { ToolCategory, AiToolRecommendationItem } from '../types';

import { ToolDetailDrawer } from '../components/intelligence/ToolDetailDrawer';
import { ToolOrbitSystem } from '../components/intelligence/ToolOrbitSystem';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { GlowButton } from '../components/ui/GlowButton';
import { OsintService } from '../services/api';

import {
  Compass,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Bot,
  Search,
  ArrowRight,
  Loader2,
  Terminal
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
  // AI TOOL RECOMMENDATION STATE
  // ============================================================
  const [aiObjective, setAiObjective] = useState('');
  const [isRecommending, setIsRecommending] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState<AiToolRecommendationItem[]>([]);
  const [aiDetectedIntent, setAiDetectedIntent] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);

  const handleAskAiRecommendation = async (customPrompt?: string) => {
    const promptToUse = (customPrompt || aiObjective).trim();
    if (!promptToUse) return;

    try {
      setIsRecommending(true);
      setAiError(null);
      setIsAiPanelOpen(true);
      if (customPrompt) setAiObjective(customPrompt);

      const res = await OsintService.recommendTools(promptToUse);
      if (res.success && Array.isArray(res.recommendations)) {
        setAiRecommendations(res.recommendations);
        setAiDetectedIntent(res.detectedIntent || null);
      } else {
        setAiError(res.message || 'No specific recommendations found.');
      }
    } catch (err: any) {
      console.error('AI Tool Recommendation Error:', err);
      setAiError(err?.response?.data?.message || err?.message || 'Failed to get AI tool recommendations. Ensure Ollama is active.');
    } finally {
      setIsRecommending(false);
    }
  };

  const handleInspectRecommendedTool = (toolName: string) => {
    const matched = tools.find(
      (t: any) => t.name.toLowerCase() === toolName.toLowerCase() ||
                  t.id.toLowerCase() === toolName.toLowerCase() ||
                  t.name.toLowerCase().includes(toolName.toLowerCase())
    );
    if (matched) {
      setInspectedTool(matched);
      setSelectedTool(matched);
    }
  };

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
  // TOOL SELECTION
  // ============================================================

  const handleToolSelect = (tool: any) => {
    setInspectedTool(tool);
    setSelectedTool(tool);
  };

  const closeToolDrawer = () => {
    setInspectedTool(null);
  };

  return (
    <div className="space-y-8">

      {/* ======================================================
          PAGE HEADER
      ======================================================= */}

      <div
        className="
          flex
          flex-col
          md:flex-row
          md:items-center
          md:justify-between
          gap-4
          border-b
          border-[#00ff99]/20
          pb-6
        "
      >
        <div>
          <div
            className="
              inline-flex
              items-center
              gap-2
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
            <span className="text-[#00ff99]">EXPLORER</span>
            <span className="text-[#00ff99]/60">// ORBITAL SYSTEM</span>
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
            Navigate OSINT category planets, ask AI for tool recommendations, and inspect technical commands.
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
          AI TOOL RECOMMENDATION ASSISTANT (PHASE 10)
      ======================================================= */}
      <GlassCard glow="emerald" className="p-5 border border-[#00ff99]/40 bg-[#02180e]/60">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#00ff99]/20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#00ff99]/20 text-[#00ff99] border border-[#00ff99]/40 shadow-[0_0_15px_rgba(0,255,153,0.3)]">
              <Bot size={20} />
            </div>
            <div>
              <h3 className="font-mono font-bold text-white text-base flex items-center gap-2">
                ForenX AI Tool Recommender
                <span className="px-2 py-0.5 rounded text-[10px] bg-[#00ff99]/10 text-[#00ff99] border border-[#00ff99]/30">
                  Ollama / Qwen3 Powered
                </span>
              </h3>
              <p className="text-xs font-mono text-slate-400">
                Describe your investigation goal and let AI suggest the optimal OSINT tools from the real catalogue.
              </p>
            </div>
          </div>
        </div>

        {/* Input bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAskAiRecommendation();
          }}
          className="mt-4 flex flex-col sm:flex-row gap-2"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 text-slate-500" size={16} />
            <input
              type="text"
              placeholder="e.g., 'Find all subdomains and open ports for a corporate target' or 'Extract camera GPS from images'"
              value={aiObjective}
              onChange={(e) => setAiObjective(e.target.value)}
              className="w-full bg-black/60 border border-white/15 focus:border-[#00ff99] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white font-mono placeholder:text-slate-500 focus:outline-none transition-all"
            />
          </div>
          <GlowButton
            type="submit"
            variant="primary"
            disabled={isRecommending || !aiObjective.trim()}
            icon={isRecommending ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
          >
            {isRecommending ? 'Analyzing...' : 'Ask AI'}
          </GlowButton>
        </form>

        {/* Quick Presets */}
        <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 text-[11px] font-mono">
          <span className="text-slate-500 text-[10px] shrink-0 uppercase tracking-wider">Quick Goals:</span>
          {[
            'Find subdomains of a target domain',
            'Discover email addresses and employees',
            'Track social media usernames across platforms',
            'Extract EXIF metadata and GPS coordinates',
            'Perform reverse image intelligence',
            'Find open ports and exposed services'
          ].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => handleAskAiRecommendation(preset)}
              className="shrink-0 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-[#00ff99] hover:border-[#00ff99]/40 hover:bg-[#00ff99]/10 transition-all cursor-pointer"
            >
              {preset}
            </button>
          ))}
        </div>

        {/* AI Recommendations Result Feed */}
        {isAiPanelOpen && (
          <div className="mt-5 pt-4 border-t border-[#00ff99]/20 space-y-3">
            {isRecommending && (
              <div className="flex items-center justify-center gap-3 py-6 text-[#00ff99] font-mono text-xs">
                <Loader2 className="animate-spin" size={18} />
                <span>ForenX AI is analyzing your objective against {tools.length} catalogued OSINT tools...</span>
              </div>
            )}

            {aiError && (
              <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 font-mono text-xs">
                {aiError}
              </div>
            )}

            {!isRecommending && aiRecommendations.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3 text-xs font-mono">
                  <span className="text-[#00ff99] font-bold">
                    RECOMMENDED TOOLS ({aiRecommendations.length})
                    {aiDetectedIntent && (
                      <span className="ml-2 text-slate-400 font-normal">
                        // Intent: <span className="text-[#7efeff] uppercase">{aiDetectedIntent}</span>
                      </span>
                    )}
                  </span>
                  <button
                    onClick={() => setIsAiPanelOpen(false)}
                    className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {aiRecommendations.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-black/60 border border-[#00ff99]/30 hover:border-[#00ff99] transition-all flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <h4 className="font-mono font-bold text-white text-sm group-hover:text-[#00ff99] transition-colors">
                            {item.name}
                          </h4>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-[#00ff99]/10 text-[#00ff99] border border-[#00ff99]/30 font-mono">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-xs font-mono text-slate-300 leading-relaxed mt-2">
                          {item.reason}
                        </p>
                        {item.command && (
                          <div className="mt-2.5 p-2 rounded bg-black/80 border border-white/10 font-mono text-[11px] text-[#7efeff] flex items-center gap-1.5 overflow-x-auto">
                            <Terminal size={12} className="shrink-0 text-[#00ff99]" />
                            <code>{item.command}</code>
                          </div>
                        )}
                      </div>
                      <div className="mt-3 pt-2 border-t border-white/5 flex justify-end">
                        <button
                          onClick={() => handleInspectRecommendedTool(item.name)}
                          className="text-[11px] font-mono text-[#00ff99] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          Inspect Tool in Drawer <ArrowRight size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </GlassCard>

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
          onClick={() => handlePlanetClick('All')}
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
          dYOO ALL CATEGORIES
        </button>

        {/* CATEGORY BUTTONS */}
        {TOOL_CATEGORIES.map((category) => (
          <button
            type="button"
            key={category}
            onClick={() => handlePlanetClick(category)}
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
            <span className="w-2 h-2 rounded-full bg-[#7efeff]" />
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
            ACTIVE RING: {selectedPlanet.toUpperCase()}
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
