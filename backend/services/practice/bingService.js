const axios = require("axios");
const cheerio = require("cheerio");

const cleanQuery = (input) => {
    return String(input || "").trim();
};

const runBing = async (target) => {
    const query = cleanQuery(target);
    if (!query) {
        throw new Error("Search query is required for Bing.");
    }

    const apiKey = process.env.BING_SEARCH_API_KEY;
    if (apiKey) {
        const res = await axios.get("https://api.bing.microsoft.com/v7.0/search", {
            params: { q: query },
            headers: {
                "Ocp-Apim-Subscription-Key": apiKey,
            },
            timeout: 10000,
        });

        const items = Array.isArray(res.data?.webPages?.value) ? res.data.webPages.value : [];
        const results = items.map((item) => ({
            title: item.name,
            url: item.url,
            snippet: item.snippet,
        }));

        let rawOutput = `Bing Web Search API Results: ${query}\n\n`;
        results.forEach((r, i) => {
            rawOutput += `[${i + 1}] ${r.title}\n    ${r.url}\n    ${r.snippet}\n\n`;
        });

        return {
            query,
            searchEngine: "Bing",
            resultsCount: results.length,
            results,
            rawOutput: rawOutput.trim(),
        };
    }

    try {
        const res = await axios.get(
            `https://www.bing.com/search?q=${encodeURIComponent(query)}`,
            {
                timeout: 8000,
                headers: {
                    "User-Agent":
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                },
            }
        );

        const $ = cheerio.load(res.data);
        const results = [];

        $("li.b_algo").each((i, el) => {
            const title = $(el).find("h2 a").text().trim();
            const url = $(el).find("h2 a").attr("href");
            const snippet = $(el).find(".b_caption p").text().trim();

            if (title && url) {
                results.push({ title, url, snippet });
            }
        });

        if (results.length === 0) {
            results.push({
                title: `Bing Search: ${query}`,
                url: `https://www.bing.com/search?q=${encodeURIComponent(query)}`,
                snippet: `Query executed for ${query}.`,
            });
        }

        let rawOutput = `Bing Search Results: ${query}\n\n`;
        results.forEach((r, i) => {
            rawOutput += `[${i + 1}] ${r.title}\n    ${r.url}\n    ${r.snippet}\n\n`;
        });

        return {
            query,
            searchEngine: "Bing",
            resultsCount: results.length,
            results,
            rawOutput: rawOutput.trim(),
        };
    } catch (err) {
        throw new Error(`Bing search failed: ${err.message}.`);
    }
};

module.exports = { runBing };
