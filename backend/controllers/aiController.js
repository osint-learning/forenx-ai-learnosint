const asyncHandler = require("express-async-handler");

const { askOllama } = require("../services/ai/ollamaService");
const Tool = require("../models/Tool");
const Lab = require("../models/Lab");
const LabProgress = require("../models/LabProgress");
const Quiz = require("../models/Quiz");

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

Your task is to recommend the most useful OSINT tools for the student's investigation objective.

INVESTIGATION OBJECTIVE:
${cleanObjective}

DETECTED INVESTIGATION TYPE:
${detectedIntent}

AVAILABLE FORENX TOOLS:
${JSON.stringify(toolCatalogue, null, 2)}

REQUIREMENTS:

1. Recommend only tools from AVAILABLE FORENX TOOLS.
2. Never invent a tool.
3. Use the exact tool names provided.
4. Recommend only tools relevant to the investigation objective.
5. Explain briefly why each recommended tool is useful.
6. Prefer beginner-friendly tools when appropriate.
7. Provide a logical investigation order.
8. Do not claim that any tool was executed.
9. Do not fabricate investigation results.
10. Do not include internal reasoning or analysis.
11. Do not write an introduction.
12. Keep explanations concise.
13. Return ONLY valid JSON.

IMPORTANT:
- Every tool name MUST exactly match a tool in AVAILABLE FORENX TOOLS.
- Never mention a tool that is not in the available list.
- Do not output reasoning such as "we are given", "I think", or "the model should".
- Do not output Markdown.
- Do not output text outside the JSON object.

Return exactly this JSON structure:

{
  "recommendations": [
    {
      "tool": "exact tool name",
      "reason": "short reason why this tool is useful",
      "difficulty": "Beginner/Intermediate/Advanced"
    }
  ],
  "investigationOrder": [
    "first investigation step",
    "second investigation step",
    "third investigation step"
  ]
}
`;


    /*
    |--------------------------------------------------------------------------
    | Grounded Fallback Builder
    |--------------------------------------------------------------------------
    */

    const buildFallbackRecommendations = () => {
        const defaultReasons = {
            subdomain: "High-value tool for discovering and mapping active subdomains and DNS records.",
            email: "Effective for identifying associated email addresses and organizational accounts.",
            username: "Specialized in correlating usernames across digital platforms and profiles.",
            phone: "Useful for parsing phone number intelligence and carrier attribution.",
            metadata: "Designed for extracting hidden EXIF data, timestamps, and document metadata.",
            whois: "Primary tool for querying domain registrar, ownership, and nameserver records.",
            technology: "Ideal for fingerprinting server frameworks, CMS, and web technologies.",
            general: "Solid general-purpose OSINT tool suited for exploring target intelligence."
        };

        const intentSteps = {
            subdomain: [
                "Map root domain DNS records and authoritative nameservers.",
                "Execute passive and active subdomain enumeration across target zones.",
                "Correlate discovered subdomains to identify exposed service endpoints."
            ],
            email: [
                "Search domain-associated email addresses using search engine indexers and breach archives.",
                "Verify email syntax, MX record deliverability, and account existence.",
                "Cross-reference valid emails to uncover associated user personas."
            ],
            username: [
                "Perform cross-platform username enumeration across major networks and forums.",
                "Inspect matched profiles for profile pictures, bios, and unique identifiers.",
                "Correlate account creation dates and activity timelines."
            ],
            phone: [
                "Format number into international E.164 standard.",
                "Check carrier, country, and line type (mobile/VoIP/landline).",
                "Search social footprints and public caller directories for owner intelligence."
            ],
            metadata: [
                "Inspect file headers and EXIF data for device details and timestamps.",
                "Extract GPS coordinates if embedded in imagery.",
                "Correlate document author tags and software revision history."
            ],
            whois: [
                "Query authoritative WHOIS database for registrar and registration dates.",
                "Inspect privacy protection layers and historical DNS records.",
                "Identify associated registrant emails or organizational contacts."
            ],
            technology: [
                "Analyze HTTP response headers and SSL certificates for server signatures.",
                "Fingerprint client-side JavaScript libraries and CMS frameworks.",
                "Map exposed API endpoints and third-party integrations."
            ],
            general: [
                "Define target scope and gather preliminary passive intelligence.",
                "Run specialized OSINT tools against identified target parameters.",
                "Correlate findings and document evidence systematically."
            ]
        };

        const fallbackItems = selectedTools.map((tool) => ({
            tool: tool.name,
            name: tool.name,
            category: tool.category || "OSINT",
            reason: tool.shortDescription || defaultReasons[detectedIntent] || defaultReasons.general,
            difficulty: tool.difficulty || "Beginner",
            command: tool.syntax || (Array.isArray(tool.commands) && tool.commands[0]?.command) || undefined,
        }));

        const fallbackSteps = intentSteps[detectedIntent] || intentSteps.general;

        return {
            recommendations: fallbackItems,
            investigationOrder: fallbackSteps,
        };
    };


    /*
    |--------------------------------------------------------------------------
    | Ask ForenX AI (with Grounded Catalogue Fallback)
    |--------------------------------------------------------------------------
    */

    let result;
    try {
        result = await askOllama(prompt, null, {
            lightweight: true,
            numPredict: 300,
            temperature: 0.1,
            timeout: 120000,
            format: "json"
        });
    } catch (err) {
        result = {
            success: false,
            message: err.message || "Unable to connect to Ollama.",
        };
    }

    let recommendation = null;
    let isFallback = false;

    if (result && result.success && result.response) {
        try {
            const parsed = JSON.parse(result.response);
            if (
                parsed &&
                Array.isArray(parsed.recommendations) &&
                parsed.recommendations.length > 0
            ) {
                const mappedRecommendations = parsed.recommendations
                    .map((item) => {
                        const toolName = item.tool || item.name || "";
                        const matchedDbTool = tools.find(
                            (t) => t.name.toLowerCase() === toolName.toLowerCase()
                        );
                        return {
                            tool: toolName,
                            name: toolName,
                            category: item.category || matchedDbTool?.category || "OSINT",
                            reason: item.reason || item.description || matchedDbTool?.shortDescription || "",
                            difficulty: item.difficulty || matchedDbTool?.difficulty || "Beginner",
                            command: matchedDbTool?.syntax || (Array.isArray(matchedDbTool?.commands) && matchedDbTool.commands[0]?.command) || undefined,
                        };
                    })
                    .filter((item) => item.name && item.reason);

                if (mappedRecommendations.length > 0) {
                    recommendation = {
                        recommendations: mappedRecommendations,
                        investigationOrder: Array.isArray(parsed.investigationOrder) && parsed.investigationOrder.length > 0
                            ? parsed.investigationOrder
                            : buildFallbackRecommendations().investigationOrder,
                    };
                }
            }
        } catch (parseError) {
            console.warn("[AI Tool Recommendation] Ollama JSON parse failed:", parseError.message);
        }
    }

    if (!recommendation) {
        isFallback = true;
        console.warn(
            "[AI Tool Recommendation] Ollama unavailable:",
            result?.message || "Using grounded catalogue fallback."
        );
        recommendation = buildFallbackRecommendations();
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
        recommendations: recommendation.recommendations,
        investigationOrder: recommendation.investigationOrder,
        model: isFallback ? "grounded-catalogue-fallback" : (result?.model || "qwen3:4b"),
        availableToolCount: tools.length,
        analysedToolCount: selectedTools.length,
        analysedTools: selectedTools.map((tool) => tool.name),
        aiGenerated: !isFallback,
        fallback: isFallback,
        message: isFallback
            ? "AI service temporarily unavailable. Recommendations generated from the OSINT tool catalogue."
            : undefined,
        createdAt: result?.createdAt || new Date().toISOString(),
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
            difficulty: tool.difficulty || "Beginner",
            purpose: (tool.shortDescription || tool.purpose || "").slice(0, 100),
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
| AI Dynamic Quiz Generation
|--------------------------------------------------------------------------
| Phase 2 - Feature 15 (Optimized for Local qwen3:4b)
|--------------------------------------------------------------------------
*/

const generateAIQuiz = asyncHandler(async (req, res) => {
    const {
        tool,
        difficulty = "Beginner",
        count = 5,
    } = req.body || {};

    if (!tool || typeof tool !== "string") {
        return res.status(400).json({
            success: false,
            message: "Tool name is required.",
        });
    }

    const toolData = await Tool.findOne({
        name: {
            $regex: `^${tool.trim()}$`,
            $options: "i",
        },
    })
        .select("name category shortDescription difficulty syntax commands")
        .lean();

    if (!toolData) {
        return res.status(404).json({
            success: false,
            message: `Tool "${tool}" was not found in ForenX.`,
        });
    }

    const buildFallbackQuiz = async () => {
        let dbQuestions = [];
        try {
            dbQuestions = await Quiz.find({ tool: toolData._id }).lean();
        } catch (dbErr) {
            console.warn("[AI Quiz Generation] DB Quiz lookup error:", dbErr.message);
        }

        if (dbQuestions && dbQuestions.length > 0) {
            const shuffled = [...dbQuestions]
                .sort(() => Math.random() - 0.5)
                .slice(0, count)
                .map((q) => {
                    const rawIdx = q.correctAnswerIndex;
                    const cleanedIdx = typeof rawIdx === "number" ? rawIdx : parseInt(String(rawIdx).replace(/\D/g, ""), 10);
                    return {
                        question: q.question,
                        options: q.options || [],
                        correctAnswerIndex: Number.isInteger(cleanedIdx) && cleanedIdx >= 0 && cleanedIdx < 4 ? cleanedIdx : 0,
                        explanation: q.explanation || `Standard knowledge question for ${toolData.name}.`,
                    };
                });
            if (shuffled.length > 0) return shuffled;
        }

        return [
            {
                question: `What is the primary function of ${toolData.name}?`,
                options: [
                    toolData.shortDescription || "Conduct specialized OSINT investigation",
                    "Perform local OS kernel debugging",
                    "Conduct automated hardware penetration testing",
                    "Manage corporate firewall routing tables"
                ],
                correctAnswerIndex: 0,
                explanation: `${toolData.name} is designed for ${toolData.shortDescription || "OSINT investigations"}.`
            },
            {
                question: `Which investigation category does ${toolData.name} belong to?`,
                options: [
                    toolData.category || "OSINT",
                    "Physical Access Exploitation",
                    "Binary Reverse Engineering",
                    "Radio Frequency Interception"
                ],
                correctAnswerIndex: 0,
                explanation: `${toolData.name} is categorized under ${toolData.category || "OSINT"}.`
            },
            {
                question: `What is the recommended difficulty level for using ${toolData.name}?`,
                options: [
                    toolData.difficulty || "Beginner",
                    "Expert Forensics Only",
                    "Restricted Military",
                    "Enterprise Kernel"
                ],
                correctAnswerIndex: 0,
                explanation: `${toolData.name} is rated as ${toolData.difficulty || "Beginner"} level in ForenX.`
            },
            {
                question: `How should intelligence collected from ${toolData.name} be handled?`,
                options: [
                    "Correlated with other OSINT data sources for verification",
                    "Immediately discarded without logging",
                    "Assumed always 100% complete and definitive",
                    "Published publicly without authorization"
                ],
                correctAnswerIndex: 0,
                explanation: "OSINT findings should always be verified and correlated across multiple sources."
            },
            {
                question: `What is the most effective way to practice using ${toolData.name}?`,
                options: [
                    "Practice structured objectives inside ForenX interactive labs",
                    "Execute unconstrained scans against unauthorized third parties",
                    "Only read documentation without running commands",
                    "Rely solely on automated third-party summaries"
                ],
                correctAnswerIndex: 0,
                explanation: "Hands-on guided practice in simulated labs builds reliable investigative skills."
            }
        ];
    };

    const keyCommands = (toolData.commands || []).slice(0, 2).map((c) => c.title || c.command || "").filter(Boolean);

    const prompt = `You are ForenX AI. Generate a ${difficulty}-level 5-question multiple-choice quiz for the OSINT tool: ${toolData.name} (${toolData.category}).
Description: ${toolData.shortDescription || "OSINT investigation tool"}.
Key Commands: ${keyCommands.join(", ") || "Standard tool commands"}.

RULES:
- Return valid JSON only.
- Exactly ${count} questions.
- Short question text (<15 words).
- Exactly 4 short options per question.
- correctAnswerIndex (0, 1, 2, or 3).
- 1 concise sentence explanation.

JSON format:
{
  "questions": [
    {
      "question": "question text",
      "options": ["A", "B", "C", "D"],
      "correctAnswerIndex": 0,
      "explanation": "short explanation"
    }
  ]
}`;

    let result;
    try {
        result = await askOllama(prompt, null, {
            lightweight: true,
            numPredict: 550,
            temperature: 0.1,
            timeout: 120000,
            format: "json",
        });
    } catch (err) {
        result = {
            success: false,
            message: err.message || "Unable to contact Ollama",
        };
    }

    let validQuestions = null;
    let isFallback = false;

    if (result && result.success && result.response) {
        try {
            const parsed = JSON.parse(result.response);
            if (parsed && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
                const cleaned = parsed.questions
                    .map((q) => {
                        const rawIdx = q.correctAnswerIndex;
                        const cleanedIdx = typeof rawIdx === "number"
                            ? rawIdx
                            : parseInt(String(rawIdx).replace(/\D/g, ""), 10);

                        return {
                            question: typeof q.question === "string" ? q.question.trim() : "",
                            options: Array.isArray(q.options) && q.options.length === 4 ? q.options.map((o) => String(o).trim()) : null,
                            correctAnswerIndex: Number.isInteger(cleanedIdx) && cleanedIdx >= 0 && cleanedIdx < 4 ? cleanedIdx : 0,
                            explanation: typeof q.explanation === "string" ? q.explanation.trim() : `Key concept for ${toolData.name}.`,
                        };
                    })
                    .filter((q) => q.question && q.options && q.options.length === 4);

                if (cleaned.length >= 3) {
                    validQuestions = cleaned.slice(0, count);
                }
            }
        } catch (parseErr) {
            console.warn("[AI Quiz Generation] JSON parse error:", parseErr.message);
        }
    }

    if (!validQuestions || validQuestions.length === 0) {
        isFallback = true;
        console.warn("[AI Quiz Generation] Ollama failed or unparseable. Using grounded quiz fallback:", result?.message);
        validQuestions = await buildFallbackQuiz();
    }

    res.json({
        success: true,
        quiz: {
            tool: toolData.name,
            toolId: toolData._id,
            difficulty,
            questions: validQuestions,
        },
        aiGenerated: !isFallback,
        fallback: isFallback,
        model: isFallback ? "grounded-standard-quiz-fallback" : (result?.model || "qwen3:4b"),
        createdAt: result?.createdAt || new Date().toISOString(),
    });
});


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

        let selectedAnswerIndex =
            typeof selectedAnswer === "number"
                ? selectedAnswer
                : !isNaN(Number(selectedAnswer))
                ? Number(selectedAnswer)
                : -1;

        if (selectedAnswerIndex === -1 && typeof selectedAnswer === "string" && Array.isArray(question.options)) {
            selectedAnswerIndex = question.options.indexOf(selectedAnswer);
        }

        const isCorrect =
            Number.isInteger(selectedAnswerIndex) &&
            selectedAnswerIndex >= 0 &&
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
9. If the student has no weaknesses, return an empty array for areasToImprove.
10. Never put an empty string inside areasToImprove.

Return ONLY valid JSON.

Use exactly this structure:

{
  "summary": "short performance summary",
  "strengths": [
    "strength 1"
  ],
  "areasToImprove": [],
  "learningAdvice": [
    "advice 1"
  ],
  "nextAction": "one immediate learning action"
}

Return JSON only.
`;


    /*
    |--------------------------------------------------------------------------
    | Ask ForenX AI (with Grounded Evaluation Fallback)
    |--------------------------------------------------------------------------
    */

    let aiResult;
    try {
        aiResult = await askOllama(prompt, null, {
            lightweight: true,
            numPredict: 300,
            temperature: 0.1,
            timeout: 120000,
            format: "json",
        });
    } catch (err) {
        aiResult = {
            success: false,
            message: err.message || "Failed to contact Ollama",
        };
    }

    let feedback = null;
    let isFallback = false;

    if (aiResult && aiResult.success && aiResult.response) {
        try {
            const parsed = JSON.parse(aiResult.response);
            if (
                parsed &&
                typeof parsed.summary === "string" &&
                Array.isArray(parsed.strengths)
            ) {
                feedback = parsed;
            }
        } catch (parseErr) {
            console.warn("[AI Quiz Evaluation] JSON parse error:", parseErr.message);
        }
    }

    if (!feedback) {
        isFallback = true;
        console.warn("[AI Quiz Evaluation] Ollama unavailable, using deterministic feedback:", aiResult?.message);
        feedback = {
            summary: `You scored ${score} out of ${totalQuestions} (${percentage}%). ${percentage >= 70 ? "Solid knowledge demonstrated for " + toolData.name + "." : "Review the key capabilities and syntax for " + toolData.name + "."}`,
            strengths: results.filter(r => r.isCorrect).map(r => `Correctly answered: "${r.question}"`),
            areasToImprove: results.filter(r => !r.isCorrect).map(r => `Review concept: "${r.question}"`),
            learningAdvice: [
                `Practice with ${toolData.name} in the ForenX practice labs.`,
                `Review general syntax and common commands for ${toolData.name}.`
            ],
            nextAction: `Continue hands-on exploration of ${toolData.name}.`
        };
    }


    /*
    |--------------------------------------------------------------------------
    | Return evaluation
    |--------------------------------------------------------------------------
    */

    res.json({
        success: true,

        tool: toolData.name,
        score: {
            totalQuestions,
            correctAnswers: score,
            percentage,
            passed: percentage >= 70,
        },
        feedback: {
            overallPerformance: feedback.summary || performance,
            strengths: Array.isArray(feedback.strengths) ? feedback.strengths : [],
            misconceptions: Array.isArray(feedback.areasToImprove) ? feedback.areasToImprove : [],
            nextStudySteps: Array.isArray(feedback.learningAdvice)
                ? feedback.learningAdvice
                : (feedback.nextAction ? [feedback.nextAction] : []),
        },

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
        commandHistory = [],
    } = req.body || {};

    let { objectiveResults } = req.body || {};

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
    | Get student's lab progress & ensure objectiveResults
    |--------------------------------------------------------------------------
    */
    const progress = await LabProgress.findOne({
        user: req.user._id,
        lab: lab._id,
    }).lean();

    if (!Array.isArray(objectiveResults) || objectiveResults.length === 0) {
        objectiveResults = (lab.objectives || []).map((objective, index) => {
            const savedObj = progress?.objectives?.find(
                item => item.objectiveIndex === index
            );
            return {
                objectiveIndex: index,
                question: objective.question,
                type: objective.type,
                correct: savedObj?.completed === true,
                completed: savedObj?.completed === true,
                answer: savedObj?.answer || "",
            };
        });
    } else {
        // Normalize objective results
        objectiveResults = objectiveResults.map((item, index) => ({
            objectiveIndex: item.objectiveIndex !== undefined ? item.objectiveIndex : index,
            question: item.question || lab.objectives?.[index]?.question || ("Objective " + (index + 1)),
            type: item.type || lab.objectives?.[index]?.type || 'analysis',
            correct: item.correct === true || item.completed === true,
            completed: item.correct === true || item.completed === true,
            answer: item.answer || "",
        }));
    }

    // ======================================================
    // GET ACTUAL TOOL COMMANDS
    // ======================================================
    let toolData = null;
    try {
        toolData = await Tool.findOne({
            name: { $regex: new RegExp("^" + lab.tool + "$", "i") },
        })
            .select("name commands syntax")
            .lean();
    } catch (e) {
        // ignore regex error
    }

    const allowedCommands = [
        ...(toolData?.commands || []).map(item => item.command),
        ...(toolData?.syntax ? [toolData.syntax] : []),
    ].filter(Boolean);

    /*
    |--------------------------------------------------------------------------
    | Calculate performance metrics
    |--------------------------------------------------------------------------
    */
    const totalObjectives = (lab.objectives || []).length || objectiveResults.length || 1;
    const completedObjectives = objectiveResults.filter(
        item => item && (item.correct === true || item.completed === true)
    ).length;

    const percentage = Math.round((completedObjectives / totalObjectives) * 100);

    let performanceLevel = "Needs Improvement";
    if (percentage >= 90) {
        performanceLevel = "Excellent";
    } else if (percentage >= 75) {
        performanceLevel = "Good";
    } else if (percentage >= 50) {
        performanceLevel = "Needs Practice";
    }

    const labInfo = {
        id: lab._id.toString(),
        title: lab.title,
        tool: lab.tool,
        difficulty: lab.difficulty,
        target: lab.target,
        totalObjectives,
        completedObjectives,
        percentage,
    };

    /*
    |--------------------------------------------------------------------------
    | Deterministic Baseline Fallback Generator
    |--------------------------------------------------------------------------
    */
    const generateDeterministicEvaluation = () => {
        const completedList = objectiveResults.filter(o => o.correct || o.completed);
        const pendingList = objectiveResults.filter(o => !o.correct && !o.completed);

        const strengths = [
            "Targeted engagement with " + lab.tool + " against designated target " + lab.target + ".",
            ...(completedList.map(o => "Successfully completed objective: \"" + o.question + "\"")),
            ...(commandHistory.length > 0 ? ["Executed " + commandHistory.length + " investigation commands in the interactive terminal."] : [])
        ];

        const areasForImprovement = pendingList.map(
            o => "Objective remaining: \"" + o.question + "\". Analyze command output for required forensic artifacts."
        );

        const detectedMistakes = [];
        if (pendingList.length > 0 && commandHistory.length === 0) {
            detectedMistakes.push("No commands executed yet. Run the required tool command (" + (lab.requiredCommand || lab.tool) + ") in the terminal.");
        } else if (pendingList.length > 0) {
            detectedMistakes.push("Some mission questions remain unanswered or require closer analysis of the output.");
        }

        const nextSteps = [
            pendingList.length > 0
                ? "Review terminal output for " + lab.tool + " and submit answers for remaining questions."
                : "Proceed to the next advanced OSINT practice lab or explore related intelligence tools.",
            "Cross-correlate findings in the Investigation Workspace."
        ];

        const performanceSummary = percentage === 100
            ? "Outstanding execution! All " + totalObjectives + " objectives for " + lab.title + " were completed accurately using " + lab.tool + "."
            : percentage > 0
            ? "Good progress. You completed " + completedObjectives + " of " + totalObjectives + " objectives (" + percentage + "%). Focus on analyzing the remaining data points from " + lab.tool + "."
            : "Mission started. Execute the required command '" + (lab.requiredCommand || lab.tool) + "' and inspect the terminal output to answer objectives.";

        const objectiveFeedback = objectiveResults.map(o => ({
            objectiveIndex: o.objectiveIndex,
            completed: o.correct || o.completed,
            feedback: (o.correct || o.completed)
                ? "Objective verified and completed accurately."
                : "Objective pending. Inspect " + lab.tool + " output for '" + o.question + "'."
        }));

        return {
            performanceSummary,
            strengths: strengths.slice(0, 4),
            areasForImprovement: areasForImprovement.slice(0, 3),
            detectedMistakes: detectedMistakes.slice(0, 3),
            nextSteps: nextSteps.slice(0, 3),
            objectiveFeedback,
        };
    };

    /*
    |--------------------------------------------------------------------------
    | AI Prompt & Generation
    |--------------------------------------------------------------------------
    */
    const prompt = 
"You are ForenX AI, an expert OSINT mission evaluator.\n" +
"Evaluate the student's lab attempt for " + lab.title + " using " + lab.tool + " on target " + lab.target + ".\n\n" +
"LAB OBJECTIVES & RESULTS:\n" +
JSON.stringify(objectiveResults, null, 2) + "\n\n" +
"COMMANDS EXECUTED:\n" +
JSON.stringify(commandHistory, null, 2) + "\n\n" +
"PERFORMANCE:\n" +
"Completed: " + completedObjectives + "/" + totalObjectives + " (" + percentage + "%) - " + performanceLevel + "\n\n" +
"Return ONLY valid JSON matching this exact structure:\n" +
"{\n" +
"  \"performanceSummary\": \"2-3 concise sentences summarizing student performance on this lab.\",\n" +
"  \"strengths\": [\"specific strength 1\", \"specific strength 2\"],\n" +
"  \"areasForImprovement\": [\"specific area 1\"],\n" +
"  \"detectedMistakes\": [\"specific mistake if any\"],\n" +
"  \"nextSteps\": [\"recommended next action 1\", \"recommended next action 2\"],\n" +
"  \"objectiveFeedback\": [\n" +
"    {\n" +
"      \"objectiveIndex\": 0,\n" +
"      \"completed\": true,\n" +
"      \"feedback\": \"concise feedback\"\n" +
"    }\n" +
"  ]\n" +
"}";

    try {
        const aiResult = await askOllama(
            prompt,
            null,
            {
                lightweight: true,
                numPredict: 450,
                temperature: 0.1,
                timeout: 45000,
                format: "json",
            }
        );

        if (aiResult.success && aiResult.response) {
            try {
                const parsed = JSON.parse(aiResult.response);
                if (parsed && typeof parsed === 'object') {
                    const evaluation = {
                        performanceSummary: parsed.performanceSummary || parsed.summary || ("Lab evaluation completed with " + percentage + "% score."),
                        strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
                        areasForImprovement: Array.isArray(parsed.areasForImprovement) ? parsed.areasForImprovement : (Array.isArray(parsed.areasToImprove) ? parsed.areasToImprove : []),
                        detectedMistakes: Array.isArray(parsed.detectedMistakes) ? parsed.detectedMistakes : [],
                        nextSteps: Array.isArray(parsed.nextSteps) ? parsed.nextSteps : (Array.isArray(parsed.learningAdvice) ? parsed.learningAdvice : []),
                        objectiveFeedback: Array.isArray(parsed.objectiveFeedback) ? parsed.objectiveFeedback : [],
                    };

                    return res.json({
                        success: true,
                        lab: labInfo,
                        evaluation,
                        model: aiResult.model || "qwen3:4b",
                        createdAt: aiResult.createdAt || new Date().toISOString(),
                    });
                }
            } catch (pErr) {
                console.warn("AI returned malformed JSON, falling back to deterministic evaluation:", pErr.message);
            }
        }
    } catch (ollamaErr) {
        console.warn("Ollama AI evaluation call failed, using fallback:", ollamaErr.message);
    }

    // Fallback if AI unavailable or timeout
    const fallbackEval = generateDeterministicEvaluation();
    return res.json({
        success: true,
        lab: labInfo,
        evaluation: fallbackEval,
        model: "forenx-expert-rules",
        createdAt: new Date().toISOString(),
    });
});


const generateAIHint = asyncHandler(async (req, res) => {

    const {
        labId,
        objectiveIndex,
        attempt = 1,
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
        objectiveIndex === undefined ||
        objectiveIndex === null
    ) {
        return res.status(400).json({
            success: false,
            message: "Objective index is required.",
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
            "title description tool category difficulty target missionBrief requiredCommand objectives hints"
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
    | Get objective
    |--------------------------------------------------------------------------
    */

    const objective =
        lab.objectives[Number(objectiveIndex)];


    if (!objective) {
        return res.status(404).json({
            success: false,
            message: "Objective not found.",
        });
    }


    /*
    |--------------------------------------------------------------------------
    | Get student progress
    |--------------------------------------------------------------------------
    */

    const progress =
        await LabProgress.findOne({
            user: req.user._id,
            lab: lab._id,
        }).lean();


    /*
    |--------------------------------------------------------------------------
    | Find previous objective attempts
    |--------------------------------------------------------------------------
    */

    const objectiveProgress =
        progress?.objectives?.find(
            item =>
                item.objectiveIndex ===
                Number(objectiveIndex)
        );


    /*
    |--------------------------------------------------------------------------
    | Prepare contextual information
    |--------------------------------------------------------------------------
    */

    const context = {

        lab: {
            title: lab.title,
            description: lab.description || "",
            tool: lab.tool,
            category: lab.category || "OSINT",
            difficulty: lab.difficulty,
            target: lab.target,
            missionBrief: lab.missionBrief,
            requiredCommand: lab.requiredCommand,
        },

        objective: {
            index: Number(objectiveIndex),
            question: objective.question,
            type: objective.type,
            expectedField: objective.expectedField,
        },

        studentProgress: {
            labCompleted:
                progress?.completed || false,

            objectiveCompleted:
                objectiveProgress?.completed || false,

            previousAnswer:
                objectiveProgress?.answer || "",

            attempt:
                Number(attempt) || 1,
        },
    };


    /*
    |--------------------------------------------------------------------------
    | AI Prompt
    |--------------------------------------------------------------------------
    */

    const prompt = `
You are ForenX AI, an OSINT investigation mentor.

A student is working on an OSINT practice lab and needs a hint.

LAB CONTEXT:
${JSON.stringify(context.lab, null, 2)}

CURRENT OBJECTIVE:
${JSON.stringify(context.objective, null, 2)}

STUDENT PROGRESS:
${JSON.stringify(context.studentProgress, null, 2)}

Your task is to provide ONE useful investigation hint.

STRICT RULES:

1. Do NOT give the final answer.
2. Do NOT reveal the expected value.
3. Do NOT invent command options or commands.
4. Only refer to the command/tool information supplied in the lab context.
5. Guide the student toward where they should look.
6. Encourage the student to inspect the command output.
7. Keep the hint beginner-friendly.
8. Make the hint specific to the current objective.
9. If the objective asks for a field, tell the student what type of field to look for, but not its actual value.
10. Do not claim that a command was executed.
11. Return ONLY valid JSON.

Use exactly this structure:

{
  "hint": "one concise investigation hint",
  "guidance": "short explanation of what the student should look for",
  "nextStep": "one action the student should take"
}

IMPORTANT:
- Never provide the actual answer.
- Never invent a command or command option.
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
            numPredict: 220,
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

    let hint;

    try {
        hint = JSON.parse(
            aiResult.response
        );
    }
    catch (error) {
        return res.status(502).json({
            success: false,
            message:
                "AI returned invalid investigation hint JSON.",
            rawResponse:
                aiResult.response,
        });
    }


    /*
    |--------------------------------------------------------------------------
    | Validate hint
    |--------------------------------------------------------------------------
    */

    if (
        !hint ||
        typeof hint.hint !== "string" ||
        typeof hint.guidance !== "string" ||
        typeof hint.nextStep !== "string"
    ) {
        return res.status(502).json({
            success: false,
            message:
                "AI returned an invalid investigation hint format.",
            rawResponse:
                aiResult.response,
        });
    }


    /*
    |--------------------------------------------------------------------------
    | Return hint
    |--------------------------------------------------------------------------
    */

    res.json({
        success: true,

        hint: {
            labId: lab._id,
            labTitle: lab.title,
            tool: lab.tool,
            objectiveIndex: Number(objectiveIndex),
            attempt: Number(attempt) || 1,

            ...hint,
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
    generateAIHint,
};