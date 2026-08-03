const mongoose = require("mongoose");
const dotenv = require("dotenv");
const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);
const connectDB = require("../config/db");

const Tool = require("../models/Tool");
const Quiz = require("../models/Quiz");

const quizzes = require("../data/quizzes.json");

dotenv.config();

connectDB();

const seedQuizzes = async () => {
  try {
    await Quiz.deleteMany();

    for (const quiz of quizzes) {
      const tool = await Tool.findOne({ name: quiz.toolName });

      if (!tool) {
        console.log(`Tool not found: ${quiz.toolName}`);
        continue;
      }

      await Quiz.create({
        tool: tool._id,
        question: quiz.question,
        options: quiz.options,
        correctAnswerIndex: quiz.correctAnswerIndex,
        explanation: quiz.explanation,
        difficulty: quiz.difficulty,
        order: quiz.order,
      });
    }

    console.log("✅ Quiz data seeded successfully.");

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedQuizzes();