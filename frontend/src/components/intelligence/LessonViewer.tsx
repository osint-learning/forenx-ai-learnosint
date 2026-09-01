import React, { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Terminal } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { GlowButton } from "../ui/GlowButton";
import { CheckCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const [completed, setCompleted] = useState(false);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    const loadCompletion = async () => {
      if (!lesson || !token) return;

      try {
        const completedStatus =
          await LessonProgressService.isLessonCompleted(
            lesson.tool,
            lesson._id,
            token
          );

        setCompleted(completedStatus);
      } catch (err) {
        console.error(err);
        setCompleted(false);
      }

      setSaving(false);
    };

    loadCompletion();
  }, [lesson, token]);
  if (!lesson) return null;

  const currentIndex = lessons.findIndex((l) => l._id === lesson._id);

  const previousLesson =
    currentIndex > 0 ? lessons[currentIndex - 1] : null;

  const nextLesson =
    currentIndex < lessons.length - 1
      ? lessons[currentIndex + 1]
      : null;
  const handleCompleteLesson = async () => {
    if (!lesson || !token) return;

    try {
      setSaving(true);

      await LessonProgressService.completeLesson(
        lesson._id,
        lesson.tool,
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
  return (
    <div className="fixed inset-0 z-[10000] bg-black/70 backdrop-blur-md flex justify-center items-center p-6">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[#00ff99]/30 bg-[#05140f] shadow-[0_0_40px_rgba(0,255,153,0.2)]">

        <div className="flex justify-between items-center p-6 border-b border-[#00ff99]/20">
          <div>
            <h2 className="text-2xl font-bold text-[#00ff99]">
              {lesson.title}
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              Estimated Time: {lesson.estimatedTime} min
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            <X size={22} />
          </button>
        </div>

        <div className="p-6 space-y-6">

          <GlassCard className="p-5">
            <h3 className="text-[#00ff99] font-bold mb-3">
              Objectives
            </h3>

            <ul className="list-disc ml-6 space-y-2 text-slate-300">
              {lesson.objectives.map((o: string) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
          </GlassCard>

          <GlassCard className="p-5">
            <h3 className="text-[#00ff99] font-bold mb-3">
              Lesson Content
            </h3>

            <p className="leading-8 text-slate-300 whitespace-pre-wrap">
              {lesson.content}
            </p>
          </GlassCard>

          <GlassCard className="p-5">
            <h3 className="text-[#00ff99] font-bold mb-3">
              Key Points
            </h3>

            <ul className="list-disc ml-6 space-y-2 text-slate-300">
              {lesson.keyPoints.map((p: string) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </GlassCard>

          <GlassCard className="p-5">
            <h3 className="text-[#00ff99] font-bold mb-3">
              Example
            </h3>

            <pre className="bg-black/50 p-4 rounded-lg text-[#00ff99] overflow-x-auto">
              {lesson.example}
            </pre>
          </GlassCard>

        </div>

<div className="p-6 border-t border-[#00ff99]/20 flex flex-wrap justify-between gap-4">

  <GlowButton
    variant="ghost"
    icon={<ChevronLeft size={18} />}
    disabled={!previousLesson}
    onClick={() =>
      previousLesson && onSelectLesson(previousLesson)
    }
  >
    Previous
  </GlowButton>

  <div className="flex flex-wrap gap-3">

    <GlowButton
      variant="primary"
      icon={<Terminal size={18} />}
      onClick={() => {
        navigate(
          `/practice-labs?tool=${encodeURIComponent(
            lesson.toolName || lesson.tool || ""
          )}`
        );
      }}
    >
      Practice Lab
    </GlowButton>

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

  </div>

  <GlowButton
    variant="primary"
    icon={<ChevronRight size={18} />}
    disabled={!nextLesson}
    onClick={() =>
      nextLesson && onSelectLesson(nextLesson)
    }
  >
    Next
  </GlowButton>

</div>

      </div>
    </div>
  );
};