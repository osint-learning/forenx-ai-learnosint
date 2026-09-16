const axios = require("axios");

const cleanTarget = (input) => {
    return String(input || "")
        .trim()
        .replace(/^https?:\/\//i, "")
        .split("/")[0]
        .split(":")[0]
        .trim();
};

const runShodan = async (target) => {
    const clean = cleanTarget(target);
    if (!clean) {
        throw new Error("Target IP or domain is required for Shodan.");
    }

    const apiKey = process.env.SHODAN_API_KEY;
    if (!apiKey) {
        throw new Error(
            "Shodan API key is not configured. Please set SHODAN_API_KEY in backend/.env."
        );
    }

    const isIP = /^\d+\.\d+\.\d+\.\d+$/.test(clean);
    let ip = clean;
    let ports = [];
    let hostnames = [];
    let org = null;
    let os = null;
    let vulns = [];

    if (isIP) {
        const res = await axios.get(`https://api.shodan.io/shodan/host/${clean}`, {
            params: { key: apiKey },
            timeout: 10000,
        });
        const data = res.data || {};
        ip = data.ip_str || clean;
        ports = data.ports || [];
        hostnames = data.hostnames || [];
        org = data.org || null;
        os = data.os || null;
        vulns = data.vulns || [];
    } else {
        const res = await axios.get(`https://api.shodan.io/dns/domain/${clean}`, {
            params: { key: apiKey },
            timeout: 10000,
        });
        const data = res.data || {};
        if (Array.isArray(data.data) && data.data.length > 0) {
            ip = data.data[0].value || clean;
            hostnames = [clean];
            ports = data.data.map((d) => d.port).filter(Boolean);
        }
    }

    let rawOutput = `Shodan Host Intelligence: ${clean}\n`;
    rawOutput += `IP: ${ip}\n`;
    rawOutput += `Organization: ${org || "N/A"}\n`;
    rawOutput += `OS: ${os || "N/A"}\n`;
    rawOutput += `Open Ports: ${ports.join(", ") || "None reported"}\n`;
    rawOutput += `Hostnames: ${hostnames.join(", ") || "None"}\n`;

    return {
        target: clean,
        ip,
        org,
        os,
        ports,
        vulns,
        hostnames,
        rawOutput: rawOutput.trim(),
    };
};

module.exports = { runShodan };
