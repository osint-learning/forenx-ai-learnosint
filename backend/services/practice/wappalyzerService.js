const axios = require("axios");
const cheerio = require("cheerio");

const cleanDomain = (input) => {
    return String(input || "")
        .trim()
        .replace(/^https?:\/\//i, "")
        .split("/")[0]
        .split(":")[0]
        .trim();
};

const runWappalyzer = async (target) => {
    const domain = cleanDomain(target);
    if (!domain) {
        throw new Error("Target domain is required for wappalyzer.");
    }

    let res = null;
    try {
        res = await axios.get(`https://${domain}`, {
            timeout: 8000,
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            },
            validateStatus: (status) => status < 500,
        });
    } catch (e) {
        res = await axios.get(`http://${domain}`, {
            timeout: 8000,
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            },
            validateStatus: (status) => status < 500,
        });
    }

    const technologies = new Set();
    const categories = new Set();

    if (res && res.headers) {
        const server = res.headers["server"];
        if (server) {
            technologies.add(server);
            categories.add("Web Servers");
        }

        const poweredBy = res.headers["x-powered-by"];
        if (poweredBy) {
            technologies.add(poweredBy);
            categories.add("Programming Languages / Frameworks");
        }

        if (res.headers["strict-transport-security"]) {
            technologies.add("HSTS");
            categories.add("Security");
        }

        if (res.headers["content-security-policy"]) {
            technologies.add("CSP");
            categories.add("Security");
        }

        if (res.headers["cf-ray"]) {
            technologies.add("Cloudflare");
            categories.add("CDN / WAF");
        }
    }

    if (res && res.data) {
        const bodyText = typeof res.data === "string" ? res.data : "";
        const $ = cheerio.load(bodyText);

        const generator = $('meta[name="generator"]').attr("content");
        if (generator) {
            technologies.add(generator);
            categories.add("CMS");
        }

        if (/wp-content|wp-includes/i.test(bodyText)) {
            technologies.add("WordPress");
            categories.add("CMS");
        }
        if (/react|react-dom|_next/i.test(bodyText)) {
            technologies.add("React");
            categories.add("JavaScript Frameworks");
        }
        if (/vue|nuxt/i.test(bodyText)) {
            technologies.add("Vue.js");
            categories.add("JavaScript Frameworks");
        }
        if (/jquery/i.test(bodyText)) {
            technologies.add("jQuery");
            categories.add("JavaScript Libraries");
        }
        if (/bootstrap/i.test(bodyText)) {
            technologies.add("Bootstrap");
            categories.add("UI Frameworks");
        }
        if (/tailwind/i.test(bodyText)) {
            technologies.add("Tailwind CSS");
            categories.add("UI Frameworks");
        }
        if (/google-analytics\.com|gtag/i.test(bodyText)) {
            technologies.add("Google Analytics");
            categories.add("Analytics");
        }
    }

    if (technologies.size === 0) {
        technologies.add("HTML5");
        categories.add("Web Technologies");
    }

    const techList = [...technologies];
    const catList = [...categories];

    let rawOutput = `Wappalyzer Technology Profiler: ${domain}\n\n`;
    rawOutput += `Detected Technologies (${techList.length}):\n`;
    techList.forEach((t) => {
        rawOutput += ` - ${t}\n`;
    });
    rawOutput += `\nCategories: ${catList.join(", ") || "General"}\n`;

    return {
        target: domain,
        statusCode: res?.status || 200,
        technologies: techList,
        categories: catList,
        headers: res?.headers || {},
        rawOutput: rawOutput.trim(),
    };
};

module.exports = { runWappalyzer };
