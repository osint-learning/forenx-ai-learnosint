const axios = require("axios");

const cleanDomain = (input) => {
    return String(input || "")
        .trim()
        .replace(/^https?:\/\//i, "")
        .split("/")[0]
        .split(":")[0]
        .trim();
};

const runWayback = async (target) => {
    const domain = cleanDomain(target);
    if (!domain) {
        throw new Error("Target domain is required for Wayback Machine.");
    }

    const res = await axios.get(
        `https://web.archive.org/cdx/search/cdx?url=${encodeURIComponent(domain)}/*&output=json&limit=25`,
        {
            timeout: 10000,
            headers: {
                "User-Agent": "ForenxAI-OSINT-Service/1.0",
            },
        }
    );

    let snapshots = [];
    let totalSnapshots = 0;
    let firstSnapshot = "N/A";
    let lastSnapshot = "N/A";

    if (Array.isArray(res.data) && res.data.length > 1) {
        snapshots = res.data.slice(1).map((row) => ({
            timestamp: row[1],
            originalUrl: row[2],
            mimetype: row[3],
            statusCode: row[4],
        }));
        totalSnapshots = snapshots.length;
        if (snapshots.length > 0) {
            firstSnapshot = snapshots[0].timestamp;
            lastSnapshot = snapshots[snapshots.length - 1].timestamp;
        }
    }

    let rawOutput = `Wayback Machine CDX Archive Intelligence: ${domain}\n`;
    rawOutput += `Archived Snapshots Discovered: ${totalSnapshots}\n`;
    rawOutput += `Earliest Snapshot: ${firstSnapshot}\n`;
    rawOutput += `Latest Snapshot: ${lastSnapshot}\n\n`;
    rawOutput += `Recent Snapshots:\n`;
    snapshots.slice(0, 5).forEach((s) => {
        rawOutput += ` - [${s.timestamp}] ${s.originalUrl} (${s.statusCode})\n`;
    });

    return {
        target: domain,
        totalSnapshots,
        firstSnapshot,
        lastSnapshot,
        snapshots,
        rawOutput: rawOutput.trim(),
    };
};

module.exports = { runWayback };
