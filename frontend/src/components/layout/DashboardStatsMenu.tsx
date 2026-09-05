import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  Eye,
  Shield,
  Zap,
  ChevronRight,
  MoreVertical,
  LogOut,
} from "lucide-react";

import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { GlassCard } from "../ui/GlassCard";
import { ProgressRing } from "../ui/ProgressRing";
import { Badge } from "../ui/Badge";

export const DashboardStatsMenu: React.FC = () => {
  const {
    userProfile,
    tools,
    setSelectedTool,
  } = useApp();

  const { logout } = useAuth();

  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);

  const xpProgressPercent = Math.min(
    100,
    Math.round(
      (userProfile.currentXp /
        userProfile.nextLevelXp) *
        100
    )
  );

  const recommendedTool =
    tools[1] || tools[0];

  const handleLogout = () => {
    if (
      window.confirm(
        "Are you sure you want to logout?"
      )
    ) {
      setIsOpen(false);
      logout();
      navigate("/login", {
        replace: true,
      });
    }
  };

  return (
    <div className="relative">

      {/* ==================================================
          THREE DOT BUTTON
      ================================================== */}

      <button
        onClick={() =>
          setIsOpen((previous) => !previous)
        }
        className={`flex items-center justify-center w-10 h-10 rounded-xl border transition-all cursor-pointer ${
          isOpen
            ? "bg-[#00ff99]/15 border-[#00ff99]/60 text-[#00ff99] shadow-[0_0_15px_rgba(0,255,153,0.25)]"
            : "bg-black/40 border-white/10 text-slate-300 hover:text-[#00ff99] hover:border-[#00ff99]/40"
        }`}
        title="Dashboard Intelligence"
      >
        <MoreVertical size={20} />
      </button>


      {/* ==================================================
          DASHBOARD INFORMATION PANEL
      ================================================== */}

      {isOpen && (
        <div className="absolute right-0 top-12 w-[360px] sm:w-[430px] max-h-[75vh] overflow-y-auto z-[100]">

          <div className="rounded-2xl border border-[#00ff99]/30 bg-[#030909]/95 backdrop-blur-xl shadow-[0_0_40px_rgba(0,255,153,0.18)] p-3">

            {/* PANEL HEADER */}

            <div className="flex items-center justify-between px-2 py-2 mb-2">

              <div>

                <div className="text-xs font-mono font-bold text-[#00ff99]">
                  INTELLIGENCE STATUS
                </div>

                <div className="text-[10px] font-mono text-slate-500 mt-1">
                  Dashboard overview
                </div>

              </div>

              <button
                onClick={() =>
                  setIsOpen(false)
                }
                className="text-slate-500 hover:text-white text-xs font-mono cursor-pointer"
              >
                CLOSE
              </button>

            </div>


            {/* ==================================================
                LEARNING PROGRESS
            ================================================== */}

            <GlassCard
              glow="emerald"
              className="space-y-3 mb-3"
            >

              <div className="flex items-center justify-between">

                <h3 className="font-mono font-bold text-xs text-white flex items-center gap-2">

                  <Zap
                    size={15}
                    className="text-[#00ff99]"
                  />

                  Learning Progress

                </h3>

                <Badge variant="emerald">
                  LVL {userProfile.level}
                </Badge>

              </div>


              <div className="flex items-center gap-4">

                <ProgressRing
                  progress={xpProgressPercent}
                  size={58}
                  strokeWidth={5}
                  color="#00ff99"
                />

                <div>

                  <div className="text-lg font-bold font-mono text-white">
                    {userProfile.currentXp} XP
                  </div>

                  <div className="text-[10px] font-mono text-slate-400">
                    Target:{" "}
                    {userProfile.nextLevelXp} XP
                  </div>

                  <div className="text-[10px] font-mono text-[#00ff99] mt-1">
                    {userProfile.streakDays} Day Streak 🔥
                  </div>

                </div>

              </div>

            </GlassCard>


            {/* ==================================================
                MISSION STATUS
            ================================================== */}

            <GlassCard
              glow="cyan"
              className="space-y-3 mb-3"
            >

              <div className="flex items-center justify-between">

                <h3 className="font-mono font-bold text-xs text-white flex items-center gap-2">

                  <Shield
                    size={15}
                    className="text-[#7efeff]"
                  />

                  Mission Status

                </h3>

                <Badge variant="cyan">
                  RANK #{userProfile.rankPosition}
                </Badge>

              </div>


              <div className="space-y-2 font-mono text-[10px]">

                <div className="flex justify-between text-slate-300">

                  <span>
                    Agent Codename:
                  </span>

                  <span className="text-white font-bold">
                    {userProfile.codename}
                  </span>

                </div>

                <div className="flex justify-between text-slate-300">

                  <span>
                    Completed Labs:
                  </span>

                  <span className="text-[#00ff99] font-bold">
                    {userProfile.completedLabsCount}
                  </span>

                </div>

                <div className="flex justify-between text-slate-300">

                  <span>
                    Accuracy Rating:
                  </span>

                  <span className="text-[#7efeff] font-bold">
                    {userProfile.accuracyRate}%
                  </span>

                </div>

              </div>

            </GlassCard>


            {/* ==================================================
                LIVE THREAT FEED
            ================================================== */}

            <GlassCard
              glow="emerald"
              className="space-y-3 mb-3"
            >

              <div className="flex items-center justify-between">

                <h3 className="font-mono font-bold text-xs text-white flex items-center gap-2">

                  <Activity
                    size={15}
                    className="text-rose-400"
                  />

                  Live Threat Feed

                </h3>

                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />

              </div>


              <div className="space-y-2 text-[10px] font-mono">

                <div className="p-2 rounded bg-black/40 border border-rose-500/30 text-slate-300">

                  <span className="text-rose-400 font-bold">
                    [CRITICAL]
                  </span>{" "}

                  Zero-Day exploit burst detected in UK Sector.

                </div>

                <div className="p-2 rounded bg-black/40 border border-amber-500/30 text-slate-300">

                  <span className="text-amber-400 font-bold">
                    [MEDIUM]
                  </span>{" "}

                  SCADA Modbus unauthenticated node exposed.

                </div>

              </div>

            </GlassCard>


            {/* ==================================================
                RECOMMENDED TOOL
            ================================================== */}

            <GlassCard
              glow="cyan"
              className="space-y-3"
            >

              <div className="flex items-center justify-between">

                <h3 className="font-mono font-bold text-xs text-white flex items-center gap-2">

                  <Eye
                    size={15}
                    className="text-[#7efeff]"
                  />

                  Recommended Tool

                </h3>

                <Badge variant="cyan">
                  FEATURED
                </Badge>

              </div>


              <div>

                <h4 className="font-mono font-bold text-base text-white">

                  {recommendedTool?.name ||
                    "OSINT Tool"}

                </h4>

                <p className="text-[10px] text-slate-300 line-clamp-2 mt-1 font-mono">

                  {recommendedTool?.tagline ||
                    "Explore recommended OSINT capabilities."}

                </p>

              </div>


              <button
                onClick={() => {

                  if (recommendedTool) {
                    setSelectedTool(
                      recommendedTool
                    );
                  }

                  setIsOpen(false);

                  navigate(
                    "/tool-explorer"
                  );

                }}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-[#7efeff]/20 bg-black/20 text-xs font-mono text-slate-200 hover:text-[#7efeff] hover:border-[#7efeff]/50 transition-all cursor-pointer"
              >

                Explore Tool

                <ChevronRight
                  size={14}
                />

              </button>

            </GlassCard>


            {/* ==================================================
                LOGOUT
            ================================================== */}

            <div className="mt-3 pt-3 border-t border-white/10">

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-rose-500/20 bg-rose-500/5 text-xs font-mono text-slate-300 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/40 transition-all cursor-pointer"
              >

                <LogOut size={15} />

                LOGOUT

              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default DashboardStatsMenu;