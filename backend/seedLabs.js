const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Lab = require("./models/Lab");
const connectDB = require("./config/db");

dotenv.config();

const allLabs = [
    // =========================================
    // 1. WHOIS PRACTICE LAB (DO NOT TOUCH)
    // =========================================
    {
        title: "Domain Registration Intelligence (WHOIS)",
        description: "Investigate domain ownership, registrar records, and lifecycle dates using live WHOIS lookup.",
        tool: "WHOIS",
        category: "Domain Intelligence",
        difficulty: "Easy",
        target: "example.com",
        missionBrief: "Perform a live WHOIS lookup on example.com and analyze domain registry records.",
        requiredCommand: "whois",
        objectives: [
            { question: "Run the whois command against the target domain.", type: "command", expectedField: "whois", answer: "", completed: false },
            { question: "What is the Registrar of the domain?", type: "answer", expectedField: "registrar", answer: "", completed: false },
            { question: "What is the Creation / Registration Date of the domain?", type: "answer", expectedField: "creationDate", answer: "", completed: false },
            { question: "Name one of the Name Servers responsible for the domain.", type: "answer", expectedField: "nameServer", answer: "", completed: false },
        ],
        hints: ["Type 'whois example.com' in the terminal.", "Check the WHOIS structured output block for Registrar and Name Servers."],
        xpReward: 100,
        isActive: true,
    },

    // =========================================
    // 2. NSLOOKUP PRACTICE LAB (DO NOT TOUCH)
    // =========================================
    {
        title: "DNS Resolution Investigation (nslookup)",
        description: "Perform authoritative and non-authoritative DNS resolution using Windows nslookup.",
        tool: "nslookup",
        category: "DNS Intelligence",
        difficulty: "Easy",
        target: "example.com",
        missionBrief: "Resolve example.com DNS records through Google Public DNS (8.8.8.8) using nslookup.",
        requiredCommand: "nslookup",
        objectives: [
            { question: "Run the nslookup command against the target domain.", type: "command", expectedField: "nslookup", answer: "", completed: false },
            { question: "What is the DNS server used for resolution?", type: "answer", expectedField: "server", answer: "", completed: false },
            { question: "Identify one resolved IP address for the target domain.", type: "answer", expectedField: "addresses", answer: "", completed: false },
            { question: "Was the response authoritative or non-authoritative?", type: "answer", expectedField: "responseType", answer: "", completed: false },
        ],
        hints: ["Run 'nslookup example.com'", "Inspect Server and Non-authoritative answer sections."],
        xpReward: 100,
        isActive: true,
    },

    // =========================================
    // 3. DNS LOOKUP PRACTICE LAB
    // =========================================
    {
        title: "Core DNS Records Discovery",
        description: "Analyze core DNS records (A, MX, NS, TXT) across standard resolvers.",
        tool: "DNS Lookup",
        category: "DNS Intelligence",
        difficulty: "Easy",
        target: "example.com",
        missionBrief: "Query multi-record DNS configuration for example.com to map network infrastructure.",
        requiredCommand: "dns",
        objectives: [
            { question: "Run the dns command on the target domain.", type: "command", expectedField: "dns", answer: "", completed: false },
            { question: "Confirm the queried domain name.", type: "answer", expectedField: "domain", answer: "", completed: false },
            { question: "Identify one IPv4 address (A record) for the domain.", type: "answer", expectedField: "a", answer: "", completed: false },
            { question: "Identify one authoritative name server (NS record) for the domain.", type: "answer", expectedField: "ns", answer: "", completed: false },
        ],
        hints: ["Run 'dns example.com'", "Check the DNS records list."],
        xpReward: 100,
        isActive: true,
    },

    // =========================================
    // 4. DIG PRACTICE LAB
    // =========================================
    {
        title: "Low-Level DNS Interrogation (dig)",
        description: "Perform low-level DNS packet queries and header inspections using dig.",
        tool: "dig",
        category: "DNS Intelligence",
        difficulty: "Easy",
        target: "example.com",
        missionBrief: "Interrogate the target domain DNS zone using the dig utility.",
        requiredCommand: "dig",
        objectives: [
            { question: "Execute dig against the target domain.", type: "command", expectedField: "dig", answer: "", completed: false },
            { question: "Confirm the queried target domain.", type: "answer", expectedField: "target", answer: "", completed: false },
            { question: "Identify the DNS resolver server used for the query.", type: "answer", expectedField: "server", answer: "", completed: false },
            { question: "Identify one DNS record answer returned in the response.", type: "answer", expectedField: "answers", answer: "", completed: false },
        ],
        hints: ["Run 'dig example.com'", "Check SERVER and Answer sections in the dig output."],
        xpReward: 100,
        isActive: true,
    },

    // =========================================
    // 5. DNSRECON PRACTICE LAB
    // =========================================
    {
        title: "Automated DNS Zone Reconnaissance (dnsrecon)",
        description: "Extract nameservers, mail exchangers, and zone records using dnsrecon.",
        tool: "dnsrecon",
        category: "DNS Intelligence",
        difficulty: "Medium",
        target: "example.com",
        missionBrief: "Run dnsrecon to enumerate zone information and locate infrastructure records.",
        requiredCommand: "dnsrecon",
        objectives: [
            { question: "Execute dnsrecon against the target domain.", type: "command", expectedField: "dnsrecon", answer: "", completed: false },
            { question: "Confirm the investigated domain.", type: "answer", expectedField: "domain", answer: "", completed: false },
            { question: "Identify one authoritative name server discovered.", type: "answer", expectedField: "nameservers", answer: "", completed: false },
            { question: "Identify one DNS record extracted during enumeration.", type: "answer", expectedField: "records", answer: "", completed: false },
        ],
        hints: ["Run 'dnsrecon example.com'", "Inspect NS and A record outputs."],
        xpReward: 120,
        isActive: true,
    },

    // =========================================
    // 6. DNSENUM PRACTICE LAB
    // =========================================
    {
        title: "DNS Enumeration & Subnet Scrutiny (dnsenum)",
        description: "Enumerate DNS records, MX hosts, and subdomains using dnsenum.",
        tool: "dnsenum",
        category: "DNS Intelligence",
        difficulty: "Medium",
        target: "example.com",
        missionBrief: "Perform comprehensive DNS enumeration to identify mail servers and subdomains.",
        requiredCommand: "dnsenum",
        objectives: [
            { question: "Execute dnsenum against the target domain.", type: "command", expectedField: "dnsenum", answer: "", completed: false },
            { question: "Confirm the investigated target domain.", type: "answer", expectedField: "domain", answer: "", completed: false },
            { question: "Identify one authoritative name server for the target.", type: "answer", expectedField: "nameServers", answer: "", completed: false },
            { question: "Identify one mail (MX) server responsible for domain mail.", type: "answer", expectedField: "mailServers", answer: "", completed: false },
        ],
        hints: ["Run 'dnsenum example.com'", "Check Name Servers and Mail (MX) Servers in output."],
        xpReward: 120,
        isActive: true,
    },

    // =========================================
    // 7. FIERCE PRACTICE LAB
    // =========================================
    {
        title: "Targeted Domain Asset Mapping (Fierce)",
        description: "Locate contiguous IP space and subdomains using Fierce domain scanner.",
        tool: "Fierce",
        category: "DNS Intelligence",
        difficulty: "Medium",
        target: "example.com",
        missionBrief: "Execute Fierce against the target domain to locate zone assets and nameservers.",
        requiredCommand: "fierce",
        objectives: [
            { question: "Execute Fierce against the target domain.", type: "command", expectedField: "fierce", answer: "", completed: false },
            { question: "Confirm the investigated target domain.", type: "answer", expectedField: "domain", answer: "", completed: false },
            { question: "Identify one authoritative name server listed in the output.", type: "answer", expectedField: "nameServers", answer: "", completed: false },
            { question: "Identify one discovered subdomain in the target domain.", type: "answer", expectedField: "subdomains", answer: "", completed: false },
        ],
        hints: ["Run 'fierce example.com'", "Inspect NS and Found sections."],
        xpReward: 120,
        isActive: true,
    },

    // =========================================
    // 8. DNSDUMPSTER PRACTICE LAB
    // =========================================
    {
        title: "Visual DNS Map & Service Mapping (DNSDumpster)",
        description: "Query DNSDumpster web records to extract mail servers and host records.",
        tool: "DNSDumpster",
        category: "DNS Intelligence",
        difficulty: "Easy",
        target: "example.com",
        missionBrief: "Gather public DNS reconnaissance records via DNSDumpster web service.",
        requiredCommand: "dnsdumpster",
        objectives: [
            { question: "Execute DNSDumpster reconnaissance against the target domain.", type: "command", expectedField: "dnsdumpster", answer: "", completed: false },
            { question: "Confirm the target domain being mapped.", type: "answer", expectedField: "domain", answer: "", completed: false },
            { question: "Identify one DNS name server (NS record) associated with the domain.", type: "answer", expectedField: "dnsServers", answer: "", completed: false },
            { question: "Identify one MX mail exchanger host configured for the domain.", type: "answer", expectedField: "mxRecords", answer: "", completed: false },
        ],
        hints: ["Run 'dnsdumpster example.com'", "Review DNS Servers and MX Records."],
        xpReward: 100,
        isActive: true,
    },

    // =========================================
    // 9. SUBFINDER PRACTICE LAB
    // =========================================
    {
        title: "Passive Subdomain Discovery (Subfinder)",
        description: "Enumerate valid subdomains passively using ProjectDiscovery Subfinder.",
        tool: "Subfinder",
        category: "Subdomain Enumeration",
        difficulty: "Easy",
        target: "example.com",
        missionBrief: "Fast passive subdomain enumeration across passive OSINT sources.",
        requiredCommand: "subfinder",
        objectives: [
            { question: "Execute Subfinder against the target domain.", type: "command", expectedField: "subfinder", answer: "", completed: false },
            { question: "Confirm the target domain analyzed.", type: "answer", expectedField: "domain", answer: "", completed: false },
            { question: "Identify one discovered subdomain from the passive results.", type: "answer", expectedField: "subdomains", answer: "", completed: false },
            { question: "Identify the total count of subdomains discovered.", type: "answer", expectedField: "count", answer: "", completed: false },
        ],
        hints: ["Run 'subfinder example.com'", "Review the discovered subdomains list."],
        xpReward: 100,
        isActive: true,
    },

    // =========================================
    // 10. AMASS PRACTICE LAB
    // =========================================
    {
        title: "Attack Surface Mapping (OWASP Amass)",
        description: "Map target domain attack surface and subdomains using OWASP Amass.",
        tool: "Amass",
        category: "Subdomain Enumeration",
        difficulty: "Hard",
        target: "example.com",
        missionBrief: "Run Amass passive mapping to discover network infrastructure and assets.",
        requiredCommand: "amass",
        objectives: [
            { question: "Execute Amass enumeration against the target domain.", type: "command", expectedField: "amass", answer: "", completed: false },
            { question: "Confirm the domain under investigation.", type: "answer", expectedField: "domain", answer: "", completed: false },
            { question: "Identify one discovered subdomain in the asset map.", type: "answer", expectedField: "subdomains", answer: "", completed: false },
            { question: "Identify the total count of discovered names.", type: "answer", expectedField: "count", answer: "", completed: false },
        ],
        hints: ["Run 'amass example.com'", "Inspect the asset and subdomain output."],
        xpReward: 150,
        isActive: true,
    },

    // =========================================
    // 11. ASSETFINDER PRACTICE LAB
    // =========================================
    {
        title: "Fast Asset Discovery (Assetfinder)",
        description: "Find related domains and subdomains using tomnomnom's assetfinder.",
        tool: "Assetfinder",
        category: "Subdomain Enumeration",
        difficulty: "Easy",
        target: "example.com",
        missionBrief: "Discover subdomains and related domain assets using assetfinder.",
        requiredCommand: "assetfinder",
        objectives: [
            { question: "Execute Assetfinder against the target domain.", type: "command", expectedField: "assetfinder", answer: "", completed: false },
            { question: "Confirm the analyzed target domain.", type: "answer", expectedField: "domain", answer: "", completed: false },
            { question: "Identify one discovered subdomain or domain asset.", type: "answer", expectedField: "subdomains", answer: "", completed: false },
            { question: "Identify the total count of discovered asset entries.", type: "answer", expectedField: "count", answer: "", completed: false },
        ],
        hints: ["Run 'assetfinder example.com'", "Examine the subdomains list."],
        xpReward: 100,
        isActive: true,
    },

    // =========================================
    // 12. SHERLOCK PRACTICE LAB
    // =========================================
    {
        title: "Cross-Platform Username Hunting (Sherlock)",
        description: "Search for target usernames across hundreds of social networks with Sherlock.",
        tool: "Sherlock",
        category: "Username Investigation",
        difficulty: "Medium",
        target: "octocat",
        missionBrief: "Investigate target username presence across public social platforms.",
        requiredCommand: "sherlock",
        objectives: [
            { question: "Execute Sherlock with the target username.", type: "command", expectedField: "sherlock", answer: "", completed: false },
            { question: "Confirm the target username that was investigated.", type: "answer", expectedField: "username", answer: "", completed: false },
            { question: "Identify one platform where an account was found/claimed.", type: "answer", expectedField: "matches", answer: "", completed: false },
            { question: "Identify the total number of claimed accounts found.", type: "answer", expectedField: "count", answer: "", completed: false },
        ],
        hints: ["Run 'sherlock octocat'", "Look at the MATCH accounts reported."],
        xpReward: 120,
        isActive: true,
    },

    // =========================================
    // 13. MAIGRET PRACTICE LAB
    // =========================================
    {
        title: "Deep Profile Dossier Collection (Maigret)",
        description: "Collect online profiles and dossiers from username traces with Maigret.",
        tool: "Maigret",
        category: "Username Investigation",
        difficulty: "Hard",
        target: "octocat",
        missionBrief: "Run Maigret to extract account links and profile associations.",
        requiredCommand: "maigret",
        objectives: [
            { question: "Execute Maigret against the target username.", type: "command", expectedField: "maigret", answer: "", completed: false },
            { question: "Confirm the investigated username.", type: "answer", expectedField: "username", answer: "", completed: false },
            { question: "Identify one platform or site where a matching profile was detected.", type: "answer", expectedField: "matches", answer: "", completed: false },
            { question: "Identify the number of matched profiles found for the user.", type: "answer", expectedField: "count", answer: "", completed: false },
        ],
        hints: ["Run 'maigret octocat'", "Inspect claimed accounts in Maigret output."],
        xpReward: 150,
        isActive: true,
    },

    // =========================================
    // 14. WHATSMYNAME PRACTICE LAB
    // =========================================
    {
        title: "Fast Username Web Footprint (WhatsMyName)",
        description: "Probe web platforms using WhatsMyName profile signatures.",
        tool: "WhatsMyName",
        category: "Username Investigation",
        difficulty: "Easy",
        target: "octocat",
        missionBrief: "Probe web platforms for public username accounts using signature matching.",
        requiredCommand: "whatsmyname",
        objectives: [
            { question: "Execute WhatsMyName for the target username.", type: "command", expectedField: "whatsmyname", answer: "", completed: false },
            { question: "Confirm the target username evaluated in the query.", type: "answer", expectedField: "username", answer: "", completed: false },
            { question: "Identify one platform where a public account was found.", type: "answer", expectedField: "matches", answer: "", completed: false },
            { question: "Identify the count of matching platform accounts identified.", type: "answer", expectedField: "count", answer: "", completed: false },
        ],
        hints: ["Run 'whatsmyname octocat'", "Check MATCH entries in the output."],
        xpReward: 100,
        isActive: true,
    },

    // =========================================
    // 15. THEHARVESTER PRACTICE LAB
    // =========================================
    {
        title: "Passive Email & Host Harvester (theHarvester)",
        description: "Gather emails, subdomains, and employee names across public engines.",
        tool: "theHarvester",
        category: "Email Investigation",
        difficulty: "Medium",
        target: "example.com",
        missionBrief: "Collect employee emails and domain hosts using theHarvester.",
        requiredCommand: "theharvester",
        objectives: [
            { question: "Execute theHarvester against the target domain.", type: "command", expectedField: "theharvester", answer: "", completed: false },
            { question: "Confirm the target domain being investigated.", type: "answer", expectedField: "domain", answer: "", completed: false },
            { question: "Identify one discovered hostname associated with the domain.", type: "answer", expectedField: "hosts", answer: "", completed: false },
            { question: "Identify one IP address discovered during the search.", type: "answer", expectedField: "ips", answer: "", completed: false },
        ],
        hints: ["Run 'theharvester example.com'", "Inspect Hosts and IPs sections."],
        xpReward: 120,
        isActive: true,
    },

    // =========================================
    // 16. HOLEHE PRACTICE LAB
    // =========================================
    {
        title: "Email Account Registration Probing (Holehe)",
        description: "Detect registered accounts for a target email across major services.",
        tool: "Holehe",
        category: "Email Investigation",
        difficulty: "Easy",
        target: "test@example.com",
        missionBrief: "Probe password recovery and login endpoints for registered accounts via Holehe.",
        requiredCommand: "holehe",
        objectives: [
            { question: "Execute Holehe against the target email address.", type: "command", expectedField: "holehe", answer: "", completed: false },
            { question: "Confirm the target email address investigated.", type: "answer", expectedField: "email", answer: "", completed: false },
            { question: "Identify one registered service associated with this email.", type: "answer", expectedField: "matches", answer: "", completed: false },
            { question: "Identify the count of registered services discovered.", type: "answer", expectedField: "count", answer: "", completed: false },
        ],
        hints: ["Run 'holehe test@example.com'", "Look for claimed service accounts in the output."],
        xpReward: 100,
        isActive: true,
    },

    // =========================================
    // 17. HUNTER.IO PRACTICE LAB
    // =========================================
    {
        title: "Corporate Email Pattern & Deliverability (Hunter.io)",
        description: "Analyze corporate email formats and verified employee addresses with Hunter.io.",
        tool: "Hunter.io",
        category: "Email Investigation",
        difficulty: "Easy",
        target: "example.com",
        missionBrief: "Query Hunter.io API to identify email formats and employee contact records.",
        requiredCommand: "hunter",
        objectives: [
            { question: "Execute Hunter.io intelligence on the target domain.", type: "command", expectedField: "hunter", answer: "", completed: false },
            { question: "Confirm the target domain being inspected.", type: "answer", expectedField: "domain", answer: "", completed: false },
            { question: "Identify the organization name associated with the domain.", type: "answer", expectedField: "organization", answer: "", completed: false },
            { question: "Identify the estimated email address pattern (e.g. {first}.{last}).", type: "answer", expectedField: "pattern", answer: "", completed: false },
        ],
        hints: ["Run 'hunter example.com'", "Check Organization and Email Pattern in the report."],
        xpReward: 100,
        isActive: true,
    },

    // =========================================
    // 18. PHONEINFOGA PRACTICE LAB
    // =========================================
    {
        title: "International Telecom & Carrier Scrutiny (PhoneInfoga)",
        description: "Validate international phone numbers, carrier assignments, and line types.",
        tool: "PhoneInfoga",
        category: "Phone Investigation",
        difficulty: "Medium",
        target: "+14155552671",
        missionBrief: "Investigate carrier and country origin details for an international phone number.",
        requiredCommand: "phoneinfoga",
        objectives: [
            { question: "Execute PhoneInfoga against the target phone number.", type: "command", expectedField: "phoneinfoga", answer: "", completed: false },
            { question: "Confirm the analyzed phone number.", type: "answer", expectedField: "phone", answer: "", completed: false },
            { question: "Identify the country associated with the phone number.", type: "answer", expectedField: "country", answer: "", completed: false },
            { question: "Identify the carrier reported for the phone number.", type: "answer", expectedField: "carrier", answer: "", completed: false },
        ],
        hints: ["Run 'phoneinfoga +14155552671'", "Check Country and Carrier in the output."],
        xpReward: 120,
        isActive: true,
    },

    // =========================================
    // 19. EXIFTOOL PRACTICE LAB
    // =========================================
    {
        title: "Digital Media Metadata Extraction (ExifTool)",
        description: "Extract hidden EXIF, camera, timestamp, and device metadata from file assets.",
        tool: "ExifTool",
        category: "Metadata Investigation",
        difficulty: "Easy",
        target: "uploads/sample.jpg",
        missionBrief: "Analyze an image asset to extract camera metadata, MIME type, and file size.",
        requiredCommand: "exiftool",
        objectives: [
            { question: "Execute ExifTool against the target asset.", type: "command", expectedField: "exiftool", answer: "", completed: false },
            { question: "Identify the file name of the analyzed asset.", type: "answer", expectedField: "fileName", answer: "", completed: false },
            { question: "Identify the MIME Type detected for the asset.", type: "answer", expectedField: "mimeType", answer: "", completed: false },
            { question: "Identify the reported file size of the asset.", type: "answer", expectedField: "fileSize", answer: "", completed: false },
        ],
        hints: ["Run 'exiftool uploads/sample.jpg'", "Review File Name, MIME Type, and File Size in output."],
        xpReward: 100,
        isActive: true,
    },

    // =========================================
    // 20. WHATWEB PRACTICE LAB
    // =========================================
    {
        title: "Next-Gen Web Technology Fingerprinting (WhatWeb)",
        description: "Fingerprint web servers, CMS systems, embedded scripts, and HTTP headers.",
        tool: "WhatWeb",
        category: "Web Reconnaissance",
        difficulty: "Easy",
        target: "example.com",
        missionBrief: "Scan target website using WhatWeb to uncover server software and technologies.",
        requiredCommand: "whatweb",
        objectives: [
            { question: "Execute WhatWeb scanning on the target domain.", type: "command", expectedField: "whatweb", answer: "", completed: false },
            { question: "Identify the HTTP status code returned by the server (e.g. 200).", type: "answer", expectedField: "statusCode", answer: "", completed: false },
            { question: "Identify the web page Title extracted by WhatWeb.", type: "answer", expectedField: "title", answer: "", completed: false },
            { question: "Identify the Web Server software or technology detected.", type: "answer", expectedField: "server", answer: "", completed: false },
        ],
        hints: ["Run 'whatweb example.com'", "Inspect Status Code, Title, and Server in output."],
        xpReward: 100,
        isActive: true,
    },

    // =========================================
    // 21. WAPPALYZER PRACTICE LAB
    // =========================================
    {
        title: "Web Stack & Framework Profiling (Wappalyzer)",
        description: "Profile web applications to detect JavaScript libraries, CDNs, and UI frameworks.",
        tool: "Wappalyzer",
        category: "Web Reconnaissance",
        difficulty: "Easy",
        target: "example.com",
        missionBrief: "Perform technology profiling against a target website to catalog framework usage.",
        requiredCommand: "wappalyzer",
        objectives: [
            { question: "Execute Wappalyzer analysis against the target website.", type: "command", expectedField: "wappalyzer", answer: "", completed: false },
            { question: "Confirm the target domain being profiled.", type: "answer", expectedField: "target", answer: "", completed: false },
            { question: "Identify one detected technology or software package.", type: "answer", expectedField: "technologies", answer: "", completed: false },
            { question: "Identify one technology category identified in the scan.", type: "answer", expectedField: "categories", answer: "", completed: false },
        ],
        hints: ["Run 'wappalyzer example.com'", "Review Detected Technologies and Categories."],
        xpReward: 100,
        isActive: true,
    },

    // =========================================
    // 22. NMAP PRACTICE LAB
    // =========================================
    {
        title: "Network Port & Service Discovery (Nmap)",
        description: "Scan network hosts to identify listening ports and active network services.",
        tool: "Nmap",
        category: "Network Intelligence",
        difficulty: "Medium",
        target: "example.com",
        missionBrief: "Run an Nmap fast scan against the target host to locate exposed ports.",
        requiredCommand: "nmap",
        objectives: [
            { question: "Execute Nmap port scanning against the target domain.", type: "command", expectedField: "nmap", answer: "", completed: false },
            { question: "Identify the resolved IP address of the target host.", type: "answer", expectedField: "ip", answer: "", completed: false },
            { question: "Identify one open port number discovered on the host (e.g. 80 or 443).", type: "answer", expectedField: "openPorts", answer: "", completed: false },
            { question: "Identify the service name associated with an open port (e.g. http or https).", type: "answer", expectedField: "services", answer: "", completed: false },
        ],
        hints: ["Run 'nmap example.com'", "Inspect Host IP, Open Ports, and Services."],
        xpReward: 120,
        isActive: true,
    },

    // =========================================
    // 23. SHODAN PRACTICE LAB
    // =========================================
    {
        title: "Internet Device & Service Intelligence (Shodan)",
        description: "Search Shodan's global scanning index for open ports, banners, and vulnerabilities.",
        tool: "Shodan",
        category: "Threat Intelligence",
        difficulty: "Medium",
        target: "example.com",
        missionBrief: "Query Shodan host intelligence to review open ports and network banners.",
        requiredCommand: "shodan",
        objectives: [
            { question: "Execute Shodan intelligence lookup for the target domain.", type: "command", expectedField: "shodan", answer: "", completed: false },
            { question: "Identify the target IP address analyzed by Shodan.", type: "answer", expectedField: "ip", answer: "", completed: false },
            { question: "Identify one open port reported in the host intelligence report.", type: "answer", expectedField: "ports", answer: "", completed: false },
            { question: "Identify one hostname associated with the IP address.", type: "answer", expectedField: "hostnames", answer: "", completed: false },
        ],
        hints: ["Run 'shodan example.com'", "Inspect IP, Open Ports, and Hostnames."],
        xpReward: 120,
        isActive: true,
    },

    // =========================================
    // 24. CENSYS PRACTICE LAB
    // =========================================
    {
        title: "Global Attack Surface Search (Censys)",
        description: "Query Censys database for certificates, exposed services, and protocols.",
        tool: "Censys",
        category: "Threat Intelligence",
        difficulty: "Hard",
        target: "example.com",
        missionBrief: "Perform a Censys intelligence scan to identify observed services and protocols.",
        requiredCommand: "censys",
        objectives: [
            { question: "Execute Censys intelligence scan on the target domain.", type: "command", expectedField: "censys", answer: "", completed: false },
            { question: "Identify the IP address of the target asset.", type: "answer", expectedField: "ip", answer: "", completed: false },
            { question: "Identify one observed service running on the asset (e.g. 80/UNKNOWN).", type: "answer", expectedField: "services", answer: "", completed: false },
            { question: "Identify one protocol detected during the scan.", type: "answer", expectedField: "protocols", answer: "", completed: false },
        ],
        hints: ["Run 'censys example.com'", "Review IP, Observed Services, and Protocols."],
        xpReward: 150,
        isActive: true,
    },

    // =========================================
    // 25. CRT.SH PRACTICE LAB
    // =========================================
    {
        title: "Certificate Transparency Log Analysis (crt.sh)",
        description: "Search public CT logs on crt.sh to uncover historic and hidden subdomains.",
        tool: "crt.sh",
        category: "Subdomain Enumeration",
        difficulty: "Easy",
        target: "example.com",
        missionBrief: "Search public Certificate Transparency logs for SSL/TLS certificates.",
        requiredCommand: "crtsh",
        objectives: [
            { question: "Execute crt.sh Certificate Transparency search on the target domain.", type: "command", expectedField: "crtsh", answer: "", completed: false },
            { question: "Identify one discovered subdomain from the CT logs.", type: "answer", expectedField: "subdomains", answer: "", completed: false },
            { question: "Identify one certificate issuer organization or authority.", type: "answer", expectedField: "issuers", answer: "", completed: false },
            { question: "Identify the total count of discovered subdomains.", type: "answer", expectedField: "count", answer: "", completed: false },
        ],
        hints: ["Run 'crtsh example.com'", "Inspect the discovered subdomains and issuers list."],
        xpReward: 100,
        isActive: true,
    },

    // =========================================
    // 26. SECURITYTRAILS PRACTICE LAB
    // =========================================
    {
        title: "Historical DNS & Infrastructure Intelligence (SecurityTrails)",
        description: "Query current and historical DNS records and IP associations with SecurityTrails.",
        tool: "SecurityTrails",
        category: "DNS Intelligence",
        difficulty: "Medium",
        target: "example.com",
        missionBrief: "Query SecurityTrails API to review DNS infrastructure and authoritative nameservers.",
        requiredCommand: "securitytrails",
        objectives: [
            { question: "Execute SecurityTrails infrastructure lookup on the target domain.", type: "command", expectedField: "securitytrails", answer: "", completed: false },
            { question: "Confirm the target domain being inspected.", type: "answer", expectedField: "domain", answer: "", completed: false },
            { question: "Identify one current name server associated with the domain.", type: "answer", expectedField: "nameservers", answer: "", completed: false },
            { question: "Identify one IP address from the A Records section.", type: "answer", expectedField: "records", answer: "", completed: false },
        ],
        hints: ["Run 'securitytrails example.com'", "Check Name Servers and A Records."],
        xpReward: 120,
        isActive: true,
    },

    // =========================================
    // 27. URLSCAN.IO PRACTICE LAB
    // =========================================
    {
        title: "Automated Website Sandbox & URL Scanning (URLScan.io)",
        description: "Analyze web requests, IPs, and DOM structures recorded by URLScan.io.",
        tool: "URLScan.io",
        category: "Web Reconnaissance",
        difficulty: "Easy",
        target: "example.com",
        missionBrief: "Query URLScan.io public database to inspect website requests and hosting IPs.",
        requiredCommand: "urlscan",
        objectives: [
            { question: "Execute URLScan.io search for the target domain.", type: "command", expectedField: "urlscan", answer: "", completed: false },
            { question: "Confirm the target domain scanned.", type: "answer", expectedField: "target", answer: "", completed: false },
            { question: "Identify one hosting IP address reported by URLScan.io.", type: "answer", expectedField: "ips", answer: "", completed: false },
            { question: "Identify one country code where the asset is hosted.", type: "answer", expectedField: "countries", answer: "", completed: false },
        ],
        hints: ["Run 'urlscan example.com'", "Inspect Observed IPs and Countries."],
        xpReward: 100,
        isActive: true,
    },

    // =========================================
    // 28. VIRUSTOTAL PRACTICE LAB
    // =========================================
    {
        title: "Multi-Engine Threat & Domain Reputation (VirusTotal)",
        description: "Assess domain risk, malware flags, and reputation using VirusTotal API.",
        tool: "VirusTotal",
        category: "Threat Intelligence",
        difficulty: "Easy",
        target: "example.com",
        missionBrief: "Query VirusTotal multi-scanner dataset to determine reputation status.",
        requiredCommand: "virustotal",
        objectives: [
            { question: "Execute VirusTotal threat assessment on the target domain.", type: "command", expectedField: "virustotal", answer: "", completed: false },
            { question: "Confirm the target domain being inspected.", type: "answer", expectedField: "target", answer: "", completed: false },
            { question: "Identify the overall reputation status (e.g. clean).", type: "answer", expectedField: "reputation", answer: "", completed: false },
            { question: "Identify the number of harmless vendor detections.", type: "answer", expectedField: "harmless", answer: "", completed: false },
        ],
        hints: ["Run 'virustotal example.com'", "Check Reputation and Harmless Detections."],
        xpReward: 100,
        isActive: true,
    },

    // =========================================
    // 29. SPIDERFOOT PRACTICE LAB
    // =========================================
    {
        title: "Automated OSINT Intelligence Gathering (SpiderFoot)",
        description: "Execute automated multi-source OSINT correlation using SpiderFoot.",
        tool: "SpiderFoot",
        category: "Reconnaissance Engine",
        difficulty: "Hard",
        target: "example.com",
        missionBrief: "Launch SpiderFoot scanning to correlate domains, entities, and IP addresses.",
        requiredCommand: "spiderfoot",
        objectives: [
            { question: "Execute SpiderFoot reconnaissance against the target domain.", type: "command", expectedField: "spiderfoot", answer: "", completed: false },
            { question: "Confirm the target domain analyzed by SpiderFoot.", type: "answer", expectedField: "target", answer: "", completed: false },
            { question: "Identify the number of active modules executed during the scan.", type: "answer", expectedField: "moduleCount", answer: "", completed: false },
            { question: "Identify the count of distinct entities discovered.", type: "answer", expectedField: "entitiesFound", answer: "", completed: false },
        ],
        hints: ["Run 'spiderfoot example.com'", "Review Module Count and Entities Discovered."],
        xpReward: 150,
        isActive: true,
    },

    // =========================================
    // 30. HAVE I BEEN PWNED PRACTICE LAB
    // =========================================
    {
        title: "Credential Exposure & Breach Intelligence (Have I Been Pwned)",
        description: "Verify email and username involvement in public corporate data breaches.",
        tool: "Have I Been Pwned",
        category: "Threat Intelligence",
        difficulty: "Easy",
        target: "test@example.com",
        missionBrief: "Audit an email address against known corporate and platform security breaches.",
        requiredCommand: "hibp",
        objectives: [
            { question: "Execute Have I Been Pwned query on the target account.", type: "command", expectedField: "hibp", answer: "", completed: false },
            { question: "Confirm the target account email evaluated.", type: "answer", expectedField: "target", answer: "", completed: false },
            { question: "Identify the breach status of the account (e.g. clean or breached).", type: "answer", expectedField: "status", answer: "", completed: false },
            { question: "Identify whether the account is breached (true/false).", type: "answer", expectedField: "breached", answer: "", completed: false },
        ],
        hints: ["Run 'hibp test@example.com'", "Check Status and Breached in the output."],
        xpReward: 100,
        isActive: true,
    },

    // =========================================
    // 31. WAYBACK MACHINE PRACTICE LAB
    // =========================================
    {
        title: "Historical Web Archive Footprint (Wayback Machine)",
        description: "Inspect historical snapshots, legacy URLs, and deleted resources using CDX index.",
        tool: "Wayback Machine",
        category: "History & Archives",
        difficulty: "Easy",
        target: "example.com",
        missionBrief: "Search the Internet Archive CDX server to review historical website snapshots.",
        requiredCommand: "wayback",
        objectives: [
            { question: "Execute Wayback Machine search on the target domain.", type: "command", expectedField: "wayback", answer: "", completed: false },
            { question: "Confirm the target domain being investigated.", type: "answer", expectedField: "target", answer: "", completed: false },
            { question: "Identify the total number of archived snapshots recorded.", type: "answer", expectedField: "totalSnapshots", answer: "", completed: false },
            { question: "Identify the date or timestamp of the first recorded snapshot.", type: "answer", expectedField: "firstSnapshot", answer: "", completed: false },
        ],
        hints: ["Run 'wayback example.com'", "Check Discovered Snapshots and Earliest Snapshot."],
        xpReward: 100,
        isActive: true,
    },

    // =========================================
    // 32. GOOGLE SEARCH PRACTICE LAB
    // =========================================
    {
        title: "Search Engine Reconnaissance (Google)",
        description: "Query Google Custom Search index to discover exposed subdomains and links.",
        tool: "Google",
        category: "Search Investigation",
        difficulty: "Easy",
        target: "example.com",
        missionBrief: "Execute Google search intelligence queries to uncover web assets.",
        requiredCommand: "google",
        objectives: [
            { question: "Execute Google search for the target query.", type: "command", expectedField: "google", answer: "", completed: false },
            { question: "Confirm the search query string submitted.", type: "answer", expectedField: "query", answer: "", completed: false },
            { question: "Identify the top domain URL returned in the search results.", type: "answer", expectedField: "topDomain", answer: "", completed: false },
            { question: "Identify the total count of search result entries returned.", type: "answer", expectedField: "resultsCount", answer: "", completed: false },
        ],
        hints: ["Run 'google example.com'", "Review the search results output."],
        xpReward: 100,
        isActive: true,
    },

    // =========================================
    // 33. BING PRACTICE LAB
    // =========================================
    {
        title: "Alternative Search Index Exploration (Bing)",
        description: "Cross-reference target assets across Microsoft Bing's global web index.",
        tool: "Bing",
        category: "Search Investigation",
        difficulty: "Easy",
        target: "example.com",
        missionBrief: "Run Bing search to uncover assets indexed independently of other search engines.",
        requiredCommand: "bing",
        objectives: [
            { question: "Execute Bing search for the target domain.", type: "command", expectedField: "bing", answer: "", completed: false },
            { question: "Confirm the query string submitted to the search engine.", type: "answer", expectedField: "query", answer: "", completed: false },
            { question: "Identify the search engine name used for the investigation (e.g. Bing).", type: "answer", expectedField: "searchEngine", answer: "", completed: false },
            { question: "Identify the number of search results returned.", type: "answer", expectedField: "resultsCount", answer: "", completed: false },
        ],
        hints: ["Run 'bing example.com'", "Inspect the Bing Search Results list."],
        xpReward: 100,
        isActive: true,
    },

    // =========================================
    // 34. DUCKDUCKGO PRACTICE LAB
    // =========================================
    {
        title: "Privacy-Preserving Search Intelligence (DuckDuckGo)",
        description: "Query DuckDuckGo for instant answers and un-personalized search indexing.",
        tool: "DuckDuckGo",
        category: "Search Investigation",
        difficulty: "Easy",
        target: "example.com",
        missionBrief: "Search DuckDuckGo to obtain unbiased search intelligence and instant answers.",
        requiredCommand: "duckduckgo",
        objectives: [
            { question: "Execute DuckDuckGo search for the target domain.", type: "command", expectedField: "duckduckgo", answer: "", completed: false },
            { question: "Confirm the search query string.", type: "answer", expectedField: "query", answer: "", completed: false },
            { question: "Identify the search engine name (e.g. DuckDuckGo).", type: "answer", expectedField: "searchEngine", answer: "", completed: false },
            { question: "Identify the total count of result entries returned.", type: "answer", expectedField: "resultsCount", answer: "", completed: false },
        ],
        hints: ["Run 'duckduckgo example.com'", "Check the DuckDuckGo header and query results."],
        xpReward: 100,
        isActive: true,
    },

    // =========================================
    // 35. YANDEX PRACTICE LAB
    // =========================================
    {
        title: "International Web Search Discovery (Yandex)",
        description: "Query global and Eastern European web indexes using Yandex.",
        tool: "Yandex",
        category: "Search Investigation",
        difficulty: "Easy",
        target: "example.com",
        missionBrief: "Expand search intelligence across non-western indexes using the Yandex search engine.",
        requiredCommand: "yandex",
        objectives: [
            { question: "Execute Yandex search for the target query.", type: "command", expectedField: "yandex", answer: "", completed: false },
            { question: "Confirm the query string analyzed.", type: "answer", expectedField: "query", answer: "", completed: false },
            { question: "Identify the search engine name (e.g. Yandex).", type: "answer", expectedField: "searchEngine", answer: "", completed: false },
            { question: "Identify the count of search results returned.", type: "answer", expectedField: "resultsCount", answer: "", completed: false },
        ],
        hints: ["Run 'yandex example.com'", "Review the Yandex search results output."],
        xpReward: 100,
        isActive: true,
    },

    // =========================================
    // 36. BRAVE SEARCH PRACTICE LAB
    // =========================================
    {
        title: "Independent Web Index Reconnaissance (Brave Search)",
        description: "Search using Brave's independent web crawler and search index.",
        tool: "Brave Search",
        category: "Search Investigation",
        difficulty: "Easy",
        target: "example.com",
        missionBrief: "Perform independent search indexing queries to discover assets not dependent on Google or Bing indexes.",
        requiredCommand: "brave",
        objectives: [
            { question: "Execute Brave Search for the target query.", type: "command", expectedField: "brave", answer: "", completed: false },
            { question: "Confirm the search query string.", type: "answer", expectedField: "query", answer: "", completed: false },
            { question: "Identify the search engine name (e.g. Brave Search).", type: "answer", expectedField: "searchEngine", answer: "", completed: false },
            { question: "Identify the total count of result entries returned.", type: "answer", expectedField: "resultsCount", answer: "", completed: false },
        ],
        hints: ["Run 'brave example.com'", "Inspect the Brave Search results."],
        xpReward: 100,
        isActive: true,
    },

    // =========================================
    // 37. MOJEEK PRACTICE LAB
    // =========================================
    {
        title: "Crawler-Based Alternative Discovery (Mojeek)",
        description: "Query Mojeek's independent web crawler index for unbiased discovery.",
        tool: "Mojeek",
        category: "Search Investigation",
        difficulty: "Easy",
        target: "example.com",
        missionBrief: "Search across Mojeek's crawler-based index to locate independent links and cross-reference search coverage.",
        requiredCommand: "mojeek",
        objectives: [
            { question: "Execute Mojeek search for the target query.", type: "command", expectedField: "mojeek", answer: "", completed: false },
            { question: "Confirm the search query string.", type: "answer", expectedField: "query", answer: "", completed: false },
            { question: "Identify the search engine name (e.g. Mojeek).", type: "answer", expectedField: "searchEngine", answer: "", completed: false },
            { question: "Identify the total count of result entries returned.", type: "answer", expectedField: "resultsCount", answer: "", completed: false },
        ],
        hints: ["Run 'mojeek example.com'", "Inspect the Mojeek results."],
        xpReward: 100,
        isActive: true,
    },

    // =========================================
    // 38. GOOGLE DORKING PRACTICE LAB
    // =========================================
    {
        title: "Advanced Search Operators & Dorking (Google Dorking)",
        description: "Execute Google search operators (site:, inurl:, filetype:) to find exposed assets.",
        tool: "Google Dorking",
        category: "Search Investigation",
        difficulty: "Medium",
        target: "site:example.com",
        missionBrief: "Leverage advanced Google Dorking operators to isolate specific subpaths, exposed configurations, and login panels.",
        requiredCommand: "dork",
        objectives: [
            { question: "Execute the Google Dorking command on the target dork query.", type: "command", expectedField: "dork", answer: "", completed: false },
            { question: "Identify the dork operator utilized (e.g. site:).", type: "answer", expectedField: "operator", answer: "", completed: false },
            { question: "Confirm the full dork query string (e.g. site:example.com).", type: "answer", expectedField: "dorkQuery", answer: "", completed: false },
            { question: "Identify one exposed asset URL or query target discovered by the dork.", type: "answer", expectedField: "matches", answer: "", completed: false },
        ],
        hints: ["Execute 'dork site:example.com'", "Check Identified Operator and Target Parameter in the output."],
        xpReward: 120,
        isActive: true,
    },

    // =========================================
    // 39. GOOGLE LENS PRACTICE LAB
    // =========================================
    {
        title: "Visual Reverse Image Intelligence (Google Lens)",
        description: "Perform reverse image search and visual asset analysis with Google Lens.",
        tool: "Google Lens",
        category: "Search Investigation",
        difficulty: "Easy",
        target: "https://httpbin.org/image/jpeg",
        missionBrief: "Analyze an image asset URL to detect visual entities, image mime type, and payload hash.",
        requiredCommand: "lens",
        objectives: [
            { question: "Execute Google Lens on the target image URL.", type: "command", expectedField: "lens", answer: "", completed: false },
            { question: "Confirm the target image URL analyzed.", type: "answer", expectedField: "target", answer: "", completed: false },
            { question: "Identify the detected image format (e.g. image/jpeg or image/png).", type: "answer", expectedField: "imageType", answer: "", completed: false },
            { question: "Identify one visual entity or category recognized in the image.", type: "answer", expectedField: "entities", answer: "", completed: false },
        ],
        hints: ["Run 'lens https://httpbin.org/image/jpeg'", "Review Target Image, Content-Type, and Visual Entities."],
        xpReward: 100,
        isActive: true,
    },
];

const seedLabs = async () => {
    try {
        await connectDB();

        const toolNames = allLabs.map(l => l.tool);

        // Remove previous versions of these labs to guarantee idempotency without duplicates
        await Lab.deleteMany({
            tool: {
                $in: toolNames,
            },
        });

        const createdLabs = await Lab.insertMany(allLabs);

        console.log("=================================");
        console.log("Practice Labs Created Successfully");
        console.log("=================================");

        createdLabs.forEach((lab, i) => {
            console.log(`[${i + 1}] ${lab.title} | Tool: ${lab.tool} | Target: ${lab.target} | Objectives: ${lab.objectives.length}`);
        });

        console.log("=================================");
        console.log(`Total Seeded Labs: ${createdLabs.length}`);
        console.log("=================================");

        process.exit(0);
    } catch (error) {
        console.error("Failed to seed labs:", error);
        process.exit(1);
    }
};

seedLabs();
