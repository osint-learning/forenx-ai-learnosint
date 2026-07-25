const whois = require("whois-json");
const { parseWhois } = require("./whoisParser");

async function getWhois(domain) {
    try {
        // Remove protocol if present
        domain = domain
            .replace(/^https?:\/\//, "")
            .replace(/^www\./, "")
            .split("/")[0];

        const rawData = await whois(domain);

        const parsedData = parseWhois(rawData);

        return {
            success: true,
            domain,
            whois: parsedData,
        };
    } catch (error) {
        return {
            success: false,
            domain,
            error: error.message,
        };
    }
}

module.exports = {
    getWhois,
};