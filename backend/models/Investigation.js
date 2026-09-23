const mongoose = require("mongoose");

const DEFAULT_MISSION = {
    title: "Reconnaissance Investigation",
    description: "Analyze the reconnaissance results and identify important security-relevant findings.",
};

const DEFAULT_OBJECTIVES = [
    { title: "Analyze domain information", completed: false },
    { title: "Examine DNS records", completed: false },
    { title: "Identify technologies", completed: false },
    { title: "Examine exposed services", completed: false },
    { title: "Correlate important findings", completed: false },
];

const objectiveSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
});

const findingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: String,
        default: "General",
        trim: true,
    },
    severity: {
        type: String,
        enum: ["Critical", "High", "Medium", "Low", "Info"],
        default: "Medium",
    },
    description: {
        type: String,
        required: true,
    },
    source: {
        type: String,
        default: "Reconnaissance Analysis",
    },
    relatedEvidence: {
        type: [String],
        default: [],
    },
    correlationInfo: {
        type: String,
        default: "",
    },
    status: {
        type: String,
        default: "Correlated",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const aiMessageSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ["user", "assistant"],
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const hintSchema = new mongoose.Schema({
    level: {
        type: Number,
        required: true,
    },
    hint: {
        type: String,
        required: true,
    },
    guidance: {
        type: String,
        default: "",
    },
    nextStep: {
        type: String,
        default: "",
    },
    unlockedAt: {
        type: Date,
        default: Date.now,
    },
});

const studentActionSchema = new mongoose.Schema({
    actionType: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    targetItem: {
        type: String,
        default: "",
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const evaluationSchema = new mongoose.Schema({
    score: {
        type: Number,
        default: 0,
    },
    grade: {
        type: String,
        default: "Pending Evaluation",
    },
    methodology: {
        type: String,
        default: "Standard OSINT Reconnaissance Framework",
    },
    strengths: {
        type: [String],
        default: [],
    },
    improvements: {
        type: [String],
        default: [],
    },
    feedback: {
        type: String,
        default: "",
    },
    lastEvaluatedAt: {
        type: Date,
        default: Date.now,
    },
});

const conclusionSchema = new mongoose.Schema({
    summary: {
        type: String,
        required: true,
    },
    threatLevel: {
        type: String,
        default: "Medium",
    },
    keyTakeaways: {
        type: [String],
        default: [],
    },
    recommendations: {
        type: [String],
        default: [],
    },
    generatedAt: {
        type: Date,
        default: Date.now,
    },
});

const reportSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    executiveSummary: {
        type: String,
        required: true,
    },
    target: {
        type: String,
        required: true,
    },
    riskScore: {
        type: Number,
        default: 45,
    },
    threatLevel: {
        type: String,
        default: "Medium",
    },
    findingsCount: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
    },
    keyFindings: {
        type: [mongoose.Schema.Types.Mixed],
        default: [],
    },
    studentEvaluation: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
    },
    recommendations: {
        type: [String],
        default: [],
    },
    generatedAt: {
        type: Date,
        default: Date.now,
    },
});

const investigationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        target: {
            type: String,
            required: true,
            trim: true,
        },
        domain: {
            type: String,
            trim: true,
        },
        reconData: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
        },
        status: {
            type: String,
            default: "In Progress",
            trim: true,
        },
        progress: {
            type: Number,
            default: 20,
        },
        mission: {
            title: {
                type: String,
                default: DEFAULT_MISSION.title,
                trim: true,
            },
            description: {
                type: String,
                default: DEFAULT_MISSION.description,
                trim: true,
            },
        },
        objectives: {
            type: [objectiveSchema],
            default: () => DEFAULT_OBJECTIVES.map(obj => ({ ...obj })),
        },
        findings: {
            type: [findingSchema],
            default: [],
        },
        aiChatHistory: {
            type: [aiMessageSchema],
            default: [],
        },
        unlockedHints: {
            type: [hintSchema],
            default: [],
        },
        studentActions: {
            type: [studentActionSchema],
            default: [],
        },
        evaluation: {
            type: evaluationSchema,
            default: () => ({
                score: 20,
                grade: "In Progress",
                methodology: "Standard OSINT Reconnaissance Framework",
                strengths: ["Initial Reconnaissance ingestion completed"],
                improvements: ["Proceed through objective milestones and examine DNS/tech findings"],
                feedback: "Investigation initiated. Begin by exploring DNS resolution and server headers.",
                lastEvaluatedAt: new Date(),
            }),
        },
        finalConclusion: {
            type: conclusionSchema,
            default: null,
        },
        report: {
            type: reportSchema,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const Investigation = mongoose.model("Investigation", investigationSchema);
Investigation.DEFAULT_MISSION = DEFAULT_MISSION;
Investigation.DEFAULT_OBJECTIVES = DEFAULT_OBJECTIVES;

module.exports = Investigation;
