const asyncHandler = require("express-async-handler");

const { askOllama } = require("../services/ai/ollamaService");
const Tool = require("../models/Tool");
const Lab = require("../models/Lab");
const LabProgress = require("../models/LabProgress");

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
| AI Quiz Generation
|--------------------------------------------------------------------------
| Phase 2 - Feature 16
|--------------------------------------------------------------------------
*/

const generateAIQuiz = asyncHandler(async (req, res) => {

    const {
        tool,
        difficulty = "Beginner",
        questionCount = 5,
    } = req.body || {};


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


    const allowedDifficulties = [
        "Beginner",
        "Intermediate",
        "Advanced",
    ];

    if (!allowedDifficulties.includes(difficulty)) {
        return res.status(400).json({
            success: false,
            message: "Invalid difficulty level.",
        });
    }


    const count = Math.min(
        Math.max(parseInt(questionCount, 10) || 5, 1),
        10
    );


    /*
    |--------------------------------------------------------------------------
    | Find actual tool from MongoDB
    |--------------------------------------------------------------------------
    */

    const toolData = await Tool.findOne({
        name: {
            $regex: `^${tool.trim()}$`,
            $options: "i",
        },
    })
        .select(
            "name category shortDescription description purpose whenToUse difficulty syntax commands examples sampleOutput outputExplanation advantages limitations bestPractices tags relatedTools"
        )
        .lean();


    if (!toolData) {
        return res.status(404).json({
            success: false,
            message: `Tool "${tool}" was not found in ForenX.`,
        });
    }


    /*
    |--------------------------------------------------------------------------
    | Prepare tool knowledge for AI
    |--------------------------------------------------------------------------
    */

    const toolKnowledge = {
        name: toolData.name,
        category: toolData.category,
        description: toolData.shortDescription || "",
        detailedDescription: toolData.description || "",
        purpose: toolData.purpose || "",
        whenToUse: toolData.whenToUse || "",
        difficulty: toolData.difficulty || "Beginner",
        syntax: toolData.syntax || "",
        commands: toolData.commands || [],
        examples: toolData.examples || [],
        sampleOutput: toolData.sampleOutput || "",
        outputExplanation: toolData.outputExplanation || "",
        advantages: toolData.advantages || [],
        limitations: toolData.limitations || [],
        bestPractices: toolData.bestPractices || [],
        tags: toolData.tags || [],
        relatedTools: toolData.relatedTools || [],
    };


    /*
    |--------------------------------------------------------------------------
    | AI Prompt
    |--------------------------------------------------------------------------
    */

    const prompt = `
You are ForenX AI, an OSINT learning assistant.

Generate a multiple-choice quiz for a cybersecurity student
learning the following OSINT tool.

TOOL INFORMATION:
${JSON.stringify(toolKnowledge, null, 2)}

QUIZ SETTINGS:
Difficulty: ${difficulty}
Number of questions: ${count}

REQUIREMENTS:

1. Generate exactly ${count} questions.
2. Questions must test understanding of the actual tool.
3. Use ONLY the information provided about the tool.
4. Do not invent tool features, commands, options, or capabilities.
5. Each question must have exactly 4 options.
6. There must be exactly one correct answer.
7. The correctAnswerIndex must be 0, 1, 2, or 3.
8. Provide a clear explanation for the correct answer.
9. Match the requested difficulty.
10. Questions should be useful for learning OSINT.
11. Avoid ambiguous questions.
12. Do not reveal the correct answer outside correctAnswerIndex.
13. Do not generate questions about tools that are not the selected tool.

Return ONLY valid JSON.

Use exactly this structure:

{
  "tool": "exact tool name",
  "difficulty": "${difficulty}",
  "questions": [
    {
      "question": "question text",
      "options": [
        "option 1",
        "option 2",
        "option 3",
        "option 4"
      ],
      "correctAnswerIndex": 0,
      "explanation": "short explanation"
    }
  ]
}

IMPORTANT:
- The tool name must exactly match the selected ForenX tool.
- Generate exactly ${count} questions.
- Each question must contain exactly 4 options.
- Return JSON only.
`;


    /*
    |--------------------------------------------------------------------------
    | Ask ForenX AI
    |--------------------------------------------------------------------------
    */

    const result = await askOllama(prompt, null, {
        lightweight: true,
        numPredict: 700,
        temperature: 0.2,
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
    | Parse AI response
    |--------------------------------------------------------------------------
    */

    let quiz;

    try {
        quiz = JSON.parse(result.response);
    }
    catch (error) {
        return res.status(502).json({
            success: false,
            message: "AI returned invalid quiz JSON.",
            rawResponse: result.response,
        });
    }


    /*
    |--------------------------------------------------------------------------
    | Validate quiz
    |--------------------------------------------------------------------------
    */

    if (
        !quiz ||
        !Array.isArray(quiz.questions) ||
        quiz.questions.length !== count
    ) {
        return res.status(502).json({
            success: false,
            message: "AI returned an invalid quiz format.",
            rawResponse: result.response,
        });
    }


    /*
    |--------------------------------------------------------------------------
    | Validate every question
    |--------------------------------------------------------------------------
    */

    for (const question of quiz.questions) {

        if (
            !question ||
            typeof question.question !== "string" ||
            !Array.isArray(question.options) ||
            question.options.length !== 4 ||
            !Number.isInteger(question.correctAnswerIndex) ||
            question.correctAnswerIndex < 0 ||
            question.correctAnswerIndex > 3 ||
            typeof question.explanation !== "string"
        ) {
            return res.status(502).json({
                success: false,
                message: "AI generated an invalid quiz question.",
                rawResponse: result.response,
            });
        }
    }


    /*
    |--------------------------------------------------------------------------
    | Return generated quiz
    |--------------------------------------------------------------------------
    */

    res.json({
        success: true,

        quiz: {
            tool: toolData.name,
            toolId: toolData._id,
            difficulty,
            questions: quiz.questions,
        },

        model: result.model,
        createdAt: result.createdAt,
    });
});


/*
|--------------------------------------------------------------------------
| AI Quiz Evaluation
|--------------------------------------------------------------------------
| Phase 2 - Feature 16
|--------------------------------------------------------------------------
*/

const evaluateAIQuiz = asyncHandler(async (req, res) => {

    const {
        tool,
        difficulty = "Beginner",
        questions,
        answers,
    } = req.body || {};


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

    if (!Array.isArray(questions) || questions.length === 0) {
        return res.status(400).json({
            success: false,
            message: "Quiz questions are required.",
        });
    }

    if (!Array.isArray(answers)) {
        return res.status(400).json({
            success: false,
            message: "Quiz answers are required.",
        });
    }

    if (answers.length !== questions.length) {
        return res.status(400).json({
            success: false,
            message: "Number of answers must match number of questions.",
        });
    }


    /*
    |--------------------------------------------------------------------------
    | Find actual tool
    |--------------------------------------------------------------------------
    */

    const toolData = await Tool.findOne({
        name: {
            $regex: `^${tool.trim()}$`,
            $options: "i",
        },
    })
        .select("name category shortDescription difficulty")
        .lean();


    if (!toolData) {
        return res.status(404).json({
            success: false,
            message: `Tool "${tool}" was not found in ForenX.`,
        });
    }


    /*
    |--------------------------------------------------------------------------
    | Evaluate answers
    |--------------------------------------------------------------------------
    */

    let score = 0;

    const results = questions.map((question, index) => {

        const selectedAnswer = answers[index];

        const correctAnswerIndex =
            Number(question.correctAnswerIndex);

        const selectedAnswerIndex =
            Number(selectedAnswer);

        const isCorrect =
            Number.isInteger(selectedAnswerIndex) &&
            selectedAnswerIndex === correctAnswerIndex;

        if (isCorrect) {
            score++;
        }

        return {
            questionNumber: index + 1,
            question: question.question,
            selectedAnswerIndex:
                Number.isInteger(selectedAnswerIndex)
                    ? selectedAnswerIndex
                    : null,
            correctAnswerIndex,
            isCorrect,
            explanation: question.explanation || "",
        };
    });


    /*
    |--------------------------------------------------------------------------
    | Calculate percentage
    |--------------------------------------------------------------------------
    */

    const totalQuestions = questions.length;

    const percentage = Math.round(
        (score / totalQuestions) * 100
    );


    /*
    |--------------------------------------------------------------------------
    | Determine performance level
    |--------------------------------------------------------------------------
    */

    let performance = "Needs Improvement";

    if (percentage >= 90) {
        performance = "Excellent";
    }
    else if (percentage >= 75) {
        performance = "Good";
    }
    else if (percentage >= 50) {
        performance = "Needs Practice";
    }


    /*
    |--------------------------------------------------------------------------
    | Prepare AI feedback data
    |--------------------------------------------------------------------------
    */

    const feedbackData = results.map((result) => ({
        questionNumber: result.questionNumber,
        question: result.question,
        isCorrect: result.isCorrect,
        selectedAnswerIndex: result.selectedAnswerIndex,
        correctAnswerIndex: result.correctAnswerIndex,
        explanation: result.explanation,
    }));


    /*
    |--------------------------------------------------------------------------
    | AI Feedback Prompt
    |--------------------------------------------------------------------------
    */

    const prompt = `
You are ForenX AI, an OSINT learning assistant.

Evaluate a student's performance in a ${difficulty}-level quiz
about the OSINT tool "${toolData.name}".

QUIZ PERFORMANCE:

Score: ${score}/${totalQuestions}
Percentage: ${percentage}%
Performance: ${performance}

QUESTION RESULTS:
${JSON.stringify(feedbackData, null, 2)}

TASK:

Provide concise personalized learning feedback.

You must:
1. Summarize the student's performance.
2. Identify what the student understood well.
3. Identify concepts that need more practice.
4. Give practical learning advice.
5. Suggest one immediate next learning action.
6. Base your feedback ONLY on the supplied quiz results.
7. Do not claim that the student used a tool.
8. Do not invent additional quiz questions or facts.

Return ONLY valid JSON.

Use exactly this structure:

{
  "summary": "short performance summary",
  "strengths": [
    "strength 1"
  ],
  "areasToImprove": [
    "area 1"
  ],
  "learningAdvice": [
    "advice 1"
  ],
  "nextAction": "one immediate learning action"
}

Return JSON only.
`;


    /*
    |--------------------------------------------------------------------------
    | Ask ForenX AI
    |--------------------------------------------------------------------------
    */

    const aiResult = await askOllama(prompt, null, {
        lightweight: true,
        numPredict: 300,
        temperature: 0.1,
        timeout: 120000,
        format: "json",
    });


    /*
    |--------------------------------------------------------------------------
    | Handle AI failure
    |--------------------------------------------------------------------------
    */

    if (!aiResult.success) {
        return res.status(503).json({
            success: false,
            message: aiResult.message,
        });
    }


    /*
    |--------------------------------------------------------------------------
    | Parse AI feedback
    |--------------------------------------------------------------------------
    */

    let feedback;

    try {
        feedback = JSON.parse(aiResult.response);
    }
    catch (error) {
        return res.status(502).json({
            success: false,
            message: "AI returned invalid quiz feedback JSON.",
            rawResponse: aiResult.response,
        });
    }


    /*
    |--------------------------------------------------------------------------
    | Validate AI feedback
    |--------------------------------------------------------------------------
    */

    if (
        !feedback ||
        typeof feedback.summary !== "string" ||
        !Array.isArray(feedback.strengths) ||
        !Array.isArray(feedback.areasToImprove) ||
        !Array.isArray(feedback.learningAdvice) ||
        typeof feedback.nextAction !== "string"
    ) {
        return res.status(502).json({
            success: false,
            message: "AI returned an invalid quiz feedback format.",
            rawResponse: aiResult.response,
        });
    }


    /*
    |--------------------------------------------------------------------------
    | Return evaluation
    |--------------------------------------------------------------------------
    */

    res.json({
        success: true,

        evaluation: {
            tool: toolData.name,
            difficulty,
            score,
            totalQuestions,
            percentage,
            performance,
            results,
            feedback,
        },

        model: aiResult.model,
        createdAt: aiResult.createdAt,
    });
});

/*
|--------------------------------------------------------------------------
| AI Practice Lab Evaluation
|--------------------------------------------------------------------------
| Phase 2 - Feature 17
|--------------------------------------------------------------------------
*/

const evaluateAILab = asyncHandler(async (req, res) => {

    const {
        labId,
        objectiveResults,
    } = req.body || {};


    /*
    |--------------------------------------------------------------------------
    | Validate input
    |--------------------------------------------------------------------------
    */

    if (!labId) {
        return res.status(400).json({
            success: false,
            message: "Lab ID is required.",
        });
    }

    if (
        !Array.isArray(objectiveResults) ||
        objectiveResults.length === 0
    ) {
        return res.status(400).json({
            success: false,
            message: "Objective results are required.",
        });
    }


    /*
    |--------------------------------------------------------------------------
    | Get lab
    |--------------------------------------------------------------------------
    */

    const lab = await Lab.findOne({
        _id: labId,
        isActive: true,
    })
        .select(
            "title description tool category difficulty target missionBrief requiredCommand objectives hints xpReward"
        )
        .lean();


    if (!lab) {
        return res.status(404).json({
            success: false,
            message: "Lab not found.",
        });
    }


    /*
    |--------------------------------------------------------------------------
    | Get student's lab progress
    |--------------------------------------------------------------------------
    */

    const progress = await LabProgress.findOne({
        user: req.user._id,
        lab: lab._id,
    }).lean();


    /*
    |--------------------------------------------------------------------------
    | Prepare lab information
    |--------------------------------------------------------------------------
    */

    const labInformation = {
        title: lab.title,
        description: lab.description || "",
        tool: lab.tool,
        category: lab.category || "OSINT",
        difficulty: lab.difficulty,
        target: lab.target,
        missionBrief: lab.missionBrief,
        requiredCommand: lab.requiredCommand,
        objectives: lab.objectives.map(
            (objective, index) => ({
                objectiveIndex: index,
                question: objective.question,
                type: objective.type,
                expectedField: objective.expectedField,
            })
        ),
    };


    /*
    |--------------------------------------------------------------------------
    | Prepare student progress
    |--------------------------------------------------------------------------
    */

    const studentProgress = {
        completed: progress?.completed || false,

        objectives:
            progress?.objectives || [],

        xpAwarded:
            progress?.xpAwarded || false,

        startedAt:
            progress?.startedAt || null,

        completedAt:
            progress?.completedAt || null,
    };


    /*
    |--------------------------------------------------------------------------
    | Calculate basic performance
    |--------------------------------------------------------------------------
    */

    const totalObjectives =
        objectiveResults.length;

    const completedObjectives =
        objectiveResults.filter(
            item => item && item.correct === true
        ).length;

    const percentage =
        Math.round(
            (completedObjectives / totalObjectives) * 100
        );


    let performance = "Needs Improvement";

    if (percentage >= 90) {
        performance = "Excellent";
    }
    else if (percentage >= 75) {
        performance = "Good";
    }
    else if (percentage >= 50) {
        performance = "Needs Practice";
    }


    /*
    |--------------------------------------------------------------------------
    | AI Prompt
    |--------------------------------------------------------------------------
    */

    const prompt = `
You are ForenX AI, an OSINT practice-lab mentor.

Evaluate the student's performance in the following OSINT practice lab.

LAB INFORMATION:
${JSON.stringify(labInformation, null, 2)}

STUDENT LAB PROGRESS:
${JSON.stringify(studentProgress, null, 2)}

OBJECTIVE RESULTS:
${JSON.stringify(objectiveResults, null, 2)}

PERFORMANCE:
Completed objectives: ${completedObjectives}/${totalObjectives}
Percentage: ${percentage}%
Performance: ${performance}

TASK:

Provide personalized educational feedback about the student's lab attempt.

You must:
1. Explain the student's overall performance.
2. Identify objectives completed correctly.
3. Identify objectives that need improvement.
4. Explain mistakes in beginner-friendly language.
5. Give practical OSINT learning advice.
6. Recommend what the student should investigate or practice next.
7. Consider the lab difficulty.
8. Base your feedback ONLY on the supplied lab information and results.
9. Do not invent command output.
10. Do not claim that a command was executed unless the supplied results explicitly show it.
11. Do not change the correctness of the supplied objective results.
12. Do not reveal hidden information that is not present in the supplied data.

Return ONLY valid JSON.

Use exactly this structure:

{
  "summary": "short overall performance summary",
  "strengths": [
    "strength 1"
  ],
  "areasToImprove": [
    "area 1"
  ],
  "objectiveFeedback": [
    {
      "objectiveIndex": 0,
      "status": "Correct/Needs Improvement",
      "feedback": "short explanation"
    }
  ],
  "learningAdvice": [
    "advice 1"
  ],
  "nextAction": "one immediate action"
}

IMPORTANT:
- objectiveIndex must match the supplied objective index.
- Do not invent objective indexes.
- If there are no weaknesses, return an empty array for areasToImprove.
- Return JSON only.
`;


    /*
    |--------------------------------------------------------------------------
    | Ask ForenX AI
    |--------------------------------------------------------------------------
    */

    const aiResult = await askOllama(
        prompt,
        null,
        {
            lightweight: true,
            numPredict: 500,
            temperature: 0.1,
            timeout: 120000,
            format: "json",
        }
    );


    /*
    |--------------------------------------------------------------------------
    | Handle AI failure
    |--------------------------------------------------------------------------
    */

    if (!aiResult.success) {
        return res.status(503).json({
            success: false,
            message: aiResult.message,
        });
    }


    /*
    |--------------------------------------------------------------------------
    | Parse AI response
    |--------------------------------------------------------------------------
    */

    let feedback;

    try {
        feedback = JSON.parse(
            aiResult.response
        );
    }
    catch (error) {
        return res.status(502).json({
            success: false,
            message:
                "AI returned invalid practice-lab feedback JSON.",
            rawResponse:
                aiResult.response,
        });
    }


    /*
    |--------------------------------------------------------------------------
    | Validate AI feedback
    |--------------------------------------------------------------------------
    */

    if (
        !feedback ||
        typeof feedback.summary !== "string" ||
        !Array.isArray(feedback.strengths) ||
        !Array.isArray(feedback.areasToImprove) ||
        !Array.isArray(feedback.objectiveFeedback) ||
        !Array.isArray(feedback.learningAdvice) ||
        typeof feedback.nextAction !== "string"
    ) {
        return res.status(502).json({
            success: false,
            message:
                "AI returned an invalid practice-lab feedback format.",
            rawResponse:
                aiResult.response,
        });
    }


    /*
    |--------------------------------------------------------------------------
    | Validate objective indexes
    |--------------------------------------------------------------------------
    */

    const validObjectiveIndexes =
        new Set(
            objectiveResults.map(
                item => Number(item.objectiveIndex)
            )
        );


    const invalidFeedback =
        feedback.objectiveFeedback.filter(
            item =>
                !item ||
                !validObjectiveIndexes.has(
                    Number(item.objectiveIndex)
                )
        );


    if (invalidFeedback.length > 0) {
        return res.status(502).json({
            success: false,
            message:
                "AI returned feedback for an invalid objective.",
            invalidFeedback,
        });
    }


    /*
    |--------------------------------------------------------------------------
    | Return AI evaluation
    |--------------------------------------------------------------------------
    */

    res.json({
        success: true,

        evaluation: {
            lab: {
                id: lab._id,
                title: lab.title,
                tool: lab.tool,
                difficulty: lab.difficulty,
            },

            performance: {
                completedObjectives,
                totalObjectives,
                percentage,
                level: performance,
            },

            feedback,
        },

        model: aiResult.model,

        createdAt: aiResult.createdAt,
    });
});

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
    generateAIQuiz,
    evaluateAIQuiz,
    evaluateAILab,
};