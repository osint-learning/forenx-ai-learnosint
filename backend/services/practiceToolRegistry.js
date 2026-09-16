const { getSecurityHeaders } = require("./recon/headerService");
const { getSSLInfo } = require("./recon/sslService");
const { getRobotsInfo } = require("./recon/robotsService");
const { fullScan } = require("./recon/scanManager");
const { detectTechnology } = require("./recon/technology/technologyService");
const { getMetadata } = require("./recon/metadata/metadataService");
const { getWhois } = require("./recon/whois/whoisService");
const { runNslookup } = require("./practice/nslookupService");
const {
    getDomainInfo,
    getWebsiteInfo,
} = require("./reconService");

// Import Docker tool execution service
const { executeDockerTool } = require("./dockerToolService");

// Import Web & API practice services
const { runDnsdumpster } = require("./practice/dnsdumpsterService");
const { runWhatsmyname } = require("./practice/whatsmynameService");
const { runHunter } = require("./practice/hunterService");
const { runWappalyzer } = require("./practice/wappalyzerService");
const { runShodan } = require("./practice/shodanService");
const { runCensys } = require("./practice/censysService");
const { runCrtsh } = require("./practice/crtshService");
const { runSecuritytrails } = require("./practice/securitytrailsService");
const { runUrlscan } = require("./practice/urlscanService");
const { runVirustotal } = require("./practice/virustotalService");
const { runHibp } = require("./practice/hibpService");
const { runWayback } = require("./practice/waybackService");
const { runGoogle } = require("./practice/googleService");
const { runBing } = require("./practice/bingService");
const { runDuckduckgo } = require("./practice/duckduckgoService");
const { runYandex } = require("./practice/yandexService");
const { runBrave } = require("./practice/braveService");
const { runMojeek } = require("./practice/mojeekService");
const { runGoogledorking } = require("./practice/googledorkingService");
const { runGooglelens } = require("./practice/googlelensService");

const practiceToolRegistry = {
    // ==========================================
    // EXISTING RECON & NATIVE SERVICES (UNMODIFIED)
    // ==========================================
    "WHOIS": {
        command: "whois",
        execute: async (target) => getWhois(target),
        type: "service",
    },
    "whois": {
        command: "whois",
        execute: async (target) => getWhois(target),
        type: "service",
    },
    "DNS Lookup": {
        command: "dns",
        execute: async (target) => getDomainInfo(target),
        type: "service",
    },
    "DNS": {
        command: "dns",
        execute: async (target) => getDomainInfo(target),
        type: "service",
    },
    "dns": {
        command: "dns",
        execute: async (target) => getDomainInfo(target),
        type: "service",
    },
    "Website": {
        command: "website",
        execute: async (target) => getWebsiteInfo(target),
        type: "service",
    },
    "website": {
        command: "website",
        execute: async (target) => getWebsiteInfo(target),
        type: "service",
    },
    "Security Headers": {
        command: "headers",
        execute: async (target) => getSecurityHeaders(target),
        type: "service",
    },
    "Headers": {
        command: "headers",
        execute: async (target) => getSecurityHeaders(target),
        type: "service",
    },
    "headers": {
        command: "headers",
        execute: async (target) => getSecurityHeaders(target),
        type: "service",
    },
    "SSL": {
        command: "ssl",
        execute: async (target) => getSSLInfo(target),
        type: "service",
    },
    "ssl": {
        command: "ssl",
        execute: async (target) => getSSLInfo(target),
        type: "service",
    },
    "robots.txt": {
        command: "robots",
        execute: async (target) => getRobotsInfo(target),
        type: "service",
    },
    "Robots": {
        command: "robots",
        execute: async (target) => getRobotsInfo(target),
        type: "service",
    },
    "robots": {
        command: "robots",
        execute: async (target) => getRobotsInfo(target),
        type: "service",
    },
    "Technology": {
        command: "technology",
        execute: async (target) => detectTechnology(target),
        type: "service",
    },
    "technology": {
        command: "technology",
        execute: async (target) => detectTechnology(target),
        type: "service",
    },
    "Metadata": {
        command: "metadata",
        execute: async (target) => getMetadata(target),
        type: "service",
    },
    "metadata": {
        command: "metadata",
        execute: async (target) => getMetadata(target),
        type: "service",
    },
    "Recon": {
        command: "recon",
        execute: async (target) => fullScan(target),
        type: "service",
    },
    "recon": {
        command: "recon",
        execute: async (target) => fullScan(target),
        type: "service",
    },
    "Full Scan": {
        command: "fullscan",
        execute: async (target) => fullScan(target),
        type: "service",
    },
    "fullscan": {
        command: "fullscan",
        execute: async (target) => fullScan(target),
        type: "service",
    },
    "nslookup": {
        command: "nslookup",
        execute: async (target) => runNslookup(target),
        type: "cli",
    },

    // ==========================================
    // 1. DNS / DOMAIN CLI TOOLS (DOCKER-BASED)
    // ==========================================
    "dig": {
        command: "dig",
        execute: async (target, args) => executeDockerTool("dig", args || [target], target),
        type: "docker",
    },
    "Dig": {
        command: "dig",
        execute: async (target, args) => executeDockerTool("dig", args || [target], target),
        type: "docker",
    },
    "dnsrecon": {
        command: "dnsrecon",
        execute: async (target, args) => executeDockerTool("dnsrecon", args || [target], target),
        type: "docker",
    },
    "DNSRecon": {
        command: "dnsrecon",
        execute: async (target, args) => executeDockerTool("dnsrecon", args || [target], target),
        type: "docker",
    },
    "dnsenum": {
        command: "dnsenum",
        execute: async (target, args) => executeDockerTool("dnsenum", args || [target], target),
        type: "docker",
    },
    "DNSenum": {
        command: "dnsenum",
        execute: async (target, args) => executeDockerTool("dnsenum", args || [target], target),
        type: "docker",
    },
    "Fierce": {
        command: "fierce",
        execute: async (target, args) => executeDockerTool("fierce", args || [target], target),
        type: "docker",
    },
    "fierce": {
        command: "fierce",
        execute: async (target, args) => executeDockerTool("fierce", args || [target], target),
        type: "docker",
    },
    "DNSDumpster": {
        command: "dnsdumpster",
        execute: async (target) => runDnsdumpster(target),
        type: "service",
    },
    "dnsdumpster": {
        command: "dnsdumpster",
        execute: async (target) => runDnsdumpster(target),
        type: "service",
    },

    // ==========================================
    // 2. SUBDOMAIN CLI TOOLS (DOCKER-BASED)
    // ==========================================
    "Subfinder": {
        command: "subfinder",
        execute: async (target, args) => executeDockerTool("subfinder", args || [target], target),
        type: "docker",
    },
    "subfinder": {
        command: "subfinder",
        execute: async (target, args) => executeDockerTool("subfinder", args || [target], target),
        type: "docker",
    },
    "Amass": {
        command: "amass",
        execute: async (target, args) => executeDockerTool("amass", args || [target], target),
        type: "docker",
    },
    "amass": {
        command: "amass",
        execute: async (target, args) => executeDockerTool("amass", args || [target], target),
        type: "docker",
    },
    "Assetfinder": {
        command: "assetfinder",
        execute: async (target, args) => executeDockerTool("assetfinder", args || [target], target),
        type: "docker",
    },
    "assetfinder": {
        command: "assetfinder",
        execute: async (target, args) => executeDockerTool("assetfinder", args || [target], target),
        type: "docker",
    },

    // ==========================================
    // 3. USERNAME / PEOPLE (DOCKER & WEB)
    // ==========================================
    "Sherlock": {
        command: "sherlock",
        execute: async (target, args) => executeDockerTool("sherlock", args || [target], target),
        type: "docker",
    },
    "sherlock": {
        command: "sherlock",
        execute: async (target, args) => executeDockerTool("sherlock", args || [target], target),
        type: "docker",
    },
    "Maigret": {
        command: "maigret",
        execute: async (target, args) => executeDockerTool("maigret", args || [target], target),
        type: "docker",
    },
    "maigret": {
        command: "maigret",
        execute: async (target, args) => executeDockerTool("maigret", args || [target], target),
        type: "docker",
    },
    "WhatsMyName": {
        command: "whatsmyname",
        execute: async (target) => runWhatsmyname(target),
        type: "service",
    },
    "whatsmyname": {
        command: "whatsmyname",
        execute: async (target) => runWhatsmyname(target),
        type: "service",
    },

    // ==========================================
    // 4. EMAIL (DOCKER & API)
    // ==========================================
    "theHarvester": {
        command: "theharvester",
        execute: async (target, args) => executeDockerTool("theHarvester", args || [target], target),
        type: "docker",
    },
    "theharvester": {
        command: "theharvester",
        execute: async (target, args) => executeDockerTool("theHarvester", args || [target], target),
        type: "docker",
    },
    "Holehe": {
        command: "holehe",
        execute: async (target, args) => executeDockerTool("holehe", args || [target], target),
        type: "docker",
    },
    "holehe": {
        command: "holehe",
        execute: async (target, args) => executeDockerTool("holehe", args || [target], target),
        type: "docker",
    },
    "Hunter.io": {
        command: "hunter",
        execute: async (target) => runHunter(target),
        type: "api",
    },
    "hunter": {
        command: "hunter",
        execute: async (target) => runHunter(target),
        type: "api",
    },

    // ==========================================
    // 5. PHONE (DOCKER)
    // ==========================================
    "PhoneInfoga": {
        command: "phoneinfoga",
        execute: async (target, args) => executeDockerTool("phoneinfoga", args || [target], target),
        type: "docker",
    },
    "phoneinfoga": {
        command: "phoneinfoga",
        execute: async (target, args) => executeDockerTool("phoneinfoga", args || [target], target),
        type: "docker",
    },

    // ==========================================
    // 6. WEB / METADATA (DOCKER & WEB)
    // ==========================================
    "ExifTool": {
        command: "exiftool",
        execute: async (target, args) => executeDockerTool("exiftool", args || [target], target),
        type: "docker",
    },
    "exiftool": {
        command: "exiftool",
        execute: async (target, args) => executeDockerTool("exiftool", args || [target], target),
        type: "docker",
    },
    "WhatWeb": {
        command: "whatweb",
        execute: async (target, args) => executeDockerTool("whatweb", args || [target], target),
        type: "docker",
    },
    "whatweb": {
        command: "whatweb",
        execute: async (target, args) => executeDockerTool("whatweb", args || [target], target),
        type: "docker",
    },
    "Wappalyzer": {
        command: "wappalyzer",
        execute: async (target) => runWappalyzer(target),
        type: "service",
    },
    "wappalyzer": {
        command: "wappalyzer",
        execute: async (target) => runWappalyzer(target),
        type: "service",
    },

    // ==========================================
    // 7. NETWORK / INTERNET INTELLIGENCE (DOCKER & API)
    // ==========================================
    "Nmap": {
        command: "nmap",
        execute: async (target, args) => executeDockerTool("nmap", args || [target], target),
        type: "docker",
    },
    "nmap": {
        command: "nmap",
        execute: async (target, args) => executeDockerTool("nmap", args || [target], target),
        type: "docker",
    },
    "Shodan": {
        command: "shodan",
        execute: async (target) => runShodan(target),
        type: "api",
    },
    "shodan": {
        command: "shodan",
        execute: async (target) => runShodan(target),
        type: "api",
    },
    "Censys": {
        command: "censys",
        execute: async (target) => runCensys(target),
        type: "api",
    },
    "censys": {
        command: "censys",
        execute: async (target) => runCensys(target),
        type: "api",
    },
    "crt.sh": {
        command: "crtsh",
        execute: async (target) => runCrtsh(target),
        type: "service",
    },
    "crtsh": {
        command: "crtsh",
        execute: async (target) => runCrtsh(target),
        type: "service",
    },
    "SecurityTrails": {
        command: "securitytrails",
        execute: async (target) => runSecuritytrails(target),
        type: "api",
    },
    "securitytrails": {
        command: "securitytrails",
        execute: async (target) => runSecuritytrails(target),
        type: "api",
    },
    "URLScan.io": {
        command: "urlscan",
        execute: async (target) => runUrlscan(target),
        type: "api",
    },
    "urlscan": {
        command: "urlscan",
        execute: async (target) => runUrlscan(target),
        type: "api",
    },

    // ==========================================
    // 8. THREAT / HISTORY (DOCKER, API & WEB)
    // ==========================================
    "VirusTotal": {
        command: "virustotal",
        execute: async (target) => runVirustotal(target),
        type: "api",
    },
    "virustotal": {
        command: "virustotal",
        execute: async (target) => runVirustotal(target),
        type: "api",
    },
    "SpiderFoot": {
        command: "spiderfoot",
        execute: async (target, args) => executeDockerTool("spiderfoot", args || [target], target),
        type: "docker",
    },
    "spiderfoot": {
        command: "spiderfoot",
        execute: async (target, args) => executeDockerTool("spiderfoot", args || [target], target),
        type: "docker",
    },
    "Have I Been Pwned": {
        command: "hibp",
        execute: async (target) => runHibp(target),
        type: "api",
    },
    "hibp": {
        command: "hibp",
        execute: async (target) => runHibp(target),
        type: "api",
    },
    "Wayback Machine": {
        command: "wayback",
        execute: async (target) => runWayback(target),
        type: "service",
    },
    "wayback": {
        command: "wayback",
        execute: async (target) => runWayback(target),
        type: "service",
    },

    // ==========================================
    // 9. SEARCH / DISCOVERY (WEB SERVICES)
    // ==========================================
    "Google": {
        command: "google",
        execute: async (target) => runGoogle(target),
        type: "service",
    },
    "google": {
        command: "google",
        execute: async (target) => runGoogle(target),
        type: "service",
    },
    "Bing": {
        command: "bing",
        execute: async (target) => runBing(target),
        type: "service",
    },
    "bing": {
        command: "bing",
        execute: async (target) => runBing(target),
        type: "service",
    },
    "DuckDuckGo": {
        command: "duckduckgo",
        execute: async (target) => runDuckduckgo(target),
        type: "service",
    },
    "duckduckgo": {
        command: "duckduckgo",
        execute: async (target) => runDuckduckgo(target),
        type: "service",
    },
    "Yandex": {
        command: "yandex",
        execute: async (target) => runYandex(target),
        type: "service",
    },
    "yandex": {
        command: "yandex",
        execute: async (target) => runYandex(target),
        type: "service",
    },
    "Brave Search": {
        command: "brave",
        execute: async (target) => runBrave(target),
        type: "service",
    },
    "brave": {
        command: "brave",
        execute: async (target) => runBrave(target),
        type: "service",
    },
    "Mojeek": {
        command: "mojeek",
        execute: async (target) => runMojeek(target),
        type: "service",
    },
    "mojeek": {
        command: "mojeek",
        execute: async (target) => runMojeek(target),
        type: "service",
    },
    "Google Dorking": {
        command: "dork",
        execute: async (target) => runGoogledorking(target),
        type: "service",
    },
    "dork": {
        command: "dork",
        execute: async (target) => runGoogledorking(target),
        type: "service",
    },
    "Google Lens": {
        command: "lens",
        execute: async (target) => runGooglelens(target),
        type: "service",
    },
    "lens": {
        command: "lens",
        execute: async (target) => runGooglelens(target),
        type: "service",
    },
};

module.exports = practiceToolRegistry;
