import type { OsintTool } from "../types";

export const mapTool = (tool: any): OsintTool => ({
  id: tool._id,

  name: tool.name,

  category: tool.category,

  tagline: tool.shortDescription || "",

  description: tool.description || "",

  purpose: tool.purpose || "",

  whenToUse: tool.whenToUse || "",

  difficulty: tool.difficulty || "Beginner",

  installation: tool.installation || "",

  supportedPlatforms: tool.supportedPlatforms || [],

  advantages: tool.advantages || [],

  limitations: tool.limitations || [],

  bestPractices: tool.bestPractices || [],

  tags: tool.tags || [],

  commands: (tool.commands || []).map((cmd: any) => ({
    command: cmd.command,
    description: cmd.title,
    expectedOutput: cmd.explanation,
  })),

  examples: tool.examples || [],

  lessons: [],

  quiz: [],

  relatedTools: tool.relatedTools || [],

  icon: tool.icon || "Globe",

  orbitalRingIndex: 0,

  status: "Active",

  popularity: 0,
});