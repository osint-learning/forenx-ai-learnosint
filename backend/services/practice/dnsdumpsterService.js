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

const runDnsdumpster = async (target) => {
    const domain = cleanDomain(target);
    if (!domain) {
        throw new Error("Target domain is required for DNSDumpster.");
    }

    try {
        const sessionRes = await axios.get("https://dnsdumpster.com/", {
            timeout: 8000,
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

        if (!csrfToken) {
            throw new Error(
                "DNSDumpster CSRF verification unavailable. Service may be protected by Cloudflare bot challenge."
            );
        }

        const postRes = await axios.post(
            "https://dnsdumpster.com/",
            `csrfmiddlewaretoken=${csrfToken}&targetip=${domain}&user=free`,
            {
                timeout: 10000,
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
    } catch (err) {
        throw new Error(
            `DNSDumpster web query failed: ${err.message || "Cloudflare anti-bot challenge active"}`
        );
    }
};

module.exports = { runDnsdumpster };
