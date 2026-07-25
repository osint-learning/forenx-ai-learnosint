const {
    getDomainInfo,
    getWebsiteInfo,
} = require("../reconService");

const { getSecurityHeaders } = require("./headerService");
const { getSSLInfo } = require("./sslService");
const { getRobotsInfo } = require("./robotsService");

const { detectTechnology } = require("./technology/technologyService");
const { getMetadata } = require("./metadata/metadataService");
const { getWhois } = require("./whois/whoisService");

const fullScan = async (domain) => {

    const domainInfo = await getDomainInfo(domain);

    const websiteInfo = await getWebsiteInfo(domain);

    const headerInfo = await getSecurityHeaders(domain);

    const sslInfo = await getSSLInfo(domain);

    const robotsInfo = await getRobotsInfo(domain);

    const technologyInfo = await detectTechnology(domain);

    const metadataInfo = await getMetadata(domain);

    const whoisInfo = await getWhois(domain);

    return {
        domain: domainInfo,
        website: websiteInfo,
        headers: headerInfo,
        ssl: sslInfo,
        robots: robotsInfo,
        technology: technologyInfo,
        metadata: metadataInfo,
        whois: whoisInfo
    };

};

module.exports = {
    fullScan
};