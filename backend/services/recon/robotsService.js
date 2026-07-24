const axios = require("axios");

const getRobotsInfo = async (domain) => {

    const url = domain.startsWith("http")
        ? `${domain}/robots.txt`
        : `https://${domain}/robots.txt`;

    try {

        const response = await axios.get(url, {
            timeout: 10000,
            validateStatus: () => true
        });

        if (response.status !== 200) {
            return {
                exists: false,
                message: "robots.txt not found"
            };
        }

        const lines = response.data.split("\n");

        const disallowed = [];
        let sitemap = null;

        lines.forEach((line) => {

            line = line.trim();

            if (line.startsWith("Disallow:")) {
                disallowed.push(
                    line.replace("Disallow:", "").trim()
                );
            }

            if (line.startsWith("Sitemap:")) {
                sitemap = line.replace("Sitemap:", "").trim();
            }

        });

        return {
            exists: true,
            sitemap,
            totalDisallowed: disallowed.length,
            disallowed
        };

    } catch (error) {

        return {
            exists: false,
            error: error.message
        };

    }

};

module.exports = {
    getRobotsInfo
};