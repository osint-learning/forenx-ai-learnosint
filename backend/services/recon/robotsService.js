const axios = require("axios");

const getRobotsInfo = async (domain) => {

    const robotsUrl = domain.startsWith("http")
        ? `${domain.replace(/\/$/, "")}/robots.txt`
        : `https://${domain}/robots.txt`;

    try {

        const response = await axios.get(robotsUrl, {
            timeout: 10000,
            validateStatus: () => true
        });

        if (response.status !== 200) {
            return {
                exists: false,
                url: robotsUrl,
                message: "robots.txt not found"
            };
        }

        const lines = response.data.split(/\r?\n/);

        const disallow = [];
        const allow = [];
        const sitemaps = [];
        const userAgents = [];
        let crawlDelay = null;
        let host = null;

        for (let line of lines) {

            line = line.trim();

            if (!line || line.startsWith("#")) continue;

            if (/^User-agent:/i.test(line)) {
                userAgents.push(
                    line.replace(/^User-agent:/i, "").trim()
                );
            }

            else if (/^Disallow:/i.test(line)) {
                const value = line.replace(/^Disallow:/i, "").trim();

                if (value)
                    disallow.push(value);
            }

            else if (/^Allow:/i.test(line)) {
                const value = line.replace(/^Allow:/i, "").trim();

                if (value)
                    allow.push(value);
            }

            else if (/^Sitemap:/i.test(line)) {
                sitemaps.push(
                    line.replace(/^Sitemap:/i, "").trim()
                );
            }

            else if (/^Crawl-delay:/i.test(line)) {
                crawlDelay = line.replace(/^Crawl-delay:/i, "").trim();
            }

            else if (/^Host:/i.test(line)) {
                host = line.replace(/^Host:/i, "").trim();
            }
        }

        return {

            exists: true,

            url: robotsUrl,

            status: response.status,

            userAgents,

            disallow,

            allow,

            sitemaps,

            crawlDelay,

            host,

            totalRules: disallow.length + allow.length,

            totalUserAgents: userAgents.length

        };

    }

    catch (error) {

        return {

            exists: false,

            url: robotsUrl,

            error: error.message

        };

    }

};

module.exports = {
    getRobotsInfo
};