import React, { useState, useEffect } from 'react';
import type { OsintTool } from '../../types';
import { GlassCard } from '../ui/GlassCard';
import { GlowButton } from '../ui/GlowButton';
import { Badge } from '../ui/Badge';
import { DynamicIcon } from '../../utils/iconHelper';
import { X, BookOpen, Copy, Check, Play, HelpCircle } from 'lucide-react';
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
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});  const [showQuizResult, setShowQuizResult] = useState<boolean>(false);
  const [lessons, setLessons] = useState<any[]>([]);
  const [quiz, setQuiz] = useState<any[]>([]);
  const [originalQuiz, setOriginalQuiz] = useState<any[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [selectedLesson, setSelectedLesson] = useState<any | null>(null);
  useEffect(() => {
    if (!tool) return;

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
      const shuffledQuestions = [...quizData]
        .sort(() => Math.random() - 0.5)
        .map((q) => {
          const correctOption = q.options[q.correctAnswerIndex];

          const shuffledOptions = [...q.options].sort(
            () => Math.random() - 0.5
          );

          return {
            ...q,
            options: shuffledOptions,
            correctAnswerIndex: shuffledOptions.indexOf(correctOption),
          };
        });

      return shuffledQuestions;
    };

  if (!tool) return null;

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedCmdIndex(index);
    setTimeout(() => setCopiedCmdIndex(null), 2000);
  };

  const handleLaunchLab = () => {
    onClose();
    navigate('/practice-labs');
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
              <h2 className="text-2xl font-bold font-mono text-white tracking-wide">{tool.name}</h2>
              <Badge variant="emerald">{tool.difficulty}</Badge>
            </div>
            <p className="text-xs text-[#7efeff] font-mono mt-0.5">{tool.category}</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 bg-black/40 px-6">
        <button
          onClick={() => setActiveTab('info')}
          className={`px-4 py-3 text-sm font-mono font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'info' ? 'border-[#00ff99] text-[#00ff99]' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Overview & Install
        </button>
        <button
          onClick={() => setActiveTab('commands')}
          className={`px-4 py-3 text-sm font-mono font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'commands' ? 'border-[#00ff99] text-[#00ff99]' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Commands ({tool.commands.length})
        </button>
        <button
          onClick={() => setActiveTab('quiz')}
          className={`px-4 py-3 text-sm font-mono font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'quiz' ? 'border-[#00ff99] text-[#00ff99]' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Knowledge Check
        </button>
      </div>

      {/* Drawer Body Scroll Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">

        {activeTab === 'info' && (
          <>
          
      <h4 className="text-xs font-mono uppercase text-[#00ff99] tracking-wider mb-2">
        Purpose
      </h4>

      <p className="text-sm font-semibold text-slate-200">
        {tool.purpose}
      </p>
      <div>
        <h4 className="text-xs font-mono uppercase text-[#00ff99] tracking-wider mb-2">
          When To Use
        </h4>

        <p className="text-sm text-slate-300 leading-relaxed">
          {tool.whenToUse}
        </p>
      </div>
            <div>
              <h4 className="text-xs font-mono uppercase text-[#00ff99] tracking-wider mb-2">Description</h4>
              <p className="text-sm text-slate-300 leading-relaxed bg-white/5 p-4 rounded-lg border border-white/5">
                {tool.description}
              </p>
            </div>

            {/* Installation */}
            <div>
              <h4 className="text-xs font-mono uppercase text-[#00ff99] tracking-wider mb-2">Installation Guide</h4>
              <div className="relative bg-black/80 rounded-lg p-4 font-mono text-xs text-[#17ff88] border border-[#00ff99]/20 overflow-x-auto">
                <pre>{tool.installation}</pre>
              </div>
            </div>

            {/* Supported Platforms */}
            <div>
              <h4 className="text-xs font-mono uppercase text-[#00ff99] tracking-wider mb-2">
                Supported Platforms
              </h4>

              <div className="flex flex-wrap gap-2">
                {tool.supportedPlatforms.map((platform, index) => (
                  <Badge key={index} variant="cyan">
                    {platform}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-mono uppercase text-[#00ff99] tracking-wider mb-2">
                Related Tools
              </h4>

              <div className="flex flex-wrap gap-2">
                {tool.relatedTools.map((related, i) => (
                  <Badge key={i} variant="emerald">
                    {related}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-mono uppercase text-[#00ff99] tracking-wider mb-2">
                Advantages
              </h4>

              <ul className="space-y-2">
                {tool.advantages.map((item, index) => (
                  <li
                    key={index}
                    className="text-sm text-slate-300 bg-white/5 rounded-lg p-3"
                  >
                    • {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-mono uppercase text-[#00ff99] tracking-wider mb-2">
                Limitations
              </h4>

              <ul className="space-y-2">
                {tool.limitations.map((item, index) => (
                  <li
                    key={index}
                    className="text-sm text-slate-300 bg-white/5 rounded-lg p-3"
                  >
                    • {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-mono uppercase text-[#00ff99] tracking-wider mb-2">
                Best Practices
              </h4>

              <ul className="space-y-2">
                {tool.bestPractices.map((item, index) => (
                  <li
                    key={index}
                    className="text-sm text-slate-300 bg-white/5 rounded-lg p-3"
                  >
                    ✓ {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-mono uppercase text-[#00ff99] tracking-wider mb-2">
                Lessons Included
              </h4>

              <ul className="space-y-2">
                {lessons.map((lesson: any) => (
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
          <div className="space-y-4">
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
                  ${cmd.command}
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 font-mono">Expected Output Sample:</span>
                  <div className="bg-black/50 p-2.5 rounded text-[11px] font-mono text-slate-300 mt-1 whitespace-pre-wrap">
                    {cmd.expectedOutput}
                  </div>
                </div>
              </GlassCard>
            ))}

            {tool.examples.length > 0 && (
              <div className="mt-6">
                <h4 className="text-xs font-mono uppercase text-[#00ff99] tracking-wider mb-3">
                  Examples
                </h4>

                <div className="space-y-4">
                  {tool.examples.map((example: any, index) => (
                    <GlassCard key={index} className="p-4 space-y-2">
                      <div className="text-[#7efeff] text-sm font-mono">
                        {example.title}
                      </div>

                      <div className="bg-black/90 p-3 rounded font-mono text-xs text-[#00ff99] border border-[#00ff99]/20">
                        {example.command}
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
          {submitted && (
            <div className="rounded-xl border border-[#00ff99]/30 bg-[#00ff99]/10 p-4 text-center">
              <h3 className="text-lg font-bold text-[#00ff99]">
                Score: {score} / {quiz.length}
              </h3>

              <p className="text-sm text-slate-300 mt-2">
                {score === quiz.length
                  ? "🎉 Perfect Score!"
                  : score >= Math.ceil(quiz.length * 0.7)
                  ? "✅ Passed!"
                  : "❌ Keep Practicing!"}
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
                className="w-full mt-4 rounded-lg bg-[#7efeff] text-black font-semibold py-3 hover:brightness-110 transition"
              >
                Retry Quiz
              </button>
            ) : (
              <button
                onClick={() => {
                  let total = 0;

                  quiz.forEach((q) => {
                    if (selectedAnswers[q._id] === q.correctAnswerIndex) {
                      total++;
                    }
                  });

                  setScore(total);
                  setSubmitted(true);
                }}
                className="w-full mt-4 rounded-lg bg-[#00ff99] text-black font-semibold py-3 hover:brightness-110 transition"
              >
                Submit Answers
              </button>
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
