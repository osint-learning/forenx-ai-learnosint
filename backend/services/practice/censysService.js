const axios = require("axios");

const cleanTarget = (input) => {
    return String(input || "")
        .trim()
        .replace(/^https?:\/\//i, "")
        .split("/")[0]
        .split(":")[0]
        .trim();
};

const runCensys = async (target) => {
    const clean = cleanTarget(target);
    if (!clean) {
        throw new Error("Target domain or IP is required for Censys.");
    }

    const apiId = process.env.CENSYS_API_ID;
    const apiSecret = process.env.CENSYS_API_SECRET;
    if (!apiId || !apiSecret) {
        throw new Error(
            "Censys API credentials are not configured. Please set CENSYS_API_ID and CENSYS_API_SECRET in backend/.env."
        );
    }

    const authHeader = Buffer.from(`${apiId}:${apiSecret}`).toString("base64");

    const res = await axios.get(`https://search.censys.io/api/v2/hosts/${clean}`, {
        headers: {
            Authorization: `Basic ${authHeader}`,
        },
        timeout: 10000,
    });

    const data = res.data?.result || {};
    const services = Array.isArray(data.services)
        ? data.services.map((s) => `${s.port}/${s.service_name || "UNKNOWN"}`)
        : [];
    const protocols = Array.isArray(data.services)
        ? data.services.map((s) => s.transport_protocol).filter(Boolean)
        : [];

    let rawOutput = `Censys Host Intelligence Report: ${clean}\n`;
    rawOutput += `IP: ${data.ip || clean}\n`;
    rawOutput += `Autonomous System: ${data.autonomous_system?.name || "N/A"}\n`;
    rawOutput += `Observed Services: ${services.join(", ") || "None"}\n`;

    return {
        target: clean,
        ip: data.ip || clean,
        services,
        protocols: [...new Set(protocols)],
        autonomousSystem: data.autonomous_system?.name || null,
        location: data.location?.country || null,
        rawOutput: rawOutput.trim(),
    };
};

module.exports = { runCensys };
