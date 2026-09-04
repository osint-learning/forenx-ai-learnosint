require("dotenv").config();

const dns = require("dns");

// Fix MongoDB Atlas DNS resolution
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDB = require("./config/db");
const Lab = require("./models/Lab");

const seedLabs = async () => {
    try {
        await connectDB();

        // Remove existing labs created by this seeder
        await Lab.deleteMany({
            tool: "WHOIS",
        });

        const whoisLab = {
            title: "Domain Registration Investigation",

            description:
                "Practice using WHOIS to investigate domain registration information.",

            tool: "WHOIS",

            category: "Domain Investigation",

            difficulty: "Easy",

            target: "example.com",

            missionBrief:
                "You are investigating a domain during an initial OSINT reconnaissance phase. Use WHOIS to retrieve the registration information for the target domain. Analyze the real output and identify important domain registration details.",

            requiredCommand: "whois",

            objectives: [
                {
                    question:
                        "Execute a WHOIS query against the target domain.",

                    type: "command",

                    expectedField: "whois",

                    answer: "",

                    completed: false,
                },

                {
                    question:
                        "Identify the registrar of the target domain from the WHOIS output.",

                    type: "answer",

                    expectedField: "registrar",

                    answer: "",

                    completed: false,
                },

                {
                    question:
                        "Identify the domain creation date from the WHOIS output.",

                    type: "answer",

                    expectedField: "creationDate",

                    answer: "",

                    completed: false,
                },

                {
                    question:
                        "Identify one name server associated with the domain.",

                    type: "answer",

                    expectedField: "nameServer",

                    answer: "",

                    completed: false,
                },
            ],

            hints: [
                "Use the WHOIS tool you learned in the lesson.",

                "The command should query the target domain.",

                "Look carefully at the real WHOIS output.",

                "Search the output for registrar, creation date, and name server information.",
            ],

            xpReward: 100,

            isActive: true,
        };

        const lab = await Lab.create(whoisLab);

        console.log("=================================");
        console.log("✅ WHOIS Practice Lab Created");
        console.log("=================================");
        console.log("Lab ID:", lab._id);
        console.log("Title:", lab.title);
        console.log("Tool:", lab.tool);
        console.log("Target:", lab.target);
        console.log("XP:", lab.xpReward);
        console.log("=================================");

        process.exit(0);
    } catch (error) {
        console.error("❌ Failed to seed lab:");
        console.error(error);
        process.exit(1);
    }
};

seedLabs();