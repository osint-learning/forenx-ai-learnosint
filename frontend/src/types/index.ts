// ============================================================
// TOOL CATEGORY
// ============================================================

export type ToolCategory =
  | 'Domain Investigation'
  | 'Email Investigation'
  | 'Username Investigation'
  | 'Phone Investigation'
  | 'Google Dorking'
  | 'Metadata Analysis'
  | 'Threat Intelligence'
  | 'Search Engines';


// ============================================================
// COMMAND EXAMPLE
// ============================================================

export interface CommandExample {
  command: string;
  description: string;
  expectedOutput: string;
}


// ============================================================
// QUIZ QUESTION
// ============================================================

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}


// ============================================================
// OSINT TOOL
// ============================================================

export interface OsintTool {
  id: string;
  name: string;
  category: ToolCategory;

  tagline: string;
  description: string;
  purpose: string;
  whenToUse: string;

  difficulty:
    | 'Beginner'
    | 'Intermediate'
    | 'Advanced';

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

  icon: string;

  orbitalRingIndex: number;

  status:
    | 'Active'
    | 'Beta'
    | 'Legacy';

  popularity: number;
}


// ============================================================
// LEARNING CAPSULE
// ============================================================

export interface LearningCapsule {
  id: string;

  title: string;

  category: ToolCategory;

  difficulty:
    | 'Beginner'
    | 'Intermediate'
    | 'Advanced'
    | 'Master';

  durationMinutes: number;

  completionPercentage: number;

  lessonsCount: number;

  xpReward: number;

  tags: string[];

  description: string;
}


// ============================================================
// LAB OBJECTIVE
// ============================================================

export interface LabObjective {
  id: string;

  task: string;

  // Defines how the objective is completed
  type: 'command' | 'answer';

  completed: boolean;

  hint: string;

  // Used for command-specific objectives
  requiredCommandPattern?: string;
}


// ============================================================
// PRACTICE LAB
// ============================================================

export interface PracticeLab {
  id: string;

  // Basic mission information
  title: string;

  category: ToolCategory;

  difficulty:
    | 'Easy'
    | 'Medium'
    | 'Hard'
    | 'Insane';

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


// ============================================================
// LAB QUESTION
// ============================================================

export interface LabQuestion {
  id: string;

  question: string;

  answerType:
    | 'text'
    | 'number'
    | 'choice';

  options?: string[];

  correctAnswer?: string;

  explanation?: string;

  points?: number;
}


// ============================================================
// RECON RESULT
// ============================================================

export interface ReconResult {
  target: string;

  timestamp: string;

  riskScore: number;

  ipAddress: string;

  geoCountry: string;

  openPorts: {
    port: number;
    service: string;
    state: string;
  }[];

  securityHeaders: {
    header: string;
    status:
      | 'Pass'
      | 'Fail'
      | 'Warning';
  }[];

  dnsRecords: {
    type: string;
    value: string;
  }[];

  sslStatus: {
    valid: boolean;
    issuer: string;
    expiresDays: number;
  };

  attackSurface: {
    threatType: string;

    severity:
      | 'Low'
      | 'Medium'
      | 'High'
      | 'Critical';

    description: string;
  }[];
}


// ============================================================
// EVIDENCE NODE
// ============================================================

export interface EvidenceNode {
  id: string;

  label: string;

  type:
    | 'IP'
    | 'Domain'
    | 'Email'
    | 'Hash'
    | 'Person'
    | 'Document'
    | 'Location';

  status:
    | 'Unverified'
    | 'Confirmed'
    | 'Malicious';

  notes: string;

  x: number;

  y: number;
}


// ============================================================
// EVIDENCE CONNECTION
// ============================================================

export interface EvidenceConnection {
  fromId: string;

  toId: string;

  label: string;

  confidence: number;
}


// ============================================================
// THREAT MARKER
// ============================================================

export interface ThreatMarker {
  id: string;

  lat: number;

  lng: number;

  country: string;

  city: string;

  threatLevel:
    | 'Low'
    | 'Medium'
    | 'High'
    | 'Critical';

  type: string;

  ip: string;

  targetSector: string;

  timestamp: string;
}


// ============================================================
// INTELLIGENCE REPORT
// ============================================================

export interface IntelligenceReport {
  id: string;

  title: string;

  target: string;

  date: string;

  author: string;

  overallRisk: number;

  summary: string;

  findingsCount: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };

  recommendations: string[];
}


// ============================================================
// REAL USER PROFILE
// ============================================================

export interface UserProfile {
  username: string;
  email: string;
  role: string;
  level: number;
  currentXp: number;
  completedLabsCount: number;
  completedLessonsCount: number;
  badges: string[];
  createdAt: string;
  nextLevelXp: number;
  streakDays: number;
  rankPosition: number;
  codename: string;
  accuracyRate: number;
  profileImage?: string;
  isVerified?: boolean;
  completedLessons?: Array<{ _id?: string; title?: string; category?: string; lessonNumber?: number }>;
  completedLabs?: Array<{ _id?: string; title?: string; tool?: string; category?: string; difficulty?: string; xpReward?: number }>;
}

// ============================================================
// ADMIN CONTROL TYPES
// ============================================================

export interface AdminStudent {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  xp: number;
  level: number;
  isVerified: boolean;
  createdAt: string;
  completedLessons?: Array<{ _id: string; title: string; lessonNumber?: number }>;
  completedLabs?: Array<{ _id: string; title: string; difficulty?: string }>;
  badges?: string[];
}

export interface AdminOverview {
  users: {
    total: number;
    students: number;
    admins: number;
    verifiedStudents: number;
  };
  learning: {
    tools: number;
    lessons: number;
    quizzes: number;
    labs: number;
  };
  recentStudents: AdminStudent[];
}

export interface AdminAnalytics {
  students: {
    total: number;
    verified: number;
    unverified: number;
    totalXp: number;
    avgXp: number;
    levelDistribution: {
      level1: number;
      level2: number;
      level3: number;
      level4: number;
      level5Plus: number;
    };
    topStudents: Array<{
      _id: string;
      fullName: string;
      email: string;
      xp: number;
      level: number;
      isVerified: boolean;
    }>;
  };
  content: {
    totalTools: number;
    totalLessons: number;
    totalQuizzes: number;
    totalLabs: number;
    toolsByCategory: Record<string, number>;
    contentByDifficulty: {
      beginner: number;
      intermediate: number;
      advanced: number;
    };
  };
  engagement: {
    totalLessonsCompleted: number;
    totalLabsCompleted: number;
  };
}

export interface AdminLesson {
  _id: string;
  tool: any;
  lessonNumber: number;
  title: string;
  shortDescription?: string;
  content: string;
  keyPoints?: string[];
  example?: string;
  estimatedTime?: number;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  isPublished?: boolean;
  createdAt?: string;
}

export interface AdminQuiz {
  _id: string;
  tool: any;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  order?: number;
  createdAt?: string;
}

export interface AdminLab {
  _id: string;
  title: string;
  description?: string;
  tool: string;
  category?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  target: string;
  missionBrief: string;
  requiredCommand: string;
  objectives?: Array<{
    question: string;
    type: 'command' | 'answer';
    expectedField: string;
    answer?: string;
    completed?: boolean;
  }>;
  hints?: string[];
  xpReward: number;
  isActive: boolean;
  createdAt?: string;
}
