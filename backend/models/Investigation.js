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
            default: "Ready for Investigation",
            trim: true,
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
    },
    {
        timestamps: true,
    }
);

const Investigation = mongoose.model("Investigation", investigationSchema);
Investigation.DEFAULT_MISSION = DEFAULT_MISSION;
Investigation.DEFAULT_OBJECTIVES = DEFAULT_OBJECTIVES;

module.exports = Investigation;
