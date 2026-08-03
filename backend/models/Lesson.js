const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
  {
    tool: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tool",
      required: true,
    },

    lessonNumber: {
      type: Number,
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    shortDescription: {
      type: String,
      default: "",
    },

    objectives: [
      {
        type: String,
      },
    ],

    content: {
      type: String,
      required: true,
    },

    keyPoints: [
      {
        type: String,
      },
    ],

    example: {
      type: String,
      default: "",
    },

    estimatedTime: {
      type: Number,
      default: 5,
    },

    order: {
      type: Number,
      default: 1,
    },

    // ---------- NEW FIELDS ----------

    resources: [
      {
        title: String,
        description: String,
        url: String,
      },
    ],

    prerequisites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lesson",
      },
    ],

    nextLesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      default: null,
    },

    previousLesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      default: null,
    },

    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },

    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Lesson", lessonSchema);