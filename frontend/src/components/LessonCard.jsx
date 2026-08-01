import { Link } from "react-router-dom";

function LessonCard({ lesson }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">

      <h2 className="text-2xl font-bold text-blue-700">
        {lesson.title}
      </h2>

      <p className="text-gray-600 mt-3">
        {lesson.shortDescription}
      </p>

      <Link
        to={`/learn/${lesson.id}`}
        className="inline-block mt-6 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
      >
        Read Lesson
      </Link>

    </div>
  );
}

export default LessonCard;