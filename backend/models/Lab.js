const mongoose = require("mongoose");

const labObjectiveSchema = new mongoose.Schema(
    {
        question: {
            type: String,
            required: true,
            trim: true,
        },

        // Defines how this objective should be handled
        // command = completed when the required command succeeds
        // answer = completed after the student's answer is evaluated
        type: {
            type: String,
            enum: ["command", "answer"],
            default: "answer",
            trim: true,
        },

        // Field from the real command output used for answer evaluation
        expectedField: {
            type: String,
            required: true,
            trim: true,
        },

        answer: {
            type: String,
            default: "",
        },

        completed: {
            type: Boolean,
            default: false,
        },
    },
    { _id: false }
);

const labSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            default: "",
        },

        tool: {
            type: String,
            required: true,
            trim: true,
        },

        category: {
            type: String,
            default: "OSINT",
        },

        difficulty: {
            type: String,
            enum: ["Easy", "Medium", "Hard"],
            default: "Easy",
        },

        target: {
            type: String,
            required: true,
            trim: true,
        },

        missionBrief: {
            type: String,
            required: true,
        },

        requiredCommand: {
            type: String,
            required: true,
            trim: true,
        },

        objectives: {
            type: [labObjectiveSchema],
            default: [],
        },

        hints: {
            type: [String],
            default: [],
        },

        xpReward: {
            type: Number,
            default: 100,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Lab", labSchema);