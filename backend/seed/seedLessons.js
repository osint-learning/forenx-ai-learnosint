require("dotenv").config();

const mongoose = require("mongoose");
const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDB = require("../config/db");

const Lesson = require("../models/Lesson");
const Tool = require("../models/Tool");

const lessons = require("../data/lessons.json");

const seedLessons = async () => {
    try {
        await connectDB();

        console.log("✅ MongoDB Connected");

        // Remove existing lessons
        await Lesson.deleteMany();

        console.log("🗑 Existing lessons removed");

        const lessonDocuments = [];

        for (const lesson of lessons) {

            const tool = await Tool.findOne({
                name: lesson.toolName,
            });

            if (!tool) {
                console.log(`⚠ Tool not found: ${lesson.toolName}`);
                continue;
            }

            lessonDocuments.push({
                tool: tool._id,
                lessonNumber: lesson.lessonNumber,
                title: lesson.title,
                shortDescription: lesson.shortDescription,
                objectives: lesson.objectives,
                content: lesson.content,
                keyPoints: lesson.keyPoints,
                example: lesson.example,
                estimatedTime: lesson.estimatedTime,
                order: lesson.order,
            });

        }

        await Lesson.insertMany(lessonDocuments);

        console.log(`✅ ${lessonDocuments.length} lessons inserted successfully`);

        process.exit();

    } catch (error) {

        console.error("❌ Error seeding lessons:", error);

        process.exit(1);

    }
};

seedLessons();