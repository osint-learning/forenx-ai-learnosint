const axios = require("axios");

const cleanDomain = (input) => {
    return String(input || "")
        .trim()
        .replace(/^https?:\/\//i, "")
        .split("/")[0]
        .split(":")[0]
        .trim();
};

const runVirustotal = async (target) => {
    const domain = cleanDomain(target);
    if (!domain) {
        throw new Error("Target domain or IP is required for VirusTotal.");
    }

    const apiKey = process.env.VIRUSTOTAL_API_KEY;
    if (!apiKey) {
        throw new Error(
            "VirusTotal API key is not configured. Please set VIRUSTOTAL_API_KEY in backend/.env."
        );
    }

    const res = await axios.get(`https://www.virustotal.com/api/v3/domains/${domain}`, {
        headers: {
            "x-apikey": apiKey,
        },
        timeout: 10000,
    });

    const attributes = res.data?.data?.attributes || {};
    const stats = attributes.last_analysis_stats || {};
    const harmless = stats.harmless || 0;
    const malicious = stats.malicious || 0;
    const suspicious = stats.suspicious || 0;
    const reputation = malicious > 0 ? "malicious" : "clean";
    const categories = Object.values(attributes.categories || {});

    let rawOutput = `VirusTotal Threat Intelligence Report: ${domain}\n`;
    rawOutput += `Reputation: ${reputation.toUpperCase()}\n`;
    rawOutput += `Harmless Detections: ${harmless}\n`;
    rawOutput += `Malicious Detections: ${malicious}\n`;
    rawOutput += `Suspicious Detections: ${suspicious}\n`;
    rawOutput += `Categories: ${categories.join(", ") || "None"}\n`;

    return {
        target: domain,
        reputation,
        harmless,
        malicious,
        suspicious,
        categories: [...new Set(categories)],
        rawOutput: rawOutput.trim(),
    };
};

module.exports = { runVirustotal };
