import { Link, useParams } from "react-router-dom";
import lessons from "../data/lessons";

function LessonDetails() {
  const { id } = useParams();

  const lesson = lessons.find(
    (item) => item.id === Number(id)
  );

  if (!lesson) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-3xl font-bold text-red-600">
          Lesson Not Found
        </h1>

        <Link
          to="/learn"
          className="text-blue-600 mt-5 inline-block"
        >
          Back
        </Link>
      </div>
    );
  }

  const previousLesson = lessons.find(
    (item) => item.id === lesson.id - 1
  );

  const nextLesson = lessons.find(
    (item) => item.id === lesson.id + 1
  );

  return (
    <div className="min-h-screen bg-slate-100">

      {/* Header */}
      <div className="bg-blue-700 text-white py-8">

        <div className="max-w-5xl mx-auto">

          <Link
            to="/learn"
            className="text-white underline"
          >
            ← Back to Learn OSINT
          </Link>

          <h1 className="text-4xl font-bold mt-4">
            {lesson.title}
          </h1>

        </div>

      </div>

      <div className="max-w-5xl mx-auto p-8 space-y-8">

        {/* Objectives */}
        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-2xl font-bold text-blue-700">
            Learning Objectives
          </h2>

          <ul className="list-disc pl-6 mt-4 space-y-2">
            {lesson.objectives.map((objective, index) => (
              <li key={index}>{objective}</li>
            ))}
          </ul>

        </div>

        {/* Lesson */}
        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-2xl font-bold text-blue-700">
            Lesson
          </h2>

          <p className="mt-4 whitespace-pre-line leading-8">
            {lesson.content}
          </p>

        </div>

        {/* Key Points */}
        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-2xl font-bold text-blue-700">
            Key Points
          </h2>

          <ul className="list-disc pl-6 mt-4 space-y-2">
            {lesson.keyPoints.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>

        </div>

        {/* Example */}
        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-2xl font-bold text-blue-700">
            Example
          </h2>

          <p className="mt-4">
            {lesson.example}
          </p>

        </div>

        {/* Navigation */}
        <div className="flex justify-between">

          {previousLesson ? (
            <Link
              to={`/learn/${previousLesson.id}`}
              className="bg-gray-700 text-white px-5 py-2 rounded-lg"
            >
              ← Previous
            </Link>
          ) : (
            <div></div>
          )}

          {nextLesson ? (
            <Link
              to={`/learn/${nextLesson.id}`}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg"
            >
              Next →
            </Link>
          ) : (
            <Link
              to="/learn"
              className="bg-green-600 text-white px-5 py-2 rounded-lg"
            >
              Finish
            </Link>
          )}

        </div>

      </div>

    </div>
  );
}

export default LessonDetails;