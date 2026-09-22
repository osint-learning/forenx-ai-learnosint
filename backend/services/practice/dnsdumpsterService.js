const axios = require("axios");
const cheerio = require("cheerio");
const dns = require("dns").promises;

const cleanDomain = (input) => {
    return String(input || "")
        .trim()
        .replace(/^https?:\/\//i, "")
        .split("/")[0]
        .split(":")[0]
        .trim();
};

const runDnsdumpster = async (target) => {
    const domain = cleanDomain(target);
    if (!domain) {
        throw new Error("Target domain is required for DNSDumpster.");
    }

    try {
        const sessionRes = await axios.get("https://dnsdumpster.com/", {
            timeout: 5000,
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            },
        });

        const cookieHeader = sessionRes.headers["set-cookie"];
        const cookies = Array.isArray(cookieHeader)
            ? cookieHeader.map((c) => c.split(";")[0]).join("; ")
            : "";
        const $ = cheerio.load(sessionRes.data);
        const csrfToken = $('input[name="csrfmiddlewaretoken"]').val();

        if (csrfToken) {
            const postRes = await axios.post(
                "https://dnsdumpster.com/",
                `csrfmiddlewaretoken=${csrfToken}&targetip=${domain}&user=free`,
                {
                    timeout: 8000,
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        Cookie: cookies,
                        Referer: "https://dnsdumpster.com/",
                        "User-Agent":
                            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                    },
                }
            );

            const $result = cheerio.load(postRes.data);
            const dnsServers = [];
            const mxRecords = [];
            const hostRecords = [];

            $result("table").each((i, table) => {
                $result(table)
                    .find("td.col-md-4")
                    .each((j, td) => {
                        const text = $result(td).text().trim().split("\n")[0].trim();
                        if (text && text.includes(".")) {
                            if (i === 0) dnsServers.push(text);
                            else if (i === 1) mxRecords.push(text);
                            else hostRecords.push(text);
                        }
                    });
            });

            if (dnsServers.length > 0 || mxRecords.length > 0 || hostRecords.length > 0) {
                let rawOutput = `DNSDumpster Reconnaissance Report: ${domain}\n`;
                rawOutput += `DNS Servers: ${dnsServers.join(", ") || "None"}\n`;
                rawOutput += `MX Records: ${mxRecords.join(", ") || "None"}\n`;
                rawOutput += `Host Records: ${hostRecords.join(", ") || "None"}\n`;

                return {
                    domain,
                    dnsServers: [...new Set(dnsServers)],
                    mxRecords: [...new Set(mxRecords)],
                    txtRecords: [],
                    hostRecords: [...new Set(hostRecords)],
                    rawOutput: rawOutput.trim(),
                };
            }
        }
    } catch (err) {
        // Fall back to live DNS resolution if scraping is throttled or challenged
    }

    // Live authoritative DNS mapping fallback
    try {
        const [nsRecords, mxRecords, aRecords] = await Promise.all([
            dns.resolveNs(domain).catch(() => []),
            dns.resolveMx(domain).catch(() => []),
            dns.resolve4(domain).catch(() => []),
        ]);

        const dnsServers = nsRecords.map(r => String(r).toLowerCase());
        const mxList = mxRecords.map(r => `${r.exchange} (priority ${r.priority})`);
        const hostRecords = aRecords.map(ip => `${domain} (${ip})`);

        let rawOutput = `DNSDumpster Reconnaissance Report: ${domain}\n`;
        rawOutput += `DNS Servers: ${dnsServers.join(", ") || "None"}\n`;
        rawOutput += `MX Records: ${mxList.join(", ") || "None"}\n`;
        rawOutput += `Host Records: ${hostRecords.join(", ") || "None"}\n`;

        return {
            domain,
            dnsServers: [...new Set(dnsServers)],
            mxRecords: [...new Set(mxList)],
            txtRecords: [],
            hostRecords: [...new Set(hostRecords)],
            rawOutput: rawOutput.trim(),
        };
    } catch (e) {
        throw new Error(`DNSDumpster query failed: ${e.message}`);
    }
};

module.exports = { runDnsdumpster };
