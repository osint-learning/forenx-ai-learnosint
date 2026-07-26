const mongoose = require("mongoose");

const toolSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Search Engines",
        "Google Dorking",
        "Domain Investigation",
        "Email Investigation",
        "Username Investigation",
        "Phone Investigation",
        "Metadata Analysis",
        "Geolocation",
        "Threat Intelligence",
        "Utilities",
      ],
    },

    shortDescription: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    purpose: {
      type: String,
      default: "",
    },

    whenToUse: {
      type: String,
      default: "",
    },

    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },

    supportedPlatforms: [
      {
        type: String,
      },
    ],

    installation: {
      type: String,
      default: "",
    },

    syntax: {
      type: String,
      default: "",
    },

    commands: [
      {
        title: String,
        command: String,
        explanation: String,
      },
    ],

    examples: [
      {
        title: String,
        command: String,
        output: String,
      },
    ],

    sampleOutput: {
      type: String,
      default: "",
    },

    outputExplanation: {
      type: String,
      default: "",
    },

    advantages: [String],

    limitations: [String],

    bestPractices: [String],

    tags: [String],

    relatedTools: [String],

    icon: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Tool", toolSchema);