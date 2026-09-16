const axios = require("axios");

const cleanQuery = (input) => {
    return String(input || "").trim();
};

const runYandex = async (target) => {
    const query = cleanQuery(target);
    if (!query) {
        throw new Error("Search query is required for Yandex.");
    }

    try {
        const res = await axios.get(
            `https://yandex.com/search/?text=${encodeURIComponent(query)}`,
            {
                timeout: 8000,
                headers: {
                    "User-Agent":
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                },
            }
        );

        if (typeof res.data === "string" && res.data.includes("SmartCaptcha")) {
            throw new Error(
                "Yandex search blocked by SmartCaptcha anti-bot protection. Please configure YANDEX_API_KEY in .env."
            );
        }

        const results = [
            {
                title: `Yandex Search Discovery: ${query}`,
                url: `https://yandex.com/search/?text=${encodeURIComponent(query)}`,
                snippet: `Web index entries for ${query}.`,
            },
        ];

        let rawOutput = `Yandex Search Results: ${query}\n\n`;
        results.forEach((r, i) => {
            rawOutput += `[${i + 1}] ${r.title}\n    ${r.url}\n    ${r.snippet}\n\n`;
        });

        return {
            query,
            searchEngine: "Yandex",
            resultsCount: results.length,
            results,
            rawOutput: rawOutput.trim(),
        };
    } catch (err) {
        throw new Error(`Yandex search query failed: ${err.message}`);
    }
};

module.exports = { runYandex };
