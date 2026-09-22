import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { OsintService } from "../services/api";
import type { PracticeLab } from '../types';
import { useSearchParams, useNavigate } from "react-router-dom";
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { InteractiveTerminal } from '../components/terminal/InteractiveTerminal';
import {
  Terminal,
  Award,
  CheckCircle2,
  HelpCircle,
  FileText,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const PracticeLabs: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const selectedToolName = searchParams.get("tool");
  const selectedToolId = searchParams.get("toolId");
  const selectedLabId = searchParams.get("labId");

  const hasSelectedTool = Boolean(selectedToolName || selectedToolId || selectedLabId);

  const { completeLab, completedLabIds } = useApp();

  // Labs loaded from MongoDB
  const [labs, setLabs] = useState<PracticeLab[]>([]);
  const [activeLab, setActiveLab] = useState<PracticeLab | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [objectivesState, setObjectivesState] = useState<PracticeLab["objectives"]>([]);
  const [activeLeftTab, setActiveLeftTab] = useState<'brief' | 'evidence' | 'hints'>('brief');
  const [isLabCompleted, setIsLabCompleted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [answerStatus, setAnswerStatus] = useState<
    Record<number, 'correct' | 'incorrect' | 'pending'>
  >({});
  const [evaluating, setEvaluating] = useState<number | null>(null);
  const [commandOutput, setCommandOutput] = useState<any>(null);

  // --------------------------------------------------
  // LAB MATCHING LOGIC
  // --------------------------------------------------
  const selectTargetLab = (allLabs: PracticeLab[]) => {
    if (!allLabs || allLabs.length === 0) {
      setActiveLab(null);
      setObjectivesState([]);
      return;
    }

    let targetLab: PracticeLab | undefined;

    // 1. Check labId
    if (selectedLabId) {
      targetLab = allLabs.find(
        (l) => l.id === selectedLabId || (l as any)._id === selectedLabId
      );
    }

    // 2. Check toolId
    if (!targetLab && selectedToolId) {
      const lowerId = selectedToolId.toLowerCase().trim();
      targetLab = allLabs.find(
        (l) =>
          l.id === selectedToolId ||
          (l as any)._id === selectedToolId ||
          l.toolId?.toLowerCase() === lowerId ||
          (l as any).tool?.toLowerCase() === lowerId ||
          l.toolName?.toLowerCase() === lowerId
      );
    }

    // 3. Check toolName
    if (!targetLab && selectedToolName) {
      const lowerName = selectedToolName.toLowerCase().trim();
      targetLab = allLabs.find(
        (l) =>
          l.toolName?.toLowerCase() === lowerName ||
          (l as any).tool?.toLowerCase() === lowerName ||
          l.toolId?.toLowerCase() === lowerName ||
          l.title?.toLowerCase() === lowerName ||
          l.title?.toLowerCase().includes(lowerName)
      );
    }

    // Default to first lab if no tool requested or no match found
    const finalLab = targetLab || allLabs[0];

    setActiveLab(finalLab);
    setObjectivesState(finalLab.objectives || []);
    setIsLabCompleted(
      (finalLab.objectives && finalLab.objectives.length > 0 && finalLab.objectives.every((o) => o.completed)) ||
      completedLabIds.includes(finalLab.id)
    );
    setAnswers({});
    setAnswerStatus({});
    setCommandOutput(null);
    setActiveLeftTab('brief');
  };

  // --------------------------------------------------
  // LOAD LABS FROM BACKEND
  // --------------------------------------------------
  const loadLabs = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await OsintService.getPracticeLabs();
      setLabs(data);
      selectTargetLab(data);
    } catch (err) {
      console.error("Failed to load Practice Labs:", err);
      setError("Failed to load Practice Labs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLabs();
  }, []);

  // When searchParams change while labs are already loaded
  useEffect(() => {
    if (labs.length > 0) {
      selectTargetLab(labs);
    }
  }, [selectedToolName, selectedToolId, selectedLabId]);

  // --------------------------------------------------
  // HANDLE LAB SELECTION
  // --------------------------------------------------
  const handleLabSelect = (lab: PracticeLab) => {
    setActiveLab(lab);
    setObjectivesState(lab.objectives || []);
    setIsLabCompleted(
      completedLabIds.includes(lab.id) ||
      (lab.objectives && lab.objectives.length > 0 && lab.objectives.every((o) => o.completed))
    );
    setAnswers({});
    setAnswerStatus({});
    setCommandOutput(null);
    setActiveLeftTab('brief');
  };

  // --------------------------------------------------
  // HANDLE COMMAND EXECUTION
  // --------------------------------------------------
  const handleCommandExecution = (
    cmd: string,
    response?: any
  ) => {
    if (!activeLab) return;

    if (!response?.success || !response?.data) {
      return;
    }

    // Utility and help commands must never complete lab objectives
    const isUtilityOrHelp =
      response.command === "help" ||
      response.command === "clear" ||
      response.command === "sysinfo" ||
      Boolean(response.data?.isHelp) ||
      Boolean(response.data?.clear) ||
      /\b(--help|-h|-help)\b/i.test(cmd) ||
      cmd.trim().toLowerCase() === 'help' ||
      cmd.trim().toLowerCase() === 'clear' ||
      cmd.trim().toLowerCase() === 'sysinfo';

    if (isUtilityOrHelp) {
      return;
    }

    const outputData = response.data;
    if (outputData.error || (outputData.exitCode !== undefined && outputData.exitCode !== 0)) {
      return;
    }

    // Strictly check action matches activeLab requiredCommand
    const cmdAction = cmd.trim().split(/\s+/)[0]?.toLowerCase();
    const labRequired = String(activeLab.requiredCommand || activeLab.toolName || activeLab.toolId || "").trim().toLowerCase();
    if (labRequired && cmdAction !== labRequired) {
      return;
    }

    setCommandOutput(outputData);

    const updated = objectivesState.map((obj, index) => {
      if (index === 0 && obj.type === "command") {
        return {
          ...obj,
          completed: true
        };
      }
      return obj;
    });

    setObjectivesState(updated);
  };

  // --------------------------------------------------
  // HANDLE ANSWER SUBMISSION
  // --------------------------------------------------
  const handleAnswerSubmit = async (objectiveIndex: number) => {
    if (!activeLab) return;

    const answer = answers[objectiveIndex]?.trim();
    if (!answer) return;

    if (!commandOutput) {
      return;
    }

    try {
      setEvaluating(objectiveIndex);
      setAnswerStatus((prev) => ({
        ...prev,
        [objectiveIndex]: 'pending'
      }));

      const result = await OsintService.evaluateLabAnswer(
        activeLab.id,
        objectiveIndex,
        answer,
        commandOutput
      );

      if (result.correct) {
        setAnswerStatus((prev) => ({
          ...prev,
          [objectiveIndex]: 'correct'
        }));

        const updated = objectivesState.map((obj, index) => {
          if (index === objectiveIndex) {
            return {
              ...obj,
              completed: true
            };
          }
          return obj;
        });

        setObjectivesState(updated);

        if (
          updated.length > 0 &&
          updated.every((obj) => obj.completed) &&
          !isLabCompleted
        ) {
          setIsLabCompleted(true);
          completeLab(activeLab.id, activeLab.xpReward);
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      } else {
        setAnswerStatus((prev) => ({
          ...prev,
          [objectiveIndex]: 'incorrect'
        }));
      }
    } catch (error) {
      console.error("Answer evaluation failed:", error);
      setAnswerStatus((prev) => ({
        ...prev,
        [objectiveIndex]: 'incorrect'
      }));
    } finally {
      setEvaluating(null);
    }
  };

  const handleRetryLab = async () => {
    if (!activeLab) return;

    try {
      await OsintService.resetLabProgress(activeLab.id);
      setAnswers({});
      setAnswerStatus({});
      setCommandOutput(null);
      setIsLabCompleted(false);
      await loadLabs();
    } catch (error) {
      console.error("Failed to reset lab:", error);
    }
  };

  // --------------------------------------------------
  // LOADING STATE
  // --------------------------------------------------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Terminal size={40} className="mx-auto text-[#00ff99] mb-4 animate-pulse" />
          <div className="text-xl font-semibold text-white font-mono">
            LOADING PRACTICE LABS...
          </div>
          <p className="text-sm text-slate-400 mt-2 font-mono">
            Fetching investigation labs from ForenX AI.
          </p>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // ERROR STATE
  // --------------------------------------------------
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Terminal size={40} className="mx-auto text-red-400 mb-4" />
          <div className="text-xl font-semibold text-white font-mono">
            UNABLE TO LOAD PRACTICE LABS
          </div>
          <p className="text-sm text-red-400 mt-2 font-mono">{error}</p>
          <button
            onClick={loadLabs}
            className="mt-4 px-4 py-2 rounded border border-[#00ff99]/40 text-[#00ff99] font-mono text-sm hover:bg-[#00ff99]/10 cursor-pointer"
          >
            RETRY
          </button>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // NO LABS
  // --------------------------------------------------
  if (!activeLab) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Terminal size={40} className="mx-auto text-slate-500 mb-4" />
          <div className="text-xl font-semibold text-white font-mono">
            NO PRACTICE LABS AVAILABLE
          </div>
          <p className="text-sm text-slate-400 mt-2 font-mono">
            Check back later for new investigations.
          </p>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // COMPLETED LAB SCREEN
  // --------------------------------------------------
  if (isLabCompleted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <GlassCard glow="emerald" className="max-w-xl w-full p-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-[#00ff99]/10 border border-[#00ff99] flex items-center justify-center">
              <CheckCircle2 size={42} className="text-[#00ff99]" />
            </div>
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-mono font-bold text-white">
              PRACTICE LAB COMPLETED
            </h1>
            <p className="text-[#00ff99] font-mono text-sm mt-2">
              MISSION ALREADY ACCOMPLISHED
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-lg p-5">
            <p className="text-slate-300 font-mono text-sm">
              You have already completed
            </p>
            <p className="text-white font-mono font-bold text-lg mt-2">
              {activeLab.title}
            </p>
            <p className="text-slate-400 font-mono text-xs mt-3">
              Your progress has been saved. You can exit the lab or retry the investigation from the beginning.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="px-5 py-3 rounded-lg border border-white/20 text-slate-300 font-mono text-xs font-bold hover:bg-white/5 transition-all cursor-pointer"
            >
              EXIT LAB
            </button>
            <button
              type="button"
              onClick={handleRetryLab}
              className="px-5 py-3 rounded-lg bg-[#00ff99]/10 border border-[#00ff99]/40 text-[#00ff99] font-mono text-xs font-bold hover:bg-[#00ff99]/20 transition-all cursor-pointer"
            >
              RETRY PRACTICE LAB
            </button>
          </div>
        </GlassCard>
      </div>
    );
  }

  // --------------------------------------------------
  // MAIN UI
  // --------------------------------------------------
  return (
    <div className="space-y-6">
      {/* Top Mission Select Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#00ff99]/20 pb-4">
        <div>
          <h1 className="text-3xl font-mono font-bold text-white uppercase flex items-center gap-3">
            <Terminal className="text-[#00ff99]" size={32} />
            PRACTICE LABS
            <span className="neon-text-emerald">// MISSION CONTROL</span>
          </h1>
          <p className="text-slate-400 font-mono text-xs sm:text-sm mt-1">
            Real interactive command terminal simulations & live objective verification.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {hasSelectedTool && activeLab ? (
            <Badge variant="emerald">
              {activeLab.toolName || (activeLab as any).tool || selectedToolName} PRACTICE
            </Badge>
          ) : (
            <span className="text-xs font-mono text-slate-400">
              CHALLENGE MODE
            </span>
          )}
        </div>
      </div>

      {/* --------------------------------------------------
          AVAILABLE LABS (Shown only on generic /practice-labs without a specific tool selected)
      -------------------------------------------------- */}
      {!hasSelectedTool && labs.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {labs.map((lab) => (
            <button
              key={lab.id}
              onClick={() => handleLabSelect(lab)}
              className={`min-w-[220px] text-left p-3 rounded-lg border transition-all cursor-pointer ${
                activeLab.id === lab.id
                  ? 'border-[#00ff99] bg-[#00ff99]/10'
                  : 'border-white/10 bg-black/40 hover:border-[#00ff99]/40'
              }`}
            >
              <div className="text-xs font-mono text-[#00ff99]">
                {lab.toolName || (lab as any).tool || "OSINT"}
              </div>
              <div className="text-sm font-mono font-bold text-white mt-1">
                {lab.title}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                {lab.difficulty} â€¢ +{lab.xpReward} XP
              </div>
            </button>
          ))}
        </div>
      )}

      {/* --------------------------------------------------
          SPLIT MISSION LAYOUT
      -------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT SIDE: BRIEF & OBJECTIVES */}
        <GlassCard glow="emerald" className="lg:col-span-5 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Badge variant="emerald">{activeLab.difficulty}</Badge>
              <h2 className="text-xl font-mono font-bold text-white mt-1">
                {activeLab.title}
              </h2>
              <span className="text-xs font-mono text-[#7efeff]">
                Target: {activeLab.targetDomainOrIp}
              </span>
            </div>

            <div className="text-right">
              <span className="text-xs font-mono text-[#00ff99] font-bold flex items-center gap-1">
                <Award size={16} />
                +{activeLab.xpReward} XP
              </span>
            </div>
          </div>

          {/* LEFT TABS */}
          <div className="flex border-b border-white/10 text-xs font-mono">
            <button
              type="button"
              onClick={() => setActiveLeftTab('brief')}
              className={`pb-2 px-3 border-b-2 font-bold cursor-pointer transition-colors ${
                activeLeftTab === 'brief'
                  ? 'border-[#00ff99] text-[#00ff99]'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              MISSION BRIEF
            </button>

            <button
              type="button"
              onClick={() => setActiveLeftTab('evidence')}
              className={`pb-2 px-3 border-b-2 font-bold cursor-pointer transition-colors ${
                activeLeftTab === 'evidence'
                  ? 'border-[#00ff99] text-[#00ff99]'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              EVIDENCE ({(activeLab.evidenceFiles || []).length})
            </button>

            <button
              type="button"
              onClick={() => setActiveLeftTab('hints')}
              className={`pb-2 px-3 border-b-2 font-bold cursor-pointer transition-colors ${
                activeLeftTab === 'hints'
                  ? 'border-[#00ff99] text-[#00ff99]'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              HINTS ({(activeLab.hints || []).length})
            </button>
          </div>

          {/* BRIEF */}
          {activeLeftTab === 'brief' && (
            <div className="space-y-6">
              <div className="text-xs font-mono text-slate-300 leading-relaxed bg-black/60 p-4 rounded-lg border border-[#00ff99]/15">
                {activeLab.missionBrief}
              </div>

              {/* OBJECTIVES */}
              <div className="space-y-4">
                <div className="text-xs font-mono text-[#00ff99] font-bold uppercase tracking-wider">
                  MISSION OBJECTIVES ({objectivesState.filter(o => o.completed).length} / {objectivesState.length})
                </div>

                {objectivesState.map((obj, index) => {
                  const isCommandObjective = obj.type === 'command';
                  const previousCompleted = index === 0 || objectivesState[index - 1]?.completed;
                  const canAnswer = !isCommandObjective && previousCompleted;
                  const status = answerStatus[index];

                  return (
                    <div
                      key={obj.id || index}
                      className={`p-4 rounded-lg border font-mono text-xs transition-all ${
                        obj.completed
                          ? 'border-[#00ff99]/40 bg-[#00ff99]/5'
                          : status === 'incorrect'
                          ? 'border-rose-500/40 bg-rose-500/5'
                          : 'border-white/10 bg-black/40'
                      }`}
                    >
                      {/* Objective Header */}
                      <div className="flex items-start gap-3">
                        <CheckCircle2
                          size={18}
                          className={
                            obj.completed
                              ? 'text-[#00ff99] shrink-0 mt-0.5'
                              : status === 'incorrect'
                              ? 'text-rose-400 shrink-0 mt-0.5'
                              : 'text-slate-600 shrink-0 mt-0.5'
                          }
                        />

                        <div className="flex-1">
                          <div className="font-bold text-white">
                            {obj.task}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-1">
                            Hint: {obj.hint || "Analyze the command output carefully."}
                          </div>
                        </div>
                      </div>

                      {/* COMMAND OBJECTIVE */}
                      {isCommandObjective && obj.completed && (
                        <div className="mt-3 ml-7 text-[10px] text-[#00ff99] font-bold">
                          âœ“ Real command output received.
                        </div>
                      )}

                      {/* ANSWER SECTION */}
                      {!isCommandObjective && (
                        <div className="mt-4 ml-7 space-y-2">
                          <input
                            type="text"
                            value={answers[index] || ""}
                            onChange={(e) => {
                              setAnswers(prev => ({
                                ...prev,
                                [index]: e.target.value
                              }));
                              if (answerStatus[index] === 'incorrect') {
                                setAnswerStatus(prev => ({
                                  ...prev,
                                  [index]: 'pending'
                                }));
                              }
                            }}
                            disabled={obj.completed || evaluating === index || !canAnswer}
                            placeholder={
                              canAnswer
                                ? "Enter your answer..."
                                : "Complete the previous objective first."
                            }
                            className={`w-full px-3 py-2 rounded-md bg-black/70 border text-white text-xs font-mono focus:outline-none ${
                              status === 'incorrect'
                                ? 'border-rose-500'
                                : obj.completed
                                ? 'border-[#00ff99]'
                                : 'border-white/10 focus:border-[#00ff99]'
                            }`}
                          />

                          <button
                            type="button"
                            onClick={() => handleAnswerSubmit(index)}
                            disabled={!canAnswer || obj.completed || evaluating === index || !answers[index]?.trim()}
                            className={`px-3 py-2 rounded-md text-[10px] font-mono font-bold transition-all cursor-pointer ${
                              obj.completed
                                ? 'bg-[#00ff99]/20 text-[#00ff99] cursor-default'
                                : 'bg-[#00ff99]/10 text-[#00ff99] border border-[#00ff99]/30 hover:bg-[#00ff99]/20'
                            }`}
                          >
                            {evaluating === index
                              ? 'CHECKING...'
                              : obj.completed
                              ? 'âœ“ ANSWER CORRECT'
                              : 'SUBMIT ANSWER'}
                          </button>

                          {status === 'correct' && (
                            <div className="text-[#00ff99] font-bold text-[10px]">
                              âœ“ Correct! Your answer matches the information found in the real command output.
                            </div>
                          )}

                          {status === 'incorrect' && (
                            <div className="text-rose-400 font-bold text-[10px]">
                              âœ— Incorrect. Review the command output and try again.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* EVIDENCE */}
          {activeLeftTab === 'evidence' && (
            <div className="space-y-3">
              {(activeLab.evidenceFiles || []).map((file, i) => (
                <div
                  key={i}
                  className="bg-black/80 p-3 rounded border border-white/10 font-mono text-xs space-y-2"
                >
                  <div className="flex items-center gap-2 text-[#7efeff]">
                    <FileText size={14} />
                    <span className="font-bold">{file.name}</span>
                  </div>
                  <pre className="text-[11px] text-slate-300 bg-white/5 p-2 rounded whitespace-pre-wrap">
                    {file.content}
                  </pre>
                </div>
              ))}

              {(activeLab.evidenceFiles || []).length === 0 && (
                <div className="text-xs font-mono text-slate-500">
                  No evidence collected yet.
                </div>
              )}
            </div>
          )}

          {/* HINTS */}
          {activeLeftTab === 'hints' && (
            <div className="space-y-2 font-mono text-xs">
              {(activeLab.hints || []).map((hint, i) => (
                <div
                  key={i}
                  className="p-3 rounded bg-amber-500/10 border border-amber-500/30 text-amber-200 flex items-start gap-2"
                >
                  <HelpCircle size={16} className="shrink-0 text-amber-400 mt-0.5" />
                  <span>{hint}</span>
                </div>
              ))}
            </div>
          )}

          {/* COMPLETED */}
          {isLabCompleted && (
            <div className="p-4 rounded-xl bg-[#00ff99]/20 border border-[#00ff99] text-center font-mono space-y-2 animate-bounce">
              <Sparkles size={24} className="mx-auto text-[#00ff99]" />
              <div className="text-lg font-bold text-white">
                MISSION ACCOMPLISHED!
              </div>
              <div className="text-xs text-[#00ff99]">
                You earned +{activeLab.xpReward} XP for completing this lab!
              </div>
            </div>
          )}
        </GlassCard>

        {/* RIGHT SIDE: TERMINAL */}
        <div className="lg:col-span-7 h-[580px]">
          <InteractiveTerminal
            key={activeLab.id || activeLab.toolName || activeLab.title}
            initialTarget={activeLab.targetDomainOrIp}
            practiceTool={
              activeLab.toolName ||
              (activeLab as any).tool ||
              selectedToolName ||
              undefined
            }
            labId={activeLab.id}
            initialCommand={
              activeLab.requiredCommand && activeLab.requiredCommand.trim()
                ? `${activeLab.requiredCommand.trim()}${activeLab.targetDomainOrIp ? ' ' + activeLab.targetDomainOrIp.trim() : ''}`
                : undefined
            }
            onCommandRun={handleCommandExecution}
          />
        </div>
      </div>
    </div>
  );
};

export default PracticeLabs;
