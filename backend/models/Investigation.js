const mongoose = require("mongoose");

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
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Investigation", investigationSchema);
