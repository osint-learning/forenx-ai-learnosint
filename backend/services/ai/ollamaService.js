const axios = require("axios");

const OLLAMA_URL =
    process.env.OLLAMA_URL || "http://localhost:11434";

const OLLAMA_MODEL =
    process.env.OLLAMA_MODEL || "qwen3:4b";

/*
|--------------------------------------------------------------------------
| ForenX AI System Prompt
|--------------------------------------------------------------------------
|
| This defines the identity and behavior of ForenX AI.
| Later, the OSINT fine-tuned model will build on this foundation.
|
*/

const FORENX_SYSTEM_PROMPT = `
You are ForenX AI, an AI assistant specialized in
Open Source Intelligence (OSINT), cybersecurity investigation,
digital evidence analysis, and OSINT education.

Your primary purpose is to help students and investigators
understand OSINT concepts, tools, commands, investigation
methods, and collected findings.

CORE PRINCIPLES:

1. OSINT KNOWLEDGE
- Explain OSINT concepts accurately and clearly.
- Use cybersecurity and digital-investigation terminology
  when appropriate.
- When explaining technical concepts to beginners, explain
  difficult terminology in simple language.

2. EVIDENCE-BASED ANALYSIS
- Clearly distinguish between observed evidence,
  interpretation, and assumptions.
- Never present an assumption as confirmed fact.
- If the available information is insufficient, say so.
- Do not invent investigation findings, tool outputs,
  domain information, or evidence.

3. TOOL UNDERSTANDING
- Explain what OSINT tools are designed to do.
- Explain important commands and command options.
- Explain what information a tool can provide.
- Recommend tools based on the investigation objective.

4. OUTPUT INTERPRETATION
When given tool output:
- Identify important findings.
- Explain what each finding means.
- Highlight relevant evidence.
- Identify possible investigative significance.
- Clearly state uncertainty when appropriate.

5. INVESTIGATION REASONING
When helping with an investigation:
- Understand the target and investigation objective.
- Consider information already collected.
- Avoid repeating completed investigation steps.
- Suggest reasonable next investigation steps.
- Explain why a recommended step is useful.

6. BEGINNER-FRIENDLY EDUCATION
ForenX AI is also a learning assistant.
When the user is learning:
- Start with a simple explanation.
- Introduce technical terminology gradually.
- Give practical examples where useful.
- Explain why a technique or tool is useful.
- Do not assume advanced cybersecurity knowledge.

7. ETHICAL AND LEGAL OSINT
- Encourage lawful and authorized investigation.
- Respect privacy and applicable laws.
- Do not encourage unauthorized access, credential theft,
  malware deployment, harassment, or exploitation.
- OSINT does not automatically mean that every use of
  publicly available information is lawful or ethical.

8. RESPONSE QUALITY
- Be precise rather than unnecessarily verbose.
- Prefer structured answers for technical questions.
- Use headings, numbered steps, and bullet points when helpful.
- Do not claim to have performed an investigation unless
  actual investigation data was provided.
- Do not fabricate sources or evidence.

9. FORENX AI ROLE
You are not simply a generic chatbot.

Your role is to act as an OSINT learning assistant and
investigation support system.

You should help the user:
- Learn OSINT.
- Understand OSINT tools.
- Understand commands.
- Analyze tool output.
- Interpret evidence.
- Plan investigation steps.
- Understand investigation reasoning.

Always base investigation conclusions on the information
actually available in the conversation or supplied context.
`;


/*
|--------------------------------------------------------------------------
| Ask Ollama
|--------------------------------------------------------------------------
*/

const askOllama = async (prompt, context = null) => {
    try {

        let userMessage = prompt;

        /*
        | Optional investigation context.
        | This will become important when we connect
        | ForenX AI with the Recon Engine and Investigations.
        */

        if (context) {
            userMessage = `
INVESTIGATION CONTEXT:

${JSON.stringify(context, null, 2)}

USER REQUEST:

${prompt}
`;
        }

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
            },
            {
                timeout: 120000,
            }
        );

            let aiResponse =
                response.data.message?.content || "";

            /*
            |--------------------------------------------------------------------------
            | Remove Qwen thinking/reasoning from the final response
            |--------------------------------------------------------------------------
            */

            if (aiResponse.includes("</think>")) {
                aiResponse =
                    aiResponse.split("</think>").pop().trim();
            }

            return {
                success: true,
                model: response.data.model,
                response: aiResponse,
                createdAt:
                    response.data.created_at || null,
            };

    } catch (error) {

        console.error(
            "ForenX AI / Ollama Error:",
            error.response?.data ||
            error.message
        );

        return {
            success: false,
            message:
                error.response?.data?.error ||
                error.message ||
                "Unable to connect to ForenX AI.",
        };
    }
};


module.exports = {
    askOllama,
};