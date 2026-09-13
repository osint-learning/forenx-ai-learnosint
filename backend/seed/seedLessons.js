const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

const Tool = require("../models/Tool");
const Lesson = require("../models/Lesson");

dotenv.config();

/*
=========================================================
FORENX AI LEARNOSINT
CENTRALIZED LESSON SEEDER
=========================================================

Architecture:

backend/
│
├── lessons/
│   ├── whois.js
│   ├── dns-lookup.js
│   ├── dnsrecon.js
│   ├── sherlock.js
│   └── ...
│
└── seed/
    └── seedLessons.js

Each tool can have its own detailed lesson file.

Example:

WHOIS
  ↓
backend/lessons/whois.js

If an external lesson file exists, it is used.

If it does not exist yet, the old generic lesson
system is used as a temporary fallback.

=========================================================
*/


// =======================================================
// LESSON DIRECTORY
// =======================================================

const LESSONS_DIR = path.join(
  __dirname,
  "../lessons"
);


// =======================================================
// LEGACY TOOL CONTENT
// =======================================================
//
// Keep this section temporarily.
//
// It allows tools that have not yet been migrated to
// continue working.
//
// As we create detailed lesson files for each tool,
// their entries will automatically be replaced.
//
// =======================================================

const TOOL_CONTENT = {

  "WHOIS": {
    purpose:
      "WHOIS is used to retrieve publicly available registration information about Internet domains.",

    howItWorks:
      "WHOIS queries registration databases and returns information such as registrar, registration dates, expiration dates, domain status, and nameservers when available.",

    useCases: [
      "Identifying domain registration details",
      "Investigating infrastructure ownership clues",
      "Checking domain creation and expiration dates",
      "Identifying registrars and nameservers",
      "Pivoting from a domain to additional infrastructure"
    ],

    commands: [
      "whois example.com",
      "whois example.org"
    ],

    workflow:
      "Start with the target domain, perform a WHOIS lookup, record registrar and date information, identify nameservers, compare the information with DNS and certificate data, and preserve the result as evidence.",

    limitations:
      "Privacy protection, proxy registration, incomplete records, registrar differences, and outdated information can reduce attribution confidence.",

    bestPractices:
      "Treat WHOIS as one intelligence source rather than proof of ownership. Correlate registration information with DNS, certificate transparency, historical records, and other independent sources."
  },


  "DNS Lookup": {
    purpose:
      "DNS Lookup is used to retrieve DNS records associated with a domain.",

    howItWorks:
      "DNS resolvers translate domain names into records such as A, AAAA, MX, NS, TXT and CNAME records.",

    useCases: [
      "Finding IP addresses",
      "Identifying mail servers",
      "Discovering nameservers",
      "Finding subdomain relationships",
      "Understanding domain infrastructure"
    ],

    commands: [
      "nslookup example.com",
      "nslookup -type=MX example.com",
      "nslookup -type=NS example.com"
    ],

    workflow:
      "Identify the domain, query common DNS record types, document returned infrastructure, compare records across resolvers, and correlate the results with WHOIS and certificate information.",

    limitations:
      "DNS records may change frequently and some records may be intentionally hidden or protected.",

    bestPractices:
      "Record the query time and record type. Validate important findings using multiple DNS sources when possible."
  },


  "theHarvester": {
    purpose:
      "theHarvester collects publicly available information about domains, including emails, hostnames and related infrastructure.",

    howItWorks:
      "The tool queries supported public search engines and data sources and aggregates discovered information into an investigation-friendly result.",

    useCases: [
      "Email discovery",
      "Hostname discovery",
      "Domain reconnaissance",
      "Initial attack-surface mapping",
      "Passive information gathering"
    ],

    commands: [
      "theHarvester -d example.com -b google",
      "theHarvester -d example.com -b bing",
      "theHarvester -d example.com -b all"
    ],

    workflow:
      "Begin with an authorized domain, select appropriate public sources, collect emails and hostnames, remove duplicates, validate important findings, and pivot to DNS or certificate intelligence.",

    limitations:
      "Results depend on source availability, indexing, rate limits and search-engine changes.",

    bestPractices:
      "Use it as a passive discovery tool and verify important results before drawing conclusions."
  },


  "Sherlock": {
    purpose:
      "Sherlock searches for a username across many public websites.",

    howItWorks:
      "Sherlock tests username patterns against supported websites and reports possible matches.",

    useCases: [
      "Username enumeration",
      "Digital footprint discovery",
      "Social-media research",
      "Identity correlation",
      "Finding potential account reuse"
    ],

    commands: [
      "sherlock username",
      "sherlock username --print-found",
      "sherlock username --timeout 10"
    ],

    workflow:
      "Start with a known username, search supported platforms, collect positive results, inspect profile context, and independently verify whether accounts belong to the same entity.",

    limitations:
      "A matching username does not prove that accounts belong to the same person.",

    bestPractices:
      "Use profile details, timestamps, images, biography information and independent evidence before making attribution claims."
  },


  "VirusTotal": {
    purpose:
      "VirusTotal provides threat-intelligence information about files, URLs, domains and IP addresses.",

    howItWorks:
      "VirusTotal aggregates results from multiple security engines and intelligence sources.",

    useCases: [
      "Domain reputation analysis",
      "IP reputation checking",
      "URL investigation",
      "Malware intelligence",
      "Threat indicator enrichment"
    ],

    commands: [
      "Search a domain in VirusTotal",
      "Search an IP address in VirusTotal",
      "Search a URL in VirusTotal"
    ],

    workflow:
      "Submit or search an indicator, review detections and relationships, examine historical observations, identify related infrastructure, and correlate findings with other intelligence sources.",

    limitations:
      "Detection results can contain false positives and different vendors may disagree.",

    bestPractices:
      "Do not interpret one detection as conclusive evidence. Compare multiple engines and contextual intelligence."
  },


  "nslookup": {
    purpose:
      "nslookup is a command-line DNS query utility.",

    howItWorks:
      "It communicates with DNS servers and retrieves requested DNS records.",

    useCases: [
      "DNS troubleshooting",
      "Domain reconnaissance",
      "IP discovery",
      "Mail-server discovery",
      "Nameserver enumeration"
    ],

    commands: [
      "nslookup example.com",
      "nslookup -type=A example.com",
      "nslookup -type=MX example.com",
      "nslookup -type=TXT example.com"
    ],

    workflow:
      "Query the domain, inspect returned records, document IP addresses and services, and compare results with other DNS tools.",

    limitations:
      "Results depend on the selected DNS resolver and current DNS configuration.",

    bestPractices:
      "Specify record types explicitly when investigating a domain."
  },


  "dig": {
    purpose:
      "dig is a detailed DNS query and troubleshooting utility.",

    howItWorks:
      "dig sends DNS queries and displays detailed responses including answer, authority and additional sections.",

    useCases: [
      "Detailed DNS analysis",
      "Nameserver investigation",
      "DNS troubleshooting",
      "TXT and MX analysis",
      "Infrastructure discovery"
    ],

    commands: [
      "dig example.com",
      "dig example.com A",
      "dig example.com MX",
      "dig example.com NS",
      "dig example.com TXT"
    ],

    workflow:
      "Query important record types, inspect TTL values and authoritative information, compare responses, and document infrastructure changes.",

    limitations:
      "DNS information represents current resolver-visible state and can change over time.",

    bestPractices:
      "Save complete command output and timestamp important findings."
  },


  "dnsrecon": {
    purpose:
      "dnsrecon performs DNS reconnaissance and helps identify records and infrastructure.",

    howItWorks:
      "It performs different DNS queries and enumeration techniques to collect domain information.",

    useCases: [
      "DNS reconnaissance",
      "Nameserver enumeration",
      "Record discovery",
      "Subdomain investigation",
      "Infrastructure mapping"
    ],

    commands: [
      "dnsrecon -d example.com",
      "dnsrecon -d example.com -t std"
    ],

    workflow:
      "Start with the authorized domain, perform standard DNS enumeration, review discovered records, identify interesting hosts, and pivot to additional investigation modules.",

    limitations:
      "Active enumeration can generate traffic and results vary with DNS configuration.",

    bestPractices:
      "Use only against authorized targets and prefer passive methods when possible."
  },


  "dnsenum": {
    purpose:
      "dnsenum automates several DNS enumeration tasks.",

    howItWorks:
      "The utility collects DNS records and attempts supported forms of DNS enumeration.",

    useCases: [
      "DNS mapping",
      "Nameserver analysis",
      "Mail-server discovery",
      "Subdomain discovery",
      "Infrastructure reconnaissance"
    ],

    commands: [
      "dnsenum example.com"
    ],

    workflow:
      "Run DNS enumeration, review records, identify hosts and services, validate results, and build an infrastructure inventory.",

    limitations:
      "Enumeration effectiveness depends on DNS configuration and network restrictions.",

    bestPractices:
      "Validate discovered hosts and avoid treating every returned record as security evidence."
  },


  "Fierce": {
    purpose:
      "Fierce is a DNS reconnaissance tool designed to discover hosts and DNS infrastructure.",

    howItWorks:
      "It uses DNS queries and supported discovery techniques to identify additional hosts related to a domain.",

    useCases: [
      "DNS reconnaissance",
      "Subdomain discovery",
      "Network perimeter mapping",
      "Host discovery"
    ],

    commands: [
      "fierce --domain example.com"
    ],

    workflow:
      "Provide an authorized domain, enumerate DNS information, review discovered hosts, resolve addresses, and correlate infrastructure.",

    limitations:
      "Results depend heavily on DNS exposure and configuration.",

    bestPractices:
      "Keep enumeration within authorized scope and validate every important host."
  },


  "Subfinder": {
    purpose:
      "Subfinder performs fast passive subdomain discovery.",

    howItWorks:
      "It queries supported passive sources and aggregates discovered subdomains.",

    useCases: [
      "Subdomain discovery",
      "Attack-surface mapping",
      "Asset inventory",
      "Reconnaissance"
    ],

    commands: [
      "subfinder -d example.com",
      "subfinder -d example.com -silent"
    ],

    workflow:
      "Start with the root domain, collect passive subdomains, remove duplicates, resolve discovered names, and feed useful assets into subsequent reconnaissance.",

    limitations:
      "Passive sources may contain stale or incomplete information.",

    bestPractices:
      "Resolve and verify important subdomains before considering them active assets."
  },


  "Amass": {
    purpose:
      "Amass provides extensive attack-surface and asset-discovery capabilities.",

    howItWorks:
      "Amass combines multiple discovery techniques and data sources to build relationships between domains, subdomains and infrastructure.",

    useCases: [
      "Large-scale asset discovery",
      "Subdomain enumeration",
      "DNS mapping",
      "Attack-surface analysis"
    ],

    commands: [
      "amass enum -passive -d example.com",
      "amass enum -d example.com"
    ],

    workflow:
      "Define the target scope, perform passive discovery first, analyze relationships, validate assets, and use confirmed assets for deeper investigation.",

    limitations:
      "Comprehensive enumeration can take longer and may generate significant requests.",

    bestPractices:
      "Use passive discovery when possible and clearly separate discovered assets from verified assets."
  },


  "Assetfinder": {
    purpose:
      "Assetfinder discovers domains and subdomains related to a target domain.",

    howItWorks:
      "It searches supported public sources for related domain assets.",

    useCases: [
      "Subdomain discovery",
      "Initial reconnaissance",
      "Asset inventory",
      "Domain pivoting"
    ],

    commands: [
      "assetfinder example.com",
      "assetfinder --subs-only example.com"
    ],

    workflow:
      "Search for related assets, normalize results, remove duplicates, resolve hosts and verify discovered infrastructure.",

    limitations:
      "Public-source coverage can be incomplete.",

    bestPractices:
      "Combine results with other passive discovery tools."
  },


  "Maigret": {
    purpose:
      "Maigret searches for usernames across a large collection of websites.",

    howItWorks:
      "It checks username availability and possible account matches across supported services.",

    useCases: [
      "Username investigation",
      "Digital-footprint analysis",
      "Social-account discovery"
    ],

    commands: [
      "maigret username",
      "maigret username --site Twitter"
    ],

    workflow:
      "Search a known username, inspect positive matches, compare profile attributes, and independently verify identity relationships.",

    limitations:
      "Username similarity is not sufficient for identity attribution.",

    bestPractices:
      "Use multiple independent indicators before linking accounts."
  },


  "WhatsMyName": {
    purpose:
      "WhatsMyName helps identify whether a username exists across online services.",

    howItWorks:
      "It uses service-specific checks to determine potential username presence.",

    useCases: [
      "Username enumeration",
      "Social-media research",
      "Digital footprint discovery"
    ],

    commands: [
      "Search username through the WhatsMyName project",
      "Check discovered usernames manually"
    ],

    workflow:
      "Enter the known username, review potential matches, visit the identified service, and compare profile context.",

    limitations:
      "Username reuse and false matches are common.",

    bestPractices:
      "Treat results as leads that require verification."
  },


  "Holehe": {
    purpose:
      "Holehe checks whether an email address may be associated with accounts on supported online services.",

    howItWorks:
      "It uses public account-recovery or registration behaviors to identify possible account existence.",

    useCases: [
      "Email footprint investigation",
      "Account discovery",
      "Digital identity research"
    ],

    commands: [
      "holehe example@example.com"
    ],

    workflow:
      "Use an authorized email address, run the check, classify returned results, and verify important findings through independent evidence.",

    limitations:
      "Services change their account-verification behavior and false positives are possible.",

    bestPractices:
      "Respect privacy and legal boundaries when investigating email identities."
  },


  "PhoneInfoga": {
    purpose:
      "PhoneInfoga gathers publicly available information about phone numbers.",

    howItWorks:
      "It performs supported passive checks and searches for public information related to a phone number.",

    useCases: [
      "Phone-number reconnaissance",
      "Country and carrier clues",
      "Public footprint discovery"
    ],

    commands: [
      "phoneinfoga scan -n +1234567890",
      "phoneinfoga serve"
    ],

    workflow:
      "Normalize the phone number, perform passive checks, document country and carrier information, search public sources, and correlate findings.",

    limitations:
      "Carrier and location information does not prove the identity or current physical location of a person.",

    bestPractices:
      "Handle phone-number information carefully and only investigate with legitimate authorization."
  },


  "Google Dorking": {
    purpose:
      "Google Dorking uses advanced search operators to locate specific publicly indexed information.",

    howItWorks:
      "Search operators narrow results by domain, file type, title, URL and other indexed attributes.",

    useCases: [
      "Public-document discovery",
      "Website reconnaissance",
      "Finding indexed resources",
      "OSINT research"
    ],

    commands: [
      "site:example.com",
      "site:example.com filetype:pdf",
      "site:example.com intitle:login",
      "site:example.com inurl:admin"
    ],

    workflow:
      "Define the research objective, select appropriate operators, construct focused queries, inspect results, verify relevance, and record useful sources.",

    limitations:
      "Search indexes are incomplete and results can change over time.",

    bestPractices:
      "Use search operators for authorized research and never assume indexed content represents the entire website."
  },


  "Google Lens": {
    purpose:
      "Google Lens provides visual search and image-based discovery capabilities.",

    howItWorks:
      "An image is analyzed to identify visually similar images, objects, text or related web information.",

    useCases: [
      "Image verification",
      "Reverse image investigation",
      "Visual source discovery",
      "Text extraction"
    ],

    commands: [
      "Upload an image to Google Lens",
      "Crop an important region before searching"
    ],

    workflow:
      "Preserve the original image, submit it to visual search, compare visually similar results, inspect dates and sources, and document findings.",

    limitations:
      "Visual similarity does not prove that two images represent the same event or person.",

    bestPractices:
      "Compare multiple sources and preserve original evidence."
  },


  "ExifTool": {
    purpose:
      "ExifTool reads and writes metadata from many file formats.",

    howItWorks:
      "It parses embedded metadata such as timestamps, camera information, file properties and sometimes location data.",

    useCases: [
      "Image metadata analysis",
      "Document metadata analysis",
      "Digital evidence examination",
      "File-property inspection"
    ],

    commands: [
      "exiftool image.jpg",
      "exiftool -a -u -g1 image.jpg",
      "exiftool -GPSLatitude -GPSLongitude image.jpg"
    ],

    workflow:
      "Preserve the original file, calculate a hash if appropriate, extract metadata, identify useful fields, verify timestamps and document findings.",

    limitations:
      "Metadata can be removed, modified or spoofed.",

    bestPractices:
      "Never rely on metadata alone for attribution or timeline conclusions."
  },


  "WhatWeb": {
    purpose:
      "WhatWeb identifies technologies used by websites.",

    howItWorks:
      "It analyzes web responses and fingerprints technologies, frameworks, servers and other identifiable components.",

    useCases: [
      "Technology detection",
      "Web reconnaissance",
      "Infrastructure profiling",
      "Attack-surface understanding"
    ],

    commands: [
      "whatweb https://example.com",
      "whatweb -v https://example.com"
    ],

    workflow:
      "Identify the authorized target, perform technology detection, classify detected technologies, compare with headers and source information, and document confidence.",

    limitations:
      "Technology fingerprinting can produce false positives or incomplete results.",

    bestPractices:
      "Use multiple indicators before concluding that a specific technology is deployed."
  },


  "Wappalyzer": {
    purpose:
      "Wappalyzer identifies technologies and services used by websites.",

    howItWorks:
      "It uses detectable web characteristics to identify frameworks, CMS platforms, analytics tools and other technologies.",

    useCases: [
      "Technology profiling",
      "Web reconnaissance",
      "CMS identification",
      "Infrastructure research"
    ],

    commands: [
      "Open a website with Wappalyzer",
      "Review detected technologies and categories"
    ],

    workflow:
      "Analyze the target website, classify detected technologies, inspect evidence behind detections, and correlate with other reconnaissance findings.",

    limitations:
      "Technology detection is probabilistic and can be affected by proxies and hidden infrastructure.",

    bestPractices:
      "Cross-check important technology findings."
  },


  "Nmap": {
    purpose:
      "Nmap is a network discovery and security auditing tool.",

    howItWorks:
      "Nmap sends network probes to identify hosts, ports and services within an authorized scope.",

    useCases: [
      "Host discovery",
      "Port enumeration",
      "Service identification",
      "Network inventory"
    ],

    commands: [
      "nmap example.com",
      "nmap -sV example.com",
      "nmap -p 80,443 example.com",
      "nmap -Pn example.com"
    ],

    workflow:
      "Define authorization and scope, perform limited discovery, identify open ports, identify services, validate findings and document the results.",

    limitations:
      "Active scanning generates network traffic and can trigger security controls.",

    bestPractices:
      "Only scan systems you are authorized to test."
  },


  "Shodan": {
    purpose:
      "Shodan indexes information about Internet-connected devices and services.",

    howItWorks:
      "Shodan collects publicly observable service information and makes it searchable.",

    useCases: [
      "Internet-exposed asset discovery",
      "Service research",
      "Infrastructure intelligence",
      "Threat intelligence"
    ],

    commands: [
      "Search Shodan for a domain",
      "Search Shodan for an IP address",
      "Search Shodan using service filters"
    ],

    workflow:
      "Search the authorized asset, review observed services, inspect timestamps, identify relationships, and verify important information independently.",

    limitations:
      "Internet observations can become outdated and do not necessarily represent current system state.",

    bestPractices:
      "Treat results as observations rather than guaranteed live configuration."
  },


  "Censys": {
    purpose:
      "Censys provides Internet-wide visibility into hosts, services and certificates.",

    howItWorks:
      "Censys indexes observed Internet infrastructure and provides searchable host and certificate information.",

    useCases: [
      "Host discovery",
      "Certificate research",
      "Internet infrastructure analysis",
      "Attack-surface mapping"
    ],

    commands: [
      "Search Censys for a domain",
      "Search Censys for an IP",
      "Search Censys certificate data"
    ],

    workflow:
      "Identify an asset, search host or certificate information, inspect services, compare observations and correlate with DNS.",

    limitations:
      "Indexed observations may not represent the current state of a system.",

    bestPractices:
      "Use observation timestamps and corroborate important findings."
  },


  "crt.sh": {
    purpose:
      "crt.sh provides access to publicly logged certificate transparency information.",

    howItWorks:
      "Certificate Transparency logs record certificates issued for domains. Searching these records can reveal hostnames appearing in certificates.",

    useCases: [
      "Subdomain discovery",
      "Certificate investigation",
      "Infrastructure mapping",
      "Historical hostname discovery"
    ],

    commands: [
      "Search %.example.com on crt.sh",
      "Search the target domain in certificate records"
    ],

    workflow:
      "Search the domain, collect certificate-associated names, normalize hostnames, resolve them and verify which assets remain active.",

    limitations:
      "Certificate names may refer to old, internal, unused or no-longer-active infrastructure.",

    bestPractices:
      "Treat certificate names as leads and verify their current status."
  },


  "SecurityTrails": {
    purpose:
      "SecurityTrails provides historical and current DNS and domain intelligence.",

    howItWorks:
      "It aggregates DNS and domain-related information and provides historical infrastructure visibility.",

    useCases: [
      "Historical DNS investigation",
      "Subdomain discovery",
      "Infrastructure tracking",
      "Domain intelligence"
    ],

    commands: [
      "Search a domain in SecurityTrails",
      "Review DNS history",
      "Review discovered subdomains"
    ],

    workflow:
      "Search the domain, inspect current and historical records, identify infrastructure changes, and correlate historical observations.",

    limitations:
      "Coverage varies by domain and historical data source.",

    bestPractices:
      "Use timestamps when building an infrastructure timeline."
  },


  "URLScan.io": {
    purpose:
      "URLScan.io analyzes websites and records observations about web pages.",

    howItWorks:
      "A submitted URL is loaded in an analysis environment and information about requests, domains, technologies and page behavior is collected.",

    useCases: [
      "Website investigation",
      "URL analysis",
      "Domain relationship discovery",
      "Web technology research"
    ],

    commands: [
      "Submit an authorized URL to URLScan.io",
      "Search an existing URLScan.io result"
    ],

    workflow:
      "Analyze the URL, inspect requests and contacted domains, review page information, identify relationships and save relevant evidence.",

    limitations:
      "Public scans may expose submitted URLs and results can represent a historical observation.",

    bestPractices:
      "Understand privacy implications before submitting sensitive URLs."
  },


  "Have I Been Pwned": {
    purpose:
      "Have I Been Pwned helps users determine whether email addresses have appeared in known data breaches.",

    howItWorks:
      "The service compares an email address against its breach database and reports known breach exposure.",

    useCases: [
      "Credential exposure awareness",
      "Email footprint investigation",
      "Incident response",
      "Identity risk assessment"
    ],

    commands: [
      "Search an email address using the HIBP website"
    ],

    workflow:
      "Check the authorized email, review breach names and dates, document the exposure, and avoid assuming that breach presence means current compromise.",

    limitations:
      "Absence from the database does not prove that an account has never been compromised.",

    bestPractices:
      "Use breach information for defensive analysis and responsible investigation."
  },


  "Wayback Machine": {
    purpose:
      "The Wayback Machine provides access to historical snapshots of websites.",

    howItWorks:
      "Web pages captured by Internet Archive crawlers can be viewed according to available capture dates.",

    useCases: [
      "Historical website investigation",
      "Content recovery",
      "Timeline reconstruction",
      "Change analysis"
    ],

    commands: [
      "Search a domain in the Wayback Machine",
      "Select a historical capture date"
    ],

    workflow:
      "Identify the target URL, inspect capture dates, compare versions, record meaningful changes and preserve capture URLs and timestamps.",

    limitations:
      "Not every page or date is archived and snapshots may be incomplete.",

    bestPractices:
      "Use multiple snapshots when reconstructing a historical timeline."
  },


  "SpiderFoot": {
    purpose:
      "SpiderFoot automates OSINT collection from many sources.",

    howItWorks:
      "It uses modules to collect information about domains, IP addresses, usernames and other entities.",

    useCases: [
      "Automated reconnaissance",
      "OSINT collection",
      "Relationship discovery",
      "Threat intelligence"
    ],

    commands: [
      "Start SpiderFoot web interface",
      "Create a scan for an authorized domain"
    ],

    workflow:
      "Define the target, select appropriate modules, execute the scan, review relationships, validate high-value findings and export useful evidence.",

    limitations:
      "Automated collection can produce large amounts of noisy or duplicate information.",

    bestPractices:
      "Validate findings and avoid treating automated results as final conclusions."
  },


  "Hunter.io": {
    purpose:
      "Hunter helps discover and analyze publicly associated professional email addresses for domains.",

    howItWorks:
      "It aggregates public information and domain-related email patterns.",

    useCases: [
      "Business email discovery",
      "Domain research",
      "Contact intelligence",
      "Organization mapping"
    ],

    commands: [
      "Search a domain in Hunter",
      "Search a professional email address"
    ],

    workflow:
      "Identify the organization domain, search available email information, classify results, verify addresses through public sources and record confidence.",

    limitations:
      "Email information can become outdated and may not represent current employment.",

    bestPractices:
      "Use only publicly available information and respect privacy."
  },


  "Google": {
    purpose:
      "Google Search is a general-purpose search engine that can serve as a major OSINT discovery source.",

    howItWorks:
      "Google indexes publicly accessible web content and ranks results based on relevance and other signals.",

    useCases: [
      "General OSINT research",
      "Document discovery",
      "News research",
      "Website investigation",
      "Search-engine pivoting"
    ],

    commands: [
      "Search a domain",
      "Use quoted phrases",
      "Use site: filters",
      "Use filetype: filters"
    ],

    workflow:
      "Define the research question, create focused queries, compare results, verify sources, record URLs and timestamps, and pivot into specialized tools.",

    limitations:
      "Search results are not a complete representation of the Internet.",

    bestPractices:
      "Use multiple queries and independent sources."
  },


  "Bing": {
    purpose:
      "Bing is a search engine useful for general web and OSINT research.",

    howItWorks:
      "Bing indexes web content and provides ranked search results.",

    useCases: [
      "Web research",
      "Document discovery",
      "Domain research",
      "Cross-search validation"
    ],

    commands: [
      "Search a domain",
      "Use site:example.com",
      "Search exact phrases"
    ],

    workflow:
      "Create focused queries, compare results with other search engines, verify information and record useful sources.",

    limitations:
      "Search coverage differs from other search engines.",

    bestPractices:
      "Cross-check important findings using multiple search engines."
  },


  "DuckDuckGo": {
    purpose:
      "DuckDuckGo is a privacy-focused search engine useful for independent OSINT searching.",

    howItWorks:
      "It provides web search results while emphasizing privacy-oriented search behavior.",

    useCases: [
      "Independent web research",
      "Cross-engine verification",
      "Privacy-conscious searching"
    ],

    commands: [
      "Search an exact phrase",
      "site:example.com",
      "filetype:pdf example"
    ],

    workflow:
      "Construct the research query, inspect results, compare against other search engines and verify important information.",

    limitations:
      "Search coverage and ranking can differ from other search engines.",

    bestPractices:
      "Use it as a complementary search source rather than a single source of truth."
  },


  "Yandex": {
    purpose:
      "Yandex provides search capabilities that can be useful for multilingual and visual OSINT research.",

    howItWorks:
      "The search engine indexes web content and supports specialized search capabilities.",

    useCases: [
      "Multilingual research",
      "Image research",
      "Cross-engine searching",
      "Regional web discovery"
    ],

    commands: [
      "Search an exact phrase",
      "Search a domain",
      "Use image search"
    ],

    workflow:
      "Define the research objective, search using relevant language and operators, compare results and verify sources.",

    limitations:
      "Regional indexing and ranking can affect results.",

    bestPractices:
      "Use multiple engines for broader coverage."
  },


  "Brave Search": {
    purpose:
      "Brave Search provides an independent search experience useful for OSINT research.",

    howItWorks:
      "It provides web search results through its search infrastructure and indexing systems.",

    useCases: [
      "General OSINT research",
      "Search diversification",
      "Independent result comparison"
    ],

    commands: [
      "Search an exact phrase",
      "Search a domain",
      "Search file types"
    ],

    workflow:
      "Construct focused queries, inspect results, compare sources and document relevant findings.",

    limitations:
      "Search coverage differs from other engines.",

    bestPractices:
      "Cross-check significant information."
  },


  "Mojeek": {
    purpose:
      "Mojeek is an independent search engine that can provide an additional perspective for OSINT research.",

    howItWorks:
      "It maintains its own search index and returns web results for submitted queries.",

    useCases: [
      "Search diversification",
      "Independent web research",
      "Cross-engine comparison"
    ],

    commands: [
      "Search an exact phrase",
      "Search a domain",
      "Search a keyword combination"
    ],

    workflow:
      "Search the target information, compare results with larger search engines, validate sources and record useful discoveries.",

    limitations:
      "Its index may be smaller than larger search engines.",

    bestPractices:
      "Use it as a complementary source."
  }

};


// =======================================================
// EXTERNAL LESSON FILE MAP
// =======================================================
//
// Tool database name → lesson file
//
// IMPORTANT:
// The filename does NOT have to exactly match the tool
// name.
//
// =======================================================

const LESSON_FILE_MAP = {
  "WHOIS": "whois.js",
  "DNS Lookup": "dnslookup.js",
  "theHarvester": "theharvester.js",
  "Sherlock": "sherlock.js",
  "VirusTotal": "virustotal.js",
  "nslookup": "nslookup.js",
  "dig": "dig.js",
  "dnsrecon": "dnsrecon.js",
  "dnsenum": "dnsenum.js",
  "Fierce": "fierce.js",
  "Subfinder": "subfinder.js",
  "Amass": "amass.js",
  "Assetfinder": "assetfinder.js",
  "Maigret": "maigret.js",
  "WhatsMyName": "whatsmyname.js",
  "Holehe": "holehe.js",
  "PhoneInfoga": "phoneinfoga.js",
  "Google Dorking": "googledorking.js",
  "Google Lens": "googlelens.js",
  "ExifTool": "exiftool.js",
  "WhatWeb": "whatweb.js",
  "Wappalyzer": "wappalyzer.js",
  "Nmap": "nmap.js",
  "Shodan": "shodan.js",
  "Censys": "censys.js",
  "crt.sh": "crtsh.js",
  "SecurityTrails": "securitytrails.js",
  "URLScan.io": "urlscan.js",
  "Have I Been Pwned": "hibp.js",
  "Wayback Machine": "wayback.js",
  "SpiderFoot": "spiderfoot.js",
  "Hunter.io": "hunter.js",
  "Google": "google.js",
  "Bing": "bing.js",
  "DuckDuckGo": "duckduckgo.js",
  "Yandex": "yandex.js",
  "Brave Search": "bravesearch.js",
  "Mojeek": "mojeek.js",
  "DNSDumpster": "dnsdumpster.js",
};


// =======================================================
// LOAD EXTERNAL LESSON FILE
// =======================================================

function loadExternalLessons(toolName) {

  const filename = LESSON_FILE_MAP[toolName];

  if (!filename) {
    return null;
  }

  const lessonPath = path.join(
    LESSONS_DIR,
    filename
  );


  // File does not exist yet
  if (!fs.existsSync(lessonPath)) {
    return null;
  }


  try {

    // Remove cached version.
    //
    // This is useful during development when the seeder
    // is executed multiple times.

    delete require.cache[
      require.resolve(lessonPath)
    ];


    const lessons = require(lessonPath);


    if (!Array.isArray(lessons)) {

      console.error(
        `❌ ${filename} must export an array`
      );

      return null;
    }


    if (lessons.length === 0) {

      console.error(
        `⚠️ ${filename} contains no lessons`
      );

      return null;
    }


    return lessons;

  } catch (error) {

    console.error(
      `❌ Error loading ${filename}`
    );

    console.error(error.message);

    return null;
  }
}


// =======================================================
// LEGACY GENERIC LESSON GENERATOR
// =======================================================
//
// This remains only as a fallback.
//
// Once every tool gets its own lesson file, this function
// can be deleted completely.
//
// =======================================================

function createLessons(tool) {

  const c = TOOL_CONTENT[tool.name];


  if (!c) {
    return [];
  }


  return [

    // ===================================================
    // LESSON 1
    // ===================================================

    {
      lessonNumber: 1,

      title:
        `Introduction to ${tool.name}`,

      shortDescription:
        `Understand what ${tool.name} is, how it works, and its role in OSINT investigations.`,

      objectives: [
        `Understand the purpose of ${tool.name}`,
        `Understand how ${tool.name} works`,
        `Identify common OSINT use cases`,
        `Understand the role of ${tool.name} in an investigation`
      ],

      content: `

<h2>What is ${tool.name}?</h2>

<p>
${c.purpose}
</p>

<h3>How It Works</h3>

<p>
${c.howItWorks}
</p>

<h3>Why Is It Useful in OSINT?</h3>

<p>
OSINT investigations rarely depend on a single source.
Investigators normally begin with a known entity such as
a domain, username, email address, IP address, phone number,
image or URL and then perform a sequence of information
collection and verification steps.
</p>

<p>
${tool.name} can be used as one stage in that process.
Its output should normally be treated as an intelligence lead
that can be correlated with other independent sources.
</p>

<h3>Common Use Cases</h3>

<ul>
${c.useCases
  .map(x => `<li>${x}</li>`)
  .join("")}
</ul>

<h3>Investigation Mindset</h3>

<p>
The goal of an OSINT tool is not simply to produce a large
amount of data. The investigator must determine whether the
information is relevant, reliable, current and connected to
the investigation objective.
</p>

<p>
Always distinguish between
<strong>observation</strong>,
<strong>interpretation</strong> and
<strong>conclusion</strong>.
</p>

`,

      keyPoints: [
        c.purpose,
        "Tool output should be verified.",
        "Use multiple independent intelligence sources.",
        "Record important findings with timestamps."
      ],

      example: `

<p>
Example investigation:
</p>

<ol>

<li>Identify the target.</li>

<li>Use ${tool.name} to collect relevant information.</li>

<li>Record important observations.</li>

<li>Identify possible pivots.</li>

<li>Verify findings using another source.</li>

<li>Preserve the evidence and timestamp.</li>

</ol>

`,

      estimatedTime: 15,

      difficulty: "Beginner",

      order: 1
    },


    // ===================================================
    // LESSON 2
    // ===================================================

    {
      lessonNumber: 2,

      title:
        `${tool.name} Installation and Setup`,

      shortDescription:
        `Learn how to prepare ${tool.name} and verify that it is working correctly.`,

      objectives: [
        "Understand installation requirements",
        "Prepare the environment",
        "Verify successful installation",
        "Understand common setup problems"
      ],

      content: `

<h2>Preparing ${tool.name}</h2>

<p>
Before using an OSINT tool, the environment should be
prepared correctly. Installation requirements depend on
whether the tool is a command-line utility, web service,
browser-based platform or external API.
</p>

<h3>Environment Preparation</h3>

<ul>

<li>Use a supported operating system.</li>

<li>Install required dependencies.</li>

<li>Use the official project or service whenever possible.</li>

<li>Keep tools updated.</li>

<li>Test the installation with a harmless authorized target.</li>

</ul>

<h3>Verification</h3>

<p>
After installation, verify that the application starts
successfully and that its basic functionality works before
beginning an investigation.
</p>

<h3>Troubleshooting</h3>

<ul>

<li>Check whether the command is available in PATH.</li>

<li>Verify dependencies and runtime versions.</li>

<li>Check network connectivity.</li>

<li>Check API credentials when required.</li>

<li>Read the tool's error message carefully.</li>

</ul>

<h3>Security Considerations</h3>

<p>
Never install unknown binaries from untrusted sources.
Prefer official documentation and repositories and verify
downloaded software where appropriate.
</p>

`,

      keyPoints: [
        "Prepare dependencies before execution.",
        "Verify installation before investigation.",
        "Prefer official sources.",
        "Keep tools updated."
      ],

      example: `

<p>Setup workflow:</p>

<ol>

<li>Install ${tool.name}.</li>

<li>Confirm that it starts.</li>

<li>Test basic functionality.</li>

<li>Verify network/API access if required.</li>

<li>Perform the first investigation only against an authorized target.</li>

</ol>

`,

      estimatedTime: 15,

      difficulty: "Beginner",

      order: 2
    },


    // ===================================================
    // LESSON 3
    // ===================================================

    {
      lessonNumber: 3,

      title:
        `${tool.name} Commands and Usage`,

      shortDescription:
        `Learn practical commands and understand what their output means.`,

      objectives: [
        "Understand basic syntax",
        "Execute common commands",
        "Read tool output",
        "Identify useful investigation pivots"
      ],

      content: `

<h2>Basic Usage</h2>

<p>
The following examples demonstrate typical ways
${tool.name} can be used during an OSINT investigation.
</p>

<h3>Common Commands / Actions</h3>

<pre><code>${c.commands.join("\n")}</code></pre>

<h3>Understanding the Output</h3>

<p>
Do not immediately treat every returned value as a confirmed
fact. Separate useful observations from assumptions.
</p>

<p>
For every interesting result ask:
</p>

<ul>

<li>What exactly did the tool observe?</li>

<li>When was the information collected?</li>

<li>Where did the information originate?</li>

<li>Can the result be independently verified?</li>

<li>Does it support the investigation objective?</li>

</ul>

<h3>Example Workflow</h3>

<ol>

<li>Define the target.</li>

<li>Run the basic query.</li>

<li>Review the output.</li>

<li>Extract high-value indicators.</li>

<li>Perform a second lookup.</li>

<li>Compare the results.</li>

<li>Save important evidence.</li>

</ol>

<h3>Beginner Tip</h3>

<p>
Start with the simplest command or search. Once the basic
result is understood, gradually introduce advanced options.
</p>

`,

      keyPoints: [
        "Start with simple queries.",
        "Understand every important field in the output.",
        "Save useful results.",
        "Verify important findings."
      ],

      example: `

<p>Sample commands/actions:</p>

<ul>

${c.commands
  .map(x => `<li><code>${x}</code></li>`)
  .join("")}

</ul>

<p>
Expected investigation behavior:
run one query, inspect the result, identify useful indicators,
then pivot to another independent source.
</p>

`,

      estimatedTime: 20,

      difficulty: "Beginner",

      order: 3
    },


    // ===================================================
    // LESSON 4
    // ===================================================

    {
      lessonNumber: 4,

      title:
        `${tool.name} Investigation Workflow`,

      shortDescription:
        `Learn how to integrate ${tool.name} into a complete OSINT investigation.`,

      objectives: [
        "Build an investigation workflow",
        "Correlate tool results",
        "Evaluate evidence confidence",
        "Identify useful pivots"
      ],

      content: `

<h2>Using ${tool.name} in an Investigation</h2>

<p>
A professional OSINT investigation is normally performed
as a sequence of collection, validation, correlation and
documentation steps.
</p>

<h3>Recommended Workflow</h3>

<ol>

<li>
<strong>Define the objective:</strong>
Clearly identify what you need to determine.
</li>

<li>
<strong>Define the target:</strong>
Identify the domain, account, IP, email, URL or other entity.
</li>

<li>
<strong>Collect:</strong>
Use ${tool.name} to obtain relevant information.
</li>

<li>
<strong>Extract:</strong>
Identify useful indicators and relationships.
</li>

<li>
<strong>Pivot:</strong>
Use discovered indicators in another OSINT source.
</li>

<li>
<strong>Correlate:</strong>
Compare independent findings.
</li>

<li>
<strong>Validate:</strong>
Check whether important findings remain consistent.
</li>

<li>
<strong>Document:</strong>
Record evidence, timestamps and sources.
</li>

<li>
<strong>Conclude:</strong>
State only what the available evidence supports.
</li>

</ol>

<h3>Correlation Example</h3>

<p>
${c.workflow}
</p>

<h3>Evidence Confidence</h3>

<p>
Confidence should increase when independent sources produce
consistent observations. A single unverified result should
normally receive lower confidence than a finding supported
by several independent sources.
</p>

<h3>Investigation Principle</h3>

<p>
A useful OSINT investigator does not ask only:
<strong>"What did the tool find?"</strong>
</p>

<p>
The investigator also asks:
<strong>
"How reliable is the finding, what does it mean, and what
should I verify next?"
</strong>
</p>

`,

      keyPoints: [
        "Define an investigation objective.",
        "Collect before interpreting.",
        "Correlate independent sources.",
        "Document evidence and timestamps.",
        "Do not overstate conclusions."
      ],

      example: `

<pre><code>
Target
   ↓
${tool.name}
   ↓
Initial Finding
   ↓
Independent Verification
   ↓
Correlation
   ↓
Confidence Assessment
   ↓
Evidence
   ↓
Conclusion
</code></pre>

`,

      estimatedTime: 25,

      difficulty: "Intermediate",

      order: 4
    },


    // ===================================================
    // LESSON 5
    // ===================================================

    {
      lessonNumber: 5,

      title:
        `${tool.name} Limitations, Mistakes and Best Practices`,

      shortDescription:
        `Learn how to avoid common mistakes and use ${tool.name} responsibly.`,

      objectives: [
        "Understand tool limitations",
        "Identify common investigation mistakes",
        "Apply verification techniques",
        "Follow responsible OSINT practices"
      ],

      content: `

<h2>Limitations</h2>

<p>
${c.limitations}
</p>

<h3>Common Mistakes</h3>

<ul>

<li>Assuming every result is accurate.</li>

<li>Ignoring the collection date.</li>

<li>Failing to verify important information.</li>

<li>Confusing correlation with proof.</li>

<li>Collecting information without a clear investigation objective.</li>

<li>Ignoring legal and ethical boundaries.</li>

</ul>

<h3>Best Practices</h3>

<p>
${c.bestPractices}
</p>

<ul>

<li>Use multiple sources.</li>

<li>Record timestamps.</li>

<li>Preserve original evidence where appropriate.</li>

<li>Separate facts from assumptions.</li>

<li>Assign confidence to important findings.</li>

<li>Keep investigations within authorized scope.</li>

</ul>

<h3>Ethics and Legal Considerations</h3>

<p>
OSINT uses publicly available information, but public
availability does not automatically mean unrestricted use.
Investigators should respect privacy, terms of service,
applicable law, organizational policies and the defined
scope of an investigation.
</p>

<h3>Final Checklist</h3>

<ul>

<li>Did I define my objective?</li>

<li>Did I use an authorized target?</li>

<li>Did I record the source?</li>

<li>Did I record when the information was collected?</li>

<li>Did I verify important findings?</li>

<li>Did I distinguish evidence from assumptions?</li>

</ul>

`,

      keyPoints: [
        c.limitations,
        "Verify important results.",
        "Respect legal and ethical boundaries.",
        "Use evidence-based conclusions."
      ],

      example: `

<p>
Before reporting a finding from ${tool.name}:
</p>

<ol>

<li>Check the original source.</li>

<li>Check the collection date.</li>

<li>Find an independent source.</li>

<li>Compare the information.</li>

<li>Assign a confidence level.</li>

<li>Record the evidence.</li>

<li>Report only what the evidence supports.</li>

</ol>

`,

      estimatedTime: 20,

      difficulty: "Intermediate",

      order: 5
    }

  ];
}


// =======================================================
// LESSON VALIDATION
// =======================================================

function validateLessons(toolName, lessons) {

  if (!Array.isArray(lessons)) {

    throw new Error(
      `${toolName}: lessons must be an array`
    );
  }


  if (lessons.length === 0) {

    throw new Error(
      `${toolName}: lesson array is empty`
    );
  }


  lessons.forEach((lesson, index) => {

    if (!lesson.lessonNumber) {

      throw new Error(
        `${toolName}: lesson ${index + 1} is missing lessonNumber`
      );
    }


    if (!lesson.title) {

      throw new Error(
        `${toolName}: lesson ${lesson.lessonNumber} is missing title`
      );
    }


    if (!lesson.content) {

      throw new Error(
        `${toolName}: lesson ${lesson.lessonNumber} is missing content`
      );
    }


    if (!Array.isArray(lesson.objectives)) {

      throw new Error(
        `${toolName}: lesson ${lesson.lessonNumber} objectives must be an array`
      );
    }


    if (!Array.isArray(lesson.keyPoints)) {

      throw new Error(
        `${toolName}: lesson ${lesson.lessonNumber} keyPoints must be an array`
      );
    }

  });

}


// =======================================================
// GET LESSONS FOR TOOL
// =======================================================

function getLessonsForTool(tool) {

  // -----------------------------------------------------
  // FIRST:
  // Try dedicated external lesson file.
  // -----------------------------------------------------

  const externalLessons =
    loadExternalLessons(tool.name);


  if (externalLessons) {

    validateLessons(
      tool.name,
      externalLessons
    );


    return {
      lessons: externalLessons,
      source: "external"
    };
  }


  // -----------------------------------------------------
  // SECOND:
  // Fall back to legacy content.
  // -----------------------------------------------------

  const legacyLessons =
    createLessons(tool);


  if (legacyLessons.length > 0) {

    validateLessons(
      tool.name,
      legacyLessons
    );


    return {
      lessons: legacyLessons,
      source: "legacy"
    };
  }


  // -----------------------------------------------------
  // No lesson content.
  // -----------------------------------------------------

  return {
    lessons: [],
    source: "none"
  };
}


// =======================================================
// SEED FUNCTION
// =======================================================

const seedLessons = async () => {

  try {

    // ===================================================
    // CONNECT DATABASE
    // ===================================================

    await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log(
      "✅ MongoDB Connected"
    );


    // ===================================================
    // FIND TOOLS
    // ===================================================

    const tools =
      await Tool.find({});


    console.log(
      `🔎 Found ${tools.length} tools`
    );


    console.log(
      `📂 Lesson directory: ${LESSONS_DIR}`
    );


    // ===================================================
    // CHECK LESSON DIRECTORY
    // ===================================================

    if (!fs.existsSync(LESSONS_DIR)) {

      fs.mkdirSync(
        LESSONS_DIR,
        {
          recursive: true
        }
      );

      console.log(
        "📁 Created lessons directory"
      );
    }


    // ===================================================
    // COUNTERS
    // ===================================================

    let totalLessons = 0;

    let externalTools = 0;

    let legacyTools = 0;

    let skippedTools = 0;


    // ===================================================
    // PROCESS EVERY TOOL
    // ===================================================

    for (const tool of tools) {

      console.log(
        "\n----------------------------------------"
      );

      console.log(
        `🛠️ Processing: ${tool.name}`
      );


      // -------------------------------------------------
      // GET LESSON CONTENT
      // -------------------------------------------------

      const result =
        getLessonsForTool(tool);


      const lessons =
        result.lessons;


      // -------------------------------------------------
      // NO LESSONS
      // -------------------------------------------------

      if (
        !lessons ||
        lessons.length === 0
      ) {

        console.log(
          `⚠️ No lesson content found for: ${tool.name}`
        );

        skippedTools++;

        continue;
      }


      // -------------------------------------------------
      // REPORT SOURCE
      // -------------------------------------------------

      if (
        result.source === "external"
      ) {

        externalTools++;

        console.log(
          `📚 Source: backend/lessons/${LESSON_FILE_MAP[tool.name]}`
        );

      } else {

        legacyTools++;

        console.log(
          "⚠️ Source: Legacy generic lesson generator"
        );
      }


      // -------------------------------------------------
      // DELETE EXISTING LESSONS
      // -------------------------------------------------

      await Lesson.deleteMany({
        tool: tool._id
      });


      console.log(
        "🗑️ Old lessons removed"
      );


      // -------------------------------------------------
      // CREATE DOCUMENTS
      // -------------------------------------------------

      const lessonDocuments =
        lessons.map((lesson) => ({

          tool: tool._id,

          lessonNumber:
            lesson.lessonNumber,

          title:
            lesson.title,

          shortDescription:
            lesson.shortDescription || "",

          objectives:
            lesson.objectives || [],

          content:
            lesson.content || "",

          keyPoints:
            lesson.keyPoints || [],

          example:
            lesson.example || "",

          estimatedTime:
            typeof lesson.estimatedTime === "string"
                ? parseInt(lesson.estimatedTime, 10)
                : Number(lesson.estimatedTime) || 0,

          order:
            lesson.order ||
            lesson.lessonNumber,

          difficulty:
            lesson.difficulty ||
            "Beginner",

          isPublished:
            lesson.isPublished !== undefined
              ? lesson.isPublished
              : true

        }));


      // -------------------------------------------------
      // INSERT LESSONS
      // -------------------------------------------------

      await Lesson.insertMany(
        lessonDocuments
      );


      totalLessons +=
        lessonDocuments.length;


      console.log(
        `✅ ${tool.name}: ${lessonDocuments.length} lessons created`
      );

    }


    // ===================================================
    // FINAL SUMMARY
    // ===================================================

    console.log(
      "\n========================================"
    );

    console.log(
      "🎓 LESSON SEEDING COMPLETED"
    );

    console.log(
      "========================================"
    );

    console.log(
      `🛠️ Tools found: ${tools.length}`
    );

    console.log(
      `📚 Total lessons created: ${totalLessons}`
    );

    console.log(
      `📁 External lesson tools: ${externalTools}`
    );

    console.log(
      `⚠️ Legacy fallback tools: ${legacyTools}`
    );

    console.log(
      `⏭️ Tools skipped: ${skippedTools}`
    );

    console.log(
      "========================================"
    );


    // ===================================================
    // DATABASE DISCONNECT
    // ===================================================

    await mongoose.disconnect();


    console.log(
      "🔌 MongoDB Disconnected"
    );


    process.exit(0);

  } catch (error) {

    console.error(
      "\n❌ Lesson seeding failed:"
    );

    console.error(
      error
    );


    try {

      await mongoose.disconnect();

    } catch (disconnectError) {

      console.error(
        "⚠️ MongoDB disconnect error:",
        disconnectError.message
      );

    }


    process.exit(1);
  }
};


// =======================================================
// RUN SEEDER
// =======================================================

seedLessons();