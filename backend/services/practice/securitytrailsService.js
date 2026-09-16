const axios = require("axios");

const cleanDomain = (input) => {
    return String(input || "")
        .trim()
        .replace(/^https?:\/\//i, "")
        .split("/")[0]
        .split(":")[0]
        .trim();
};

const runSecuritytrails = async (target) => {
    const domain = cleanDomain(target);
    if (!domain) {
        throw new Error("Target domain is required for SecurityTrails.");
    }

    const apiKey = process.env.SECURITYTRAILS_API_KEY;
    if (!apiKey) {
        throw new Error(
            "SecurityTrails API key is not configured. Please set SECURITYTRAILS_API_KEY in backend/.env."
        );
    }

    const res = await axios.get(`https://api.securitytrails.com/v1/domain/${domain}`, {
        headers: {
            APIKEY: apiKey,
        },
        timeout: 10000,
    });

    const data = res.data || {};
    const nameservers = Array.isArray(data.current_dns?.ns?.values)
        ? data.current_dns.ns.values.map((v) => v.nameserver)
        : [];
    const records = Array.isArray(data.current_dns?.a?.values)
        ? data.current_dns.a.values.map((v) => v.ip)
        : [];

    let rawOutput = `SecurityTrails Infrastructure Report: ${domain}\n`;
    rawOutput += `Name Servers: ${nameservers.join(", ") || "None"}\n`;
    rawOutput += `A Records: ${records.join(", ") || "None"}\n`;

    return {
        domain,
        nameservers,
        records,
        subdomains: [],
        subdomainCount: data.subdomains?.length || 0,
        rawOutput: rawOutput.trim(),
    };
};

module.exports = { runSecuritytrails };
