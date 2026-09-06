const axios = require("axios");


/*
|--------------------------------------------------------------------------
| Ollama Configuration
|--------------------------------------------------------------------------
*/

const OLLAMA_URL =
    process.env.OLLAMA_URL || "http://localhost:11434";

const OLLAMA_MODEL =
    process.env.OLLAMA_MODEL || "qwen3:4b";


/*
|--------------------------------------------------------------------------
| ForenX AI System Prompt
|--------------------------------------------------------------------------
|
| Used by normal Phase 1 AI requests.
|
*/

const FORENX_SYSTEM_PROMPT = `
You are ForenX AI, an AI assistant specialized in Open Source Intelligence
(OSINT), cybersecurity investigation, digital forensics, and OSINT education.

Your responsibilities:

1. OSINT Knowledge
Provide accurate explanations of OSINT concepts and investigation methods.

2. Evidence-Based Analysis
Base conclusions only on the information provided.

3. Tool Understanding
Explain OSINT tools, their purposes, commands, and appropriate use.

4. Output Interpretation
Help users understand technical tool output.

5. Investigation Reasoning
Guide users through logical investigation steps.

6. Beginner-Friendly Education
Explain technical concepts clearly for cybersecurity students.

7. Ethical and Legal OSINT
Encourage authorized, lawful, and responsible investigations.

8. Response Quality
Avoid fabricated information, tools, commands, or investigation results.

9. ForenX AI Role
Act as an investigation learning assistant and mentor.
`;


/*
|--------------------------------------------------------------------------
| Lightweight Recommendation Prompt
|--------------------------------------------------------------------------
|
| Used specifically by Phase 2 Feature 1.
|
*/

const RECOMMENDATION_SYSTEM_PROMPT = `
You are ForenX AI.

You recommend OSINT tools for cybersecurity students.

Rules:
- Use ONLY the tools provided by the application.
- Never invent a tool.
- Choose the most relevant tools.
- Give a short reason for each.
- Prefer beginner-friendly tools.
- Do not claim that tools were executed.
- Do not fabricate results.
`;


/*
|--------------------------------------------------------------------------
| Ask Ollama
|--------------------------------------------------------------------------
*/

const askOllama = async (
    prompt,
    context = null,
    options = {}
) => {
    try {
        const userMessage = context
            ? `
Investigation Context:
${JSON.stringify(context, null, 2)}

User Request:
${prompt}
`
            : prompt;

        const response = await axios.post(
            `${OLLAMA_URL}/api/chat`,
            {
                model: OLLAMA_MODEL,

                messages: [
                    {
                        role: "system",
                        content: FORENX_SYSTEM_PROMPT,
                    },
                    {
                        role: "user",
                        content: userMessage,
                    },
                ],

                think: false,
                stream: false,

                format: options.format || undefined,

                options: {
                    num_predict: options.numPredict || 200,
                    temperature: options.temperature ?? 0.2,
                },
            },
            {
                timeout: options.timeout || 120000,
            }
        );

        let content =
            response.data?.message?.content ||
            "";

        /*
        |--------------------------------------------------------------------------
        | Remove Qwen thinking blocks if present
        |--------------------------------------------------------------------------
        */

        content = content
            .replace(/<think>[\s\S]*?<\/think>/gi, "")
            .replace(/<think>[\s\S]*/gi, "")
            .trim();

        return {
            success: true,
            model: response.data?.model || OLLAMA_MODEL,
            response: content,
            createdAt:
                response.data?.created_at ||
                new Date().toISOString(),
        };

    } catch (error) {

        return {
            success: false,
            message:
                error.response?.data?.error ||
                error.message ||
                "Unable to connect to Ollama.",
        };
    }
};


module.exports = {
    askOllama
};