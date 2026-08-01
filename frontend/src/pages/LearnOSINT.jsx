import lessons from "../data/lessons";
import LessonCard from "../components/LessonCard";

function LearnOSINT() {
  return (
    <div className="min-h-screen bg-slate-100">

      {/* Header */}
      <div className="bg-blue-700 text-white py-10 text-center shadow">

        <h1 className="text-4xl font-bold">
          Learn OSINT Basics
        </h1>

        <p className="mt-3 text-lg">
          Start your journey into Open Source Intelligence.
        </p>

      </div>

      {/* Lessons */}
      <div className="max-w-6xl mx-auto p-8">

        <div className="grid md:grid-cols-2 gap-6">

          {lessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
            />
          ))}

        </div>

      </div>

    </div>
  );
}

export default LearnOSINT;