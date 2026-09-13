import React, { useState, useEffect } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
} from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { GlowButton } from "../ui/GlowButton";
import { useAuth } from "../../context/AuthContext";
import * as LessonProgressService from "../../services/lessonProgressService";

interface LessonViewerProps {
  lesson: any;
  lessons: any[];
  onClose: () => void;
  onSelectLesson: (lesson: any) => void;
}

export const LessonViewer: React.FC<LessonViewerProps> = ({
  lesson,
  lessons,
  onClose,
  onSelectLesson,
}) => {
  const { token } = useAuth();

  const [completed, setCompleted] = useState(false);
  const [saving, setSaving] = useState(false);

  // --------------------------------------------------
  // LOAD LESSON COMPLETION STATUS
  // --------------------------------------------------
  useEffect(() => {
    const loadCompletion = async () => {
      if (!lesson || !token) return;

      try {
        const completedStatus =
          await LessonProgressService.isLessonCompleted(
            lesson.tool?._id || lesson.tool,
            lesson._id,
            token
          );

        setCompleted(completedStatus);
      } catch (err) {
        console.error("Failed to load lesson completion:", err);
        setCompleted(false);
      }

      setSaving(false);
    };

    loadCompletion();
  }, [lesson, token]);

  if (!lesson) return null;

  // --------------------------------------------------
  // LESSON NAVIGATION
  // --------------------------------------------------
  const currentIndex = lessons.findIndex(
    (l) => l._id === lesson._id
  );

  const previousLesson =
    currentIndex > 0 ? lessons[currentIndex - 1] : null;

  const nextLesson =
    currentIndex < lessons.length - 1
      ? lessons[currentIndex + 1]
      : null;

  // --------------------------------------------------
  // COMPLETE LESSON
  // --------------------------------------------------
  const handleCompleteLesson = async () => {
    if (!lesson || !token) return;

    try {
      setSaving(true);

      await LessonProgressService.completeLesson(
        lesson._id,
        lesson.tool?._id || lesson.tool,
        token
      );

      setCompleted(true);

      alert("Lesson completed!");
    } catch (err) {
      console.error(err);
      alert("Failed to save lesson progress.");
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------
  // SAFE ARRAYS
  // --------------------------------------------------
  const objectives = Array.isArray(lesson.objectives)
    ? lesson.objectives
    : [];

  const keyPoints = Array.isArray(lesson.keyPoints)
    ? lesson.keyPoints
    : [];

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------
  return (
    <div className="fixed inset-0 z-[10000] bg-black/70 backdrop-blur-md flex justify-center items-center p-4 sm:p-6">

      <div className="w-full max-w-5xl max-h-[92vh] overflow-hidden rounded-2xl border border-[#00ff99]/30 bg-[#05140f] shadow-[0_0_40px_rgba(0,255,153,0.2)] flex flex-col">

        {/* =====================================================
            HEADER
        ====================================================== */}
        <div className="flex justify-between items-center p-5 sm:p-6 border-b border-[#00ff99]/20 bg-[#052d1d]/30">

          <div className="min-w-0 pr-4">

            <div className="flex items-center gap-3 flex-wrap">

              <span className="text-[10px] sm:text-xs uppercase tracking-widest font-mono text-[#7efeff]">
                Lesson {lesson.lessonNumber || currentIndex + 1}
              </span>

              {lesson.difficulty && (
                <span className="px-2 py-1 rounded-md text-[10px] font-mono uppercase bg-[#00ff99]/10 border border-[#00ff99]/20 text-[#00ff99]">
                  {lesson.difficulty}
                </span>
              )}

            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-[#00ff99] mt-2 break-words">
              {lesson.title}
            </h2>

            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Estimated Time: {lesson.estimatedTime || "N/A"} min
            </p>

          </div>

          <button
            onClick={onClose}
            className="flex-shrink-0 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close lesson"
          >
            <X size={22} />
          </button>

        </div>

        {/* =====================================================
            MAIN SCROLLABLE CONTENT
        ====================================================== */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">

          {/* =================================================
              OBJECTIVES
          ================================================== */}
          {objectives.length > 0 && (
            <GlassCard className="p-5">

              <div className="flex items-center gap-2 mb-4">

                <div className="w-1 h-5 rounded-full bg-[#00ff99]" />

                <h3 className="text-[#00ff99] font-bold text-lg">
                  Learning Objectives
                </h3>

              </div>

              <ul className="space-y-3">

                {objectives.map((objective: string, index: number) => (
                  <li
                    key={`${objective}-${index}`}
                    className="flex items-start gap-3 text-sm text-slate-300 leading-relaxed"
                  >
                    <span className="flex-shrink-0 mt-1 w-5 h-5 rounded-full border border-[#00ff99]/40 bg-[#00ff99]/10 flex items-center justify-center text-[10px] text-[#00ff99]">
                      {index + 1}
                    </span>

                    <span>{objective}</span>
                  </li>
                ))}

              </ul>

            </GlassCard>
          )}

          {/* =================================================
              LESSON CONTENT
          ================================================== */}
          <GlassCard className="p-5 sm:p-6">

            <div className="flex items-center gap-2 mb-5">

              <div className="w-1 h-5 rounded-full bg-[#00ff99]" />

              <h3 className="text-[#00ff99] font-bold text-lg">
                Lesson Content
              </h3>

            </div>

            {/* 
              IMPORTANT:
              lesson.content contains HTML such as:

              <h2>Basic Usage</h2>
              <p>...</p>
              <h3>Common Commands</h3>
              <pre>subfinder -d example.com</pre>

              dangerouslySetInnerHTML tells React to render
              that HTML instead of displaying the tags as text.
            */}
            <div
              className="
                lesson-content

                text-slate-300
                text-sm
                sm:text-[15px]
                leading-7

                [&_h1]:text-2xl
                [&_h1]:font-bold
                [&_h1]:text-white
                [&_h1]:mt-8
                [&_h1]:mb-4

                [&_h2]:text-xl
                [&_h2]:font-bold
                [&_h2]:text-[#00ff99]
                [&_h2]:mt-8
                [&_h2]:mb-4
                [&_h2]:pb-2
                [&_h2]:border-b
                [&_h2]:border-[#00ff99]/20

                [&_h3]:text-lg
                [&_h3]:font-semibold
                [&_h3]:text-[#7efeff]
                [&_h3]:mt-7
                [&_h3]:mb-3

                [&_h4]:text-base
                [&_h4]:font-semibold
                [&_h4]:text-white
                [&_h4]:mt-6
                [&_h4]:mb-2

                [&_p]:mb-5
                [&_p]:leading-8

                [&_strong]:text-white
                [&_strong]:font-semibold

                [&_em]:text-[#7efeff]

                [&_ul]:list-disc
                [&_ul]:pl-6
                [&_ul]:mb-5
                [&_ul]:space-y-2

                [&_ol]:list-decimal
                [&_ol]:pl-6
                [&_ol]:mb-5
                [&_ol]:space-y-2

                [&_li]:leading-7

                [&_blockquote]:border-l-2
                [&_blockquote]:border-[#00ff99]
                [&_blockquote]:pl-4
                [&_blockquote]:my-5
                [&_blockquote]:text-slate-400
                [&_blockquote]:italic

                [&_code]:text-[#00ff99]
                [&_code]:bg-black/60
                [&_code]:border
                [&_code]:border-[#00ff99]/20
                [&_code]:rounded
                [&_code]:px-1.5
                [&_code]:py-0.5
                [&_code]:font-mono
                [&_code]:text-xs

                [&_pre]:bg-black/90
                [&_pre]:border
                [&_pre]:border-[#00ff99]/20
                [&_pre]:rounded-xl
                [&_pre]:p-4
                [&_pre]:my-5
                [&_pre]:overflow-x-auto
                [&_pre]:text-[#00ff99]
                [&_pre]:font-mono
                [&_pre]:text-xs
                [&_pre]:leading-6
                [&_pre]:shadow-[inset_0_0_20px_rgba(0,255,153,0.04)]

                [&_pre_code]:bg-transparent
                [&_pre_code]:border-0
                [&_pre_code]:p-0
                [&_pre_code]:text-[#00ff99]

                [&_a]:text-[#7efeff]
                [&_a]:underline
                [&_a]:underline-offset-2
                [&_a]:hover:text-[#00ff99]

                [&_table]:w-full
                [&_table]:border-collapse
                [&_table]:my-6

                [&_th]:border
                [&_th]:border-white/10
                [&_th]:bg-[#00ff99]/10
                [&_th]:text-[#00ff99]
                [&_th]:p-3
                [&_th]:text-left

                [&_td]:border
                [&_td]:border-white/10
                [&_td]:p-3
                [&_td]:text-slate-300

                [&_hr]:border-white/10
                [&_hr]:my-8
              "
              dangerouslySetInnerHTML={{
                __html: lesson.content || "",
              }}
            />

          </GlassCard>

          {/* =================================================
              KEY POINTS
          ================================================== */}
          {keyPoints.length > 0 && (
            <GlassCard className="p-5">

              <div className="flex items-center gap-2 mb-4">

                <div className="w-1 h-5 rounded-full bg-[#7efeff]" />

                <h3 className="text-[#7efeff] font-bold text-lg">
                  Key Points
                </h3>

              </div>

              <ul className="space-y-3">

                {keyPoints.map((point: string, index: number) => (
                  <li
                    key={`${point}-${index}`}
                    className="flex items-start gap-3 text-sm text-slate-300 leading-relaxed bg-white/[0.03] border border-white/5 rounded-lg p-3"
                  >
                    <span className="text-[#00ff99] mt-0.5">
                      ✓
                    </span>

                    <span>{point}</span>
                  </li>
                ))}

              </ul>

            </GlassCard>
          )}

          {/* =================================================
              PRACTICAL EXAMPLE
          ================================================== */}
          {lesson.example && (
            <GlassCard className="p-5">

              <div className="flex items-center gap-2 mb-4">

                <div className="w-1 h-5 rounded-full bg-[#00ff99]" />

                <h3 className="text-[#00ff99] font-bold text-lg">
                  Practical Example
                </h3>

              </div>

              <pre className="bg-black/70 p-4 rounded-xl text-[#00ff99] overflow-x-auto border border-[#00ff99]/20 font-mono text-xs sm:text-sm leading-6 whitespace-pre-wrap">
                {lesson.example}
              </pre>

            </GlassCard>
          )}

          {/* =================================================
              LESSON PROGRESS
          ================================================== */}
          <div className="text-center text-xs text-slate-500 font-mono py-2">

            Lesson {currentIndex + 1} of {lessons.length}

            {completed && (
              <span className="ml-2 text-[#00ff99]">
                • Completed
              </span>
            )}

          </div>

        </div>

        {/* =====================================================
            FOOTER / NAVIGATION
        ====================================================== */}
        <div className="p-5 sm:p-6 border-t border-[#00ff99]/20 bg-[#052d1d]/60 flex flex-wrap justify-between items-center gap-4">

          {/* PREVIOUS */}
          <GlowButton
            variant="ghost"
            icon={<ChevronLeft size={18} />}
            disabled={!previousLesson}
            onClick={() => {
              if (previousLesson) {
                onSelectLesson(previousLesson);
              }
            }}
          >
            Previous
          </GlowButton>

          {/* COMPLETE */}
          <GlowButton
            variant="primary"
            icon={<CheckCircle size={18} />}
            onClick={handleCompleteLesson}
            disabled={completed || saving}
          >
            {completed
              ? "Completed ✓"
              : saving
              ? "Saving..."
              : "Mark as Complete"}
          </GlowButton>

          {/* NEXT */}
          <GlowButton
            variant="primary"
            icon={<ChevronRight size={18} />}
            disabled={!nextLesson}
            onClick={() => {
              if (nextLesson) {
                onSelectLesson(nextLesson);
              }
            }}
          >
            Next
          </GlowButton>

        </div>

      </div>
    </div>
  );
};