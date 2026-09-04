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
  const selectedTool =
    searchParams.get("tool")?.toUpperCase() || null;

  const { completeLab, completedLabIds } = useApp();

  // Labs loaded from MongoDB
  const [labs, setLabs] = useState<PracticeLab[]>([]);

  const [activeLab, setActiveLab] =
    useState<PracticeLab | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [objectivesState, setObjectivesState] =
    useState<PracticeLab["objectives"]>([]);

  const [activeLeftTab, setActiveLeftTab] =
    useState<'brief' | 'evidence' | 'hints'>('brief');

  const [isLabCompleted, setIsLabCompleted] =
    useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const [answerStatus, setAnswerStatus] = useState<
    Record<number, 'correct' | 'incorrect' | 'pending'>
  >({});

  const [evaluating, setEvaluating] = useState<number | null>(null);

  const [commandOutput, setCommandOutput] = useState<any>(null);
  // --------------------------------------------------
  // LOAD LABS FROM BACKEND
  // --------------------------------------------------

  useEffect(() => {
    loadLabs();
  }, []);

  const loadLabs = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await OsintService.getPracticeLabs();

      setLabs(data);

      // If a specific tool was requested,
      // find a lab for that tool.
      if (selectedTool) {
        const matchingLab = data.find(
          (lab) =>
            lab.toolName?.toUpperCase() === selectedTool ||
            lab.toolId?.toUpperCase() === selectedTool.toLowerCase() ||
            (lab as any).tool?.toUpperCase() === selectedTool
        );

        if (matchingLab) {
          setActiveLab(matchingLab);
          setObjectivesState(matchingLab.objectives || []);

          setIsLabCompleted(
            matchingLab.objectives.length > 0 &&
            matchingLab.objectives.every(
              objective => objective.completed
            )
          );

          return;
        }
      }

      // Otherwise use the first lab
      if (data.length > 0) {
        setActiveLab(data[0]);
        setObjectivesState(data[0].objectives || []);

        setIsLabCompleted(
          data[0].objectives.length > 0 &&
          data[0].objectives.every(
            objective => objective.completed
          )
        );
      }
    } catch (err) {
      console.error("Failed to load Practice Labs:", err);
      setError("Failed to load Practice Labs.");
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // HANDLE LAB SELECTION
  // --------------------------------------------------

  const handleLabSelect = (lab: PracticeLab) => {
    setActiveLab(lab);

    setObjectivesState(
      lab.objectives || []
    );

    setIsLabCompleted(
      completedLabIds.includes(lab.id)
    );

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

    // Only process successful backend commands
    if (!response?.success) {
      return;
    }

    // Store the REAL backend output
    setCommandOutput(response.data);

    // The first objective is command execution.
    // It becomes complete only after a successful command.
    const updated = objectivesState.map((obj, index) => {

      if (
        index === 0 &&
        response?.success
      ) {
        return {
          ...obj,
          completed: true
        };
      }

      return obj;
    });

    setObjectivesState(updated);
  };

const handleAnswerSubmit = async (
  objectiveIndex: number
) => {
  if (!activeLab) return;

  const answer = answers[objectiveIndex]?.trim();

  if (!answer) {
    return;
  }

  if (!commandOutput) {
    return;
  }

  try {
    setEvaluating(objectiveIndex);

    setAnswerStatus(prev => ({
      ...prev,
      [objectiveIndex]: 'pending'
    }));

    const result =
      await OsintService.evaluateLabAnswer(
        activeLab.id,
        objectiveIndex,
        answer,
        commandOutput
      );

    if (result.correct) {

      setAnswerStatus(prev => ({
        ...prev,
        [objectiveIndex]: 'correct'
      }));

      const updated =
        objectivesState.map((obj, index) => {

          if (index === objectiveIndex) {
            return {
              ...obj,
              completed: true
            };
          }

          return obj;
        });

      setObjectivesState(updated);

      // Check whether every objective is completed
      if (
        updated.length > 0 &&
        updated.every(obj => obj.completed) &&
        !isLabCompleted
      ) {
        setIsLabCompleted(true);

        completeLab(
          activeLab.id,
          activeLab.xpReward
        );

        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

    } else {

      setAnswerStatus(prev => ({
        ...prev,
        [objectiveIndex]: 'incorrect'
      }));

    }

  } catch (error) {

    console.error(
      "Answer evaluation failed:",
      error
    );

    setAnswerStatus(prev => ({
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
    console.error(
      "Failed to reset lab:",
      error
    );
  }
};
  // --------------------------------------------------
  // LOADING STATE
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">

          <Terminal
            size={40}
            className="mx-auto text-[#00ff99] mb-4"
          />

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

          <Terminal
            size={40}
            className="mx-auto text-red-400 mb-4"
          />

          <div className="text-xl font-semibold text-white font-mono">
            UNABLE TO LOAD PRACTICE LABS
          </div>

          <p className="text-sm text-red-400 mt-2 font-mono">
            {error}
          </p>

          <button
            onClick={loadLabs}
            className="mt-4 px-4 py-2 rounded border border-[#00ff99]/40 text-[#00ff99] font-mono text-sm hover:bg-[#00ff99]/10"
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

          <Terminal
            size={40}
            className="mx-auto text-slate-500 mb-4"
          />

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

      <GlassCard
        glow="emerald"
        className="max-w-xl w-full p-8 text-center space-y-6"
      >

        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-[#00ff99]/10 border border-[#00ff99] flex items-center justify-center">

            <CheckCircle2
              size={42}
              className="text-[#00ff99]"
            />

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
            Your progress has been saved. You can exit the lab or
            retry the investigation from the beginning.
          </p>

        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="px-5 py-3 rounded-lg border border-white/20 text-slate-300 font-mono text-xs font-bold hover:bg-white/5 transition-all"
          >
            EXIT LAB
          </button>

          <button
            type="button"
            onClick={handleRetryLab}
            className="px-5 py-3 rounded-lg bg-[#00ff99]/10 border border-[#00ff99]/40 text-[#00ff99] font-mono text-xs font-bold hover:bg-[#00ff99]/20 transition-all"
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

            <Terminal
              className="text-[#00ff99]"
              size={32}
            />

            PRACTICE LABS

            <span className="neon-text-emerald">
              // MISSION CONTROL
            </span>

          </h1>

          <p className="text-slate-400 font-mono text-xs sm:text-sm mt-1">
            Real interactive command terminal simulations & live objective verification.
          </p>

        </div>

        <div className="flex items-center gap-3">

          {selectedTool ? (

            <Badge variant="emerald">
              {selectedTool} PRACTICE
            </Badge>

          ) : (

            <span className="text-xs font-mono text-slate-400">
              CHALLENGE MODE
            </span>

          )}

        </div>

      </div>

      {/* --------------------------------------------------
          AVAILABLE LABS
      -------------------------------------------------- */}

      {!selectedTool && labs.length > 1 && (

        <div className="flex gap-3 overflow-x-auto pb-2">

          {labs.map((lab) => (

            <button
              key={lab.id}
              onClick={() => handleLabSelect(lab)}
              className={`min-w-[220px] text-left p-3 rounded-lg border transition-all ${
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
                {lab.difficulty} • +{lab.xpReward} XP
              </div>

            </button>

          ))}

        </div>

      )}

      {/* --------------------------------------------------
          SPLIT MISSION LAYOUT
      -------------------------------------------------- */}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* LEFT SIDE */}

        <GlassCard
          glow="emerald"
          className="lg:col-span-5 p-6 space-y-6"
        >

          <div className="flex items-center justify-between">

            <div className="space-y-1">

              <Badge variant="emerald">
                {activeLab.difficulty}
              </Badge>

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
              onClick={() => setActiveLeftTab('brief')}
              className={`px-3 py-2 border-b-2 transition-all cursor-pointer ${
                activeLeftTab === 'brief'
                  ? 'border-[#00ff99] text-[#00ff99]'
                  : 'border-transparent text-slate-400'
              }`}
            >
              Mission Brief
            </button>

            <button
              onClick={() => setActiveLeftTab('evidence')}
              className={`px-3 py-2 border-b-2 transition-all cursor-pointer ${
                activeLeftTab === 'evidence'
                  ? 'border-[#00ff99] text-[#00ff99]'
                  : 'border-transparent text-slate-400'
              }`}
            >
              Evidence ({activeLab.evidenceFiles?.length || 0})
            </button>

            <button
              onClick={() => setActiveLeftTab('hints')}
              className={`px-3 py-2 border-b-2 transition-all cursor-pointer ${
                activeLeftTab === 'hints'
                  ? 'border-[#00ff99] text-[#00ff99]'
                  : 'border-transparent text-slate-400'
              }`}
            >
              Hints
            </button>

          </div>

          {/* MISSION BRIEF */}

          {activeLeftTab === 'brief' && (

            <div className="space-y-4">

              <p className="text-xs font-mono text-slate-300 leading-relaxed bg-white/5 p-3 rounded-lg border border-white/5">
                {activeLab.missionBrief}
              </p>

              {/* OBJECTIVES */}

              <div className="space-y-3">

                <h4 className="text-xs font-mono font-bold text-[#00ff99] uppercase">
                  Mission Objectives
                </h4>

            {objectivesState.map((obj, index) => {

              const status =
                answerStatus[index];

              const isCommandObjective =
                obj.type === "command";

              const canAnswer =
                !isCommandObjective &&
                commandOutput &&
                objectivesState[index - 1]?.completed;

              return (
                <div
                  key={obj.id || index}
                  className={`p-4 rounded-lg border font-mono text-xs transition-all ${
                    obj.completed
                      ? 'bg-[#00ff99]/10 border-[#00ff99]'
                      : status === 'incorrect'
                      ? 'bg-rose-500/10 border-rose-500/50'
                      : 'bg-black/60 border-white/10'
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
                      ✓ Real command output received.
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

                          // Reset incorrect state when student edits answer
                          if (answerStatus[index] === 'incorrect') {
                            setAnswerStatus(prev => ({
                              ...prev,
                              [index]: 'pending'
                            }));
                          }
                        }}
                        disabled={
                          obj.completed ||
                          evaluating === index ||
                          !canAnswer
                        }
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
                        onClick={() =>
                          handleAnswerSubmit(index)
                        }
                        disabled={
                          !canAnswer ||
                          obj.completed ||
                          evaluating === index ||
                          !answers[index]?.trim()
                        }
                        className={`px-3 py-2 rounded-md text-[10px] font-mono font-bold transition-all ${
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


                      {/* CORRECT */}

                      {status === 'correct' && (

                        <div className="text-[#00ff99] font-bold text-[10px]">
                          ✓ Correct! Your answer matches the information
                          found in the real command output.
                        </div>

                      )}


                      {/* INCORRECT */}

                      {status === 'incorrect' && (

                        <div className="text-rose-400 font-bold text-[10px]">
                          ✕ Incorrect. Review the command output and try again.
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

              {(activeLab.evidenceFiles || []).map(
                (file, i) => (

                  <div
                    key={i}
                    className="bg-black/80 p-3 rounded border border-white/10 font-mono text-xs space-y-2"
                  >

                    <div className="flex items-center gap-2 text-[#7efeff]">

                      <FileText size={14} />

                      <span className="font-bold">
                        {file.name}
                      </span>

                    </div>

                    <pre className="text-[11px] text-slate-300 bg-white/5 p-2 rounded whitespace-pre-wrap">
                      {file.content}
                    </pre>

                  </div>

                )
              )}

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

              {(activeLab.hints || []).map(
                (hint, i) => (

                  <div
                    key={i}
                    className="p-3 rounded bg-amber-500/10 border border-amber-500/30 text-amber-200 flex items-start gap-2"
                  >

                    <HelpCircle
                      size={16}
                      className="shrink-0 text-amber-400 mt-0.5"
                    />

                    <span>
                      {hint}
                    </span>

                  </div>

                )
              )}

            </div>

          )}

          {/* COMPLETED */}

          {isLabCompleted && (

            <div className="p-4 rounded-xl bg-[#00ff99]/20 border border-[#00ff99] text-center font-mono space-y-2 animate-bounce">

              <Sparkles
                size={24}
                className="mx-auto text-[#00ff99]"
              />

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
            initialTarget={activeLab.targetDomainOrIp}
            practiceTool={
              selectedTool ||
              activeLab.toolName ||
              (activeLab as any).tool ||
              undefined
            }
            labId={activeLab.id}
            onCommandRun={handleCommandExecution}
          />

        </div>

      </div>

    </div>
  );
};