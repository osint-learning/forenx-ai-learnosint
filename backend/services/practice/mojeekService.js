const axios = require("axios");
const cheerio = require("cheerio");

const cleanQuery = (input) => {
    return String(input || "").trim();
};

const runMojeek = async (target) => {
    const query = cleanQuery(target);
    if (!query) {
        throw new Error("Search query is required for Mojeek.");
    }

    const res = await axios.get(
        `https://www.mojeek.com/search?q=${encodeURIComponent(query)}`,
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

    $(".results-standard li").each((i, el) => {
        const title = $(el).find("a.title").text().trim();
        const url = $(el).find("a.title").attr("href");
        const snippet = $(el).find("p.s").text().trim();

        if (title && url) {
            results.push({ title, url, snippet });
        }
    });

    if (results.length === 0) {
        results.push({
            title: `Mojeek Search: ${query}`,
            url: `https://www.mojeek.com/search?q=${encodeURIComponent(query)}`,
            snippet: `Query executed on Mojeek crawler index.`,
        });
    }

    let rawOutput = `Mojeek Search Results: ${query}\n\n`;
    results.forEach((r, i) => {
        rawOutput += `[${i + 1}] ${r.title}\n    ${r.url}\n    ${r.snippet}\n\n`;
    });

    return {
        query,
        searchEngine: "Mojeek",
        resultsCount: results.length,
        results,
        rawOutput: rawOutput.trim(),
    };
};

module.exports = { runMojeek };
