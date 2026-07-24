const axios = require("axios");
const { calculateRisk } = require("./riskEngine");
const getSecurityHeaders = async (domain) => {
    const url = domain.startsWith("http")
        ? domain
        : `https://${domain}`;

    try {
        const response = await axios.get(url, {
            timeout: 10000,
            validateStatus: () => true,
        });

        const headers = response.headers;

        const checks = [
            {
                key: "content-security-policy",
                name: "Content-Security-Policy",
                severity: "High",
                description: "Helps prevent Cross-Site Scripting (XSS).",
                recommendation: "Implement a Content-Security-Policy header."
            },
            {
                key: "strict-transport-security",
                name: "Strict-Transport-Security",
                severity: "High",
                description: "Forces browsers to use HTTPS.",
                recommendation: "Enable HSTS on your web server."
            },
            {
                key: "x-frame-options",
                name: "X-Frame-Options",
                severity: "Medium",
                description: "Protects against clickjacking attacks.",
                recommendation: "Use DENY or SAMEORIGIN."
            },
            {
                key: "x-content-type-options",
                name: "X-Content-Type-Options",
                severity: "Medium",
                description: "Prevents MIME type sniffing.",
                recommendation: "Set X-Content-Type-Options to nosniff."
            },
            {
                key: "referrer-policy",
                name: "Referrer-Policy",
                severity: "Low",
                description: "Controls referrer information sent by browsers.",
                recommendation: "Configure a suitable Referrer-Policy."
            },
            {
                key: "permissions-policy",
                name: "Permissions-Policy",
                severity: "Low",
                description: "Controls access to browser features.",
                recommendation: "Define a Permissions-Policy."
            }
        ];

        const findings = [];

        checks.forEach((item) => {
            const exists = !!headers[item.key];

            findings.push({
                header: item.name,
                status: exists ? "Present" : "Missing",
                severity: exists ? "Info" : item.severity,
                description: item.description,
                recommendation: exists ? "No action needed." : item.recommendation,
                value: headers[item.key] || "-"
            });
        });

        const risk = calculateRisk(findings);

        return {
            findings,
            risk,
        };

    } catch (error) {

        return [
            {
                error: error.message
            }
        ];

    }
};

module.exports = {
    getSecurityHeaders,
};