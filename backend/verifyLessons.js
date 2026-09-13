require("dotenv").config();

const mongoose = require("mongoose");
const Lesson = require("./models/Lesson");
const Tool = require("./models/Tool");

async function verify() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const tools = await Tool.countDocuments();
    const lessons = await Lesson.countDocuments();

    const grouped = await Lesson.aggregate([
      {
        $group: {
          _id: "$tool",
          count: { $sum: 1 }
        }
      }
    ]);

    console.log("Tools in DB:", tools);
    console.log("Lessons in DB:", lessons);
    console.log("Tool lesson groups:", grouped.length);

    console.log(
      "Lesson counts:",
      grouped
        .map(x => x.count)
        .sort((a, b) => a - b)
        .join(", ")
    );

    await mongoose.disconnect();
  } catch (error) {
    console.error("ERROR:", error.message);
    process.exit(1);
  }
}

verify();