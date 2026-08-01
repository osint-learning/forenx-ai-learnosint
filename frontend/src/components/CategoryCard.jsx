import { Link } from "react-router-dom";

function CategoryCard({ category, count }) {
  return (
    <Link
      to={`/tools/category/${encodeURIComponent(category)}`}
      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
    >
      <h2 className="text-2xl font-bold text-blue-700">
        {category}
      </h2>

      <p className="mt-3 text-gray-600">
        {count} Tool{count !== 1 ? "s" : ""}
      </p>
    </Link>
  );
}

export default CategoryCard;