import { Link } from "react-router-dom";

function ToolCard({ tool }) {
  return (
    <Link
      to={`/tools/${tool._id}`}
      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
    >
      <h2 className="text-2xl font-bold text-blue-700">
        {tool.name}
      </h2>

      <p className="mt-3 text-gray-600">
        {tool.shortDescription}
      </p>

      <div className="mt-4 flex justify-between items-center">

        <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
          {tool.difficulty}
        </span>

        <span className="text-blue-600 font-semibold">
          View →
        </span>

      </div>
    </Link>
  );
}

export default ToolCard;