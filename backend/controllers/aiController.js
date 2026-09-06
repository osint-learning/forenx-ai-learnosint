const asyncHandler = require("express-async-handler");

const { askOllama } = require("../services/ai/ollamaService");
const Tool = require("../models/Tool");


/*
|--------------------------------------------------------------------------
| Test AI
|--------------------------------------------------------------------------
*/

const testAI = asyncHandler(async (req, res) => {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== "string") {
        return res.status(400).json({
            success: false,
            message: "Prompt is required.",
        });
    }

    const result = await askOllama(prompt);

    if (!result.success) {
        return res.status(503).json({
            success: false,
            message: result.message,
        });
    }

    res.json({
        success: true,
        model: result.model,
        response: result.response,
        createdAt: result.createdAt,
    });
});


/*
|--------------------------------------------------------------------------
| Intelligent Tool Recommendation
|--------------------------------------------------------------------------
| Phase 2 - Feature 1
|--------------------------------------------------------------------------
*/

const recommendTools = asyncHandler(async (req, res) => {
    const { objective } = req.body;


    /*
    |--------------------------------------------------------------------------
    | Validate objective
    |--------------------------------------------------------------------------
    */

    if (!objective || typeof objective !== "string") {
        return res.status(400).json({
            success: false,
            message: "Investigation objective is required.",
        });
    }

    const cleanObjective = objective.trim();

    if (!cleanObjective) {
        return res.status(400).json({
            success: false,
            message: "Investigation objective cannot be empty.",
        });
    }


    /*
    |--------------------------------------------------------------------------
    | Get available tools from MongoDB
    |--------------------------------------------------------------------------
    */

    const tools = await Tool.find({})
        .select("name category shortDescription difficulty tags")
        .lean();

    if (!tools.length) {
        return res.status(404).json({
            success: false,
            message: "No OSINT tools are currently available.",
        });
    }


    /*
    |--------------------------------------------------------------------------
    | Normalize objective
    |--------------------------------------------------------------------------
    */

    const objectiveText = cleanObjective.toLowerCase();


    /*
    |--------------------------------------------------------------------------
    | Detect investigation intent
    |--------------------------------------------------------------------------
    */

    let detectedIntent = "general";

    if (
        objectiveText.includes("subdomain") ||
        objectiveText.includes("subdomains") ||
        objectiveText.includes("dns enumeration") ||
        objectiveText.includes("find subdomains")
    ) {
        detectedIntent = "subdomain";
    }

    else if (
        objectiveText.includes("email") ||
        objectiveText.includes("emails") ||
        objectiveText.includes("email address")
    ) {
        detectedIntent = "email";
    }

    else if (
        objectiveText.includes("username") ||
        objectiveText.includes("usernames") ||
        objectiveText.includes("social media account")
    ) {
        detectedIntent = "username";
    }

    else if (
        objectiveText.includes("phone") ||
        objectiveText.includes("phone number") ||
        objectiveText.includes("mobile number")
    ) {
        detectedIntent = "phone";
    }

    else if (
        objectiveText.includes("metadata") ||
        objectiveText.includes("exif")
    ) {
        detectedIntent = "metadata";
    }

    else if (
        objectiveText.includes("whois") ||
        objectiveText.includes("domain ownership") ||
        objectiveText.includes("domain registration")
    ) {
        detectedIntent = "whois";
    }

    else if (
        objectiveText.includes("website technology") ||
        objectiveText.includes("technology stack") ||
        objectiveText.includes("tech stack")
    ) {
        detectedIntent = "technology";
    }


    /*
    |--------------------------------------------------------------------------
    | Intent-specific matching rules
    |--------------------------------------------------------------------------
    */

    const intentRules = {

        subdomain: {
            categories: [
                "Domain Investigation",
                "Utilities",
                "Email Investigation"
            ],

            keywords: [
                "subdomain",
                "subdomains",
                "dns",
                "enumeration",
                "domain discovery",
                "domain enumeration",
                "theharvester",
                "subfinder",
                "amass",
                "assetfinder",
                "dnsrecon",
                "fierce"
            ]
        },

        email: {
            categories: [
                "Email Investigation"
            ],

            keywords: [
                "email",
                "emails",
                "mail",
                "theharvester",
                "holehe",
                "hunter"
            ]
        },

        username: {
            categories: [
                "Username Investigation"
            ],

            keywords: [
                "username",
                "usernames",
                "social",
                "sherlock",
                "maigret"
            ]
        },

        phone: {
            categories: [
                "Phone Investigation"
            ],

            keywords: [
                "phone",
                "mobile",
                "telephone",
                "phoneinfoga"
            ]
        },

        metadata: {
            categories: [
                "Metadata Analysis"
            ],

            keywords: [
                "metadata",
                "exif",
                "document",
                "image"
            ]
        },

        whois: {
            categories: [
                "Domain Investigation"
            ],

            keywords: [
                "whois",
                "registration",
                "registrant",
                "ownership",
                "domain"
            ]
        },

        technology: {
            categories: [
                "Utilities",
                "Domain Investigation"
            ],

            keywords: [
                "technology",
                "technologies",
                "tech",
                "stack",
                "website"
            ]
        }
    };


    /*
    |--------------------------------------------------------------------------
    | Score tools
    |--------------------------------------------------------------------------
    */

    const scoredTools = tools.map((tool) => {

        const name = (tool.name || "").toLowerCase();
        const category = (tool.category || "").toLowerCase();

        const searchableText = [
            tool.name,
            tool.category,
            tool.shortDescription,
            ...(tool.tags || [])
        ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

        let score = 0;


        /*
        |--------------------------------------------------------------------------
        | Specific intent scoring
        |--------------------------------------------------------------------------
        */

        if (detectedIntent !== "general") {

            const rule = intentRules[detectedIntent];


            /*
            |--------------------------------------------------------------------------
            | Keyword relevance
            |--------------------------------------------------------------------------
            */

            let keywordMatches = 0;

            rule.keywords.forEach((keyword) => {

                if (searchableText.includes(keyword)) {
                    score += 5;
                    keywordMatches++;
                }

            });


            /*
            |--------------------------------------------------------------------------
            | Exact tool-name relevance
            |--------------------------------------------------------------------------
            */

            if (
                rule.keywords.some(
                    (keyword) => name.includes(keyword)
                )
            ) {
                score += 15;
            }


            /*
            |--------------------------------------------------------------------------
            | Category relevance
            |--------------------------------------------------------------------------
            */

            if (
                keywordMatches > 0 &&
                rule.categories.some(
                    (allowedCategory) =>
                        category === allowedCategory.toLowerCase()
                )
            ) {
                score += 10;
            }


            /*
            |--------------------------------------------------------------------------
            | Special priority for subdomain investigation
            |--------------------------------------------------------------------------
            */

            if (detectedIntent === "subdomain") {

                const strongSubdomainTerms = [
                    "subdomain",
                    "subdomains",
                    "subfinder",
                    "amass",
                    "assetfinder",
                    "dnsrecon",
                    "fierce",
                    "theharvester",
                    "enumeration"
                ];

                strongSubdomainTerms.forEach((term) => {

                    if (searchableText.includes(term)) {
                        score += 15;
                    }

                });
            }

        }

        else {

            /*
            |--------------------------------------------------------------------------
            | General objective matching
            |--------------------------------------------------------------------------
            */

            const objectiveWords = objectiveText
                .split(/[^a-z0-9]+/)
                .filter((word) => word.length >= 4);


            objectiveWords.forEach((word) => {

                if (searchableText.includes(word)) {
                    score += 2;
                }

            });

        }


        return {
            tool,
            score
        };
    });


    /*
    |--------------------------------------------------------------------------
    | Select relevant tools
    |--------------------------------------------------------------------------
    */

    let selectedTools = scoredTools
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map((item) => item.tool);


    /*
    |--------------------------------------------------------------------------
    | Fallback
    |--------------------------------------------------------------------------
    */

    if (selectedTools.length === 0) {
        selectedTools = tools.slice(0, 5);
    }


    /*
    |--------------------------------------------------------------------------
    | Compact tool catalogue
    |--------------------------------------------------------------------------
    */

    const toolCatalogue = selectedTools.map((tool) => ({
        name: tool.name,
        category: tool.category,
        description: tool.shortDescription || "",
        difficulty: tool.difficulty || "Beginner"
    }));


    /*
    |--------------------------------------------------------------------------
    | AI recommendation prompt
    |--------------------------------------------------------------------------
    */

    const prompt = `
You are ForenX AI, an OSINT learning assistant.

Investigation objective:
${cleanObjective}

Detected investigation type:
${detectedIntent}

Available relevant tools:
${JSON.stringify(toolCatalogue)}

Recommend the most useful tools for this investigation.

Rules:
- Recommend ONLY tools from the available list.
- Never invent a tool.
- Do not recommend unrelated tools.
- Explain why each recommended tool is useful.
- Prefer beginner-friendly tools when appropriate.
- Give a logical investigation order.
- Do not claim that any tool was executed.
- Do not fabricate investigation results.
- Use only the exact tool names provided.
- Do not include tools that are not in the available list.

Keep the answer short.

Format:

RECOMMENDED TOOLS:
1. Tool name - reason - difficulty
2. Tool name - reason - difficulty
3. Tool name - reason - difficulty

INVESTIGATION ORDER:
1. First step
2. Second step
3. Third step

IMPORTANT:
Mention authorization or limitations when relevant.
`;


    /*
    |--------------------------------------------------------------------------
    | Ask ForenX AI
    |--------------------------------------------------------------------------
    */

    const result = await askOllama(prompt, null, {
        lightweight: true,
        numPredict: 180,
        temperature: 0.1,
        timeout: 120000
    });


    /*
    |--------------------------------------------------------------------------
    | Handle AI error
    |--------------------------------------------------------------------------
    */

    if (!result.success) {
        return res.status(503).json({
            success: false,
            message: result.message,
        });
    }


    /*
    |--------------------------------------------------------------------------
    | Return recommendation
    |--------------------------------------------------------------------------
    */

    res.json({
        success: true,
        objective: cleanObjective,
        detectedIntent,
        recommendations: result.response,
        model: result.model,
        availableToolCount: tools.length,
        analysedToolCount: selectedTools.length,
        analysedTools: selectedTools.map((tool) => tool.name),
        createdAt: result.createdAt,
    });
});


/*
|--------------------------------------------------------------------------
| AI Command Suggestions
|--------------------------------------------------------------------------
| Phase 2 - Feature 2
|--------------------------------------------------------------------------
*/

const suggestCommand = asyncHandler(async (req, res) => {
    const { tool, objective } = req.body;


    /*
    |--------------------------------------------------------------------------
    | Validate input
    |--------------------------------------------------------------------------
    */

    if (!tool || typeof tool !== "string") {
        return res.status(400).json({
            success: false,
            message: "Tool name is required.",
        });
    }

    if (!objective || typeof objective !== "string") {
        return res.status(400).json({
            success: false,
            message: "Investigation objective is required.",
        });
    }

    const cleanTool = tool.trim();
    const cleanObjective = objective.trim();

    if (!cleanTool || !cleanObjective) {
        return res.status(400).json({
            success: false,
            message: "Tool name and objective cannot be empty.",
        });
    }


    /*
    |--------------------------------------------------------------------------
    | Find actual tool in MongoDB
    |--------------------------------------------------------------------------
    */

    const toolData = await Tool.findOne({
        name: {
            $regex: `^${cleanTool.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
            $options: "i",
        },
    })
        .select(
            "name category shortDescription difficulty syntax commands examples"
        )
        .lean();


    /*
    |--------------------------------------------------------------------------
    | Tool not found
    |--------------------------------------------------------------------------
    */

    if (!toolData) {
        return res.status(404).json({
            success: false,
            message: "The requested OSINT tool is not available in ForenX.",
        });
    }


    /*
    |--------------------------------------------------------------------------
    | Build command list
    |--------------------------------------------------------------------------
    */

    const commandList = [
        ...(toolData.commands || []).map((command) => ({
            title: command.title,
            command: command.command,
            explanation: command.explanation,
        })),

        ...(toolData.syntax
            ? [
                {
                    title: "General Syntax",
                    command: toolData.syntax,
                    explanation: "General command syntax for this tool.",
                },
            ]
            : []),
    ];


    /*
    |--------------------------------------------------------------------------
    | Remove duplicate commands
    |--------------------------------------------------------------------------
    */

    const availableCommands = Array.from(
        new Map(
            commandList.map((item) => [item.command, item])
        ).values()
    );


    /*
    |--------------------------------------------------------------------------
    | Check command information
    |--------------------------------------------------------------------------
    */

    if (availableCommands.length === 0) {
        return res.status(404).json({
            success: false,
            message: "No command information is available for this tool.",
        });
    }


    /*
    |--------------------------------------------------------------------------
    | AI command selection prompt
    |--------------------------------------------------------------------------
    */

    const prompt = `
You are ForenX AI.

Tool:
${toolData.name}

Student objective:
${cleanObjective}

Available commands:
${JSON.stringify(availableCommands)}

Select the single best command for the objective.

STRICT RULES:
- Choose ONLY from the available commands.
- The command must exactly match one of the provided command values.
- Do NOT invent a command.
- Do NOT explain your reasoning.
- Do NOT write an introduction.
- Do NOT repeat the objective.
- Do NOT write analysis.
- Do NOT mention other commands.
- Return ONLY valid JSON.
- The JSON must contain exactly two fields: command and explanation.
- Keep explanation short.

Return:

{
  "command": "selected command",
  "explanation": "short explanation"
}
`;


    /*
    |--------------------------------------------------------------------------
    | Ask lightweight ForenX AI
    |--------------------------------------------------------------------------
    */

    const result = await askOllama(prompt, null, {
        lightweight: true,
        numPredict: 100,
        temperature: 0.1,
        timeout: 120000,
        format: "json",
    });


    /*
    |--------------------------------------------------------------------------
    | AI error
    |--------------------------------------------------------------------------
    */

    if (!result.success) {
        return res.status(503).json({
            success: false,
            message: result.message,
        });
    }


    /*
    |--------------------------------------------------------------------------
    | Parse AI JSON
    |--------------------------------------------------------------------------
    */

    let suggestion;

    try {
        suggestion = JSON.parse(result.response);
    } catch (error) {

        return res.status(502).json({
            success: false,
            message: "AI returned an invalid command suggestion.",
            rawResponse: result.response,
        });
    }


    /*
    |--------------------------------------------------------------------------
    | Validate AI response structure
    |--------------------------------------------------------------------------
    */

    if (
        !suggestion ||
        typeof suggestion.command !== "string" ||
        typeof suggestion.explanation !== "string"
    ) {
        return res.status(502).json({
            success: false,
            message: "AI returned an invalid command suggestion format.",
            rawResponse: result.response,
        });
    }


    /*
    |--------------------------------------------------------------------------
    | Validate command against MongoDB
    |--------------------------------------------------------------------------
    */

    const validCommands = availableCommands.map(
        (item) => item.command
    );


    if (!validCommands.includes(suggestion.command)) {

        return res.status(502).json({
            success: false,
            message:
                "AI suggested a command that is not available for this tool.",
            suggestedCommand: suggestion.command,
        });
    }


    /*
    |--------------------------------------------------------------------------
    | Return structured suggestion
    |--------------------------------------------------------------------------
    */

    res.json({
        success: true,
        tool: toolData.name,
        objective: cleanObjective,

        suggestion: {
            command: suggestion.command,
            explanation: suggestion.explanation,
        },

        availableCommandCount: availableCommands.length,
        model: result.model,
        createdAt: result.createdAt,
    });
});

/*
|--------------------------------------------------------------------------
| Personalized Learning Recommendations
|--------------------------------------------------------------------------
| Phase 2 - Feature 3
|--------------------------------------------------------------------------
*/

const personalizedLearningRecommendations = asyncHandler(
    async (req, res) => {

        /*
        |--------------------------------------------------------------------------
        | Get optional learning focus
        |--------------------------------------------------------------------------
        */

        const { focus } = req.body || {};

        const cleanFocus =
            typeof focus === "string"
                ? focus.trim()
                : "";


        /*
        |--------------------------------------------------------------------------
        | Get student profile
        |--------------------------------------------------------------------------
        |
        | authMiddleware places the authenticated user in req.user.
        | We safely read the learning-related fields so this feature
        | continues working even if some optional fields are missing.
        |
        */

        const user = req.user || {};

        const studentProfile = {
            level: user.level ?? 1,
            currentXp: user.currentXp ?? 0,
            nextLevelXp: user.nextLevelXp ?? 100,
            streakDays: user.streakDays ?? 0,
            completedLabsCount: user.completedLabsCount ?? 0,
            accuracyRate: user.accuracyRate ?? 0,
            rankPosition: user.rankPosition ?? null,

            /*
            | Optional fields.
            | These are used only if your User model already contains them.
            */

            completedTools: Array.isArray(user.completedTools)
                ? user.completedTools
                : [],

            completedLessons: Array.isArray(user.completedLessons)
                ? user.completedLessons
                : [],

            recentActivities: Array.isArray(user.recentActivities)
                ? user.recentActivities.slice(0, 10)
                : [],
        };


        /*
        |--------------------------------------------------------------------------
        | Get available OSINT tools
        |--------------------------------------------------------------------------
        */

        const tools = await Tool.find({})
            .select(
                "name category shortDescription difficulty purpose whenToUse tags"
            )
            .lean();


        if (!tools.length) {
            return res.status(404).json({
                success: false,
                message: "No OSINT tools are currently available.",
            });
        }


        /*
        |--------------------------------------------------------------------------
        | Create compact tool catalogue
        |--------------------------------------------------------------------------
        */

        const toolCatalogue = tools.map((tool) => ({
            name: tool.name,
            category: tool.category,
            description: tool.shortDescription || "",
            purpose: tool.purpose || "",
            whenToUse: tool.whenToUse || "",
            difficulty: tool.difficulty || "Beginner",
            tags: tool.tags || [],
        }));


        /*
        |--------------------------------------------------------------------------
        | Determine learning level
        |--------------------------------------------------------------------------
        */

        let recommendedDifficulty = "Beginner";

        if (studentProfile.level >= 10) {
            recommendedDifficulty = "Advanced";
        }
        else if (studentProfile.level >= 5) {
            recommendedDifficulty = "Intermediate";
        }


        /*
        |--------------------------------------------------------------------------
        | Determine learning condition
        |--------------------------------------------------------------------------
        */

        let learningCondition = "normal";

        if (studentProfile.accuracyRate < 50) {
            learningCondition = "needs_foundation";
        }
        else if (studentProfile.accuracyRate < 75) {
            learningCondition = "needs_practice";
        }
        else if (studentProfile.accuracyRate >= 90) {
            learningCondition = "ready_for_challenge";
        }


        /*
        |--------------------------------------------------------------------------
        | AI Prompt
        |--------------------------------------------------------------------------
        */

        const prompt = `
You are ForenX AI, a personalized OSINT learning assistant.

Your task is to create a personalized learning recommendation for a
cybersecurity student using the student's actual learning profile and
the OSINT tools available in ForenX.

STUDENT PROFILE:
${JSON.stringify(studentProfile, null, 2)}

RECOMMENDED DIFFICULTY:
${recommendedDifficulty}

LEARNING CONDITION:
${learningCondition}

OPTIONAL STUDENT FOCUS:
${cleanFocus || "No specific focus provided."}

AVAILABLE FORENX OSINT TOOLS:
${JSON.stringify(toolCatalogue, null, 2)}

TASK:

Create a short personalized learning plan.

The plan should:
1. Recommend the most appropriate OSINT topics or tools for this student.
2. Consider the student's level and learning progress.
3. Consider the student's accuracy rate.
4. Prefer foundational topics when the student needs stronger fundamentals.
5. Recommend more advanced tools only when appropriate.
6. Avoid recommending tools the student has already completed when completion
   information is available.
7. Use ONLY tools from the available ForenX tools list.
8. Never invent a tool.
9. Explain why each recommendation fits the student.
10. Give a logical learning order.
11. Give one immediate next action.
12. Keep the recommendation concise.
13. Do not claim that any tool was executed.

Return ONLY valid JSON.

Use exactly this structure:

{
  "learningLevel": "Beginner/Intermediate/Advanced",
  "learningFocus": "short description",
  "recommendations": [
    {
      "tool": "exact tool name",
      "reason": "why this is recommended for this student",
      "difficulty": "Beginner/Intermediate/Advanced"
    }
  ],
  "learningOrder": [
    "first step",
    "second step",
    "third step"
  ],
  "nextAction": "one immediate action for the student"
}

IMPORTANT:
- Every recommended tool name MUST exactly match a tool in the available list.
- Do not invent tools.
- Return JSON only.
`;


        /*
        |--------------------------------------------------------------------------
        | Ask ForenX AI
        |--------------------------------------------------------------------------
        */

        const result = await askOllama(prompt, null, {
            lightweight: true,
            numPredict: 400,
            temperature: 0.1,
            timeout: 120000,
            format: "json",
        });


        /*
        |--------------------------------------------------------------------------
        | Handle AI error
        |--------------------------------------------------------------------------
        */

        if (!result.success) {
            return res.status(503).json({
                success: false,
                message: result.message,
            });
        }


        /*
        |--------------------------------------------------------------------------
        | Parse AI JSON
        |--------------------------------------------------------------------------
        */

        let recommendation;

        try {
            recommendation = JSON.parse(result.response);
        }
        catch (error) {

            return res.status(502).json({
                success: false,
                message:
                    "AI returned an invalid personalized learning recommendation.",
                rawResponse: result.response,
            });
        }


        /*
        |--------------------------------------------------------------------------
        | Validate recommendation structure
        |--------------------------------------------------------------------------
        */

        if (
            !recommendation ||
            !Array.isArray(recommendation.recommendations)
        ) {
            return res.status(502).json({
                success: false,
                message:
                    "AI returned an invalid personalized recommendation format.",
                rawResponse: result.response,
            });
        }


        /*
        |--------------------------------------------------------------------------
        | Validate recommended tools against MongoDB
        |--------------------------------------------------------------------------
        */

        const availableToolNames = tools.map(
            (tool) => tool.name
        );


        const invalidTools =
            recommendation.recommendations.filter(
                (item) =>
                    !item ||
                    typeof item.tool !== "string" ||
                    !availableToolNames.includes(item.tool)
            );


        if (invalidTools.length > 0) {

            return res.status(502).json({
                success: false,
                message:
                    "AI recommended a tool that is not available in ForenX.",
                invalidRecommendations: invalidTools,
            });
        }


        /*
        |--------------------------------------------------------------------------
        | Return personalized recommendation
        |--------------------------------------------------------------------------
        */

        res.json({
            success: true,

            studentProfile: {
                level: studentProfile.level,
                currentXp: studentProfile.currentXp,
                nextLevelXp: studentProfile.nextLevelXp,
                streakDays: studentProfile.streakDays,
                completedLabsCount:
                    studentProfile.completedLabsCount,
                accuracyRate:
                    studentProfile.accuracyRate,
            },

            recommendation,

            availableToolCount: tools.length,

            model: result.model,

            createdAt: result.createdAt,
        });
    }
);

/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

module.exports = {
    testAI,
    recommendTools,
    suggestCommand,
    personalizedLearningRecommendations,
};