const mongoose = require("mongoose");
const dotenv = require("dotenv");
const dns = require("dns");
const fs = require("fs");
const path = require("path");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

dotenv.config();

const connectDB = require("../config/db");
const Tool = require("../models/Tool");
const Quiz = require("../models/Quiz");

const quizzesDirectory = path.join(__dirname, "../data/quizzes");

// Filename → actual Tool name in MongoDB
const toolAliases = {
  whois: "WHOIS",
  dnslookup: "DNS Lookup",
  theharvester: "theHarvester",
  sherlock: "Sherlock",
  virustotal: "VirusTotal",
  nslookup: "nslookup",
  dig: "dig",
  dnsrecon: "dnsrecon",
  dnsenum: "dnsenum",
  fierce: "Fierce",
  subfinder: "Subfinder",
  amass: "Amass",
  assetfinder: "Assetfinder",
  maigret: "Maigret",
  whatsmyname: "WhatsMyName",
  holehe: "Holehe",
  phoneinfoga: "PhoneInfoga",
  googledorking: "Google Dorking",
  googlelens: "Google Lens",
  exiftool: "ExifTool",
  whatweb: "WhatWeb",
  wappalyzer: "Wappalyzer",
  nmap: "Nmap",
  shodan: "Shodan",
  censys: "Censys",
  crtsh: "crt.sh",
  securitytrails: "SecurityTrails",
  urlscan: "URLScan.io",
  hibp: "Have I Been Pwned",
  wayback: "Wayback Machine",
  spiderfoot: "SpiderFoot",
  hunter: "Hunter.io",
  google: "Google",
  bing: "Bing",
  duckduckgo: "DuckDuckGo",
  yandex: "Yandex",
  bravesearch: "Brave Search",
  mojeek: "Mojeek",
  dnsdumpster: "DNSDumpster",
};

const seedQuizzes = async () => {
  try {
    await connectDB();

    console.log("🧹 Removing existing quiz data...");
    await Quiz.deleteMany();

    const quizFiles = fs
      .readdirSync(quizzesDirectory)
      .filter((file) => file.endsWith(".js"))
      .sort();

    console.log(`📚 Quiz files found: ${quizFiles.length}`);
    console.log("");

    let totalQuestions = 0;
    let successfulFiles = 0;
    let failedFiles = 0;

    for (const file of quizFiles) {
      const filePath = path.join(quizzesDirectory, file);

      delete require.cache[require.resolve(filePath)];

      const quizzes = require(filePath);

      if (!Array.isArray(quizzes)) {
        console.log(`❌ Invalid quiz format: ${file}`);
        failedFiles++;
        continue;
      }

      const fileKey = file
        .replace(/\.js$/i, "")
        .toLowerCase();

      const toolName = toolAliases[fileKey];

      if (!toolName) {
        console.log(`⚠️ No tool mapping for quiz file: ${file}`);
        failedFiles++;
        continue;
      }

      const tool = await Tool.findOne({ name: toolName });

      if (!tool) {
        console.log(
          `⚠️ Tool not found in database: ${toolName} (${file})`
        );
        failedFiles++;
        continue;
      }

      if (quizzes.length !== 5) {
        console.log(
          `⚠️ ${file}: expected 5 questions, found ${quizzes.length}`
        );
      }

      console.log(`📝 ${tool.name}: ${quizzes.length} questions`);

      for (const quiz of quizzes) {
        await Quiz.create({
          tool: tool._id,
          question: quiz.question,
          options: quiz.options,
          correctAnswerIndex: quiz.correctAnswerIndex,
          explanation: quiz.explanation || "",
          difficulty: quiz.difficulty || "Beginner",
          order: quiz.order || 1,
        });

        totalQuestions++;
      }

      successfulFiles++;
    }

    console.log("");
    console.log("====================================");
    console.log("✅ QUIZ DATA SEEDED SUCCESSFULLY");
    console.log("====================================");
    console.log(`Quiz files found: ${quizFiles.length}`);
    console.log(`Successful files: ${successfulFiles}`);
    console.log(`Failed files: ${failedFiles}`);
    console.log(`Total questions: ${totalQuestions}`);
    console.log("====================================");

    await mongoose.disconnect();

    process.exit(0);
  } catch (err) {
    console.error("❌ Quiz seeding failed:");
    console.error(err);

    await mongoose.disconnect();

    process.exit(1);
  }
};

seedQuizzes();