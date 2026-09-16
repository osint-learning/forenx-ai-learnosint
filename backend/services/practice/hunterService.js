const axios = require("axios");

const cleanDomain = (input) => {
    return String(input || "")
        .trim()
        .replace(/^https?:\/\//i, "")
        .split("/")[0]
        .split(":")[0]
        .trim();
};

const runHunter = async (target) => {
    const domain = cleanDomain(target);
    if (!domain) {
        throw new Error("Target domain is required for Hunter.io.");
    }

    const apiKey = process.env.HUNTER_API_KEY;
    if (!apiKey) {
        throw new Error(
            "Hunter.io API key is not configured. Please set HUNTER_API_KEY in backend/.env."
        );
    }

    const res = await axios.get("https://api.hunter.io/v2/domain-search", {
        params: {
            domain,
            api_key: apiKey,
        },
        timeout: 10000,
    });

    const data = res.data?.data || {};
    const emails = Array.isArray(data.emails)
        ? data.emails.map((e) => e.value)
        : [];

    let rawOutput = `Hunter.io Domain Intelligence Report: ${domain}\n`;
    rawOutput += `Organization: ${data.organization || "N/A"}\n`;
    rawOutput += `Email Pattern: ${data.pattern || "N/A"}\n`;
    rawOutput += `Discovered Emails (${emails.length}):\n`;
    emails.forEach((email) => {
        rawOutput += ` - ${email}\n`;
    });

    return {
        domain,
        organization: data.organization || null,
        pattern: data.pattern || null,
        emails,
        total: data.total || emails.length,
        rawOutput: rawOutput.trim(),
    };
};

module.exports = { runHunter };
