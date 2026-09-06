const asyncHandler = require("express-async-handler");
const { askOllama } = require("../services/ai/ollamaService");

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

module.exports = {
    testAI,
};