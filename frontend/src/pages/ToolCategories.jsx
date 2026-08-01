import { useEffect, useState } from "react";
import { getAllTools } from "../services/toolService";
import CategoryCard from "../components/CategoryCard";

function ToolCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const tools = await getAllTools();

      const grouped = {};

      tools.forEach((tool) => {
        grouped[tool.category] = (grouped[tool.category] || 0) + 1;
      });

      const categoryList = Object.keys(grouped).map((category) => ({
        name: category,
        count: grouped[category],
      }));

      setCategories(categoryList);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center">
        Loading Categories...
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-100">

      <div className="bg-blue-700 text-white py-10 text-center">
        <h1 className="text-4xl font-bold">
          OSINT Tool Explorer
        </h1>

        <p className="mt-3">
          Browse OSINT tools by category.
        </p>
      </div>

      <div className="max-w-6xl mx-auto p-8">

        <div className="grid md:grid-cols-3 gap-6">

          {categories.map((category) => (
            <CategoryCard
              key={category.name}
              category={category.name}
              count={category.count}
            />
          ))}

        </div>

      </div>

    </div>
  );
}

export default ToolCategories;