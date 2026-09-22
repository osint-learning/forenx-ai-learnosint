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
        usage: "WHOIS Practice Tool Help\nUsage: whois <domain>\nDescription: Retrieve official WHOIS domain registration, registrar details, and nameservers.\nExample: whois example.com",
    },
    "whois": {
        command: "whois",
        execute: async (target) => getWhois(target),
        type: "service",
        usage: "WHOIS Practice Tool Help\nUsage: whois <domain>\nDescription: Retrieve official WHOIS domain registration, registrar details, and nameservers.\nExample: whois example.com",
    },
    "DNS Lookup": {
        command: "dns",
        execute: async (target) => getDomainInfo(target),
        type: "service",
        usage: "DNS Lookup Practice Tool Help\nUsage: dns <domain>\nDescription: Query core DNS records including A, MX, NS, and TXT resource records.\nExample: dns example.com",
    },
    "DNS": {
        command: "dns",
        execute: async (target) => getDomainInfo(target),
        type: "service",
        usage: "DNS Lookup Practice Tool Help\nUsage: dns <domain>\nDescription: Query core DNS records including A, MX, NS, and TXT resource records.\nExample: dns example.com",
    },
    "dns": {
        command: "dns",
        execute: async (target) => getDomainInfo(target),
        type: "service",
        usage: "DNS Lookup Practice Tool Help\nUsage: dns <domain>\nDescription: Query core DNS records including A, MX, NS, and TXT resource records.\nExample: dns example.com",
    },
    "Website": {
        command: "website",
        execute: async (target) => getWebsiteInfo(target),
        type: "service",
        usage: "Website Inspector Help\nUsage: website <domain>\nDescription: Inspect HTTP server information, response headers, and page metadata.\nExample: website example.com",
    },
    "website": {
        command: "website",
        execute: async (target) => getWebsiteInfo(target),
        type: "service",
        usage: "Website Inspector Help\nUsage: website <domain>\nDescription: Inspect HTTP server information, response headers, and page metadata.\nExample: website example.com",
    },
    "Security Headers": {
        command: "headers",
        execute: async (target) => getSecurityHeaders(target),
        type: "service",
        usage: "Security Headers Analyzer Help\nUsage: headers <domain>\nDescription: Analyze HTTP security headers (HSTS, CSP, X-Frame-Options, X-Content-Type-Options).\nExample: headers example.com",
    },
    "Headers": {
        command: "headers",
        execute: async (target) => getSecurityHeaders(target),
        type: "service",
        usage: "Security Headers Analyzer Help\nUsage: headers <domain>\nDescription: Analyze HTTP security headers (HSTS, CSP, X-Frame-Options, X-Content-Type-Options).\nExample: headers example.com",
    },
    "headers": {
        command: "headers",
        execute: async (target) => getSecurityHeaders(target),
        type: "service",
        usage: "Security Headers Analyzer Help\nUsage: headers <domain>\nDescription: Analyze HTTP security headers (HSTS, CSP, X-Frame-Options, X-Content-Type-Options).\nExample: headers example.com",
    },
    "SSL": {
        command: "ssl",
        execute: async (target) => getSSLInfo(target),
        type: "service",
        usage: "SSL Certificate Inspector Help\nUsage: ssl <domain>\nDescription: Inspect SSL/TLS certificate validity, issuer, subject, and expiration date.\nExample: ssl example.com",
    },
    "ssl": {
        command: "ssl",
        execute: async (target) => getSSLInfo(target),
        type: "service",
        usage: "SSL Certificate Inspector Help\nUsage: ssl <domain>\nDescription: Inspect SSL/TLS certificate validity, issuer, subject, and expiration date.\nExample: ssl example.com",
    },
    "robots.txt": {
        command: "robots",
        execute: async (target) => getRobotsInfo(target),
        type: "service",
        usage: "Robots.txt Inspector Help\nUsage: robots <domain>\nDescription: Fetch and parse robots.txt to discover crawler directives and hidden paths.\nExample: robots example.com",
    },
    "Robots": {
        command: "robots",
        execute: async (target) => getRobotsInfo(target),
        type: "service",
        usage: "Robots.txt Inspector Help\nUsage: robots <domain>\nDescription: Fetch and parse robots.txt to discover crawler directives and hidden paths.\nExample: robots example.com",
    },
    "robots": {
        command: "robots",
        execute: async (target) => getRobotsInfo(target),
        type: "service",
        usage: "Robots.txt Inspector Help\nUsage: robots <domain>\nDescription: Fetch and parse robots.txt to discover crawler directives and hidden paths.\nExample: robots example.com",
    },
    "Technology": {
        command: "technology",
        execute: async (target) => detectTechnology(target),
        type: "service",
        usage: "Technology Stack Detector Help\nUsage: technology <domain>\nDescription: Detect web frameworks, server software, CMS, and analytics libraries.\nExample: technology example.com",
    },
    "technology": {
        command: "technology",
        execute: async (target) => detectTechnology(target),
        type: "service",
        usage: "Technology Stack Detector Help\nUsage: technology <domain>\nDescription: Detect web frameworks, server software, CMS, and analytics libraries.\nExample: technology example.com",
    },
    "Metadata": {
        command: "metadata",
        execute: async (target) => getMetadata(target),
        type: "service",
        usage: "Metadata Extraction Tool Help\nUsage: metadata <url>\nDescription: Extract document metadata, EXIF tags, and author attributes from files or URLs.\nExample: metadata https://example.com/sample.pdf",
    },
    "metadata": {
        command: "metadata",
        execute: async (target) => getMetadata(target),
        type: "service",
        usage: "Metadata Extraction Tool Help\nUsage: metadata <url>\nDescription: Extract document metadata, EXIF tags, and author attributes from files or URLs.\nExample: metadata https://example.com/sample.pdf",
    },
    "Recon": {
        command: "recon",
        execute: async (target) => fullScan(target),
        type: "service",
        usage: "Reconnaissance Engine Help\nUsage: recon <domain>\nDescription: Run comprehensive automated reconnaissance across DNS, headers, and web stacks.\nExample: recon example.com",
    },
    "recon": {
        command: "recon",
        execute: async (target) => fullScan(target),
        type: "service",
        usage: "Reconnaissance Engine Help\nUsage: recon <domain>\nDescription: Run comprehensive automated reconnaissance across DNS, headers, and web stacks.\nExample: recon example.com",
    },
    "Full Scan": {
        command: "fullscan",
        execute: async (target) => fullScan(target),
        type: "service",
        usage: "Full Scan Engine Help\nUsage: fullscan <domain>\nDescription: Complete multi-engine scan across all OSINT intelligence collectors.\nExample: fullscan example.com",
    },
    "fullscan": {
        command: "fullscan",
        execute: async (target) => fullScan(target),
        type: "service",
        usage: "Full Scan Engine Help\nUsage: fullscan <domain>\nDescription: Complete multi-engine scan across all OSINT intelligence collectors.\nExample: fullscan example.com",
    },
    "nslookup": {
        command: "nslookup",
        execute: async (target) => runNslookup(target),
        type: "cli",
        usage: "nslookup CLI Tool Help\nUsage: nslookup <domain>\nDescription: Perform DNS name server resolution and verify authoritative/non-authoritative responses.\nExample: nslookup example.com",
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
    "Host": {
        command: "host",
        execute: async (target, args) => executeDockerTool("host", args || [target], target),
        type: "docker",
    },
    "host": {
        command: "host",
        execute: async (target, args) => executeDockerTool("host", args || [target], target),
        type: "docker",
    },
    "DNSDumpster": {
        command: "dnsdumpster",
        execute: async (target) => runDnsdumpster(target),
        type: "service",
        usage: "DNSDumpster Practice Tool Help\nUsage: dnsdumpster <domain>\nDescription: Query DNSDumpster for passive DNS mapping, MX records, and infrastructure discovery.\nExample: dnsdumpster example.com",
    },
    "dnsdumpster": {
        command: "dnsdumpster",
        execute: async (target) => runDnsdumpster(target),
        type: "service",
        usage: "DNSDumpster Practice Tool Help\nUsage: dnsdumpster <domain>\nDescription: Query DNSDumpster for passive DNS mapping, MX records, and infrastructure discovery.\nExample: dnsdumpster example.com",
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
        usage: "WhatsMyName Practice Tool Help\nUsage: whatsmyname <username>\nDescription: Enumerate public profile accounts across 500+ online platforms for a given username.\nExample: whatsmyname octocat",
    },
    "whatsmyname": {
        command: "whatsmyname",
        execute: async (target) => runWhatsmyname(target),
        type: "service",
        usage: "WhatsMyName Practice Tool Help\nUsage: whatsmyname <username>\nDescription: Enumerate public profile accounts across 500+ online platforms for a given username.\nExample: whatsmyname octocat",
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
        usage: "Hunter.io Practice Tool Help\nUsage: hunter <domain>\nDescription: Find professional email address patterns and verified contact addresses for a domain.\nExample: hunter example.com",
    },
    "hunter": {
        command: "hunter",
        execute: async (target) => runHunter(target),
        type: "api",
        usage: "Hunter.io Practice Tool Help\nUsage: hunter <domain>\nDescription: Find professional email address patterns and verified contact addresses for a domain.\nExample: hunter example.com",
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
        usage: "Wappalyzer Practice Tool Help\nUsage: wappalyzer <url>\nDescription: Profile web applications to uncover programming languages, analytics, and frameworks.\nExample: wappalyzer https://example.com",
    },
    "wappalyzer": {
        command: "wappalyzer",
        execute: async (target) => runWappalyzer(target),
        type: "service",
        usage: "Wappalyzer Practice Tool Help\nUsage: wappalyzer <url>\nDescription: Profile web applications to uncover programming languages, analytics, and frameworks.\nExample: wappalyzer https://example.com",
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
        usage: "Shodan Practice Tool Help\nUsage: shodan <ip/domain>\nDescription: Search Shodan internet intelligence for open ports, banners, and vulnerabilities.\nExample: shodan 8.8.8.8",
    },
    "shodan": {
        command: "shodan",
        execute: async (target) => runShodan(target),
        type: "api",
        usage: "Shodan Practice Tool Help\nUsage: shodan <ip/domain>\nDescription: Search Shodan internet intelligence for open ports, banners, and vulnerabilities.\nExample: shodan 8.8.8.8",
    },
    "Censys": {
        command: "censys",
        execute: async (target) => runCensys(target),
        type: "api",
        usage: "Censys Practice Tool Help\nUsage: censys <ip/domain>\nDescription: Query Censys for internet-wide scan data, certificate chains, and exposed hosts.\nExample: censys example.com",
    },
    "censys": {
        command: "censys",
        execute: async (target) => runCensys(target),
        type: "api",
        usage: "Censys Practice Tool Help\nUsage: censys <ip/domain>\nDescription: Query Censys for internet-wide scan data, certificate chains, and exposed hosts.\nExample: censys example.com",
    },
    "crt.sh": {
        command: "crtsh",
        execute: async (target) => runCrtsh(target),
        type: "service",
        usage: "crt.sh Practice Tool Help\nUsage: crtsh <domain>\nDescription: Search crt.sh Certificate Transparency logs to discover registered subdomains.\nExample: crtsh example.com",
    },
    "crtsh": {
        command: "crtsh",
        execute: async (target) => runCrtsh(target),
        type: "service",
        usage: "crt.sh Practice Tool Help\nUsage: crtsh <domain>\nDescription: Search crt.sh Certificate Transparency logs to discover registered subdomains.\nExample: crtsh example.com",
    },
    "SecurityTrails": {
        command: "securitytrails",
        execute: async (target) => runSecuritytrails(target),
        type: "api",
        usage: "SecurityTrails Practice Tool Help\nUsage: securitytrails <domain>\nDescription: Explore historical DNS records, current DNS data, and IP infrastructure history.\nExample: securitytrails example.com",
    },
    "securitytrails": {
        command: "securitytrails",
        execute: async (target) => runSecuritytrails(target),
        type: "api",
        usage: "SecurityTrails Practice Tool Help\nUsage: securitytrails <domain>\nDescription: Explore historical DNS records, current DNS data, and IP infrastructure history.\nExample: securitytrails example.com",
    },
    "URLScan.io": {
        command: "urlscan",
        execute: async (target) => runUrlscan(target),
        type: "api",
        usage: "URLScan.io Practice Tool Help\nUsage: urlscan <url>\nDescription: Analyze website behavior, DOM structure, contacted IPs, and threat indicators.\nExample: urlscan https://example.com",
    },
    "urlscan": {
        command: "urlscan",
        execute: async (target) => runUrlscan(target),
        type: "api",
        usage: "URLScan.io Practice Tool Help\nUsage: urlscan <url>\nDescription: Analyze website behavior, DOM structure, contacted IPs, and threat indicators.\nExample: urlscan https://example.com",
    },

    // ==========================================
    // 8. THREAT / HISTORY (DOCKER, API & WEB)
    // ==========================================
    "VirusTotal": {
        command: "virustotal",
        execute: async (target) => runVirustotal(target),
        type: "api",
        usage: "VirusTotal Practice Tool Help\nUsage: virustotal <domain>\nDescription: Query VirusTotal threat intelligence engine for multi-vendor security detections.\nExample: virustotal example.com",
    },
    "virustotal": {
        command: "virustotal",
        execute: async (target) => runVirustotal(target),
        type: "api",
        usage: "VirusTotal Practice Tool Help\nUsage: virustotal <domain>\nDescription: Query VirusTotal threat intelligence engine for multi-vendor security detections.\nExample: virustotal example.com",
    },
    "Have I Been Pwned": {
        command: "hibp",
        execute: async (target) => runHibp(target),
        type: "api",
        usage: "Have I Been Pwned Practice Tool Help\nUsage: hibp <email>\nDescription: Check Have I Been Pwned database for compromised credentials and data breach exposures.\nExample: hibp test@example.com",
    },
    "hibp": {
        command: "hibp",
        execute: async (target) => runHibp(target),
        type: "api",
        usage: "Have I Been Pwned Practice Tool Help\nUsage: hibp <email>\nDescription: Check Have I Been Pwned database for compromised credentials and data breach exposures.\nExample: hibp test@example.com",
    },
    "Wayback Machine": {
        command: "wayback",
        execute: async (target) => runWayback(target),
        type: "service",
        usage: "Wayback Machine Practice Tool Help\nUsage: wayback <domain>\nDescription: Query the Wayback Machine Internet Archive for historical webpage snapshot timestamps.\nExample: wayback example.com",
    },
    "wayback": {
        command: "wayback",
        execute: async (target) => runWayback(target),
        type: "service",
        usage: "Wayback Machine Practice Tool Help\nUsage: wayback <domain>\nDescription: Query the Wayback Machine Internet Archive for historical webpage snapshot timestamps.\nExample: wayback example.com",
    },

    // ==========================================
    // 9. SEARCH / DISCOVERY (WEB SERVICES)
    // ==========================================
    "Google": {
        command: "google",
        execute: async (target) => runGoogle(target),
        type: "service",
        usage: "Google Search Practice Tool Help\nUsage: google <query>\nDescription: Query Google search engine for indexed web pages and OSINT discovery.\nExample: google example.com",
    },
    "google": {
        command: "google",
        execute: async (target) => runGoogle(target),
        type: "service",
        usage: "Google Search Practice Tool Help\nUsage: google <query>\nDescription: Query Google search engine for indexed web pages and OSINT discovery.\nExample: google example.com",
    },
    "Bing": {
        command: "bing",
        execute: async (target) => runBing(target),
        type: "service",
        usage: "Bing Search Practice Tool Help\nUsage: bing <query>\nDescription: Query Microsoft Bing search engine for web intelligence and indexed documents.\nExample: bing example.com",
    },
    "bing": {
        command: "bing",
        execute: async (target) => runBing(target),
        type: "service",
        usage: "Bing Search Practice Tool Help\nUsage: bing <query>\nDescription: Query Microsoft Bing search engine for web intelligence and indexed documents.\nExample: bing example.com",
    },
    "DuckDuckGo": {
        command: "duckduckgo",
        execute: async (target) => runDuckduckgo(target),
        type: "service",
        usage: "DuckDuckGo Practice Tool Help\nUsage: duckduckgo <query>\nDescription: Perform privacy-preserving web search for intelligence discovery.\nExample: duckduckgo cybersecurity OSINT",
    },
    "duckduckgo": {
        command: "duckduckgo",
        execute: async (target) => runDuckduckgo(target),
        type: "service",
        usage: "DuckDuckGo Practice Tool Help\nUsage: duckduckgo <query>\nDescription: Perform privacy-preserving web search for intelligence discovery.\nExample: duckduckgo cybersecurity OSINT",
    },
    "Yandex": {
        command: "yandex",
        execute: async (target) => runYandex(target),
        type: "service",
        usage: "Yandex Search Practice Tool Help\nUsage: yandex <query>\nDescription: Query Yandex search engine for international web discovery and indexed assets.\nExample: yandex example.com",
    },
    "yandex": {
        command: "yandex",
        execute: async (target) => runYandex(target),
        type: "service",
        usage: "Yandex Search Practice Tool Help\nUsage: yandex <query>\nDescription: Query Yandex search engine for international web discovery and indexed assets.\nExample: yandex example.com",
    },
    "Brave Search": {
        command: "brave",
        execute: async (target) => runBrave(target),
        type: "service",
        usage: "Brave Search Practice Tool Help\nUsage: brave <query>\nDescription: Search the independent Brave search index for web content and technical assets.\nExample: brave example.com",
    },
    "brave": {
        command: "brave",
        execute: async (target) => runBrave(target),
        type: "service",
        usage: "Brave Search Practice Tool Help\nUsage: brave <query>\nDescription: Search the independent Brave search index for web content and technical assets.\nExample: brave example.com",
    },
    "Mojeek": {
        command: "mojeek",
        execute: async (target) => runMojeek(target),
        type: "service",
        usage: "Mojeek Search Practice Tool Help\nUsage: mojeek <query>\nDescription: Query Mojeek crawler-based independent search engine.\nExample: mojeek example.com",
    },
    "mojeek": {
        command: "mojeek",
        execute: async (target) => runMojeek(target),
        type: "service",
        usage: "Mojeek Search Practice Tool Help\nUsage: mojeek <query>\nDescription: Query Mojeek crawler-based independent search engine.\nExample: mojeek example.com",
    },
    "Google Dorking": {
        command: "dork",
        execute: async (target) => runGoogledorking(target),
        type: "service",
        usage: "Google Dorking Practice Tool Help\nUsage: dork <dork-query>\nDescription: Execute advanced search operator queries (e.g. site:, inurl:, filetype:).\nExample: dork site:example.com",
    },
    "dork": {
        command: "dork",
        execute: async (target) => runGoogledorking(target),
        type: "service",
        usage: "Google Dorking Practice Tool Help\nUsage: dork <dork-query>\nDescription: Execute advanced search operator queries (e.g. site:, inurl:, filetype:).\nExample: dork site:example.com",
    },
    "Google Lens": {
        command: "lens",
        execute: async (target) => runGooglelens(target),
        type: "service",
        usage: "Google Lens Practice Tool Help\nUsage: lens <image-url>\nDescription: Perform reverse image search and visual entity intelligence extraction.\nExample: lens https://example.com/sample.jpg",
    },
    "lens": {
        command: "lens",
        execute: async (target) => runGooglelens(target),
        type: "service",
        usage: "Google Lens Practice Tool Help\nUsage: lens <image-url>\nDescription: Perform reverse image search and visual entity intelligence extraction.\nExample: lens https://example.com/sample.jpg",
    },
};

module.exports = practiceToolRegistry;
