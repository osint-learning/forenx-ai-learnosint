const axios = require("axios");

const cleanAccount = (input) => {
    return String(input || "").trim();
};

const runHibp = async (target) => {
    const account = cleanAccount(target);
    if (!account) {
        throw new Error("Target email or account name is required for Have I Been Pwned.");
    }

    const apiKey = process.env.HIBP_API_KEY;
    if (!apiKey) {
        throw new Error(
            "Have I Been Pwned API key is not configured. Please set HIBP_API_KEY in backend/.env."
        );
    }

    try {
        const res = await axios.get(
            `https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(account)}?truncateResponse=false`,
            {
                headers: {
                    "hibp-api-key": apiKey,
                    "user-agent": "ForenxAI-OSINT-Platform",
                },
                timeout: 10000,
            }
        );

        const breaches = Array.isArray(res.data) ? res.data : [];
        const breachNames = breaches.map((b) => b.Title || b.Name);

        let rawOutput = `Have I Been Pwned Account Assessment: ${account}\n`;
        rawOutput += `Status: BREACHED\n`;
        rawOutput += `Breaches Discovered (${breaches.length}):\n`;
        breaches.forEach((b) => {
            rawOutput += ` - ${b.Title} (Date: ${b.BreachDate})\n`;
        });

        return {
            target: account,
            account,
            status: "breached",
            breached: true,
            breachesCount: breaches.length,
            breaches: breachNames,
            rawOutput: rawOutput.trim(),
        };
    } catch (err) {
        if (err.response && err.response.status === 404) {
            let rawOutput = `Have I Been Pwned Account Assessment: ${account}\n`;
            rawOutput += `Status: CLEAN (No breaches recorded)\n`;
            rawOutput += `Total Breaches: 0\n`;

            return {
                target: account,
                account,
                status: "clean",
                breached: false,
                breachesCount: 0,
                breaches: [],
                rawOutput: rawOutput.trim(),
            };
        }
        throw err;
    }
};

module.exports = { runHibp };
