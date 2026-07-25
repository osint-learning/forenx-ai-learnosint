const axios = require("axios");
const cheerio = require("cheerio");
const { parseMetadata } = require("./metadataParser");

/**
 * Fetch webpage and extract metadata
 * @param {string} url
 * @returns {Object}
 */
async function getMetadata(url) {
    try {
        // Normalize URL
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
            url = `https://${url}`;
        }

        // Fetch webpage
        const response = await axios.get(url, {
            timeout: 10000,
            maxRedirects: 5,
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126.0 Safari/537.36",
            },
        });

        // Load HTML into Cheerio
        const $ = cheerio.load(response.data);

        // Parse metadata
        const metadata = parseMetadata($, url);

        return {
            success: true,
            url,
            metadata,
        };
    } catch (error) {
        return {
            success: false,
            url,
            error: error.message,
        };
    }
}

module.exports = {
    getMetadata,
};