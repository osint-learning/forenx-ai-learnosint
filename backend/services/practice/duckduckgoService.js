const axios = require("axios");

const cleanQuery = (input) => {
    return String(input || "").trim();
};

const runDuckduckgo = async (target) => {
    const query = cleanQuery(target);
    if (!query) {
        throw new Error("Search query is required for DuckDuckGo.");
    }

    const res = await axios.get("https://api.duckduckgo.com/", {
        params: {
            q: query,
            format: "json",
            no_html: 1,
            skip_disambig: 1,
        },
        timeout: 8000,
        headers: {
            "User-Agent": "ForenxAI-OSINT-Service/1.0",
        },
    });

    const data = res.data || {};
    const results = [];

    if (data.AbstractText) {
        results.push({
            title: data.Heading || query,
            url: data.AbstractURL || "https://duckduckgo.com/?q=" + encodeURIComponent(query),
            snippet: data.AbstractText,
        });
    }

    if (Array.isArray(data.RelatedTopics)) {
        data.RelatedTopics.slice(0, 5).forEach((item) => {
            if (item.Text && item.FirstURL) {
                results.push({
                    title: item.Text.split(" - ")[0] || item.Text,
                    url: item.FirstURL,
                    snippet: item.Text,
                });
            }
        });
    }

    if (results.length === 0) {
        results.push({
            title: `DuckDuckGo Search: ${query}`,
            url: `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
            snippet: `Query executed for ${query}.`,
        });
    }

    let rawOutput = `DuckDuckGo Search Intelligence: ${query}\n\n`;
    results.forEach((r, i) => {
        rawOutput += `[${i + 1}] ${r.title}\n`;
        rawOutput += `    URL: ${r.url}\n`;
        rawOutput += `    Snippet: ${r.snippet}\n\n`;
    });

    return {
        query,
        searchEngine: "DuckDuckGo",
        resultsCount: results.length,
        results,
        rawOutput: rawOutput.trim(),
    };
};

module.exports = { runDuckduckgo };
