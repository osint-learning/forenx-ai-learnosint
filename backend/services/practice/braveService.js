const axios = require("axios");
const cheerio = require("cheerio");

const cleanQuery = (input) => {
    return String(input || "").trim();
};

const runBrave = async (target) => {
    const query = cleanQuery(target);
    if (!query) {
        throw new Error("Search query is required for Brave Search.");
    }

    const apiKey = process.env.BRAVE_SEARCH_API_KEY;
    if (apiKey) {
        const res = await axios.get("https://api.search.brave.com/res/v1/web/search", {
            params: { q: query },
            headers: {
                "X-Subscription-Token": apiKey,
            },
            timeout: 10000,
        });

        const data = res.data?.web?.results || [];
        const results = data.slice(0, 10).map((item) => ({
            title: item.title,
            url: item.url,
            snippet: item.description,
        }));

        let rawOutput = `Brave Search Results: ${query}\n\n`;
        results.forEach((r, i) => {
            rawOutput += `[${i + 1}] ${r.title}\n    ${r.url}\n    ${r.snippet}\n\n`;
        });

        return {
            query,
            searchEngine: "Brave Search",
            resultsCount: results.length,
            results,
            rawOutput: rawOutput.trim(),
        };
    }

    // Public search attempt
    try {
        const res = await axios.get(`https://search.brave.com/search?q=${encodeURIComponent(query)}`, {
            timeout: 8000,
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            },
        });

        const $ = cheerio.load(res.data);
        const results = [];

        $(".snippet").each((i, el) => {
            const title = $(el).find(".title").text().trim();
            const url = $(el).find("a").attr("href");
            const snippet = $(el).find(".snippet-description").text().trim();

            if (title && url) {
                results.push({ title, url, snippet });
            }
        });

        if (results.length === 0) {
            results.push({
                title: `Brave Search: ${query}`,
                url: `https://search.brave.com/search?q=${encodeURIComponent(query)}`,
                snippet: `Query executed for ${query}.`,
            });
        }

        let rawOutput = `Brave Search Results: ${query}\n\n`;
        results.forEach((r, i) => {
            rawOutput += `[${i + 1}] ${r.title}\n    ${r.url}\n    ${r.snippet}\n\n`;
        });

        return {
            query,
            searchEngine: "Brave Search",
            resultsCount: results.length,
            results,
            rawOutput: rawOutput.trim(),
        };
    } catch (err) {
        throw new Error(
            `Brave search request failed: ${err.message}. Please configure BRAVE_SEARCH_API_KEY in .env for API querying.`
        );
    }
};

module.exports = { runBrave };
