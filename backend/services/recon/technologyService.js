const axios = require("axios");
const cheerio = require("cheerio");
const { detectTechnologies } = require("./technologyDetector");
const { detectFingerprints } = require("./fingerprintDetector");
const detectTechnology = async (domain) => {

    const url = domain.startsWith("http")
        ? domain
        : `https://${domain}`;

    try {

        const response = await axios.get(url, {
            timeout: 10000,
            validateStatus: () => true
        });

        const html = response.data;
        const headers = response.headers;

        const $ = cheerio.load(html);

        // -------------------------
        // Extract Scripts
        // -------------------------
        const scripts = [];

        $("script[src]").each((i, el) => {
            scripts.push($(el).attr("src"));
        });

        // -------------------------
        // Extract Stylesheets
        // -------------------------
        const stylesheets = [];

        $('link[rel="stylesheet"]').each((i, el) => {
            stylesheets.push($(el).attr("href"));
        });

        // -------------------------
        // Extract Meta Tags
        // -------------------------
        const metaTags = {};

        $("meta").each((i, el) => {

            const name =
                $(el).attr("name") ||
                $(el).attr("property") ||
                $(el).attr("http-equiv");

            const content = $(el).attr("content");

            if (name && content) {
                metaTags[name.toLowerCase()] = content;
            }

        });

        // -------------------------
        // Cookies
        // -------------------------
        const cookies = headers["set-cookie"] || [];

        const technologies = [
            ...detectTechnologies({
                html,
                headers,
                scripts,
                stylesheets,
                metaTags,
                cookies
            }),
            ...detectFingerprints({
                html,
                headers,
                scripts,
                stylesheets,
                metaTags,
                cookies
            })
        ];
        const uniqueTechnologies = [];

        const seen = new Set();

        for (const tech of technologies) {

            const key = `${tech.name}:${tech.category}`;

            if (!seen.has(key)) {
                seen.add(key);
                uniqueTechnologies.push(tech);
            }

        }
        return {

            success: true,

            url,

            technologies: uniqueTechnologies,

            evidence: {
                scripts: scripts.length,
                stylesheets: stylesheets.length,
                metaTags: Object.keys(metaTags).length,
                cookies: cookies.length
            },

            totalDetected: uniqueTechnologies.length

        };

    } catch (error) {

        return {

            success: false,
            message: error.message,
            technologies: []

        };

    }

};

module.exports = {
    detectTechnology
};