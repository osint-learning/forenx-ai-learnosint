const dns = require("dns").promises;
const whois = require("whois-json");

const getDomainInfo = async (domain) => {
    const result = {};

    try {
        const addresses = await dns.lookup(domain, { all: true });
        result.ipAddresses = addresses.map(ip => ip.address);
    } catch {
        result.ipAddresses = [];
    }

    try {
        result.mxRecords = await dns.resolveMx(domain);
    } catch {
        result.mxRecords = [];
    }

    try {
        result.nameServers = await dns.resolveNs(domain);
    } catch {
        result.nameServers = [];
    }

    try {
        result.txtRecords = await dns.resolveTxt(domain);
    } catch {
        result.txtRecords = [];
    }

    try {
        result.whois = await whois(domain);
    } catch {
        result.whois = {};
    }

    return result;
};

const axios = require("axios");
const cheerio = require("cheerio");

const getWebsiteInfo = async (domain) => {
    const url = domain.startsWith("http")
        ? domain
        : `https://${domain}`;

    const start = Date.now();

    try {
        const response = await axios.get(url, {
            timeout: 10000,
            maxRedirects: 5,
            validateStatus: () => true,
        });

        const responseTime = Date.now() - start;

        const $ = cheerio.load(response.data);

        return {
            url,
            finalUrl: response.request?.res?.responseUrl || url,
            statusCode: response.status,
            responseTime,
            title: $("title").text().trim(),
            server: response.headers.server || "Unknown",
            poweredBy: response.headers["x-powered-by"] || "Unknown",
            contentType: response.headers["content-type"] || "Unknown",
            contentLength: response.headers["content-length"] || "Unknown",
        };
    } catch (error) {
        return {
            url,
            error: error.message,
        };
    }
};

module.exports = {
    getDomainInfo,
    getWebsiteInfo,
};
