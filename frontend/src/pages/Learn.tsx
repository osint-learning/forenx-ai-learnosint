import React, { useEffect, useState } from "react";
import { GlassCard } from "../components/ui/GlassCard";
import { GlowButton } from "../components/ui/GlowButton";
import { Badge } from "../components/ui/Badge";
import {
  BookOpen,
  Clock,
  Play,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import * as LessonService from "../services/lessonService";

interface Lesson {
  _id: string;
  title: string;
  shortDescription: string;
  content: string;
  estimatedTime: number;
  difficulty: string;
  lessonNumber: number;
}

export const Learn: React.FC = () => {
  const navigate = useNavigate();

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLessons();
  }, []);

  const loadLessons = async () => {
    try {
      const res = await LessonService.getAllLessons();
      setLessons(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center text-[#00ff99] font-mono py-20">
        Loading lessons...
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <div className="border-b border-[#00ff99]/20 pb-6">
        <h1 className="text-3xl font-mono font-bold text-white uppercase flex items-center gap-3">
          <BookOpen className="text-[#00ff99]" />
          LEARN <span className="text-[#00ff99]">OSINT</span>
        </h1>

        <p className="text-slate-400 font-mono text-sm mt-2">
          Learn OSINT techniques from your MongoDB lesson database.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {lessons.map((lesson) => (

          <GlassCard
            key={lesson._id}
            glow="emerald"
            className="p-6 space-y-4"
          >

            <div className="flex items-center justify-between">

              <Badge variant="emerald">
                {lesson.difficulty}
              </Badge>

              <span className="text-xs text-slate-400">
                Lesson {lesson.lessonNumber}
              </span>

            </div>

            <h2 className="text-xl font-bold text-white">
              {lesson.title}
            </h2>

            <p className="text-sm text-slate-300">
              {lesson.shortDescription}
            </p>

            <div className="flex items-center gap-2 text-xs text-slate-400">

              <Clock size={14} />

              {lesson.estimatedTime} mins

            </div>

            <GlowButton
              variant="primary"
              icon={<Play size={14} />}
              className="w-full"
              onClick={() =>
                navigate(`/lesson-viewer/${lesson._id}`)
              }
            >
              Start Lesson
            </GlowButton>

          </GlassCard>

        ))}

      </div>

    </div>
  );
};

export default Learn;