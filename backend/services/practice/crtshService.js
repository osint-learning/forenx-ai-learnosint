const axios = require("axios");

const cleanDomain = (input) => {
    return String(input || "")
        .trim()
        .replace(/^https?:\/\//i, "")
        .split("/")[0]
        .split(":")[0]
        .trim();
};

const runCrtsh = async (target) => {
    const domain = cleanDomain(target);
    if (!domain) {
        throw new Error("Target domain is required for crt.sh.");
    }

    const res = await axios.get(
        `https://crt.sh/?q=${encodeURIComponent(domain)}&output=json`,
        {
            timeout: 12000,
            headers: {
                "User-Agent": "ForenxAI-OSINT-Service/1.0",
            },
        }
    );

    const entries = Array.isArray(res.data) ? res.data : [];
    const subdomains = new Set();
    const issuers = new Set();

    entries.forEach((cert) => {
        if (cert.issuer_name) {
            const orgMatch = cert.issuer_name.match(/O=([^,]+)/i);
            if (orgMatch) {
                issuers.add(orgMatch[1].trim());
            } else {
                issuers.add(cert.issuer_name.split(",")[0].trim());
            }
        }

        if (cert.name_value) {
            const names = cert.name_value.split("\n");
            names.forEach((name) => {
                const clean = name.trim().toLowerCase().replace(/^\*\./, "");
                if (clean && clean.includes(".")) {
                    subdomains.add(clean);
                }
            });
        }
    });

    const subList = [...subdomains];
    const issuerList = [...issuers];

    let rawOutput = `crt.sh Certificate Transparency Database: ${domain}\n`;
    rawOutput += `Total Certificates Logged: ${entries.length}\n`;
    rawOutput += `Discovered Subdomains (${subList.length}):\n`;
    subList.slice(0, 15).forEach((sub) => {
        rawOutput += ` - ${sub}\n`;
    });
    if (subList.length > 15) {
        rawOutput += ` ... and ${subList.length - 15} more subdomains\n`;
    }

    return {
        domain,
        subdomains: subList,
        issuers: issuerList,
        count: subList.length,
        certificates: entries.slice(0, 10),
        rawOutput: rawOutput.trim(),
    };
};

module.exports = { runCrtsh };
