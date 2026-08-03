const axios = require("axios");
const metascraper = require("metascraper")([
    require("metascraper-author")(),
    require("metascraper-date")(),
    require("metascraper-description")(),
    require("metascraper-image")(),
    require("metascraper-lang")(),
    require("metascraper-logo")(),
    require("metascraper-logo-favicon")(),
    require("metascraper-publisher")(),
    require("metascraper-title")(),
    require("metascraper-url")()
]);

async function getMetadata(domain) {

    try {

        let url = domain;

        if (
            !url.startsWith("http://") &&
            !url.startsWith("https://")
        ) {
            url = `https://${url}`;
        }

        const response = await axios.get(url, {

            timeout: 10000,

            headers: {

                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126 Safari/537.36"

            }

        });

        const metadata = await metascraper({

            html: response.data,

            url

        });

        return {

            success: true,

            url,

            metadata

        };

    }

    catch (error) {

        return {

            success: false,

            error: error.message

        };

    }

}

module.exports = {

    getMetadata

};