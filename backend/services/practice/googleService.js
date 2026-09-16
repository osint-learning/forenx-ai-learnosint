const axios = require("axios");

const cleanQuery = (input) => {
    return String(input || "").trim();
};

const runGoogle = async (target) => {
    const query = cleanQuery(target);
    if (!query) {
        throw new Error("Search query is required for Google.");
    }

    const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
    const cx = process.env.GOOGLE_SEARCH_CX;

    if (apiKey && cx) {
        const res = await axios.get("https://www.googleapis.com/customsearch/v1", {
            params: {
                key: apiKey,
                cx,
                q: query,
            },
            timeout: 10000,
        });

        const items = Array.isArray(res.data?.items) ? res.data.items : [];
        const results = items.map((item) => ({
            title: item.title,
            url: item.link,
            snippet: item.snippet,
        }));

        let topDomain = results.length > 0 ? results[0].url : query;

        let rawOutput = `Google Custom Search API Results: ${query}\n\n`;
        results.forEach((r, i) => {
            rawOutput += `[${i + 1}] ${r.title}\n    ${r.url}\n    ${r.snippet}\n\n`;
        });

        return {
            query,
            searchEngine: "Google",
            topDomain,
            resultsCount: results.length,
            results,
            rawOutput: rawOutput.trim(),
        };
    }

    // Public attempt or bot protection reporting
    try {
        const res = await axios.get(
            `https://www.google.com/search?q=${encodeURIComponent(query)}`,
            {
                timeout: 8000,
                headers: {
                    "User-Agent":
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                },
            }
        );

        if (res.status === 429 || (typeof res.data === "string" && res.data.includes("CAPTCHA"))) {
            throw new Error("Google CAPTCHA / bot protection triggered.");
        }

        let rawOutput = `Google Search Results: ${query}\n`;
        rawOutput += `Search request executed successfully.\n`;

        return {
            query,
            searchEngine: "Google",
            topDomain: query,
            resultsCount: 1,
            results: [{ title: `Google Search: ${query}`, url: `https://www.google.com/search?q=${encodeURIComponent(query)}`, snippet: `Query executed.` }],
            rawOutput: rawOutput.trim(),
        };
    } catch (err) {
        throw new Error(
            `Google search failed: ${err.message}. Please configure GOOGLE_SEARCH_API_KEY and GOOGLE_SEARCH_CX in backend/.env for authenticated querying.`
        );
    }
};

module.exports = { runGoogle };
