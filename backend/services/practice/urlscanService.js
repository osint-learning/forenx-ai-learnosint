const axios = require("axios");

const cleanDomain = (input) => {
    return String(input || "")
        .trim()
        .replace(/^https?:\/\//i, "")
        .split("/")[0]
        .split(":")[0]
        .trim();
};

const runUrlscan = async (target) => {
    const domain = cleanDomain(target);
    if (!domain) {
        throw new Error("Target domain or URL is required for URLScan.io.");
    }

    const headers = {};
    if (process.env.URLSCAN_API_KEY) {
        headers["API-Key"] = process.env.URLSCAN_API_KEY;
    }

    const res = await axios.get(
        `https://urlscan.io/api/v1/search/?q=domain:${domain}&size=10`,
        {
            headers,
            timeout: 10000,
        }
    );

    const data = res.data || {};
    const results = Array.isArray(data.results) ? data.results : [];
    const ips = [];
    const countries = [];
    let server = null;

    results.forEach((item) => {
        if (item.page) {
            if (item.page.ip) ips.push(item.page.ip);
            if (item.page.country) countries.push(item.page.country);
            if (item.page.server && !server) server = item.page.server;
        }
    });

    let rawOutput = `URLScan.io Intelligence Report: ${domain}\n`;
    rawOutput += `Indexed Scans: ${results.length}\n`;
    rawOutput += `Observed IPs: ${[...new Set(ips)].join(", ") || "None"}\n`;
    rawOutput += `Countries: ${[...new Set(countries)].join(", ") || "None"}\n`;
    rawOutput += `Server Header: ${server || "N/A"}\n`;

    return {
        target: domain,
        ips: [...new Set(ips)],
        countries: [...new Set(countries)],
        server: server || "Unknown",
        resultsCount: results.length,
        results,
        rawOutput: rawOutput.trim(),
    };
};

module.exports = { runUrlscan };
