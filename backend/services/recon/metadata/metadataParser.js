const {
    extractBasicMetadata,
    extractOpenGraph,
    extractTwitterCard,
} = require("./metadataExtractor");

/**
 * Parse webpage metadata
 * @param {CheerioAPI} $
 * @param {string} url
 * @returns {Object}
 */
function parseMetadata($, url) {
    const basic = extractBasicMetadata($, url);
    const openGraph = extractOpenGraph($);
    const twitter = extractTwitterCard($);

    return {
        ...basic,
        openGraph,
        twitter,
    };
}

module.exports = {
    parseMetadata,
};