const axios = require("axios");

const cleanUsername = (input) => {
    return String(input || "")
        .trim()
        .replace(/^@/, "")
        .replace(/[^a-zA-Z0-9._-]/g, "")
        .trim();
};

const platformsToCheck = [
    { name: "GitHub", url: (u) => `https://github.com/${u}` },
    { name: "Reddit", url: (u) => `https://www.reddit.com/user/${u}/about.json` },
    { name: "GitLab", url: (u) => `https://gitlab.com/${u}` },
    { name: "Pinterest", url: (u) => `https://www.pinterest.com/${u}/` },
    { name: "DockerHub", url: (u) => `https://hub.docker.com/v2/users/${u}` },
    { name: "NPM", url: (u) => `https://www.npmjs.com/~${u}` },
    { name: "Dev.to", url: (u) => `https://dev.to/${u}` },
    { name: "Medium", url: (u) => `https://medium.com/@${u}` },
    { name: "Pastebin", url: (u) => `https://pastebin.com/u/${u}` },
    { name: "Vimeo", url: (u) => `https://vimeo.com/${u}` },
];

const runWhatsmyname = async (target) => {
    const username = cleanUsername(target);
    if (!username) {
        throw new Error("Target username is required for whatsmyname.");
    }

    const matches = [];
    const checked = [];

    const checks = platformsToCheck.map(async (p) => {
        checked.push(p.name);
        try {
            const url = p.url(username);
            const res = await axios.get(url, {
                timeout: 5000,
                headers: {
                    "User-Agent":
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                },
                validateStatus: (status) => status < 500,
            });

            if (res.status === 200) {
                matches.push(p.name);
            }
        } catch (e) {}
    });

    await Promise.allSettled(checks);

    let rawOutput = `WhatsMyName Account Discovery: ${username}\n`;
    rawOutput += `Platforms Checked: ${checked.length}\n`;
    rawOutput += `Discovered Accounts (${matches.length}):\n`;
    matches.forEach((m) => {
        rawOutput += ` [+] MATCH: ${m}\n`;
    });
    if (matches.length === 0) {
        rawOutput += ` [-] No matching public profiles discovered.\n`;
    }

    return {
        username,
        matches,
        platforms: checked,
        count: matches.length,
        rawOutput: rawOutput.trim(),
    };
};

module.exports = { runWhatsmyname };
