const { getDomainInfo,getWebsiteInfo,} = require("../reconService");
const { getSecurityHeaders } = require("./headerService");
const { getSSLInfo } = require("./sslService");
const { getRobotsInfo } = require("./robotsService");

const fullScan = async (domain) => {

    const domainInfo = await getDomainInfo(domain);

    const websiteInfo = await getWebsiteInfo(domain);

    const headerInfo = await getSecurityHeaders(domain);

    const sslInfo = await getSSLInfo(domain);

    const robotsInfo = await getRobotsInfo(domain);

    return {
        domain: domainInfo,
        website: websiteInfo,
        headers: headerInfo,
        ssl: sslInfo,
        robots: robotsInfo
    };

};

module.exports = {
    fullScan
};