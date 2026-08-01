import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getToolsByCategory } from "../services/toolService";
import ToolCard from "../components/ToolCard";

function ToolList() {
  const { category } = useParams();

  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTools();
  }, [category]);

  const loadTools = async () => {
    try {
      const data = await getToolsByCategory(category);
      setTools(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-100">

      <div className="bg-blue-700 text-white py-10">

        <div className="max-w-6xl mx-auto">

          <Link
            to="/tools"
            className="underline"
          >
            ← Back to Categories
          </Link>

          <h1 className="text-4xl font-bold mt-4">
            {category}
          </h1>

        </div>

      </div>

      <div className="max-w-6xl mx-auto p-8">

        <div className="grid md:grid-cols-2 gap-6">

          {tools.map((tool) => (
            <ToolCard
              key={tool._id}
              tool={tool}
            />
          ))}

        </div>

      </div>

    </div>
  );
}

export default ToolList;