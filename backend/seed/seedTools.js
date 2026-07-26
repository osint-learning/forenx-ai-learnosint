const mongoose = require("mongoose");
const dotenv = require("dotenv");
const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);
const Tool = require("../models/Tool");
const tools = require("../data/tools.json");

dotenv.config();

async function seedTools() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected");

    // Remove existing tools
    await Tool.deleteMany();

    console.log("🗑 Existing tools removed");

    // Insert new tools
    await Tool.insertMany(tools);

    console.log(`✅ ${tools.length} tools inserted successfully`);

    process.exit();
  } catch (error) {
    console.error("❌ Error seeding tools:", error);
    process.exit(1);
  }
}

seedTools();