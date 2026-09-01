export type ToolCategory = 
  | 'Domain Investigation'
  | 'Email Investigation'
  | 'Metadata'
  | 'Social Media'
  | 'Network Intelligence'
  | 'Threat Intelligence'
  | 'Dark Web'
  | 'Digital Forensics';

export interface CommandExample {
  command: string;
  description: string;
  expectedOutput: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface OsintTool {
  id: string;
  name: string;
  category: ToolCategory;
  tagline: string;
  description: string;
  purpose: string;
  whenToUse: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  installation: string;

  supportedPlatforms: string[];
  advantages: string[];
  limitations: string[];
  bestPractices: string[];
  tags: string[];  

  commands: CommandExample[];
  examples: string[];
  lessons: string[];
  quiz: QuizQuestion[];
  relatedTools: string[];
  icon: string; // lucide icon name
  orbitalRingIndex: number; // 0 to 7
  status: 'Active' | 'Beta' | 'Legacy';
  popularity: number;
}

export interface LearningCapsule {
  id: string;
  title: string;
  category: ToolCategory;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Master';
  durationMinutes: number;
  completionPercentage: number;
  lessonsCount: number;
  xpReward: number;
  tags: string[];
  description: string;
}

export interface LabObjective {
  id: string;
  task: string;
  completed: boolean;
  hint: string;
  requiredCommandPattern?: string;
}

export interface PracticeLab {
  id: string;

  // Basic mission information
  title: string;
  category: ToolCategory;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Insane';
  xpReward: number;

  // Investigation target
  targetDomainOrIp: string;
  missionBrief: string;

  // Tool-specific practice
  toolId?: string;
  toolName?: string;
  requiredCommand?: string;

  // Mission objectives
  objectives: LabObjective[];

  // Evidence and hints
  evidenceFiles: {
    name: string;
    content: string;
    type: string;
  }[];

  hints: string[];

  // Future output-analysis phase
  analysisQuestions?: LabQuestion[];

  initialFilesystem?: Record<string, string>;
}

export interface LabQuestion {
  id: string;
  question: string;
  answerType: 'text' | 'number' | 'choice';

  options?: string[];

  correctAnswer?: string;

  explanation?: string;

  points?: number;
}

export interface ReconResult {
  target: string;
  timestamp: string;
  riskScore: number; // 0 - 100
  ipAddress: string;
  geoCountry: string;
  openPorts: { port: number; service: string; state: string }[];
  securityHeaders: { header: string; status: 'Pass' | 'Fail' | 'Warning' }[];
  dnsRecords: { type: string; value: string }[];
  sslStatus: { valid: boolean; issuer: string; expiresDays: number };
  attackSurface: { threatType: string; severity: 'Low' | 'Medium' | 'High' | 'Critical'; description: string }[];
}

export interface EvidenceNode {
  id: string;
  label: string;
  type: 'IP' | 'Domain' | 'Email' | 'Hash' | 'Person' | 'Document' | 'Location';
  status: 'Unverified' | 'Confirmed' | 'Malicious';
  notes: string;
  x: number;
  y: number;
}

export interface EvidenceConnection {
  fromId: string;
  toId: string;
  label: string;
  confidence: number; // 0-100
}

export interface ThreatMarker {
  id: string;
  lat: number;
  lng: number;
  country: string;
  city: string;
  threatLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  type: string;
  ip: string;
  targetSector: string;
  timestamp: string;
}

export interface IntelligenceReport {
  id: string;
  title: string;
  target: string;
  date: string;
  author: string;
  overallRisk: number;
  summary: string;
  findingsCount: { critical: number; high: number; medium: number; low: number };
  recommendations: string[];
}

export interface UserProfile {
  username: string;
  codename: string;
  rank: string;
  level: number;
  currentXp: number;
  nextLevelXp: number;
  badges: { id: string; name: string; icon: string; description: string; unlockedAt?: string }[];
  completedLabsCount: number;
  accuracyRate: number;
  streakDays: number;
  rankPosition: number;
}
