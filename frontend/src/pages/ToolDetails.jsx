import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getToolById } from "../services/toolService";

function ToolDetails() {
  const { id } = useParams();

  const [tool, setTool] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTool();
  }, []);

  const loadTool = async () => {
    try {
      const data = await getToolById(id);
      setTool(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

    const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
        case "beginner":
        return "bg-green-100 text-green-700";

        case "intermediate":
        return "bg-yellow-100 text-yellow-700";

        case "advanced":
        return "bg-red-100 text-red-700";

        default:
        return "bg-gray-100 text-gray-700";
    }
    };

    const getPlatformIcon = (platform) => {
    switch (platform.toLowerCase()) {
        case "windows":
        return "🪟";

        case "linux":
        return "🐧";

        case "macos":
        return "🍎";

        case "web":
        return "🌐";

        default:
        return "💻";
    }
    };

  if (loading)
    return <div className="p-10 text-center">Loading...</div>;

  if (!tool)
    return <div className="p-10 text-center">Tool Not Found</div>;

  return (
    <div className="min-h-screen bg-slate-100">

      <div className="bg-blue-700 text-white py-8">

        <div className="max-w-6xl mx-auto">

          <Link
            to={`/tools/category/${encodeURIComponent(tool.category)}`}
            className="underline"
          >
            ← Back
          </Link>

        <h1 className="text-4xl font-bold mt-4">
        {tool.name}
        </h1>

        <p className="mt-3 text-lg">
        {tool.shortDescription}
        </p>

        <div className="flex flex-wrap gap-3 mt-5">

        <span
            className={`px-4 py-1 rounded-full font-semibold ${getDifficultyColor(
            tool.difficulty
            )}`}
        >
            {tool.difficulty}
        </span>

        {tool.tags?.map((tag, index) => (
            <span
            key={index}
            className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full"
            >
            #{tag}
            </span>
        ))}

        </div>

        </div>

      </div>

      <div className="max-w-6xl mx-auto p-8 space-y-6">

        <Section title="Overview">
          {tool.description}
        </Section>

        <Section title="Purpose">
          {tool.purpose}
        </Section>

        <Section title="When To Use">
          {tool.whenToUse}
        </Section>

        <Section title="Difficulty">
          {tool.difficulty}
        </Section>

        <Section title="Supported Platforms">

        <div className="flex flex-wrap gap-3">

            {tool.supportedPlatforms?.map((platform, index) => (

            <div
                key={index}
                className="bg-slate-100 px-4 py-2 rounded-lg shadow-sm"
            >
                {getPlatformIcon(platform)} {platform}
            </div>

            ))}

        </div>

        </Section>

        <Section title="Installation">
          {tool.installation}
        </Section>

        <Section title="Syntax">
          <code>{tool.syntax}</code>
        </Section>

        <Section title="Commands">

          {tool.commands?.map((cmd) => (

            <div
              key={cmd._id}
              className="border rounded-lg p-4 mb-3"
            >

              <h3 className="font-bold">
                {cmd.title}
              </h3>

              <code>{cmd.command}</code>

              <p>{cmd.explanation}</p>

            </div>

          ))}

        </Section>

        <Section title="Examples">

          {tool.examples?.length > 0 ? (
            tool.examples.map((example) => (

              <div
                key={example._id}
                className="border rounded-lg p-4 mb-3"
              >

                <h3>{example.title}</h3>

                <code>{example.command}</code>

                <p>{example.output}</p>

              </div>

            ))
          ) : (
            <p>No Examples</p>
          )}

        </Section>

        <Section title="Advantages">

          <ul className="list-disc pl-6">

            {tool.advantages?.map((adv, i) => (
              <li key={i}>{adv}</li>
            ))}

          </ul>

        </Section>

        <Section title="Limitations">

          <ul className="list-disc pl-6">

            {tool.limitations?.map((lim, i) => (
              <li key={i}>{lim}</li>
            ))}

          </ul>

        </Section>

        <Section title="Best Practices">

          <ul className="list-disc pl-6">

            {tool.bestPractices?.map((bp, i) => (
              <li key={i}>{bp}</li>
            ))}

          </ul>

        </Section>

        <div className="flex gap-5">

          <button
            className="bg-green-600 text-white px-6 py-3 rounded-lg"
          >
            Start Practice Lab
          </button>

          <button
            className="bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            Take Quiz
          </button>

        </div>

      </div>

    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">

      <h2 className="text-2xl font-bold text-blue-700 mb-4">
        {title}
      </h2>

      {children}

    </div>
  );
}

export default ToolDetails;