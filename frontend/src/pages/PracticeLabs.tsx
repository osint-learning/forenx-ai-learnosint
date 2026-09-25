import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { OsintService } from "../services/api";
import type { PracticeLab, AiLabEvaluationResponse } from '../types';
import { useSearchParams } from "react-router-dom";
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { InteractiveTerminal } from '../components/terminal/InteractiveTerminal';
import {
  Terminal,
  Award,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  Bot,
  RotateCcw,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const PracticeLabs: React.FC = () => {
  const [searchParams] = useSearchParams();

  const selectedToolName = searchParams.get("tool");
  const selectedToolId = searchParams.get("toolId");
  const selectedLabId = searchParams.get("labId");

  const { completeLab, completedLabIds } = useApp();

  // Labs loaded from MongoDB
  const [labs, setLabs] = useState<PracticeLab[]>([]);
  const [activeLab, setActiveLab] = useState<PracticeLab | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [objectivesState, setObjectivesState] = useState<PracticeLab["objectives"]>([]);
  const [activeLeftTab, setActiveLeftTab] = useState<'brief' | 'hints' | 'aiEval'>('brief');
  const [isLabCompleted, setIsLabCompleted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [answerStatus, setAnswerStatus] = useState<
    Record<number, 'correct' | 'incorrect' | 'pending'>
  >({});
  const [evaluating, setEvaluating] = useState<number | null>(null);
  const [commandOutput, setCommandOutput] = useState<any>(null);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);

  // AI Evaluation State
  const [loadingAiEvaluation, setLoadingAiEvaluation] = useState(false);
  const [aiEvaluationResult, setAiEvaluationResult] = useState<AiLabEvaluationResponse | null>(null);
  const [aiEvaluationError, setAiEvaluationError] = useState<string | null>(null);

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
    setCommandHistory([]);
    setAiEvaluationResult(null);
    setAiEvaluationError(null);
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
    setCommandHistory([]);
    setAiEvaluationResult(null);
    setAiEvaluationError(null);
    setActiveLeftTab('brief');
  };

  // --------------------------------------------------
  // HANDLE COMMAND EXECUTION
  // --------------------------------------------------
  const handleCommandExecution = async (
    cmd: string,
    response?: any
  ) => {
    if (!activeLab) return;

    // Track command history for AI evaluation
    setCommandHistory(prev => [...prev, cmd]);

    if (!response?.success || !response?.data) {
      return;
    }

    // Utility and help commands must never complete lab objectives
    const cleanCmd = cmd.trim();
    const isUtilityOrHelp =
      response.command === "help" ||
      response.command === "clear" ||
      response.command === "sysinfo" ||
      Boolean(response.data?.isHelp) ||
      Boolean(response.data?.clear) ||
      /\b(--help|-h|-help)\b/i.test(cleanCmd) ||
      cleanCmd.toLowerCase() === 'help' ||
      cleanCmd.toLowerCase() === 'clear' ||
      cleanCmd.toLowerCase() === 'sysinfo';

    if (isUtilityOrHelp) {
      return;
    }

    const outputData = response.data;
    if (outputData.error || (outputData.exitCode !== undefined && outputData.exitCode !== 0)) {
      return;
    }

    // Generic validation: match executed command against activeLab.requiredCommand or tool
    const cmdTokens = cleanCmd.toLowerCase().split(/\s+/);
    const cmdTool = cmdTokens[0] || '';
    const reqCmd = String(activeLab.requiredCommand || '').trim().toLowerCase();
    const reqTokens = reqCmd.split(/\s+/);
    const reqTool = reqTokens[0] || '';
    const labTool = String(activeLab.toolName || (activeLab as any).tool || activeLab.toolId || '').trim().toLowerCase();

    let isMatch = false;
    if (reqCmd && cleanCmd.toLowerCase() === reqCmd) {
      isMatch = true;
    } else if (reqCmd && cleanCmd.toLowerCase().startsWith(reqCmd)) {
      isMatch = true;
    } else if (reqTool && cmdTool === reqTool) {
      isMatch = true;
    } else if (labTool && (cmdTool === labTool || labTool.includes(cmdTool) || cmdTool.includes(labTool))) {
      isMatch = true;
    }

    if (!isMatch) {
      return;
    }

    setCommandOutput(outputData);

    const updated = (objectivesState || []).map((obj, index) => {
      if ((index === 0 && obj.type === "command") || obj.type === "command" || index === 0) {
        return {
          ...obj,
          completed: true
        };
      }
      return obj;
    });

    setObjectivesState(updated);

    // Persist in backend
    try {
      await OsintService.completeLabCommandObjective(activeLab.id, cleanCmd, outputData);
    } catch (saveErr) {
      console.warn('Failed to persist command objective completion:', saveErr);
    }
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

        const updated = (objectivesState || []).map((obj, index) => {
          if (index === objectiveIndex) {
            return {
              ...obj,
              completed: true
            };
          }
          return obj;
        });

        setObjectivesState(updated);

        const allFinished = updated.every((o) => o.completed);
        if (allFinished) {
          setIsLabCompleted(true);
          completeLab(activeLab.id, activeLab.xpReward);

          try {
            confetti({
              particleCount: 80,
              spread: 60,
              origin: { y: 0.6 }
            });
          } catch (e) {
            // Ignore confetti errors
          }
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

  // --------------------------------------------------
  // RUN AI LAB EVALUATION
  // --------------------------------------------------
  const handleRunAiEvaluation = async () => {
    if (!activeLab) return;

    try {
      setLoadingAiEvaluation(true);
      setAiEvaluationError(null);
      setActiveLeftTab('aiEval');

      const objectiveResultsPayload = (objectivesState || []).map((obj, idx) => ({
        objectiveIndex: idx,
        question: obj.task || (obj as any).question || `Objective ${idx + 1}`,
        type: obj.type,
        completed: obj.completed === true,
        correct: obj.completed === true,
        answer: answers[idx] || (obj.completed ? (activeLab.requiredCommand || activeLab.toolName || 'completed') : '')
      }));

      const res = await OsintService.evaluateAILab(activeLab.id, commandHistory, objectiveResultsPayload);
      if (res.success) {
        setAiEvaluationResult(res);
      } else {
        setAiEvaluationError(res.message || 'Failed to perform AI evaluation.');
      }
    } catch (err: any) {
      console.error('AI Lab Evaluation Error:', err);
      setAiEvaluationError(err?.response?.data?.message || err?.message || 'Failed to evaluate lab with AI.');
    } finally {
      setLoadingAiEvaluation(false);
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
            className="mt-4 px-4 py-2 bg-[#00ff99] text-black font-mono font-bold rounded-lg hover:bg-[#00ff99]/80 cursor-pointer"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // EMPTY STATE
  // --------------------------------------------------
  if (!activeLab) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Terminal size={40} className="mx-auto text-slate-500 mb-4" />
          <div className="text-xl font-semibold text-white font-mono">
            NO PRACTICE LAB AVAILABLE
          </div>
          <p className="text-sm text-slate-400 mt-2 font-mono">
            No active investigation labs are currently available.
          </p>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // MAIN RENDER
  // --------------------------------------------------
  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono text-[#00ff99] tracking-wider uppercase">
              PRACTICE LAB
            </span>
            <Badge variant="emerald" className="border-[#00ff99]/30 text-[#00ff99] text-[10px] font-mono">
              {activeLab.difficulty.toUpperCase()}
            </Badge>
            <Badge variant="cyan" className="border-white/10 text-slate-400 text-[10px] font-mono">
              {activeLab.category || "OSINT"}
            </Badge>
          </div>

          <h1 className="text-2xl font-bold font-mono text-white flex items-center gap-2">
            {activeLab.title}
          </h1>

          <p className="text-slate-400 text-xs font-mono mt-1">
            Target Domain / IP:{' '}
            <span className="text-[#00ff99] font-bold">
              {activeLab.targetDomainOrIp || (activeLab as any).target || 'example.com'}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-lg border border-white/10">
            <Award size={16} className="text-[#00ff99]" />
            <span className="text-xs font-mono text-slate-300">
              +{activeLab.xpReward} XP
            </span>
          </div>

          {/* Quick AI Evaluation Trigger */}
          <button
            onClick={handleRunAiEvaluation}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#7efeff]/10 border border-[#7efeff]/30 text-[#7efeff] hover:bg-[#7efeff]/20 transition-all font-mono text-xs cursor-pointer"
          >
            <Bot size={15} />
            AI Evaluation
          </button>

          {/* Switch Lab Select */}
          {labs.length > 1 && (
            <select
              value={activeLab.id}
              onChange={(e) => {
                const found = labs.find((l) => l.id === e.target.value);
                if (found) handleLabSelect(found);
              }}
              className="bg-black/60 border border-white/10 text-slate-300 rounded-lg px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-[#00ff99] cursor-pointer"
            >
              {labs.map((lab) => (
                <option key={lab.id} value={lab.id} className="bg-slate-900 text-white">
                  {lab.title} ({lab.toolName || (lab as any).tool || 'Tool'})
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* LAB WORKSPACE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: BRIEF / HINTS / AI EVALUATION */}
        <GlassCard glow="emerald" className="lg:col-span-5 p-6 flex flex-col gap-6">
          {/* TAB HEADERS: BRIEF / AI HINTS / AI EVALUATION */}
          <div className="flex items-center border-b border-white/10 text-xs font-mono">
            <button
              type="button"
              onClick={() => setActiveLeftTab('brief')}
              className={`pb-2 px-3 border-b-2 font-bold cursor-pointer transition-colors ${
                activeLeftTab === 'brief'
                  ? 'border-[#00ff99] text-[#00ff99]'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              BRIEF & OBJECTIVES
            </button>

            <button
              type="button"
              onClick={() => setActiveLeftTab('hints')}
              className={`pb-2 px-3 border-b-2 font-bold cursor-pointer transition-colors shrink-0 flex items-center gap-1 ${
                activeLeftTab === 'hints'
                  ? 'border-[#00ff99] text-[#00ff99]'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <HelpCircle size={13} />
              HINTS ({(activeLab.hints || []).length})
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveLeftTab('aiEval');
                if (!aiEvaluationResult) {
                  handleRunAiEvaluation();
                }
              }}
              className={`pb-2 px-3 border-b-2 font-bold cursor-pointer transition-colors shrink-0 flex items-center gap-1 ${
                activeLeftTab === 'aiEval'
                  ? 'border-[#7efeff] text-[#7efeff]'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Bot size={13} />
              AI EVALUATION
            </button>
          </div>

          {/* TAB 1: BRIEF & OBJECTIVES */}
          {activeLeftTab === 'brief' && (
            <div className="space-y-6">
              <div className="text-xs font-mono text-slate-300 leading-relaxed bg-black/60 p-4 rounded-lg border border-[#00ff99]/15">
                {activeLab.missionBrief}
              </div>

              {/* OBJECTIVES */}
              <div className="space-y-4">
                <div className="text-xs font-mono text-[#00ff99] font-bold uppercase tracking-wider flex items-center justify-between">
                  <span>MISSION OBJECTIVES ({(objectivesState || []).filter(o => o.completed).length} / {(objectivesState || []).length})</span>
                </div>

                {(objectivesState || []).map((obj, index) => {
                  const isCommandObjective = obj.type === 'command';
                  const previousCompleted = index === 0 || objectivesState?.[index - 1]?.completed;
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
                            {obj.task || (obj as any).question}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-1">
                            Hint: {obj.hint || "Analyze the command output carefully."}
                          </div>
                        </div>
                      </div>

                      {/* COMMAND OBJECTIVE STATUS */}
                      {isCommandObjective && (
                        <div className="mt-3 ml-7 text-[10px] font-mono">
                          {obj.completed ? (
                            <span className="text-[#00ff99] font-bold">
                              ✓ Command executed successfully. Real output received.
                            </span>
                          ) : (
                            <span className="text-slate-400">
                              Execute <code className="text-[#00ff99]">{activeLab.requiredCommand || activeLab.toolName || (activeLab as any).tool}</code> in the terminal to complete this objective.
                            </span>
                          )}
                        </div>
                      )}

                      {/* ANSWER SECTION */}
                      {!isCommandObjective && (
                        <div className="mt-3 ml-7 space-y-2">
                          <input
                            type="text"
                            value={answers[index] || ''}
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
                              ? '✓ ANSWER CORRECT'
                              : 'SUBMIT ANSWER'}
                          </button>

                          {status === 'correct' && (
                            <div className="text-[#00ff99] font-bold text-[10px]">
                              ✓ Correct! Your answer matches the information found in the real command output.
                            </div>
                          )}

                          {status === 'incorrect' && (
                            <div className="text-rose-400 font-bold text-[10px]">
                              ✗ Incorrect. Review the command output and try again.
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

          {/* TAB 2: HINTS */}
          {activeLeftTab === 'hints' && (
            <div className="space-y-3 font-mono text-xs">
              {(activeLab.hints || []).map((hint, i) => (
                <div
                  key={i}
                  className="p-3 rounded bg-amber-500/10 border border-amber-500/30 text-amber-200 flex items-start gap-2"
                >
                  <HelpCircle size={16} className="shrink-0 text-amber-400 mt-0.5" />
                  <span>{hint}</span>
                </div>
              ))}
              {(activeLab.hints || []).length === 0 && (
                <div className="text-xs font-mono text-slate-500">
                  No hints recorded for this lab mission.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: AI EVALUATION */}
          {activeLeftTab === 'aiEval' && (
            <div className="space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-[#7efeff] font-bold uppercase flex items-center gap-1.5">
                  <Bot size={15} />
                  ForenX AI Mission Evaluation
                </span>

                <button
                  onClick={handleRunAiEvaluation}
                  disabled={loadingAiEvaluation}
                  className="text-[11px] text-[#00ff99] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw size={12} /> Re-evaluate
                </button>
              </div>

              {loadingAiEvaluation && (
                <div className="py-12 flex flex-col items-center justify-center gap-3 text-[#7efeff]">
                  <Loader2 size={24} className="animate-spin" />
                  <span>AI is assessing your command outputs and progress...</span>
                </div>
              )}

              {aiEvaluationError && (
                <div className="p-3.5 rounded bg-red-950/40 border border-red-500/40 text-red-300">
                  {aiEvaluationError}
                </div>
              )}

              {aiEvaluationResult && !loadingAiEvaluation && (
                <div className="space-y-4">
                  {/* Performance Summary */}
                  <div className="p-4 rounded-lg border border-[#00ff99]/40 bg-[#021f14]/80 space-y-2">
                    <div className="text-[#00ff99] font-bold text-xs uppercase flex items-center justify-between">
                      <span>Performance Summary</span>
                      {aiEvaluationResult.lab?.percentage !== undefined && (
                        <span className="text-white bg-[#00ff99]/20 px-2 py-0.5 rounded text-[11px]">
                          {aiEvaluationResult.lab.percentage}% Score
                        </span>
                      )}
                    </div>
                    <p className="text-slate-200 leading-relaxed text-xs">
                      {aiEvaluationResult.evaluation.performanceSummary}
                    </p>
                  </div>

                  {/* Strengths */}
                  {(aiEvaluationResult.evaluation.strengths || []).length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[#00ff99] font-bold uppercase text-[11px]">Strengths:</span>
                      <ul className="space-y-1 text-slate-300 list-disc list-inside">
                        {aiEvaluationResult.evaluation.strengths.map((s, idx) => (
                          <li key={idx}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Areas for Improvement & Detected Mistakes */}
                  {((aiEvaluationResult.evaluation.detectedMistakes || []).length > 0 || (aiEvaluationResult.evaluation.areasForImprovement || []).length > 0) && (
                    <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-500/30 space-y-1.5">
                      <span className="text-amber-400 font-bold uppercase text-[11px] flex items-center gap-1">
                        <AlertTriangle size={13} /> Guidance & Mistakes to Correct:
                      </span>
                      <ul className="space-y-1 text-slate-300 list-disc list-inside">
                        {[
                          ...(aiEvaluationResult.evaluation.detectedMistakes || []),
                          ...(aiEvaluationResult.evaluation.areasForImprovement || [])
                        ].map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Next Steps */}
                  {(aiEvaluationResult.evaluation.nextSteps || []).length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[#7efeff] font-bold uppercase text-[11px]">Recommended Next Steps:</span>
                      <ul className="space-y-1 text-slate-300 list-disc list-inside">
                        {aiEvaluationResult.evaluation.nextSteps.map((step, idx) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* COMPLETED BANNER */}
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
