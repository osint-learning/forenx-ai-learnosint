import axios from 'axios';
import type {
  OsintTool, LearningCapsule, PracticeLab, ReconResult, ThreatMarker, IntelligenceReport,
  AdminOverview, AdminAnalytics, AdminStudent, AdminLesson, AdminQuiz, AdminLab,
  InvestigationRecord, InvestigationObjective, InvestigationFinding, InvestigationAiHint,
  InvestigationToolRecommendation, InvestigationOutputAnalysis, InvestigationNextStep,
  InvestigationAction, InvestigationEvaluation, InvestigationAiMessage
} from '../types';
import { INITIAL_CAPSULES, INITIAL_THREAT_MARKERS } from '../constants';
import { mapTool } from "../utils/toolMapper";
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Client-Platform': 'ForenX-LearnOSINT-FUI'
  },
  timeout: 10000
});

// REST API Service Wrappers with local fallback for immediate interactive UI operation
export const OsintService = {

  // ---------- ADMIN DASHBOARD & MANAGEMENT ----------
  getAdminOverview: async (): Promise<AdminOverview> => {
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");
    const response = await apiClient.get("/admin/overview", {
      headers: { Authorization: "Bearer " + token },
    });
    return response.data.data;
  },

  getAdminAnalytics: async (): Promise<AdminAnalytics> => {
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");
    const response = await apiClient.get("/admin/analytics", {
      headers: { Authorization: "Bearer " + token },
    });
    return response.data.data;
  },

  getStudents: async (): Promise<AdminStudent[]> => {
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");
    const response = await apiClient.get("/admin/students", {
      headers: { Authorization: "Bearer " + token },
    });
    return response.data.data;
  },

  getStudent: async (id: string): Promise<AdminStudent> => {
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");
    const response = await apiClient.get("/admin/students/" + id, {
      headers: { Authorization: "Bearer " + token },
    });
    return response.data.data;
  },

  updateStudent: async (id: string, data: Partial<AdminStudent>): Promise<AdminStudent> => {
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");
    const response = await apiClient.put("/admin/students/" + id, data, {
      headers: { Authorization: "Bearer " + token },
    });
    return response.data.data;
  },

  deleteStudent: async (id: string): Promise<void> => {
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");
    await apiClient.delete("/admin/students/" + id, {
      headers: { Authorization: "Bearer " + token },
    });
  },

  // Tool Admin CRUD
  createTool: async (toolData: any): Promise<any> => {
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");
    const response = await apiClient.post("/tools", toolData, {
      headers: { Authorization: "Bearer " + token },
    });
    return response.data.data;
  },

  updateTool: async (id: string, toolData: any): Promise<any> => {
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");
    const response = await apiClient.put("/tools/" + id, toolData, {
      headers: { Authorization: "Bearer " + token },
    });
    return response.data.data;
  },

  deleteTool: async (id: string): Promise<void> => {
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");
    await apiClient.delete("/tools/" + id, {
      headers: { Authorization: "Bearer " + token },
    });
  },

  // Lesson Admin CRUD
  getAllLessonsAdmin: async (): Promise<AdminLesson[]> => {
    const response = await apiClient.get("/lessons");
    return response.data.data || [];
  },

  getLessonsByTool: async (toolId: string): Promise<AdminLesson[]> => {
    const response = await apiClient.get("/lessons/tool/" + toolId);
    return response.data.data || [];
  },

  createLesson: async (lessonData: any): Promise<AdminLesson> => {
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");
    const response = await apiClient.post("/lessons", lessonData, {
      headers: { Authorization: "Bearer " + token },
    });
    return response.data.data;
  },

  updateLesson: async (id: string, lessonData: any): Promise<AdminLesson> => {
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");
    const response = await apiClient.put("/lessons/" + id, lessonData, {
      headers: { Authorization: "Bearer " + token },
    });
    return response.data.data;
  },

  deleteLesson: async (id: string): Promise<void> => {
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");
    await apiClient.delete("/lessons/" + id, {
      headers: { Authorization: "Bearer " + token },
    });
  },

  // Quiz Admin CRUD
  getAllQuizzesAdmin: async (): Promise<AdminQuiz[]> => {
    const response = await apiClient.get("/quizzes");
    return response.data.data || [];
  },

  getQuizzesByTool: async (toolId: string): Promise<AdminQuiz[]> => {
    const response = await apiClient.get("/quizzes/tool/" + toolId);
    return response.data.data || [];
  },

  createQuiz: async (quizData: any): Promise<AdminQuiz> => {
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");
    const response = await apiClient.post("/quizzes", quizData, {
      headers: { Authorization: "Bearer " + token },
    });
    return response.data.data;
  },

  updateQuiz: async (id: string, quizData: any): Promise<AdminQuiz> => {
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");
    const response = await apiClient.put("/quizzes/" + id, quizData, {
      headers: { Authorization: "Bearer " + token },
    });
    return response.data.data;
  },

  deleteQuiz: async (id: string): Promise<void> => {
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");
    await apiClient.delete("/quizzes/" + id, {
      headers: { Authorization: "Bearer " + token },
    });
  },

  // Lab Admin CRUD
  getAdminLabs: async (): Promise<AdminLab[]> => {
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");
    const response = await apiClient.get("/labs", {
      headers: { Authorization: "Bearer " + token },
    });
    return response.data.data || [];
  },

  createLab: async (labData: any): Promise<AdminLab> => {
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");
    const response = await apiClient.post("/labs", labData, {
      headers: { Authorization: "Bearer " + token },
    });
    return response.data.data;
  },

  updateLab: async (id: string, labData: any): Promise<AdminLab> => {
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");
    const response = await apiClient.put("/labs/" + id, labData, {
      headers: { Authorization: "Bearer " + token },
    });
    return response.data.data;
  },

  deleteLab: async (id: string): Promise<void> => {
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");
    await apiClient.delete("/labs/" + id, {
      headers: { Authorization: "Bearer " + token },
    });
  },

  async getTools(): Promise<OsintTool[]> {
    try {
      const response = await apiClient.get("/tools");

      return response.data.data.map(mapTool);

      } catch (error) {
        console.error("Failed to load tools:", error);
        return [];
      }
  },
  async getToolById(id: string): Promise<OsintTool | undefined> {
    try {

      const response = await apiClient.get(`/tools/${id}`);

      return mapTool(response.data.data);

    } 
    catch (error) {

      console.error("Failed to load tool:", error);

      return undefined;

    }
  },

  async getMyProfile() {
    const token =
      sessionStorage.getItem("token") ||
      localStorage.getItem("token");

    if (!token) {
      throw new Error("Please login to load your profile.");
    }

    const response = await apiClient.get("/user/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },

  async getLessons(toolId: string) {
    const response = await apiClient.get(`/lessons/tool/${toolId}`);
    return response.data.data;
  },

  async getQuiz(toolId: string) {
    const response = await apiClient.get(`/quizzes/tool/${toolId}`);
    return response.data.data;
  },

  async getLearningCapsules(): Promise<LearningCapsule[]> {
    try {
      const response = await apiClient.get<LearningCapsule[]>('/capsules');
      return response.data;
    } catch {
      return INITIAL_CAPSULES;
    }
  },

async getPracticeLabs(): Promise<PracticeLab[]> {

  const token =
    sessionStorage.getItem("token") ||
    localStorage.getItem("token");

  if (!token) {
    throw new Error(
      "Please login before loading Practice Labs."
    );
  }

  try {

    const response =
      await apiClient.get("/labs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

    const labs = response.data.data;
    console.log("LAB DATA FROM BACKEND:", labs);
    return labs.map((lab: any) => {

      // Progress saved for this user
      const savedProgress =
        lab.progress || {};

      const savedObjectives =
        savedProgress.objectives || [];


      return {

        id: lab._id,

        title: lab.title,

        category: lab.category,

        difficulty: lab.difficulty,

        xpReward: lab.xpReward,

        targetDomainOrIp: lab.target,

        missionBrief: lab.missionBrief,

        toolId:
          lab.tool?.toLowerCase(),

        toolName:
          lab.tool,

        requiredCommand:
          lab.requiredCommand,


        objectives:
          (lab.objectives || []).map(
            (objective: any, index: number) => {

              const savedObjective =
                savedObjectives.find(
                  (item: any) =>
                    item.objectiveIndex === index
                );


              return {

                id:
                  `${lab._id}-objective-${index + 1}`,

                task:
                  objective.question,

                type:
                  objective.type === "command"
                    ? "command"
                    : "answer",

                // Use MongoDB progress
                completed: savedObjective?.completed === true,

                hint:
                  objective.type === "command"
                    ? `Use the ${lab.tool} command against the target.`
                    : `Identify the ${objective.expectedField} from the real command output.`,

                requiredCommandPattern:
                  objective.type === "command"
                    ? lab.requiredCommand
                    : undefined,
              };
            }
          ),


        evidenceFiles: [],

        hints:
          lab.hints || [],

      };
    });

  } catch (error) {

    console.error(
      "Failed to load Practice Labs:",
      error
    );

    throw error;
  }
},

async evaluateLabAnswer(
  labId: string,
  objectiveIndex: number,
  answer: string,
  output: any
): Promise<any> {

  const token =
    sessionStorage.getItem("token") ||
    localStorage.getItem("token");

  if (!token) {
    throw new Error(
      "Please login before evaluating your answer."
    );
  }

  const response = await apiClient.post(
    `/labs/${labId}/evaluate`,
    {
      objectiveIndex,
      answer,
      output,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
},

async resetLabProgress(
  labId: string
): Promise<any> {

  const token =
    sessionStorage.getItem("token") ||
    localStorage.getItem("token");

  if (!token) {
    throw new Error(
      "Please login before resetting the Practice Lab."
    );
  }

  const response =
    await apiClient.post(
      `/labs/${labId}/reset`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

  return response.data;
},

  async executeReconScan(target: string): Promise<any> {
    const token =
      sessionStorage.getItem("token") ||
      localStorage.getItem("token");

    if (!token) {
      throw new Error("Please login before running Recon Engine.");
    }

    try {
      const response = await apiClient.post(
        "/recon/fullscan",
        {
          domain: target,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.data;
    } catch (error: any) {
      console.error(
        "Recon scan failed:",
        error?.response?.status,
        error?.response?.data || error?.message
      );

      throw new Error(
        error?.response?.data?.message ||
        "Recon scan failed. Please check the backend and authentication."
      );
    }
  },

  async sendToInvestigation(target: string, reconData: any): Promise<any> {
    const token =
      sessionStorage.getItem("token") ||
      localStorage.getItem("token");

    if (!token) {
      throw new Error("Please login before sending to Investigation.");
    }

    try {
      const response = await apiClient.post(
        "/investigations",
        {
          target,
          domain: target,
          reconData,
          status: "Ready for Investigation",
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error(
        "Send to investigation failed:",
        error?.response?.status,
        error?.response?.data || error?.message
      );

      throw new Error(
        error?.response?.data?.message ||
        "Failed to send Recon result to Investigation."
      );
    }
  },

  async getInvestigations(): Promise<InvestigationRecord[]> {
    const token =
      sessionStorage.getItem("token") ||
      localStorage.getItem("token");

    if (!token) {
      throw new Error("Please login before loading investigations.");
    }

    try {
      const response = await apiClient.get("/investigations", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      return response.data.data;
    } catch (error: any) {
      console.error(
        "Failed to load investigations:",
        error?.response?.status,
        error?.response?.data || error?.message
      );
      throw new Error(
        error?.response?.data?.message ||
        "Failed to load investigations."
      );
    }
  },

  async getInvestigationById(id: string): Promise<InvestigationRecord> {
    const token =
      sessionStorage.getItem("token") ||
      localStorage.getItem("token");

    if (!token) {
      throw new Error("Please login before loading investigation.");
    }

    try {
      const response = await apiClient.get("/investigations/" + id, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      return response.data.data;
    } catch (error: any) {
      console.error(
        "Failed to load investigation:",
        error?.response?.status,
        error?.response?.data || error?.message
      );
      throw new Error(
        error?.response?.data?.message ||
        "Failed to load investigation details."
      );
    }
  },

  async updateInvestigationObjectives(
    id: string,
    objectives: InvestigationObjective[]
  ): Promise<InvestigationRecord> {
    const token =
      sessionStorage.getItem("token") ||
      localStorage.getItem("token");

    if (!token) {
      throw new Error("Please login before updating investigation objectives.");
    }

    try {
      const response = await apiClient.patch(
        "/investigations/" + id + "/objectives",
        { objectives },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      return response.data.data;
    } catch (error: any) {
      console.error(
        "Failed to update investigation objectives:",
        error?.response?.status,
        error?.response?.data || error?.message
      );
      throw new Error(
        error?.response?.data?.message ||
        "Failed to update investigation objectives."
      );
    }
  },

  async getInvestigationToolRecommendations(id: string): Promise<InvestigationToolRecommendation[]> {
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");
    if (!token) throw new Error("Please login to request tool recommendations.");
    const response = await apiClient.post("/investigations/" + id + "/ai/recommend-tools", {}, {
      headers: { Authorization: "Bearer " + token },
    });
    return response.data.recommendations || [];
  },

  async analyzeInvestigationReconSection(id: string, section: string, query?: string): Promise<InvestigationOutputAnalysis> {
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");
    if (!token) throw new Error("Please login to analyze recon output.");
    const response = await apiClient.post("/investigations/" + id + "/ai/analyze-output", { section, query }, {
      headers: { Authorization: "Bearer " + token },
    });
    return response.data.analysis;
  },

  async askInvestigationMentor(id: string, message: string): Promise<{ reply: string; chatHistory: InvestigationAiMessage[] }> {
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");
    if (!token) throw new Error("Please login to consult the AI Investigation Mentor.");
    const response = await apiClient.post("/investigations/" + id + "/ai/mentor", { message }, {
      headers: { Authorization: "Bearer " + token },
    });
    return response.data;
  },

  async getInvestigationHint(id: string, level: number = 1): Promise<{ hint: InvestigationAiHint; unlockedHints: InvestigationAiHint[] }> {
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");
    if (!token) throw new Error("Please login to unlock hints.");
    const response = await apiClient.post("/investigations/" + id + "/ai/hint", { level }, {
      headers: { Authorization: "Bearer " + token },
    });
    return response.data;
  },

  async getInvestigationNextStep(id: string): Promise<InvestigationNextStep> {
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");
    if (!token) throw new Error("Please login to request next-step recommendations.");
    const response = await apiClient.post("/investigations/" + id + "/ai/next-step", {}, {
      headers: { Authorization: "Bearer " + token },
    });
    return response.data.nextStep;
  },

  async correlateInvestigationFindings(id: string): Promise<{ findings: InvestigationFinding[]; evaluation: InvestigationEvaluation }> {
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");
    if (!token) throw new Error("Please login to correlate findings.");
    const response = await apiClient.post("/investigations/" + id + "/findings/correlate", {}, {
      headers: { Authorization: "Bearer " + token },
    });
    return response.data;
  },

  async getInvestigationFindings(id: string): Promise<InvestigationFinding[]> {
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");
    if (!token) throw new Error("Please login to view findings.");
    const response = await apiClient.get("/investigations/" + id + "/findings", {
      headers: { Authorization: "Bearer " + token },
    });
    return response.data.findings || [];
  },

  async logInvestigationAction(id: string, actionType: string, description: string, targetItem?: string): Promise<{ studentActions: InvestigationAction[]; evaluation: InvestigationEvaluation }> {
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");
    if (!token) throw new Error("Please login to log actions.");
    const response = await apiClient.post("/investigations/" + id + "/actions/log", { actionType, description, targetItem }, {
      headers: { Authorization: "Bearer " + token },
    });
    return response.data;
  },

  async getInvestigationEvaluation(id: string): Promise<InvestigationEvaluation> {
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");
    if (!token) throw new Error("Please login to view evaluation.");
    const response = await apiClient.get("/investigations/" + id + "/evaluation", {
      headers: { Authorization: "Bearer " + token },
    });
    return response.data.evaluation;
  },

  async getThreatMarkers(): Promise<ThreatMarker[]> {
    try {
      const response = await apiClient.get<ThreatMarker[]>('/threats');
      return response.data;
    } catch {
      return INITIAL_THREAT_MARKERS;
    }
  },

async executeTerminalCommand(
  command: string,
  practiceTool?: string,
  labId?: string
): Promise<any> {

  const token =
    sessionStorage.getItem("token") ||
    localStorage.getItem("token");

  if (!token) {
    throw new Error(
      "Please login before using the Practice Lab."
    );
  }

  const response = await apiClient.post(
    "/recon/terminal",
    {
      command,
      practiceTool: practiceTool || null,
      labId: labId || null,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
},

  async generateReport(target: string, scanData: ReconResult): Promise<IntelligenceReport> {
    return {
      id: `REP-${Math.floor(Math.random() * 90000) + 10000}`,
      title: `Executive Intelligence Report: ${target}`,
      target,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      author: 'ForenX AI LearnOSINT Core Engine',
      overallRisk: scanData.riskScore,
      summary: `Automated OSINT investigation on ${target} uncovered ${scanData.openPorts.length} open network ports and ${scanData.attackSurface.length} active surface vulnerabilities requiring remediation.`,
      findingsCount: { critical: 0, high: 1, medium: 2, low: 3 },
      recommendations: [
        'Enforce strict IP whitelist on HTTP Proxy Port 8080',
        'Upgrade SPF policy from softfail (~all) to hardfail (-all)',
        'Rotate exposed SSL certificate keys prior to expiry in 142 days'
      ]
    };
  }
};
