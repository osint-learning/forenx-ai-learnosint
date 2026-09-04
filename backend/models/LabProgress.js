const mongoose = require("mongoose");

const objectiveProgressSchema = new mongoose.Schema(
    {
        objectiveIndex: {
            type: Number,
            required: true,
        },

        completed: {
            type: Boolean,
            default: false,
        },

        answer: {
            type: String,
            default: "",
        },
    },
    { _id: false }
);

const labProgressSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        lab: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lab",
            required: true,
        },

        objectives: {
            type: [objectiveProgressSchema],
            default: [],
        },

        completed: {
            type: Boolean,
            default: false,
        },

        xpAwarded: {
            type: Boolean,
            default: false,
        },

        startedAt: {
            type: Date,
            default: Date.now,
        },

        completedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// One progress record per user per lab
labProgressSchema.index(
    { user: 1, lab: 1 },
    { unique: true }
);

module.exports = mongoose.model(
    "LabProgress",
    labProgressSchema
);