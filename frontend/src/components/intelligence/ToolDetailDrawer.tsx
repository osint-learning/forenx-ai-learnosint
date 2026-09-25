import React, { useState, useEffect } from 'react';
import type { OsintTool, AiCommandSuggestionResponse, AiQuizQuestionItem, AiQuizEvaluationResponse } from '../../types';
import { GlassCard } from '../ui/GlassCard';
import { GlowButton } from '../ui/GlowButton';
import { Badge } from '../ui/Badge';
import { DynamicIcon } from '../../utils/iconHelper';
import {
  X,
  BookOpen,
  Copy,
  Check,
  Play,
  HelpCircle,
  Sparkles,
  Bot,
  Loader2,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { OsintService } from '../../services/api';
import { LessonViewer } from "./LessonViewer";

interface ToolDetailDrawerProps {
  tool: OsintTool | null;
  onClose: () => void;
}

export const ToolDetailDrawer: React.FC<ToolDetailDrawerProps> = ({ tool, onClose }) => {
  const navigate = useNavigate();
  const [copiedCmdIndex, setCopiedCmdIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'commands' | 'quiz'>('info');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});  
  const [lessons, setLessons] = useState<any[]>([]);
  const [quiz, setQuiz] = useState<any[]>([]);
  const [originalQuiz, setOriginalQuiz] = useState<any[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [selectedLesson, setSelectedLesson] = useState<any | null>(null);

  // ============================================================
  // PHASE 10: AI COMMAND SUGGESTION STATE
  // ============================================================
  const [cmdObjective, setCmdObjective] = useState('');
  const [loadingCmdSuggestion, setLoadingCmdSuggestion] = useState(false);
  const [cmdSuggestion, setCmdSuggestion] = useState<AiCommandSuggestionResponse['suggestion'] | null>(null);
  const [cmdSuggestionError, setCmdSuggestionError] = useState<string | null>(null);
  const [copiedAiCmd, setCopiedAiCmd] = useState(false);

  // ============================================================
  // PHASE 10: AI DYNAMIC QUIZ STATE
  // ============================================================
  const [quizMode, setQuizMode] = useState<'static' | 'ai'>('static');
  const [aiQuizDifficulty, setAiQuizDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [generatingAiQuiz, setGeneratingAiQuiz] = useState(false);
  const [aiQuizQuestions, setAiQuizQuestions] = useState<AiQuizQuestionItem[]>([]);
  const [aiSelectedAnswers, setAiSelectedAnswers] = useState<Record<number, number>>({});
  const [evaluatingAiQuiz, setEvaluatingAiQuiz] = useState(false);
  const [aiQuizEvaluation, setAiQuizEvaluation] = useState<AiQuizEvaluationResponse | null>(null);
  const [aiQuizError, setAiQuizError] = useState<string | null>(null);

  useEffect(() => {
    if (!tool) return;

    setSelectedAnswers({});
    setSubmitted(false);
    setScore(0);
    setActiveTab('info');
    setCmdObjective('');
    setCmdSuggestion(null);
    setCmdSuggestionError(null);
    setQuizMode('static');
    setAiQuizQuestions([]);
    setAiSelectedAnswers({});
    setAiQuizEvaluation(null);
    setAiQuizError(null);

    const loadData = async () => {
      try {
        const lessonsData = await OsintService.getLessons(tool.id);
        setLessons(lessonsData);

        const quizData = await OsintService.getQuiz(tool.id);
        setOriginalQuiz(quizData);
        setQuiz(shuffleQuiz(quizData));
      } catch (err) {
        console.error(err);
      }
    };

    loadData();
  }, [tool]); 

  const shuffleQuiz = (quizData: any[]) => {
    const selectedQuestions = [...quizData]
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);

    const shuffledQuestions = selectedQuestions.map((q) => {
      const correctOption = q.options[q.correctAnswerIndex];
      const shuffledOptions = [...q.options].sort(() => Math.random() - 0.5);

      return {
        ...q,
        options: shuffledOptions,
        correctAnswerIndex: shuffledOptions.indexOf(correctOption),
      };
    });

    return shuffledQuestions.sort(() => Math.random() - 0.5);
  };

  if (!tool) return null;

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedCmdIndex(index);
    setTimeout(() => setCopiedCmdIndex(null), 2000);
  };

  const handleCopyAiCommand = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAiCmd(true);
    setTimeout(() => setCopiedAiCmd(false), 2000);
  };

  const handleLaunchLab = () => {
    onClose();
    const toolParam = encodeURIComponent(tool.name || '');
    const toolIdParam = encodeURIComponent(tool.id || (tool as any)._id || '');
    navigate(`/practice-labs?tool=${toolParam}&toolId=${toolIdParam}`);
  };

  // Handle AI Command Suggestion
  const handleAskAiCommand = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!cmdObjective.trim()) return;

    try {
      setLoadingCmdSuggestion(true);
      setCmdSuggestionError(null);
      setCmdSuggestion(null);

      const res = await OsintService.suggestCommand(tool.name, cmdObjective.trim());
      if (res.success && res.suggestion) {
        setCmdSuggestion(res.suggestion);
      } else {
        setCmdSuggestionError(res.message || 'Unable to suggest a command.');
      }
    } catch (err: any) {
      console.error('AI Command Suggestion Error:', err);
      setCmdSuggestionError(err?.response?.data?.message || err?.message || 'Failed to suggest command. Ensure Ollama is active.');
    } finally {
      setLoadingCmdSuggestion(false);
    }
  };

  // Handle AI Dynamic Quiz Generation
  const handleGenerateAiQuiz = async () => {
    try {
      setGeneratingAiQuiz(true);
      setAiQuizError(null);
      setAiQuizEvaluation(null);
      setAiSelectedAnswers({});

      const res = await OsintService.generateAIQuiz(tool.name, aiQuizDifficulty, 5);
      if (res.success && res.quiz?.questions?.length) {
        setAiQuizQuestions(res.quiz.questions);
      } else {
        setAiQuizError(res.message || 'Failed to generate AI quiz.');
      }
    } catch (err: any) {
      console.error('AI Quiz Generation Error:', err);
      setAiQuizError(err?.response?.data?.message || err?.message || 'Failed to generate AI quiz.');
    } finally {
      setGeneratingAiQuiz(false);
    }
  };

  // Handle AI Quiz Submission & Evaluation
  const handleEvaluateAiQuiz = async () => {
    if (Object.keys(aiSelectedAnswers).length < aiQuizQuestions.length) {
      alert(`Please answer all ${aiQuizQuestions.length} questions before submitting for AI evaluation.`);
      return;
    }

    try {
      setEvaluatingAiQuiz(true);
      setAiQuizError(null);

      const answersPayload = aiQuizQuestions.map((_, idx) => {
        return aiSelectedAnswers[idx] ?? 0;
      });

      const res = await OsintService.evaluateAIQuiz(tool.name, aiQuizQuestions, answersPayload);
      if (res.success) {
        const normalizedEval: any = {
          ...res,
          score: res.score || {
            correctAnswers: (res as any).evaluation?.score ?? 0,
            totalQuestions: (res as any).evaluation?.totalQuestions ?? aiQuizQuestions.length,
            percentage: (res as any).evaluation?.percentage ?? 0,
            passed: ((res as any).evaluation?.percentage ?? 0) >= 70,
          },
          feedback: res.feedback || {
            overallPerformance: (res as any).evaluation?.feedback?.summary || (res as any).evaluation?.performance || "Quiz evaluation completed.",
            strengths: (res as any).evaluation?.feedback?.strengths || [],
            misconceptions: (res as any).evaluation?.feedback?.areasToImprove || [],
            nextStudySteps: (res as any).evaluation?.feedback?.learningAdvice || [],
          },
        };
        setAiQuizEvaluation(normalizedEval);
      } else {
        setAiQuizError(res.message || 'Failed to evaluate quiz.');
      }
    } catch (err: any) {
      console.error('AI Quiz Evaluation Error:', err);
      setAiQuizError(err?.response?.data?.message || err?.message || 'Failed to evaluate AI quiz.');
    } finally {
      setEvaluatingAiQuiz(false);
    }
  };

  return (
    <>
      <div className="fixed inset-y-0 right-0 w-full max-w-xl bg-[#030303]/90 backdrop-blur-2xl border-l border-[#00ff99]/30 z-[9999] shadow-[0_0_50px_rgba(0,255,153,0.2)] flex flex-col transition-all duration-300">
        {/* Drawer Header */}
        <div className="p-6 border-b border-[#00ff99]/20 flex items-center justify-between bg-[#052d1d]/40">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-[#00ff99]/10 border border-[#00ff99]/40 text-[#00ff99]">
              <DynamicIcon name={tool.icon} size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold font-mono text-white tracking-wide">{tool.name}</h3>
                <Badge variant="emerald">{tool.difficulty}</Badge>
              </div>
              <p className="text-xs font-mono text-[#7efeff]">{tool.category}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#00ff99]/20 bg-black/40 px-6">
          {(['info', 'commands', 'quiz'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-mono text-xs uppercase font-bold tracking-wider transition-all border-b-2 cursor-pointer ${
                activeTab === tab
                  ? 'border-[#00ff99] text-[#00ff99] bg-[#00ff99]/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab === 'info' && 'Overview'}
              {tab === 'commands' && 'Commands & AI'}
              {tab === 'quiz' && 'Knowledge Quiz'}
            </button>
          ))}
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'info' && (
            <>
              {/* Tagline & Description */}
              <div>
                <h4 className="text-sm font-mono text-[#00ff99] mb-1">{tool.tagline}</h4>
                <p className="text-slate-300 text-sm leading-relaxed">{tool.description}</p>
              </div>

              {/* Purpose & Usage */}
              <GlassCard className="p-4 space-y-3">
                <div>
                  <span className="text-xs font-mono text-slate-400 uppercase">Operational Purpose:</span>
                  <p className="text-slate-200 text-xs mt-1">{tool.purpose}</p>
                </div>
                <div>
                  <span className="text-xs font-mono text-slate-400 uppercase">When to Deploy:</span>
                  <p className="text-slate-200 text-xs mt-1">{tool.whenToUse}</p>
                </div>
              </GlassCard>

              {/* Advantages & Limitations */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-xs font-mono text-[#00ff99] uppercase">Capabilities:</span>
                  <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                    {tool.advantages.map((adv, idx) => (
                      <li key={idx}>{adv}</li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-2">
                  <span className="text-xs font-mono text-amber-400 uppercase">Limitations:</span>
                  <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                    {tool.limitations.map((lim, idx) => (
                      <li key={idx}>{lim}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Lessons Linked */}
              <div>
                <h4 className="text-xs font-mono uppercase text-[#7efeff] tracking-wider mb-3">
                  Available Guided Lessons
                </h4>
                <ul className="space-y-2">
                  {lessons.map((lesson) => (
                    <li
                      key={lesson._id}
                      onClick={() => setSelectedLesson(lesson)}
                      className="flex items-center gap-2 text-sm text-slate-300 bg-white/5 p-2.5 rounded-lg cursor-pointer hover:bg-[#00ff99]/10 hover:border-[#00ff99]/30 transition-all"
                    >
                      <BookOpen size={16} className="text-[#7efeff]" />
                      <span>
                        Lesson {lesson.lessonNumber}: {lesson.title}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {activeTab === 'commands' && (
            <div className="space-y-6">
              {/* ==================================================
                  AI COMMAND SUGGESTION ASSISTANT (PHASE 10)
              =================================================== */}
              <GlassCard glow="emerald" className="p-4 border border-[#00ff99]/40 bg-[#021a0f]/80 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-[#00ff99]/20 text-[#00ff99]">
                    <Bot size={16} />
                  </div>
                  <div>
                    <h4 className="font-mono font-bold text-white text-xs flex items-center gap-1.5">
                      Ask AI for {tool.name} Command
                      <span className="text-[10px] text-[#00ff99] font-normal">// Non-Hallucinatory</span>
                    </h4>
                  </div>
                </div>

                <form onSubmit={handleAskAiCommand} className="flex gap-2">
                  <input
                    type="text"
                    placeholder={`e.g., "Enumerate all domains recursively" or "Scan specific target"`}
                    value={cmdObjective}
                    onChange={(e) => setCmdObjective(e.target.value)}
                    className="flex-1 bg-black/60 border border-white/15 focus:border-[#00ff99] rounded-lg px-3 py-2 text-xs text-white font-mono placeholder:text-slate-500 focus:outline-none"
                  />
                  <GlowButton
                    type="submit"
                    variant="primary"
                    disabled={loadingCmdSuggestion || !cmdObjective.trim()}
                    icon={loadingCmdSuggestion ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
                    className="!py-2 !px-3 text-xs"
                  >
                    {loadingCmdSuggestion ? 'Finding...' : 'Suggest'}
                  </GlowButton>
                </form>

                {cmdSuggestionError && (
                  <div className="p-2.5 rounded bg-red-950/40 border border-red-500/40 text-red-300 font-mono text-[11px]">
                    {cmdSuggestionError}
                  </div>
                )}

                {cmdSuggestion && (
                  <div className="p-3 rounded-xl bg-black/80 border border-[#00ff99]/40 space-y-2 mt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-bold text-[#7efeff]">
                        AI SUGGESTED COMMAND:
                      </span>
                      <button
                        onClick={() => handleCopyAiCommand(cmdSuggestion.command)}
                        className="p-1 rounded bg-white/5 hover:bg-white/15 text-slate-300 hover:text-[#00ff99] transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-mono"
                      >
                        {copiedAiCmd ? <Check size={13} className="text-[#00ff99]" /> : <Copy size={13} />}
                        {copiedAiCmd ? 'Copied' : 'Copy'}
                      </button>
                    </div>

                    <div className="bg-black p-2.5 rounded font-mono text-xs text-[#00ff99] border border-[#00ff99]/30">
                      <code>{cmdSuggestion.command}</code>
                    </div>

                    <div className="text-[11px] font-mono text-slate-300">
                      <span className="text-[#00ff99]">Purpose: </span>{cmdSuggestion.purpose}
                    </div>

                    <div className="text-[11px] font-mono text-slate-400">
                      <span className="text-slate-300">Explanation: </span>{cmdSuggestion.explanation}
                    </div>
                  </div>
                )}
              </GlassCard>

              {/* Standard Tool Commands */}
              <div className="space-y-4">
                <h4 className="text-xs font-mono uppercase text-[#00ff99] tracking-wider">
                  Standard Built-in Commands ({tool.commands.length})
                </h4>

                {tool.commands.map((cmd, idx) => (
                  <GlassCard key={idx} className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-[#7efeff]">{cmd.description}</span>
                      <button
                        onClick={() => handleCopy(cmd.command, idx)}
                        className="p-1.5 rounded bg-white/5 hover:bg-white/15 text-slate-300 hover:text-[#00ff99] transition-colors cursor-pointer"
                      >
                        {copiedCmdIndex === idx ? <Check size={14} className="text-[#00ff99]" /> : <Copy size={14} />}
                      </button>
                    </div>
                    <div className="bg-black/90 p-3 rounded font-mono text-xs text-[#00ff99] border border-[#00ff99]/20">
                      <code>{cmd.command}</code>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 font-mono">Expected Output Sample:</span>
                      <div className="bg-black/50 p-2.5 rounded text-[11px] font-mono text-slate-300 mt-1 whitespace-pre-wrap">
                        {cmd.expectedOutput}
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>

              {tool.examples.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-xs font-mono uppercase text-[#00ff99] tracking-wider mb-3">
                    Practical Usage Examples
                  </h4>
                  <div className="space-y-4">
                    {tool.examples.map((example: any, index) => (
                      <GlassCard key={index} className="p-4 space-y-2">
                        <div className="text-[#7efeff] text-sm font-mono">
                          {example.title}
                        </div>
                        <div className="bg-black/90 p-3 rounded font-mono text-xs text-[#00ff99] border border-[#00ff99]/20">
                          <code>{example.command}</code>
                        </div>
                        <div className="bg-black/50 p-3 rounded text-xs text-slate-300 whitespace-pre-wrap">
                          {example.output}
                        </div>
                      </GlassCard>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'quiz' && (
            <div className="space-y-6">
              {/* Quiz Mode Switcher */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-black/60 border border-white/10">
                <button
                  type="button"
                  onClick={() => setQuizMode('static')}
                  className={`flex-1 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    quizMode === 'static'
                      ? 'bg-[#00ff99]/20 text-[#00ff99] border border-[#00ff99]/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Standard Quiz ({quiz.length} Qs)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setQuizMode('ai');
                    if (aiQuizQuestions.length === 0) {
                      handleGenerateAiQuiz();
                    }
                  }}
                  className={`flex-1 py-2 rounded-lg text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    quizMode === 'ai'
                      ? 'bg-[#7efeff]/20 text-[#7efeff] border border-[#7efeff]/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sparkles size={13} />
                  AI Dynamic Quiz (Ollama)
                </button>
              </div>

              {/* ==================================================
                  MODE 1: AI DYNAMIC QUIZ (PHASE 10)
              =================================================== */}
              {quizMode === 'ai' && (
                <div className="space-y-5">
                  <GlassCard glow="cyan" className="p-4 border border-[#7efeff]/30 bg-[#02181a]/80 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                          <Bot size={15} className="text-[#7efeff]" />
                          Dynamic AI Quiz Generator for {tool.name}
                        </h4>
                        <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                          Generates unique questions and evaluates misconceptions using Ollama.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={aiQuizDifficulty}
                          onChange={(e: any) => setAiQuizDifficulty(e.target.value)}
                          className="bg-black/80 border border-white/20 rounded-lg px-2.5 py-1.5 text-xs text-[#7efeff] font-mono focus:outline-none"
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>

                        <GlowButton
                          variant="secondary"
                          onClick={handleGenerateAiQuiz}
                          disabled={generatingAiQuiz}
                          icon={generatingAiQuiz ? <Loader2 size={13} className="animate-spin" /> : <RotateCcw size={13} />}
                          className="!py-1.5 !px-3 text-xs"
                        >
                          {generatingAiQuiz ? 'Generating...' : 'New Quiz'}
                        </GlowButton>
                      </div>
                    </div>
                  </GlassCard>

                  {generatingAiQuiz && (
                    <div className="py-12 flex flex-col items-center justify-center gap-3 text-[#7efeff] font-mono text-xs">
                      <Loader2 size={24} className="animate-spin" />
                      <span>Generating customized questions for {tool.name}...</span>
                    </div>
                  )}

                  {aiQuizError && (
                    <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 font-mono text-xs">
                      {aiQuizError}
                    </div>
                  )}

                  {/* AI Evaluation Results Panel */}
                  {aiQuizEvaluation && (
                    <GlassCard glow="emerald" className="p-5 border border-[#00ff99]/50 bg-[#021f12]/90 space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-[#00ff99]/30">
                        <div>
                          <div className="text-xs font-mono text-slate-400 uppercase">AI Evaluation Results</div>
                          <h3 className="text-lg font-bold text-white font-mono mt-0.5">
                            Score: {aiQuizEvaluation.score?.correctAnswers ?? 0} / {aiQuizEvaluation.score?.totalQuestions ?? aiQuizQuestions.length} ({aiQuizEvaluation.score?.percentage ?? 0}%)
                          </h3>
                        </div>
                        <Badge variant={aiQuizEvaluation.score?.passed ? "emerald" : "warning"}>
                          {aiQuizEvaluation.score?.passed ? "PASSED" : "NEEDS REVIEW"}
                        </Badge>
                      </div>

                      <div className="text-xs font-mono text-slate-200 leading-relaxed">
                        <span className="text-[#00ff99] font-bold">Summary: </span>
                        {aiQuizEvaluation.feedback?.overallPerformance || "Evaluation completed."}
                      </div>

                      {Array.isArray(aiQuizEvaluation.feedback?.strengths) && aiQuizEvaluation.feedback.strengths.length > 0 && (
                        <div className="space-y-1">
                          <span className="text-[11px] font-mono text-[#00ff99] uppercase font-bold">Identified Strengths:</span>
                          <ul className="text-xs font-mono text-slate-300 space-y-1 list-disc list-inside">
                            {aiQuizEvaluation.feedback.strengths.map((s, idx) => (
                              <li key={idx}>{s}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {Array.isArray(aiQuizEvaluation.feedback?.misconceptions) && aiQuizEvaluation.feedback.misconceptions.length > 0 && (
                        <div className="space-y-1 p-3 rounded-lg bg-amber-950/30 border border-amber-500/30">
                          <span className="text-[11px] font-mono text-amber-400 uppercase font-bold flex items-center gap-1">
                            <AlertTriangle size={13} /> Misconceptions to Address:
                          </span>
                          <ul className="text-xs font-mono text-slate-300 space-y-1 list-disc list-inside mt-1">
                            {aiQuizEvaluation.feedback.misconceptions.map((m, idx) => (
                              <li key={idx}>{m}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {Array.isArray(aiQuizEvaluation.feedback?.nextStudySteps) && aiQuizEvaluation.feedback.nextStudySteps.length > 0 && (
                        <div className="space-y-1">
                          <span className="text-[11px] font-mono text-[#7efeff] uppercase font-bold">Recommended Next Steps:</span>
                          <ul className="text-xs font-mono text-slate-300 space-y-1 list-disc list-inside">
                            {aiQuizEvaluation.feedback.nextStudySteps.map((step, idx) => (
                              <li key={idx}>{step}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </GlassCard>
                  )}

                  {/* AI Questions Feed */}
                  {!generatingAiQuiz && aiQuizQuestions.length > 0 && (
                    <div className="space-y-4">
                      {aiQuizQuestions.map((q, qIdx) => {
                        // isAnswered checked via aiSelectedAnswers
                        return (
                          <GlassCard key={qIdx} className="p-5 space-y-4">
                            <div className="flex items-start gap-2 text-[#7efeff]">
                              <span className="px-2 py-0.5 rounded bg-[#7efeff]/10 border border-[#7efeff]/30 text-[10px] font-mono">
                                Q{qIdx + 1}
                              </span>
                              <h4 className="font-semibold text-white text-sm">{q.question}</h4>
                            </div>

                            <div className="space-y-2">
                              {(q.options || []).map((opt: string, oIdx: number) => {
                                const isSelected = aiSelectedAnswers[qIdx] === oIdx;
                                return (
                                  <button
                                    key={oIdx}
                                    onClick={() => {
                                      if (aiQuizEvaluation) return;
                                      setAiSelectedAnswers((prev) => ({
                                        ...prev,
                                        [qIdx]: oIdx,
                                      }));
                                    }}
                                    className={`w-full text-left p-3 rounded-lg text-xs font-mono transition-all border cursor-pointer ${
                                      aiQuizEvaluation
                                        ? oIdx === q.correctAnswerIndex
                                          ? 'bg-[#00ff99]/20 border-[#00ff99] text-[#00ff99]'
                                          : isSelected
                                            ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                                            : 'bg-white/5 border-white/10 text-slate-300'
                                        : isSelected
                                          ? 'bg-[#7efeff]/15 border-[#7efeff]/60 text-white'
                                          : 'bg-white/5 border-white/10 hover:border-[#7efeff]/40 text-slate-300'
                                    }`}
                                  >
                                    {oIdx + 1}. {opt}
                                  </button>
                                );
                              })}
                            </div>

                            {aiQuizEvaluation && (
                              <div className="p-3 rounded bg-black/60 border border-[#7efeff]/30 text-xs text-slate-300 font-mono">
                                <span className="text-[#7efeff] font-bold">Explanation: </span>
                                {q.explanation}
                              </div>
                            )}
                          </GlassCard>
                        );
                      })}

                      {aiQuizEvaluation ? (
                        <button
                          onClick={handleGenerateAiQuiz}
                          className="w-full mt-4 rounded-lg bg-[#7efeff] text-black font-semibold py-3 hover:brightness-110 transition cursor-pointer"
                        >
                          Generate Another AI Quiz
                        </button>
                      ) : (
                        <button
                          onClick={handleEvaluateAiQuiz}
                          disabled={evaluatingAiQuiz}
                          className="w-full mt-4 rounded-lg bg-[#00ff99] text-black font-semibold py-3 hover:brightness-110 transition cursor-pointer flex items-center justify-center gap-2"
                        >
                          {evaluatingAiQuiz && <Loader2 size={16} className="animate-spin" />}
                          {evaluatingAiQuiz ? 'AI is Evaluating Answers...' : 'Submit to AI for Evaluation'}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* ==================================================
                  MODE 2: STANDARD STATIC QUIZ (PRESERVED)
              =================================================== */}
              {quizMode === 'static' && (
                <div className="space-y-6">
                  {submitted && (
                    <div className="rounded-xl border border-[#00ff99]/30 bg-[#00ff99]/10 p-4 text-center">
                      <h3 className="text-lg font-bold text-[#00ff99]">
                        Score: {score} / {quiz.length}
                      </h3>
                      <p className="text-sm text-slate-300 mt-2">
                        {score === quiz.length
                          ? "Perfect Score!"
                          : score >= Math.ceil(quiz.length * 0.7)
                          ? "Passed!"
                          : "Keep Practicing!"}
                      </p>
                    </div>
                  )}            
                  {quiz.map((q) => (
                    <GlassCard key={q.id} className="p-5 space-y-4">
                      <div className="flex items-center gap-2 text-[#00ff99]">
                        <HelpCircle size={18} />
                        <h4 className="font-semibold text-white text-sm">{q.question}</h4>
                      </div>

                      <div className="space-y-2">
                        {(q.options || []).map((opt: string, oIdx: number) => (
                          <button
                            key={oIdx}
                            onClick={() => {
                              if (submitted) return;
                              setSelectedAnswers((prev) => ({
                                ...prev,
                                [q._id]: oIdx,
                              }));
                            }}
                            className={`w-full text-left p-3 rounded-lg text-xs font-mono transition-all border cursor-pointer ${
                              submitted
                                ? oIdx === q.correctAnswerIndex
                                  ? 'bg-[#00ff99]/20 border-[#00ff99] text-[#00ff99]'
                                  : selectedAnswers[q._id] === oIdx
                                    ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                                    : 'bg-white/5 border-white/10 text-slate-300'
                                : selectedAnswers[q._id] === oIdx
                                  ? 'bg-[#00ff99]/10 border-[#00ff99]/50 text-white'
                                  : 'bg-white/5 border-white/10 hover:border-[#00ff99]/40 text-slate-300'
                            }`}
                          >
                            {oIdx + 1}. {opt}
                          </button>
                        ))}
                      </div>

                      {submitted && (
                        <div className="p-3 rounded bg-black/60 border border-[#00ff99]/30 text-xs text-slate-300 font-mono">
                          <span className="text-[#00ff99] font-bold">Explanation: </span>
                          {q.explanation}
                        </div>
                      )}
                    </GlassCard>
                  ))}

                  {submitted ? (
                    <button
                      onClick={() => {
                        setSelectedAnswers({});
                        setSubmitted(false);
                        setScore(0);
                        setQuiz(shuffleQuiz(originalQuiz));
                      }}
                      className="w-full mt-4 rounded-lg bg-[#7efeff] text-black font-semibold py-3 hover:brightness-110 transition cursor-pointer"
                    >
                      Retry Quiz
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        if (Object.keys(selectedAnswers).length < quiz.length) {
                          alert("Please answer all 5 questions before submitting.");
                          return;
                        }

                        let total = 0;
                        quiz.forEach((q) => {
                          if (selectedAnswers[q._id] === q.correctAnswerIndex) {
                            total++;
                          }
                        });

                        setScore(total);
                        setSubmitted(true);
                      }}
                      className="w-full mt-4 rounded-lg bg-[#00ff99] text-black font-semibold py-3 hover:brightness-110 transition cursor-pointer"
                    >
                      Submit Answers
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-6 border-t border-[#00ff99]/20 bg-[#052d1d]/60 flex items-center justify-between gap-4">
          <GlowButton variant="ghost" onClick={onClose}>
            Close
          </GlowButton>
          <GlowButton variant="primary" icon={<Play size={16} />} onClick={handleLaunchLab}>
            Launch Practice Lab
          </GlowButton>
        </div>
      </div>

      {selectedLesson && (
        <LessonViewer
          lesson={selectedLesson}
          lessons={lessons}
          onClose={() => setSelectedLesson(null)}
          onSelectLesson={setSelectedLesson}
        />
      )}
    </>
  );
};

export default ToolDetailDrawer;
